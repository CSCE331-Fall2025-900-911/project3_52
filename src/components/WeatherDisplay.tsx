import { useEffect, useState } from "react";
import { apiFetch } from "../api/http";

export default function WeatherDisplay() {
  const [weather, setWeather] = useState<any>(null);

  useEffect(() => {
    // Define a function for the fallback (default) weather
    const fetchDefaultWeather = () => {
      apiFetch("/api/weather")
        .then((r) => (r.ok ? r.json() : null))
        .then(setWeather)
        .catch(() => {}); // Fail silently per original code
    };

    // Check if geolocation is available in the browser
    if ("geolocation" in navigator) {
      // Try to get the user's current position
      navigator.geolocation.getCurrentPosition(
        // Success callback: We got the location
        (position) => {
          const { latitude, longitude } = position.coords;

          // Fetch weather using the new coordinates
          apiFetch(`/api/weather?lat=${latitude}&lon=${longitude}`)
            .then((r) => (r.ok ? r.json() : null))
            .then(setWeather)
            .catch(fetchDefaultWeather); // If location-based fetch fails, try default
        },
        // Error callback: User denied permission or it failed
        () => {
          fetchDefaultWeather();
        }
      );
    } else {
      // Geolocation is not available in this browser
      fetchDefaultWeather();
    }
  }, []); // Empty dependency array means this runs once on mount

  if (!weather) return null;
  const iconUrl = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`;

  return (
    <div className="bg-gray-100 px-2 py-1 rounded-md shadow-sm flex items-center">
      <img src={iconUrl} alt={weather.description} className="w-8 h-8" />
      <div className="ml-2 leading-tight">
        <div className="text-sm font-semibold">{weather.city}</div>
        <div className="text-xs text-gray-600">
          {Math.round(weather.temp)}°F — {weather.description}
        </div>
      </div>
    </div>
  );
}
