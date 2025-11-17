// src/contexts/MagnifierContext.tsx
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

type MagnifierContextType = {
  isMagnifierEnabled: boolean;
  toggleMagnifier: () => void;
};

const MagnifierContext = createContext<MagnifierContextType | undefined>(
  undefined
);

export const MagnifierProvider = ({ children }: { children: ReactNode }) => {
  const [isMagnifierEnabled, setIsMagnifierEnabled] = useState(() => {
    const saved = localStorage.getItem("kiosk.magnifierEnabled");
    return saved === "true";
  });

  useEffect(() => {
    localStorage.setItem("kiosk.magnifierEnabled", isMagnifierEnabled.toString());
  }, [isMagnifierEnabled]);

  const toggleMagnifier = () => {
    setIsMagnifierEnabled((prev) => !prev);
  };

  return (
    <MagnifierContext.Provider value={{ isMagnifierEnabled, toggleMagnifier }}>
      {children}
    </MagnifierContext.Provider>
  );
};

export const useMagnifierControl = (): MagnifierContextType => {
  const context = useContext(MagnifierContext);
  if (!context) {
    throw new Error("useMagnifierControl must be used within a MagnifierProvider");
  }
  return context;
};