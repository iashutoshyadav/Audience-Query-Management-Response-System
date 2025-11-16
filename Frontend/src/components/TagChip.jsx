import React from "react";
import PropTypes from "prop-types";
import clsx from "classnames";

const variants = {
  default: "bg-gray-100 text-gray-700",
  blue: "bg-blue-100 text-blue-700",
  green: "bg-green-100 text-green-700",
  yellow: "bg-yellow-100 text-yellow-700",
  red: "bg-red-100 text-red-700",
  outline: "border border-gray-300 text-gray-700 bg-white",
};

export default function TagChip({ children, variant = "default" }) {
  if (!children) return null; // no empty chips
  
  const cls = clsx(
    "text-xs inline-block px-2 py-1 rounded select-none",
    "mr-1 mb-1 transition",
    variants[variant] || variants.default
  );

  return (
    <span className={cls} aria-label={`Tag: ${children}`}>
      {children}
    </span>
  );
}

TagChip.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf([
    "default",
    "blue",
    "green",
    "yellow",
    "red",
    "outline",
  ]),
};
