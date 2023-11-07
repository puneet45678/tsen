import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

const CampaignLayout = ({
  campaignImage,
  campaignName,
  showEditAndDeleteOptions,
}) => {
  const [hovering, setHovering] = useState(false);

  return (
    <div
      className="relative flex flex-col items-center justify-center border-2 w-full max-w-[20rem] m-auto"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {showEditAndDeleteOptions && hovering && (
        <div className="absolute top-1 right-1 flex gap-2">
          {/* TODO add delete and edit functionality */}
          <span className="cursor-pointer">Edit</span>
          <span className="cursor-pointer">Del</span>
        </div>
      )}
      <div className="w-full">
        <img src={campaignImage} className="" />
      </div>
      <p>{campaignName}</p>
    </div>
  );
};

const CampaignGridLayout = ({
  heading,
  campaigns,
  onViewMoreClick,
  showEditAndDeleteOptions,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="font-medium text-[1.1rem]">{heading}</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 w-full">
        {campaigns.map((campaign, index) => (
          <div key={`campaign-${index}`} className="w-full h-full">
            <CampaignLayout
              campaignImage={campaign.image}
              campaignName={campaign.name}
              showEditAndDeleteOptions={showEditAndDeleteOptions}
            />
          </div>
        ))}
        <div className="hidden lg:block w-full h-full">
          <div
            className="flex flex-col items-center justify-center border-2 w-full max-w-[20rem] m-auto h-full bg-gray-300 font-medium cursor-pointer"
            onClick={onViewMoreClick}
          >
            View More ...
          </div>
        </div>
      </div>
      <div
        className="block text-right lg:hidden w-full h-full"
        onClick={onViewMoreClick}
      >
        View More ...
      </div>
    </div>
  );
};

const DraftCampaignsLayout = ({
  campaigns,
  onViewMoreClick,
  showEditAndDeleteOptions,
}) => {
  const handleDraftEdit = () => {
    // TODO handle draft edit
  };

  const handleDraftDelete = () => {
    // TODO handle draft delete
  };

  return (
    <div className="flex flex-col gap-2">
      <h2 className="font-medium text-[1.1rem]">Draft Campaigns</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 w-full">
        {campaigns.map((campaign, index) => (
          <div key={`draftCampaign-${index}`} className="w-full h-full">
            <CampaignLayout
              campaignImage={campaign.image}
              campaignName={campaign.name}
              showEditAndDeleteOptions={showEditAndDeleteOptions}
            />
          </div>
        ))}
        <div className="hidden lg:block w-full h-full">
          <div
            className="flex flex-col items-center justify-center border-2 w-full max-w-[20rem] m-auto h-full bg-yellow-300 font-medium cursor-pointer"
            onClick={onViewMoreClick}
          >
            View More ...
          </div>
        </div>
      </div>
      <div
        className="block text-right lg:hidden w-full h-full"
        onClick={onViewMoreClick}
      >
        View More ...
      </div>
    </div>
  );
};

const ViewMoreCampaigns = ({
  campaignName,
  close,
  campaigns,
  getMoreCampaigns,
  showEditAndDeleteOptions,
}) => {
  const [currentCampaigns, setCurrentCampaigns] = useState(campaigns);

  useEffect(() => {
    let options = {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    };

    let observer = new IntersectionObserver(() => {
      setTimeout(() => {
        const newCampaigns = getMoreCampaigns();
        setCurrentCampaigns((current) => [...current, ...newCampaigns]);
      }, 1000);
    }, options);
    observer.observe(document.querySelector("#endElement"));
  }, []);
  console.log("currentCampaigns", currentCampaigns);
  console.log("showEditAndDeleteOptions", showEditAndDeleteOptions);
  return (
    <div className="">
      <div className="flex gap-2">
        <span className="cursor-pointer" onClick={close}>
          Back
        </span>
        <h2>{campaignName}</h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 w-full">
        {currentCampaigns.map((campaign, index) => {
          console.log("viewMoreCampaign-${index}", `viewMoreCampaign-${index}`);
          return (
            <div key={`viewMoreCampaign-${index}`} className="w-full h-full">
              <CampaignLayout
                campaignImage={campaign.image}
                campaignName={campaign.name}
                showEditAndDeleteOptions={showEditAndDeleteOptions}
              />
            </div>
          );
        })}
      </div>
      <div id="endElement"></div>
    </div>
  );
};

const UserCreatedCampaignsSection = () => {
  const router = useRouter();
  const { username } = router.query;
  const user = useSelector((state) => state.user);
  const [draftCampaigns, setDraftCampaigns] = useState([]);
  const [activeCampaigns, setActiveCampaigns] = useState([]);
  const [completedCampaigns, setCompletedCampaigns] = useState([]);
  const [showMoreCampaigns, setShowMoreCampaigns] = useState(false);
  const [showMoreCampaignName, setShowMoreCampaignName] = useState("");
  // const [showMoreDaftCampaigns, setShowMoreDaftCampaigns] = useState(false);
  // const [showMoreActiveCampaigns, setShowMoreActiveCampaigns] = useState(false);
  // const [showMoreCompletedCampaigns, setShowMoreCompletedCampaigns] = useState(false);

  const getMoreDraftCampaigns = () => {
    console.log("here in the function");
    return [
      { image: "/temp/campaign.png", name: "Campaign" },
      { image: "/temp/campaign.png", name: "Campaign" },
      { image: "/temp/campaign.png", name: "Campaign" },
      { image: "/temp/campaign.png", name: "Campaign" },
      { image: "/temp/campaign.png", name: "Campaign" },
    ];
  };

  const getMoreActiveCampaigns = () => {
    return [
      { image: "/temp/campaign.png", name: "Campaign" },
      { image: "/temp/campaign.png", name: "Campaign" },
      { image: "/temp/campaign.png", name: "Campaign" },
      { image: "/temp/campaign.png", name: "Campaign" },
      { image: "/temp/campaign.png", name: "Campaign" },
    ];
  };

  const getMoreCompletedCampaigns = () => {
    return [
      { image: "/temp/campaign.png", name: "Campaign" },
      { image: "/temp/campaign.png", name: "Campaign" },
      { image: "/temp/campaign.png", name: "Campaign" },
      { image: "/temp/campaign.png", name: "Campaign" },
      { image: "/temp/campaign.png", name: "Campaign" },
    ];
  };

  useEffect(() => {
    //  TODO add axios call to get campaigns
    setDraftCampaigns([
      { image: "/temp/campaign.png", name: "Campaign" },
      { image: "/temp/campaign.png", name: "Campaign" },
      { image: "/temp/campaign.png", name: "Campaign" },
      { image: "/temp/campaign.png", name: "Campaign" },
      { image: "/temp/campaign.png", name: "Campaign" },
    ]);
    setActiveCampaigns([
      { image: "/temp/campaign.png", name: "Campaign" },
      { image: "/temp/campaign.png", name: "Campaign" },
      { image: "/temp/campaign.png", name: "Campaign" },
      { image: "/temp/campaign.png", name: "Campaign" },
      { image: "/temp/campaign.png", name: "Campaign" },
    ]);
    setCompletedCampaigns([
      { image: "/temp/campaign.png", name: "Campaign" },
      { image: "/temp/campaign.png", name: "Campaign" },
      { image: "/temp/campaign.png", name: "Campaign" },
      { image: "/temp/campaign.png", name: "Campaign" },
      { image: "/temp/campaign.png", name: "Campaign" },
    ]);
  }, []);

  console.log("userrrrrrrrrrrrrr", user);

  return (
    <>
      {!showMoreCampaigns ? (
        <div className="flex flex-col gap-6 w-full">
          {/* {user.username && user.username === username && (
            <DraftCampaignsLayout
              campaigns={draftCampaigns}
              onViewMoreClick={() => {
                setShowMoreCampaigns(true);
                setShowMoreCampaignName("draft");
              }}
              showEditAndDeleteOptions={true}
            />
          )} */}
          <CampaignGridLayout
            heading="Active Campaigns"
            campaigns={activeCampaigns}
            onViewMoreClick={() => {
              setShowMoreCampaigns(true);
              setShowMoreCampaignName("active");
            }}
            showEditAndDeleteOptions={false}
          />
          <CampaignGridLayout
            heading="Completed Campaigns"
            campaigns={completedCampaigns}
            onViewMoreClick={() => {
              setShowMoreCampaigns(true);
              setShowMoreCampaignName("completed");
            }}
            showEditAndDeleteOptions={false}
          />
        </div>
      ) : (
        <ViewMoreCampaigns
          close={() => setShowMoreCampaigns(false)}
          campaignName={
            showMoreCampaignName === "draft"
              ? "Draft Campaigns"
              : showMoreCampaignName === "active"
              ? "Active Campaigns"
              : showMoreCampaignName === "completed"
              ? "Completed Campaigns"
              : ""
          }
          campaigns={
            showMoreCampaignName === "draft"
              ? draftCampaigns
              : showMoreCampaignName === "active"
              ? activeCampaigns
              : showMoreCampaignName === "completed"
              ? completedCampaigns
              : []
          }
          getMoreCampaigns={
            showMoreCampaignName === "draft"
              ? getMoreDraftCampaigns
              : showMoreCampaignName === "active"
              ? getMoreActiveCampaigns
              : showMoreCampaignName === "completed"
              ? getMoreCompletedCampaigns
              : ""
          }
          showEditAndDeleteOptions={
            showMoreCampaignName === "draft" ? true : false
          }
        />
      )}
    </>
    // <div className="flex flex-col gap-6 w-full">
    //   {user.username && user.username === username ? (
    //     <>
    //       <DraftCampaignsLayout
    //         campaigns={draftCampaigns}
    //         onViewMoreClick={() => setShowMoreDaftCampaigns(true)}
    //       />
    //       {showMoreDaftCampaigns && (
    //         <ViewMoreCampaigns
    //           close={() => setShowMoreDaftCampaigns(false)}
    //           campaigns={draftCampaigns}
    //           getMoreCampaigns={getMoreDraftCampaigns}
    //         />
    //       )}
    //     </>
    //   ) : (
    //     <></>
    //   )}
    //   <CampaignGridLayout
    //     heading="Active Campaigns"
    //     campaigns={activeCampaigns}
    //     onViewMoreClick={() => setShowMoreActiveCampaigns(true)}
    //   />
    //   {showMoreActiveCampaigns && (
    //     <ViewMoreCampaigns
    //       close={() => setShowMoreActiveCampaigns(false)}
    //       campaigns={activeCampaigns}
    //       getMoreCampaigns={getMoreActiveCampaigns}
    //     />
    //   )}
    //   <CampaignGridLayout
    //     heading="Completed Campaigns"
    //     campaigns={completedCampaigns}
    //     onViewMoreClick={() => setShowMoreCompletedCampaigns(true)}
    //   />
    //   {showMoreCompletedCampaigns && (
    //     <ViewMoreCampaigns
    //       close={() => setShowMoreCompletedCampaigns(false)}
    //       campaigns={completedCampaigns}
    //       getMoreCampaigns={getMoreCompletedCampaigns}
    //     />
    //   )}
    // </div>
  );
};

export default UserCreatedCampaignsSection;
