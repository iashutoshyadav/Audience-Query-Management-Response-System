import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Menu } from "lucide-react";

export default function Navbar({ onMenuClick, onLoginClick }) {
  const { user } = useAuth();
  const location = useLocation();
  if (location.pathname === "/login") return null;

  return (
   <nav className="bg-white shadow-sm sticky top-0 z-50">
  <div className="w-full mx-auto py-3 flex items-center justify-between pr-0">
    <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2 pl-4">
      <span className="font-semibold text-lg text-primary">QueryPilot</span>
    </Link>
    {user ? (
      <button
        onClick={onMenuClick}
        className="p-2 hover:bg-gray-100 rounded-md pr-2 mr-8"
      >
        <Menu size={20} />
      </button>
    ) : (
      <button
        onClick={onLoginClick}
        className="px-3 py-1 rounded-md border border-gray-200 text-sm hover:bg-gray-100 transition pr-2 mr-8"
      >
        Login
      </button>
    )}

  </div>
</nav>

  );
}
