import Link from "next/link";
import { LogoMark } from "@/components/Logo";

export default function NotFound() {
  return (
    <section className="flex min-h-[80vh] flex-col items-center justify-center bg-mist px-5 pt-20 text-center">
      <div className="logo">
        <LogoMark className="h-14 w-14" />
      </div>
      <h1 className="headline mt-8 text-[40px] md:text-[64px]">
        Page not found. <span className="text-gradient-gold">找不到頁面。</span>
      </h1>
      <p className="mt-4 text-[16px] text-ink-soft">The page you are looking for has moved or no longer exists.</p>
      <div className="mt-8 flex gap-4">
        <Link href="/en/products" className="rounded-full bg-ink px-6 py-2.5 text-[14px] font-medium text-white">
          Browse products
        </Link>
        <Link href="/zh/products" className="rounded-full border border-line px-6 py-2.5 text-[14px] font-medium text-ink">
          瀏覽產品
        </Link>
      </div>
    </section>
  );
}
