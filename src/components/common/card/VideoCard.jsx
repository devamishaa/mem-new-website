"use client";

import React from "react";
import SvgIcon from "@/components/common/svg/SvgIcon";
import CdnImage from "@/components/common/images/CdnImage";
import styles from "./VideoCard.module.css";
import PlayIcon from "../../../../public/PlayIcon";

const VideoCard = ({
  thumbnail,
  title,
  subtitle,
  planName,
  planPrefix = "Memorae",
  onClick,
  className = "",
  ...props
}) => {
  return (
    <button
      className={`${styles.frameParent} ${className}`}
      onClick={onClick}
      type="button"
      {...props}
    >
      <div className={styles.thumbnailContainer}>
        {thumbnail ? (
          thumbnail.includes(".gif") ? (
            <img
              src={thumbnail}
              alt={title}
              className={styles.thumbnailImage}
            />
          ) : (
            <CdnImage
              src={thumbnail}
              alt={title}
              className={styles.thumbnailImage}
              width={151}
              height={87}
            />
          )
        ) : (
          <div className={styles.placeholderImage} />
        )}
        <div className={styles.playButtonContainer}>
          <PlayIcon fill="#fff" />
          {/* <SvgIcon
            name="PlayButton"
            className={styles.playButtonIcon}
            size={38}
          /> */}
        </div>
      </div>

      <div className={styles.textContainer}>
        <span className={styles.demoText}>{title}</span>
        <span className={styles.planName}>
          {planPrefix} {planName}
        </span>
      </div>
    </button>
  );
};

export default VideoCard;
