import React, { useState } from "react";
import Image from "next/image";
import { BsBookmarkStar, BsHeart, BsEye } from "react-icons/bs";
// import myCampaigns from "../pages/my-campaigns";
import { useRouter } from "next/router";
import Link from "next/link";

const CampaignCard = (props) => {
  const router = useRouter();
  const [hovering, setHovering] = useState(false);
  console.log("props", props);
  console.log("hovering", hovering);

  return (
    <div
      className="flex flex-col w-full max-w-[26rem] m-auto rounded-sm shadow-md transition-all ease-in-out duration-500 hover:shadow-lg border-[1px] relative overflow-hidden"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div className="relative rounded-sm">
        {hovering && (
          <Link
            href={`/user/${props.campaign.creatorName}`}
            className="flex gap-2 items-center justify-center absolute top-1 left-2 cursor-pointer"
          >
            <Image
              src={props.campaign.displayPic}
              alt="Campaign Creator Profile Picture"
              className="rounded-full"
              width={25}
              height={25}
            />
            <span>{props.campaign.creatorName}</span>
          </Link>
        )}
        <img
          src={props.campaign.coverPic}
          alt="Campaign Cover Image"
          className="w-full rounded-sm"
        />
      </div>
      <div className="relative h-fit md:h-10">
        <div
          className={`${
            hovering ? " -translate-y-16" : ""
          } origin-top bg-white grow flex flex-col w-full transition-all ease-in-out duration-1000 `}
        >
          <div className="flex justify-between font-medium text-[15px] md:text-[18px] items-center px-3 py-2">
            <span>Campaign Name</span>
            <BsBookmarkStar className="text-[15px] sm:text-[25px]" />
          </div>
          <div className="px-3 xs:flex xs:gap-2">
            <div className="flex items-center grow justify-between">
              <div className="flex gap-2 mt-4 text-secondary-text-icons-button-text text-[12px] md:text-[14px] font-medium">
                <div className="flex items-center gap-1">
                  <BsHeart />
                  <span>
                    {props.campaign.likes >= 1000
                      ? `${Math.floor(props.campaign.likes / 1000)}k`
                      : `${props.campaign.likes}`}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <BsEye />
                  <span>{props.campaign.views}k</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex px-3 justify-between items-center text-[12px] md:text-[14px] font-medium text-secondary-text-icons-button-text">
            <p>
              US $<span className="text-black">{props.campaign.goal}</span>
              &nbsp;goal
            </p>
            <p>
              <span className="text-black"> {props.campaign.backers}</span>
              &nbsp;backers
            </p>
            <p>
              <span className="text-black"> {props.campaign.daysToGo}</span>
              &nbsp;days to go
            </p>
          </div>
        </div>
      </div>
      <button className="relative bottom-0 w-full bg-primary-brand text-white rounded-b-sm py-2 font-medium text-[16px]">
        Back this campaign
      </button>
    </div>
  );
};

export default CampaignCard;
