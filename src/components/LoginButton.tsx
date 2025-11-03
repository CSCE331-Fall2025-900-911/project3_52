import { useAuth } from "../contexts/AuthContext";

export default function LoginButton() {
  const { user, login, logout, isLoading } = useAuth();

  if (isLoading) return <div className="text-gray-500">Loading...</div>;

  return user ? (
    <div className="flex items-center gap-4">
      <span className="text-gray-700">
        Welcome, {user.name} ({user.role})
      </span>
      <button
        onClick={logout}
        className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600"
      >
        Log Out
      </button>
    </div>
  ) : (
    <button
      onClick={login}
      className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
    >
      Staff Login
    </button>
  );
}
