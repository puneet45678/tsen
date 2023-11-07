import React from "react";

const InputSkeleton = (props) => {

    return (
      <div
        style={{
          height: props.height ?? "42px",
          width: props.width ?? "200px",
          
          
        }}
        className="animate-pulse bg-light-neutral-600 border-light-neutral-700 border-[1px] rounded-[5px]"
      ></div>
    );

};

export default InputSkeleton;