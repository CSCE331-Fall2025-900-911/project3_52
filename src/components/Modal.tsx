export default function Modal({
  isOpen, onClose, title, children,
}: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode; }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg m-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-2xl font-bold">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-3xl">&times;</button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}