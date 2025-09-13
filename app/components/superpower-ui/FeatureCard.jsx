import clsx from "clsx"; // A utility for conditionally joining classNames. `npm install clsx`

/**
 * Custom styles for pseudo-elements that cannot be replicated with Tailwind utilities.
 */
const CustomArrowStyles = () => (
  <style jsx global>{`
    .bubble-arrow-receiver::after {
      content: "";
      position: absolute;
      border: 0 solid transparent;
      border-top: 9px solid #ffffff; /* Matches receiver bubble background */
      border-radius: 0 20px 0;
      width: 15px;
      height: 30px;
      transform: rotate(145deg);
    }
    .bubble-arrow-sender::after {
      content: "";
      position: absolute;
      border: 0 solid transparent;
      border-top: 9px solid #dcf8c6; /* Matches sender bubble background */
      border-radius: 0 20px 0;
      width: 15px;
      height: 30px;
      transform: rotate(45deg) scaleY(-1);
    }
  `}</style>
);

// Mappings for gradient variants to corresponding Tailwind classes
const gradientBorderStyles = {
  gradientBlue: "border-b-2 border-[#427bdeE6] bg-white/[.05]",
  gradientPurple: "border-b-2 border-[#946cf5E6] bg-white/[.05]",
  gradientGreen: "border-b-2 border-[#228c83E6] bg-white/[.05]",
  gradientOrange: "border-b-2 border-[#c78c0dE6] bg-white/[.05]",
  gradientPink: "border-b-2 border-[#ff66a9E6] bg-white/[.05]",
};

const gradientBgStyles = {
  gradientBlue:
    "bg-[radial-gradient(circle_at_bottom_center,#427bde_0%,#00000001_40%),radial-gradient(50%_50%_at_50%_50%,#00000001_0%,#00000001_100%)]",
  gradientPurple:
    "bg-[radial-gradient(circle_at_bottom_center,#946cf5_0%,transparent_40%),radial-gradient(50%_50%_at_50%_50%,#00000001_0%,rgba(52,84,99,0)_100%)]",
  gradientGreen:
    "bg-[radial-gradient(circle_at_bottom_center,#228c83_0%,transparent_40%),radial-gradient(50%_50%_at_50%_50%,#00000001_0%,rgba(52,84,99,0)_100%)]",
  gradientOrange:
    "bg-[radial-gradient(circle_at_bottom_center,#c78c0d_0%,transparent_40%),radial-gradient(50%_50%_at_50%_50%,#00000001_0%,rgba(52,84,99,0)_100%)]",
  gradientPink:
    "bg-[radial-gradient(circle_at_bottom_center,#ff66a9_0%,transparent_40%),radial-gradient(50%_50%_at_50%_50%,#00000001_0%,rgba(52,84,99,0)_100%)]",
};

/**
 * FeatureCard:
 * - Reusable card component for superpower features
 * - Uses Tailwind CSS for styling
 * - Follows established component patterns
 */
export default function FeatureCard({
  title,
  description,
  className,
  gradient,
  // pass up to two items
  messages = [
    // { side: 'receiver'|'sender', name: 'Benni', text: '...', timestamp: '10:20 pm' }
  ],
}) {
  console.log("FeatureCard props:", {
    title,
    description,
    className,
    gradient,
    messages,
  });
  return (
    <div
      className={clsx(
        "relative shrink-0 overflow-hidden rounded-[32px] p-[0.5em] backdrop-blur-md",
        "w-[380px] min-h-[540px]", // Default desktop styles
        "max-lg:w-[300px] max-lg:min-h-[450px]", // Below 1024px
        "max-md:min-h-[340px] max-md:max-h-[350px]", // Below 768px
        "max-sm:min-h-[280px]", // Below 480px
        gradient && gradientBorderStyles[gradient],
        className
      )}
    >
      <CustomArrowStyles />
      <div
        className={clsx(
          "pointer-events-none absolute inset-0 z-[-1] rounded-3xl",
          gradient && gradientBgStyles[gradient]
        )}
      />
      <div className="relative z-10 p-5 max-md:h-[365px] max-md:p-[14px]">
        <h3 className="mb-4 text-2xl font-semibold leading-tight text-white max-md:mb-2.5 max-md:text-xl max-sm:text-lg">
          {title}
        </h3>
        <p className="text-lg font-normal leading-snug text-[#999] max-md:mb-3 max-md:text-base max-md:leading-tight max-sm:mb-2.5 max-sm:text-sm">
          {description || "No description available"}
        </p>

        {/* chat bubbles (replaces children) */}
        <div className="mt-8 flex flex-col">
          {messages.slice(0, 2).map((m, i) => (
            <SpeechBubble key={i} {...m} />
          ))}
        </div>
      </div>
    </div>
  );
}

function SpeechBubble({
  side = "receiver",
  name,
  text,
  imgSrc,
  imgAlt = "",
  timestamp,
  read = false,
}) {
  const isSender = side === "sender";

  return (
    <div className="mb-[25px] max-md:mb-3">
      <div
        className={clsx(
          "relative block max-w-[314px]",
          "max-md:w-[200px] max-sm:w-[210px]", // Responsive widths
          isSender ? "ml-[60px] rounded-lg bg-[#dcf8c6]" : "rounded-lg bg-white"
        )}
      >
        <div className="grid grid-cols-[1fr_auto_auto] items-end gap-x-2 gap-y-1.5 p-2 max-md:p-2.5">
          {name ? (
            <p
              className={clsx(
                "font-medium",
                isSender ? "text-[#2ecc71]" : "text-[#3498db]"
              )}
            >
              {name}
            </p>
          ) : null}

          {imgSrc ? (
            <div className="w-full">
              <img
                src={imgSrc}
                alt={imgAlt}
                className="mb-1 block h-auto w-full rounded-[3px] max-md:w-[185px]"
              />
              <p className="pt-px text-[17px] text-[#2b2b2b] max-md:mb-4 max-md:pt-px max-md:text-[10px]">
                {text}
              </p>
            </div>
          ) : (
            <p className="pt-px text-[17px] text-[#2b2b2b] max-md:mb-4 max-md:pt-px max-md:text-[10px]">
              {text}
            </p>
          )}

          {isSender && read ? <ReadTicks /> : null}

          {timestamp ? (
            <span className="absolute bottom-2 right-2.5 text-[11px] uppercase text-[#999] max-md:bottom-1.5 max-md:right-2">
              {timestamp}
            </span>
          ) : null}
        </div>

        <div
          className={clsx(
            "absolute h-0 w-0",
            isSender
              ? "right-[-2px] bottom-10 left-auto bubble-arrow-sender"
              : "left-[-16px] bottom-[42px] bubble-arrow-receiver"
          )}
        />
      </div>
    </div>
  );
}

function ReadTicks() {
  return (
    <svg
      className="absolute bottom-2 right-[38px] h-[15px] w-4 fill-none stroke-[#34b7f1] opacity-95 max-md:bottom-1.5 max-md:right-8"
      style={{ strokeWidth: 1.6 }} // stroke-width is not a standard Tailwind utility
      viewBox="0 0 16 15"
      aria-hidden="true"
    >
      <path d="M9.6 6.2L6.1 10.4 4.2 8.3" />
      <path d="M12.8 5.7L8.3 11 7.0 9.5" />
    </svg>
  );
}
