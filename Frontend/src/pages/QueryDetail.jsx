import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import PriorityBadge from "../components/PriorityBadge";
import StatusBadge from "../components/StatusBadge";
import TagChip from "../components/TagChip";
import Notes from "../components/Notes";

export default function QueryDetail() {
  const { id } = useParams();
  const [q, setQ] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  // ----------------------------------------------------
  // Fetch Query (useCallback to avoid ESLint disable)
  // ----------------------------------------------------
  const fetchQuery = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/queries/${id}`);
      setQ(res.data?.data || null);
    } catch (err) {
      console.error(err.message);
      alert(err.message || "Failed to load query");
      navigate("/inbox", { replace: true });
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchQuery();
  }, [fetchQuery]);

  // ----------------------------------------------------
  // Update Status (with optimistic UI)
  // ----------------------------------------------------
  const updateStatus = async (status) => {
    if (q?.status === status) return;

    setSaving(true);
    const oldStatus = q.status;

    // Optimistic Update
    setQ((prev) => ({ ...prev, status }));

    try {
      await api.patch(`/api/queries/${id}`, { status });
      await fetchQuery();
    } catch (err) {
      alert(err.message || "Failed to update status");
      setQ((prev) => ({ ...prev, status: oldStatus }));
    } finally {
      setSaving(false);
    }
  };

  // ----------------------------------------------------
  // Delete Query
  // ----------------------------------------------------
  const handleDelete = async () => {
    if (!window.confirm("Delete this query? This cannot be undone.")) return;

    try {
      await api.delete(`/api/queries/${id}`);
      navigate("/inbox", { replace: true });
    } catch (err) {
      alert(err.message || "Delete failed");
    }
  };

  // ----------------------------------------------------
  // Render States
  // ----------------------------------------------------
  if (loading) return <div className="p-4">Loading query...</div>;
  if (!q) return <div className="p-4">Query not found</div>;

  const formattedDate = new Date(q.createdAt).toLocaleString();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      {/* Main Query Panel */}
      <div className="col-span-2 bg-white p-6 rounded shadow">
        
        {/* Title & Badges */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold">{q.title || "Untitled Query"}</h1>
            <div className="text-xs text-gray-400">{formattedDate}</div>
          </div>

          <div className="space-y-1 text-right">
            <PriorityBadge value={q.priority} />
            <div className="mt-1">
              <StatusBadge status={q.status} />
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="mt-4 text-gray-700 whitespace-pre-wrap">
          {q.body || "No description provided."}
        </div>

        {/* Tags */}
        {q.tags?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1">
            {q.tags.map((t) => (
              <TagChip key={t}>{t}</TagChip>
            ))}
          </div>
        )}

        {/* Status Actions */}
        <div className="mt-6 flex gap-2 flex-wrap">
          <button
            disabled={saving || q.status === "in_progress"}
            onClick={() => updateStatus("in_progress")}
            className="px-3 py-1 rounded border disabled:opacity-50"
          >
            Mark In Progress
          </button>

          <button
            disabled={saving || q.status === "resolved"}
            onClick={() => updateStatus("resolved")}
            className="px-3 py-1 rounded bg-green-600 text-white disabled:opacity-50"
          >
            Mark Resolved
          </button>

          <button
            onClick={handleDelete}
            className="px-3 py-1 rounded bg-red-600 text-white"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Notes Section */}
      <div className="col-span-1">
        <Notes queryId={q._id} />
      </div>
    </div>
  );
}
