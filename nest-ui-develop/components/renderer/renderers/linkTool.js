import React from "react";
import parse from "html-react-parser";

const supportedKeys = [
  "container",
  "textHolder",
  "title",
  "description",
  "image",
  "siteName",
];

const defaultStyle = {
  container: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    width: "100%",
    minWidth: "280px",
    flexWrap: "wrap-reverse",
    border: "1px solid rgba(201, 201, 204, 0.48)",
    boxShadow: "0 1px 3px rgb(0 0 0 / 10%)",
    borderRadius: "6px",
    cursor: "pointer",
    padding: "25px",
  },
  textHolder: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "80%",
    padding: "12px 20px",
  },
  title: {
    fontSize: "17px",
    fontWeight: "600",
    margin: "0 0 10px 0",
    cursor: "pointer",
    lineHeight: "1.5em",
  },
  description: {
    textAlign: "left",
    lineHeight: "1.55em",
    fontWeight: 200,
    fontSize: "15px",
    cursor: "pointer",
    margin: "0 0 20px 0",
    overflow: "hidden",
  },
  siteName: {
    color: "#888",
    cursor: "pointer",
    fontSize: "15px",
    lineHeight: "1em",
    display: "block",
  },
  imgDiv: {
    backgroundPosition: "center center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    margin: "0 0 0 30px",
    width: "65px",
    height: "65px",
    borderRadius: "3px",
    float: "right",
    overflow: "hidden",
  },
};

const LinkToolOutput = ({ data, style, classNames }) => {
  if (!data || !data.link) return <></>;
  if (!style || typeof style !== "object") style = {};
  if (!classNames || typeof classNames !== "object") classNames = {};

  supportedKeys.forEach((key) => {
    if (!style[key] || typeof style[key] !== "object") style[key] = {};
    if (!classNames[key] || typeof classNames[key] !== "string")
      classNames[key] = "";
  });

  const containerStyle = { ...defaultStyle.container, ...style.container };
  const textHolderStyle = { ...defaultStyle.textHolder, ...style.textHolder };
  const titleStyle = { ...defaultStyle.title, ...style.title };
  const descriptionStyle = {
    ...defaultStyle.description,
    ...style.description,
  };
  const siteNameStyle = { ...defaultStyle.siteName, ...style.siteName };
  const imageDiv = {
    ...defaultStyle.imgDiv,
    ...style.imgDiv,
    backgroundImage: `url(${data.meta?.image?.url})`,
  };

  const handleClick = () => {
    let win = window.open(data.link, "_blank");
    win?.focus();
  };

  return (
    <div
      style={containerStyle}
      className={classNames.container}
      onClick={handleClick}
    >
      <div style={textHolderStyle} className={classNames.textHolder}>
        {data.meta?.title && (
          <p style={titleStyle} className={classNames.title}>
            {parse(data.meta?.title)}
          </p>
        )}
        {data.meta?.description && (
          <p style={descriptionStyle} className={classNames.description}>
            {parse(data.meta?.description)}
          </p>
        )}
        {data.meta?.domain && (
          <p style={siteNameStyle} className={classNames.siteName}>
            {parse(data.meta?.domain.split("/")[0])}
          </p>
        )}
      </div>
      {data.meta?.image?.url && <div style={imageDiv}></div>}
    </div>
  );
};

export default LinkToolOutput;
