export default function AccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-6">
      <h1 className="text-4xl font-extrabold text-red-600 mb-4">Access Denied</h1>
      <p className="text-lg text-gray-700 mb-6">You do not have permission to view this page.</p>
      <a
        href="/"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700"
      >
        Return Home
      </a>
    </div>
  );
}


