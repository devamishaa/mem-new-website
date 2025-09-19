"use client";

import { useEffect, useRef } from "react";
import SvgIcon from "@/components/common/svg/SvgIcon";
import { planVideos } from "@/constants/planVideos";
import styles from "@/styles/components/common/modal/VideoModal.module.css";

// Helper to inject and clean up video script (from old implementation)
function useVidalyticsScript(isOpen, videoScript) {
  const attachVideoScriptRef = useRef(null);

  useEffect(() => {
    if (isOpen && videoScript) {
      // Clean up existing scripts
      const existingScripts = document.querySelectorAll(
        "script[data-vidalytics]"
      );
      existingScripts.forEach((script) => script.remove());

      // Extract and inject the JavaScript part of the video script
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.setAttribute("data-vidalytics", "true");
      script.innerHTML =
        videoScript
          .split('<script type="text/javascript">')[1]
          ?.split("</script>")[0] || "";
      document.body.appendChild(script);

      attachVideoScriptRef.current = script;
    }

    return () => {
      if (attachVideoScriptRef.current) {
        attachVideoScriptRef.current.remove();
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
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose}>
          <SvgIcon name="X" size={24} />
        </button>
        <div className={styles.player}>
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
            <div className={styles.placeholder}>
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
