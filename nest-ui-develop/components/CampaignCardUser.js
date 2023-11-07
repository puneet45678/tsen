import React, { useState } from "react";
import Image from "next/image";
import { BsBookmarkStar, BsHeart, BsEye } from "react-icons/bs";
import { useRouter } from "next/router";
import axios from "axios";
import { useDispatch } from "react-redux";
import { async } from "q";
import { setAllData } from "../store/campaignSlice";

const CampaignCardUser = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { section } = router.query;
  const [hovering, setHovering] = useState(false);
  console.log("props", props.campaign);
  console.log("hovering", hovering);

  const handleEdit = async (campaignId) => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE}/api/v1/campaigns/${campaignId}/details`,
      { withCredentials: true }
    );
    console.log("dispatch call", dispatch(setAllData(response.data)));
    router.push(`/createCampaign/${campaignId}/basics`);
  };

  return (
    <div
      className="flex flex-col w-full max-w-[26rem] mb-8 m-auto rounded-sm shadow-md transition-all ease-in-out duration-500 hover:shadow-lg border-[1px] relative overflow-hidden"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div className="relative rounded-sm">
        {hovering && (
          <div className="flex gap-2 items-center justify-center absolute top-1 left-2 cursor-pointer">
            <Image
              src={props.campaign.campaignAssets.campaignDp}
              alt="Campaign Creator Profile Picture"
              className="rounded-full"
              width={25}
              height={25}
            />
            <span>{props.username}</span>
          </div>
        )}
        <Image
          src={props.campaign.campaignAssets.campaignDp}
          alt="Campaign Cover Image"
          className=" object-contain  rounded-sm"
          width={500}
          height={250}
        />
      </div>
      <div className="relative h-fit md:h-10">
        <div
          className={`${
            hovering ? " -translate-y-16" : ""
          } origin-top bg-white grow flex flex-col w-full transition-all ease-in-out duration-1000 `}
        >
          <div className="flex font-medium text-[15px] md:text-[18px] items-center px-3 py-2">
            {props.campaign.basics.about.title}
          </div>
          <div className="px-3 xs:flex xs:gap-2">
            <div className="flex items-center grow justify-between">
              <div>
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
              <BsBookmarkStar className="text-[15px] sm:text-[25px]" />
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

      {section === "draft" ? (
        <>
          <div className="flex ">
            <button
              className="relative bottom-0 w-[50%] bg-primary-brand text-white rounded-b-sm py-2 font-medium text-[16px]"
              onClick={() => handleEdit(props.campaign._id)}
            >
              Edit
            </button>
            <button
              className="relative bottom-0 w-[50%] bg-red-500 text-white rounded-b-sm py-2 font-medium text-[16px]"
              onClick={() => props.setRemoveCampaign(true)}
            >
              Delete
            </button>
          </div>
        </>
      ) : (
        <button className="relative bottom-0 w-full bg-primary-brand text-white rounded-b-sm py-2 font-medium text-[16px]">
          Back this campaign
        </button>
      )}

      {props.removeCampaign ? (
        <>
          <div>
            <div className="fixed inset-0 flex justify-center opacity-75 bg-black z-40"></div>
            <div className="fixed bottom-[50%] bg-white opacity-100 w-fit h-auto z-50 mx-auto left-0 right-0 rounded-sm">
              <div className="flex flex-col justify-center">
                <div className="mt-4 mx-16" id="alert-message">
                  Are you Sure You Want to Remove
                  <span className="font-bold">
                    {props.campaign.basics.about.title}
                  </span>
                  Campaign?
                </div>
                <div className="mt-7 mb-6 mx-auto flex flex-row justify-between gap-4">
                  <div className="">
                    <button
                      className="w-[70px] text-sm  text-white py-1 bg-red-500 hover:bg-red-400 cursor-pointe"
                      onClick={() => {
                        props.handleDelete(props.campaign._id, props.index);
                        console.log("remove pressed");
                      }}
                    >
                      Remove
                    </button>
                  </div>
                  <button
                    className=" w-[70px] text-sm bg-primary-brand hover:bg-sky-500  text-white py-1 "
                    onClick={() => {
                      props.setRemoveCampaign(false);
                      console.log("cancelled called");
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default CampaignCardUser;
