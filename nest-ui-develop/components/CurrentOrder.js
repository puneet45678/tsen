import Image from "next/image";
import React, { useState, useEffect } from "react";

// const CurrentOrder = ({ currentOrder }) => {
//   const [assets, setAssets] = useState([]);
//   useEffect(() => {
//     // TODO add axios call to get assets
//     const numberOfAssets = Math.ceil(Math.random() * 10);
//     let data = [];
//     for (let i = 0; i <= numberOfAssets; i++) {
//       data.push({
//         imageSrc: "/images/banner.jpeg",
//         name: "assetsName",
//       });
//     }
//     setAssets(data);
//   }, [currentOrder]);

//   return (
//     <div className="overflow-y-auto h-full p-5 bg-white rounded-sm">
//       <h1 className="font-medium text-[20px] my-3">
//         {currentOrder.campaignName}
//       </h1>
//       <div className="flex gap-4 mb-5">
//         <div className="h-40 w-40 rounded-sm overflow-hidden bg-gray-500 relative">
//           <Image src="/images/banner.jpeg" fill />
//         </div>
//         <div className="flex justify-between w-full">
//           <div className="grow flex justify-between">
//             <div className="flex flex-col justify-between">
//               <div className="flex justify-between w-full">
//                 <span> {currentOrder.tierName}</span>
//               </div>
//               {/* TODO add editor js tier description */}
//               <div>
//                 Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum
//                 Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum
//                 Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum
//                 Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum
//                 Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum
//                 Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum
//                 Lorem ipsum{" "}
//               </div>
//               <div className="flex gap-4">
//                 <p>
//                   <span className="font-medium">Price: </span>
//                   <span>{currentOrder.price}</span>
//                 </p>
//                 <p>
//                   <span className="font-medium">Quantity: </span>
//                   <span>{currentOrder.quantity}</span>
//                 </p>
//                 <p>
//                   <span className="font-medium">Date of Purchase: </span>
//                   <span> {currentOrder.date}</span>
//                 </p>
//               </div>
//             </div>
//             <button className="w-fit h-fit rounded-sm bg-primary-brand text-white py-2 px-5 whitespace-nowrap">
//               Slice All
//             </button>
//           </div>
//         </div>
//       </div>
//       <p className="font-medium text-[18px] my-3">Assets:</p>
//       {/* <div className="grid grid-cols-[max-content_max-content_1fr_1fr_1fr_max-content] gap-2 items-center justify-items-center">
//         <p className="font-medium">Serial Number</p>
//         <p className="font-medium">Preview</p>
//         <p className="font-medium">Name</p>
//         <p className="font-medium">Usage Count</p>
//         <p className="font-medium">Size</p>
//         <p className="font-medium">Action</p>
//         {assets.map((asset, index) => (
//           // <div
//           //   key={index}
//           //   className="flex justify-start gap-2 border-b-[1px] items-end"
//           // >
//           <>
//             <div>{index + 1}</div>
//             <div className="h-16 w-16 bg-gray-300 relative">
//               <Image src={asset.imageSrc} fill />
//             </div>
//             <div className="border-2">{asset.name}</div>
//             <div>Usage Count</div>
//             <div>Size</div>
//             <div>
//               <button>Slice This</button>
//             </div>
//           </>
//           // </div>
//         ))}
//       </div> */}
//       {/* <table class="w-full border-separate [border-spacing:0.75rem] border-2">
//         <thead className="font-medium">
//           <td className="text-center border-2">Serial Number</td>
//           <td className="text-center border-2">Preview</td>
//           <td className="text-center border-2">Name</td>
//           <td className="text-center border-2">Usage Count</td>
//           <td className="text-center border-2">Size</td>
//           <td className="text-center border-2">Action</td>
//         </thead>
//         <tbody>
//           {assets.map((asset, index) => (
//             // <tr
//             //   key={index}
//             //   className="flex justify-start gap-2 border-b-[1px] items-end"
//             // >
//             <tr key={index}>
//               <td className="text-center">{index + 1}</td>
//               <td className="h-16 w-16 bg-gray-300 relative text-center">
//                 <Image src={asset.imageSrc} fill />
//               </td>
//               <td className="text-center">{asset.name}</td>
//               <td className="text-center">Usage Count</td>
//               <td className="text-center">Size</td>
//               <td className="text-center">
//                 <button className="py-2 w-full bg-primary-brand text-white rounded-sm">
//                   Slice This
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table> */}
//       <div className="flex flex-col gap-2">
//         <div className="flex font-medium">
//           <div className="w-1/6 text-center">Serial Number</div>
//           <div className="w-1/6 text-center">Preview</div>
//           <div className="w-1/6 text-center">Name</div>
//           <div className="w-1/6 text-center">Usage Count</div>
//           <div className="w-1/6 text-center">Size</div>
//           <div className="w-1/6 text-center">Action</div>
//         </div>
//         {assets.map((asset, index) => (
//           <div key={index} className="flex items-center justify-start">
//             <div className="w-1/6 text-center">{index + 1}</div>
//             <div className="w-1/6">
//               <div className="h-16 w-16 bg-gray-300 relative text-center m-auto">
//                 <Image src={asset.imageSrc} fill />
//               </div>
//             </div>
//             <div className="w-1/6 text-center">{asset.name}</div>
//             <div className="w-1/6 text-center">Usage Count</div>
//             <div className="w-1/6 text-center">Size</div>
//             <div className="w-1/6 text-center">
//               <button className="py-2 w-full bg-primary-brand text-white rounded-sm">
//                 Slice This
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//       {/* <div className="flex flex-col">
//         {assets.map((asset, index) => (
//           <div
//             key={index}
//             className="flex justify-start gap-2 border-b-[1px] items-end"
//           >
//             <div className="h-16 w-16 bg-gray-300 relative">
//               <Image src={asset.imageSrc} fill />
//             </div>
//             <p className="">{asset.name}</p>
//           </div>
//         ))}
//       </div> */}
//     </div>
//   );
// };

const CurrentOrder = (props) => {
  const [order, setOrder] = useState({});

  useEffect(() => {
    // TODO add axios call
    const data = [
      {
        imageSrc: "/images/banner.jpeg",
        name: "assetsName",
      },
      {
        imageSrc: "/images/banner.jpeg",
        name: "assetsName",
      },
      {
        imageSrc: "/images/banner.jpeg",
        name: "assetsName",
      },
      {
        imageSrc: "/images/banner.jpeg",
        name: "assetsName",
      },
      {
        imageSrc: "/images/banner.jpeg",
        name: "assetsName",
      },
      {
        imageSrc: "/images/banner.jpeg",
        name: "assetsName",
      },
    ];
    const resData = {
      campaignName: "campaignname",
      tierName: "tiername",
      quantity: 1,
      price: 100,
      date: "22-04-2023",
      imageSrc: "/images/banner.jpeg",
      tierDescription:
        "lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum ",
      assets: data,
    };
    setOrder(resData);
  }, []);

  return (
    <div className="grow h-full overflow-y-auto">
      <div className="p-5 bg-white rounded-sm">
        <h1 className="font-medium text-[20px] my-3">{order.campaignName}</h1>
        <div className="flex gap-4 mb-5">
          <div className="h-40 w-40 rounded-sm overflow-hidden bg-gray-500 relative">
            <Image src={order.imageSrc} fill />
          </div>
          <div className="flex justify-between w-full">
            <div className="grow flex justify-between">
              <div className="flex flex-col justify-between">
                <div className="flex justify-between w-full">
                  <span className="font-medium text-[18px]">
                    {" "}
                    {order.tierName}
                  </span>
                </div>
                {/* TODO add editor js tier description */}
                <div>{order.tierDescription}</div>
                <div className="flex gap-4">
                  <p>
                    <span className="font-medium">Price: </span>
                    <span>{order.price}</span>
                  </p>
                  <p>
                    <span className="font-medium">Quantity: </span>
                    <span>{order.quantity}</span>
                  </p>
                  <p>
                    <span className="font-medium">Date of Purchase: </span>
                    <span> {order.date}</span>
                  </p>
                </div>
              </div>
              <button className="w-fit h-fit rounded-sm bg-primary-brand text-white py-2 px-5 whitespace-nowrap">
                Slice All
              </button>
            </div>
          </div>
        </div>
        <p className="font-medium text-[18px] my-3">Assets:</p>
        <div className="flex flex-col gap-2">
          <div className="flex font-medium">
            <div className="w-[8%] text-center">Serial Number</div>
            <div className="w-[10%] text-center">Preview</div>
            <div className="grow text-left">Name</div>
            <div className="w-[10%] text-center">Usage Count</div>
            <div className="w-[8%] text-center">Size</div>
            <div className="w-28 text-center">Action</div>
          </div>
          {order.assets &&
            order.assets.map((asset, index) => (
              <div
                key={index}
                className="flex items-center justify-start w-full"
              >
                <div className="w-[8%] text-center">{index + 1}</div>
                <div className="w-[10%]">
                  <div className="h-16 w-16 bg-gray-300 relative text-center m-auto">
                    <Image src={asset.imageSrc} fill />
                  </div>
                </div>
                <div className="grow text-left">{asset.name}</div>
                <div className="w-[10%] text-center">Usage Count</div>
                <div className="w-[8%] text-center">Size</div>
                <div className="w-28 text-center">
                  <button className="py-2 w-full bg-primary-brand text-white rounded-sm">
                    Slice This
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
export default CurrentOrder;
