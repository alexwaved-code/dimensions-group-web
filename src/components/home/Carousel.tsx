"use client";

import { useRef } from "react";

export function Carousel({ children, label }: { children: React.ReactNode; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => {
    const el = ref.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };
  return (
    <div className="relative">
      <div
        ref={ref}
        aria-label={label}
        className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-5 pb-6 md:px-[max(2rem,calc((100vw-1180px)/2+2rem))]"
      >
        {children}
      </div>
      <div className="mx-auto flex max-w-[1180px] justify-end gap-3 px-5 md:px-8">
        {([-1, 1] as const).map((dir) => (
          <button
            key={dir}
            type="button"
            onClick={() => scroll(dir)}
            aria-label={dir === -1 ? "Previous" : "Next"}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-black/[0.06] text-ink transition hover:bg-black/10"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d={dir === -1 ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}
