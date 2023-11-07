import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
const SubHeaderMyCampaigns = (props) => {
    const router = useRouter();
    const [sliderWidth, setSliderWidth] = useState(0);
    const [sliderLeft, setSliderLeft] = useState(0);

    const subHeaderRef = useRef();

    const slide = (route) => {
        router.push(`/my-campaigns/${props.username}/${route}`)
    };

    // useEffect(() => {
    //   if (subHeaderRef.current.children.length > 0) {
    //     // const firstSubHeaderElement = subHeaderRef.current.children[0];
    //     let firstSubHeaderElement = undefined;
    //     for (let child of subHeaderRef.current.children) {
    //       if (child.id === props.page) {
    //         firstSubHeaderElement = child;
    //         break;
    //       }
    //     }
    //     setSliderWidth(Math.round(firstSubHeaderElement.offsetWidth - 10));
    //     setSliderLeft(firstSubHeaderElement.offsetLeft);
    //   }
    // }, [subHeaderRef.current?.children]);

    return (
        <div className="flex justify-between sticky top-[60px] w-full bg-accent2 items-center font-medium pl-3 xs:pl-10 sm:pl-1 md:pl-10 pt-5 pb-2 z-30">
            <ul className="flex" id="subHeader" ref={subHeaderRef}>
                {props.data.map((item, index) => (
                    <li
                        key={index}
                        className={`cursor-pointer w-max px-2 xs:px-3 sm:px-2 md:px-5 ${props.section === item.id ? "text-primary-brand" : ""
                            }`}
                        id={item.id}
                        onClick={() => slide(item.id)}
                    >
                        <span className="hidden sm:flex">{item.title}</span>
                        <span className="flex sm:hidden">{item.icon}</span>
                    </li>
                ))}
                <li
                    style={{
                        width:
                            "" + (sliderWidth > 0 ? sliderWidth + 10 : sliderWidth) + "px",
                        left: sliderLeft + "px",
                    }}
                    className={`transition-all ease-linear duration-300 top-7 absolute border-b-[3px] border-primary-brand bottom-0`}
                ></li>
            </ul>

        </div>
    );
};

export default SubHeaderMyCampaigns;
