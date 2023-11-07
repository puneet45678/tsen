import React, { useState, useEffect } from "react";
import BreadCrumbs from "../BreadCrumbs";
import PurchasedModelCard from "./PurchasedModelCard";

const TierAssets = () => {
  const [tierDetails, setTierDetails] = useState([]);
  const [breadcrumbItems, setBreadcrumbItems] = useState([]);

  useEffect(() => {
    const res = {
      campaignId: "11",
      campaignName: "cname",
      creatorName: "creator",
      tierId: "tid",
      tierName: "tname",
      assets: [
        {
          assetBannerUrl: "/temp/banner.webp",
          assetName: "Name",
          license: "CC",
        },
        {
          assetBannerUrl: "/temp/banner.webp",
          assetName: "Name",
          license: "CC",
        },
        {
          assetBannerUrl: "/temp/banner.webp",
          assetName: "Name",
          license: "IKN - P - 20",
          printsLeft: 10,
        },
        {
          assetBannerUrl: "/temp/banner.webp",
          assetName: "Name",
          license: "IKN - P - 20",
          printsLeft: 10,
        },
        {
          assetBannerUrl: "/temp/banner.webp",
          assetName: "Name",
          license: "CC",
        },
        {
          assetBannerUrl: "/temp/banner.webp",
          assetName: "Name",
          license: "CC",
        },
        {
          assetBannerUrl: "/temp/banner.webp",
          assetName: "Name",
          license: "IKN - P - 20",
          printsLeft: 10,
        },
        {
          assetBannerUrl: "/temp/banner.webp",
          assetName: "Name",
          license: "IKN - P - 20",
          printsLeft: 10,
        },
      ],
    };
    setTierDetails(res);
    const items = [
      { title: "Campaigns", to: "/my-nest/purchases/campaigns" },
      {
        title: `${res.campaignName}`,
        to: `/my-nest/purchases/campaigns/${res.campaignId}`,
      },
      {
        title: `${res.tierName}`,
        to: `/my-nest/purchases/campaigns/${res.campaignId}/${res.tierId}`,
      },
    ];
    setBreadcrumbItems(items);
  }, []);

  return (
    <div className="w-full h-full overflow-y-auto p-5 bg-white">
      <div className="flex">
        <BreadCrumbs items={breadcrumbItems} />
      </div>
      <div className="flex flex-col gap-5">
        <div className="flex justify-between"></div>
        <div className="grid grid-cols-5 gap-5">
          {tierDetails &&
            tierDetails?.assets &&
            tierDetails.assets.length > 0 &&
            tierDetails.assets.map((asset, index) => (
              <div key={index}>
                <PurchasedModelCard
                  bannerImageUrl={asset.assetBannerUrl}
                  modelName={asset.name}
                  creatorName={tierDetails.creatorName}
                  license={asset.license}
                  printsLeft={asset?.printsLeft ? asset.printsLeft : undefined}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
export default TierAssets;
