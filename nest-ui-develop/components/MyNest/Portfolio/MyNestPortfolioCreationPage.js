import React, { useState, useEffect } from "react";
import NestSectionLayout from "../../Layouts/NestSectionLayout";
import dynamic from "next/dynamic";
import BreadCrumbs from "../../BreadCrumbs";
const QuillEditor = dynamic(() => import("../../QuillEditor"), {
  ssr: false,
});
import FurtherContentRightArrow from "../../../icons/FurtherContentRightArrow";
import ExternalLink from "../../../icons/ExternalLink";
import ImageGallery from "../../Image/ImageGallery";
import UploadGlbFile from "../../UploadGlbFile";
import ReactPlayer from "react-player";
import PortfolioCreationCancelModal from "./PortfolioCreationCancelModal";
import axios from "axios";
import ModalCenter from "../../ModalCenter";
import { useRouter } from "next/router";
import ModalCenterCross from "../../../icons/ModalCenterCross";
const breadCrumbsData = [
  {
    title: "My Models",
    to: "/my-nest/models",
  },
  {
    title: "New Model",
    to: "/my-nest/models/upload",
  },
];
import Image from "next/image";

const MyNestPortfolioCreationPage = () => {
  const [portfolioName, setPortfolioName] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState("");
  const [videoLinkList, setVideoLinkList] = useState([]);
  const [videoChange, setVideoChange] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const router = useRouter();
  const [showPublishModal, setShowPublishModal] = useState(false);
  //Image Upload
  const [pictures, setPictures] = useState([]);
  const [coverImage, setCoverImage] = useState();
  const [pageChanges, setPageChanges] = useState(false);
  const [videoLinkChanges, setVideoLinkChanges] = useState(false);
  const [fileFormatError, setFileFormatError] = useState(false);

  const uploadImageToBackend = (formData, index) => {
    // const isValidFormat = formData.name.endsWith('.glb');
    // setFileFormatError(!isValidFormat);
    // if (isValidFormat) {
    //   // Your upload logic here
    //   console.log('File uploaded successfully');
    // }
    const config = {
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    };
    const url_query = router.query.sections;
    const portfolio_id = url_query[1];
    //1 works
    axios
      .post(
        `${process.env.NEXT_PUBLIC_USER_SERVICE_URL}/api/v1/portfolio/${portfolio_id}/image`,
        formData,
        config
      )
      .then((res) => {
        console.log("Resss123", res);
        setPictures((current) => {
          return [
            ...current.slice(0, index),
            { imageUrl: res.data.imageUrl, imageId: res.data.imageId },
            ...current.slice(index + 1),
          ];
        });
      })
      .catch((err) => {
        console.log("err", err);
        console.log("error index", index);
        setPictures((current) => {
          return [
            ...current.slice(0, index),
            {
              // imageUrl: res.data.imageUrl,
              // imageId: res.data.imageId,
              status: "error",
            },
            ...current.slice(index + 1),
          ];
        });
      });
  };

  const handleUseAsCoverPhoto = (imageUrl) => {
    // TODO add axios call
    console.log("imageurl!!!!!!!!!!", imageUrl);
    console.log("checkkkk", router.query.sections);
    const url_query = router.query.sections;
    // console.log(router.query.)
    console.log("url_query---------", url_query);
    const parts = imageUrl.split("/");

    // The last part of the URL should be the identifier you want
    const identifier = parts[parts.length - 2];
    console.log(parts);
    console.log("identifierrrrrrrrrr", identifier);
    const portfolio_id = url_query[1];
    console.log(portfolio_id);

    //2 - done-works
    axios
      .put(
        `${process.env.NEXT_PUBLIC_USER_SERVICE_URL}/api/v1/portfolio/${portfolio_id}/cover-image?imageId=${identifier}`,

        {},
        { withCredentials: true }
      )
      .then((res) => {
        console.log("ressss", res);
        // dispatch(changeCoverImage(imageUrl));
        setCoverImage(imageUrl);
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const deleteImage = (uuid) => {
    // TODO add axios call
    // setPictures((current) => {console.log("current",current); return current.filter((picture) => {console.log("picture", picture, "uuid", uuid); return picture.imageId !== uuid})});
    const url_query = router.query.sections;
    const portfolio_id = url_query[1];
    //3 works-done
    axios
      .delete(
        `${process.env.NEXT_PUBLIC_USER_SERVICE_URL}/api/v1/portfolio/${portfolio_id}/image/${uuid}`,

        { withCredentials: true }
      )
      .then((res) => {
        console.log("result==> ", res);
        // console.log("index", index);
        setPictures((current) =>
          current.filter((picture) => picture.imageId !== uuid)
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // console.log("RouterQuery: ",router.query.sections)

  const handleVideoLinkDisplay = (video_link) => {
    console.log("inside_handleVideoLinkDisplay");
    let array = videoLinkList;
    // console.log("array=> ",array)
    setVideoLinkList((array) => [...array, video_link]);
  };

  // useEffect(()=>{
  //   handleVideoLinkDisplay(video);
  // },[videoChange])

  const handlePublishPortfolio = () => {
    if (portfolioName === "" || description === "" || pictures.length === 0) {
      setPageChanges(false);
      alert("You haven't filled all the necessary information");
    } else {
      const payload = {
        portfolioName: portfolioName,
        description: description,
        videoLinks: videoLinkList,
      };

      const url_query = router.query.sections;
      const portfolio_id = url_query[1];
      //4 works-done
      axios
        .put(
          `${process.env.NEXT_PUBLIC_USER_SERVICE_URL}/api/v1/portfolio/${portfolio_id}`, //works!

          payload,
          { withCredentials: true }
        )
        .then((response) => {
          console.log(response);
          setShowPublishModal(true);
          // router.push("/my-nest/portfolio")
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const handleClosePublishedModal = () => {
    setShowPublishModal(false);
    router.push("/my-nest/portfolio");
  };

  const handleDiscradProject = () => {
    const url_query = router.query.sections;
    const portfolio_id = url_query[1];

    //5 works-done
    console.log("deleted the portfolio0ooooooooooo:", url_query);
    axios
      .delete(
        `${process.env.NEXT_PUBLIC_USER_SERVICE_URL}/api/v1/portfolio/${portfolio_id}`,

        { withCredentials: true }
      )
      .then((response) => {
        console.log("my response cancels!!!!!!", response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      {showCancelModal ? (
        <>
          <PortfolioCreationCancelModal
            closeModal={() => setShowCancelModal(false)}
            cancelHandler={() => {
              handleDiscradProject();
              router.push("/my-nest/portfolio");
            }}
            continueEditingHandler={() => {
              setShowCancelModal(false);
            }}
          />
        </>
      ) : null}

      {showPublishModal ? (
        <>
          {/* {console.log("ModalPublishBool: ",showPublishModal)} */}
          <ModalCenter>
            <div className="w-[624px] h-[460px] bg-white rounded-[10px]">
              <div className="flex flex-col gap-[24px]">
                <button
                  onClick={() => {
                    handleClosePublishedModal();
                  }}
                  className="ml-[584px] mt-[16px]"
                >
                  <ModalCenterCross />
                </button>
                <div className="flex flex-col gap-[32px] items-center">
                  {/* <div className="my-auto"> */}

                  <div className="flex flex-col gap-[6px]">
                    <div className="rounded-[10px]">
                      <Image src={coverImage} width={200} height={150} />
                    </div>
                    <span className="text-dark-neutral-700 text-lg font-[500] mx-auto">
                      {portfolioName}
                    </span>
                  </div>

                  {/* </div> */}

                  <div className="flex flex-col gap-[12px]">
                    <span className="text-dark-neutral-700 text-headline-xs font-[600]">
                      Congrats! You published your project
                    </span>
                    <span className="mx-auto text-md font-[500] text-dark-neutral-50">
                      See how your artwork page looks like
                    </span>
                  </div>

                  <div className="flex gap-[16px]">
                    <button className="rounded-[6px] bg-white px-[16px] py-[10px] border-[1px] border-light-neutral-600">
                      Share Project
                    </button>
                    <button className="rounded-[6px] bg-primary-purple-500 px-[16px] py-[10px] text-white">
                      View Public Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </ModalCenter>
        </>
      ) : null}

      <div className="h-full overflow-y-auto">
        <div className="flex flex-col bg-light-neutral-50 px-8 py-9">
          <div className="flex items-center justify-between">
            <div className="flex gap-2 text-headline-xs ">
              {/* TODO Change with breadcrumbs component */}
              <span className="text-dark-neutral-50 font-[600]">
                Manage Your Portfolio
              </span>
              <span className="text-light-neutral-700 text-headline-xs">
                {">"}
              </span>
              <span className="text-primary-purple-600 font-[600]">
                New Project
              </span>
            </div>
            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="flex gap-[6px]">
                <span>Preview</span>
                <ExternalLink />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="px-[16px] py-[10px] border-[1px] border-light-neutral-600 bg-white rounded-[5px] shadow-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handlePublishPortfolio();
                  }}
                  className={`${
                    pageChanges
                      ? "bg-primary-purple-500"
                      : "bg-light-neutral-600"
                  } px-[16px] py-[10px] text-white font-[600]  rounded-[5px]`}
                >
                  Publish
                </button>
              </div>
            </div>
          </div>
          <div className="border-b-2 border-light-neutral-500 mt-[30px]"></div>

          <div className="flex flex-col items-center justify-center gap-6 mt-[32px]">
            <NestSectionLayout>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-[6px] text-sm ">
                  <label
                    htmlFor="projectName"
                    className="font-[500] text-sm text-dark-neutral-700"
                  >
                    Project name*
                  </label>
                  <input
                    type="text"
                    id="projectName"
                    placeholder="Write a clear, brief title here"
                    className="border-[1px] border-light-neutral-700 bg-light-neutral-50 py-3 px-4 rounded-[5px] outline-none"
                    value={portfolioName}
                    onChange={(event) => {
                      setPortfolioName(event.target.value);
                      if (!pageChanges) setPageChanges(true);
                    }}
                  />
                </div>
                <div className="flex flex-col gap-[6px] text-sm ">
                  <label className="font-[500]">Description*</label>
                  <div className="bg-light-neutral-50 ">
                    <QuillEditor
                      value={description}
                      // style={{ Color: " red"}}

                      onChange={(value) => {
                        setDescription(value);
                        if (!pageChanges) setPageChanges(true);
                      }}
                      placeholder="Write a few words that describe your project"
                      // maxLength={20000}
                    />
                  </div>
                </div>
              </div>
            </NestSectionLayout>

            {/* <NestSectionLayout>
              <div className="flex flex-col gap-6 ">
                <div className="flex flex-col gap-[6px] text-sm ">
                  <label className="font-[500] text-md text-dark-neutral-700">
                    Upload GLBs {"(optional)"}
                  </label>
                  <div><UploadFile uploadFileToBackend={uploadImageToBackend} fileExtesions={["glb"]} /></div>
                </div>
              </div>
            </NestSectionLayout> */}
            <NestSectionLayout>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-[6px] text-sm">
                  {/* <label className="font-[500] text-md text-dark-neutral-700">
                    Upload GLBs {"(optional)"}
                  </label> */}
                  <div>
                    <UploadGlbFile
                      uploadFileToBackend={uploadImageToBackend}
                      fileExtesions={["glb"]}
                    />
                    {/* error msg */}
                    {fileFormatError && (
                      <p className="text-red-500 text-sm">
                        Invalid file format. Please upload a GLB file.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </NestSectionLayout>

            <NestSectionLayout>
              <div className="flex flex-col gap-6 ">
                <div className="flex flex-col gap-[6px] text-sm">
                  {/* <label className="font-[500] text-md text-dark-neutral-700  ">
                    Upload Images*
                  </label> */}
                  <div className="">
                    {/* {console.log("coverImage", coverImage)} */}
                    {/* {TODO: Integrate PortfolioCreation Backend} */}
                    <ImageGallery
                      pictures={pictures}
                      setPictures={(newPictures) => {
                        setPictures(newPictures);
                      }}
                      uploadImageToBackend={uploadImageToBackend}
                      coverImage={coverImage}
                      handleUseAsCoverPhoto={handleUseAsCoverPhoto}
                      deleteImage={deleteImage}
                      // handleImageCrop={handleImageCrop}
                      // aspectRatio={5 / 3}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-[6px] text-sm">
                  <label
                    htmlFor="videoLink"
                    className="font-[500] text-sm text-dark-neutral-700 font-sans"
                  >
                    Video links (optional)
                  </label>
                  <div className="border-[1px] border-light-neutral-700 rounded-[5px] bg-light-neutral-50 flex justify-between h-[48px] shadow-xs">
                    <input
                      type="text"
                      id="videoLink"
                      placeholder="Add video links that describes your project."
                      className="py-3 px-4 rounded-[5px] w-full basis-[80%] bg-light-neutral-50 outline-none"
                      value={video}
                      onChange={(event) => {
                        setVideo(event.target.value);
                        if (!videoLinkChanges) setVideoLinkChanges(true);
                        console.log("pageChanges", pageChanges);
                      }}
                    />
                    {console.log("videos: ", video)}
                    <div className="m-[8px]">
                      <button
                        onClick={() => {
                          handleVideoLinkDisplay(video);
                          console.log("Inside_videoLink");
                        }}
                        className={`${
                          videoLinkChanges
                            ? "bg-primary-purple-500"
                            : "bg-light-neutral-600"
                        } px-[12px] py-[6px] text-white font-[600] rounded-[5px]`}
                      >
                        + Add link
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-[16px] mt-[24px]">
                    {videoLinkList.map((videoLink, index) => (
                      // <div className="w-[20px]" key={index}>

                      <div key={index} className="rounded-md w-fit p-0 m-0">
                        <ReactPlayer
                          url={videoLink}
                          width={"300px"}
                          height={"180px"}
                          className="react-player rounded-[6px]"
                        />
                      </div>

                      // </div>
                    ))}
                  </div>
                </div>
              </div>
            </NestSectionLayout>
          </div>
        </div>
      </div>
    </>
  );
};
export default MyNestPortfolioCreationPage;
