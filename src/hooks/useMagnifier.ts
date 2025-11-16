// hooks/useMagnifier.ts
import { useEffect, useRef, useState } from "react";

export type MagnifierOptions = {
  zoom?: number;
  size?: number;
  className?: string;
};

export const useMagnifier = ({
  zoom = 2.5,
  size = 180,
  className,
}: MagnifierOptions = {}) => {
  const [enabled, setEnabled] = useState(false);
  const lensRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const lens = lensRef.current!;
    const root = rootRef.current!;

    const move = (e: MouseEvent) => {
      const { left, top } = root.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;

      lens.style.left = `${e.clientX - size / 2}px`;
      lens.style.top = `${e.clientY - size / 2}px`;

      const bgX = -(x * zoom - size / 2);
      const bgY = -(y * zoom - size / 2);
      lens.style.backgroundPosition = `${bgX}px ${bgY}px`;
    };

    const enable = () => setEnabled(true);
    const disable = () => setEnabled(false);

    document.addEventListener("mousemove", move);
    document.addEventListener("mousedown", enable);
    document.addEventListener("mouseup", disable);
    document.addEventListener("mouseleave", disable);

    return () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mousedown", enable);
      document.removeEventListener("mouseup", disable);
      document.removeEventListener("mouseleave", disable);
    };
  }, [enabled, zoom, size]);

  return { lensRef, rootRef, enabled };
};