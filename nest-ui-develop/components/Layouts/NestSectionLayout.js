import React from "react";

const NestSectionLayout = ({ children }) => {
  return (
    <div className="w-full bg-white border-[1px] border-light-neutral-600 p-[32px] rounded-[10px] max-w-[1000px]">
      {children}
    </div>
  );
};

export default NestSectionLayout;
