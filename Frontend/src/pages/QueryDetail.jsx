import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import PriorityBadge from "../components/PriorityBadge";
import StatusBadge from "../components/StatusBadge";
import TagChip from "../components/TagChip";
import Notes from "../components/Notes";
import { Mail, MessageCircle, Users, Brain } from "lucide-react";

export default function QueryDetail() {
  const { id } = useParams();
  const [q, setQ] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  /* ---------------- Fetch Query ---------------- */
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

  /* ---------------- Update Status ---------------- */
  const updateStatus = async (status) => {
    if (q?.status === status) return;

    setSaving(true);
    const oldStatus = q.status;

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

  /* ---------------- Delete Query ---------------- */
  const handleDelete = async () => {
    if (!window.confirm("Delete this query? This cannot be undone.")) return;

    try {
      await api.delete(`/api/queries/${id}`);
      navigate("/inbox", { replace: true });
    } catch (err) {
      alert(err.message || "Delete failed");
    }
  };

  if (loading) return <div className="p-4">Loading query...</div>;
  if (!q) return <div className="p-4">Query not found</div>;

  const formattedDate = new Date(q.createdAt).toLocaleString();

  const CHANNEL_ICON = {
    email: <Mail size={18} className="text-blue-600" />,
    whatsapp: <MessageCircle size={18} className="text-green-600" />,
    manual: <Users size={18} className="text-gray-600" />,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      {/* ---------------- MAIN PANEL ---------------- */}
      <div className="col-span-2 bg-white p-6 rounded shadow">
        
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold">{q.title || "Untitled Query"}</h1>
            <div className="text-xs text-gray-400">{formattedDate}</div>

            {/* Channel */}
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
              {CHANNEL_ICON[q.source] || CHANNEL_ICON.manual}
              <span className="capitalize">{q.source}</span>
            </div>
          </div>

          {/* Priority + Status */}
          <div className="space-y-2 text-right">
            <PriorityBadge value={q.priority} />
            <StatusBadge status={q.status} />
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

        {/* Status Action Buttons */}
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

      {/* ---------------- RIGHT PANEL ---------------- */}
      <div className="col-span-1 space-y-6">

        {/* AI Insights */}
        <div className="bg-white p-4 rounded-xl shadow border">
          <div className="flex items-center gap-2 mb-3">
            <Brain size={18} className="text-indigo-600" />
            <h2 className="text-md font-semibold">AI Insights</h2>
          </div>

          <div className="text-sm text-gray-700 space-y-2">
            <div>
              <span className="font-medium">Category:</span>{" "}
              <span className="text-indigo-700">{q.category}</span>
            </div>

            <div>
              <span className="font-medium">Sentiment:</span>{" "}
              <span className="capitalize">{q.sentiment}</span>
            </div>

            {q.confidence && (
              <div>
                <span className="font-medium">Confidence:</span>{" "}
                {Math.round(q.confidence * 100)}%
              </div>
            )}

            <div>
              <span className="font-medium">AI Summary:</span>
              <p className="text-gray-600 mt-1">
                {q.summary || "No AI summary available."}
              </p>
            </div>
          </div>
        </div>

        {/* Assigned Agent */}
        <div className="bg-white p-4 rounded-xl shadow border">
          <h2 className="text-md font-semibold mb-2">Assigned To</h2>
          <p className="text-gray-700">
            👤 {q.assigned_to?.name || "Unassigned"}
          </p>
        </div>

        {/* Notes Section */}
        <Notes queryId={q._id} />
      </div>
    </div>
  );
}
