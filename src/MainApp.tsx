import HomePage from "./pages/HomePage";
import KioskPage from "./pages/KioskPage/KioskPage";
import CashierPage from "./pages/CashierPage/CashierPage";
import ManagerPage from "./pages/ManagerPage/ManagerPage";
import WeatherDisplay from "./components/WeatherDisplay";
import LoginButton from "./components/LoginButton";
import { AuthProvider } from "./contexts/AuthContext";
import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";

const MainApp = ({
  page,
  setPage,
}: {
  page: string;
  setPage: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const renderPage = () => {
    switch (page) {
      case "home":
        return <HomePage setPage={setPage} />;
      case "kiosk":
        return <KioskPage />;
      case "cashier":
        return <CashierPage />;
      case "manager":
        return <ManagerPage />;
      default:
        return <KioskPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-white shadow-md p-4 h-20 flex justify-between items-center fixed top-0 left-0 w-full z-50">
        <button
          onClick={() => setPage("home")}
          className="text-3xl md:text-4xl font-bold text-maroon hover:text-red-700 truncate max-w-[60vw] sm:max-w-none"
        >
          MomTea POS
        </button>
        <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2">
          <WeatherDisplay />
        </div>

        <div className="flex items-center gap-4">
          <LoginButton />
        </div>
      </header>
      <main className="pt-20">{renderPage()}</main>
    </div>
  );
};

export default function App() {
  const [page, setPage] = useState(
    () => localStorage.getItem("momtea.page") || "kiosk"
  );

  useEffect(() => {
    localStorage.setItem("momtea.page", page);
  }, [page]);

  return (
    <AuthProvider setPage={setPage}>
      <MainApp page={page} setPage={setPage} />
      <Toaster position="top-center" />
    </AuthProvider>
  );
}
