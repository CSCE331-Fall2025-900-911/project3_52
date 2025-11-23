// contexts/MagnifierContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type MagnifierContextType = {
  isMagnifierEnabled: boolean;
  toggleMagnifier: () => void;
};

const MagnifierContext = createContext<MagnifierContextType | undefined>(
  undefined
);

export function MagnifierProvider({ children }: { children: ReactNode }) {
  const [isMagnifierEnabled, setIsMagnifierEnabled] = useState(() => {
    // Persist across sessions
    return localStorage.getItem("kiosk.magnifier") === "true";
  });

  useEffect(() => {
    localStorage.setItem("kiosk.magnifier", isMagnifierEnabled.toString());
    
    // Apply class to <html> for global control (just like dark mode)
    if (isMagnifierEnabled) {
      document.documentElement.classList.add("magnifier");
    } else {
      document.documentElement.classList.remove("magnifier");
    }
  }, [isMagnifierEnabled]);

  const toggleMagnifier = () => {
    setIsMagnifierEnabled((prev) => !prev);
  };

  return (
    <MagnifierContext.Provider value={{ isMagnifierEnabled, toggleMagnifier }}>
      {children}
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