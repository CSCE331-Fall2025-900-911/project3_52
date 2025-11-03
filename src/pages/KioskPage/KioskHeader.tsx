import { useTranslation, T } from "../../contexts/LangContext";
export default function KioskHeader({ isHighContrast, setIsHighContrast }: { isHighContrast: boolean; setIsHighContrast: (v: boolean) => void; }) {
  const { lang, setLang } = useTranslation();
  return (
    <div className="mb-4 flex justify-between items-center">
      <div>
        <h1 className="text-4xl font-bold dark:text-white"><T>Welcome to MomTea</T></h1>
        <p className="text-lg text-gray-600 dark:text-gray-300"><T>Tap an item to start your order.</T></p>
      </div>
      <div className="flex gap-2">
        <button onClick={() => setLang(lang === "en" ? "es" : "en")} className="p-3 bg-white dark:bg-gray-700 dark:text-white rounded-lg shadow">
          {lang === "en" ? "Español" : "English"}
        </button>
        <button onClick={() => setIsHighContrast(!isHighContrast)} className="p-3 bg-white dark:bg-gray-700 dark:text-white rounded-lg shadow">
          {isHighContrast ? "Standard Contrast" : "High Contrast"}
        </button>
      </div>
    </div>
  );
}