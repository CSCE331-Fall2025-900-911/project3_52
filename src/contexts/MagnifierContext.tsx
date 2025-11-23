// contexts/MagnifierContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type MagnifierContextType = {
  isMagnifierEnabled: boolean;
  toggleMagnifier: () => void;
};

const MagnifierContext = createContext<MagnifierContextType | undefined>(undefined);

export function MagnifierProvider({ children }: { children: ReactNode }) {
  const [isMagnifierEnabled, setIsMagnifierEnabled] = useState(false);

  // Sync with localStorage on mount AND keep it updated
  useEffect(() => {
    const saved = localStorage.getItem("kiosk.magnifier");
    const enabled = saved === "true";
    setIsMagnifierEnabled(enabled);

    // Optionally: dispatch a custom event so external scripts can react
    window.dispatchEvent(new Event("magnifier-toggle"));
  }, []);

  // Keep localStorage in sync whenever state changes
  useEffect(() => {
    localStorage.setItem("kiosk.magnifier", isMagnifierEnabled.toString());
    
    // This is crucial: notify any external magnifier scripts
    window.dispatchEvent(new CustomEvent("magnifier-change", { 
      detail: { enabled: isMagnifierEnabled } 
    }));
  }, [isMagnifierEnabled]);

  const toggleMagnifier = () => {
    setIsMagnifierEnabled(prev => !prev);
  };

  return (
    <MagnifierContext.Provider value={{ isMagnifierEnabled, toggleMagnifier }}>
      {/* Apply class to trigger CSS-based magnifiers */}
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