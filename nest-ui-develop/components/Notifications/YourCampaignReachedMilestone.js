import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useStreamContext } from "react-activity-feed";
import TimeAgo from "../TimeAgo";
import parse from "html-react-parser";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";

export default function YourCampaignReachedMilestone({your_campaign_reached_milestone_activities}) {
    const [profilePicture, setProfilePicture] = useState("");
    const user_current = useSelector((state) => state.user);
    let latest_campaign_published_activities = your_campaign_reached_milestone_activities;
    let timeStamp = latest_campaign_published_activities?.time;
    const router = useRouter()
  
    useEffect(() => {
      setProfilePicture(
        user_current?.displayInformation?.profilePicture?.croppedPictureUrl
          ? user_current.displayInformation.profilePicture.croppedPictureUrl
          : ""
      );
    }, [user_current]);
  
  
    return (
      <>
        {/* {marketingActivities.map((mAct) => { */}
          
          
            <div
              className="active p-[15px] flex border-b-2 border-accent1 ml-6 mr-6 min-h-[126px]"
              
            >
              <div className="relative rounded-full w-10 h-10 border-[1px] border-icons-border bg-accent1">
                
                  <div className="relative w-[48px] h-[48px]">
                    <Image
                      className="m-auto text-white object-cover rounded-full h-10 w-10"
                      alt="Profile Picture"
                      src={your_campaign_reached_milestone_activities?.text?.actor_profile_picture_url}
                      fill
                    />
                  </div>
                
              </div>
  
              <div className="ml-[20px] flex-1">
                <div className="flex justify-between">
                  <span className="mt-[10px] text-black text-[15px]">
                    <div className="hover:cursor-pointer flex gap-1 justify-between">
                      <p className="">
                     <span className="text-lg text-primary-purple-500 font-[600] hover:underline">{your_campaign_reached_milestone_activities?.text?.actor_name}</span><span className="text-sm font-[400]"> signed up for your upcoming campaign </span><span className="text-lg text-primary-purple-500 font-[600] hover:underline">{your_campaign_reached_milestone_activities?.text?.campaign_name}</span><br/>
                     <span className="text-sm font-[400]">People are so ready for your creativity!</span>
                      </p>
                      
                    </div>
                  </span>
                  <span className="text-sm font-[500] text-dark-neutral-200 mt-[10px]">
                    <TimeAgo timestamp={timeStamp} />
                  </span>
                </div>
                <div className="flex gap-[24px] mt-[4%] w-full items-end">
                  <div className="relative w-[100px] h-[100px] border-[1px] border-icons-border bg-accent1">
                    
                        <Image
                          className="m-auto text-white object-cover h-20 w-20"
                          alt="Portfolio Cover"
                          src={your_campaign_reached_milestone_activities?.text?.cover_image_url}
                          fill
                        />
                        l{" "}
                      
                  </div>
                  <button onClick={()=>{}} className="mt-0 px-[12px] py-[6px] border-[1px] h-fit border-primary-purple-600 text-primary-purple-500 rounded-[4px]">View Details</button>
                </div>
              </div>
            </div>
          
        {/* })} */}
      </>
    );
}
