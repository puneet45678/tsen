import React, { useState, useEffect } from "react";
import PortfolioCard from "./PortfolioCard";
import MyNestContent from "../MyNestContent";
import MyNestPortfolioContent from "./MyNestContentPortfolio";
import axios from "axios";
import moment from "moment";
const resData = [
    {
      bannerImageUrl: "/images/image7.png",
      portfolioName: "I hear the people talking Jay-Z(Unorthodox)",
      public_actions: {
        likes: 69,
        views: 420,
      },
      publish_date_time: 2,
      description:"When I was young, me and my mama had beef 17 years old, kicked out on the streets Though back at the time I never thought I'd see her face Ain't a woman alive that could take my mama's place Suspended from school, and scared to go home, I was a fool With the big boys breakin' all the rules I shed tears with my baby sister, over the years We was poorer than the other little kid"
    },
    {
      bannerImageUrl: "/images/image7.png",
      portfolioName: "I hear the people talking Jay-Z(Unorthodox)",
      public_actions: {
        likes: 69,
        views: 420,
      },
      publish_date_time: 2,
      description:"When I was young, me and my mama had beef 17 years old, kicked out on the streets Though back at the time I never thought I'd see her face Ain't a woman alive that could take my mama's place Suspended from school, and scared to go home, I was a fool With the big boys breakin' all the rules I shed tears with my baby sister, over the years We was poorer than the other little kid"
    },
    {
      bannerImageUrl: "/images/image7.png",
      portfolioName: "I hear the people talking Jay-Z(Unorthodox)",
      public_actions: {
        likes: 69,
        views: 420,
      },
      publish_date_time: 2,
      description:"When I was young, me and my mama had beef 17 years old, kicked out on the streets Though back at the time I never thought I'd see her face Ain't a woman alive that could take my mama's place Suspended from school, and scared to go home, I was a fool With the big boys breakin' all the rules I shed tears with my baby sister, over the years We was poorer than the other little kid"
    },
    {
      bannerImageUrl: "/images/image7.png",
      portfolioName: "I hear the people talking Jay-Z(Unorthodox)",
      public_actions: {
        likes: 69,
        views: 420,
      },
      publish_date_time: 2,
      description:"When I was young, me and my mama had beef 17 years old, kicked out on the streets Though back at the time I never thought I'd see her face Ain't a woman alive that could take my mama's place Suspended from school, and scared to go home, I was a fool With the big boys breakin' all the rules I shed tears with my baby sister, over the years We was poorer than the other little kid"
    },
    {
      bannerImageUrl: "/images/image7.png",
      portfolioName: "I hear the people talking Jay-Z(Unorthodox)",
      public_actions: {
        likes: 69,
        views: 420,
      },
      publish_date_time: 2,
      description:"When I was young, me and my mama had beef 17 years old, kicked out on the streets Though back at the time I never thought I'd see her face Ain't a woman alive that could take my mama's place Suspended from school, and scared to go home, I was a fool With the big boys breakin' all the rules I shed tears with my baby sister, over the years We was poorer than the other little kid"
    },
    {
      bannerImageUrl: "/images/image7.png",
      portfolioName: "I hear the people talking Jay-Z(Unorthodox)",
      public_actions: {
        likes: 69,
        views: 420,
      },
      publish_date_time: 2,
      description:"When I was young, me and my mama had beef 17 years old, kicked out on the streets Though back at the time I never thought I'd see her face Ain't a woman alive that could take my mama's place Suspended from school, and scared to go home, I was a fool With the big boys breakin' all the rules I shed tears with my baby sister, over the years We was poorer than the other little kid"
    },
    {
      bannerImageUrl: "/images/image7.png",
      portfolioName: "I hear the people talking Jay-Z(Unorthodox)",
      public_actions: {
        likes: 69,
        views: 420,
      },
      publish_date_time: 2,
      description:"When I was young, me and my mama had beef 17 years old, kicked out on the streets Though back at the time I never thought I'd see her face Ain't a woman alive that could take my mama's place Suspended from school, and scared to go home, I was a fool With the big boys breakin' all the rules I shed tears with my baby sister, over the years We was poorer than the other little kid"
    },
  ];
  // ]
const MyNestPortfolioDisplay = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [realPortfolios, setRealPortfolios] = useState([]);
  // const [portfolioDisplayData,setPortfolioDisplayData]=useState([])
  useEffect(() => {
    const resData = [];
    //works-done
    axios
      .get(`${process.env.NEXT_PUBLIC_USER_SERVICE_URL}/api/v1/user/portfolios`, {
        withCredentials: true,
      })
      .then((response) => {
        setRealPortfolios(response.data);
        console.log("realPortfolios----------->: ",realPortfolios,"Hello")
      })
      .catch((error) => {
        console.error(error);
      });

    
    setPortfolios(resData);
    console.log("resData===",resData)
  }, []);

  return (
    <>

    <MyNestPortfolioContent
      empty={realPortfolios.length === 0}
      emptyText={"You have not created any portfolio yet."}
      emptyImage={"/images/icons/folder-pana.svg"}
      emptyHeading={"You are brimming with talent"}
      createLinkUrl={"/my-nest/portfolio/create"}
      createLinkText={"Create New Project"}
      heading={"Manage Your Portfolio"}
      searchText={"Search"}
      PublicProfileCTA={"View Public Profile"}
    >
       
      <div className="grid grid-cols-5 gap-[24px] px-[32px] justify-start">
        {console.log("RealPortfoliosDiv----: ",realPortfolios)}
        {realPortfolios.map((portfolio, index) => (

          <div key={index} className="mt-[24px]">

            <PortfolioCard
              coverImage={portfolio?.coverImage || "/images/image1.webp"}
              videoLinks={portfolio?.videoLinks}
              bannerImageUrl={portfolio?.portfolioImages}
              portfolioName={portfolio?.portfolioName}
              likes={portfolios[0]?.public_actions?.likes}
              views={portfolios[0]?.public_actions?.views}
              publish_date_time={portfolio?.createdAt}
              description={portfolio?.description || ""}
            />
          </div>



        ))}
      </div>
    </MyNestPortfolioContent>
    </>
  );
};
export default MyNestPortfolioDisplay;
