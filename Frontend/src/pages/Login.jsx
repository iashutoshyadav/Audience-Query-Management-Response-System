import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Login({ onClose }) {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = "Email is required";
    if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    if (!form.password.trim()) e.password = "Password is required";
    if (form.password.length < 8) e.password = "Minimum 8 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await login(form);

      // CLOSE LOGIN MODAL AFTER SUCCESS
      if (onClose) onClose();

      navigate("/inbox");
    } catch (err) {
      setErrors({ form: err.message || "Login failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-[80vh]">
      <div className="w-full max-w-md bg-white rounded-md p-6 shadow">
        <h2 className="text-2xl font-semibold mb-4">Sign in</h2>

        {errors.form && (
          <div className="bg-red-100 text-red-700 text-sm p-2 mb-3 rounded">
            {errors.form}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              className={`w-full rounded border p-2 ${
                errors.email ? "border-red-400" : "border-gray-200"
              }`}
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
              className={`w-full rounded border p-2 ${
                errors.password ? "border-red-400" : "border-gray-200"
              }`}
              placeholder="••••••••"
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
            {loading ? "Please wait..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-teal-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
