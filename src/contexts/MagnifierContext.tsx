// contexts/MagnifierContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type MagnifierContextType = {
  isMagnifierEnabled: boolean;
  toggleMagnifier: () => void;
};

const MagnifierContext = createContext<MagnifierContextType | undefined>(undefined);

export function MagnifierProvider({ children }: { children: ReactNode }) {
  const [isMagnifierEnabled, setIsMagnifierEnabled] = useState(() => {
    return localStorage.getItem("kiosk.magnifier") === "true";
  });

  const toggleMagnifier = () => {
    setIsMagnifierEnabled((prev) => {
      const newValue = !prev;
      localStorage.setItem("kiosk.magnifier", newValue.toString());
      return newValue;
    });
  };

  return (
    <MagnifierContext.Provider value={{ isMagnifierEnabled, toggleMagnifier }}>
      {/* Apply magnifier class ONLY to children (i.e. KioskPage) */}
      <div className={isMagnifierEnabled ? "magnifier" : ""}>
        {children}
      </div>
    </MagnifierContext.Provider>
  );
}

export function useMagnifierControl() {
  const context = useContext(MagnifierContext);
  if (!context) {
    throw new Error("useMagnifierControl must be used within MagnifierProvider");
  }
  return context;
}