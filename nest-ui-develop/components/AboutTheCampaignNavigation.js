import { useRouter } from "next/router";
import { useRef, useState } from "react";

const AboutTheCampaignNavigation = ({ campaignId, items, section }) => {
  const [sliderWidth, setSliderWidth] = useState();
  const [sliderLeft, setSliderLeft] = useState(0);
  const navigationRef = useRef();
  const router = useRouter();

  const slide = (index, to) => {
    const navigationElement = navigationRef.current.children[index];
    if (navigationElement.id === section) return;
    setSliderWidth(Math.round(navigationElement.offsetWidth - 10));
    setSliderLeft(navigationElement.offsetLeft);
    router.push(to);
  };

  return (
    <ul
      className="flex sticky top-[60px] bg-accent2 z-20 my-5 font-medium py-3"
      ref={navigationRef}
    >
      {items.map((item, index) => {
        return (
          <li
            key={`about-the-campaign-navigation-${item.id}-${index}`}
            className={`${section === item.id
              ? "text-primary-brand"
              : "text-secondary-text-icons-button-text"
              } cursor-pointer px-2 xs:px-3 sm:px-2 md:px-5`}
            id={item.id}
            onClick={() => slide(index, item.to)}
          >
            {item.title}
          </li>

        );
      })}
      <div
        style={{
          width: "" + (sliderWidth > 0 ? sliderWidth + 10 : sliderWidth) + "px",
          left: sliderLeft + "px",
        }}
        className={`transition-all ease-linear duration-300 top-7 absolute border-b-[3px] border-primary-brand bottom-2`}
      ></div>
    </ul>
  );
};
export default AboutTheCampaignNavigation;
