import React from "react";

const AccountDeletionRadioInput = ({
  title,
  value,
  id,
  onChange,
  comment,
  setComment,
}) => {
  if (value === "other") {
    return (
      <span>
        <fieldset className="flex items-end">
          <input
            type="radio"
            id={id}
            name="issueType"
            value="OTHER"
            className="mr-3 radio-circle w-6 h-6 radio-select radio-select-checked radio-select:checked mt-4"
            onChange={onChange}
          />
          <label htmlFor={id}>{value}</label>
        </fieldset>
        <textarea
          className="bg-white w-[584px] h-[100px] mt-[40px] block input-lg input-no-error border-[1px] border-light-neutral-700 shadow-xs  placeholder:text-light-neutral-900 placeholder:text-sm placeholder:font-medium pl-[16px] pt-[8px] resize-none"
          placeholder="Share more details about this"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
        />
      </span>
    );
  } else {
    return (
      <>
        <input
          type="radio"
          id={id}
          name="issueType"
          value={value}
          className="mr-3 radio-circle w-6 h-6 radio-select radio-select-checked radio-select:checked mt-4"
          onChange={onChange}
        />
        <label htmlFor={id} className=" ">
          {title}
        </label>
      </>
    );
  }
};

export default AccountDeletionRadioInput;
