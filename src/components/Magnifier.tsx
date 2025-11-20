// components/Magnifier.tsx
"use client";

import { ReactNode, useState, useEffect } from "react";
import { useMagnifier, MagnifierOptions } from "../hooks/useMagnifier";
import html2canvas from "html2canvas";

type Props = {
  children: ReactNode;
  options?: MagnifierOptions;
};

export const Magnifier = ({ children, options }: Props) => {
  const { lensRef, rootRef, enabled } = useMagnifier(options ?? {});
  const [snapshot, setSnapshot] = useState<string>("");
  const { zoom = 2.5, size = 180 } = options ?? {};

  useEffect(() => {
    if (!enabled || !rootRef.current) {
        setSnapshot("");
        return;
    }

    let cancelled = false;
    html2canvas(rootRef.current!, {
        scale: window.devicePixelRatio,
        useCORS: true,           // Allows cross-origin images
        allowTaint: true,        // Fallback if CORS fails
        logging: false,
    }).then((canvas) => {
        if (!cancelled) setSnapshot(canvas.toDataURL());
    }).catch(() => {
        if (!cancelled) setSnapshot("");
    });

    return () => { cancelled = true; };
  }, [enabled, rootRef]);

  return (
    <>
      <div ref={rootRef as React.Ref<HTMLDivElement>} className="relative">
        {children}
      </div>

      {enabled && (
        <div
          ref={lensRef}
          className={`fixed pointer-events-none rounded-full border-4 border-white shadow-2xl will-change-transform ${options?.className ?? ""}`}
          style={{
            width: size,
            height: size,
            backgroundImage: snapshot ? `url(${snapshot})` : "none",
            backgroundSize: `${
              (rootRef.current?.offsetWidth ?? 0) * zoom
            }px ${(rootRef.current?.offsetHeight ?? 0) * zoom}px`,
            backgroundRepeat: "no-repeat",
            zIndex: 9999,
            transform: "translateZ(0)",
            boxShadow:
              "inset 0 0 20px rgba(0,0,0,0.3), 0 0 30px rgba(0,0,0,0.4)",
          }}
        />
      )}
    </>
  );
};