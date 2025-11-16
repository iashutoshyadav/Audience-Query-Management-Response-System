import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function NewQuery() {
  const [form, setForm] = useState({ title: "", body: "" });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErr = {};
    if (!form.title.trim()) newErr.title = "Title is required";
    if (!form.body.trim()) newErr.body = "Details are required";
    setErrors(newErr);
    return Object.keys(newErr).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSaving(true);

      // Create query
      await api.post("/api/queries", {
        title: form.title.trim(),
        body: form.body.trim(),
      });

      navigate("/inbox");

    } catch (err) {
      alert(err.message || "Failed to create query");
      console.error("Create query error:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl bg-white rounded-md shadow p-6">

      <h1 className="text-xl font-semibold mb-4">Create New Query</h1>

      <form onSubmit={submit} className="space-y-4">

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm mb-1 font-medium">
            Title <span className="text-red-500">*</span>
          </label>

          <input
            id="title"
            name="title"
            value={form.title}
            onChange={onChange}
            className={`w-full rounded border p-2 focus:ring-2 focus:ring-blue-400 ${
              errors.title ? "border-red-400" : "border-gray-300"
            }`}
            placeholder="Enter a clear title (e.g., System login failure)"
          />

          {errors.title && (
            <p className="text-xs text-red-500 mt-1">{errors.title}</p>
          )}
        </div>

        {/* Body */}
        <div>
          <label htmlFor="body" className="block text-sm mb-1 font-medium">
            Details <span className="text-red-500">*</span>
          </label>

          <textarea
            id="body"
            name="body"
            value={form.body}
            onChange={onChange}
            rows={6}
            className={`w-full rounded border p-2 focus:ring-2 focus:ring-blue-400 ${
              errors.body ? "border-red-400" : "border-gray-300"
            }`}
            placeholder="Describe the issue clearly..."
          />

          {errors.body && (
            <p className="text-xs text-red-500 mt-1">{errors.body}</p>
          )}
        </div>

        {/* Submit */}
        <div className="text-right">
          <button
            disabled={saving}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow-sm disabled:opacity-50"
          >
            {saving ? "Creating..." : "Create Query"}
          </button>
        </div>

      </form>
    </div>
  );
}
