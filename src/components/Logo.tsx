export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display font-black tracking-tight ${className}`}>
      R<span className="text-primary">AI</span>OX
    </span>
  );
}
