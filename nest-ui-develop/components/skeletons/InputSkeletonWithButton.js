import React from "react";

const InputSkeletonWithButton = (props) => {
    return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            style={{
            //   flex: "1",
              height: props.height ?? "48px",
              width: props.width ?? "200px",
              marginRight: "8px", 
            }}
            className="animate-pulse bg-light-neutral-600 border-light-neutral-700 border-[1px] rounded-[5px] items-end"
          ></div>
          <button
            style={{
              height: props.height ?? "48px",
              padding: "0 16px", 
              width:"85px"
            }}
            className="animate-pulse bg-light-neutral-600 border-light-neutral-700 border-[1px] rounded-[5px]"
          >
            {/* Button content */}
          </button>
        </div>
      );
};

export default InputSkeletonWithButton;
