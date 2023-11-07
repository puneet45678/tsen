import React from "react";
import parse from "html-react-parser";

const supportedKeys = ["container", "item", "checkbox", "label"];

const defaultStyle = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  label: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    verticalAlign: "top",
    float: "left",
    margin: "4px 0",
  },
  checkbox: {
    display: "absolute",
    opacity: "0",
    height: "0",
    width: "0",
  },
  checkedDiv: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    height: "25px",
    width: "25px",
    borderRadius: "50%",
    backgroundColor: "#2196F3",
    marginRight: "5px",
  },
  uncheckedDiv: {
    display: "inline-block",
    height: "25px",
    width: "25px",
    borderRadius: "50%",
    backgroundColor: "#eee",
    marginRight: "5px",
  },
  check: {
    position: "absolute",
    width: "6px",
    height: "10px",
    border: "solid white",
    borderWidth: "0 3px 3px 0",
    transform: "rotate(45deg)",
  },
};

const ChecklistOutput = ({ data, style, classNames }) => {
  if (
    !data ||
    !data.items ||
    !Array.isArray(data.items) ||
    data.items.length < 1
  )
    return <></>;
  if (!style || typeof style !== "object") style = {};
  if (!classNames || typeof classNames !== "object") classNames = {};

  supportedKeys.forEach((key) => {
    if (!style[key] || typeof style[key] !== "object") style[key] = {};
    if (!classNames[key] || typeof classNames[key] !== "string")
      classNames[key] = "";
  });

  const containerStyle = { ...defaultStyle.container, ...style.container };
  const checkboxStyle = { ...defaultStyle.checkbox, ...style.checkbox };
  const labelStyle = { ...defaultStyle.label, ...style.label };
  const checkedDivStyle = { ...defaultStyle.checkedDiv, ...style.checkedDiv };
  const checkStyle = { ...defaultStyle.check, ...style.check };
  const uncheckedDivStyle = {
    ...defaultStyle.uncheckedDiv,
    ...style.uncheckedDiv,
  };

  const content = data.items.map((item, index) => (
    <label
      key={index}
      htmlFor={index.toString()}
      style={labelStyle}
      className={classNames.label}
    >
      {item.checked ? (
        <div style={checkedDivStyle}>
          <div style={checkStyle}></div>
        </div>
      ) : (
        <div style={uncheckedDivStyle}></div>
      )}
      {item.text}
      <input
        id={index.toString()}
        type="checkbox"
        style={checkboxStyle}
        className={classNames.checkbox}
        checked={item.checked}
        readOnly
      />
    </label>
  ));

  return (
    <ul style={containerStyle} className={classNames.container}>
      {content}
    </ul>
  );
};

export default ChecklistOutput;
