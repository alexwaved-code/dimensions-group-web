import clsx from "clsx";
import Image from "next/image";

export function ProductShot({
  src,
  alt,
  sizes,
  priority = false,
  pad = "p-6",
  bg = "bg-white",
  className,
}: {
  src: string;
  alt: string;
  category?: string;
  sizes: string;
  priority?: boolean;
  pad?: string;
  bg?: string;
  className?: string;
}) {
  return (
    <div className={clsx("relative h-full w-full overflow-hidden", bg, className)}>
      <Image src={src} alt={alt} fill priority={priority} sizes={sizes} className={clsx("object-contain", pad)} />
    </div>
  );
}
