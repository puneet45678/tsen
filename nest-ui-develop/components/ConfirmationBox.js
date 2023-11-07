import React, { useState, useEffect } from "react";
import ModalCenter from "./ModalCenter";
import CancelIcon from "../../../icons/CancelIcon";
import CheckIcon from "../../../icons/CheckIcon";
import { useSelector } from "react-redux";
import Image from "next/image";
import Link from "next/link";
import moment from "moment";

const ConfirmationBox = (props) => {
  const model = useSelector((state) => state.model);
  const [rating, setRating] = useState();

  return (
    <ModalCenter closeModal={props.closeModal}>
      <div className="grid gap-4 px-5 py-7 bg-white w-full max-w-[40rem] h-fit rounded-[5px]">
        <div className="flex justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="relative w-28 h-28 rounded-[5px] overflow-hidden bg-gray-400">
              {model?.coverImage && (
                <Image alt="Model Cover Image" src={props.img} fill />
              )}
            </div>
            <div className="grid gap-2">
              <h6 className="font-medium">{props.title}</h6>
              <span className="text-[14px]">{props.id}</span>
            </div>
          </div>
          <div className="h-6 w-6 cursor-pointer" onClick={props.closeModal}>
            <CancelIcon />
          </div>
        </div>
        <div className="h-0 border-t-[1px] border-borderGray"></div>
        <div>
          <TimelineContainer
            items={[
              {
                withCheckBox: true,
                value: (
                  <div key={"item-1"}>
                    <span className="font-medium">
                      Your model has been submitted
                    </span>
                    <span className="text-textGray">
                      {" "}
                      on {moment.utc().format("ddd, DD MMMM")}
                    </span>
                  </div>
                ),
                isReached: true,
              },
              {
                withCheckBox: false,
                value: (
                  <div key={"item-2"}>
                    <span className="font-medium">Under review process</span>
                    <span>
                      (
                      <Link href={""} className="underline text-textGray">
                        learn more
                      </Link>
                      )
                    </span>
                  </div>
                ),
                isReached: false,
              },
              {
                withCheckBox: true,
                value: (
                  <div key={"item-3"}>
                    <p className="font-medium">
                      Ready to be put on marketplace or campaigns
                    </p>
                    <p className="text-textGray">
                      (If visibility is public, model will be automatically
                      published on marketplace)
                    </p>
                  </div>
                ),
                isReached: false,
              },
            ]}
            percentage={25}
            modelId={props.id}
          />
        </div>
        <div className="grid gap-4 bg-backgroundGrayLight py-3 px-4 rounded-[5px] border-[1px] border-borderGray">
          <p className="font-semibold">
            How was your experience while uploading your model?
          </p>
          <div>
            <div className="flex gap-3 h-10">
              <RatingContainer
                rating={rating}
                setRating={setRating}
                value={1}
              />
              <RatingContainer
                rating={rating}
                setRating={setRating}
                value={2}
              />
              <RatingContainer
                rating={rating}
                setRating={setRating}
                value={3}
              />
              <RatingContainer
                rating={rating}
                setRating={setRating}
                value={4}
              />
              <RatingContainer
                rating={rating}
                setRating={setRating}
                value={5}
              />
            </div>
            <div className="flex justify-between text-[12px] text-">
              <span>poor</span>
              <span>really good</span>
            </div>
          </div>
          {rating && (
            <textarea
              className="resize-none border-[1px] border-borderGray w-full rounded-[5px] p-2.5 focus:outline-none h-32 text-[14px]"
              placeholder="Write your comments"
            ></textarea>
          )}
        </div>
        {rating && (
          <div className="block">
            <button className="float-right bg-black text-white rounded-[5px] h-10 px-5">
              Continue
            </button>
          </div>
        )}
      </div>
    </ModalCenter>
  );
};

const TimelineContainer = (props) => {
  return (
    <div className="flex flex-cols gap-2 text-[14px]">
      <div className="flex justify-center justify-items-center h-max relative">
        <div className="bg-backgroundGrayDark w-1 h-full absolute">
          <div
            style={{ height: `${props.percentage}%` }}
            className={`bg-black w-full`}
          ></div>
        </div>
        <div className="flex flex-col gap-20 z-10">
          {props.items.map((item, index) => {
            if (item.withCheckBox) {
              return (
                <div
                  key={index}
                  className={`h-8 w-8 p-2 rounded-full text-white ${
                    item.isReached ? "bg-black" : "bg-backgroundGrayDark"
                  }`}
                >
                  <CheckIcon width={5} />
                </div>
              );
            } else {
              return (
                <div key={index} className="grid justify-items-center">
                  <div
                    className={`h-5 w-5 rounded-full ${
                      item.isReached ? "bg-black" : "bg-backgroundGrayDark"
                    }`}
                  ></div>
                </div>
              );
            }
          })}
        </div>
      </div>
      <div className="flex flex-col gap-20">
        {props.items.map((item, index) => (
          <div
            key={index}
            className={`flex items-center ${
              item.withCheckBox ? "min-h-[2rem]" : "min-h-[1.25rem]"
            }`}
          >
            {item.value}
          </div>
        ))}
      </div>
    </div>
  );
};

const RatingContainer = (props) => {
  return (
    <div
      onClick={() => props.setRating(props.value)}
      className={`${
        props.rating === props.value ? "bg-black text-white" : ""
      } flex items-center justify-center w-1/5 h-full border-[1px] border-borderGray rounded-[5px] cursor-pointer`}
    >
      {props.value}
    </div>
  );
};

export default ConfirmationBox;