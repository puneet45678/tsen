import React, { useState, useRef, useEffect } from "react";
import ChevronDown from "../icons/ChevronDown";

const Dropdown = (props) => {
  const optionsRef = useRef();
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={optionsRef} className="relative h-fit">
      <div
        onClick={() => setShowOptions(!showOptions)}
        className="flex items-center justify-start gap-1 h-fit cursor-default"
      >
        <div className="h-full overflow-hidden font-medium">
          {props.value.label}
        </div>
        <div className="w-3 h-3">
          <ChevronDown width={4} />
        </div>
      </div>
      {showOptions && (
        <div className="absolute bg-white top-[100%] z-10 py-1 rounded-[5px] min-w-full w-fit shadow-[0_0_0_1px_#D9D9D9]">
          {props.options.map((option, index) => (
            <div
              key={index}
              className={`${
                option.value === props.value.value
                  ? "bg-primary-brand text-white"
                  : "hover:bg-[#D9D9D9]"
              } py-2 px-4 cursor-default`}
              onClick={() => {
                props.onChange(option);
                setShowOptions(false);
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default Dropdown;
