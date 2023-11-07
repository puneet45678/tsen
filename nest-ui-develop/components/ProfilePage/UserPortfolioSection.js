import React, { useEffect, useState } from "react";
import UserPortfolioSectionCard from "./UserPortfolioSectionCard";
import PortfolioCardModal from "./PortfolioCardModal";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { changeUser } from "../../store/userSlice";
import { useRouter } from "next/router";

// const objectData= [
//   {
//       _id: "64d21032aebd380c732844ad",
//       createdBy: "652ccb7a3010089c9753b1c1",
//       createdAt: "2023-08-08T09:51:46.033000",
//       updatedAt: "2023-08-08T13:03:29.668000",
//       description: "<p><span style=\"background-color: rgb(32, 33, 36); color: rgb(189, 193, 198);\">You could feel difference in character</span></p><p><span style=\"background-color: rgb(32, 33, 36); color: rgb(189, 193, 198);\">The genuine article exceeds revision as narrative (Narrative)</span></p><p><span style=\"background-color: rgb(32, 33, 36); color: rgb(189, 193, 198);\">Isn't factual, I intend to be accurate</span></p><p><span style=\"background-color: rgb(32, 33, 36); color: rgb(189, 193, 198);\">Money talks, many rap lyrics are counterfeit</span></p><p><span style=\"background-color: rgb(32, 33, 36); color: rgb(189, 193, 198);\">I've been through challenges, I reminisce and feel blessed</span></p>",
//       portfolioName: "Life and Rhymes",
//       coverImage:"https://source.unsplash.com/random",
//       videoLinks: [
//           "https://youtu.be/wPdn4TxT9JI",
//           "https://youtu.be/wPdn4TxT9JI",
//           "https://youtu.be/wPdn4TxT9JI",
//           "https://youtu.be/wPdn4TxT9JI",
//           "https://youtu.be/wPdn4TxT9JI",
//           "https://youtu.be/wPdn4TxT9JI",
//           "https://youtu.be/wPdn4TxT9JI",
//           "https://youtu.be/wPdn4TxT9JI",
//           "https://youtu.be/wPdn4TxT9JI",
//           "https://youtu.be/wPdn4TxT9JI"
//       ],
//       portfolioImages: [
//           {
//               imageId: "d3a77a8a-eacf-4ccc-a4c1-941a96196e60",
//               imageUrl: "https://ucarecdn.com/d3a77a8a-eacf-4ccc-a4c1-941a96196e60/",
//               imageName: "wallpaper2.jpg",
//               croppedUrl: ""
//           },
//           {
//               imageId: "923a54a3-488d-4d68-8be5-3214803e6d90",
//               imageUrl: "https://ucarecdn.com/923a54a3-488d-4d68-8be5-3214803e6d90/",
//               imageName: "wallpaper1.jpg",
//               croppedUrl: ""
//           },
//           {
//               imageId: "c02be228-ba08-4b8c-a70f-230b5e95ca86",
//               imageUrl: "https://ucarecdn.com/c02be228-ba08-4b8c-a70f-230b5e95ca86/",
//               imageName: "wallpaper2.jpg",
//               croppedUrl: ""
//           },
//           {
//               imageId: "e2d37b57-5c86-4a68-89f2-6e114e88c0b6",
//               imageUrl: "https://ucarecdn.com/e2d37b57-5c86-4a68-89f2-6e114e88c0b6/",
//               imageName: "wallpaper1.jpg",
//               croppedUrl: ""
//           },
//           {
//               imageId: "124aaa13-31dc-4b33-b639-3cdc6755b8bb",
//               imageUrl: "https://ucarecdn.com/124aaa13-31dc-4b33-b639-3cdc6755b8bb/",
//               imageName: "wallpaper2.jpg",
//               croppedUrl: ""
//           },
//           {
//               imageId: "cbb0b53e-5cb2-432e-88e6-4703293b0ce2",
//               imageUrl: "https://ucarecdn.com/cbb0b53e-5cb2-432e-88e6-4703293b0ce2/",
//               imageName: "starryNights.jpg",
//               croppedUrl: ""
//           },
//           {
//               imageId: "0b57ae23-2041-424e-a810-275d9ba04153",
//               imageUrl: "https://ucarecdn.com/0b57ae23-2041-424e-a810-275d9ba04153/",
//               imageName: "solidity.png",
//               croppedUrl: ""
//           },
//           {
//               imageId: "da7321d4-5114-410c-883c-7e4dd5195025",
//               imageUrl: "https://ucarecdn.com/da7321d4-5114-410c-883c-7e4dd5195025/",
//               imageName: "wallpaper1.jpg",
//               croppedUrl: ""
//           },
//           {
//               imageId: "feb4e436-5e81-450a-a739-9f9be9b50a61",
//               imageUrl: "https://ucarecdn.com/feb4e436-5e81-450a-a739-9f9be9b50a61/",
//               imageName: "starryNights.jpg",
//               croppedUrl: ""
//           },
//           {
//               imageId: "fc31c01f-6342-4e26-a268-95600c7fe044",
//               imageUrl: "https://ucarecdn.com/fc31c01f-6342-4e26-a268-95600c7fe044/",
//               imageName: "wallpaper2.jpg",
//               croppedUrl: ""
//           },
//           {
//               imageId: "3293face-b66e-4795-819d-ce856d8d470c",
//               imageUrl: "https://ucarecdn.com/3293face-b66e-4795-819d-ce856d8d470c/",
//               imageName: "wallpaper2.jpg",
//               croppedUrl: ""
//           },
//           {
//               imageId: "bd082433-5f39-42a8-9308-d56193a6f202",
//               imageUrl: "https://ucarecdn.com/bd082433-5f39-42a8-9308-d56193a6f202/",
//               imageName: "wallpaper1.jpg",
//               croppedUrl: ""
//           },
//           {
//               imageId: "6906cacc-de0f-45a5-b5f9-e34ba2297dab",
//               imageUrl: "https://ucarecdn.com/6906cacc-de0f-45a5-b5f9-e34ba2297dab/",
//               imageName: "solidity.png",
//               croppedUrl: ""
//           },
//           {
//               imageId: "0fc7fbbe-1daf-46c8-a4f6-f31285a5777e",
//               imageUrl: "https://ucarecdn.com/0fc7fbbe-1daf-46c8-a4f6-f31285a5777e/",
//               imageName: "wallpaper2.jpg",
//               croppedUrl: ""
//           }
//       ],
//       likesCount:4,
//       viewsCount:10,
//       comments: ["1693477987442204","1693483477318304"],
//   },
//   {
//       _id: "64d23e22ec72ebd450c213a7",
//       createdBy: "652ccb7a3010089c9753b1c1",
//       createdAt: "2023-08-08T13:07:46.380000",
//       updatedAt: "2023-08-08T13:09:27.324000",
//       portfolioImages: [
//           {
//               imageId: "3a556967-9336-4ac0-a16f-8cab3c8cf4c9",
//               imageUrl: "https://ucarecdn.com/3a556967-9336-4ac0-a16f-8cab3c8cf4c9/",
//               imageName: "wallpaper1.jpg",
//               croppedUrl: ""
//           },
//           {
//               imageId: "b610220b-47db-4595-abc1-ca79be773159",
//               imageUrl: "https://ucarecdn.com/b610220b-47db-4595-abc1-ca79be773159/",
//               imageName: "starryNights.jpg",
//               croppedUrl: ""
//           }
//       ],
//       description: "<p><span style=\"background-color: rgb(32, 33, 36); color: rgb(189, 193, 198);\">I got love for my brother, but we can never go nowhere</span></p><p><span style=\"background-color: rgb(32, 33, 36); color: rgb(189, 193, 198);\">Unless we share with each other</span></p><p><span style=\"background-color: rgb(32, 33, 36); color: rgb(189, 193, 198);\">We gotta start makin' changes</span></p><p><span style=\"background-color: rgb(32, 33, 36); color: rgb(189, 193, 198);\">Learn to see me as a brother instead of two distant strangers</span></p>",
//       portfolioName: "Changes",
//       coverImage:"https://source.unsplash.com/random",
//       videoLinks: [
//           "https://www.youtube.com/watch?v=xg3J5slvB-k",
//           "https://www.youtube.com/watch?v=xg3J5slvB-k",
//           "https://www.youtube.com/watch?v=xg3J5slvB-k"
//       ],
//       likesCount:6,
//       viewsCount:50,
//       comments: ["1693477987442204","1693483477318304"],
//   }
// ]

const portfolioPageSize = process.env.NEXT_PUBLIC_PORTFOLIO_PAGE_SIZE || 5

const UserPortfolioSection = ({ user }) => {
  const [portfolioData, setPortfolioData] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = useSelector((state) => state.user);

  const dispatcher = useDispatch();

  useEffect(() => {
    // console.log(user.CACHED_PORTFOLIO_DATA)
    if(!user || !currentUser) {
        console.log("PLOGS No user found so returning");
        setLoading(false)
        return
    }
    console.log("PLOGS Username");
    console.log(user, "-----PLOGS-------", currentUser);
    setLoading(true);
    
    // if(currentUser)
    
    if (user?.CACHED_PORTFOLIO_DATA) {
        console.log("PLOGS Getting Portfolio from usersData",user);
        setPortfolioData(user.CACHED_PORTFOLIO_DATA);
        setLoading(false);
        return;
    }
    console.log("PLOGS username Sending req because CACHED_PORTFOLIO_DATA or user not found");
    axios
    .get(
        process.env.NEXT_PUBLIC_USER_SERVICE_URL +
        "/api/v1/portfolios?username=" +
        user.username,
        {
        withCredentials: true,
        }
    )
    .then(({ data }) => {
        const cachedUser = {
            ...currentUser,
            PROFILES_VISITED: currentUser.PROFILES_VISITED? currentUser.PROFILES_VISITED.push({
                username:user.username,
                portfolios:data
            })
            :[{
                username:user.username,
                portfolios:data
            }]
        }
        console.log("PLOGS username cached",cachedUser)
        // dispatcher(changeUser({ ...user, CACHED_PORTFOLIO_DATA: data }));
        setPortfolioData(data);
        setLoading(false);
    });
  }, [user]);

  return (
    <div className="flex gap-6 flex-wrap overflow-hidden">
      {loading ? (
        <>LOADING ...</>
      ) : portfolioData.length ? (
        portfolioData.map((data, index) => (
          <UserPortfolioSectionCard
            user={user}
            key={"UserPortfolioSectionCardKey" + index}
            data={data}
          />
        ))
      ) : (
        <div>Nothing here yet</div>
      )}
    </div>
  );
};
export default UserPortfolioSection;
