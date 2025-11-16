import React, { useEffect, useState, useCallback } from "react";
import api from "../utils/api";

export default function Notes({ queryId }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);

  // ----------------------------------------------------
  // Fetch Notes
  // ----------------------------------------------------
  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);

      const res = await api.get("/notes", { params: { queryId } });

      const list = res.data?.data || [];
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setNotes(list);
    } catch (err) {
      console.error("Failed to load notes:", err);
    } finally {
      setLoading(false);
    }
  }, [queryId]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // ----------------------------------------------------
  // Add Note
  // ----------------------------------------------------
  const handleAdd = async (e) => {
    e.preventDefault();
    const content = text.trim();
    if (!content) return;

    setSaving(true);

    // optimistic temporary note
    const tempNote = {
      _id: "temp-" + Math.random(),
      content,
      createdAt: new Date().toISOString(),
      isTemp: true,
    };

    setNotes((prev) => [tempNote, ...prev]);

    try {
      const res = await api.post("/notes", { content, queryId });
      const realNote = res.data?.data;

      // Replace temp note with real note
      setNotes((prev) => prev.map((n) => (n._id === tempNote._id ? realNote : n)));

      setText("");
    } catch (err) {
      console.error("Failed to save:", err);
      alert("Failed to save note");
      setNotes((prev) => prev.filter((n) => n._id !== tempNote._id));
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="bg-white rounded-md shadow p-4">
      <h4 className="font-semibold mb-3">Notes</h4>

      {/* Add Note Form */}
      <form onSubmit={handleAdd} className="mb-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full rounded border-gray-300 p-2 focus:ring-indigo-500 focus:border-indigo-500"
          rows={3}
          placeholder="Add a private note..."
        />
        <div className="mt-2 text-right">
          <button
            disabled={saving}
            className="px-4 py-2 rounded bg-teal-600 hover:bg-teal-700 text-white text-sm disabled:opacity-50 transition"
          >
            {saving ? "Saving..." : "Add Note"}
          </button>
        </div>
      </form>

      {/* Notes List */}
      {loading ? (
        <div className="text-sm text-gray-500">Loading notes…</div>
      ) : notes.length ? (
        <ul className="space-y-3">
          {notes.map((n) => (
            <li
              key={n._id}
              className="border-l-2 border-gray-200 pl-3 text-sm text-gray-700"
            >
              <div className="text-xs text-gray-400">
                {new Date(n.createdAt).toLocaleString()}
                {n.isTemp && " • saving..."}
              </div>
              <div>{n.content}</div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-sm text-gray-500">No notes yet</div>
      )}
    </section>
  );
}
