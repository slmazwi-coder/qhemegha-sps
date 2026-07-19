export function Ribbon({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex justify-center py-2 ${className || ""}`}>
      <span className="ribbon-banner">{children}</span>
    </div>
  );
}
