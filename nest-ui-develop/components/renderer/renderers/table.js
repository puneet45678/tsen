import React from "react";
import parse from "html-react-parser";

const supportedKeys = ["table", "tr", "th", "td"];

const defaultStyle = {
  table: {
    borderSpacing: "1px 2px",
    margin: "5px 0",
  },
  th: {
    minWidth: "100px",
    padding: "8px 15px",
    borderRadius: "2px",
    backgroundColor: "lightcoral",
  },
  td: {
    minWidth: "100px",
    padding: "8px 15px",
    borderRadius: "2px",
    textAlign: "left",
  },
};

const TableOutput = ({ data, style, classNames }) => {
  if (!data || !data.content || !Array.isArray(data.content)) return <></>;
  if (!style || typeof style !== "object") style = {};
  if (!classNames || typeof classNames !== "object") classNames = {};

  supportedKeys.forEach((key) => {
    if (!style[key] || typeof style[key] !== "object") style[key] = {};
    if (!classNames[key] || typeof classNames[key] !== "string")
      classNames[key] = "";
  });

  const tableStyle = { ...defaultStyle.table, ...style.table };
  const trStyle = { ...defaultStyle.tr, ...style.tr };
  const thStyle = { ...defaultStyle.th, ...style.th };
  const tdStyle = { ...defaultStyle.td, ...style.td };

  let head = data.withHeadings ? data.content[0] : [];
  let body = data.withHeadings ? data.content.slice(1) : data.content;
  return (
    <table style={tableStyle} className={classNames.table}>
      {data.withHeadings ? (
        <thead>
          <tr style={trStyle} className={classNames.tr}>
            {data.content["0"].map((columnValue, idx) => (
              <td key={idx} style={tdStyle} className={classNames.td}>
                {parse(columnValue)}
              </td>
            ))}
          </tr>
        </thead>
      ) : (
        <></>
      )}
      <tbody>
        {body.map((row, idxr) => (
          <tr
            key={idxr}
            style={{
              backgroundColor: idxr % 2 === 0 ? "white" : "#f9f9f9",
              ...trStyle,
            }}
            className={classNames.tr}
          >
            {row.map((columnValue, idxc) => (
              <td key={idxc} style={tdStyle} className={classNames.td}>
                {parse(columnValue)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableOutput;
