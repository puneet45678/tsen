import {useContext} from 'react'
import { useStreamContext } from 'react-activity-feed'
import { RxAvatar } from "react-icons/rx";

export default function FollowingContent() {
  const { getstreamUser } = useContext(ProfileContext)
  console.log("the stream profile context: ",getstreamUser)
    return (
       <>
        <div className="flex flex-col items-center bg-white py-5 px-3 rounded-md">
        <RxAvatar className="text-[20px] font-medium mb-2" />
        <span>{getstreamUser.follower_count || 0}</span>
        <span>Followers</span>
      </div>
      <div className="flex flex-col items-center bg-white py-5 px-3 rounded-md">
        <RxAvatar className="text-[20px] font-medium mb-2" />
        <span>{getstreamUser.following_count || 0}</span>
        <span>Following</span>
      </div>
       </>
  )
}
