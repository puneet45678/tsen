import React from "react";
import User from "../icons/User";
import UploadcareImage from "@uploadcare/nextjs-loader";

const Avatar = ({
  type,
  imageSrc,
  size,
  backgroundColor,
  notificationNumber,
}) => {
  return (
    <div
      className={`flex-center aspect-square rounded-full bg-primary-purple-50 text-primary-purple-700 relative ${
        size === "xxs"
          ? "w-6 h-6 p-[7px]"
          : size === "xs"
          ? "w-8 h-8 p-2"
          : size === "sm"
          ? "w-10 h-10 p-[11px]"
          : size === "md-1"
          ? "w-12 h-12 p-3"
          : size === "md-2"
          ? "w-14 h-14 p-3"
          : size === "lg"
          ? "w-16 h-16 p-[14px]"
          : size === "xl"
          ? "w-24 h-24 p-6"
          : "w-32 h-32 p-8"
      }`}
    >
      {imageSrc ? (
        <UploadcareImage
          src={imageSrc}
          alt="User Profile Picture"
          className="rounded-full"
          fill
        />
      ) : (
        <div
          className={`aspect-square ${
            size === "xxs"
              ? "w-[10px] h-[10px]"
              : size === "xs"
              ? "w-4 h-4"
              : size === "sm"
              ? "w-[18px] h-[18px]"
              : size === "md-1"
              ? "w-6 h-6"
              : size === "md-2"
              ? "w-8 h-8"
              : size === "lg"
              ? "w-9 h-9"
              : size === "xl"
              ? "w-12 h-12"
              : "w-16 h-16"
          }`}
        >
          <User />
        </div>
      )}
      {type === "status" ? (
        <div
          className={`flex-center absolute right-0 bottom-0 aspect-square ${
            backgroundColor ? backgroundColor : "bg-white"
          } ${
            size === "xxs"
              ? "w-[6px] h-[6px]"
              : size === "xs"
              ? "w-2 h-2"
              : size === "sm"
              ? "w-[10px] h-[10px]"
              : size === "md-1"
              ? "w-3 h-3"
              : size === "md-2"
              ? "w-[14px] h-[14px]"
              : size === "lg"
              ? "w-4 h-4"
              : size === "xl"
              ? "w-[24px] h-[24px]"
              : "w-8 h-8"
          }`}
        >
          <div
            className={`rounded-full w-full h-full bg-success-600 ${
              size === "xxs"
                ? "w-[3px] h-[3px]"
                : size === "xs"
                ? "w-[5px] h-[5px]"
                : size === "sm"
                ? "w-[7px] h-[7px]"
                : size === "md-1"
                ? "w-[9px] h-[9px]"
                : size === "md-2"
                ? "w-[11px] h-[11px]"
                : size === "lg"
                ? "w-[13px] h-[13px]"
                : size === "xl"
                ? "w-[21px] h-[21px]"
                : "w-[29px] h-[29px]"
            }`}
          ></div>
        </div>
      ) : type === "notification" ? (
        <div
          className={`absolute right-0 top-0 aspect-square ${
            backgroundColor ? backgroundColor : "bg-white"
          } ${
            size === "xxs"
              ? "w-[6px] h-[6px]"
              : size === "xs"
              ? "w-2 h-2"
              : size === "sm"
              ? "w-[10px] h-[10px]"
              : size === "md-1"
              ? "w-3 h-3"
              : size === "md-2"
              ? "w-[14px] h-[14px]"
              : size === "lg"
              ? "w-4 h-4"
              : size === "xl"
              ? "w-[24px] h-[24px]"
              : "w-8 h-8"
          }`}
        >
          <div
            className={`flex-center rounded-full w-full h-full bg-primary-purple-600 text-white ${
              size === "xxs"
                ? "w-[3px] h-[3px]"
                : size === "xs"
                ? "w-[5px] h-[5px]"
                : size === "sm"
                ? "w-[7px] h-[7px]"
                : size === "md-1"
                ? "w-[9px] h-[9px]"
                : size === "md-2"
                ? "w-[13px] h-[13px]"
                : size === "lg"
                ? "w-[13px] h-[13px]"
                : size === "xl"
                ? "w-[21px] h-[21px]"
                : "w-7 h-w-7"
            }`}
          >
            {notificationNumber}
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Avatar;
