import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from 'react-redux';


const SubHeader = (props) => {
  const aboutDetails = useSelector((state) => state.campaign.basics.about);

  const router = useRouter();
  const { campaignId } = router.query;
  const { section } = router.query;
  const [currentModel, setCurrentModel] = useState("Account");
  const [sliderWidth, setSliderWidth] = useState(0);
  const [selectedElem, setSelectedElem] = useState(0);

  const slide = (e) => {
    const elem = document.getElementById(e.target.id);
    console.log("element", elem);
    setSelectedElem(elem.getAttribute("name"));
    setSliderWidth(Math.round(elem.offsetWidth + 0.1 * elem.offsetWidth));

  };

  useEffect(() => {
    console.log("sliderWidth", sliderWidth);
  }, [sliderWidth]);

  const warningHandler = (item, to) => {
    if (props.save === false) {
      props.setAlert(true);
      alert(
        "You Have Some Unsaved Changes, Please Save Them To Avoid Data Loss !!!"
      );
    } else {
      setCurrentModel(item.set);
      props.setCompo(item.set);
      props.setAlert(false);
      // slide(e)
      router.push(to);
    }
  };

  return (
    <div className={`font-montserrat w-full text-gray-500 bg-accent2 fixed top-[3.75rem] md:h-24 z-20 px-6 md:px-12 pt-8`}>
      {/*inline css has been used to facilitate usage of dynamic classes which do not work in the desired manner with tailwind css*/}
      <div className="relative w-full">
        <div className="flex flex-wrap mb-6">
          {props.items.map((item, index) => (
            <div className="mr-12 pl-2" key={item.set} id={item.set}>
              <span
                className={`${(selectedElem == index && props.alert === false) && section == item.set
                  ? "text-primary-brand"
                  : ""
                  } cursor-pointer text-sm lg:text-base xl:text-[1.15]`}
                name={index}
                id={item.set + "Span"}
                onClick={(e) => {
                  warningHandler(item, item.to);
                  slide(e);
                }}
              >
                {item.title}
              </span>
            </div>
          ))}

          <div className="ml-auto hidden md:block overflow-x-hidden w-[20%]">
            <div className="text-sm flex w-max">

              {/* <span> Campaign - </span> */}
              {(aboutDetails && (aboutDetails.title === undefined || aboutDetails.title === "")) ? <span> Campaign - </span> : <span title={aboutDetails.title}>{aboutDetails.title.substr(0, 10)} . . - </span>}

              <div className=" text-sm ml-1">
                {campaignId}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div >
  );
};

export default SubHeader;
