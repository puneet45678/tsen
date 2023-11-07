import Image from "next/image";
import Link from "next/link";
import React from "react";

const BreadCrumbsWithBackButton = (props) => {
  return (
    <div className="flex items-center gap-4">
      <Link
        href={props.backButtonLink}
        className="flex items-center justify-center bg-white h-9 w-9"
      >
        <Image src="/SVG/Arrow_Left.svg" height={18} width={18} />
      </Link>
      <div className="flex gap-1">
        {props?.items &&
          props.items.map((item, index) => {
            if (index === props.items.length - 1) {
              return (
                <div key={`breadcrumb-${index}`}>
                  <span className="text-primary-purple-600 font-medium">
                    {item.title}
                  </span>
                </div>
              );
            } else if (item.to) {
              return (
                <div key={`breadcrumb-${index}`} className="flex gap-1">
                  <Link
                    href={item.to}
                    className="text-dark-neutral-50 font-medium"
                  >
                    {item.title}
                  </Link>
                  <span className="text-light-neutral-700">{">"}</span>
                </div>
              );
            } else {
              return (
                <div key={`breadcrumb-${index}`} className="flex gap-1">
                  <div
                    onClick={item.onClick}
                    className="text-dark-neutral-50 font-medium"
                  >
                    {item.title}
                  </div>
                  <span className="text-light-neutral-700">{">"}</span>
                </div>
              );
            }
          })}
      </div>
    </div>
  );
};

export default BreadCrumbsWithBackButton;
