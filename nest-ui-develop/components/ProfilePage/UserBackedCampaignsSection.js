import React, { useState, useEffect } from "react";
import WishlistCardCampaigns from "../my-wishlist/WishlistCardCampaigns";

const singleObjectData={
  coverImage: "/images/image7.png",
  publish_date_time:1697180782,
  amount_raised:8999,
  end_date:(1697180782+3600*24*15),
  NSFW:false,
  campaign_status:"Live",
  portfolioName:"SomeOne",
  artist_portfolio_picture:"/images/profile.jpg",
  artist_name:"test2",
  product_amount:50,
  backers:10,
  reward_tiers:3,
}
const objectData=[]
for (let i = 2; i < 10; i++) {
  objectData.push({
    coverImage: `/images/image${7 + i}.webp`,
    publish_date_time: 1697180782 - 3600 * i,
    amount_raised: 8999 - i * 100,
    end_date: 1697180782 + 3600 * 24 * (15 - i),
    NSFW: false,
    campaign_status: "Live",
    portfolioName: `Some${String.fromCharCode(65 + i)}`, // 'SomeC', 'SomeD', etc.
    artist_portfolio_picture: `/images/profile${i}.jpg`,
    artist_name: `test${2 + i}`,
    product_amount: 50 - i,
    backers: 10 - i,
    reward_tiers: 3,
  });
}

const UserBackedCampaignsSection = () => {
  const [backedCampaigns, setBackedCampaigns] = useState(objectData);

  useEffect(() => {
    let options = {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    };

    let observer = new IntersectionObserver(() => {
      setTimeout(() => {
        const moreNew = []
        for (let i = 2; i < 5; i++) {
          moreNew.push({
            coverImage: `/images/image${7 + i}.webp`,
            publish_date_time: 1697180782 - 3600 * i,
            amount_raised: 8999 - i * 100,
            end_date: 1697180782 + 3600 * 24 * (15 - i),
            NSFW: false,
            campaign_status: "Live",
            portfolioName: `Some${String.fromCharCode(65 + i)}`, // 'SomeC', 'SomeD', etc.
            artist_portfolio_picture: `/images/profile.jpg`,
            artist_name: `test${2 + i}`,
            product_amount: 50 - i,
            backers: 10 - i,
            reward_tiers: 3,
          });
        }
        setBackedCampaigns((current) => [
          ...current,...moreNew]);
      }, 1000);
    }, options);
    observer.observe(document.querySelector("#endElement"));
  }, []);

  return (
    <>
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-2 gap-4 w-full"> */}
      <div className="flex flex-wrap gap-4">
        {backedCampaigns.map((campaign, index) => (
            <WishlistCardCampaigns key={`backedCampaign-${index}`} aspect={"59/25"} {...campaign} />
        ))}
      </div>
      <div id="endElement"></div>
    </>
  );
};
export default UserBackedCampaignsSection;
