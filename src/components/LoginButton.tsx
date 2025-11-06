import { useAuth } from "../contexts/AuthContext";
import { IconLogin, IconLogout } from "./Icons";

export default function LoginButton() {
  const { user, login, logout, isLoading } = useAuth();

  if (isLoading) return <div className="text-gray-500">Loading...</div>;

  return user ? (
    <div className="flex items-center sm:gap-4">
      <span className="text-gray-700 text-sm sm:text-base hidden md:block xs:inline">
        Welcome, {user.name}
      </span>
      <button
        onClick={logout}
        className="flex items-center px-2 sm:px-4 py-1.5 sm:py-2 bg-maroon text-white rounded-lg shadow hover:bg-darkmaroon text-sm sm:text-base gap-1 sm:gap-2"
      >
        <IconLogout />
        <span>Logout</span>
      </button>
    </div>
  ) : (
    <button
      onClick={login}
      className="flex items-center px-2 sm:px-4 py-1.5 sm:py-2 bg-maroon text-white rounded-lg shadow hover:bg-darkmaroon text-sm sm:text-base gap-1 sm:gap-2"
    >
      <IconLogin />
      <span>Staff Login</span>
    </button>
  );
}
