import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import CampaignCard from "./CampaignCard";

const EmptyCart = () => {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const resCampaigns = [
      {
        coverPic: "/images/image7.png",
        displayPic: "/images/profile.jpg",
        creatorName: "Meow",
        likes: 69,
        views: 420,
        goal: 9000,
        backers: 1225,
        daysToGo: 28,
      },
      {
        coverPic: "/images/image7.png",
        displayPic: "/images/profile.jpg",
        creatorName: "Meow",
        likes: 69,
        views: 420,
        goal: 9000,
        backers: 1225,
        daysToGo: 28,
      },
      {
        coverPic: "/images/image7.png",
        displayPic: "/images/profile.jpg",
        creatorName: "Meow",
        likes: 69,
        views: 420,
        goal: 9000,
        backers: 1225,
        daysToGo: 28,
      },
    ];
    setCampaigns(resCampaigns);
  }, []);
  return (
    <div className="min-h-full bg-accent2 p-10">
      <div className="flex flex-col gap-4 items-center justify-center h-full w-full bg-white p-5">
        <div className="flex item-center justify-center h-[20rem]">
          <img src="/temp/empty-orders.webp" className="h-full" />
        </div>
        <div className="text-center">
          <h1 className="font-medium text-[2rem]">NO ORDERS FOUND</h1>
          <p className="text-secondary-text-paragraph-text">
            Looks like you haven&apos;t made any orders yet.
          </p>
        </div>
        <div className="w-full">
          <div className="flex w-full justify-between mb-3 font-medium">
            <span className="text-[18px]">
              Here are some campaigns you might be interested in:
            </span>
            <Link href="/campaigns" className="text-primary-brand">
              View More...
            </Link>
          </div>
          <div className="flex">
            {campaigns.map((campaign, index) => (
              <div key={index} className="mx-auto">
                <CampaignCard campaign={campaign} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Cloud = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-6 h-6"
    >
      <path
        fillRule="evenodd"
        d="M4.5 9.75a6 6 0 0111.573-2.226 3.75 3.75 0 014.133 4.303A4.5 4.5 0 0118 20.25H6.75a5.25 5.25 0 01-2.23-10.004 6.072 6.072 0 01-.02-.496z"
        clipRule="evenodd"
      />
    </svg>
  );
};
export default EmptyCart;
