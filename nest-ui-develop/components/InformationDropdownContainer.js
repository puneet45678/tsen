import React, { useState } from "react";
import ChevronUp from "../icons/ChevronUp";
import ChevronDown from "../icons/ChevronDown";
import Image from "next/image";

const InformationDropdownContainer = (props) => {
  const conditionDroppable=props.droppable
  const [showInformation, setShowInformation] = useState(
    conditionDroppable? (props.openDefault ? true : false) : true
  );
  return (
    <div>

        {/* Upper Header */}
      <div
        className={`${
          showInformation ? "rounded-t-[5px]" : "rounded-[5px]"
        } flex items-center justify-between gap-3 border-[1px] border-light-neutral-600 py-5 px-8`}
      >
        {props?.icon && (
          <div className="h-6 w-6 relative">
            <Image src={props.icon ?? ""} alt="Information Icon" fill />
          </div>
        )}
        <div className="grow">
          <h6 className="text-headline-2xs font-semibold">{props.heading}</h6>
        </div>
        {conditionDroppable && <div
          onClick={() => setShowInformation(!showInformation)}
          className="w-5 h-5"
        >
          { showInformation ? <ChevronUp /> : <ChevronDown />}
        </div>}
      </div>

      {/* Content Box */}
      <div
        className={`${
          showInformation
            ? "grid-rows-[1fr] py-5 px-8 border-x-[1px] border-b-[1px] border-light-neutral-600 rounded-b-[5px] p-6"
            : "grid-rows-[0fr] border-[0px]"
        } grid transition-all ease-in-out duration-500 bg-light-neutral-50`}
      >
        <div className="overflow-hidden">{props.children}</div>
      </div>


    </div>
  );
};

export default InformationDropdownContainer;
