// import React from "react";

// const InputSkeleton = (props) => {

//     return (
//       <div
//         style={{
//           height: props.height ?? "42px",
//           width: props.width ?? "200px",

//         }}
//         className="animate-pulse bg-light-neutral-600 border-light-neutral-700 border-[1px] rounded-[5px]"
//       ></div>
//     );

// };

// export default InputSkeleton;

import animationData from "./InputLottie.json";

import Lottie from "react-lottie";
const InputSkeleton = (props) => {
  const {width="977px",height="48px",radius="5px"}=props;

  const defaultOptions = {
    autoplay: true,
    loop: true,
    animationData: animationData,
    
  };
 
  console.log(defaultOptions);
  return (

    <div style={{ height: `${height}`, borderRadius: `${radius}`}} className="overflow-hidden h-[48px] w-[${width}] border-[0px] ">
    <Lottie options={defaultOptions} height={width} width={width} />

  </div>
  );
};


export default InputSkeleton;
