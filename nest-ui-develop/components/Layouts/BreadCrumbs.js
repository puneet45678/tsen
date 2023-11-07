import Link from "next/link";
import React from "react";
import ChevronRight from "../../icons/Chevron_Right";

const BreadCrumbs = (props) => {
  return (
    <div className="flex gap-1">
      {props?.items &&
        props.items.map((item, index) => {
          if (index === props.items.length - 1) {
            return (
              <div key={`breadcrumb-${index}`}>
                <span className="text-primary-purple-600 text-md font-medium cursor-default">
                  {item.title}
                </span>
              </div>
            );
          } else if (item.to) {
            return (
              <div key={`breadcrumb-${index}`} className="flex gap-1">
                <Link
                  href={item.to}
                  className="text-dark-neutral-50 text-md font-medium"
                >
                  {item.title}
                </Link>
                <div className="h-5 w-5 aspect-square text-light-neutral-700">
                  <ChevronRight />
                </div>
              </div>
            );
          } else {
            return (
              <div key={`breadcrumb-${index}`} className="flex gap-1">
                <div
                  onClick={item.onClick}
                  className="text-dark-neutral-50 text-md font-medium"
                >
                  {item.title}
                </div>
                <div className="h-5 w-5 aspect-square text-light-neutral-700">
                  <ChevronRight />
                </div>
              </div>
            );
          }
        })}
    </div>
  );
};

export default BreadCrumbs;
