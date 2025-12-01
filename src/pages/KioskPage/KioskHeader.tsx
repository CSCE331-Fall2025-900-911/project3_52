// components/KioskHeader.tsx
import { useTranslation, T } from "../../contexts/LangContext";
import { Lang } from "../../types/models";
import { useMagnifierControl } from "../../contexts/MagnifierContext";

export default function KioskHeader({
  isHighContrast,
  setIsHighContrast,
}: {
  isHighContrast: boolean;
  setIsHighContrast: (v: boolean) => void;
}) {
  const { lang, setLang } = useTranslation();
  const { isMagnifierEnabled, toggleMagnifier } = useMagnifierControl();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-2">
      <div className="flex-1 text-left">
        <h1 className="text-2xl sm:text-3xl font-bold magnifier:text-5xl lg:magnifier:text-6xl dark:text-white leading-tight magnifier:leading-snug">
          <T>Welcome to MomTea</T>
        </h1>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mt-1 magnifier:text-3xl lg:magnifier:text-4xl magnifier:mt-4">
          <T>Tap an item to start your order</T>
        </p>
      </div>

      <div className="flex w-full sm:w-auto gap-2 magnifier:gap-6">
        <button
          type="button"
          onClick={toggleMagnifier}
          aria-pressed={isMagnifierEnabled}
          className={`w-1/2 sm:w-auto min-w-[10rem] p-3 dark:text-white rounded-lg shadow text-base sm:text-lg ${
            isMagnifierEnabled
              ? "bg-slate-400 text-white"
              : "bg-white dark:bg-gray-700 dark:text-white"
          }`}
          title={isMagnifierEnabled ? "Disable Magnifier" : "Enable Magnifier"}
        >
          {isMagnifierEnabled ? (
            <span aria-hidden="true">Zoom Out</span>
          ) : (
            <span aria-hidden="true">Zoom In</span>
          )}
          <span className="sr-only">
            {isMagnifierEnabled ? "Magnifier On" : "Magnifier Off"}
          </span>
        </button>

        <button
          onClick={() => setIsHighContrast(!isHighContrast)}
          className={`w-1/2 sm:w-auto min-w-[10rem] p-3 dark:text-white rounded-lg shadow text-base sm:text-lg ${
            isHighContrast
              ? "bg-slate-400 text-white"
              : "bg-white dark:bg-gray-700 dark:text-white"
          }`}
        >
          <T>{isHighContrast ? "Standard Contrast" : "High Contrast"}</T>
        </button>

        <select
          title="Select Language"
          aria-label="Select Language"
          value={lang}
          onChange={(e) => setLang(e.target.value as Lang)}
          className="w-1/2 sm:w-auto p-3 bg-white dark:bg-gray-700 magnifier:text-4xl dark:text-white rounded-lg shadow cursor-pointer text-base sm:text-lg"
        >
          <option value="en">English</option>
          <option value="zh-CN">中文（简体）</option>
          <option value="zh-TW">中文（繁體）</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
          <option value="ko">한국어</option>
          <option value="de">Deutsch</option>
          <option value="ja">日本語</option>
          <option value="it">Italiano</option>
          <option value="ru">Русский</option>
          <option value="pt">Português</option>
          <option value="ar">العربية</option>
          <option value="hi">हिन्दी</option>
          <option value="cs">Čeština</option>
          <option value="tr">Türkçe</option>
        </select>
      </div>

      <div aria-live="polite" className="sr-only">
        {isMagnifierEnabled ? "Magnifier enabled" : "Magnifier disabled"}
      </div>
    </div>
  );
}
