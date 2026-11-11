"use client";

export function PrintButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="no-print rounded-full bg-ink px-6 py-2.5 text-[13px] font-medium text-white transition hover:bg-black"
    >
      {label}
    </button>
  );
}
