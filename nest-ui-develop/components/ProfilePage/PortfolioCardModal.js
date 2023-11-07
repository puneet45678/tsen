import React, { useState } from "react";
import ReactModal from "../Modals/Modal";
import CloseCross from "../../icons/CloseCross";
import Image from "next/image";
import LikeIcon from "../../icons/LikeIcon";
import UploadIcon from "../../icons/UploadIcon";
import ShareModal from "./ShareModal";
import InformationDropdownContainer from "../InformationDropdownContainer";
import Comments from "../Comments/Comments";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import Avatar from "../Avatar";


export default function PortfolioCardModal({ show, setShow, data,user }) {
  // useEffect Login here
  const currentUser = useSelector(state=> state.user)
  const [showShareModal, setShowShareModal] = useState(false);
  const router = useRouter()
  // console.log("Comments -Pdata------->",data)
  
  return (
    <>
      <ReactModal
        styles={{
          modal: {
            padding: "0px",
            margin: "0px",
            borderRadius: "10px",
            width: "508px",
          },
        }}
        open={showShareModal}
        closeIcon={
          <div className="h-6 w-6 outline-none">
            <CloseCross />
          </div>
        }
        onClose={() => setShowShareModal(false)}
        center
      >
        <ShareModal />
      </ReactModal>
      <ReactModal
        focusTrapped={false}
        styles={{
          modal: {
            padding: "0px",
            margin: "60px",
            marginBottom: "0px",
            marginTop: "72px",
            maxWidth: "none",
            width: "calc(100% - 120px)",
            maxheight:"100dvh"
            // height: "100%",
          },
        }}
        open={show}
        closeIcon={<div className="h-8 w-8 mt-[10px] me-[10px]">
            <CloseCross />
          </div>}
        onClose={() => {
          router.replace(window.location.toString().split("?")[0])
          setShow(false)
        }}
        center
      >
        <div style={{height:`${window.innerHeight - 72}px`}} className={`p-12 pb-0 overflow-y-hidden flex flex-col gap-8`}>
          {/*Title Top*/}
          <div className="text-[32px] leading-10 tracking-[-0.64px] font-bold">
            {data?.portfolioName}
          </div>
          <div className="flex flex-grow overflow-y-hidden">
            {/*Images Section Scrollable*/}
            <div className="w-[50%] flex items-center gap-6 flex-col pb-12 overflow-y-scroll no-scrollbar">
              {data?.videoLinks?.map((e, i) => (
                <iframe 
                  key={"ModalImageInTheModalKeyVideo" + i}
                  src={e}
                  className="rounded-[10px] aspect-[912/496] h-[496px] w-full"
                  alt="preview Model"
              />
              ))}
              {data?.portfolioImages?.map((e, i) => (
                <Image
                  key={"ModalImageInTheModalKey" + i}
                  className="rounded-[10px] aspect-[912/496] h-[496px] w-full"
                  height={496}
                  width={912}
                  src={e.imageUrl}
                  alt="preview Model"
                />
              ))}
            </div>

            {/*Profile and comments*/}
            <div className="flex-grow pl-12 flex flex-col overflow-y-scroll no-scrollbar">
              {/*Profile likes and share*/}
              <div className="flex flex-col gap-[42px]">
                {/* Artist Info */}
                <div className="flex">
                  <div className="flex items-end">
                    <Avatar
                      className=" rounded-full aspect-square border-4 border-white"
                      width={64}
                      height={64}
                      size="lg"
                      src={
                        user?.displayInformation?.profilePicture?.croppedPictureUrl ||
                        null
                      }
                      alt="Profile Pic"
                    />
                  </div>
                  <div className="flex flex-col justify-end px-5">
                    <div className="text-xl font-semibold">
                      {user?.accountInformation?.fullName || "--------"}
                    </div>
                    <div>
                      <p className="text-lg font-medium text-dark-neutral-50">
                        {"@" + user?.email || "-------@---.---"}
                      </p>
                    </div>
                  </div>
                </div>
                {/* Buttons */}
                <div className="flex gap-3">
                  {/*Like Button*/}
                  <div className="gap-[6px] button-default w-auto button-md-1 hover:cursor-pointer">
                    <div className="h-[18px] w-[18px]">
                      <LikeIcon />
                    </div>
                    <div className="text-sm font-semibold">Likes</div>
                    <div className="text-sm text-dark-neutral-50 font-semibold">
                      {data?.likes}
                    </div>
                  </div>
                  {/* Share button */}
                  <div
                    className="gap-[6px] button-default w-auto button-md-1 hover:cursor-pointer"
                    onClick={() => setShowShareModal(true)}
                  >
                    <div className="h-[18px] w-[18px]">
                      <UploadIcon />
                    </div>
                    <div className="text-sm font-semibold">Share</div>
                  </div>
                </div>
              </div>
              {/*Description*/}
              <div className="my-12">
                {/* <StoryDescription story={data?.description}  /> */}
                <InformationDropdownContainer
                  droppable={false}
                  heading="Description"
                  icon="/SVG/Document_3.svg"
                  openDefault={true}
                >
                  <div
                    className="prose text-md prose-headings:m-0 space-x-0 space-y-0 whitespace-pre-wrap model_Description_DropDown_Inner_Rich_Text_Styling"
                    style={{ width: "100%" }}
                    dangerouslySetInnerHTML={{__html:data?.description}}
                    >
                    {/* {data?.description} */}
                    {/* {parse(model?.description ? model.description : "")} */}
                  </div>
                </InformationDropdownContainer>
              </div>
              {/*Comments*/}
              <div className="flex flex-col gap-6">
                <h4 className="text-[28px] leading-[38px] tracking-[-0.28px] font-semibold">
                  Comments
                </h4>
                <Comments service="portfolio" serviceInstanceId={data._id} user={currentUser} comments={data.comments} />
              </div>
            </div>
          </div>
        </div>
      </ReactModal>
    </>
  );
}
