import React, { useEffect, useState, useCallback, useMemo } from "react";
import api from "../utils/api";
import QueryCard from "../components/QueryCard";
import { Search, SlidersHorizontal } from "lucide-react";

export default function Inbox() {
  const [queries, setQueries] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 12;

  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters
  const [priority, setPriority] = useState("All");
  const [status, setStatus] = useState("All");
  const [category, setCategory] = useState("All");

  // NEW: source filter (Email / WhatsApp / Manual)
  const [source, setSource] = useState("All");

  const [search, setSearch] = useState("");

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / limit)),
    [total]
  );

  /* ------------------- FETCH QUERIES (updated) ------------------- */
  const fetchQueries = useCallback(async () => {
    try {
      setLoading(true);

      const res = await api.get("/api/queries", {
        params: {
          page,
          limit,
          sort: "-createdAt",

          // priority filter
          priority:
            priority !== "All" ? priority.toLowerCase() : undefined,

          // status filter
          status:
            status !== "All"
              ? status.toLowerCase().replace("-", "_")
              : undefined,

          // category filter
          category:
            category !== "All" ? category.toLowerCase() : undefined,

          // ⭐ NEW — channel filter
          source:
            source !== "All" ? source.toLowerCase() : undefined,

          // search
          q: search || undefined,
        },
      });

      setQueries(res.data?.items || []);
      setTotal(res.data?.total || 0);
    } catch (err) {
      console.error("Inbox fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [page, priority, status, category, source, search]);

  useEffect(() => {
    fetchQueries();
  }, [fetchQueries]);

  return (
    <div className="flex h-full bg-gray-50">
      <div className="flex-1 p-0">

        <h1 className="text-2xl font-semibold mb-1">Inbox</h1>
        <p className="text-sm text-gray-500 mb-4">
          Manage customer queries from Email & WhatsApp
        </p>

        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              placeholder="Search by message, customer, or channel..."
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white shadow-sm border rounded-xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-4 text-gray-700 font-medium">
            <SlidersHorizontal size={16} />
            Filters
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            {/* Priority */}
            <div>
              <label className="text-sm text-gray-500">Priority</label>
              <select
                value={priority}
                onChange={(e) => {
                  setPage(1);
                  setPriority(e.target.value);
                }}
                className="w-full mt-1 px-3 py-2 bg-white border rounded-lg shadow-sm"
              >
                <option>All</option>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Urgent</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="text-sm text-gray-500">Status</label>
              <select
                value={status}
                onChange={(e) => {
                  setPage(1);
                  setStatus(e.target.value);
                }}
                className="w-full mt-1 px-3 py-2 bg-white border rounded-lg shadow-sm"
              >
                <option>All</option>
                <option>Open</option>
                <option>In_Progress</option>
                <option>Resolved</option>
                <option>Closed</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="text-sm text-gray-500">Category</label>
              <select
                value={category}
                onChange={(e) => {
                  setPage(1);
                  setCategory(e.target.value);
                }}
                className="w-full mt-1 px-3 py-2 bg-white border rounded-lg shadow-sm"
              >
                <option>All</option>
                <option>Complaint</option>
                <option>Question</option>
                <option>Billing</option>
                <option>Technical</option>
              </select>
            </div>

            {/* ⭐ NEW — Source Filter */}
            <div>
              <label className="text-sm text-gray-500">Channel</label>
              <select
                value={source}
                onChange={(e) => {
                  setPage(1);
                  setSource(e.target.value);
                }}
                className="w-full mt-1 px-3 py-2 bg-white border rounded-lg shadow-sm"
              >
                <option value="All">All</option>
                <option value="email">Email</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="manual">Manual</option>
              </select>
            </div>
          </div>

          <p className="text-xs text-gray-400 mt-3">
            Showing {queries.length} of {total} queries
          </p>
        </div>

        {/* Query Cards */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-sm text-gray-500">Loading...</div>
          ) : queries.length === 0 ? (
            <div className="text-sm text-gray-500">No queries found</div>
          ) : (
            queries.map((q) => <QueryCard key={q._id} q={q} />)
          )}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex items-center justify-between">
          <p className="text-sm text-gray-600">Total: {total}</p>

          <div className="space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 bg-white shadow-sm border rounded-lg text-sm disabled:opacity-50"
            >
              Prev
            </button>

            <span className="px-4 py-1 bg-white shadow-sm border rounded-lg text-sm">
              {page}
            </span>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 bg-white shadow-sm border rounded-lg text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
