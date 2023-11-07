import Image from "next/image";
import { useState } from "react";
import Plus from "../../icons/Plus";
import { useSelector } from "react-redux";

export default function EachFollowingFollowerUserDetails({ user, usernamesArray }) {
    const [conditionHovering, setHovering] = useState(false);
  
    const currentUser = useSelector(state=>state.user);
  
    return (
      <>
        <div className="flex justify-between gap-[108px]">
          {/* Profile left */}
          <div className="flex flex-grow items-center">
            <div className="flex items-end h-16 w-16">
              <Image
                className=" rounded-full aspect-square border-4 border-white"
                width={64}
                height={64}
                src={user?.profilePicture}
                alt="Profile Pic"
              />
            </div>
  
            <div className="flex flex-col justify-end px-5">
              <div className="text-xl font-semibold">{user?.fullName}</div>
              <div>
                <p className="text-lg font-medium text-dark-neutral-50">
                  {"@" + user?.email}
                </p>
              </div>
            </div>
  
            <div className="flex gap-3 px-1 items-end h-full">
              <div className="flex items-end justify-between">
                <span className="text-xs font-medium text-black px-3 mx-2 rounded-full bg-light-neutral-500">
                  {user?.followers ? user.followers.length : 0}
                </span>
                <span
                  onClick={() => setShowFollowerFollowingModal("followers")}
                  className="text-xs text-dark-neutral-200 hover:underline hover:cursor-pointer"
                >
                  Followers
                </span>
              </div>
              <div className="flex items-end justify-between">
                <span className="text-xs font-medium text-black px-3 mx-2 rounded-full bg-light-neutral-500">
                  {user?.followings ? user.followings.length : 0}
                </span>
                <span
                  onClick={() => setShowFollowerFollowingModal("following")}
                  className="text-xs text-dark-neutral-200 hover:underline hover:cursor-pointer"
                >
                  Following
                </span>
              </div>
            </div>
          </div>
          {/* Profile Right */}
  
          <div className="flex items-end">
            {currentUser?.username &&
              user?.username &&
              (currentUser.username !== user.username &&
              usernamesArray.indexOf(user.username) === -1 ? (
                <div className=" w-[113px]    flex items-center justify-center gap-[6px] h-8 button-primary button-xs hover:cursor-pointer">
                  <span className="text-button-text-sm font-semibold">
                    Follow
                  </span>
                  <div className="h-[18px] w-[18px] relative text-white">
                    <Plus />
                  </div>
                </div>
              ) : (
                <div
                  onMouseEnter={() => {
                    setHovering(true);
                  }}
                  onMouseLeave={() => {
                    setHovering(false);
                  }}
                  className="flex w-full"
                >
                  <div
                    className={`
                    w-[113px]
  
                    flex
                    items-center
                    justify-center
                    gap-[6px] h-8
                    button-xs
                    hover:cursor-pointer
                    ${
                      !conditionHovering
                        ? " button-default"
                        : " button-error cursor-pointer active:text-white"
                    }
                    
                    `}
                  >
                    <span className="text-button-text-sm font-semibold">
                      {!conditionHovering
                        ? "Following"
                        : "Unfollow"}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <hr className="border border-light-neutral-500 my-8" />
      </>
    );
  }