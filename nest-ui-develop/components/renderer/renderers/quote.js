import React from "react";
import parse from "html-react-parser";

const supportedKeys = ["container", "content", "author", "message"];

const defaultStyle = {
  quote: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "5px 0",
    textAlign: "left",
  },
  content: {
    minWidth: "240px",
    width: "80%",
    margin: "5px 0",
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    border: "1px solid var(--primary-grey)",
    backgroundColor: "var(--secondary-white)",
    borderRadius: "var(--default-radius)",
  },
  author: {
    fontWeight: "bold",
    margin: "0 5px 5px 5px",
  },
};

const Quote = ({ author = "Unknown", message, config, classNames, style }) => {
  const containerStyle = { ...defaultStyle.quote, ...style.container };
  const contentStyle = { ...defaultStyle.contentStyle, ...style.content };
  const messageStyle = { ...defaultStyle.messageStyle, ...style.message };
  const authorStyle = { ...defaultStyle.author, ...style.author };

  return (
    <div style={containerStyle} className={classNames.container}>
      <span style={contentStyle} className={classNames.content}>
        <p style={messageStyle} className={classNames.message}>
          <strong>&quot;</strong>
          {message}
          <strong>&quot;</strong>
        </p>
        <p style={authorStyle} className={classNames.author}>
          <strong>
            <small>{author}</small>
          </strong>
        </p>
      </span>
    </div>
  );
};

const QuoteOutput = ({ data, style, classNames }) => {
  if (!data || !data.text || typeof data.text != "string") return <></>;
  if (!style || typeof style !== "object") style = {};
  if (!classNames || typeof classNames !== "object") classNames = {};

  supportedKeys.forEach((key) => {
    if (!style[key] || typeof style[key] !== "object") style[key] = {};
    if (!classNames[key] || typeof classNames[key] !== "string")
      classNames[key] = "";
  });

  const caption =
    data.caption && typeof data.caption === "string" ? data.caption : "Unknown";
  if (data.alignment && typeof data.alignment === "string")
    style["textAlign"] = data.alignment;

  return (
    <Quote
      author={parse(caption)}
      message={parse(data.text)}
      style={style}
      classNames={classNames}
      config={config}
    />
  );
};

export default QuoteOutput;
