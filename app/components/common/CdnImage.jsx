import { IMAGE_BASE_URL } from "@/app/components/common/index";

const CdnImage = ({
  name,
  alt = "",
  className = "",
  fill,
  priority,
  decorative,
  unoptimized,
  ...props
}) => {
  const imageUrl = `${IMAGE_BASE_URL}${name}`;

  // Handle fill prop by applying CSS styles
  const fillStyles = fill
    ? {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
      }
    : {};

  // Handle decorative prop for accessibility
  const finalAlt = decorative ? "" : alt;

  return (
    <img
      loading={priority ? "eager" : "lazy"}
      src={imageUrl}
      alt={finalAlt}
      className={className}
      style={{ ...fillStyles, ...props.style }}
      {...props}
    />
  );
};

export default CdnImage;
