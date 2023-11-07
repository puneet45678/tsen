import React from "react";
import MarketplaceCard from "./MarketplaceCard";

const MarketplaceSingleRowModels = (props) => {
  return (
    <div className="flex flex-col gap-8 px-14">
      <div className="flex items-center justify-between">
        <h2 className="text-headline-sm font-semibold">{props.heading}</h2>
        <span className="text-dark-neutral-100 text-lg font-semibold">
          View all
        </span>
      </div>
      <div className="grid grid-cols-5 gap-6">
        {props?.models &&
          props?.models.slice(0, 5).map((model) => (
            <div key={model.id}>
              <MarketplaceCard
                id={model._id}
                image={model?.coverImage}
                modelName={model?.modelName}
                username={props?.modelUserCreators?.[model._id]?.username}
                userImage={
                  props.modelUserCreators?.[model._id]?.userProfilePicture
                }
                price={model?.price}
                NSFW={model?.NSFW}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default MarketplaceSingleRowModels;
