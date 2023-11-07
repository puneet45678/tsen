import React from "react";

const Rectangular = (props) => {
  if (props.variant === "rectangular") {
    return (
      <div
        style={{
          height: props.height ?? "100px",
          width: props.width ?? "200px",
        }}
        className="animate-pulse bg-gray-300"
      ></div>
    );
  } else if (props.variant === "circular") {
    return (
      <div
        style={{
          height: props.height ?? "100px",
          width: props.width ?? "100px",
        }}
        className="animate-pulse bg-gray-300 rounded-full"
      ></div>
    );
  } else {
    return (
      <div
        style={{
          width: props.width ?? "100%",
          fontSize: props.fontSize ?? "inherit",
        }}
        className="before:content-['\00a0'] animate-pulse bg-gray-300"
      ></div>
    );
  }
};

export default Rectangular;
