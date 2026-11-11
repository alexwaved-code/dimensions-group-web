import { site } from "@/lib/site";

export type EnquiryPayload = { subject: string; email?: string } & Record<string, string | undefined>;

export async function sendEnquiry(payload: EnquiryPayload): Promise<boolean> {
  const fields = { from_name: "Dimensions Group Website", ...payload };
  if (!site.web3formsKey) {
    const body = Object.entries(fields)
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n");
    window.location.href = `mailto:${site.contact.email}?subject=${encodeURIComponent(payload.subject)}&body=${encodeURIComponent(body)}`;
    return true;
  }
  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ access_key: site.web3formsKey, ...fields, replyto: payload.email || undefined }),
    });
    const json = await res.json();
    return Boolean(json.success);
  } catch {
    return false;
  }
}
