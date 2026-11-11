import { runAgent, type AgentEvent, type BasketLine, type ChatTurn } from "@/lib/agent/harness";
import { hasLocale } from "@/lib/i18n";

const MAX_TURNS = 12;
const MAX_CHARS = 1200;
const WINDOW_MS = 10 * 60_000;
const MAX_PER_WINDOW = 30;
const hits = new Map<string, number[]>();

function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

function clean(body: unknown) {
  const b = (body ?? {}) as Record<string, unknown>;
  const history: ChatTurn[] = (Array.isArray(b.messages) ? b.messages : [])
    .filter((m): m is ChatTurn => !!m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim() !== "")
    .slice(-MAX_TURNS)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));
  const basket: BasketLine[] = (Array.isArray(b.basket) ? b.basket : []).slice(0, 30).map((l: Record<string, unknown>) => ({
    name: String(l?.name ?? "").slice(0, 80),
    finish: String(l?.finish ?? "").slice(0, 40),
    quantity: Number(l?.quantity) || 0,
  }));
  const lang = typeof b.lang === "string" && hasLocale(b.lang) ? b.lang : "en";
  const page = typeof b.page === "string" ? b.page.slice(0, 120) : "/";
  return { history, basket, lang, page };
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  if (limited(ip)) return Response.json({ error: "Too many messages. Please try again in a few minutes." }, { status: 429 });

  let input: ReturnType<typeof clean>;
  try {
    input = clean(await request.json());
  } catch {
    return Response.json({ error: "Bad request" }, { status: 400 });
  }
  if (input.history.at(-1)?.role !== "user") return Response.json({ error: "The last message must be from the user." }, { status: 400 });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const emit = (event: AgentEvent) => controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
      try {
        await runAgent(input, emit, request.signal);
      } catch {
        emit({ type: "error", message: input.lang === "zh" ? "發生錯誤，請稍後再試。" : "Something went wrong. Please try again." });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/event-stream; charset=utf-8", "Cache-Control": "no-cache, no-transform", Connection: "keep-alive" },
  });
}
