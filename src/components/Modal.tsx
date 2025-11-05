export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  isDarkMode = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  isDarkMode?: boolean;
}) {
  if (!isOpen) return null;
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-colors ${
        isDarkMode ? "bg-black/70" : "bg-black/50"
      }`}
    >
      <div
        className={`rounded-lg shadow-xl w-full max-w-lg m-4 transition-colors ${
          isDarkMode
            ? "bg-gray-900 text-gray-100 border border-gray-700"
            : "bg-white text-gray-900"
        }`}
      >
        <div
          className={`flex justify-between items-center p-4 border-b ${
            isDarkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <h3 className="text-2xl font-bold">{title}</h3>
          <button
            onClick={onClose}
            className={`text-3xl ${
              isDarkMode
                ? "text-gray-300 hover:text-white"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            &times;
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
