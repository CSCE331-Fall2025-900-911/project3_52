export default function AccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-6">
      <h1 className="text-4xl font-extrabold text-red-600 mb-4">
        Access Denied
      </h1>
      <p className="text-lg text-gray-700 mb-6">
        You do not have permission to view this page.
      </p>
      <button
        onClick={() => {
          localStorage.removeItem("momtea.page");
          window.location.reload();
        }}
        className="px-6 py-3 bg-maroon text-white rounded-lg font-semibold shadow hover:bg-darkmaroon"
      >
        Return Home
      </button>
    </div>
  );
}
