import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import cartWishlistCard from "../../icons/cartWishlistCard";
import Cart from "../../icons/cartWishlistCard";
import ArrowUpWishlistCampaignCard from "../../icons/ArrowUpWishlistCampaignCard";
import BackersWishlistCard from "../../icons/BackersWishlistCard";
import RewardTiersWishlistCard from "../../icons/RewardTiersWishlistCard";
import axios from "axios";

function TimestampDisplay({ _timestamp }) {
  const timestamp = _timestamp;
  const date = new Date(timestamp);
  const options = { day: "numeric", month: "long" };
  const formattedDate = date.toLocaleDateString(undefined, options);
  return <span className="text-sm font-[500]">Ends on {formattedDate}</span>;
}

export default function WishlistCardCampaigns(props) {
  console.log(props)
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
      <div className="flex flex-col rounded-[10px] shadow-xs cursor-pointer bg-white border-[1px] border-light-neutral-600">
        <div className="flex flex-col gap-[24px]">
          <div className="flex justify-between mt-[24px] mx-[16px]">
            <span className="text-xl font-[500] text-primary-purple-600 flex gap-[4px]">
              <ArrowUpWishlistCampaignCard /> $ {props.amount_raised} raised
            </span>
            <div className="bg-light-neutral-100 rounded-[100px] py-[4px] px-[10px] text-sm">
              <TimestampDisplay _timestamp={props.end_date} />
            </div>
          </div>
          <div
            className={`relative w-full aspect-[7/5] overflow-hidden flex items-center justify-center`}
          >
            {props.NSFW ? (
              <div className="w-full h-full nsfw-card blur-8"></div>
            ) : (
              <>
                <div className="absolute bg-success-600 z-[9] text-white top-[14px] px-[10px] rounded-[5px] py-[2px] left-[16px] flex gap-[4px]">
                  <span className="bg-white h-[6px] w-[6px] rounded-full my-auto"></span>
                  <span>{props.campaign_status}</span>
                </div>

                <Image
                width={432}
                height={200}
                  src={props.coverImage}
                  alt="Campaign Image"
                  className="object-cover object-center aspect-[59/25]"
                  // fill
                />
              </>
            )}

            {props.NSFW && (
              <div className="absolute text-lg font-semibold text-white">
                MATURE CONTENT
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-[12px] rounded-b-[10px] px-4 pt-4 pb-6 text-dark-neutral-700">
          <h6 className="text-ellipsis font-[600] overflow-hidden whitespace-nowrap text-lg">
            {props.portfolioName}
          </h6>
          <div className="flex flex-col gap-[16px]">
            <div className="flex gap-[16px]">
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

            <div className="flex flex-col gap-[24px]">
              <div className="flex gap-[55px]">
                <span></span>
                {/* <span className="text-primary-purple-500 text-xl font-[700]">$ {props.product_amount}</span> */}
              </div>
              <div className="flex justify-between rounded-[5px] bg-light-neutral-100 px-[24px] py-[12px]">
                <div className="flex gap-[5px]">
                  <span className="flex gap-[8px] text-sm font-[600]">
                    <span className="my-auto">
                      <BackersWishlistCard />
                    </span>{" "}
                    <span className="text-sm font-[600]">{props.backers} </span>
                  </span>
                  <span className="text-sm font-[400]">Backers</span>
                </div>
                <div className="flex gap-[5px]">
                  <span className="text-sm flex gap-[8px]">
                    <span className="text-sm font-[600] my-auto">
                      <RewardTiersWishlistCard />
                    </span>{" "}
                    <span className="text-sm font-[600]">
                      {props.reward_tiers}
                    </span>{" "}
                  </span>
                  <span className="text-sm">Reward Tiers</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
