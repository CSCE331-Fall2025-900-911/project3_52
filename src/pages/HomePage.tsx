import { useAuth } from "../contexts/AuthContext"; // 1. Import useAuth
import Spinner from "../components/Spinner"; // 2. Import Spinner

export default function HomePage({
  setPage,
}: {
  setPage: (p: string) => void;
}) {
  // 3. Get the user and loading state
  const { user, isLoading } = useAuth();

  // 4. Show a spinner while checking for a logged-in user
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  // 5. Determine user status
  const isManager = user?.role === "Manager";
  // "Staff" is anyone who is logged in (including Managers and Cashiers)
  const isStaff = user != null;

  // 6. Dynamically set grid columns for centering
  let gridColsClass = "md:grid-cols-1"; // Default for Kiosk-only
  if (isManager) {
    gridColsClass = "md:grid-cols-3"; // All 3
  } else if (isStaff) {
    gridColsClass = "md:grid-cols-2"; // Cashier + Kiosk
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">MomTea</h1>
      <p className="text-xl text-gray-600 mb-12">Select your view</p>

      {/* 7. Apply the dynamic grid class */}
      <div
        className={`grid grid-cols-1 ${gridColsClass} gap-8 w-full max-w-4xl`}
      >
        {/* Rule 3: Only Managers see this */}
        {isManager && (
          <ViewCard
            title="Manager Portal"
            description="Manage products, staff, and inventory."
            onClick={() => setPage("manager")}
          />
        )}

        {/* Rule 2: Any logged-in staff (Cashier or Manager) sees this */}
        {isStaff && (
          <ViewCard
            title="Cashier POS"
            description="Take customer orders quickly."
            onClick={() => setPage("cashier")}
          />
        )}

        {/* Rule 1: Everyone sees this */}
        <ViewCard
          title="Customer Kiosk"
          description="Place your own order here."
          onClick={() => setPage("kiosk")}
        />
      </div>
    </div>
  );
}

// (This function remains unchanged)
function ViewCard({
  title,
  description,
  onClick,
}: {
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 text-left"
    >
      <h2 className="text-3xl font-bold text-maroon mb-3 text-center">
        {title}
      </h2>
      <p className="text-gray-600 text-center">{description}</p>
    </button>
  );
}
