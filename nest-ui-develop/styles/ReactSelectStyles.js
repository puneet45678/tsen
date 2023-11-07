export const select = (size, inputState) => {
  return {
    control: (styles, state) => ({
      alignItems: "center",
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-between",
      position: "relative",
      transition: "all 100ms",
      backgroundColor: "#FAFBFC",
      boxSizing: "border-box",
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor:
        inputState === "disabled"
          ? "#E5E5E7"
          : inputState === "error"
          ? "#E33B32"
          : state.isFocused
          ? "#5558DA"
          : "#E5E5E7",
      borderRadius: "5px",
      padding:
        size === "lg" ? "0px 16px" : size === "md" ? "0px 16px" : "0px 16px",
      height: size === "lg" ? "52px" : size === "md" ? "48px" : "42px",
      width: "100%",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      boxShadow:
        inputState === "error" && state.isFocused
          ? "0px 0px 0px 3px #FDDDDC"
          : inputState === "no-error" && state.isFocused
          ? "0px 0px 0px 3px #CCCEF5"
          : "",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    multiValue: (styles) => {
      return {
        ...styles,
        backgroundColor: "#EBECFB",
        borderRadius: "4px",
      };
    },
    multiValueLabel: (styles) => ({
      ...styles,
      color: "#4F4ECF",
      fontWeight: "500",
      fontSize: size === "lg" ? "15px" : "14px",
      lineHeight: size === "lg" ? "22px" : "20px",
      letterSpacing: "-0.1px",
    }),
    multiValueRemove: (styles) => ({
      ...styles,
      color: "#4F4ECF",
      ":hover": {
        color: "red",
      },
    }),
    option: (styles) => ({
      ...styles,
      padding: "5px 12px",
    }),
    placeholder: (styles, state) => ({
      ...styles,
      color: state.isDisabled ? "#E5E5E7" : "#A1A4AC",
      fontSize: "15px",
      fontStyle: "normal",
      fontWeight: "500",
      lineHeight: "22px",
      letterSpacing: "-0.1px",
    }),
    singleValue: (styles) => ({
      ...styles,
      color:
        inputState === "disabled"
          ? "#E5E5E7"
          : inputState === "error"
          ? "#E33B32"
          : "#323539",
      fontWeight: "500",
      fontSize: size === "lg" ? "15px" : "14px",
      lineHeight: size === "lg" ? "22px" : "20px",
      letterSpacing: "-0.1px",
    }),
    valueContainer: (styles) => ({
      ...styles,
      padding: "0px",
    }),
  };
};
