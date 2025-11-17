// hooks/useMagnifier.ts
import { useEffect, useRef, useState } from "react";
import { useMagnifierControl } from "../contexts/MagnifierContext";

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
  const { isMagnifierEnabled } = useMagnifierControl();
  const [isActive, setIsActive] = useState(false);
  const lensRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLElement>(null);

  const zoomRef = useRef(zoom);
  const sizeRef = useRef(size);
  let animationFrame: number = 0;

  useEffect(() => {
    zoomRef.current = zoom;
    sizeRef.current = size;
  }, [zoom, size]);

  // Shared move logic
  const move = (e: MouseEvent | PointerEvent) => {
    if (!lensRef.current || !rootRef.current || !isActive) return;

    const lens = lensRef.current;
    const root = rootRef.current;
    const currentZoom = zoomRef.current;
    const currentSize = sizeRef.current;

    lens.style.left = `${e.pageX - currentSize / 2}px`;
    lens.style.top = `${e.pageY - currentSize / 2}px`;

    const rect = root.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;

    const bgX = -(relX * currentZoom - currentSize / 2);
    const bgY = -(relY * currentZoom - currentSize / 2);

    lens.style.backgroundPosition = `${bgX}px ${bgY}px`;
  };

  const handleMove = (e: MouseEvent | PointerEvent) => {
    cancelAnimationFrame(animationFrame);
    animationFrame = requestAnimationFrame(() => move(e));
  };

  useEffect(() => {
    if (!isMagnifierEnabled) {
      setIsActive(false);
      return;
    }

    if (!lensRef.current || !rootRef.current) return;

    const root = rootRef.current;

    // BETTER DETECTION: Use `pointer: fine` instead of `hover`
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;

    // HOVER MODE (Desktop with mouse)
    if (hasFinePointer) {
      const startHover = () => setIsActive(true);
      const stopHover = () => setIsActive(false);

      root.addEventListener("mouseenter", startHover);
      root.addEventListener("mousemove", handleMove);
      root.addEventListener("mouseleave", stopHover);

      return () => {
        cancelAnimationFrame(animationFrame);
        root.removeEventListener("mouseenter", startHover);
        root.removeEventListener("mousemove", handleMove);
        root.removeEventListener("mouseleave", stopHover);
      };
    }

    // PRESS-AND-HOLD MODE (Touch or coarse pointer)
    const startPress = () => setIsActive(true);
    const stopPress = () => setIsActive(false);

    // FIX: Attach to root, not document
    root.addEventListener("pointerdown", startPress);
    root.addEventListener("pointerup", stopPress);
    root.addEventListener("pointerleave", stopPress);
    root.addEventListener("pointermove", handleMove);

    return () => {
      cancelAnimationFrame(animationFrame);
      root.removeEventListener("pointerdown", startPress);
      root.removeEventListener("pointerup", stopPress);
      root.removeEventListener("pointerleave", stopPress);
      root.removeEventListener("pointermove", handleMove);
    };
  }, [isMagnifierEnabled]);

  return {
    lensRef,
    rootRef,
    enabled: isActive && isMagnifierEnabled,
  };
};