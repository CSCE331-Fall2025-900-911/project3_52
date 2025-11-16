// components/MagnifierToggle.tsx
"use client";

import { useState } from "react";

export const MagnifierToggle = () => {
  const [active, setActive] = useState(false);

  return (
    <button
      onClick={() => setActive((v) => !v)}
      className={`fixed bottom-6 right-6 p-4 rounded-full shadow-lg transition-all z-50 ${
        active ? "bg-blue-600 text-white scale-110" : "bg-gray-200 text-gray-700"
      }`}
      title="Toggle Magnifier Tool"
    >
      {active ? "Zoom Out" : "Magnifying Glass"}
    </button>
  );
};