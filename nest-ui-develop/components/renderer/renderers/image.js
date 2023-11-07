import React from "react";
import parse from "html-react-parser";
import Image from "next/image";

const supportedKeys = ["img", "figure", "figcaption"];

const defaultStyle = {
  figure: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    margin: "20px 0",
    width: "100%",
  },
  image: {
    maxWidth: "100%",
    maxHeight: "400px",
  },
  figcaption: {
    padding: "5px 10px",
    fontSize: "12px",
    backgroundColor: "#2d333a",
    color: "white",
    borderRadius: "2px",
    cursor: "default",
  },
};

const ImageOutput = ({ data, style, classNames }) => {
  if (!data || !data.file || !data.file.url) return <></>;
  if (!style || typeof style !== "object") style = {};
  if (!classNames || typeof classNames !== "object") classNames = {};

  supportedKeys.forEach((key) => {
    if (!style[key] || typeof style[key] !== "object") style[key] = {};
    if (!classNames[key] || typeof classNames[key] !== "string")
      classNames[key] = "";
  });

  const imageStyle = { ...defaultStyle.image, ...style.img };
  imageStyle["width"] = data.stretched ? "100%" : "";

  const figureStyle = { ...defaultStyle.figure, ...style.figure };
  if (!data.withBorder) figureStyle["border"] = "none";
  if (!data.withBackground) figureStyle["backgroundColor"] = "none";

  const figcaptionStyle = { ...defaultStyle.figcaption, ...style.figcaption };

  return (
    <figure style={figureStyle} className={classNames.figure}>
      <Image
        src={data.file.url}
        alt={data.caption || ""}
        style={imageStyle}
        className={classNames.img}
      />
      {data.caption && (
        <figcaption style={figcaptionStyle} className={classNames.figcaption}>
          {parse(data.caption)}
        </figcaption>
      )}
    </figure>
  );
};

export default ImageOutput;
