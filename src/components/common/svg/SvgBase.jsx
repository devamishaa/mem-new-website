"use client";

// base SVG wrapper with consistent styling
export default function SvgBase({
  children,
  size,
  width,
  height,
  viewBox = "0 0 24 24",
  color = "currentColor",
  secondaryColor,
  stroke = "currentColor",
  strokeWidth = 1.5,
  title,
  decorative = false,
  className = "",
  style,
  ...rest
}) {
  const ariaProps = decorative
    ? { "aria-hidden": true }
    : { role: "img", ...(title && { "aria-label": title }) };

  const dimensions = size ? { width: size, height: size } : { width, height };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      strokeWidth={strokeWidth}
      className={className}
      style={{
        "--svg-primary": color,
        "--svg-secondary": color,
        "--svg-stroke": stroke,
        ...style,
      }}
      {...dimensions}
      {...ariaProps}
      {...rest}
    >
      {title && <title>{title}</title>}
      {children}
    </svg>
  );
}
