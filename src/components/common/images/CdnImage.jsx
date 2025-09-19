import Image from "next/image";
import { forwardRef } from "react";
import { buildCdnSrc } from "@/utils/cdn/url";

function isFullUrl(src) {
  return src && (src.startsWith("http") || src.startsWith("//"));
}

function isLocalPath(src) {
  return src && src.startsWith("/") && !src.startsWith("//");
}

function logMissingSrc() {
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.error("CdnImage: Either src or keySrc must be provided");
  }
}

function logExternalUrl(src) {
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.warn(
      `CdnImage: External URL detected (${src}). Ensure it's whitelisted in next.config.js remotePatterns to prevent 500s.`
    );
  }
}

function resolveSrc(src, keySrc, ext, prefix) {
  if (!src && !keySrc) {
    logMissingSrc();
    return "/placeholder.jpg";
  }

  if (isFullUrl(src)) {
    logExternalUrl(src);
    return src;
  }

  if (keySrc) return buildCdnSrc({ key: keySrc, ext, prefix });
  if (isLocalPath(src)) return src;
  return buildCdnSrc({ key: src, ext, prefix });
}

function getAriaProps(decorative, alt) {
  return decorative ? { alt: "", "aria-hidden": true } : { alt };
}

function getWrapperStyle(ratio, fill, style) {
  if (!fill) return style;

  const baseStyle = {
    width: "100%",
    height: "100%",
    ...style,
    position: "relative", // Always override position after user styles
  };

  return ratio ? { ...baseStyle, aspectRatio: ratio } : baseStyle;
}

function createImageProps(finalSrc, ariaProps, commonProps) {
  return {
    src: finalSrc,
    ...ariaProps,
    ...commonProps,
  };
}

// wrapper around Next.js Image for our CDN
const CdnImage = forwardRef(function CdnImage(
  {
    src,
    keySrc,
    prefix = "",
    ext = "webp",
    alt = "",
    decorative = false,
    width,
    height,
    fill = false,
    ratio,
    className,
    style,
    quality = 75,
    placeholder = "empty",
    blurDataURL,
    priority = false,
    fetchPriority,
    unoptimized = false,
    loading,
    decoding,
    onLoadingComplete,
    onError,
    ...rest
  },
  ref
) {
  const finalSrc = resolveSrc(src, keySrc, ext, prefix);
  const ariaProps = getAriaProps(decorative, alt);
  const wrapperStyle = getWrapperStyle(ratio, fill, style);

  const hasInvalidDimensions =
    !fill && (typeof width !== "number" || typeof height !== "number");
  if (hasInvalidDimensions && process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.warn(
      "CdnImage: width/height numbers are required when not using `fill` to prevent CLS."
    );
  }

  if (alt == null && process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.warn(
      "CdnImage: `alt` is required. Use empty string for decorative images."
    );
  }

  const commonProps = {
    quality,
    placeholder,
    blurDataURL,
    priority,
    fetchPriority,
    unoptimized,
    loading,
    decoding,
    onLoadingComplete,
    onError,
    ...rest,
  };

  if (fill) {
    return (
      <div className={className} style={wrapperStyle}>
        <Image
          ref={ref}
          {...createImageProps(finalSrc, ariaProps, { fill, ...commonProps })}
        />
      </div>
    );
  }

  return (
    <Image
      ref={ref}
      {...createImageProps(finalSrc, ariaProps, {
        width,
        height,
        className,
        style,
        ...commonProps,
      })}
    />
  );
});

export default CdnImage;

// TODO: might want to add lazy loading options later
// TODO: consider adding image optimization presets
