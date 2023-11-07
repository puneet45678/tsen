import React, { useState, useEffect } from "react";
import MyNestContentWithBreadcrumbs from "../MyNestContentWithBreadcrumbs";
import ModelCard from "./ModelCard";

const CampaignModelsDisplay = (props) => {
  const queries = props.queries;
  const [tierOrMilestoneName, setTierOrMilestoneName] = useState();
  const [models, setModels] = useState([]);

  const modelPageBreadcrumbs = [
    {
      title: "Purchased Campaigns",
      to: "/my-nest/purchases/campaigns",
    },
    {
      title: props.selectedCampaignName,
      to: `/my-nest/purchases/campaigns/${queries[0]}`,
    },
    {
      title:
        queries[1] === "tier"
          ? "Tiers"
          : queries[1] === "milestone"
          ? "Milestones"
          : "",
      to: `/my-nest/purchases/campaigns/${queries[0]}`,
    },
    {
      title: tierOrMilestoneName,
    },
  ];

  useEffect(() => {
    const resData = [
      {
        _id: "64e48189c45915c712a4ee6b",
        coverImage:
          "https://ucarecdn.com/434d7b9d-0d4e-4e2e-bd76-192b8e294910/",
        modelName: "Model 1",
        ownerName: "Name",
        license: "CC",
        approvalStatus: "status",
      },
      {
        _id: "64e48189c45915c712a4ee6b",
        coverImage:
          "https://ucarecdn.com/434d7b9d-0d4e-4e2e-bd76-192b8e294910/",
        modelName: "Model 1",
        ownerName: "Name",
        license: "CC",
        approvalStatus: "status",
      },
      {
        _id: "64e48189c45915c712a4ee6b",
        coverImage:
          "https://ucarecdn.com/434d7b9d-0d4e-4e2e-bd76-192b8e294910/",
        modelName: "Model 1",
        ownerName: "Name",
        license: "CC",
        approvalStatus: "status",
      },
      {
        _id: "64e48189c45915c712a4ee6b",
        coverImage:
          "https://ucarecdn.com/434d7b9d-0d4e-4e2e-bd76-192b8e294910/",
        modelName: "Model 1",
        ownerName: "Name",
        license: "CC",
        approvalStatus: "status",
      },
      {
        _id: "64e48189c45915c712a4ee6b",
        coverImage:
          "https://ucarecdn.com/434d7b9d-0d4e-4e2e-bd76-192b8e294910/",
        modelName: "Model 1",
        ownerName: "Name",
        license: "CC",
        approvalStatus: "status",
      },
      {
        _id: "64e48189c45915c712a4ee6b",
        coverImage:
          "https://ucarecdn.com/434d7b9d-0d4e-4e2e-bd76-192b8e294910/",
        modelName: "Model 1",
        ownerName: "Name",
        license: "CC",
        approvalStatus: "status",
      },
      {
        _id: "64e48189c45915c712a4ee6b",
        coverImage:
          "https://ucarecdn.com/434d7b9d-0d4e-4e2e-bd76-192b8e294910/",
        modelName: "Model 1",
        ownerName: "Name",
        license: "CC",
        approvalStatus: "status",
      },
    ];
    setModels(resData);
    setTierOrMilestoneName("Name");
  }, []);
  return (
    <MyNestContentWithBreadcrumbs
      breadcrumbBackButtonLink="/my-nest/purchases/campaigns"
      breadcrumbItems={modelPageBreadcrumbs}
    >
      <div className="grid grid-cols-5 gap-6">
        {models.map((model, index) => (
          <div key={`model-${model._id}-${index}`} className="w-full">
            <ModelCard
              id={model._id}
              coverImage={model.coverImage}
              modelName={model.modelName}
              license={model.license}
              // TODO change it
              ownerName="ABC"
              ownerImage="https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Two_red_dice_01.svg/1200px-Two_red_dice_01.svg.png"
            />
          </div>
        ))}
      </div>
    </MyNestContentWithBreadcrumbs>
  );
};

export default CampaignModelsDisplay;
