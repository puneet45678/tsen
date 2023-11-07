import React, { useState, useEffect } from "react";
import MyNestContentWithBreadcrumbs from "../MyNestContentWithBreadcrumbs";
import Image from "next/image";
import TierMilestoneCard from "./TierMilestoneCard";

const CampaignTiersAndMilestonesDisplay = ({ selectedCampaign }) => {
  const [currentCampaignSection, setCurrentCampaignSection] = useState("tiers");

  return (
    <MyNestContentWithBreadcrumbs
      breadcrumbBackButtonLink="/my-nest/purchases/campaigns"
      breadcrumbItems={tierPageBreadcrumbItems}
    >
      <div className="flex flex-col gap-6">
        <div className="flex">
          {currentCampaignSection === "tiers" ? (
            <button className="flex items-center justify-center gap-2 h-11 px-4 bg-primary-purple-50 rounded-[5px] text-primary-purple-500 text-md font-semibold">
              <Image
                src="/SVG/File_Multiple_Purple.svg"
                width={18}
                height={18}
              />
              Tiers
            </button>
          ) : (
            <button
              className="flex items-center justify-center gap-2 h-11 px-4 text-dark-neutral-200 text-md font-semibold"
              onClick={() => setCurrentCampaignSection("tiers")}
            >
              <Image src="/SVG/File_Multiple_Gray.svg" width={18} height={18} />
              Tiers
            </button>
          )}
          {currentCampaignSection === "milestones" ? (
            <button className="flex items-center justify-center gap-2 h-11 px-4 bg-primary-purple-50 rounded-[5px] text-primary-purple-500 text-md font-semibold">
              <Image src="/SVG/Mountain_Purple.svg" width={18} height={18} />
              Milestones
            </button>
          ) : (
            <button
              className="flex items-center justify-center gap-2 h-11 px-4 text-dark-neutral-200 text-md font-semibold"
              onClick={() => setCurrentCampaignSection("milestones")}
            >
              <Image src="/SVG/Mountain_Gray.svg" width={18} height={18} />
              Milestones
            </button>
          )}
        </div>
        <div className="grid grid-cols-5 gap-6">
          {selectedCampaign ? (
            currentCampaignSection === "tiers" && selectedCampaign.tiers ? (
              <>
                {selectedCampaign.tiers.map((tier, index) => (
                  <div key={`tier-${tier._id}-${index}`} className="w-full">
                    <TierMilestoneCard
                      id={tier._id}
                      coverImage={tier?.coverImage ? tier.coverImage : ""}
                      name={tier?.tierName ? tier.tierName : ""}
                      modelsNumber={tier.models}
                      buttonClickHandler={() => {
                        router.push(
                          `/my-nest/purchases/campaigns/${queries[0]}/tier/${tier._id}`
                        );
                      }}
                      // TODO change it
                      ownerName="ABC"
                      ownerImage="https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Two_red_dice_01.svg/1200px-Two_red_dice_01.svg.png"
                    />
                  </div>
                ))}
              </>
            ) : currentCampaignSection === "milestones" &&
              selectedCampaign.milestones ? (
              <>
                {selectedCampaign.milestones.map((milestone, index) => (
                  <div
                    key={`milestone-${milestone._id}-${index}`}
                    className="w-full"
                  >
                    <TierMilestoneCard
                      id={milestone._id}
                      coverImage={
                        milestone?.coverImage ? milestone.coverImage : ""
                      }
                      name={
                        milestone?.milestoneName ? milestone.milestoneName : ""
                      }
                      modelsNumber={milestone.models}
                      buttonClickHandler={() => {
                        router.push(
                          `/my-nest/purchases/campaigns/${queries[0]}/milestone/${milestone._id}`
                        );
                      }}
                      // TODO change it
                      ownerName="ABC"
                      ownerImage="https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Two_red_dice_01.svg/1200px-Two_red_dice_01.svg.png"
                    />
                  </div>
                ))}
              </>
            ) : (
              <></>
            )
          ) : (
            <></>
          )}
        </div>
      </div>
    </MyNestContentWithBreadcrumbs>
  );
};

export default CampaignTiersAndMilestonesDisplay;
