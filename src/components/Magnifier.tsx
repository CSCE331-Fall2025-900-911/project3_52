// components/Magnifier.tsx
"use client";

import { ReactNode } from "react";
import { useMagnifier, MagnifierOptions } from "../hooks/useMagnifier";

type Props = {
  children: ReactNode;
  options?: MagnifierOptions;
};

export const Magnifier = ({ children, options }: Props) => {
  const { lensRef, rootRef, enabled } = useMagnifier(options);
  const { zoom = 2.5, size = 180 } = options ?? {};
  const currentElement = rootRef.current as HTMLDivElement | null;

  return (
    <>
      <div ref={rootRef as React.Ref<HTMLDivElement>} className="relative">
        {children}
      </div>

      {enabled && (
        <div
          ref={lensRef}
          className={`fixed pointer-events-none rounded-full border-4 border-white shadow-2xl ${options?.className ?? ""}`}
          style={{
            width: size,
            height: size,
            backgroundImage: currentElement
              ? `url(${getSnapshot(currentElement)})`
              : "none",
            backgroundSize: `${(currentElement?.offsetWidth ?? 0) * zoom}px ${
              (currentElement?.offsetHeight ?? 0) * zoom
            }px`,
            backgroundRepeat: "no-repeat",
            zIndex: 9999,
            boxShadow:
              "inset 0 0 20px rgba(0,0,0,0.3), 0 0 30px rgba(0,0,0,0.4)",
          }}
        />
      )}
    </>
  );
};

function getSnapshot(el: HTMLElement): string {
  // Lazy load to reduce bundle size
  const html2canvas = require("html2canvas");
  const canvas = html2canvas(el, { scale: window.devicePixelRatio });
  return (canvas as HTMLCanvasElement).toDataURL();
}