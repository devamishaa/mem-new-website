"use client";

import React from "react";
import SvgIcon from "../common/svg/SvgIcon";
import CdnImage from "@/app/components/common/CdnImage";
import clsx from "clsx";

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
      className={clsx(
        "group flex h-[87px] w-full shrink-0 cursor-pointer flex-row items-center justify-start gap-4 overflow-hidden rounded-xl border-none bg-[#eaf2f1] p-2 text-left font-figtree text-base text-[#121723] transition-all duration-200 ease-in-out hover:-translate-y-px hover:bg-[#e0f0ef] focus:outline-2 focus:outline-[#557bf4] focus:outline-offset-2 active:translate-y-0 max-md:h-auto max-md:min-h-[87px] max-md:px-2 max-md:py-3",
        className
      )}
      onClick={onClick}
      type="button"
      {...props}
    >
      <div className="relative h-full self-stretch w-[129px] shrink-0 overflow-hidden rounded-lg bg-[#555] max-md:w-[100px]">
        {thumbnail ? (
          thumbnail.includes(".gif") ? (
            <img
              src={thumbnail}
              alt={title}
              className="absolute left-1/2 top-1/2 h-[87px] w-[151px] -translate-x-1/2 -translate-y-1/2 object-cover max-md:h-[70px] max-md:w-[120px]"
            />
          ) : (
            <CdnImage
              src={thumbnail}
              alt={title}
              className="absolute left-1/2 top-1/2 h-[87px] w-[151px] -translate-x-1/2 -translate-y-1/2 object-cover max-md:h-[70px] max-md:w-[120px]"
              width={151}
              height={87}
            />
          )
        ) : (
          <div className="absolute left-1/2 top-1/2 flex h-[87px] w-[151px] -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-[#333] text-white" />
        )}
        <div className="absolute left-1/2 top-1/2 flex h-[38px] w-[38px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 transition-all duration-200 ease-in-out group-hover:scale-110 group-hover:bg-black/80">
          <SvgIcon
            name="PlayButton"
            className="h-[38px] w-[38px] rounded-full text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
            size={38}
          />
        </div>
      </div>

      <div className="relative inline-block w-[149px] shrink-0 font-semibold leading-[1.3] max-md:w-auto max-md:flex-1">
        <span className="block text-base text-[#121723] max-md:text-sm">
          {title}
        </span>
        <span className="flex items-center gap-1 bg-gradient-to-r from-[#9734e6] to-[#e5469f] bg-clip-text text-sm font-semibold text-transparent">
          {planPrefix} {planName}
        </span>
      </div>
    </button>
  );
};

export default VideoCard;
