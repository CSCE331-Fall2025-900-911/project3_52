import { useTranslation, T } from "../../contexts/LangContext";
import { Lang } from "../../types/models";

export default function KioskHeader({
  isHighContrast,
  setIsHighContrast,
}: {
  isHighContrast: boolean;
  setIsHighContrast: (v: boolean) => void;
}) {
  const { lang, setLang } = useTranslation();
  return (
    <div className="mb-4 flex justify-between items-center">
      <div>
        <h1 className="text-4xl font-bold dark:text-white">
          <T>Welcome to MomTea</T>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          <T>Tap an item to start your order.</T>
        </p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setIsHighContrast(!isHighContrast)}
          className="min-w-[10rem] p-3 bg-white dark:bg-gray-700 dark:text-white rounded-lg shadow"
        >
          {isHighContrast ? "Standard Contrast" : "High Contrast"}
        </button>

        <select
          value={lang}
          onChange={(e) => setLang(e.target.value as Lang)}
          className="p-2 bg-white dark:bg-gray-700 dark:text-white rounded-lg shadow cursor-pointer"
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
        </select>
      </div>
    </div>
  );
}
