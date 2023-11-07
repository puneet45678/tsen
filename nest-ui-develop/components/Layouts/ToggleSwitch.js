import React, { useState, useEffect } from "react";

const ToggleSwitch = ({ value, initialValue, onChange }) => {
  const [toggleValue, setToggleValue] = useState(
    initialValue ? initialValue : false
  );

  const handleToggle = () => {
    const newValue = !toggleValue;
    setToggleValue(newValue);
    onChange(newValue);
  };

  useEffect(() => {
    setToggleValue(value);
  }, [value]);

  return (
    <div
      className={`h-[20px] w-[34px] rounded-[20px] p-[2px] cursor-pointer ${
        toggleValue ? "bg-primary-purple-500" : "bg-light-neutral-700"
      }`}
      onClick={handleToggle}
    >
      <div className="w-full h-full relative">
        <div
          className={`absolute w-full h-full transition-all duration-300 ease-in-out bg-transparent ${
            toggleValue ? "translate-x-full" : ""
          }`}
        >
          <div
            className={`rounded-full h-full aspect-square transition-all duration-300 ease-in-out bg-white ${
              toggleValue ? "-translate-x-full" : ""
            }`}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ToggleSwitch;
