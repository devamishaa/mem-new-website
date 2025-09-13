"use client";

import React from "react";
import clsx from "clsx";

const Card = ({ variant = "default", className = "", children, ...props }) => {
  const baseClasses = "rounded-lg bg-white shadow-sm border border-gray-200";

  const variantClasses = {
    default: "p-4",
    floating: "p-4 shadow-lg hover:shadow-xl transition-shadow duration-200",
  };

  return (
    <div
      className={clsx(baseClasses, variantClasses[variant], className)}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
