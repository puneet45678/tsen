import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { changeSection, changeMenuClick } from "../store/sectionSlice";
const Menu = (props) => {
  const dispatch = useDispatch();
  const currSec = useSelector((state) => state.section.section);

  return (
    <div className="flex flex-col justify-start sm:w-[30%] md:w-[15%] bg-accent2 rounded-[2px] h-full">
      <div className="fixed top-36">
        <h1 className="my-4 ml-14 text-[24px] text-primary-brand font-[550] mr-3 sm:mr-0">
          {props.heading}
        </h1>
        <div className="flex flex-col justify-start ml-11">
          {props.items.map((item, index) => {
            return (
              <div
                key={index}
                onMouseLeave={() => dispatch(changeMenuClick(false))}
                className={`mx-1 rounded-sm ${
                  currSec == item.setState
                    ? "text-primary-brand"
                    : "text-gray-500"
                } hover:bg-gray-50 cursor-pointer text-sm`}
                onClick={() => {
                  dispatch(changeMenuClick(true));
                  dispatch(changeSection(item.setState));
                }}
              >
                <p
                  className={`ml-2 my-1 text-sm border-l-2 rounded-sm pl-1 ${
                    currSec == item.setState
                      ? "border-primary-brand"
                      : "border-gray-500"
                  }`}
                >
                  {item.title}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Menu;
