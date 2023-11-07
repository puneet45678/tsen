const supportedKeys = ["h1", "h2", "h3", "h4", "h5", "h6"];

const defaultStyle = {
  h1: {
    display: "block",
    fontSize: "2em",
    marginTop: "0.67em",
    marginBottom: "0.67em",
    marginLeft: "0",
    marginRight: "0",
    fontWeight: "bold",
  },
  h2: {
    display: "block",
    fontSize: "1.5em",
    marginTop: "0.83em",
    marginBottom: "0.83em",
    marginLeft: "0",
    marginRight: "0",
    fontWeight: "bold",
  },
  h3: {
    display: "block",
    fontSize: "1.17em",
    marginTop: "1em",
    marginBottom: "1em",
    marginLeft: "0",
    marginRight: "0",
    fontWeight: "bold",
  },
  h4: {
    display: "block",
    fontSize: "1em",
    marginTop: "1.33em",
    marginBottom: "1.33em",
    marginLeft: "0",
    marginRight: "0",
    fontWeight: "bold",
  },
  h5: {
    display: "block",
    fontSize: ".83em",
    marginTop: "1.67em",
    marginBottom: "1.67em",
    marginLeft: "0",
    marginRight: "0",
    fontWeight: "bold",
  },
  h6: {
    display: "block",
    fontSize: ".67em",
    marginTop: "2.33em",
    marginBottom: "2.33em",
    marginLeft: "0",
    marginRight: "0",
    fontWeight: "bold",
  },
};

const HeaderOutput = ({ data, style, classNames }) => {
  if (
    !data ||
    !data.text ||
    typeof data.text != "string" ||
    data.level < 1 ||
    data.level > 6
  )
    return <></>;
  if (!style || typeof style !== "object") style = {};
  if (!classNames || typeof classNames !== "string") classNames = {};

  supportedKeys.forEach((key) => {
    if (!style[key] || typeof style[key] !== "object") style[key] = {};
    if (!classNames[key] || typeof classNames[key] !== "string")
      classNames[key] = "";
  });

  const h1Style = { ...defaultStyle.h1, ...style.h1 };
  const h2Style = { ...defaultStyle.h2, ...style.h2 };
  const h3Style = { ...defaultStyle.h3, ...style.h3 };
  const h4Style = { ...defaultStyle.h4, ...style.h4 };
  const h5Style = { ...defaultStyle.h5, ...style.h5 };
  const h6Style = { ...defaultStyle.h6, ...style.h6 };

  switch (data.level) {
    case 1:
      return (
        <h1 style={h1Style} className={classNames.h1}>
          {data.text}
        </h1>
      );
    case 2:
      return (
        <h2 style={h2Style} className={classNames.h2}>
          {data.text}
        </h2>
      );
    case 3:
      return (
        <h3 style={h3Style} className={classNames.h3}>
          {data.text}
        </h3>
      );
    case 4:
      return (
        <h4 style={h4Style} className={classNames.h4}>
          {data.text}
        </h4>
      );
    case 5:
      return (
        <h5 style={h5Style} className={classNames.h5}>
          {data.text}
        </h5>
      );
    case 6:
      return (
        <h6 style={h6Style} className={classNames.h6}>
          {data.text}
        </h6>
      );
    default:
      return (
        <h4 style={h4Style} className={classNames.h4}>
          {data.text}
        </h4>
      );
  }
};

export default HeaderOutput;
