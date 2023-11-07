import React from "react"
import UserModels from "./UserModels";
import UserAboutSection from './UserAboutSection'
import UserPortfolioSection from './UserPortfolioSection'
import UserBackedCampaignsSection from './UserBackedCampaignsSection'

export default function NavSections({user,section}){
    return(
      <div>
        {section === "about" ? (
          <UserAboutSection
            user={
              user
              ? user
              : undefined
            }
            videoUrl={
              user?.displayInformation?.introductoryVideoUrl
                ? user.displayInformation.introductoryVideoUrl
                : undefined
            }
            description={
              user?.displayInformation?.description
                ? user.displayInformation.description
                : undefined
            }
          />
        ) : section === "portfolio" ? (
          <UserPortfolioSection user={user} />
        ) : section === "models" ? (
          <UserModels
            username={user?.username}
            profilePicture={
              user?.displayInformation?.profilePicture
                ?.croppedPictureUrl
            }
          />
        ) : section === "campaigns" ? (
          <UserBackedCampaignsSection />
        ) : (
          <></>
        )}
      </div>
    )
  }