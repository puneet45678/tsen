import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import cartWishlistCard from "../../icons/cartWishlistCard";
import Cart from "../../icons/cartWishlistCard";

const PortfolioCardModels = (props) => {
  const [profilePicture, setProfilePicture] = useState();
  const user = useSelector((state) => state.user);
  const dateToday = moment.utc(new Date());
  const modelDate = moment.utc(props.publish_date_time);
  const [updatedDate, setUpdatedDate] = useState(
    dateToday.diff(modelDate, "years") > 1
      ? `${dateToday.diff(modelDate, "years")} years`
      : dateToday.diff(modelDate, "years") == 1
      ? `${dateToday.diff(modelDate, "years")} year`
      : dateToday.diff(modelDate, "months") > 1
      ? `${dateToday.diff(modelDate, "months")} months`
      : dateToday.diff(modelDate, "months") == 1
      ? `${dateToday.diff(modelDate, "months")} month`
      : dateToday.diff(modelDate, "days") > 1
      ? `${dateToday.diff(modelDate, "days")} days`
      : dateToday.diff(modelDate, "days") == 1
      ? `${dateToday.diff(modelDate, "days")} day`
      : dateToday.diff(modelDate, "hours") > 1
      ? `${dateToday.diff(modelDate, "hours")} hours`
      : dateToday.diff(modelDate, "hours") == 1
      ? `${dateToday.diff(modelDate, "hours")} hour`
      : dateToday.diff(modelDate, "minutes") > 1
      ? `${dateToday.diff(modelDate, "minutes")} minutes`
      : dateToday.diff(modelDate, "minutes") == 1
      ? `${dateToday.diff(modelDate, "minutes")} minute`
      : 0
  );

  useEffect(() => {
    setProfilePicture(
      user?.displayInformation?.profilePicture?.pictureUrl
        ? user.displayInformation.profilePicture.pictureUrl
        : ""
    );
  }, [user]);


  return (
    <>

      <div className="flex flex-col rounded-[10px] shadow-xs cursor-pointer">
        <div
          className={`relative w-full aspect-[7/5] rounded-t-[10px] overflow-hidden flex items-center justify-center`}
        >
          {props.NSFW ? (
            <div className="w-full h-full nsfw-card blur-8"></div>
          ) : (
            <Image
              src={props.coverImage}
              alt="Model Image"
              className="object-cover object-center"
              fill
            />
          )}

          {props.NSFW && (
            <div className="absolute text-lg font-semibold text-white">
              MATURE CONTENT
            </div>
          )}
        </div>
        <div className="flex flex-col gap-[12px] border-[1px] border-light-neutral-600 rounded-b-[10px] px-4 pt-4 pb-6 text-dark-neutral-700">
          <h6 className="text-ellipsis overflow-hidden whitespace-nowrap font-semibold text-lg">
            {props.portfolioName}
          </h6>
            <div className="flex flex-col gap-[16px]">

            <div className="flex gap-[12px]">
                
                <div className="relative rounded-full w-10 h-10 border-[1px] border-icons-border bg-accent1">
                <Image
                      className="m-auto object-cover rounded-full h-10 w-10"
                      alt="Profile Picture"
                      src={props.artist_portfolio_picture}
                      fill
                    />
                </div>
                <span className="my-auto">By {props.artist_name}</span>
            </div>

            <div className="flex flex-col gap-[12px]">
            <div className="flex gap-[55px]">
                <span></span>
                <span className="text-primary-purple-500 text-xl font-[700]">$ {props.product_amount}</span>
            </div>
            <div className="flex gap-[12px]">
                <span className="bg-white shadow-sm p-[11px] rounded-[5px]"><Cart/></span>
                <button className="px-[12px] py-[8px] bg-primary-purple-500 text-white shadow-xs rounded-[4px] w-full">Buy Now</button>
            </div>
            </div>

            </div>
         
        </div>
      </div>
    </>
  );
};
export default PortfolioCardModels;
