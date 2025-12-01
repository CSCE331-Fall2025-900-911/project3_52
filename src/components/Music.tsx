import { useEffect, useRef, useState } from "react";

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.5;

    if (isPlaying) {
      audio.play().catch((err) => {
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  return (
    <div className="flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity">
      <button
        aria-label="Background Music Toggle Icon"
        onClick={() => setIsPlaying(!isPlaying)}
        className={`text-lg w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center ${
          isPlaying
            ? "bg-green-300 animate-pulse"
            : "bg-gray-300 hover:bg-gray-400"
        }`}
      >
        {isPlaying ? (
          "🎵"
        ) : (
          <span className="ml-1 w-0 h-0 border-t-[6px] border-b-[6px] border-l-[10px] border-t-transparent border-b-transparent border-l-gray-600"></span>
        )}
      </button>
      <audio ref={audioRef} loop src="./music.mp3" />
    </div>
  );
}
