import Image from "next/image";
import React, { useState, useEffect } from "react";
import Plus from "../../icons/Plus";
import EachFollowingFollowerUserDetails from './EachFollowingFollowerUserDetails'

const testFollowing = [
  {
    profilePicture: "https://source.unsplash.com/random",
    username: "SomeOtherName",
    fullName: "Some other name",
    email: "jane.doe@example.com",
    followings: [
      {
        username: "Something",
      },
      {
        username: "Something2",
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
  },
  {
    profilePicture: "https://source.unsplash.com/random",
    username: "JaneDoe123",
    fullName: "Jane Doe",
    email: "jane.doe@example.com",
    followings: [
      {
        username: "Something",
      },
      {
        username: "Something2",
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
  },
  {
    profilePicture: "https://source.unsplash.com/random",
    username: "Something2",
    fullName: "Jane Doe",
    email: "jane.doe@example.com",
    followings: [
      {
        username: "Something",
      },
      {
        username: "Something2",
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
  },
  {
    profilePicture: "https://source.unsplash.com/random",
    username: "JaneDoe123",
    fullName: "Jane Doe",
    email: "jane.doe@example.com",
    followings: [
      {
        username: "Something",
      },
      {
        username: "Something2",
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
  },
  {
    profilePicture: "https://source.unsplash.com/random",
    username: "JaneDoe123",
    fullName: "Jane Doe",
    email: "jane.doe@example.com",
    followings: [
      {
        username: "Something",
      },
      {
        username: "Something2",
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
  },
  {
    profilePicture: "https://source.unsplash.com/random",
    username: "JaneDoe123",
    fullName: "Jane Doe",
    email: "jane.doe@example.com",
    followings: [
      {
        username: "Something",
      },
      {
        username: "Something2",
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
  },
];
const dummyUser2 = {
  // Dummy Current user
  username: "Something2",
  email: "jane.doe@example.com",
  fullName: "Jane Doe",
  country: "United States",
  accountType: "3DP",
  gender: "Female",
  dateOfBirth: "1995-07-20",
  showMatureContent: true,
  profilePicture: "https://source.unsplash.com/random",
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
};



const FollowerFollowingModalContainer = ({
  followings,
  followers,
  selectedTab,
}) => {
  const currentUser = dummyUser2;
  const usernamesArray = currentUser.followings.map((e) => e.username);
  const [tab, setTab] = useState(selectedTab);
  return (
    <div className="p-11 pt-0 h-[676px] w-full overflow-hidden">
      {/*Nav*/}
      <div className="my-10 mb-12">
        <div className="flex gap-4 h-11 ">
          <div
            onClick={() => {
              setTab("followers");
            }}
            className={`${
              tab === "followers"
                ? "bg-primary-purple-50 text-primary-purple-500"
                : "text-dark-neutral-200 hover:bg-light-neutral-300 hover:text-dark-neutral-700"
            } flex items-center justify-center text-md font-semibold rounded-[5px] px-4 py-[11px] hover:cursor-pointer`}
            scroll={false}
          >
            Followers
          </div>
          <div
            onClick={() => {
              setTab("following");
            }}
            className={`${
              tab === "following"
                ? "bg-primary-purple-50 text-primary-purple-500"
                : "text-dark-neutral-200 hover:bg-light-neutral-300 hover:text-dark-neutral-700"
            } flex items-center justify-center text-md font-semibold rounded-[5px] px-4 hover:cursor-pointer py-[11px]`}
            scroll={false}
          >
            Following
          </div>
        </div>
      </div>
      {/* Tabs */}
      <div className="h-[576px] overflow-y-scroll no-scrollbar">
        {tab === "following" 
          ?testFollowing.map((user, index) => (
              <EachFollowingFollowerUserDetails
                usernamesArray={usernamesArray}
                user={user}
              />
            ))
          :testFollowing.map((user, index) => (
              <EachFollowingFollowerUserDetails
                usernamesArray={usernamesArray}
                user={user}
              />
            ))}
      </div>
    </div>
  );
};

export default FollowerFollowingModalContainer;
