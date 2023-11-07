import animationData from "./CoverImage.json";

import Lottie from "react-lottie";
const CircularSkeleton = (props) => {
  const {width="100px",height="100px"}=props;

  const defaultOptions = {
    autoplay: true,
    loop: true,
    animationData: animationData,
    
  };
 
  console.log(defaultOptions);
  return (

    <div style={{ height: `${height}`, borderRadius: "50%" }} className="overflow-hidden w-[${width}] border-[0px] rounded-[50%]">
    <Lottie options={defaultOptions} height={width} width={width} />

  </div>
  );
};


export default CircularSkeleton;
