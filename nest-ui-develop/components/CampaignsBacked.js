import React, { useState, useEffect } from "react";
import CampaignCard from "./CampaignCard";

const CampaignsBacked = () => {
  const [campaignsBacked, setCampaignsBacked] = useState([]);

  useEffect(() => {
    // TODO change to axios call
    setCampaignsBacked([
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
      {campaignsBacked.map((campaign, index) => (
        <div key={index} className="mx-auto w-full">
          <CampaignCard campaign={campaign} />
        </div>
      ))}
    </>
  );
};

export default CampaignsBacked;
