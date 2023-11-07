import React,{useState, useEffect} from 'react'
import BreadCrumbs from '../../components/Layouts/BreadCrumbs'
import MyWishlistDisplay from "../../components/my-wishlist/MyWishlistDisplay"

export default function MyWishlist() {
  const [sectionSelected, setSectionSelected] = useState("Models")
    const breadcrumbItems = [
        {
          title: "Home",
          to: "/home",
        },
        {
          title: "My Wishlist",
        },
      ];

  return (
    <div className="w-full h-full py-8 bg-light-neutral-50">
      <div className="pb-6 border-b-[1px] border-light-neutral-500 mx-[60px]">
        <BreadCrumbs items={breadcrumbItems} />
      </div>
      <div className="flex flex-col py-[48px] ml-[212px] mr-[135px]">
        <div className="flex flex-col gap-[32px]">
          <span className="text-black text-headline-md font-[600]">My Wishlist</span>
          <div className="flex gap-[194px]">
            <div className="flex flex-col gap-[16px]">
              <button onClick={()=>{setSectionSelected("Models")}} className={`${sectionSelected==="Models"?"bg-primary-purple-50 text-primary-purple-500 rounded-[6px]":""} w-fit px-[16px] py-[11px] text-md font-[600]`}>Models</button>
              <button onClick={()=>{setSectionSelected("Campaigns")}} className={`${sectionSelected==="Campaigns"?"bg-primary-purple-50 text-primary-purple-500 rounded-[6px]":""} w-fit px-[16px] py-[11px] text-md font-[600]`}>Campaigns</button>
            </div>
            <div className="w-full h-full">
                <MyWishlistDisplay sectionSelected={sectionSelected}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
