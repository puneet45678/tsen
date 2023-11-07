import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import SearchIcon from "../icons/SearchIcon";

const OrderMenu = (props) => {
  const orderDetails = useSelector((state) => state.order);
  const currentOrders = orderDetails.orders;
  const tierDetails = orderDetails.tierDetails;
  // const tierRef = useRef();
  const [currentCampaignId, setCurrentCampaignId] = useState(props.campaignId);
  const [currentTierId, setCurrentTierId] = useState(props.tierId);
  const [tiers, setTiers] = useState();
  const [tiersBackup, setTiersBackup] = useState();
  const [showMenu, setShowMenu] = useState(false);

  const handleSearchInputChange = (event) => {
    const inputValue = event.target.value;
    if (!inputValue || inputValue.length === 0) {
      setTiers(tiersBackup);
    } else {
      const matchingTiers = [];
      for (let tier of tiersBackup) {
        // console.log("tierDetails.tierInfo", tierDetails[tierInfo]);
        // const tierName = tierDetails[tierInfo].tierName;
        // const regex = new RegExp(`${inputValue}`, "i");
        console.log("tier", tier);
        console.log("tier.tiername", tier.tierName);
        if (~tier.tierName.toLowerCase().indexOf(inputValue)) {
          matchingTiers.push(tier);
        }
      }
      console.log("matchingTiers ", matchingTiers);
      setTiers(matchingTiers);
    }
  };

  // useEffect(() => {
  //   if (tierRef.current) {
  //     tierRef.current.scrollIntoView({
  //       behavior: "smooth",
  //     });
  //   }
  // }, []);

  useEffect(() => {
    if (currentOrders && tierDetails) {
      const tierList = [];
      for (let order of currentOrders) {
        console.log("order.items", order.items);
        // tierList.push(...order.items);
        for (let item of order.items) {
          let currentItem = {
            ...item,
            tierName: tierDetails[item.tierId].tierName,
          };
          tierList.push(currentItem);
        }
      }
      setTiers(tierList);
      setTiersBackup(tierList);
    }
  }, [currentOrders, tierDetails]);

  console.log("orders in menu", tiers);

  return (
    <div
      className={`${
        showMenu ? "w-0" : "w-[20rem]"
      } flex z-20 h-full transition-all linear duration-1000 bg-orange-300`}
    >
      <div className="flex flex-col items-center w-full overflow-y-auto no-scrollbar pt-10">
        <div className="flex gap-2 border-[1px] rounded-sm bg-white ml-2">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search for Campaigns"
            className="grow rounded-r-sm focus:outline-none w-full"
            onChange={handleSearchInputChange}
          />
        </div>
        {tiers &&
          tiers.map((tier) => (
            <div
              key={`campaign-${tier.campaignId}-tier-${tier.tierId}`}
              className="w-full"
            >
              <TierElement
                tierName={tier.tierName}
                campaignId={tier.campaignId}
                currentCampaignId={props.campaignId}
                tierId={tier.tierId}
                currentTierId={props.tierId}
              />
            </div>
          ))}
      </div>
      {/* <div
        className="w-[3%] md:w-0 md:hidden h-fit bg-accent2 py-5 flex items-center justify-center"
        onClick={() => setShowMenu(!showMenu)}
      >
        {!showMenu ? "L" : "R"}
      </div> */}
    </div>
  );
};

const TierElement = (props) => {
  // const [isCurrentTierSelected, setIsCurrentTierSelected] = useState(isSel);
  const tierRef = useRef();

  useEffect(() => {
    if (
      props.campaignId === props.currentCampaignId &&
      props.tierId === props.currentTierId &&
      tierRef.current
    ) {
      // console.log("scrolling into view tiername", tierName);
      tierRef.current.scrollIntoView();
    }
  }, [props.currentCampaignId, props.currentTierId]);

  if (
    props.campaignId === props.currentCampaignId &&
    props.tierId === props.currentTierId
  ) {
    console.log("1isCurrentTierSelected troe for", props.tierName);
  }

  return (
    <Link
      href={`/my-nest/purchases/${props.campaignId}/${props.tierId}`}
      ref={tierRef}
      className={`${
        props.campaignId === props.currentCampaignId &&
        props.tierId === props.currentTierId
          ? "bg-white rounded-r-2xl"
          : ""
      } cursor-pointer flex justify-between items-center font-medium scroll-mt-20`}
    >
      <h2 className="py-3 px-2">{props.tierName}</h2>
    </Link>
  );
};

// const OrderMenu = (props) => {
//   const orderDetails = useSelector((state) => state.order);
//   const currentOrders = orderDetails.orders;
//   const tierDetails = orderDetails.tierDetails;
//   // const tierRef = useRef();
//   const [currentCampaignId, setCurrentCampaignId] = useState(props.campaignId);
//   const [currentTierId, setCurrentTierId] = useState(props.tierId);
//   const [tiers, setTiers] = useState();
//   const [tiersBackup, setTiersBackup] = useState();
//   const [showMenu, setShowMenu] = useState(false);

//   const handleSearchInputChange = (event) => {
//     const inputValue = event.target.value;
//     if (!inputValue || inputValue.length === 0) {
//       setTiers(tiersBackup);
//     } else {
//       const matchingTiers = [];
//       for (let tier of tiersBackup) {
//         // console.log("tierDetails.tierInfo", tierDetails[tierInfo]);
//         // const tierName = tierDetails[tierInfo].tierName;
//         // const regex = new RegExp(`${inputValue}`, "i");
//         console.log("tier", tier);
//         console.log("tier.tiername", tier.tierName);
//         if (~tier.tierName.toLowerCase().indexOf(inputValue)) {
//           matchingTiers.push(tier);
//         }
//       }
//       console.log("matchingTiers ", matchingTiers);
//       setTiers(matchingTiers);
//     }
//   };

//   // useEffect(() => {
//   //   if (tierRef.current) {
//   //     tierRef.current.scrollIntoView({
//   //       behavior: "smooth",
//   //     });
//   //   }
//   // }, []);

//   useEffect(() => {
//     if (currentOrders && tierDetails) {
//       const tierList = [];
//       for (let order of currentOrders) {
//         console.log("order.items", order.items);
//         // tierList.push(...order.items);
//         for (let item of order.items) {
//           let currentItem = {
//             ...item,
//             tierName: tierDetails[item.tierId].tierName,
//           };
//           tierList.push(currentItem);
//         }
//       }
//       setTiers(tierList);
//       setTiersBackup(tierList);
//     }
//   }, [currentOrders, tierDetails]);

//   console.log("orders in menu", tiers);

//   return (
//     <div
//       className={`absolute md:static ${
//         showMenu ? "left-0" : "-left-[97%]"
//       } flex z-20 h-full w-full md:w-fit md:min-w-[15rem] transition-all linear duration-1000 border-2 border-black`}
//     >
//       {/* <div
//       className={`absolute md:static ${
//         showMenu ? "left-0" : "-left-[97%]"
//       } flex z-20 h-full w-full md:w-fit md:min-w-[15rem] lg:min-w-[20rem] transition-all linear duration-1000 border-2 border-black`}
//     > */}
//       <div className="flex flex-col w-[97%] md:w-full overflow-y-auto no-scrollbar bg-accent2 pt-10">
//         <div className="flex gap-2 border-[1px] rounded-sm bg-white ml-2">
//           <SearchIcon />
//           <input
//             type="text"
//             placeholder="Search for Campaigns"
//             className="grow rounded-r-sm focus:outline-none"
//             onChange={handleSearchInputChange}
//           />
//         </div>
//         {tiers &&
//           tiers.map((tier) => (
//             // <Link
//             //   key={`campaign-${tier.campaignId}-tier-${tier.tierId}`}
//             //   href={`/orders/${tier.campaignId}/${tier.tierId}`}
//             //   className={`${
//             //     props.campaignId === tier.campaignId &&
//             //     props.tierId === tier.tierId
//             //       ? "bg-black rounded-r-2xl"
//             //       : ""
//             //   } pl-5 cursor-pointer flex justify-between items-center pr-5 font-medium`}
//             // >
//             //   <h2 className="py-3 px-2">{tier.tierName}</h2>
//             // </Link>
//             <div
//               key={`campaign-${tier.campaignId}-tier-${tier.tierId}`}
//               className="w-full"
//             >
//               <TierElement
//                 tierName={tier.tierName}
//                 // linkTo={`/orders/${tier.campaignId}/${tier.tierId}`}
//                 campaignId={tier.campaignId}
//                 currentCampaignId={props.campaignId}
//                 tierId={tier.tierId}
//                 currentTierId={props.tierId}
//               />
//             </div>
//           ))}
//       </div>
//       <div
//         className="w-[3%] md:w-0 md:hidden h-fit bg-accent2 py-5 flex items-center justify-center"
//         onClick={() => setShowMenu(!showMenu)}
//       >
//         {!showMenu ? "L" : "R"}
//       </div>
//     </div>
//   );
// };

// const TierElement = (props) => {
//   // const [isCurrentTierSelected, setIsCurrentTierSelected] = useState(isSel);
//   const tierRef = useRef();

//   useEffect(() => {
//     if (
//       props.campaignId === props.currentCampaignId &&
//       props.tierId === props.currentTierId &&
//       tierRef.current
//     ) {
//       // console.log("scrolling into view tiername", tierName);
//       tierRef.current.scrollIntoView();
//     }
//   }, [props.currentCampaignId, props.currentTierId]);

//   if (
//     props.campaignId === props.currentCampaignId &&
//     props.tierId === props.currentTierId
//   ) {
//     console.log("1isCurrentTierSelected troe for", props.tierName);
//   }

//   return (
//     <Link
//       href={`/my-nest/purchases/${props.campaignId}/${props.tierId}`}
//       ref={tierRef}
//       className={`${
//         props.campaignId === props.currentCampaignId &&
//         props.tierId === props.currentTierId
//           ? "bg-white rounded-r-2xl"
//           : ""
//       } pl-5 cursor-pointer flex justify-between items-center pr-5 font-medium scroll-mt-20`}
//     >
//       <h2 className="py-3 px-2">{props.tierName}</h2>
//     </Link>
//   );
// };

export default OrderMenu;
