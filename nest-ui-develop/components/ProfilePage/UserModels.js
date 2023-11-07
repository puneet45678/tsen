import React, { useState, useEffect } from "react";
import axios from "axios";
import UsersModelCard from "./UserModelCard";

const modelObjects=[{
    _id: "652f7a6d043c08db8d32c2e6",
    userId: "65268dcc1b54adb95f5fa465",
    modelName: "Cheers to Nest's Slicer",
    adminModified: false,
    uploadDatetime: {
      date: "2023-08-22T09:36:09.851Z"
    },
    updatedAt: {
      date: "2023-10-05T10:12:34.642Z"
    },
    coverImage: "https://source.unsplash.com/random",
    description: "You got this king",
    modelFileUrl: {
      stl: "https://testnestmodel.ap-south-1.amazonaws.com/2023/9/65114bf80f720003df3bb393/6512d4a462d7bee982902269/stl/sample_Stl.zip",
      glb: ""
    },
    NSFW: false,
    price: 99.99,
    currency: "USD",
    printDetails: null,
    supportNeeded: false,
    category: null,
    dimensions: null,
    scale: null,
    timetoPrint: null,
    deprecated: false,
    approvalStatus: "Live",
    visibility: "public",
    printMaterial: null,
    materialQuantity: null,
    license: null,
    modelImages: [
      {
        imageName: "998748.jpg",
        imageUrl: "https://ucarecdn.com/434d7b9d-0d4e-4e2e-bd76-192b8e294910/",
        imageId: "434d7b9d-0d4e-4e2e-bd76-192b8e294910",
        croppedUrl: ""
      },
      {
        imageName: "assassins-creed-valhalla-2-4k-2560x1440_785894-lm-90.jpg",
        imageUrl: "https://ucarecdn.com/eccb1266-7839-45e9-90de-26666fdb61e3/",
        imageId: "eccb1266-7839-45e9-90de-26666fdb61e3",
        croppedUrl: ""
      },
      {
        imageName: "call-of-duty-warzone-4k-2020-nh-2560x1440.jpg",
        imageUrl: "https://ucarecdn.com/78983e56-5c05-4341-a81a-404d4551a173/",
        imageId: "78983e56-5c05-4341-a81a-404d4551a173",
        croppedUrl: ""
      },
      {
        imageName: "Screenshot 2023-08-18 194814.png",
        imageUrl: "https://ucarecdn.com/b9bec223-3dd0-40bb-9046-5e05504dc2cd/",
        imageId: "b9bec223-3dd0-40bb-9046-5e05504dc2cd",
        croppedUrl: ""
      },
      {
        imageName: "Screenshot 2023-08-18 193611.png",
        imageUrl: "https://ucarecdn.com/368779e3-5043-4318-bf5d-8b9a5c35294e/",
        imageId: "368779e3-5043-4318-bf5d-8b9a5c35294e",
        croppedUrl: ""
      }
    ],
    remixes: [],
    tagIds: [
      "650d756a3546042fc9b26b7d",
      "650d75f47924fd29d026466d"
    ],
    campaigns: [],
    comments: ["1693477987442204","1693477987442204","1693477987442204","1693477987442204"],
    reviewds: [],
    buyers: [
      "64d3207c5c2df8c1f21c3e21",
      "64d3362d55fa95a601b0d418",
      "64d3207c5c2df8c1f21c3e21"
    ],
    likes: 1,
    likedBy: [
      "64d9b19d82ad7a6545ba2972"
    ],
    visiblity: "private",
    reviewIds: [
      "651552673a59bc19c7168ec8",
      "651567f19326bec6293dab03",
      "65156a6f97418e5148583b08",
      "651570c72c1c544c265305a4",
      "6515722821b0299b8c5b46e0",
      "6515722821b0299b8c5b46e0",
      "65166f9847139aa5735bed62",
      "65166f9847139aa5735bed62",
      "6516a655e34cdf58da2dfc82",
      "651ba7279d44411d21214d70",
      "651ba817bf8281bbc4cc4314",
      "651bb7e2108466c827ece8bf"
    ],
    updatedOn: {
      date: "2023-09-19T05:30:21.155Z"
    },
    modelFiles: {
      stlFiles: [
        {
          filePath: "https://testnestmodel.s3.ap-south-1.amazonaws.com/2023/9/65114bf80f720003df3bb393/6512d4a462d7bee982902269/stl/64e48189c45915c712a4ee6b_unzipped/Cube_3d_printing_sample.stl",
          fileSize: 684,
          fileName: "Cube_3d_printing_sample"
        },
        {
          filePath: "https://testnestmodel.s3.ap-south-1.amazonaws.com/2023/9/65114bf80f720003df3bb393/6512d4a462d7bee982902269/stl/64e48189c45915c712a4ee6b_unzipped/Menger_sponge_sample.stl",
          fileSize: 105684,
          fileName: "Menger_sponge_sample"
        }
      ]
    },
    reviewData: [
      {
        reviewId: "651e9b7a8963a1118b2c98ec",
        reviewerId: "651b9e3e2da9cf00fbca121d"
      },
      {
        reviewId: "6524f6dc05bdb4869dd71865",
        reviewerId: "65239c1eeab767270fbb3227"
      }
    ]
  }]


const UserModels = ({ username, profilePicture }) => {
  const [models, setModels] = useState(modelObjects);

  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE}/api/v1/user/models?_status=Submitted&deprecated=false&visibility=all`,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        setModels(res.data);
      })
      .catch((err) => {
        console.log("err", err);
      });
  }, []);

  console.log(models)
  return (
    <div className="flex gap-6 justify-start flex-wrap items-center">
      {models &&
        models.map((model,keyIndex) => (
          <div key={model._id+keyIndex}>
            {/* {console.log(
              "modelUserCreators?.[model._id]",
              modelUserCreators?.[model._id]
            )} */}
            <UsersModelCard
              {...model}
              username={username}
              userImage={profilePicture}
            />
          </div>
        ))}
    </div>
  );
};



export default UserModels;
