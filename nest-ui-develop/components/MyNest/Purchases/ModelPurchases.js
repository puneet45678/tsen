import { useEffect, useState } from "react";
import MyNestContent from "../MyNestContent";
import ModelCard from "./ModelCard";
import Image from "next/image";

const ModelPurchases = () => {
  const [models, setModels] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    // const resData = [];
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
  }, []);

  return (
    <MyNestContent
      empty={!models || models.length === 0}
      emptyImage="/temp/EmptyMyNest.png"
      emptyHeading="Discover 3D models that catch your eye"
      emptyButtonText="Explore Marketplace"
      emptyButtonLink="/marketplace"
      heading="Purchased Models"
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
      </div>
    </MyNestContent>
  );
};
export default ModelPurchases;
