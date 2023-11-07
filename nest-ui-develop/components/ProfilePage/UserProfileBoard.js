import Image from "next/image";
import React, { useState } from "react";
import Plus from "../../icons/Plus";
import UploadIcon from "../../icons/UploadIcon";
import { useSelector } from "react-redux";
import Avatar from "../Avatar";

const dummyUser2 = {
  _id: {
    oid: "65268dcc1b54adb95f5fa465",
  },
  supertokensUserId: "efdb2fc2-141a-48e5-bc9f-47e2b9a11644",
  username: "Something2",
  email: "jane.doe@example.com",
  accountInformation: {
    fullName: "Jane Doe",
    country: "United States",
    accountType: "3DP",
    gender: "Female",
    dateOfBirth: "1995-07-20",
    showMatureContent: true,
  },
  displayInformation: {
    profilePicture: {
      pictureUrl: "https://source.unsplash.com/random",
      croppedPictureUrl: "https://source.unsplash.com/random",
    },
    coverPicture: {
      pictureUrl: "https://source.unsplash.com/random",
      croppedPictureUrl: "https://source.unsplash.com/random",
    },
    introductoryVideoUrl:
      "https://assets.mixkit.co/videos/preview/mixkit-introduction-of-business-seminar-motivational-speaker-12983-large.mp4",
    description:
      "So Medium is not the only place for educators to create … probably isn’t even the best place if we are being honest with ourselves.   But I am convinced it is one of the best places to get started.   After writing on Medium for several years now, I am committed to helping other educators get started here as well.   As a rhetoric and writing professor, I’ve always preached the benefits of blogging to my students. Blogging helps writers find their voice, build an audience, and strengthen their writing through practice.   (In fact, I’ve started having students write on Medium as well. You can see some of their writing here.)   For that reason, Medium is one of the best places to get started as a creator. The prospect of making money draws many people in … which is a possibility. But if that is the only reason you are here, you’ll give up quickly, because it takes persistence to get the paid partner program to work for you.",
    skills: ["3D Modeling", "3D Printing", "CAD"],
    website: "https://janedoe3d.com",
  },
  followings: [
    {
      username: "Something",
    },
    {
      username: "JaneDoe123",
    },
    {
      username: "Something3",
    },
  ],
  followers: [
    {
      username: "Something4",
    },
    {
      username: "Something5",
    },
    {
      username: "Something6",
    },
  ],
  socialMediaLinks: [
    {
      platform: "instagram", //platform name in lower case, Not even camelCase
      url: "https://twitter.com/JaneDoe3D",
    },
    {
      platform: "linkedin",
      url: "https://linkedin.com/in/jane-doe",
    },
  ],
  expertise: [
    {
      skill: "3d rendering",
    },
    {
      skill: "Modeling",
    },
    {
      skill: "Scan CleanUps",
    },
    {
      skill: "3d printing",
    },
  ],
  createdAt: {
    date: "2023-10-11T11:55:24.116Z",
  },
  slicerSettings: "Default",
  notifications: {
    generalNotifications: {
      GENERAL_FOLLOW: {
        label: "Someone starts following you",
        subscribed: true,
      },
      GENERAL_PROJECT_LIKE: {
        label: "Someone likes a project on you portfolio",
        subscribed: true,
      },
      GENERAL_COMMENT_LIKE: {
        label: "Someone likes your comment",
        subscribed: true,
      },
      GENERAL_COMMENT_REPLY: {
        label: "Someone replies to your comment",
        subscribed: true,
      },
    },
    marketplaceNotifications: {
      MARKETPLACE_FOLLOWING_MODEL_PUBLISH: {
        label: "An artist you follow publishes a new model on marketplace",
        subscribed: true,
      },
      MARKETPLACE_MODEL_BOUGHT: {
        label: "Someone buys your model on the marketplace",
        subscribed: true,
      },
      MARKETPLACE_MODEL_LIKE: {
        label: "Someone likes your model on marketplace",
        subscribed: true,
      },
      MARKETPLACE_MODEL_COMMENT: {
        label: "Someone comments on your model on marketplace",
        subscribed: true,
      },
    },
    backedCampaignNotifications: {
      BACKED_CAMPAIGN_FOLLOWING_CAMPAIGN_PUBLISH: {
        label: "An artist you follow launches a new campaign",
        subscribed: true,
      },
      BACKED_CAMPAIGN_FOLLOWING_CAMPAIGN_END: {
        label: "Campaign by an artist you follow is about to end",
        subscribed: true,
      },
      BACKED_CAMPAIGN_MILESTONE: {
        label: "Your backed campaign reaches a milestone",
        subscribed: true,
      },
      BACKED_CAMPAIGN_UPDATE: {
        label: "Your backed campaign has new updates",
        subscribed: true,
      },
      BACKED_CAMPAIGN_EARLY_BIRD_ADDED: {
        label: "Early bird offer on campaigns added to your wishlist",
        subscribed: true,
      },
    },
    createdCampaignNotifications: {
      CREATED_CAMPAIGN_NEW_LIKE: {
        label: "Someone likes your created campaign",
        subscribed: true,
      },
      CREATED_CAMPAIGN_NEW_COMMENT: {
        label: "Someone comments on your created campaign",
        subscribed: true,
      },
      CREATED_CAMPAIGN_NEW_BACKER: {
        label: "Someone backs your created campaign",
        subscribed: true,
      },
      CREATED_CAMPAIGN_PRE_LAUNCH_SIGNUP: {
        label: "Someone signs up to your created campaign during pre-launch",
        subscribed: true,
      },
      CREATED_CAMPAIGN_MILESTONE_REACHED: {
        label: "Your created campaign reaches a milestone",
        subscribed: true,
      },
      CREATED_CAMPAIGN_ENDED: {
        label: "Your created campaign has ended. Review your performance.",
        subscribed: true,
      },
    },
    ikarusNestNotifications: {
      IKARUS_NEST_OFFERS_AND_DISCOUNT: {
        label: "Offers and Discounts",
        subscribed: true,
      },
      IKARUS_NEST_NEW_FEATURES_ANNOUNCEMENT: {
        label: "New features announcements",
        subscribed: true,
      },
      IKARUS_NEST_PROMOTIONS: {
        label: "Promotions",
        subscribed: true,
      },
    },
  },
  notification_token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjUyNjhkY2MxYjU0YWRiOTVmNWZhNDY1In0.12tnASgyc0DPGXZWnzBSipUhvykhQOuzDlYYtYxbcdk",
};

export default function UserProfileBoard({
  user,
  FFModal,
  selectModalActiveTab,
  shareModal
}) {
  const currentUser = useSelector((state) => state.user);
  const conditionFollowing =
    currentUser?.followings?.filter((e) => e.username === user.username)
      .length === 1;
  const [conditionHovering, setHovering] = useState(false);

  console.log(currentUser.username !== user.username);

  function setShowFollowerFollowingModal(e) {
    console.log("HEEEElo");
    selectModalActiveTab(e);
    FFModal(true);
  }
  return (
    <>
      <div className="flex justify-between -translate-y-8">
        {/* Profile left */}
        <div className="flex flex-grow items-end gap-6">
          <div className=" rounded-full aspect-square border-[5px] border-white">
            <Avatar
              size="xl"
              src={
                user?.displayInformation?.profilePicture?.croppedPictureUrl ||
                user?.displayInformation?.profilePicture?.pictureUrl || 
                null
              }
              alt="Profile Pic"
            />
            </div>

          <div className="flex flex-col justify-end gap-1">
            <div className="text-[22px] leading-[30px] tracking-[-0.22px] font-semibold text-dark-neutral-700">
              {user?.accountInformation?.fullName}
            </div>
            <div>
              <p className="text-xl font-medium text-dark-neutral-50">
                {"@" + user?.email}
              </p>
            </div>
          </div>

          <div className="flex gap-8 px-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium text-dark-neutral-700 px-[13px] py-1 mx-2 rounded-[50px] bg-light-neutral-50">
                {user?.followers ? user.followers.length : 0}
              </span>
              <span
                onClick={() => setShowFollowerFollowingModal("followers")}
                className="text-lg font-normal text-dark-neutral-200 hover:underline hover:cursor-pointer"
              >
                Followers
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium text-dark-neutral-700 px-[13px] py-1 mx-2 rounded-[50px] bg-light-neutral-50">
                {user?.followings ? user.followings.length : 0}
              </span>
              <span
                onClick={() => setShowFollowerFollowingModal("following")}
                className="text-lg font-normal text-dark-neutral-200 hover:underline hover:cursor-pointer"
              >
                Following
              </span>
            </div>
          </div>
        </div>
        {/* Profile Right */}
        <div className="flex items-end">
          <div className="flex gap-8 items-center">
            {currentUser?.username &&
              user?.username &&
              currentUser.username !== user.username &&
              (!conditionFollowing ? (
                <div className="flex w-[200px]">
                  <div className="button-primary button-md-1 hover:cursor-pointer">
                    <span className="text-button-text-sm font-semibold">
                      Follow
                    </span>
                    <div className="h-[18px] w-[18px] relative text-white">
                      <Plus />
                    </div>
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
                  className="flex w-[200px]"
                >
                  <div
                    className={`
                          button-md-1
                          ${
                            !conditionHovering
                              ? "button-default text-dark-neutral-700"
                              : "button-error cursor-pointer active:text-white"
                          }
                          
                          `}
                  >
                    <span className="text-button-text-sm font-semibold">
                      {!conditionHovering ? "Following" : "Unfollow"}
                    </span>
                  </div>
                </div>
              ))}
            <div
              className="flex gap-[6px] whitespace-nowrap text-primary-purple-500 hover:cursor-pointer"
              onClick={() => shareModal(true)}
            >
              <div className="h-[18px] w-[18px] relative">
                <UploadIcon />
              </div>
              <span className="text-button-text-sm font-semibold">
                Share profile
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
