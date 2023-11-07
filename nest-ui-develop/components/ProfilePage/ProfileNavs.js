import Link from "next/link"
import React from "react"
export default function ProfileNavs({username,section,user}){
    return(
        <div className="py-8">
          <div className="flex gap-4 h-11 ">
            <Link
              href={`/user/${username}/about`}
              className={`${
                section === "about"
                  ? "bg-primary-purple-50 text-primary-purple-500"
                  : "text-dark-neutral-200 hover:bg-light-neutral-300 hover:text-dark-neutral-700"
              } flex items-center justify-center text-md font-semibold rounded-[5px] px-4`}
              scroll={false}
            >
              About
            </Link>
            <Link
              href={`/user/${username}/portfolio`}
              className={`${
                section === "portfolio"
                  ? "bg-primary-purple-50 text-primary-purple-500"
                  : "text-dark-neutral-200 hover:bg-light-neutral-300 hover:text-dark-neutral-700"
              } flex items-center justify-center text-md font-semibold rounded-[5px] px-4 py-[11px]`}
              scroll={false}
            >
              Portfolio
            </Link>
            <Link
              href={`/user/${username}/models`}
              className={`${
                section === "models"
                  ? "bg-primary-purple-50 text-primary-purple-500"
                  : "text-dark-neutral-200 hover:bg-light-neutral-300 hover:text-dark-neutral-700"
              } flex items-center justify-center text-md font-semibold rounded-[5px] px-4`}
              scroll={false}
            >
              Models
            </Link>
            <Link
              href={`/user/${username}/campaigns`}
              className={`${
                section === "campaigns"
                  ? "bg-primary-purple-50 text-primary-purple-500"
                  : "text-dark-neutral-200 hover:bg-light-neutral-300 hover:text-dark-neutral-700"
              } flex items-center justify-center text-md font-semibold rounded-[5px] px-4`}
              scroll={false}
            >
              Campaigns
            </Link>
          </div>
        </div>
    )
  }