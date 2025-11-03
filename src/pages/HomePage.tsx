export default function HomePage({ setPage }: { setPage: (p: string) => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">MomTea</h1>
      <p className="text-xl text-gray-600 mb-12">Select your view</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
        <ViewCard title="Manager Portal" description="Manage products, staff, and inventory." onClick={() => setPage("manager")} />
        <ViewCard title="Cashier POS" description="Take customer orders quickly." onClick={() => setPage("cashier")} />
        <ViewCard title="Customer Kiosk" description="Place your own order here." onClick={() => setPage("kiosk")} />
      </div>
    </div>
  );
}
function ViewCard({ title, description, onClick }: { title: string; description: string; onClick: () => void; }) {
  return (
    <button onClick={onClick} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 text-left">
      <h2 className="text-3xl font-bold text-maroon mb-3">{title}</h2>
      <p className="text-gray-600">{description}</p>
    </button>
  );
}