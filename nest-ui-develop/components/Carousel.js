import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import FullScreenView from "./FullScreenView";
import Carousel1 from "framer-motion-carousel";
import {
  AiOutlineFullscreen,
  AiOutlineCaretLeft,
  AiOutlineCaretRight,
} from "react-icons/ai";

const Carousel = (props) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const [fullScreen, setFullScreen] = useState(false);
  const carouselContainerRef = useRef();
  let leftCounter = props.indexShow,
    rightCounter = props.indexShow;
  console.log("Corousel just entered", leftCounter, " right ", rightCounter);

  const ModelViewer = dynamic(() => import("./ModelViewer"), {
    ssr: false,
  });

  const slideLeft = () => {
    console.log("Left Slider pressed", props.indexShow);
    leftCounter = props.indexShow - 1;

    if (leftCounter <= 0) {
      props.setIndexShow(0);
      props.setSelectedImage(props.items[leftCounter]);
    }
    props.setIndexShow(leftCounter);
    props.setSelectedImage(props.items[leftCounter]);

    console.log("Left Slider pressed after", props.indexShow);
  };

  const slideRight = () => {
    console.log("Right Slider pressed", props.indexShow);

    rightCounter = rightCounter + 1;

    if (rightCounter >= props.items.length - 1) {
      rightCounter = props.items.length - 1;
      props.setSelectedImage(props.items[rightCounter]);
      // return;
    }
    props.setIndexShow(rightCounter);
    props.setSelectedImage(props.items[rightCounter]);

    console.log(
      "Right Slider pressed after",
      props.indexShow,
      " Right Counter ",
      rightCounter
    );
  };

  let index = props.index;
  let item = props.image;

  useEffect(() => {
    setContainerWidth(carouselContainerRef.current.offsetWidth);
  }, [carouselContainerRef.current]);

  return (
    <div
      className="flex bg-orange-300 text-white rounded-[2px] h-full w-full overflow-hidden relative"
      ref={carouselContainerRef}
      id="carouselContainer"
    >
      {/* <div
        className="absolute hover:bg-cropper-background hover:text-white text-black bg-transparent flex justify-center items-center h-10 w-10 p-2 text-xs left-4 bottom-3 z-10 rounded-full cursor-pointer"
        onClick={() => setFullScreen(true)}
      > */}
      {/* <AiOutlineFullscreen className="h-full w-full" /> */}
      {/* </div> */}
      {/* {fullScreen == true ? (
        <FullScreenView
          setFullScreen={setFullScreen}
          src={props.items[props.indexShow]}
        />
      ) : (
        <></>
      )} */}
      <div className="absolute flex gap-2 bottom-3 right-4 z-10">
        <div
          className={`${
            props.indexShow === 0
              ? "hidden"
              : " bg-cropper-background flex justify-center items-center rounded-full h-10 w-10 text-xs text-white cursor-pointer"
          }`}
          // className="bg-cropper-background flex justify-center items-center rounded-full h-10 w-10 text-xs text-white cursor-pointer"
          onClick={slideLeft}
        >
          <AiOutlineCaretLeft />
        </div>
        <div
          className={`${
            props.indexShow === props.items.length - 1
              ? "hidden"
              : "bg-cropper-background flex justify-center items-center rounded-full h-10 w-10 text-xs text-white cursor-pointer"
          }`}
          // className="bg-cropper-background flex justify-center items-center rounded-full h-10 w-10 text-xs text-white cursor-pointer"
          onClick={slideRight}
        >
          <AiOutlineCaretRight />
        </div>
      </div>

      <ul
        className={`h-full flex items-center justify-center transition-all ease-in-out duration-300 overflow-visible`}
        style={{
          transform:
            "translateX(-" + containerWidth * props.selectedImage + "px)",
        }}
      >
        <li
          key={index}
          className={`h-full relative`}
          style={{ width: containerWidth }}
        >
          <img
            key={index}
            className="h-full w-full object-cover"
            alt="Campaign Picture"
            id={props.index}
            src={props.selectedImage}
            style={{
              borderRadius: "2px",
              objectFit: "cover",
            }}
            fill
          />
        </li>
      </ul>
    </div>
  );
};

export default Carousel;

// import React, { useState, useEffect } from 'react'
// import Image from 'next/image'
// import Carousel from "framer-motion-carousel";
// import dynamic from 'next/dynamic';
// import FullScreenView from './FullScreenView';
// import { SideBySideMagnifier } from 'react-image-magnifiers';
// import ReactImageMagnify from 'react-image-magnify';
// import { useDispatch } from 'react-redux';
// import { changeIndex, resetIndex } from '../store/indexSlice';

// const Carrousel = (props) => {

//   const dispatch = useDispatch();
//   const [carouselWith, setCarouselWidth] = useState();
//   const [slideValue, setSlideValue] = useState(props.index);
//   const [fullScreen, setFullScreen] = useState(false);

//   const ModelViewer = dynamic(() => import("./ModelViewer"), {
//     ssr: false,
//   });
//   const items = props.items;
//   const slideLeft = () => {
//     if (slideValue < 0) {
//       setSlideValue(0);
//       dispatch(resetIndex());
//     }
//     else {
//       setSlideValue(slideValue - carouselWith)
//       dispatch(changeIndex(-1));
//     }
//   }

//   const slideRight = () => {
//     console.log(slideValue + " " + carouselWith)
//     if (slideValue >= carouselWith * (items.length - 1)) {
//       setSlideValue(0);
//       dispatch(resetIndex());
//     }
//     else {
//       setSlideValue(slideValue + carouselWith)
//       dispatch(changeIndex(1));
//     }
//   }

//   useEffect(() => {
//     const carouselContainer = document.getElementById("carousel-container");
//     if (typeof carouselContainer !== "undefined")
//       setCarouselWidth(carouselContainer.clientWidth);

//     console.log("before " + document.getElementById("sidebyside").clientWidth)

//   }, [])

//   useEffect(() => {
//     //console.log((items.length*carouselWith)/slideValue);
//     console.log("beforer " + document.getElementById("sidebyside").clientWidth)
//   }, [slideValue])

//   return (

//     <div className='bg-orange-300 text-white rounded-[2px] h-full w-full overflow-hidden relative' id="carousel-container">
//       <div className='absolute bg-black opacity-30 flex justify-center items-center rounded-full h-10 w-10 text-xs right-16 bottom-3 z-10' onClick={slideLeft}>
//         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" class="w-7 h-7">
//           <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
//         </svg>
//       </div>
//       <div className='absolute bg-black opacity-30 flex justify-center items-center rounded-full h-10 w-10 text-xs right-4 bottom-3 z-10' onClick={slideRight}>
//         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" class="w-7 h-7">
//           <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
//         </svg>
//       </div>
//       <div className='absolute hover:bg-black hover:opacity-30 bg-transparent flex justify-center items-center rounded-[2px] h-9 w-9 text-xs left-4 bottom-3 z-10' onClick={() => setFullScreen(true)}>
//         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" class="w-6 h-6">
//           <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
//         </svg>
//       </div>
//       {fullScreen == true ? <FullScreenView setFullScreen={setFullScreen} src={slideValue == 0 ? items[0] : items[Math.round((items.length * carouselWith) / slideValue) - 2]} /> : ""}
//       <div id="sidebyside" className={`h-full flex justify-center transition-all ease-in-out duration-300`} style={{ transform: "translateX(-" + slideValue + "px)", width: "" + ((carouselWith * props.items.length) + 8.6) + "px" }}>
//         {items.length > 0 && items.map((item, i) => {
//           //console.log(props.items)
//           if (item.substring(item.length - 3, item.length) == "glb") {
//             return (
//               <div className={`h-full`} style={{ width: "" + (carouselWith + 2.53) + "px" }} key={i}>
//                 <ModelViewer key={i} item={item} height="100%" width="100%"></ModelViewer>
//               </div>
//             );
//           }
//           else {
//             return <div>
//               <img
//                 className=''
//                 id={props.index}
//                 src={item}
//                 style={{ "borderRadius": "6px", objectFit: "cover", width: "" + (carouselWith + 2.53) + "px", height: "100%" }}
//                 placeholder="bleh"
//               ></img>
//             </div>
//           }
//         })}
//       </div>
//     </div>
//   )
// }

// export default Carrousel
