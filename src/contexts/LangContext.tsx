import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";
import { apiFetch } from "../api/http";
import { Lang } from "../types/models";

interface ILangContext {
  lang: Lang;
  setLang: (l: Lang) => void;
  translate: (t: string) => Promise<string>;
}

const LangContext = createContext<ILangContext | null>(null);

const translateText = async (text: string, target: Lang): Promise<string> => {
  if (target === "en") return text;
  try {
    const res = await apiFetch("/api/translate", {
      method: "POST",
      body: JSON.stringify({ text, target_language: target }),
    });
    if (!res.ok) {
      // ADD THIS:
      console.error("Translation API call failed:", res.status, res.statusText);
      return text;
    }
    const data = await res.json();
    return data.translated_text;
  } catch {
    return text;
  }
};

export const LanguageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [lang, setLang] = useState<Lang>("en");
  const cache = useMemo(() => new Map<string, string>(), []);

  const translate = useCallback(
    async (text: string) => {
      if (lang === "en") return text;
      const key = `${lang}:${text}`;
      if (cache.has(key)) return cache.get(key)!;
      const t = await translateText(text, lang);
      cache.set(key, t);
      return t;
    },
    [lang, cache]
  );

  return (
    <LangContext.Provider value={{ lang, setLang, translate }}>
      {children}
    </LangContext.Provider>
  );
};

export const useTranslation = () => {
  const ctx = useContext(LangContext);
  if (!ctx)
    throw new Error("useTranslation must be used within LanguageProvider");
  return ctx;
};

export const T = ({ children }: { children: string }) => {
  const { translate } = useTranslation();
  const [text, setText] = useState(children);
  useEffect(() => {
    translate(children).then(setText);
  }, [children, translate]);
  return <>{text}</>;
};
