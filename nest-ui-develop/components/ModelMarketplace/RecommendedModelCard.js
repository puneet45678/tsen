import Image from "next/image";
import React from "react";

const RecommendedModelCard = (props) => {
  return (
    <div className="flex w-full h-[226px] bg-white">
      <div className="relative w-[278px] h-[226px]">
        <Image
          src={props.modelImage}
          alt="Model Image"
          className="object-cover object-center"
          fill
        />
      </div>
      <div className="flex flex-col border-y-[1px] border-r-[1px] border-light-neutral-600 rounded-r-[5px] gap-6 p-6 grow">
        <div className="flex flex-col gap-3">
          <div className="text-ellipsis overflow-hidden whitespace-nowrap font-semibold text-xl">
            {props.modelName}
          </div>
          <div className="flex items-center justify-start gap-3">
            <div className="relative w-8 h-8 bg-gray-300 rounded-full overflow-hidden">
              {props.userImage ? (
                <Image
                  src={props.userImage}
                  alt="Model Create Image"
                  className="object-cover object-center"
                  fill
                />
              ) : (
                <></>
              )}
            </div>
            <span className="text-md">by {props.username}</span>
          </div>
        </div>
        <div className="flex gap-6">
          <div className="text-headline-xs font-bold text-primary-purple-500">
            ${props.price}
          </div>
          <div></div>
        </div>
        <div className="grid grid-cols-2 gap-3 h-[36px] w-full text-button-text-sm font-semibold">
          <button className="flex items-center justify-center rounded-[4px] bg-primary-purple-500 shadow-xs text-white">
            Buy now
          </button>
          <button className="flex items-center justify-center rounded-[4px] border-[1px] border-light-neutral-600 shadow-xs text-dark-neutral-700">
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecommendedModelCard;
