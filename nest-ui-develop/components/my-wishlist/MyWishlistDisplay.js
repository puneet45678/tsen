import React, { useState, useEffect } from "react";
import PortfolioCardModels from "./WishlistCardModels";
import WishlistCardCampaigns from "./WishlistCardCampaigns";
// import MyNestContent from "./MyWishlistContent";
// import MyNestPortfolioContent from "./MyNestContentPortfolio";
import MyWishlistContent from "./MyWishlistContent";
import axios from "axios";
import moment from "moment";
import Image from "next/image";
import { useRouter } from "next/router";

const EmptyPage = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-[112px]">
      <div className="relative w-[376.744px] h-[311px] mx-auto">
        <Image src="/temp/EmptyMyWishlist.svg" alt="Empty Orders" fill />
      </div>
      <div className="flex flex-col gap-[32px]">
        <span className="font-[500] text-headline-sm text-center">
          Nothing here. Start exploring
        </span>
        <button
        onClick={()=>router.push("/campaigns/explore")}
        className="bg-primary-purple-500 text-white rounded-[4px] px-[12px] py-[8px] shadow-xs w-fit mx-auto">
          Explore Campaigns
        </button>
      </div>
    </div>
  );
};

const MyNestPortfolioDisplay = (props) => {
  const [portfolios, setPortfolios] = useState([]);
  const [wishlistData, setWishlistData] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_CART_SERVICE_URL}/api/v1/wishlist`, {
        withCredentials: true,
      })
      .then((res) => {
        setWishlistData(res.data);
        console.log("wishlist_data:", res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const resData = [
    {
      bannerImageUrl: "/images/image7.png",
      portfolioName: "I hear the people talking Jay-Z(Unorthodox)",
      public_actions: {
        likes: 69,
        views: 420,
      },
      publish_date_time: 2,
      description:
        "When I was young, me and my mama had beef 17 years old, kicked out on the streets Though back at the time I never thought I'd see her face Ain't a woman alive that could take my mama's place Suspended from school, and scared to go home, I was a fool With the big boys breakin' all the rules I shed tears with my baby sister, over the years We was poorer than the other little kid",
      artist_profile_picture_url:
        "https://ucarecdn.com/080c19cb-00a6-424a-b559-780cd890f69f/",
      artist_name: "Seedhe Maut",
      product_amount: 420,
      amount_raised: 69420,
    },
    {
      bannerImageUrl: "/images/image7.png",
      portfolioName: "I hear the people talking Jay-Z(Unorthodox)",
      public_actions: {
        likes: 69,
        views: 420,
      },
      publish_date_time: 2,
      description:
        "When I was young, me and my mama had beef 17 years old, kicked out on the streets Though back at the time I never thought I'd see her face Ain't a woman alive that could take my mama's place Suspended from school, and scared to go home, I was a fool With the big boys breakin' all the rules I shed tears with my baby sister, over the years We was poorer than the other little kid",
      artist_profile_picture_url:
        "https://ucarecdn.com/080c19cb-00a6-424a-b559-780cd890f69f/",
      artist_name: "Seedhe Maut",
      product_amount: 420,
      amount_raised: 69420,
    },
    {
      bannerImageUrl: "/images/image7.png",
      portfolioName: "I hear the people talking Jay-Z(Unorthodox)",
      public_actions: {
        likes: 69,
        views: 420,
      },
      publish_date_time: 2,
      description:
        "When I was young, me and my mama had beef 17 years old, kicked out on the streets Though back at the time I never thought I'd see her face Ain't a woman alive that could take my mama's place Suspended from school, and scared to go home, I was a fool With the big boys breakin' all the rules I shed tears with my baby sister, over the years We was poorer than the other little kid",
      artist_profile_picture_url:
        "https://ucarecdn.com/080c19cb-00a6-424a-b559-780cd890f69f/",
      artist_name: "Seedhe Maut",
      product_amount: 420,
      amount_raised: 69420,
    },
    {
      bannerImageUrl: "/images/image7.png",
      portfolioName: "I hear the people talking Jay-Z(Unorthodox)",
      public_actions: {
        likes: 69,
        views: 420,
      },
      publish_date_time: 2,
      description:
        "When I was young, me and my mama had beef 17 years old, kicked out on the streets Though back at the time I never thought I'd see her face Ain't a woman alive that could take my mama's place Suspended from school, and scared to go home, I was a fool With the big boys breakin' all the rules I shed tears with my baby sister, over the years We was poorer than the other little kid",
      artist_profile_picture_url:
        "https://ucarecdn.com/080c19cb-00a6-424a-b559-780cd890f69f/",
      artist_name: "Seedhe Maut",
      product_amount: 420,
      amount_raised: 69420,
    },
    {
      bannerImageUrl: "/images/image7.png",
      portfolioName: "I hear the people talking Jay-Z(Unorthodox)",
      public_actions: {
        likes: 69,
        views: 420,
      },
      publish_date_time: 2,
      description:
        "When I was young, me and my mama had beef 17 years old, kicked out on the streets Though back at the time I never thought I'd see her face Ain't a woman alive that could take my mama's place Suspended from school, and scared to go home, I was a fool With the big boys breakin' all the rules I shed tears with my baby sister, over the years We was poorer than the other little kid",
      artist_profile_picture_url:
        "https://ucarecdn.com/080c19cb-00a6-424a-b559-780cd890f69f/",
      artist_name: "Seedhe Maut",
      product_amount: 420,
      amount_raised: 69420,
    },
    {
      bannerImageUrl: "/images/image7.png",
      portfolioName: "I hear the people talking Jay-Z(Unorthodox)",
      public_actions: {
        likes: 69,
        views: 420,
      },
      publish_date_time: 2,
      description:
        "When I was young, me and my mama had beef 17 years old, kicked out on the streets Though back at the time I never thought I'd see her face Ain't a woman alive that could take my mama's place Suspended from school, and scared to go home, I was a fool With the big boys breakin' all the rules I shed tears with my baby sister, over the years We was poorer than the other little kid",
      artist_profile_picture_url:
        "https://ucarecdn.com/080c19cb-00a6-424a-b559-780cd890f69f/",
      artist_name: "Seedhe Maut",
      product_amount: 420,
      amount_raised: 69420,
    },
    {
      bannerImageUrl: "/images/image7.png",
      portfolioName: "I hear the people talking Jay-Z(Unorthodox)",
      public_actions: {
        likes: 69,
        views: 420,
      },
      publish_date_time: 2,
      description:
        "When I was young, me and my mama had beef 17 years old, kicked out on the streets Though back at the time I never thought I'd see her face Ain't a woman alive that could take my mama's place Suspended from school, and scared to go home, I was a fool With the big boys breakin' all the rules I shed tears with my baby sister, over the years We was poorer than the other little kid",
      artist_profile_picture_url:
        "https://ucarecdn.com/080c19cb-00a6-424a-b559-780cd890f69f/",
      artist_name: "Seedhe Maut",
      product_amount: 420,
      amount_raised: 69420,
    },
  ];
  // setPortfolios(resData);
  //   }, []);

  return (
    <MyWishlistContent
      empty={resData.length === 0}
      emptyText={"You have not created any portfolio yet."}
      emptyImage={"/temp/EmptyMyWishlist.svg"}
      emptyHeading={"Nothing here. Start exploring"}
      createLinkUrl={"/my-nest/portfolio/create"}
      createLinkText={"Create New Project"}
      heading={"Manage Your Portfolio"}
      searchText={"Search"}
      PublicProfileCTA={"View Public Profile"}
    >
      {wishlistData.length < 1 ? (
        <div className="mx-auto">
          <EmptyPage />
        </div>
      ) : (
        <>
          {(props.sectionSelected === "Models")? (
            <>
              <div className="grid grid-cols-4 gap-[24px] px-[32px] justify-start ">
                {wishlistData?.items?.map((wishlist, index) => (
                 <>
                 {wishlist.itemType==="MODEL"?(
                   <div key={index} className="">
                   <PortfolioCardModels
                     coverImage={wishlist.itemDp}
                     artist_portfolio_picture={wishlist.artistDp}
                     bannerImageUrl={wishlist.itemDp}
                     portfolioName={wishlist.itemName}
                     publish_date_time={wishlist.publish_date_time}
                     description={wishlist.description}
                     artist_name={wishlist.artistName}
                     product_amount={wishlist.itemPrice}
                   />
                 </div>
                 ):null}
                 </>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-[24px] justify-start ">
                {wishlistData?.items?.map((wishlist, index) => (
                 <>
                 {wishlist.itemType==="CAMPAIGN"?(
                   <div key={index} className="">
                   <WishlistCardCampaigns
                     coverImage={
                       wishlist.itemDp
                     }
                     // videoLinks={portfolio.videoLinks}
                     artist_portfolio_picture={
                       wishlist.artistDp
                     }
                     bannerImageUrl={wishlist.itemDp}
                     portfolioName={wishlist.portfolioName}
                     artist_name={wishlist.artistName}
                     amount_raised={wishlist.amountRaised}
                     end_date={wishlist.endDate}
                     reward_tiers={wishlist.noOfRewardTiers}
                     backers={wishlist.noOfBackers}
                     campaign_status={wishlist.statusOfCampaign}
                   />
                 </div>
                 ):null}
                 </>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </MyWishlistContent>
  );
};
export default MyNestPortfolioDisplay;
