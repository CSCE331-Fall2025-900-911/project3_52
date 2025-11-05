import { useEffect, useState } from "react";
import { apiFetch } from "../api/http";

export default function WeatherDisplay() {
  const [weather, setWeather] = useState<any>(null);

  useEffect(() => {
    if (window.innerWidth < 640) return; // Tailwind "sm" breakpoint ≈ 640px

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          apiFetch(`/api/weather?lat=${latitude}&lon=${longitude}`)
            .then((r) => (r.ok ? r.json() : null))
            .then(setWeather)
            .catch(() => {});
        },
        () => {
          // silently fail if permission denied or error
        }
      );
    }
  }, []);

  if (!weather) return null;

  const iconUrl = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`;

  return (
    <div className="bg-gray-100 p-2 rounded-lg shadow-sm flex items-center max-w-full overflow-hidden">
      <img
        src={iconUrl}
        alt={weather.description}
        className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex-shrink-0"
      />
      <div className="ml-2 min-w-0">
        <div className="text-base sm:text-lg md:text-xl font-bold truncate">
          {weather.city}
        </div>
        <div className="text-xs sm:text-sm text-gray-600 truncate">
          {Math.round(weather.temp)}°F - {weather.description}
        </div>
      </div>
    </div>
  );
}
