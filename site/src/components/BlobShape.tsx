"use client";

interface BlobShapeProps {
  color?: string;
  size?: number;
  className?: string;
  opacity?: number;
  blur?: boolean;
}

export default function BlobShape({
  color = "var(--blue)",
  size = 200,
  className = "",
  opacity = 0.15,
  blur = true,
}: BlobShapeProps) {
  return (
    <div
      className={`absolute rounded-full ${blur ? "blur-2xl" : ""} ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        opacity,
        contain: "strict",
      }}
    />
  );
}
