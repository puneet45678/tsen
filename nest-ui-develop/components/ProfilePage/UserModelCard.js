import React from "react";
import Link from "next/link";
import MatureContentPlaceholder from "../ModelMarketplace/MatureContentPlaceholder";
import Image from "next/image";

const singleModelObject={
    id:"dlkfghssmrfrc4837ytr",
    coverImage:"/images/image1.webp",
    modelName:"Some Model Name This is",
    price:12.00,
    NSFW:true,
  }  

export default function UsersModelCard({_id,coverImage,modelName,username,userImage,price,NSFW,...props}){
    if(modelName.length>35){
        modelName = modelName.slice(0,30) + "...."
    }
    return(
        <Link
        href={`/model/${_id}`}
        className="flex flex-col shadow-xs rounded-md border border-light-neutral-600"
        >
        <div
            className={`w-full aspect-[7/5] rounded-t-md overflow-hidden flex `}
        >
            {NSFW? (
            <div className="relative">
                <Image src={coverImage} width={280} height={200} alt="Model Image"/>
                <div className="w-full h-full absolute top-0">
                <MatureContentPlaceholder/>
                </div>
            </div>
            ):(
            <Image src={coverImage} width={280} height={200} alt="Model Image"/>
            )
            }
        </div>
        <div className="flex flex-col p-4 gap-4">
            <h6 className="text-dark-neutral-700 text-lg font-semibold">
                {modelName}
            </h6>
            <div className="flex items-center justify-start gap-3">
            <div className="relative w-8 h-8 bg-gray-300 rounded-full overflow-hidden">
                {userImage && (
                <Image
                    src={userImage}
                    alt="Model Create Image"
                    className="object-cover object-center"
                    fill
                />
                )}
            </div>
            <span className="text-sm">by {username}</span>
            </div>
            <div className="flex justify-between">
            <div className="w-[50%]">
                [Rating]
    
            </div>
            <span className="text-primary-purple-500 text-xl font-bold">
                $ {price}
            </span>
            </div>
        </div>
        </Link>
    )
    }