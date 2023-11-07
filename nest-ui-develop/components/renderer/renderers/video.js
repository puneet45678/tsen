import React from "react";

const supportedKeys = ["video", "figure", "figcaption"];

const defaultStyle = {
  videoStyle: {
    maxWidth: "100%",
  },
  figureStyle: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    margin: "20px 0",
    width: "100%",
    maxWidth: "100%",
    overflow: "hidden",
    backgroundColor: "aliceblue",
    border: "1px solid #eee",
  },
  figcaptionStyle: {
    position: "absolute",
    top: "8px",
    right: "8px",
    padding: "5px 10px",
    fontSize: "12px",
    backgroundColor: "#2d333a",
    color: "white",
    borderRadius: "2px",
    cursor: "default",
  },
};

const VideoOutput = ({ data, style, classNames }) => {
  console.log(`dat: ${data}`);
  if (!data?.url && !data?.file?.url) {
    console.log(data);
    return <></>;
  }
  if (!style || typeof style !== "object") style = {};
  if (!classNames || typeof classNames !== "object") classNames = {};

  supportedKeys.forEach((key) => {
    if (!style[key] || typeof style[key] !== "object") style[key] = {};
    if (!classNames[key] || typeof classNames[key] !== "string")
      classNames[key] = "";
  });

  const videoStyle = { ...defaultStyle.videoStyle, ...style.video };
  videoStyle["width"] = data.stretched ? "100%" : "";

  const figureStyle = { ...defaultStyle.figureStyle, ...style.figure };

  if (!data.withBorder) figureStyle["border"] = "none";
  if (!data.withBackground) figureStyle["backgroundColor"] = "none";

  const figcaptionStyle = {
    ...defaultStyle.figcaptionStyle,
    ...style.figcaption,
  };
  console.log("data", data);
  return (
    <>
      <figure style={figureStyle} className={classNames.figure}>
        {/* <video
          style={videoStyle}
          className={classNames.video}
          autoPlay={data.autoPlay}
          muted={data.muted}
          controls={data.controls}
        > */}
        <video
          style={videoStyle}
          className={classNames.video}
          autoPlay
          muted={false}
          controls
        >
          <source src={data.url || data.file.url} />
          Your browser does not support the video tag.
        </video>
        {data.caption && (
          <figcaption style={figcaptionStyle} className={classNames.figcaption}>
            {data.caption}
          </figcaption>
        )}
      </figure>
    </>
  );
};

export default VideoOutput;
