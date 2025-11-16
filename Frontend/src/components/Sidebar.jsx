import React from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export default function RightSidebar({ open, onClose }) {
  const { logout } = useAuth();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={onClose}
        ></div>
      )}

      <div
        className={`fixed right-0 top-0 h-full w-64 bg-white z-50 shadow-lg transition-transform duration-300 
        ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <h2 className="text-lg font-semibold">Menu</h2>
          <X className="cursor-pointer" onClick={onClose} />
        </div>

        <nav className="flex flex-col mt-4 px-4 space-y-3">

           <Link to="/inbox" className="py-2" onClick={onClose}>
            Inbox
          </Link>
          
          <Link to="/dashboard" className="py-2" onClick={onClose}>
            Dashboard
          </Link>

         

          <Link to="/queries/new" className="py-2" onClick={onClose}>
            New Query
          </Link>

          <button
            className="py-2 text-red-600 text-left"
            onClick={() => {
              logout();
              onClose();
            }}
          >
            Logout
          </button>
        </nav>
      </div>
    </>
  );
}
