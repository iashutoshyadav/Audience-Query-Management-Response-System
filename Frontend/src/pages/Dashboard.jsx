import React, { useCallback, useEffect, useMemo, useState } from "react";
import api from "../utils/api";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  BarChart,
  Bar,
  Legend,
  Cell,
} from "recharts";



const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const PIE_COLORS = ["#8B5CF6", "#7C3AED", "#A78BFA", "#C4B5FD", "#7DD3FC", "#60A5FA"];
const CATEGORY_COLOR = "#8B5CF6";
const STATUS_COLOR = "#10B981";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [recent, setRecent] = useState([]);
  const [allQueries, setAllQueries] = useState([]);

  // stat values
  const [counts, setCounts] = useState({
    total: 0,
    resolved: 0,
    urgent: 0,
    avgResponseMinutes: null,
  });

  const fetchOverview = useCallback(async () => {
    try {
      setLoading(true);
      const [recentRes, statsRes] = await Promise.all([
        api.get("/api/queries", { params: { limit: 3, page: 1 } }),
        api.get("/api/queries", { params: { limit: 1500, page: 1 } }),
      ]);

      const recentList = recentRes?.data?.items || [];
      const all = statsRes?.data?.items || [];

      setRecent(recentList);
      setAllQueries(all);

      const total = statsRes?.data?.total ?? all.length;
      const resolvedCount = all.filter((q) => (q.status || "").toLowerCase() === "resolved").length;
      const urgentCount = all.filter((q) => (q.priority || "").toLowerCase() === "urgent").length;

      let sumResp = 0;
      let respCount = 0;

      all.forEach((q) => {
        const byField =
          q.responseTimeMinutes ??
          q.response_time_minutes ??
          q.response_time_min ??
          q.responseMinutes ??
          null;

        if (byField != null && !Number.isNaN(Number(byField))) {
          sumResp += Number(byField);
          respCount++;
          return;
        }

        const created = q.createdAt || q.created_at || q.created;
        const closed = q.closedAt || q.closed_at || q.closed;
        const firstResp = q.firstRespondedAt || q.first_responded_at || q.firstResponseAt;

        const tCreated = created ? new Date(created) : null;
        const tClosed = closed ? new Date(closed) : null;
        const tFirstResp = firstResp ? new Date(firstResp) : null;

        if (tCreated && tClosed && !isNaN(tCreated) && !isNaN(tClosed)) {
          const mins = (tClosed - tCreated) / 60000;
          if (!Number.isNaN(mins)) {
            sumResp += mins;
            respCount++;
            return;
          }
        }

        if (tCreated && tFirstResp && !isNaN(tCreated) && !isNaN(tFirstResp)) {
          const mins = (tFirstResp - tCreated) / 60000;
          if (!Number.isNaN(mins)) {
            sumResp += mins;
            respCount++;
            return;
          }
        }
      });

      const avgResponseMinutes = respCount > 0 ? Math.round(sumResp / respCount) : null;

      setCounts({
        total,
        resolved: resolvedCount,
        urgent: urgentCount,
        avgResponseMinutes,
      });
    } catch (err) {
      console.error("Dashboard load failed:", err);
      try {
        alert(err?.message || "Failed to load dashboard");
      } catch (e) {}
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  /** ---------- Chart data processing ---------- */

  const {
    lineData,
    pieData,
    categoryData,
    statusData,
  } = useMemo(() => {
    const channelCounts = {}; // for pie
    const catCounts = {}; // for category bar
    const statusCounts = {}; // for status bar
    const weekdayAgg = {
      0: { sumResponse: 0, countResp: 0, countTotal: 0 },
      1: { sumResponse: 0, countResp: 0, countTotal: 0 },
      2: { sumResponse: 0, countResp: 0, countTotal: 0 },
      3: { sumResponse: 0, countResp: 0, countTotal: 0 },
      4: { sumResponse: 0, countResp: 0, countTotal: 0 },
      5: { sumResponse: 0, countResp: 0, countTotal: 0 },
      6: { sumResponse: 0, countResp: 0, countTotal: 0 },
    };
    function getResponseMinutes(q) {
      const byField =
        q.responseTimeMinutes ??
        q.response_time_minutes ??
        q.response_time_min ??
        q.responseMinutes ??
        null;

      if (byField != null && !Number.isNaN(Number(byField))) {
        return Number(byField);
      }

      const created = q.createdAt || q.created_at || q.created;
      const closed = q.closedAt || q.closed_at || q.closed;
      const firstResp = q.firstRespondedAt || q.first_responded_at || q.firstResponseAt;

      const tCreated = created ? new Date(created) : null;
      const tClosed = closed ? new Date(closed) : null;
      const tFirst = firstResp ? new Date(firstResp) : null;

      if (tCreated && tClosed && !isNaN(tCreated) && !isNaN(tClosed)) {
        return (tClosed - tCreated) / 60000;
      }
      if (tCreated && tFirst && !isNaN(tCreated) && !isNaN(tFirst)) {
        return (tFirst - tCreated) / 60000;
      }
      return null;
    }

    (allQueries || []).forEach((q) => {
      // channels
      const ch = (q.channel || q.source || "Unknown").toString();
      channelCounts[ch] = (channelCounts[ch] || 0) + 1;

      // categories
      const cat = (q.category || q.type || "Uncategorized").toString();
      catCounts[cat] = (catCounts[cat] || 0) + 1;

      // statuses
      const st = (q.status || "Unknown").toString();
      statusCounts[st] = (statusCounts[st] || 0) + 1;

      // weekday for createdAt
      const created = q.createdAt || q.created_at || q.created;
      const date = created ? new Date(created) : null;
      // Map JS getDay (0=Sun..6=Sat) to our Mon..Sun indices (0..6)
      let idx = null;
      if (date && !isNaN(date)) {
        const jsDay = date.getDay(); // 0..6 (Sun..Sat)
        // Convert so Mon=0..Sun=6
        idx = jsDay === 0 ? 6 : jsDay - 1;
      } else {
        // if no date, skip weekday grouping but still count to "Unknown"? We'll skip
      }

      const respMins = getResponseMinutes(q);

      if (idx !== null) {
        weekdayAgg[idx].countTotal += 1;
        if (respMins != null && !Number.isNaN(Number(respMins))) {
          weekdayAgg[idx].sumResponse += Number(respMins);
          weekdayAgg[idx].countResp += 1;
        }
      }
    });

    const line = WEEKDAYS.map((label, i) => {
      const bucket = weekdayAgg[i];
      if (bucket.countResp > 0) {
        return {
          day: label,
          value: Math.round(bucket.sumResponse / bucket.countResp), // avg minutes rounded
        };
      }
      return {
        day: label,
        value: bucket.countTotal,
        fallbackCount: true,
      };
    });

    // Build pie data (take top 6 channels; rest into "Other")
    const channelEntries = Object.entries(channelCounts).sort((a, b) => b[1] - a[1]);
    const pie = [];
    let otherSum = 0;
    channelEntries.forEach(([name, val], idx) => {
      if (idx < 6) pie.push({ name, value: val });
      else otherSum += val;
    });
    if (otherSum > 0) pie.push({ name: "Other", value: otherSum });

    // category data - convert to array
    const categoryArr = Object.entries(catCounts).map(([name, value]) => ({ name, value }));
    // status data
    const statusArr = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

    return {
      lineData: line,
      pieData: pie,
      categoryData: categoryArr,
      statusData: statusArr,
    };
  }, [allQueries]);

  /** ---------- small helpers for display ---------- */
  const overallAvgResponse = counts.avgResponseMinutes;
  const resolvedRate = counts.total > 0 ? Math.round((counts.resolved / counts.total) * 100) : 0;

  /** ---------- Render ---------- */
  return (
    <div className="flex h-screen bg-gray-50">
      <main className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-2xl md:text-3xl font-semibold mb-6 text-gray-800">Dashboard</h1>

        {/* Metric cards row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Queries"
            value={loading ? "—" : counts.total}
            subtitle="This month"
            colorClass="text-indigo-700"
          />
          <MetricCard
            title="Resolved"
            value={loading ? "—" : counts.resolved}
            subtitle={`${resolvedRate}% resolution rate`}
            colorClass="text-green-600"
          />
          <MetricCard
            title="Avg Response Time"
            value={loading ? "—" : (overallAvgResponse != null ? `${overallAvgResponse}m` : "N/A")}
            subtitle="Per query"
            colorClass="text-slate-900"
          />
          <MetricCard
            title="Urgent Issues"
            value={loading ? "—" : counts.urgent}
            subtitle="Requiring attention"
            colorClass="text-orange-500"
          />
        </div>

        {/* Charts grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Line Chart - Response Time Trend */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-700 mb-1">Response Time Trend</h2>
            <p className="text-gray-400 text-sm mb-4">Average response time in minutes</p>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="day" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value, name, props) => {
                    // If fallbackCount present for this point, indicate it's a count fallback
                    const whole = value;
                    return [whole, props && props.payload && props.payload[0] && props.payload[0].payload?.fallbackCount ? "count" : "minutes"];
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  dot={{ r: 4, stroke: "#3B82F6", strokeWidth: 2, fill: "#ffffff" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart - Queries by Channel */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-700 mb-1">Queries by Channel</h2>
            <p className="text-gray-400 text-sm mb-4">Distribution across platforms</p>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Tooltip />
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={40}
                  paddingAngle={4}
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {pieData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Category Bar Chart */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-700 mb-1">Queries by Category</h2>
            <p className="text-gray-400 text-sm mb-4">Auto-tagged query types</p>

            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" fill={CATEGORY_COLOR} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Status Distribution Bar Chart */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-700 mb-1">Status Distribution</h2>
            <p className="text-gray-400 text-sm mb-4">Query resolution pipeline</p>

            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" fill={STATUS_COLOR} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Latest queries table */}
        <section className="bg-white shadow-sm rounded-2xl p-5 mt-6 border border-gray-100">
          <h2 className="text-lg font-semibold mb-3 text-gray-700">Latest Queries</h2>
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : recent.length === 0 ? (
            <p className="text-gray-500">No recent queries</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-gray-600 border-b">
                    <th className="py-3">User</th>
                    <th className="py-3">Channel</th>
                    <th className="py-3">Category</th>
                    <th className="py-3">Priority</th>
                    <th className="py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((q) => (
                    <tr key={q._id || q.id} className="border-b">
                      <td className="py-3">{q?.user?.name || q.userName || "User"}</td>
                      <td className="py-3">{q.channel || q.source || "—"}</td>
                      <td className="py-3">{q.category || q.type || "—"}</td>
                      <td className="py-3">{q.priority || "—"}</td>
                      <td className="py-3">{q.status || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

/* ---------- Metric Card component ---------- */
function MetricCard({ title, value, subtitle, colorClass = "text-indigo-700" }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-gray-600 text-sm">{title}</h3>
      <p className={`text-3xl md:text-4xl font-bold mt-2 ${colorClass}`}>{value}</p>
      {subtitle && <p className="text-gray-400 text-sm mt-1">{subtitle}</p>}
    </div>
  );
}
