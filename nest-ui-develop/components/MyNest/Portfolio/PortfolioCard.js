import Image from "next/image";
import React, { useState, useEffect } from "react";
import PortfolioCardLike from "../../../icons/PortfolioCardLike";
import PortfolioCardEye from "../../../icons/PortfolioCardEye";
import ThreeDotsVertical from "../../../icons/ThreeDotsVertical";
import { useSelector } from "react-redux";
import LikePortfolioDetailed from "../../../icons/LikePortfolioDetailed";
import SharePortfolioDetailed from "../../../icons/SharePortfolioDetailed";
import BookPortfolio from "../../../icons/BookPortfolio";
import parse from "html-react-parser";
import PortfolioDetailModal from "./PortfolioDetailModal";
import ReactPlayer from "react-player";
import moment from "moment";

const PortfolioCard = (props) => {


  console.log("----------------->",props)

  const [showDetialPortolioModal, setShowDetailPortolioModal] = useState(false);
  const [profilePicture, setProfilePicture] = useState("/images/profile.jpg");
  const user = useSelector((state) => state.user);
  const dateToday = moment.utc(new Date());
  const modelDate = moment.utc(props?.publish_date_time);
  const [updatedDate, setUpdatedDate] = useState(
    dateToday.diff(modelDate, "years") > 1
      ? `${dateToday.diff(modelDate, "years")} years`
      : dateToday.diff(modelDate, "years") == 1
      ? `${dateToday.diff(modelDate, "years")} year`
      : dateToday.diff(modelDate, "months") > 1
      ? `${dateToday.diff(modelDate, "months")} months`
      : dateToday.diff(modelDate, "months") == 1
      ? `${dateToday.diff(modelDate, "months")} month`
      : dateToday.diff(modelDate, "days") > 1
      ? `${dateToday.diff(modelDate, "days")} days`
      : dateToday.diff(modelDate, "days") == 1
      ? `${dateToday.diff(modelDate, "days")} day`
      : dateToday.diff(modelDate, "hours") > 1
      ? `${dateToday.diff(modelDate, "hours")} hours`
      : dateToday.diff(modelDate, "hours") == 1
      ? `${dateToday.diff(modelDate, "hours")} hour`
      : dateToday.diff(modelDate, "minutes") > 1
      ? `${dateToday.diff(modelDate, "minutes")} minutes`
      : dateToday.diff(modelDate, "minutes") == 1
      ? `${dateToday.diff(modelDate, "minutes")} minute`
      : 0
  );

  console.log("userDataPortfolio: ", user);

  const handleOpenPortfolioModal = () => {
    console.log("insideFuncModal: ", showDetialPortolioModal);
    setShowDetailPortolioModal(true);
  };

  useEffect(() => {
    setProfilePicture(
      user?.displayInformation?.profilePicture?.pictureUrl
        ? user.displayInformation.profilePicture.pictureUrl
        : ""
    );
  }, [user]);

  const handleClosePublishedModal = () => {
    setShowDetailPortolioModal(false);
    // router.push("/my-nest/portfolio");
  };
  // console.log("bannerImageUrl", bannerImageUrl);
  return (
    <>
      {showDetialPortolioModal ? (
        <PortfolioDetailModal
          setShowDetailPortolioModal={setShowDetailPortolioModal}
        >
          <div className="bg-white flex flex-col gap-[24px] px-[128px] h-fit max-h-full overflow-y-auto ">
            {/* <div className="flex gap-[50px]"> */}

            <div className="flex flex-col gap-[32px] ">
              <span className="text-dark-neutral-700 text-headline-md font-[700]">
                {props?.portfolioName}
              </span>
              <div className="grid grid-cols-2 gap-[50px] ">
                <div className="flex flex-col gap-[24px] mb-[32px]">
                  {props?.videoLinks.length > 0 ? (
                    <>
                      {props?.videoLinks?.map((video, index) => (
                        <>
                          <div
                            key={index}
                            className="rounded-md w-full aspect-[5/2]"
                          >
                            <ReactPlayer
                              url={video}
                              width={"800px"}
                              height={"496px"}
                              className="react-player rounded-[6px]"
                            />
                          </div>
                        </>
                      ))}
                    </>
                  ) : null}

                  {props?.bannerImageUrl.map((imageURL, index) => (
                    <>
                      <div key={index} className="relative w-full aspect-[5/3]">
                        <Image
                          src={imageURL.imageUrl}
                          alt="Model Image"
                          className="object-cover object-center"
                          width="912"
                          height="496"
                          // fill
                        />
                      </div>
                    </>
                  ))}
                </div>
                <div className="flex flex-col gap-[42px]">
                  <div className="flex gap-[20px]">
                    <div>
                      {profilePicture === "" ? (
                        <div>
                          <div className="mx-auto relative h-[64px] w-[64px] rounded-full bg-accent1"></div>
                        </div>
                      ) : (
                        <div className="mx-auto relative w-[64px] h-[64px]">
                          <Image
                            className="mx-auto text-white object-cover rounded-full h-[64px] w-[64px]"
                            alt="Profile Picture"
                            src={profilePicture}
                            fill
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-[]">
                      <span className="text-dark-neutral-50 font-[600] text-xl my-auto">
                        {" "}
                        @{user.username}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-[48px] w-full">
                    <div className="flex gap-[12px]">
                      <button className="px-[16px] w-[125px] h-[40px] py-[10px] bg-primary-purple-500 text-white rounded-[6px] flex">
                        <span className="m-auto flex gap-[6px] text-sm font-[600]">
                          <LikePortfolioDetailed /> Like
                        </span>
                      </button>
                      <button className="px-[16px] w-[125px] h-[40px] py-[10px] border-[1px] border-light-neutral-600 rounded-[6px] text-xs font-[600] text-dark-neutral-700 flex gap-[6px]">
                        <span className="m-auto flex gap-[6px] text-sm font-[600]">
                          <SharePortfolioDetailed /> Share
                        </span>
                      </button>
                    </div>
                    <div className="bg-white w-full pt-[16px] rounded-[10px] border-[1px] mb-[48px] border-light-neutral-600 ">
                      <div className="ml-[24px] flex gap-[12px] ">
                        <span>
                          <BookPortfolio />
                        </span>
                        <div className="flex flex-col gap-[16px]">
                          <span className="text-headline-2xs font-[600]">
                            Description
                          </span>
                        </div>
                      </div>
                      <div className="border-b-[1px] border-light-neutral-600 mt-[16px]"></div>
                      <div className="bg-light-neutral-50 h-fit py-[24px] px-[24px] text-dark-neutral-50 text-md font-[400]">
                        <p>{parse(props?.description)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* </div> */}
        </PortfolioDetailModal>
      ) : <></>}
      <div
        onClick={() => {
          handleOpenPortfolioModal();
          console.log("insideDivModal");
        }}
        className="flex flex-col rounded-[10px] shadow-xs cursor-pointer"
      >
        <div
          className={`relative w-full aspect-[7/5] rounded-t-[10px] overflow-hidden flex items-center justify-center`}
        >
          {(props?.NSFW && props?.coverImage) ? (
            <div className="w-full h-full nsfw-card blur-8"></div>
          ) : (
            <Image
              src={props?.coverImage}
              alt="Model Image"
              className="object-cover object-center"
              fill
            />
          )}

          {props?.NSFW && (
            <div className="absolute text-lg font-semibold text-white">
              MATURE CONTENT
            </div>
          )}
        </div>
        <div className="flex flex-col gap-[16px] border-[1px] border-light-neutral-600 rounded-b-[10px] px-4 pt-4 pb-6 text-dark-neutral-700">
          <h6 className="text-ellipsis overflow-hidden whitespace-nowrap font-semibold text-lg">
            {props?.portfolioName}
          </h6>
          <div className="flex items-center justify-start gap-3 bg-light-neutral-100 px-[16px] rounded-md">
            <div className="flex justify-between w-full px-[16px] py-[12px]">
              <span className="text-sm font-[400] text-dark-neutral-200 flex gap-[8px]">
                <span className="m-auto">
                  <PortfolioCardLike />
                </span>
                <div className="flex gap-[5px]">
                  <span className="text-dark-neutral-700 font-[600] text-sm my-auto">
                    {props?.likes}
                  </span>{" "}
                  <span className="text-dark-neutral-700 font-[600] text-sm my-auto">
                    Likes
                  </span>
                </div>
              </span>
              <span className="text-sm font-[400] text-dark-neutral-200 flex gap-[8px]">
                <span className="my-[5px]">
                  <PortfolioCardEye />
                </span>
                <div className="flex gap-[5px]">
                  <span className="text-dark-neutral-700 font-[600] text-sm my-auto">
                    {props?.views}
                  </span>{" "}
                  <span className="text-dark-neutral-700 font-[600] text-sm my-auto">
                    Views
                  </span>
                </div>
              </span>
            </div>
          </div>
          <div className="flex justify-between ">
            <div className="font-[500] text-xs text-dark-neutral-200">
              Published{" "}
              <span className="font-[300]">
                {/* <TimeAgo timestamp={props?.publish_date_time}/> */}
                {updatedDate} ago
              </span>
            </div>
            <span className="text-primary-purple-500 text-xl font-bold">
              <ThreeDotsVertical />
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
export default PortfolioCard;
