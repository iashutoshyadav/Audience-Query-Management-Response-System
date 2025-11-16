import React from "react";
import { Link } from "react-router-dom";
import { Mail, Twitter, Users, Clock, MessageCircle } from "lucide-react";

/* ------------------ TAG COLORS ------------------ */
const TagStyle = {
  urgent: "bg-red-200 text-red-700",
  high: "bg-orange-200 text-orange-700",
  medium: "bg-yellow-200 text-yellow-800",
  low: "bg-green-200 text-green-700",

  // category tags
  complaint: "bg-red-100 text-red-700",
  billing: "bg-purple-100 text-purple-700",
  technical: "bg-blue-100 text-blue-700",
  question: "bg-indigo-100 text-indigo-700",

  default: "bg-gray-200 text-gray-700",
};

/* ------------------ SENTIMENT EMOJI ------------------ */
const sentimentEmoji = {
  positive: "😊",
  neutral: "😐",
  negative: "😡",
};

/* ------------------ CHANNEL ICONS ------------------ */
const CHANNEL_ICONS = {
  email: <Mail size={16} className="text-blue-600" />,
  whatsapp: <MessageCircle size={16} className="text-green-600" />,
  twitter: <Twitter size={16} className="text-sky-500" />,
  manual: <Users size={16} className="text-gray-600" />,
};

/* ------------------ TIME AGO ------------------ */
const timeAgo = (timestamp) => {
  if (!timestamp) return "-";
  const diff = (Date.now() - new Date(timestamp)) / 1000;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

export default function QueryCard({ q }) {
  return (
    <div className="w-full bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all">
      
      {/* ------------ Tags + Priority + Category ------------ */}
      <div className="flex flex-wrap items-center gap-2 mb-4">

        {/* AI Tags */}
        {(q.tags || []).map((tag) => (
          <span
            key={tag}
            className={`px-3 py-1 text-xs rounded-full font-medium ${
              TagStyle[tag.toLowerCase()] || TagStyle.default
            }`}
          >
            {tag}
          </span>
        ))}

        {/* Priority */}
        {q.priority && (
          <span
            className={`px-3 py-1 text-xs rounded-full font-bold ${
              TagStyle[q.priority.toLowerCase()] || TagStyle.default
            }`}
          >
            Priority: {q.priority}
          </span>
        )}

        {/* Category */}
        {q.category && (
          <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700 font-medium">
            {q.category}
          </span>
        )}
      </div>

      {/* ------------ Sender + Title + Summary ------------ */}
      <Link to={`/queries/${q._id}`} className="block group">
        <h3 className="text-lg font-semibold text-gray-900 group-hover:underline">
          {q.sender || "Unknown Sender"}
        </h3>

        <p className="text-gray-800 mt-1 text-[15px]">
          <span className="font-semibold">{q.title}</span> —{" "}
          {(q.summary && q.summary.substring(0, 100)) ||
            q.body?.substring(0, 100) ||
            "No message"}
        </p>
      </Link>

      {/* ------------ Sentiment ------------ */}
      {q.sentiment && (
        <div className="mt-4 bg-[#0a1747] text-white rounded-md py-2 px-4 w-fit">
          <span className="font-semibold">Sentiment:</span>&nbsp;
          {sentimentEmoji[q.sentiment] || "🙂"} {q.sentiment}
        </div>
      )}

      {/* ------------ Footer ------------ */}
      <div className="border-t mt-6 pt-4 flex items-center justify-between">
        
        {/* Left Side */}
        <div className="flex items-center gap-4 text-gray-600 text-sm">
          
          {/* Channel */}
          <span className="flex items-center gap-1">
            {CHANNEL_ICONS[q.source] || CHANNEL_ICONS["manual"]}
          </span>

          {/* Time */}
          <span className="flex items-center gap-1">
            <Clock size={16} />
            {timeAgo(q.createdAt)}
          </span>

          {/* Assigned User */}
          {q.assigned_to && (
            <span className="flex items-center gap-1">
              👤 {q.assigned_to.name || "Assigned"}
            </span>
          )}
        </div>

        {/* Right Side Buttons */}

        <div className="flex gap-3">
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">
            Analyze
          </button>

          {q.status === "resolved" ? (
            <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium">
              Resolved
            </button>
          ) : (
            <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium">
              Mark Progress
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
