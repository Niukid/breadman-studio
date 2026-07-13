"use client";

import useHover from "./useHover";

export default function CaseLinkButton({
  href,
  onClick,
  variant,
  className,
  children,
}: {
  href?: string;
  onClick?: () => void;
  variant: "desktop" | "mobile";
  className?: string;
  children: React.ReactNode;
}) {
  const { hovered, handlers } = useHover();

  const style: React.CSSProperties =
    variant === "desktop"
      ? {
          fontSize: 13,
          color: hovered ? "#101010" : "#C9D6DE",
          border: "1px solid rgba(201,214,222,.7)",
          background: hovered ? "#C9D6DE" : "none",
          padding: "15px 32px",
          transition: "background 250ms ease, color 250ms ease",
        }
      : {
          fontSize: 11,
          color: "#899EAA",
          border: "1px solid #5F7884",
          background: "none",
          padding: "10px 22px",
          transition: "background 250ms ease, color 250ms ease",
        };

  const radius = variant === "desktop" ? "rounded-full" : "rounded-[9px]";
  const cls = `inline-flex items-center gap-2.5 font-bold cursor-pointer ${radius} ${className || ""}`;

  if (onClick) {
    return (
      <button type="button" onClick={onClick} {...handlers} className={cls} style={style}>
        {children}
      </button>
    );
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...handlers} className={cls} style={style}>
      {children}
    </a>
  );
}
