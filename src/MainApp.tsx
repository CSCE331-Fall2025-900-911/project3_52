import HomePage from "./pages/HomePage";
import KioskPage from "./pages/KioskPage/KioskPage";
import CashierPage from "./pages/CashierPage";
import ManagerPage from "./pages/ManagerPage/ManagerPage";
import WeatherDisplay from "./components/WeatherDisplay";
import LoginButton from "./components/LoginButton";
import { AuthProvider } from "./contexts/AuthContext";
import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";

const MainApp = () => {
  const [page, setPage] = useState(
    () => localStorage.getItem("momtea.page") || "home"
  );

  useEffect(() => {
    localStorage.setItem("momtea.page", page);
  }, [page]);
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
        return <HomePage setPage={setPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-white shadow-md p-4 h-20 flex justify-between items-center fixed top-0 left-0 w-full z-50">
        {/* Left group: brand + weather */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setPage("home")}
            className="text-xl sm:text-2xl lg:text-4xl font-bold text-maroon hover:text-red-700 truncate max-w-[60vw] sm:max-w-none"
          >
            MomTea POS
          </button>
          <div className="hidden xs:block sm:block">
            <WeatherDisplay />
          </div>
        </div>

        {/* Right group: login */}
        <div className="flex items-center gap-4">
          <LoginButton />
        </div>
      </header>
      <main className="pt-20">{renderPage()}</main>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
      <Toaster position="top-center" />
    </AuthProvider>
  );
}
