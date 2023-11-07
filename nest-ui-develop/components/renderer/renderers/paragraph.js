import React from "react";
import parse, { domToReact } from "html-react-parser";

const defaultStyle = {
  anchor: {
    cursor: "pointer",
    textDecoration: "underline",
  },
  code: {
    background: "rgba(250, 239, 240, 0.78)",
    color: "#b44437",
    padding: "3px 4px",
    borderRadius: "5px",
    margin: "0 1px",
    fontFamily: "inherit",
    fontSize: "0.86em",
    fontWeight: "500",
    letterSpacing: "0.3px",
  },
  italics: {
    fontStyle: "italic",
  },
  mark: {
    background: "rgba(245,235,111,0.29)",
    padding: "3px 0",
  },
  paragraph: {
    lineHeight: "1.6em",
    outline: "none",
    padding: "0.4em 0",
    fontSize: "15px",
    color: "#313649",
    letterSpacing: ".005em",
  },
};

const ParagraphOutput = ({ data, style, className }) => {
  if (!data) return <></>;
  if (!style || typeof style !== "object") style = {};

  const anchorStyle = { ...defaultStyle.anchor, ...style };
  const codeStyle = { ...defaultStyle.code, ...style };
  const italicsStyle = { ...defaultStyle.italics, ...style };
  const markStyle = { ...defaultStyle.mark, ...style };
  const paragraphStyle = { ...defaultStyle.paragraph, ...style };
  let content = null;

  if (typeof data === "string") {
    console.log("in if");
    content = data;
  } else if (
    typeof data === "object" &&
    data.text &&
    typeof data.text === "string"
  ) {
    console.log("inelse if");
    content = data.text;
  }

  const options = {
    replace: (domNode) => {
      if (domNode.type === "text") {
        return domNode.data;
      } else if (domNode.type === "tag") {
        if (domNode.name === "a") {
          return (
            <a style={anchorStyle} href={domNode.attribs.href}>
              {domToReact(domNode.children, options)}
            </a>
          );
        } else if (domNode.name === "code") {
          return (
            <code style={codeStyle}>
              {domToReact(domNode.children, options)}
            </code>
          );
        } else if (domNode.name === "i") {
          return (
            <i style={italicsStyle}>{domToReact(domNode.children, options)}</i>
          );
        } else if (domNode.name === "mark") {
          return (
            <mark style={markStyle}>
              {domToReact(domNode.children, options)}
            </mark>
          );
        } else return <></>;
      } else return <></>;
    },
  };

  return content ? (
    // <p style={paragraphStyle} className={className}>
    //   {parse(content)}
    // </p>
    <p style={paragraphStyle}>{parse(content, options)}</p>
  ) : (
    <></>
  );
};

export default ParagraphOutput;
