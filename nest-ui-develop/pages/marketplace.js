import React, { useState, useEffect } from "react";
import MarketplaceCard from "../components/ModelMarketplace/MarketplaceCard";
import MarketplaceSingleRowModels from "../components/ModelMarketplace/MarketplaceSingleRowModels";
import Skeleton from "../components/skeletons/Skeleton";
import Image from "next/image";
import axios from "axios";

const headerCategories = [
  {
    title: "Architecture",
    imageUrl: "/images/architecture.png",
  },
  {
    title: "Vehicle",
    imageUrl: "/images/vehicle.png",
  },
  {
    title: "Fantasy",
    imageUrl: "/images/fantasy.png",
  },
  {
    title: "Furniture",
    imageUrl: "/images/furniture.png",
  },
  {
    title: "Action Figures",
    imageUrl: "/images/actionFigures.png",
  },
  {
    title: "Furniture",
    imageUrl: "/images/furniture.png",
  },
  {
    title: "Vehicle",
    imageUrl: "/images/vehicle.png",
  },
  {
    title: "Architecture",
    imageUrl: "/images/architecture.png",
  },
];

const Marketplace = () => {
  const [dataReceived, setDataReceived] = useState(false);
  const [featuredToday, setFeaturedToday] = useState([]);
  const [topPicks, setTopPicks] = useState([]);
  const [modelUserCreators, setModelUserCreators] = useState({});

  useEffect(() => {
    const ft = [
      {
        id: "1",
        modelImage:
          "https://ucarecdn.com/ffd1a7fa-bb9d-4324-8d4b-91dee41ab4e3/",
        modelName: "name",
        username: "username",
        price: "10.00",
        NSFW: false,
      },
      {
        id: "2",
        modelImage:
          "https://ucarecdn.com/ffd1a7fa-bb9d-4324-8d4b-91dee41ab4e3/",
        modelName: "name",
        username: "username",
        price: "10.00",
        NSFW: true,
      },
      {
        id: "3",
        modelImage:
          "https://ucarecdn.com/ffd1a7fa-bb9d-4324-8d4b-91dee41ab4e3/",
        modelName: "name",
        username: "username",
        price: "10.00",
        NSFW: false,
      },
      {
        id: "4",
        modelImage:
          "https://ucarecdn.com/ffd1a7fa-bb9d-4324-8d4b-91dee41ab4e3/",
        modelName: "name",
        username: "username",
        price: "10.00",
        NSFW: false,
      },
      {
        id: "5",
        modelImage:
          "https://ucarecdn.com/ffd1a7fa-bb9d-4324-8d4b-91dee41ab4e3/",
        modelName: "name",
        username: "username",
        price: "10.00",
        NSFW: false,
      },
      {
        id: "6",
        modelImage:
          "https://ucarecdn.com/ffd1a7fa-bb9d-4324-8d4b-91dee41ab4e3/",
        modelName: "name",
        username: "username",
        price: "10.00",
        NSFW: false,
      },
      {
        id: "7",
        modelImage:
          "https://ucarecdn.com/ffd1a7fa-bb9d-4324-8d4b-91dee41ab4e3/",
        modelName: "name",
        username: "username",
        price: "10.00",
        NSFW: false,
      },
      {
        id: "8",
        modelImage:
          "https://ucarecdn.com/ffd1a7fa-bb9d-4324-8d4b-91dee41ab4e3/",
        modelName: "name",
        username: "username",
        price: "10.00",
        NSFW: false,
      },
      {
        id: "9",
        modelImage:
          "https://ucarecdn.com/ffd1a7fa-bb9d-4324-8d4b-91dee41ab4e3/",
        modelName: "name",
        username: "username",
        price: "10.00",
        NSFW: false,
      },
      {
        id: "10",
        modelImage:
          "https://ucarecdn.com/ffd1a7fa-bb9d-4324-8d4b-91dee41ab4e3/",
        modelName: "name",
        username: "username",
        price: "10.00",
        NSFW: false,
      },
      {
        id: "11",
        modelImage:
          "https://ucarecdn.com/ffd1a7fa-bb9d-4324-8d4b-91dee41ab4e3/",
        modelName: "name",
        username: "username",
        price: "10.00",
        NSFW: false,
      },
      {
        id: "12",
        modelImage:
          "https://ucarecdn.com/ffd1a7fa-bb9d-4324-8d4b-91dee41ab4e3/",
        modelName: "name",
        username: "username",
        price: "10.00",
        NSFW: false,
      },
      {
        id: "13",
        modelImage:
          "https://ucarecdn.com/ffd1a7fa-bb9d-4324-8d4b-91dee41ab4e3/",
        modelName: "name",
        username: "username",
        price: "10.00",
        NSFW: false,
      },
    ];

    const tp = [
      {
        id: "1",
        modelImage:
          "https://ucarecdn.com/ffd1a7fa-bb9d-4324-8d4b-91dee41ab4e3/",
        modelName: "name",
        username: "username",
        price: "10.00",
        NSFW: false,
      },
      {
        id: "2",
        modelImage:
          "https://ucarecdn.com/ffd1a7fa-bb9d-4324-8d4b-91dee41ab4e3/",
        modelName: "name",
        username: "username",
        price: "10.00",
        NSFW: false,
      },
      {
        id: "3",
        modelImage:
          "https://ucarecdn.com/ffd1a7fa-bb9d-4324-8d4b-91dee41ab4e3/",
        modelName: "name",
        username: "username",
        price: "10.00",
        NSFW: false,
      },
      {
        id: "4",
        modelImage:
          "https://ucarecdn.com/ffd1a7fa-bb9d-4324-8d4b-91dee41ab4e3/",
        modelName: "name",
        username: "username",
        price: "10.00",
        NSFW: false,
      },
      {
        id: "5",
        modelImage:
          "https://ucarecdn.com/ffd1a7fa-bb9d-4324-8d4b-91dee41ab4e3/",
        modelName: "name",
        username: "username",
        price: "10.00",
        NSFW: false,
      },
      {
        id: "6",
        modelImage:
          "https://ucarecdn.com/ffd1a7fa-bb9d-4324-8d4b-91dee41ab4e3/",
        modelName: "name",
        username: "username",
        price: "10.00",
        NSFW: false,
      },
      {
        id: "7",
        modelImage:
          "https://ucarecdn.com/ffd1a7fa-bb9d-4324-8d4b-91dee41ab4e3/",
        modelName: "name",
        username: "username",
        price: "10.00",
        NSFW: false,
      },
      {
        id: "8",
        modelImage:
          "https://ucarecdn.com/ffd1a7fa-bb9d-4324-8d4b-91dee41ab4e3/",
        modelName: "name",
        username: "username",
        price: "10.00",
        NSFW: false,
      },
      {
        id: "9",
        modelImage:
          "https://ucarecdn.com/ffd1a7fa-bb9d-4324-8d4b-91dee41ab4e3/",
        modelName: "name",
        username: "username",
        price: "10.00",
        NSFW: false,
      },
      {
        id: "10",
        modelImage:
          "https://ucarecdn.com/ffd1a7fa-bb9d-4324-8d4b-91dee41ab4e3/",
        modelName: "name",
        username: "username",
        price: "10.00",
        NSFW: false,
      },
      {
        id: "11",
        modelImage:
          "https://ucarecdn.com/ffd1a7fa-bb9d-4324-8d4b-91dee41ab4e3/",
        modelName: "name",
        username: "username",
        price: "10.00",
        NSFW: false,
      },
      {
        id: "12",
        modelImage:
          "https://ucarecdn.com/ffd1a7fa-bb9d-4324-8d4b-91dee41ab4e3/",
        modelName: "name",
        username: "username",
        price: "10.00",
        NSFW: false,
      },
      {
        id: "13",
        modelImage:
          "https://ucarecdn.com/ffd1a7fa-bb9d-4324-8d4b-91dee41ab4e3/",
        modelName: "name",
        username: "username",
        price: "10.00",
        NSFW: false,
      },
    ];
    axios
      .get(`${process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE}/api/v1/all/models`, {
        withCredentials: true,
      })
      .then((res) => {
        console.log("res 111", res);
        setFeaturedToday(res.data);
        setTopPicks(res.data);
        for (let model of res.data) {
          console.log("modelllllll", model);
          axios
            .get(
              `${process.env.NEXT_PUBLIC_USER_SERVICE_URL}/api/v1/user?userid=${model.userId}`,{withCredentials:true}
            )
            .then((res) => {
              console.log("Userres", res);
              setModelUserCreators((current) => {
                const username = res?.data?.username ? res?.data?.username : "";
                const profilePicture = res?.data?.displayInformation
                  ?.profilePicture
                  ? res?.data?.displayInformation?.profilePicture
                      ?.croppedPictureUrl
                    ? res.data?.displayInformation?.profilePicture
                        ?.croppedPictureUrl
                    : res.data?.displayInformation?.profilePicture?.profilePicture
                    ? res.data?.displayInformation?.profilePicture?.profilePicture
                    : undefined
                  : undefined;
                // const profilePicture = res.data?.["displayInformation"]?.[
                //   "croppedPictureUrl"
                // ]
                //   ? res.data.displayInformation.croppedPictureUrl
                //   : res.data?.displayInformation?.profilePicture
                //   ? res.data.displayInformation.profilePicture
                //   : undefined;
                
                return {
                  ...current,
                  [model._id]: {
                    username: username,
                    userProfilePicture: profilePicture,
                  },
                };
              });
              // console.log("profilePicture", profilePicture,"Hi there");
            })
            .catch((err) => {
              console.log("err", err);
            });
        }
      })
      .catch((err) => {
        console.log("err 111", err);
      });
    // setFeaturedToday(ft);
    // setTopPicks(tp);
  }, []);
  return (
    <div className="flex flex-col gap-[26px]">
      <div className="flex items-center justify-center relative overflow-hidden">
        <img
          src="/temp/MarketplaceBackground.svg"
          alt="Marketplace Background"
          className=""
        />
        <div className="flex flex-col items-center justify-center gap-8 absolute w-full">
          <div className="flex flex-col gap-4">
            <h1 className="text-headline-xl font-bold text-dark-neutral-700">
              Explore models
            </h1>
            <span className="text-xl text-dark-neutral-200">
              Projects to show some love today!
            </span>
          </div>
          <div className="flex gap-3 py-[14px] px-4 border-[1px] border-light-neutral-700 bg-white shadow-xs rounded-[5px] w-full max-w-[650px]">
            <div className="relative w-6 h-6">
              {/* <img src="/SVG/Search.svg" alt="Search Icon" /> */}
              <Image src="/SVG/Zoom_Search.svg" alt="Search Icon" fill />
            </div>
            <input
              type="text"
              placeholder="Search"
              className="border-0 focus:outline-none text-lg font-medium text-light-neutral-900 bg-transparent grow"
            />
          </div>
          <div className="flex items-center justify-center gap-3 w-full px-[60px]">
            <div className="flex items-center justify-center">
              <div className="w-[18px] h-[36px] relative z-10">
                <div className="absolute w-[36px] h-full rounded-full bg-white border-[1px] border-light-neutral-600 shadow-xs p-2 left-0">
                  <div className="w-full h-full relative">
                    <Image src="/SVG/Chevron_Left.svg" alt="Cevron Left" fill />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-8 gap-2 h-[80px]">
                {headerCategories.map((category, index) => (
                  <div
                    key={`header-category-${index}`}
                    className="flex items-center justify-center relative h-full w-full"
                  >
                    <Image src={category?.imageUrl} alt="Category Image" fill />
                    {/* <span>{category.title}</span> */}
                  </div>
                ))}
              </div>
              <div className="w-[18px] h-[36px] relative z-10">
                <div className="absolute w-[36px] h-full rounded-full bg-primary-purple-500 shadow-xs p-2 right-0 text-white">
                  <div className="w-full h-full relative">
                    <Image
                      src="/SVG/Chevron_Right.svg"
                      alt="Cevron Right"
                      fill
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="h-[42px] w-[42px] rounded-[5px] bg-white border-[1px] border-light-neutral-600 shadow-xs p-3">
              <div className="relative w-full h-full">
                <Image src="/SVG/Dot_Menu.svg" alt="Cevron Right" fill />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-[60px]">
        <div className="flex flex-col gap-8 px-14">
          <h2 className="text-headline-sm font-semibold">Featured Today</h2>
          <div className="grid grid-cols-5 gap-6">
            {featuredToday &&
              featuredToday.slice(0, 10).map((model) => (
                <div key={model._id}>
                  {console.log(
                    "modelUserCreators?.[model._id]",
                    modelUserCreators?.[model._id]
                  )}
                  <MarketplaceCard
                    id={model._id}
                    image={model?.coverImage}
                    modelName={model?.modelName}
                    username={modelUserCreators?.[model._id]?.username}
                    userImage={
                      modelUserCreators?.[model._id]?.userProfilePicture
                    }
                    price={model?.price}
                    NSFW={model?.NSFW}
                  />
                </div>
              ))}
          </div>
        </div>
        <div className="flex items-center justify-between bg-primary-purple-700 p-[60px]">
          <div className="flex flex-col items-start justify-start gap-9">
            <div className="flex flex-col gap-4 text-white">
              <div className="text-headline-md font-semibold">
                Top picks by Ikarus nest
              </div>
              <div className="text-xl font-medium">
                Modular STL files for 3d printing. 300+
                <br />
                files of legendary warriors
              </div>
            </div>
            <button className="flex items-center justify-center h-12 px-[18px] bg-white text-dark-neutral-700 font-semibold text-md shadow-xs border-[1px] border-light-neutral-600 rounded-[8px]">
              View all
            </button>
          </div>
          <div className="grow"></div>
        </div>
        <div className="flex flex-col gap-[60px]">
          <MarketplaceSingleRowModels
            heading="Ready to print files"
            models={featuredToday}
            modelUserCreators={modelUserCreators}
          />
          <MarketplaceSingleRowModels
            heading="Ready to print files"
            models={featuredToday}
            modelUserCreators={modelUserCreators}
          />
          <MarketplaceSingleRowModels
            heading="Ready to print files"
            models={featuredToday}
            modelUserCreators={modelUserCreators}
          />
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default Marketplace;
