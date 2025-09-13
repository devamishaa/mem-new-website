"use client";

import { useEffect, useRef } from "react";
import SvgIcon from "../common/svg/SvgIcon";
import { planVideos } from "@/constants/planVideos";
import {
  safeCreateScript,
  safeRemoveElements,
  safeRemoveChild,
} from "@/utils/dom-utils";

// Helper to inject and clean up video script (from old implementation)
function useVidalyticsScript(isOpen, videoScript) {
  const attachVideoScriptRef = useRef(null);

  useEffect(() => {
    if (isOpen && videoScript) {
      // Clean up existing scripts using safe DOM utilities
      safeRemoveElements("script[data-vidalytics]");

      // Extract and inject the JavaScript part of the video script
      const scriptContent =
        videoScript
          .split('<script type="text/javascript">')[1]
          ?.split("</script>")[0] || "";

      const script = safeCreateScript(scriptContent, {
        "data-vidalytics": "true",
      });
      attachVideoScriptRef.current = script;
    }

    return () => {
      if (attachVideoScriptRef.current) {
        safeRemoveChild(attachVideoScriptRef.current);
        attachVideoScriptRef.current = null;
      }
    };
  }, [isOpen, videoScript]);
}

const VideoModal = ({ planName, onClose, timezoneConfig }) => {
  const shouldShowIndianContent = timezoneConfig?.isIndian || false;
  const isRestOfTheWorld =
    !timezoneConfig?.isIndian && !timezoneConfig?.isLatinAmerican;

  const videoData = planVideos(shouldShowIndianContent, isRestOfTheWorld)[
    planName
  ];

  // Use the script injection hook like the old implementation
  useVidalyticsScript(true, videoData?.videoScript);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  if (!videoData) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={onClose}
    >
      <div
        className="relative w-[90%] max-w-[800px] max-h-[80vh] rounded-2xl bg-[#1a1f23] p-1"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute right-4 top-4 z-[9999] flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-none bg-white/10 text-white transition-colors duration-200 ease-in-out hover:bg-white/20"
          onClick={onClose}
        >
          <SvgIcon name="X" size={24} />
        </button>
        <div className="flex w-full items-center justify-center rounded-lg bg-black aspect-video">
          {videoData.videoScript ? (
            <div
              dangerouslySetInnerHTML={{
                __html:
                  videoData.videoScript
                    .split("</script>")[0]
                    .split('<script type="text/javascript">')[0] || "",
              }}
              style={{ width: "100%", height: "100%" }}
            />
          ) : (
            <div className="text-center text-white">
              <p>Video player for {planName} plan would be rendered here</p>
              <p>Thumbnail: {videoData.thumbnail}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
