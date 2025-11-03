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
    <div className="bg-gray-100 p-2 rounded-lg shadow-sm flex items-center">
      <img src={iconUrl} alt={weather.description} className="w-12 h-12" />
      <div className="ml-2">
        <div className="text-xl font-bold">{weather.city}</div>
        <div className="text-sm text-gray-600">
          {Math.round(weather.temp)}°F - {weather.description}
        </div>
      </div>
    </div>
  );
}
