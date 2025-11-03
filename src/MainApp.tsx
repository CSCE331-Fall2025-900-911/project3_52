import HomePage from "./pages/HomePage";
import KioskPage from "./pages/KioskPage/KioskPage";
import CashierPage from "./pages/CashierPage";
import ManagerPage from "./pages/ManagerPage/ManagerPage";
import WeatherDisplay from "./components/WeatherDisplay";
import LoginButton from "./components/LoginButton";
import { AuthProvider } from "./contexts/AuthContext";
import { useState } from "react";

const MainApp = () => {
  const [page, setPage] = useState("home");

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
      <header className="bg-white shadow-md p-4 h-20 flex justify-between items-center">
        {/* Left group: brand + weather */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setPage("home")}
            className="text-2xl font-bold text-blue-600"
          >
            TeaFlow POS
          </button>
          <WeatherDisplay />
        </div>

        {/* Right group: login */}
        <div className="flex items-center gap-4">
          <LoginButton />
        </div>
      </header>
      <main>{renderPage()}</main>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
