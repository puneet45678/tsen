import Image from "next/image";
import React from "react";

const SocialConnectionContainer = (props) => {
  return (
    <a href={props.link} target="_blank" rel="noopener noreferrer">
      <div className="flex items-center justify-center h-12 w-12 cursor-pointer rounded-[5px] border-[1px] border-light-neutral-600 shadow-xs">
        <Image
          src={props.icon}
          alt={`${props.for} icon`}
          height={24}
          width={24}
        />
      </div>
    </a>
  );
};

export default SocialConnectionContainer;
