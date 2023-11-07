import { useState, useEffect } from "react";
import Image from "next/image";
import TimeAgo from "../TimeAgo";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

export default function FollowNotification({ followActivities }) {
  const router = useRouter();
  console.log("followActivity_length: ",followActivities)
  const [profilePicture, setProfilePicture] = useState("");
  const user = useSelector((state) => state.user);
  let latest_follow_activities = followActivities;
  let timeStamp = latest_follow_activities?.time;
  useEffect(() => {
    setProfilePicture(
      user?.displayInformation?.profilePicture?.croppedPictureUrl
        ? user.displayInformation.profilePicture.croppedPictureUrl
        : ""
    );
  }, [user]);

  return (
    <div className="p-[15px] flex border-b-2 border-accent1 ml-6 mr-6 min-h-[126px]">
      <div className="relative rounded-full w-[48px] h-[48px] border-[1px] border-icons-border bg-accent1">
        {profilePicture === "" ? (
          <></>
        ) : (
          <>
            <Image
              className="m-auto text-white object-cover rounded-full h-10 w-10"
              alt="Profile Picture"
              src={profilePicture}
              fill
            />
          </>
        )}
      </div>
      {/* <User color="#1D75BD" size={25} /> */}
      <div className="ml-[20px] flex-1">
        <div className="flex justify-between">
          <p className="mt-[10px]">
            <span onClick={()=>{router.push(`user/${followActivities?.text?.actor_name}/about`)}} className="hover:underline text-primary-purple-500 text-lg font-[600]">
              {followActivities?.text?.actor_name}{" "}
            </span>
           <span className="text-sm font-[400] text-black">
           {followActivities.length > 1 &&
              `and ${followActivities.length - 1} others`}{" "}
            started following you
           </span>
          </p>
          <span className="text-sm mt-[10px]">
            <TimeAgo timestamp={timeStamp} />
          </span>
        </div>
      </div>
    </div>
  );
}
