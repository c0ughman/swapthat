"use client";

interface MarqueeProps {
  items: string[];
  separator?: string;
  className?: string;
  speed?: number;
}

export default function Marquee({
  items,
  separator = "✦",
  className = "",
  speed = 30,
}: MarqueeProps) {
  const content = items.join(` ${separator} `) + ` ${separator} `;

  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <div
        className="inline-block animate-marquee"
        style={{ animationDuration: `${speed}s` }}
      >
        <span className="inline-block pr-8">{content}</span>
        <span className="inline-block pr-8">{content}</span>
      </div>
    </div>
  );
}
