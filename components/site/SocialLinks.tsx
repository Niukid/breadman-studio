import { Instagram, Linkedin } from "lucide-react";
import { SiBehance } from "react-icons/si";

const LINKS = [
  { key: "instagram", label: "Instagram", href: "#", Icon: Instagram },
  { key: "linkedin", label: "LinkedIn", href: "#", Icon: Linkedin },
  { key: "behance", label: "Behance", href: "#", Icon: SiBehance },
];

export default function SocialLinks({
  color,
  size = 18,
  className,
}: {
  color: string;
  size?: number;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-4 ${className || ""}`}>
      {LINKS.map(({ key, label, href, Icon }) => (
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="flex items-center opacity-80 hover:opacity-100 transition-opacity"
          style={{ color, transition: "opacity 250ms ease" }}
        >
          <Icon size={size} />
        </a>
      ))}
    </div>
  );
}
