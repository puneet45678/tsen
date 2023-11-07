import React, { useEffect, useState } from "react"
import Image from "next/image";
import LikeIcon from "../../icons/LikeIcon";
import ViewsIcon from "../../icons/ViewsIcon";
import PortfolioCardModal from "./PortfolioCardModal";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

const singleObject={
  _id: "64d21032aebd380c732844ad",
  createdBy: "652ccb7a3010089c9753b1c1",
  createdAt: "2023-08-08T09:51:46.033000",
  updatedAt: "2023-08-08T13:03:29.668000",
  description: "<p><span style=\"background-color: rgb(32, 33, 36); color: rgb(189, 193, 198);\">You could feel difference in character</span></p><p><span style=\"background-color: rgb(32, 33, 36); color: rgb(189, 193, 198);\">The genuine article exceeds revision as narrative (Narrative)</span></p><p><span style=\"background-color: rgb(32, 33, 36); color: rgb(189, 193, 198);\">Isn't factual, I intend to be accurate</span></p><p><span style=\"background-color: rgb(32, 33, 36); color: rgb(189, 193, 198);\">Money talks, many rap lyrics are counterfeit</span></p><p><span style=\"background-color: rgb(32, 33, 36); color: rgb(189, 193, 198);\">I've been through challenges, I reminisce and feel blessed</span></p>",
  portfolioName: "Life and Rhymes",
  coverImage:"https://source.unsplash.com/random",
  videoLinks: [
      "https://youtu.be/wPdn4TxT9JI",
      "https://youtu.be/wPdn4TxT9JI",
      "https://youtu.be/wPdn4TxT9JI",
      "https://youtu.be/wPdn4TxT9JI",
      "https://youtu.be/wPdn4TxT9JI",
      "https://youtu.be/wPdn4TxT9JI",
      "https://youtu.be/wPdn4TxT9JI",
      "https://youtu.be/wPdn4TxT9JI",
      "https://youtu.be/wPdn4TxT9JI",
      "https://youtu.be/wPdn4TxT9JI"
      
  ],
  portfolioImages: [
      {
          imageId: "d3a77a8a-eacf-4ccc-a4c1-941a96196e60",
          imageUrl: "https://ucarecdn.com/d3a77a8a-eacf-4ccc-a4c1-941a96196e60/",
          imageName: "wallpaper2.jpg",
          croppedUrl: ""
      },
      {
          imageId: "923a54a3-488d-4d68-8be5-3214803e6d90",
          imageUrl: "https://ucarecdn.com/923a54a3-488d-4d68-8be5-3214803e6d90/",
          imageName: "wallpaper1.jpg",
          croppedUrl: ""
      },
      {
          imageId: "c02be228-ba08-4b8c-a70f-230b5e95ca86",
          imageUrl: "https://ucarecdn.com/c02be228-ba08-4b8c-a70f-230b5e95ca86/",
          imageName: "wallpaper2.jpg",
          croppedUrl: ""
      },
      {
          imageId: "e2d37b57-5c86-4a68-89f2-6e114e88c0b6",
          imageUrl: "https://ucarecdn.com/e2d37b57-5c86-4a68-89f2-6e114e88c0b6/",
          imageName: "wallpaper1.jpg",
          croppedUrl: ""
      },
      {
          imageId: "124aaa13-31dc-4b33-b639-3cdc6755b8bb",
          imageUrl: "https://ucarecdn.com/124aaa13-31dc-4b33-b639-3cdc6755b8bb/",
          imageName: "wallpaper2.jpg",
          croppedUrl: ""
      },
      {
          imageId: "cbb0b53e-5cb2-432e-88e6-4703293b0ce2",
          imageUrl: "https://ucarecdn.com/cbb0b53e-5cb2-432e-88e6-4703293b0ce2/",
          imageName: "starryNights.jpg",
          croppedUrl: ""
      },
      {
          imageId: "0b57ae23-2041-424e-a810-275d9ba04153",
          imageUrl: "https://ucarecdn.com/0b57ae23-2041-424e-a810-275d9ba04153/",
          imageName: "solidity.png",
          croppedUrl: ""
      },
      {
          imageId: "da7321d4-5114-410c-883c-7e4dd5195025",
          imageUrl: "https://ucarecdn.com/da7321d4-5114-410c-883c-7e4dd5195025/",
          imageName: "wallpaper1.jpg",
          croppedUrl: ""
      },
      {
          imageId: "feb4e436-5e81-450a-a739-9f9be9b50a61",
          imageUrl: "https://ucarecdn.com/feb4e436-5e81-450a-a739-9f9be9b50a61/",
          imageName: "starryNights.jpg",
          croppedUrl: ""
      },
      {
          imageId: "fc31c01f-6342-4e26-a268-95600c7fe044",
          imageUrl: "https://ucarecdn.com/fc31c01f-6342-4e26-a268-95600c7fe044/",
          imageName: "wallpaper2.jpg",
          croppedUrl: ""
      },
      {
          imageId: "3293face-b66e-4795-819d-ce856d8d470c",
          imageUrl: "https://ucarecdn.com/3293face-b66e-4795-819d-ce856d8d470c/",
          imageName: "wallpaper2.jpg",
          croppedUrl: ""
      },
      {
          imageId: "bd082433-5f39-42a8-9308-d56193a6f202",
          imageUrl: "https://ucarecdn.com/bd082433-5f39-42a8-9308-d56193a6f202/",
          imageName: "wallpaper1.jpg",
          croppedUrl: ""
      },
      {
          imageId: "6906cacc-de0f-45a5-b5f9-e34ba2297dab",
          imageUrl: "https://ucarecdn.com/6906cacc-de0f-45a5-b5f9-e34ba2297dab/",
          imageName: "solidity.png",
          croppedUrl: ""
      },
      {
          imageId: "0fc7fbbe-1daf-46c8-a4f6-f31285a5777e",
          imageUrl: "https://ucarecdn.com/0fc7fbbe-1daf-46c8-a4f6-f31285a5777e/",
          imageName: "wallpaper2.jpg",
          croppedUrl: ""
      }
  ],
  likesCount:4,
  viewsCount:10,
  comments: ["1693477987442204","1693477987442204","1693477987442204","1693477987442204"],
}

export default function UserPortfolioSectionCard({data,user}){
    const router = useRouter()
    console.log("QUWRY",data)
    const [modal,setModal] = useState(router.query.openPortfolio===data._id)
    
    if(data?.portfolioName?.length>35){
      data.portfolioName = data.portfolioName.slice(0,30) + "...."
    }

    return(
      <>
      <Link href={{pathname:window.location.toString() , query:'openPortfolio='+data._id}} onClick={()=>setModal(true)} className="flex flex-col shadow-xs rounded-md border border-light-neutral-600 hover:cursor-pointer">
        <div>
          <Image className="aspect-[7/5] rounded-t-md" width={280} height={200} src={data.coverImage || data.portfolioImages[0]?.imageUrl || "/images/image20.webp"  } alt="file image" />
        </div>
        <div className="flex flex-col p-4 pb-6 gap-4">
          <h6 className="text-dark-neutral-700 text-lg font-semibold">
            {data.portfolioName}
          </h6>
  
          <div className="flex items-start justify-between px-4 py-3 rounded-[5px] bg-light-neutral-100">
            {/* Likes Count */}
            <div className="flex gap-[5px] items-center">
              <div className="flex gap-2 items-center"> 
                <div className="h-[14px] w-[14px]">
                  <LikeIcon />
                </div>
                <h6 className="text-sm font-semibold uppercase">
                  {data.likesCount}
                </h6>
              </div>
              <div className="text-dark-neutral-200">
                Likes
              </div>
            </div>
            {/* Views Count */}
            <div className="flex gap-[5px] items-center">
              <div className="flex gap-2 items-center"> 
                <div className="h-[14px] w-[14px]">
                  <ViewsIcon />
                </div>
                <h6 className="text-sm font-semibold uppercase">
                  {data.viewsCount}
                </h6>
              </div>
              <div className="text-dark-neutral-200">
                views
              </div>
            </div>
          </div>
        </div>
      </Link>
      <PortfolioCardModal user={user} data={data} show={modal} setShow={setModal} />
      </>
    )
  }