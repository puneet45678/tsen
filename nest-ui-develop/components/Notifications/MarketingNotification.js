import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useStreamContext } from "react-activity-feed";
import TimeAgo from "../TimeAgo";
import parse from "html-react-parser";
import { useSelector, useDispatch } from "react-redux";

export default function MarketingNotification({ marketingActivities }) {
  // const { user } = useStreamContext();
  // console.log("MarketingUser: ",user);
  const [profilePicture, setProfilePicture] = useState("");
  const user_current = useSelector((state) => state.user);
  let latestMarketingActivities = marketingActivities;
  console.log("market_activities: ",marketingActivities)
  let timeStamp = latestMarketingActivities?.time;
  // console.log("marketing_uer: ",user_current)
  useEffect(() => {
    setProfilePicture(
      user_current?.displayInformation?.profilePicture?.croppedPictureUrl
        ? user_current.displayInformation.profilePicture.croppedPictureUrl
        : ""
    );
  }, [user_current]);
  // const actor = marketingActivities?.actor;

  return (
    <>
      {/* {marketingActivities.map((mAct) => { */}
        
        
          <div
            className="active p-[15px] flex border-b-2 border-accent1 ml-6 mr-6 min-h-[126px]"
            
          >
            <div className="relative rounded-full w-10 h-10 border-[1px] border-icons-border bg-accent1">
              {profilePicture === "" ? (
                <></>
              ) : (
                <div className="relative w-10 h-10">
                  <Image
                    className="m-auto text-white object-cover rounded-full h-10 w-10"
                    alt="Profile Picture"
                    src={profilePicture}
                    fill
                  />
                </div>
              )}
            </div>

            <div className="ml-[20px] flex-1">
              <div className="flex justify-between">
                <span className="mt-[10px] text-black text-[15px]">
                  <div className="hover:cursor-pointer flex gap-1 justify-between">
                    <div className="hover:underline font-semibold">
                      Ikarus-Nest
                    </div>
                    <div>has an Update</div>
                  </div>
                </span>
                <span className="text-sm mt-[10px]">
                  <TimeAgo timestamp={timeStamp} />
                </span>
              </div>
              <div className="flex gap-4 mt-[4%]">
                <div className="relative w-20 h-20 border-[1px] border-icons-border bg-accent1">
                  {profilePicture === "" ? (
                    <></>
                  ) : (
                    <>
                      <Image
                        className="m-auto text-white object-cover h-20 w-20"
                        alt="Profile Picture"
                        src={profilePicture}
                        fill
                      />
                      l{" "}
                    </>
                  )}
                </div>
                <div className="border-r-2 border-accent1"></div>
                <div className="flex flex-col gap-4 justify-between">
                  <p className="flex gap-2 text-[#888] mt-10px ">
                   {/* {console.log("text_market",mAct?.text)} */}
                   {parse(marketingActivities?.text)}
                    {/* {(marketingActivities!==undefined || marketingActivities!==null)?(parse(mAct?.text) ):null} */}
                  </p>
                 
                </div>
              </div>
            </div>
          </div>
        
      {/* })}  */}
    </>
  );
}