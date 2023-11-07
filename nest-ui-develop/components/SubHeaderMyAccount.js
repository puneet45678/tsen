import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import FurtherContentRightArrow from "../icons/FurtherContentRightArrow"

const SubHeader2 = (props) => {
  const [sliderWidth, setSliderWidth] = useState(0);
  const [sliderLeft, setSliderLeft] = useState(0);

  const subHeaderRef = useRef();

  const slide = (index) => {
    const element = subHeaderRef.current.children[index];
    if (!props.changePage(element.id)) return;
    setSliderLeft(element.offsetLeft);
    setSliderWidth(Math.round(element.offsetWidth - 10));
  };

  // useEffect(() => {
  //   if (subHeaderRef.current.children.length > 0) {
  //     // const firstSubHeaderElement = subHeaderRef.current.children[0];
  //     let firstSubHeaderElement = undefined;
  //     for (let child of subHeaderRef.current.children) {
  //       if (child.id === props.page) {
  //         firstSubHeaderElement = child;
  //         break;
  //       }
  //     }
  //     setSliderWidth(Math.round(firstSubHeaderElement.offsetWidth - 10));
  //     setSliderLeft(firstSubHeaderElement.offsetLeft);
  //   }
  // }, [subHeaderRef.current?.children]);

  return (
    <>
   
      {/* <ul className="flex" id="subHeader" ref={subHeaderRef}>
        {props.data.map((item, index) => (
          <li
            key={index}
            className={`cursor-pointer w-max px-2 xs:px-3 sm:px-2 md:px-5 ${
              props.page === item.id ? "text-primary-brand" : ""
            }`}
            id={item.id}
            onClick={() => slide(index)}
          >
            <span className="hidden sm:flex">{item.title}</span>
            <span className="flex sm:hidden">{item.icon}</span>
          </li>
        ))}
        <li
          style={{
            width:
              "" + (sliderWidth > 0 ? sliderWidth + 10 : sliderWidth) + "px",
            left: sliderLeft + "px",
          }}
          className={`transition-all ease-linear duration-300 top-7 absolute border-b-[3px] border-primary-brand bottom-0`}
        ></li>
      </ul>
      {props.changesToThePage ? (
        <button
          className="font-medium bg-primary-brand text-white w-full max-w-[150px] h-10 rounded-sm cursor-pointer flex items-center justify-center mr-3"
          onClick={props.handleSave}
        >
          Save
        </button>
      ) : (
        <Link
          href={props.previewLink}
          className="font-medium bg-primary-brand text-white w-full max-w-[150px] h-10 rounded-sm cursor-pointer flex items-center justify-center mr-3"
        >
          Preview
        </Link>
      )} */}
      <div className="flex flex-col mx-[60px] mt-[32px] bg-light-neutral-50">
    <div className="flex gap-1">
      <span className="text-dark-neutral-50 font-[500] text-md">Home</span>
      <span className="text-dark-neutral-700 text-md"><FurtherContentRightArrow/></span>
      <span className="text-primary-purple-600 font-[500] text-md">Account Settings</span>
    </div>
    <div className="border-b-2 border-light-neutral-500 mt-[24px]">

    </div>
    </div>
   
    </>


  );
};

export default SubHeader2;
