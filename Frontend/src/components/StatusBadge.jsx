import React from "react";
import PropTypes from "prop-types";
import clsx from "classnames";

const styles = {
  open: "bg-blue-100 text-blue-700",
  in_progress: "bg-indigo-100 text-indigo-700",
  resolved: "bg-green-100 text-green-700",
  closed: "bg-gray-100 text-gray-700",
};

export default function StatusBadge({ status = "open" }) {
  const safeStatus = styles[status] ? status : "open";

  const cls = clsx(
    "inline-block px-2 py-1 text-xs rounded-full font-medium select-none",
    styles[safeStatus]
  );

  const label = safeStatus
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return (
    <span className={cls} aria-label={`Status: ${label}`}>
      {label}
    </span>
  );
}

StatusBadge.propTypes = {
  status: PropTypes.oneOf(["open", "in_progress", "resolved", "closed"]),
};
