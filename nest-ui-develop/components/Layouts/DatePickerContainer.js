import React from "react";
import DatePicker from "react-datepicker";

const DatePickerContainer = (props) => {
  const handleOnBlur = () => {
    console.log("handleOnBlur");
  };
  return (
    <DatePicker
      id={props.id}
      selected={props.value}
      onChange={props.onChange}
      placeholderText="dd/mm/yyyy"
      dateFormat="dd/MM/yyyy"
      className="w-full h-full focus:outline-none bg-transparent"
      fixedHeight
      onBlur={handleOnBlur}
    />
  );
};

export default DatePickerContainer;
