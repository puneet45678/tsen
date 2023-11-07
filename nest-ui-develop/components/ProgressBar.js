import React, { useState } from "react";
import ReviewsProvider from "./ReviewsProvider";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const ProgressBar = (props) => {
  const { score } = props.count;
  const [show, setShow] = useState(false);
  // function for calculating the color
  const calcColor = (percent, start, end) => {
    let a = percent / 100,
      b = (end - start) * a,
      c = b + start;

    // return an CSS hsl color string
    return "hsl(" + c + ", 100%, 50%)";
  };

  return (
    <>
      <div
        className={`flex flex-col items-center justify-center w-full max-w-[150px] sm:static sm:block m-auto ${
          show == true ? "block" : "hidden"
        }`}
      >
        <ReviewsProvider
          valueStart={0}
          valueEnd={(props.count / 4) * 100}
          className="border-2"
        >
          {(value) => (
            <CircularProgressbar
              value={value}
              text={`${value} %`}
              circleRatio={
                0.7
              } /* Make the circle only 0.7 of the full diameter */
              styles={{
                trail: {
                  strokeLinecap: "butt",
                  transform: "rotate(-126deg)",
                  transformOrigin: "center center",
                },
                path: {
                  strokeLinecap: "butt",
                  transform: "rotate(-126deg)",
                  transformOrigin: "center center",
                  stroke: "#1d75bd",
                },
                text: {
                  fill: "#1d75bd",
                },
              }}
              strokeWidth={10}
            />
          )}
        </ReviewsProvider>
        <div className="md:-mt-4 text-center">
          <p className="text-[10px] sm:text-xs md:text-base">
            Profile Completion
          </p>
        </div>
      </div>
      <div
        className="block sm:hidden absolute right-4"
        onClick={() => (show == false ? setShow(true) : setShow(false))}
      >
        CLICK ME
      </div>
    </>
  );
};

export default ProgressBar;
