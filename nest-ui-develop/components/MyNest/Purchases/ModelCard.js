import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import ArrowTopRightRectangle from "../../../icons/ArrowTopRightRectangle";
import LockIcon from "../../../icons/LockIcon";
import MoreIcon from "../../../icons/MoreIcon";
import Image from "next/image";
import ModalCenter from "../../ModalCenter";
import CancelIcon from "../../../icons/CancelIcon";

const ModelCard = (props) => {
  return (
    <div className="flex flex-col gap-2 border-[1px] group rounded-[5px] overflow-hidden">
      <div
        className={`bg-gray-300 w-full aspect-[5/3] overflow-hidden relative`}
      >
        {props.coverImage && (
          <Image
            src={props.coverImage}
            className="w-full h-full object-cover object-center"
            alt="Model Cover Image"
            fill
          />
        )}
        <div
          className={`opacity-0 group-hover:opacity-100 absolute top-2 right-2 bg-white p-1 rounded-[5px] duration-500 ease-in-out`}
        >
          <Link href={`/model/${props.id}`} className="h-4 w-4 block">
            <ArrowTopRightRectangle />
          </Link>
        </div>
      </div>
      <div className="grid gap-3 bg-white p-4">
        <div className="text-lg font-medium text-left w-full truncate">
          {props.modelName}
        </div>
        <div className="flex items-center justify-start gap-3">
          <div className="h-8 w-8 relative rounded-full overflow-hidden">
            <Image
              src={props.ownerImage}
              fill
              className="rounded-full object-cover object-center"
            />
          </div>
          <span className="text-sm text-dark-neutral-700">
            by {props.ownerName}
          </span>
        </div>
        <div className="flex text-[14px] bg-light-neutral-100 p-2 rounded-[5px] justify-between w-full">
          <div className="flex items-center justify-center gap-2">
            <span>License</span>
            <Image src="/SVG/Information.svg" height={10} width={10} />
          </div>
          <span className="text-uppercase text-dark-neutral-700 font-semibold uppercase">
            {props.license}
          </span>
        </div>
        <div className="flex gap-[10px] h-9">
          <button className="h-full aspect-square flex items-center justify-center border-[1px] border-light-neutral-600 rounded-[5px] shadow-xs">
            <Image src="/SVG/Download.svg" height={18} width={18} />
          </button>
          <button className="flex items-center justify-center gap-[6px] grow bg-primary-purple-500 text-white text-button-text-sm font-semibold rounded-[5px] shadow-xs">
            Slice It
            <Image src="/SVG/Arrow_Right.svg" height={16} width={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
export default ModelCard;
