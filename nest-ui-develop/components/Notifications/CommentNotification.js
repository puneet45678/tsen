import { useState, useEffect } from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { useStreamContext } from "react-activity-feed";
import { generateCampaignLink } from "../../UtilityFunctions/generateLink";
import CampaignActorName from "../NotificationAreaDisplay/CampaignActorName";
import TimeAgo from "../TimeAgo";
import parse from "html-react-parser";

export default function CommentNotification({ commentActivities }) {
  // const { user } = useStreamContext();

  const [profilePicture, setProfilePicture] = useState("");
  const user_current = useSelector((state) => state.user);
  console.log("CommentActivity: ", commentActivities);
  let commentActivitiesLatest = commentActivities;
  // let name = commentActivitiesLatest.actor.data.name;
  let timeStamp = commentActivitiesLatest.time;
  useEffect(() => {
    setProfilePicture(
      user_current?.displayInformation?.profilePicture?.croppedPictureUrl
        ? user_current.displayInformation.profilePicture.croppedPictureUrl
        : ""
    );
  }, [user_current]);

  return (
    <>
      {/* {commentActivities.map((cAct) => { */}
       

        {/* // const campaignLink = generateCampaignLink(user.id, cAct.object.id); */}

       
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
                    <div className="hover:underline font-semibold">{commentActivities?.object}</div>
                    <div>Commented on your Campaign</div>
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
                      {" "}
                    </>
                  )}
                </div>
                <div className="border-r-2 border-accent1"></div>
                <div className="flex flex-col gap-4 justify-between">
                  <p className="flex gap-2 text-[#888] mt-10px ">
                    <div className="text-black hover:underline hover:cursor-pointer font-semibold">
                      @{user_current.username}
                    </div>{" "}
                    {parse(commentActivities?.text)}
                  </p>
                  <button className="border-[1.5px] text-primary-brand hover:bg-blue-100 hover:border-[2px] border-primary-brand bottom-0 rounded-md w-[60px] text-sm font-medium h-[40%]">
                    Reply
                  </button>
                </div>
              </div>
            </div>
          </div>
        
      {/* })} */}
    </>
  );
}
