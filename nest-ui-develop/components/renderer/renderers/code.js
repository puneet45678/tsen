const supportedKeys = ["container", "code"];

const defaultStyle = {
  container: {
    width: "100%",
    minHeight: "200px",
    color: "#41314e",
    lineHeight: "1.6em",
    fontSize: "12px",
    background: "#f8f7fa",
    border: "1px solid #f1f1f4",
    resize: "vertical",
    borderRadius: "3px",
    padding: "10px 12px",
    boxSizing: "border-box",
    overflow: "auto",
  },
  code: {},
};

const CodeOutput = ({ data, style, classNames }) => {
  if (!style || typeof style !== "object") style = {};
  if (!classNames || typeof classNames !== "object") classNames = {};

  supportedKeys.forEach((key) => {
    if (!style[key] || typeof style[key] !== "object") style[key] = {};
    if (!classNames[key] || typeof classNames[key] !== "string")
      classNames[key] = "";
  });

  if (!data || !data.code || typeof data.code != "string") return <></>;
  const codeStyle = { ...defaultStyle.code, ...style.code };

  return (
    <pre style={defaultStyle.container} className={classNames.container}>
      <code style={codeStyle} className={`${classNames.code}`}>
        {data.code}
      </code>
    </pre>
  );
};

export default CodeOutput;
