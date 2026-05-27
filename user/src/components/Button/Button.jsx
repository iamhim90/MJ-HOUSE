const variants = {
  gold:
    "border-[#d8b773] bg-[#d8b773] text-[#2b2116] shadow-[0_18px_50px_rgba(216,183,115,0.18)] hover:bg-[#e0c27f] hover:border-[#e0c27f]",
  outline:
    "border-white/25 bg-black/20 text-[#f6f1e8] hover:border-[#d8b773]/70 hover:bg-[#d8b773]/10",
};

export default function Button({
  as: Component = "a",
  children,
  className = "",
  icon: Icon,
  variant = "gold",
  ...props
}) {
  return (
    <Component
      className={[
        "inline-flex h-[58px] min-w-[244px] items-center justify-center gap-3 rounded-[4px] border px-8 text-[14px] font-bold uppercase tracking-[0.18em] transition duration-300",
        variants[variant] ?? variants.gold,
        className,
      ].join(" ")}
      {...props}
    >
      {Icon ? <Icon aria-hidden="true" className="h-[17px] w-[17px]" strokeWidth={2.2} /> : null}
      <span>{children}</span>
    </Component>
  );
}
