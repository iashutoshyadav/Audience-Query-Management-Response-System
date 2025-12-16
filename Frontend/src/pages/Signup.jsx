import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Signup({ onClose, onSwitchToLogin }) {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Invalid email";

    if (!form.password.trim()) e.password = "Password is required";
    else if (form.password.length < 8) e.password = "Minimum 8 characters";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      await register(form);
      if (typeof onSwitchToLogin === "function") {
        if (onClose) onClose(); // close signup modal first
        onSwitchToLogin();      // open login modal
        return;
      }

      alert("Account created successfully! Please login.");
      navigate("/login", { replace: true });
    } catch (err) {
      setErrors({ form: err?.message || "Registration failed" });
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchToLogin = (ev) => {
    if (ev && typeof ev.preventDefault === "function") ev.preventDefault();
    if (typeof onSwitchToLogin === "function") {
      if (onClose) onClose();
      onSwitchToLogin();
      return;
    }
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-center h-[80vh]">
      <div className="w-full max-w-md bg-white rounded-md p-6 shadow">
        <h2 className="text-2xl font-semibold mb-4">Create an account</h2>

        {errors.form && (
          <div className="bg-red-100 text-red-700 text-sm p-2 mb-3 rounded">
            {errors.form}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={onChange}
              className={`w-full rounded border p-2 ${errors.name ? "border-red-400" : "border-gray-200"}`}
              placeholder="Your full name"
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              className={`w-full rounded border p-2 ${errors.email ? "border-red-400" : "border-gray-200"}`}
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={onChange}
              className={`w-full rounded border p-2 ${errors.password ? "border-red-400" : "border-gray-200"}`}
              placeholder="Minimum 8 characters"
            />
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
          className="w-full py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
          >
            {loading ? "Please wait..." : "Register"}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <button
            type="button"
            onClick={handleSwitchToLogin}
            className="text-teal-600 hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}
