import { useEffect, useState } from "react";
import MyNestContent from "../MyNestContent";
import CampaignCard from "./CampaignCard";
import Image from "next/image";
import BreadCrumbsWithBackButton from "../../Layouts/BreadCrumbsWithBackButton";
import { useRouter } from "next/router";
import MyNestContentWithBreadcrumbs from "../MyNestContentWithBreadcrumbs";
import TierMilestoneCard from "./TierMilestoneCard";
import CampaignModelsDisplay from "./CampaignModelsDisplay";
import CampaignTiersAndMilestonesDisplay from "./CampaignTiersAndMilestonesDisplay";

const CampaignPurchases = ({ queries }) => {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState();
  const [currentCampaignSection, setCurrentCampaignSection] = useState("tiers");

  const tierPageBreadcrumbItems = [
    {
      title: "Purchased Campaigns",
      to: "/my-nest/purchases/campaigns",
    },
    {
      title: selectedCampaign?.campaignName,
    },
  ];

  useEffect(() => {
    console.log("use effect ran", campaigns, "selected", selectedCampaign);

    if (!campaigns || campaigns.length === 0) {
      const resData = [
        {
          _id: "id",
          coverImage:
            "https://ucarecdn.com/434d7b9d-0d4e-4e2e-bd76-192b8e294910/",
          campaignName: "Model 1",
          creatorName: "Name",
          tiers: [
            {
              _id: "id",
              coverImage:
                "https://ucarecdn.com/434d7b9d-0d4e-4e2e-bd76-192b8e294910/",
              tierName: "Tier 1",
              models: 2,
            },
          ],
          milestones: [
            {
              _id: "id",
              coverImage:
                "https://ucarecdn.com/434d7b9d-0d4e-4e2e-bd76-192b8e294910/",
              milestoneName: "Milestone 1",
              models: 2,
            },
            {
              _id: "id",
              coverImage:
                "https://ucarecdn.com/434d7b9d-0d4e-4e2e-bd76-192b8e294910/",
              milestoneName: "Milestone 2",
              models: 2,
            },
          ],
        },
        {
          _id: "id",
          coverImage:
            "https://ucarecdn.com/434d7b9d-0d4e-4e2e-bd76-192b8e294910/",
          campaignName: "Model 2",
          creatorName: "Name",
          tiers: [
            {
              _id: "id",
              coverImage:
                "https://ucarecdn.com/434d7b9d-0d4e-4e2e-bd76-192b8e294910/",
              tierName: "Tier 1",
              models: 2,
            },
          ],
          milestones: [
            {
              _id: "id",
              coverImage:
                "https://ucarecdn.com/434d7b9d-0d4e-4e2e-bd76-192b8e294910/",
              milestoneName: "Milestone 1",
              models: 2,
            },
            {
              _id: "id",
              coverImage:
                "https://ucarecdn.com/434d7b9d-0d4e-4e2e-bd76-192b8e294910/",
              milestoneName: "Milestone 2",
              models: 2,
            },
          ],
        },
        {
          _id: "id",
          coverImage:
            "https://ucarecdn.com/434d7b9d-0d4e-4e2e-bd76-192b8e294910/",
          campaignName: "Model 3",
          creatorName: "Name",
          tiers: [
            {
              _id: "id",
              coverImage:
                "https://ucarecdn.com/434d7b9d-0d4e-4e2e-bd76-192b8e294910/",
              tierName: "Tier 1",
              models: 2,
            },
          ],
          milestones: [
            {
              _id: "id",
              coverImage:
                "https://ucarecdn.com/434d7b9d-0d4e-4e2e-bd76-192b8e294910/",
              milestoneName: "Milestone 1",
              models: 2,
            },
            {
              _id: "id",
              coverImage:
                "https://ucarecdn.com/434d7b9d-0d4e-4e2e-bd76-192b8e294910/",
              milestoneName: "Milestone 2",
              models: 2,
            },
          ],
        },
        {
          _id: "id",
          coverImage:
            "https://ucarecdn.com/434d7b9d-0d4e-4e2e-bd76-192b8e294910/",
          campaignName: "Model 4",
          creatorName: "Name",
          tiers: [
            {
              _id: "id",
              coverImage:
                "https://ucarecdn.com/434d7b9d-0d4e-4e2e-bd76-192b8e294910/",
              tierName: "Tier 1",
              models: 2,
            },
          ],
          milestones: [
            {
              _id: "id",
              coverImage:
                "https://ucarecdn.com/434d7b9d-0d4e-4e2e-bd76-192b8e294910/",
              milestoneName: "Milestone 1",
              models: 2,
            },
            {
              _id: "id",
              coverImage:
                "https://ucarecdn.com/434d7b9d-0d4e-4e2e-bd76-192b8e294910/",
              milestoneName: "Milestone 2",
              models: 2,
            },
          ],
        },
        {
          _id: "id",
          coverImage:
            "https://ucarecdn.com/434d7b9d-0d4e-4e2e-bd76-192b8e294910/",
          campaignName: "Model 5",
          creatorName: "Name",
          tiers: [
            {
              _id: "id",
              coverImage:
                "https://ucarecdn.com/434d7b9d-0d4e-4e2e-bd76-192b8e294910/",
              tierName: "Tier 1",
              models: 2,
            },
          ],
          milestones: [
            {
              _id: "id",
              coverImage:
                "https://ucarecdn.com/434d7b9d-0d4e-4e2e-bd76-192b8e294910/",
              milestoneName: "Milestone 1",
              models: 2,
            },
            {
              _id: "id",
              coverImage:
                "https://ucarecdn.com/434d7b9d-0d4e-4e2e-bd76-192b8e294910/",
              milestoneName: "Milestone 2",
              models: 2,
            },
          ],
        },
        {
          _id: "id",
          coverImage:
            "https://ucarecdn.com/434d7b9d-0d4e-4e2e-bd76-192b8e294910/",
          campaignName: "Model 6",
          creatorName: "Name",
          tiers: [
            {
              _id: "id",
              coverImage:
                "https://ucarecdn.com/434d7b9d-0d4e-4e2e-bd76-192b8e294910/",
              tierName: "Tier 1",
              models: 2,
            },
          ],
          milestones: [
            {
              _id: "id",
              coverImage:
                "https://ucarecdn.com/434d7b9d-0d4e-4e2e-bd76-192b8e294910/",
              milestoneName: "Milestone 1",
              models: 2,
            },
            {
              _id: "id",
              coverImage:
                "https://ucarecdn.com/434d7b9d-0d4e-4e2e-bd76-192b8e294910/",
              milestoneName: "Milestone 2",
              models: 2,
            },
          ],
        },
      ];
      console.log("in use effect 1");
      setCampaigns(resData);
    }
  }, []);

  useEffect(() => {
    if (
      !selectedCampaign &&
      queries.length === 1 &&
      campaigns &&
      campaigns.length > 0
    ) {
      console.log("in use effect 2");
      const campaignId = queries[0];
      console.log("campaignId", campaignId);
      const currentCampaign = campaigns.find(
        (campaign) => campaign._id === campaignId
      );
      if (currentCampaign) setSelectedCampaign(currentCampaign);
      else setSelectedCampaign({});
    }
  }, [campaigns]);

  console.log("campaigns", campaigns, "selectedCampaign", selectedCampaign);

  if (queries.length === 0) {
    return (
      <MyNestContent
        empty={!campaigns || campaigns.length === 0}
        emptyImage="/temp/EmptyMyNest.png"
        emptyHeading="See what the world is building"
        emptyButtonText="Explore Campaigns"
        emptyButtonLink="/campaigns/explore"
        heading="Purchased Campaigns"
      >
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center justify-center gap-2 border-[1px] rounded-[5px] bg-white h-10 px-2 w-full max-w-[30rem] text-light-neutral-900 text-sm">
              <Image src="/SVG/Zoom_Search.svg" height={18} width={18} />
              <input
                type="text"
                placeholder="Search"
                className="grow rounded-r-sm focus:outline-none w-full bg-transparent placeholder-gray-500 "
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
              />
            </div>
            <div></div>
          </div>
          <div className="grid grid-cols-5 gap-6">
            {campaigns.map((campaign, index) => (
              <div key={`campaign-${campaign._id}-${index}`} className="w-full">
                <CampaignCard
                  id={campaign._id}
                  coverImage={campaign?.coverImage ? campaign.coverImage : ""}
                  campaignName={
                    campaign?.campaignName ? campaign.campaignName : ""
                  }
                  tiersNumber={campaign?.tiers ? campaign.tiers.length : 0}
                  unlockedMilestonesNumber={
                    campaign?.milestones ? campaign.milestones.length : 0
                  }
                  buttonClickHandler={() => {
                    setSelectedCampaign(campaign);
                    router.push(`/my-nest/purchases/campaigns/${campaign._id}`);
                  }}
                  // TODO change it
                  ownerName="ABC"
                  ownerImage="https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Two_red_dice_01.svg/1200px-Two_red_dice_01.svg.png"
                />
              </div>
            ))}
          </div>
        </div>
      </MyNestContent>
    );
  } else if (queries.length === 1) {
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
                <Image
                  src="/SVG/File_Multiple_Gray.svg"
                  width={18}
                  height={18}
                />
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
                          milestone?.milestoneName
                            ? milestone.milestoneName
                            : ""
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
  }
  // }else if (queries.length === 1 || queries.length === 3) {
  //   return (
  //     <MyNestContentWithBreadcrumbs
  //       breadcrumbBackButtonLink="/my-nest/purchases/campaigns"
  //       breadcrumbItems={tierPageBreadcrumbItems}
  //     >
  //       <div className="flex flex-col gap-6">
  //         <div className="flex">
  //           {currentCampaignSection === "tiers" ? (
  //             <button className="flex items-center justify-center gap-2 h-11 px-4 bg-primary-purple-50 rounded-[5px] text-primary-purple-500 text-md font-semibold">
  //               <Image
  //                 src="/SVG/File_Multiple_Purple.svg"
  //                 width={18}
  //                 height={18}
  //               />
  //               Tiers
  //             </button>
  //           ) : (
  //             <button
  //               className="flex items-center justify-center gap-2 h-11 px-4 text-dark-neutral-200 text-md font-semibold"
  //               onClick={() => setCurrentCampaignSection("tiers")}
  //             >
  //               <Image
  //                 src="/SVG/File_Multiple_Gray.svg"
  //                 width={18}
  //                 height={18}
  //               />
  //               Tiers
  //             </button>
  //           )}
  //           {currentCampaignSection === "milestones" ? (
  //             <button className="flex items-center justify-center gap-2 h-11 px-4 bg-primary-purple-50 rounded-[5px] text-primary-purple-500 text-md font-semibold">
  //               <Image src="/SVG/Mountain_Purple.svg" width={18} height={18} />
  //               Milestones
  //             </button>
  //           ) : (
  //             <button
  //               className="flex items-center justify-center gap-2 h-11 px-4 text-dark-neutral-200 text-md font-semibold"
  //               onClick={() => setCurrentCampaignSection("milestones")}
  //             >
  //               <Image src="/SVG/Mountain_Gray.svg" width={18} height={18} />
  //               Milestones
  //             </button>
  //           )}
  //         </div>
  //         <div className="grid grid-cols-5 gap-6">
  //           {selectedCampaign ? (
  //             currentCampaignSection === "tiers" && selectedCampaign.tiers ? (
  //               <>
  //                 {selectedCampaign.tiers.map((tier, index) => (
  //                   <div key={`tier-${tier._id}-${index}`} className="w-full">
  //                     <TierMilestoneCard
  //                       id={tier._id}
  //                       coverImage={tier?.coverImage ? tier.coverImage : ""}
  //                       name={tier?.tierName ? tier.tierName : ""}
  //                       modelsNumber={tier.models}
  //                       buttonClickHandler={() => {
  //                         router.push(
  //                           `/my-nest/purchases/campaigns/${queries[0]}/tier/${tier._id}`
  //                         );
  //                       }}
  //                       // TODO change it
  //                       ownerName="ABC"
  //                       ownerImage="https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Two_red_dice_01.svg/1200px-Two_red_dice_01.svg.png"
  //                     />
  //                   </div>
  //                 ))}
  //               </>
  //             ) : currentCampaignSection === "milestones" &&
  //               selectedCampaign.milestones ? (
  //               <>
  //                 {selectedCampaign.milestones.map((milestone, index) => (
  //                   <div
  //                     key={`milestone-${milestone._id}-${index}`}
  //                     className="w-full"
  //                   >
  //                     <TierMilestoneCard
  //                       id={milestone._id}
  //                       coverImage={
  //                         milestone?.coverImage ? milestone.coverImage : ""
  //                       }
  //                       name={
  //                         milestone?.milestoneName
  //                           ? milestone.milestoneName
  //                           : ""
  //                       }
  //                       modelsNumber={milestone.models}
  //                       buttonClickHandler={() => {
  //                         router.push(
  //                           `/my-nest/purchases/campaigns/${queries[0]}/milestone/${milestone._id}`
  //                         );
  //                       }}
  //                       // TODO change it
  //                       ownerName="ABC"
  //                       ownerImage="https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Two_red_dice_01.svg/1200px-Two_red_dice_01.svg.png"
  //                     />
  //                   </div>
  //                 ))}
  //               </>
  //             ) : (
  //               <></>
  //             )
  //           ) : (
  //             <></>
  //           )}
  //         </div>
  //       </div>
  //     </MyNestContentWithBreadcrumbs>

  //   );
  // }
  else if (queries.length === 3) {
    return (
      <>
        <CampaignModelsDisplay
          queries={queries}
          selectedCampaignName={
            selectedCampaign?.campaignName ? selectedCampaign.campaignName : ""
          }
        />
      </>
    );
  } else {
    return <></>;
  }
};

export default CampaignPurchases;
