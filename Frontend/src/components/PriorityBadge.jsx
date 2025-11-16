import React from "react";
import PropTypes from "prop-types";
import clsx from "classnames";

const styles = {
  urgent: "bg-red-100 text-red-700",
  high: "bg-orange-100 text-orange-700",
  medium: "bg-yellow-100 text-yellow-800",
  low: "bg-green-100 text-green-700",
};

export default function PriorityBadge({ value = "medium" }) {
  const safeValue = styles[value] ? value : "medium";

  const cls = clsx(
    "inline-block px-2 py-1 text-xs rounded-full font-medium select-none",
    styles[safeValue]
  );

  // Capitalize for better UI
  const label = safeValue.charAt(0).toUpperCase() + safeValue.slice(1);

  return (
    <span className={cls} aria-label={`Priority: ${label}`}>
      {label}
    </span>
  );
}

PriorityBadge.propTypes = {
  value: PropTypes.oneOf(["low", "medium", "high", "urgent"]),
};
