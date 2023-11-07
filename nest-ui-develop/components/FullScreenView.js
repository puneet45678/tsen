import React, { useState, useEffect } from "react";
import Image from "next/image";

const FullScreenView = (props) => {
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27 && showCrop == false) {
        props.setFullScreen(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  return (
    <div className="fixed w-[100vw] h-[100vh] top-0 left-0 z-40 bg-cropper-background flex items-center justify-center rounded-sm">
      <div className="max-w-[75%] h-[75%] flex items-start justify-center">
        <div className="h-full">
          <img
            src={props.src}
            alt="Campaign Image"
            className="h-full  object-contain"
          />
        </div>
        <div className="ml-2 mt-2">
          <button
            className="rounded-[2px] bg-white text-black font-bold opacity-40 hover:opacity-80 px-3 py-2"
            onClick={() => props.setFullScreen(false)}
          >
            X
          </button>
        </div>
      </div>
    </div>
  );
};

export default FullScreenView;
