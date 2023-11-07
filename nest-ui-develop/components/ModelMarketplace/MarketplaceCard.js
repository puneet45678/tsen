import Image from "next/image";
import Link from "next/link";
import React from "react";
import MatureContentPlaceholder from "./MatureContentPlaceholder";

const MarketplaceCard = (props) => {
  return (
    <Link
      href={`/model/${props.id}`}
      className="flex flex-col rounded-[10px] shadow-xs"
    >
      <div
        className={`relative w-full aspect-[5/3] rounded-t-[10px] overflow-hidden flex items-center justify-center`}
      >
        {props?.NSFW && props?.image && (
          <div className="w-full h-full nsfw-card blur-8"></div>
        )}
        {props?.NSFW && (
          <MatureContentPlaceholder/>
        )}
      </div>
      <div className="flex flex-col gap-3 border-[1px] border-light-neutral-600 rounded-b-[10px] px-4 pt-4 pb-6 text-dark-neutral-700">
        <h6 className="text-ellipsis overflow-hidden whitespace-nowrap font-semibold text-lg">
          {props?.modelName}
        </h6>
        <div className="flex items-center justify-start gap-3">
          <div className="relative w-8 h-8 bg-gray-300 rounded-full overflow-hidden">
            {props?.userImage && (
              <Image
                src={props?.userImage}
                alt="Model Create Image"
                className="object-cover object-center"
                fill
              />
            )}
          </div>
          <span className="text-sm">by {props?.username}</span>
        </div>
        <div className="flex justify-between">
          <div className="w-[10px]"></div>
          <span className="text-primary-purple-500 text-xl font-bold">
            $ {props?.price}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default MarketplaceCard;
