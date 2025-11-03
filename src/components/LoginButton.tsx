import { useAuth } from "../contexts/AuthContext";
import { IconLogin, IconLogout } from "./Icons";

export default function LoginButton() {
  const { user, login, logout, isLoading } = useAuth();

  if (isLoading) return <div className="text-gray-500">Loading...</div>;

  return user ? (
    <div className="flex items-center gap-4">
      <span className="text-gray-700">Welcome, {user.name}</span>
      <button
        onClick={logout}
        className="flex items-center px-4 py-2 bg-maroon text-white rounded-lg shadow hover:bg-darkmaroon gap-1"
      >
        <IconLogout />
        <span> Logout</span>
      </button>
    </div>
  ) : (
    <button
      onClick={login}
      className="flex items-center px-4 py-2 bg-maroon text-white rounded-lg shadow hover:bg-darkmaroon gap-1"
    >
      <IconLogin />
      <span>Staff Login</span>
    </button>
  );
}
