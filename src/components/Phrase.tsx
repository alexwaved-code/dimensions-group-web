export function Phrase({ children }: { children: string }) {
  const parts = children.split(/(?<=[，、：；])/);
  if (parts.length < 2) return <>{children}</>;
  return (
    <>
      {parts.map((part, i) => (
        <span key={i} className="inline-block">
          {part}
        </span>
      ))}
    </>
  );
}
