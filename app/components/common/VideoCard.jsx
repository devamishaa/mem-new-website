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
        "group flex w-full shrink-0 cursor-pointer flex-row items-center justify-start gap-4 overflow-hidden rounded-xl border-none bg-[#eaf2f1] p-2 text-left font-figtree text-base text-[#121723] transition-all duration-200 ease-in-out hover:-translate-y-px hover:bg-[#e0f0ef] focus:outline-2 focus:outline-[#557bf4] focus:outline-offset-2 active:translate-y-0 h-[70px] sm:h-[87px] min-h-[70px] sm:min-h-[87px]",
        className
      )}
      onClick={onClick}
      type="button"
      {...props}
    >
      <div className="relative h-full self-stretch w-[100px] sm:w-[129px] shrink-0 overflow-hidden rounded-lg bg-[#555]">
        {thumbnail ? (
          thumbnail.includes(".gif") ? (
            <img
              src={thumbnail}
              alt={title}
              className="absolute left-1/2 top-1/2 h-[70px] w-[120px] sm:h-[87px] sm:w-[151px] -translate-x-1/2 -translate-y-1/2 object-cover"
            />
          ) : (
            <CdnImage
              src={thumbnail}
              alt={title}
              className="absolute left-1/2 top-1/2 h-[70px] w-[120px] sm:h-[87px] sm:w-[151px] -translate-x-1/2 -translate-y-1/2 object-cover"
              width={151}
              height={87}
            />
          )
        ) : (
          <div className="absolute left-1/2 top-1/2 flex h-[70px] w-[120px] sm:h-[87px] sm:w-[151px] -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-[#333] text-white" />
        )}
        <div className="absolute left-1/2 top-1/2 flex h-[30px] w-[30px] sm:h-[38px] sm:w-[38px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 transition-all duration-200 ease-in-out group-hover:scale-110 group-hover:bg-black/80">
          <SvgIcon
            name="PlayButton"
            className="h-[30px] w-[30px] sm:h-[38px] sm:w-[38px] rounded-full text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
            size={30}
          />
        </div>
      </div>

      <div className="relative inline-block w-auto sm:w-[149px] flex-1 sm:flex-none shrink-0 font-normal leading-[1.3]">
        <span className="block text-[12px] sm:text-base text-[#121723]">
          {title}
        </span>
        <span className="flex items-center gap-1 bg-gradient-to-r from-[#9734e6] to-[#e5469f] bg-clip-text text-[11px] font-normal text-transparent">
          {planPrefix} {planName}
        </span>
      </div>
    </button>
  );
};

export default VideoCard;
