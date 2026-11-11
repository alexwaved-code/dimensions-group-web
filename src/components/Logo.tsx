import clsx from "clsx";

const FRONT = "M10 12 V48 H22 A18 18 0 0 0 22 12 Z";

type Props = {
  tone?: "dark" | "light";
  withWordmark?: boolean;
  animated?: boolean;
  className?: string;
};

export function LogoMark({ tone = "dark", animated = true, className }: Omit<Props, "withWordmark">) {
  const stroke = tone === "dark" ? "#1d1d1f" : "#f5f5f7";
  return (
    <svg
      viewBox="4 2 46 50"
      className={clsx("logo-mark", className)}
      fill="none"
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <g className={animated ? "logo-depth" : undefined} opacity={animated ? undefined : 0.45} stroke={stroke} strokeWidth={0.9}>
        <path d="M17 5 V41 H29 A18 18 0 0 0 29 5" />
        <path d="M10 12 L17 5 M22 12 L29 5 M10 48 L17 41" />
      </g>
      <path
        d={FRONT}
        pathLength={100}
        stroke={stroke}
        strokeWidth={3}
        className={animated ? "logo-front" : undefined}
      />
      <path d={FRONT} pathLength={100} stroke="#c9a96e" strokeWidth={3} className="logo-pulse" />
    </svg>
  );
}

export function Logo({ tone = "dark", withWordmark = true, animated = true, className }: Props) {
  return (
    <span className={clsx("logo inline-flex items-center gap-3", className)}>
      <LogoMark tone={tone} animated={animated} className="h-8 w-8 shrink-0" />
      {withWordmark && (
        <span className="flex flex-col leading-none">
          <span
            className={clsx(
              "text-[13px] font-medium tracking-[0.28em]",
              animated && "logo-word",
              tone === "dark" ? "text-ink" : "text-[#f5f5f7]",
            )}
          >
            DIMENSIONS
          </span>
          <span
            className={clsx(
              "mt-1 text-[8.5px] tracking-[0.34em]",
              animated && "logo-word",
              tone === "dark" ? "text-mute" : "text-gold-soft",
            )}
          >
            GROUP CO. LIMITED
          </span>
        </span>
      )}
    </span>
  );
}
