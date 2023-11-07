import React from "react";
import parse from "html-react-parser";

const validListStyles = ["ordered", "unordered"];
const supportedKeys = ["container", "listItem"];

const defaultStyle = {
  container: {
    margin: "5px 0",
  },
};

const ListOutput = ({ data, style, classNames }) => {
  if (!data || !data.items || !Array.isArray(data.items)) return <></>;
  if (!style || typeof style !== "object") style = {};
  if (!classNames || typeof classNames !== "object") classNames = {};

  supportedKeys.forEach((key) => {
    if (!style[key] || typeof style[key] !== "object") style[key] = {};
    if (!classNames[key] || typeof classNames[key] !== "string")
      classNames[key] = "";
  });

  const containerStyle = { ...defaultStyle.container, ...style.container };
  const listItemStyle = { ...defaultStyle.listItem, ...style.listItem };

  const listType = validListStyles.includes(data.style)
    ? data.style
    : "unordered";
  const content = data.items.map((item, index) => (
    <li key={index} style={listItemStyle} className={classNames.listItem}>
      {parse(item)}
    </li>
  ));

  if (content.length <= 0) return <></>;
  if (listType === "ordered")
    return (
      <ol style={containerStyle} className={classNames.container}>
        {content}
      </ol>
    );

  return (
    <ul style={containerStyle} className={classNames.container}>
      {content}
    </ul>
  );
};

export default ListOutput;
