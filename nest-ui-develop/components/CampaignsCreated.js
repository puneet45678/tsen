import React, { useState, useEffect } from "react";
import CampaignCard from "./CampaignCard";

const CampaignsCreated = () => {
  const [campaignsCreated, setCampaignsCreated] = useState([]);

  useEffect(() => {
    // TODO change to axios call
    setCampaignsCreated([
      {
        coverPic: "/images/profile.jpg",
        displayPic: "/images/image7.png",
        creatorName: "Meow",
        likes: 69,
        views: 420,
        goal: 9000,
        backers: 1225,
        daysToGo: 28,
      },
      {
        coverPic: "/images/profile.jpg",
        displayPic: "/images/image7.png",
        creatorName: "Meow",
        likes: 69,
        views: 420,
        goal: 9000,
        backers: 1225,
        daysToGo: 28,
      },
      {
        coverPic: "/images/profile.jpg",
        displayPic: "/images/image7.png",
        creatorName: "Meow",
        likes: 69,
        views: 420,
        goal: 9000,
        backers: 1225,
        daysToGo: 28,
      },
      {
        coverPic: "/images/profile.jpg",
        displayPic: "/images/image7.png",
        creatorName: "Meow",
        likes: 69,
        views: 420,
        goal: 9000,
        backers: 1225,
        daysToGo: 28,
      },
      {
        coverPic: "/images/profile.jpg",
        displayPic: "/images/image7.png",
        creatorName: "Meow",
        likes: 69,
        views: 420,
        goal: 9000,
        backers: 1225,
        daysToGo: 28,
      },
      {
        coverPic: "/images/profile.jpg",
        displayPic: "/images/image7.png",
        creatorName: "Meow",
        likes: 69,
        views: 420,
        goal: 9000,
        backers: 1225,
        daysToGo: 28,
      },
      {
        coverPic: "/images/profile.jpg",
        displayPic: "/images/image7.png",
        creatorName: "Meow",
        likes: 69,
        views: 420,
        goal: 9000,
        backers: 1225,
        daysToGo: 28,
      },
      {
        coverPic: "/images/profile.jpg",
        displayPic: "/images/image7.png",
        creatorName: "Meow",
        likes: 69,
        views: 420,
        goal: 9000,
        backers: 1225,
        daysToGo: 28,
      },
    ]);
  }, []);
  return (
    <>
      {campaignsCreated.map((campaign, index) => (
        <div key={index} className="mx-auto w-full">
          <CampaignCard campaign={campaign} />
        </div>
      ))}
    </>
  );
};

export default CampaignsCreated;
