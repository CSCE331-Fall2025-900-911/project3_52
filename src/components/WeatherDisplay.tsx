import { useEffect, useState } from "react";
import { apiFetch } from "../api/http";
import Music from "./Music";

export default function WeatherDisplay() {
  const [weather, setWeather] = useState<any>(null);

  useEffect(() => {
    const fetchDefaultWeather = () => {
      apiFetch("/api/weather")
        .then((r) => (r.ok ? r.json() : null))
        .then(setWeather)
        .catch(() => {});
    };

    // Detect screen size once on mount
    const isMediumOrLarger = window.matchMedia("(min-width: 768px)").matches;

    // Only fetch location on md and larger
    if (isMediumOrLarger && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          apiFetch(`/api/weather?lat=${latitude}&lon=${longitude}`)
            .then((r) => (r.ok ? r.json() : null))
            .then(setWeather)
            .catch(fetchDefaultWeather);
        },
        () => {
          fetchDefaultWeather();
        }
      );
    } else {
      // Small screens → use default weather
      fetchDefaultWeather();
    }
  }, []);

  if (!weather) return null;

  const iconUrl = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`;

  return (
    <div className="bg-gray-100 p-2 rounded-lg shadow-sm flex items-center max-w-full overflow-hidden">
      <img
        src={iconUrl}
        alt={weather.description}
        className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex-shrink-0 bg-gray-300 rounded-full p-1 shadow"
      />
      <div className="flex items-center gap-2">
        <div className="ml-2 min-w-0">
          <div className="text-base sm:text-lg md:text-xl font-bold truncate">
            {weather.city}
          </div>
          <div className="text-xs sm:text-sm text-gray-600 truncate">
            {Math.round(weather.temp)}°F - {weather.description}
          </div>
        </div>
        <Music />
      </div>
    </div>
  );
}