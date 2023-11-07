import React from "react";

const CircularLoading = (props) => {
  return (
    <div
      className={`h-full max-h-20 aspect-square rounded-full border-t-4 animate-spin ${
        props.primarySpinner ? "border-t-primary-purple-500" : "border-t-white"
      }`}
    ></div>
  );
};

export default CircularLoading;
