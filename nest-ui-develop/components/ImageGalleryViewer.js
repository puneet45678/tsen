import React, { useState, useEffect } from "react";
import ImageCard from "./ImageCard";
// import addPhotos from "../public/images/add photos.png";
import Image from "next/image";
import axios from "axios";

const ImagesGalleryViewer = (props) => {
  // useEffect(() => {
  //   console.log("in image url useEffect", props.imagesUrl);
  // }, []);

  const [showCrop, setShowCrop] = useState(false);
  const [responseAlert, setResponseAlert] = useState(false);
  const [indexToRemove, setIndexToRemove] = useState(null);
  const [removingImageDp, setRemovingImageDp] = useState(false);
  let getCampaignDp = "";
  let uuidForImageToRemove = "";
  let listOfUuid = [];

  const removeTheImage = async (listOfUuid) => {
    // console.log("remove the image called");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE}/api/v1/campaigns/${props.campaignId}/asset`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(listOfUuid),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log("Response:", responseData);

      //removing files
      const newFiles = props.files.filter((_, i) => i !== indexToRemove);
      props.setFilesUploaded(newFiles);
      props.setFiles(newFiles);
      //removing imagesUrl
      const newUrlsAfterRemoval = props.imagesUrl.filter(
        (_, i) => i !== indexToRemove
      );
      props.setImagesUrl(newUrlsAfterRemoval);
      setResponseAlert(false);
    } catch (error) {
      console.error("Error:", error.message);
    }

    let decCounter = props.count - 1;
    props.setCount(decCounter);
    // console.log("imagesUrl after removal", props.imagesUrl);
  };

  const removeTheDpImage = async (listOfUuid) => {
    console.log("remove the image dp called");
    axios
      .delete(
        `${process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE}/api/v1/campaigns/${props.campaignId}/display-picture`,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log("response", res);
      });
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE}/api/v1/campaigns/${props.campaignId}/asset`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(listOfUuid),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const responseData = await response.json();
      console.log("Response:", responseData);
      //removing files
      const newFiles = props.files.filter((_, i) => i !== indexToRemove);
      props.setFilesUploaded(newFiles);
      props.setFiles(newFiles);
      //removing imagesUrl
      const newUrlsAfterRemoval = props.imagesUrl.filter(
        (_, i) => i !== indexToRemove
      );
      props.setImagesUrl(newUrlsAfterRemoval);
      setResponseAlert(false);
    } catch (error) {
      console.error("Error:", error.message);
    }
    let decCounter = props.count - 1;
    props.setCount(decCounter);
    console.log("imagesUrl after removal", props.imagesUrl);
  };

  const removeImageHandler = () => {
    console.log("remove function called");
    uuidForImageToRemove = props.imagesUrl[indexToRemove].uuid;
    listOfUuid = [uuidForImageToRemove];
    if (removeTheDpImage) {
      removeTheDpImage(listOfUuid);
    } else {
      removeTheImage(listOfUuid);
    }
  };

  const helperForIndex = async (index, e) => {
    console.log("in helper function");
    getCampaignDp = await axios.get(
      `${process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE}/api/v1/campaigns/${props.campaignId}/display-picture`,
      {
        withCredentials: true,
      }
    );
    console.log("dp image url", getCampaignDp.data);
    setIndexToRemove(index);
    if (getCampaignDp.data === props.imagesUrl[index].url) {
      setRemovingImageDp(true);
    } else {
      setRemovingImageDp(false);
    }
    setResponseAlert(true);
  };

  // Call the function to delete the URLs
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27 && showCrop == false) {
        props.setIsImageChanged(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  return (
    <>
      <div className="fixed opacity-75 bg-black top-0 bottom-0 left-0 right-0 z-40"></div>
      <div className="fixed top-[5rem] lg:top-28 left-20 right-20 bg-gray-200 z-40 rounded-sm no-scrollbar ">
        <div className="flex flex-rpw ">
          <div className="w-1/3"></div>
          <div className="flex justify-center m-4 w-1/3">
            <div className="">
              <span className=" xs:text-base md:text-xl lg:text-2xl">
                Image Gallery
              </span>
            </div>
          </div>

          <div className="w-1/3 ml-auto flex justify-end ">
            <button
              className="text-2xl align-end mr-4 lg:mr-0 h-[10%] w-[10%] mt-4"
              onClick={() => props.setIsImageChanged(false)}
            >
              <svg
                className="w-full md:w-[80%] lg:w-[60%] "
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path d="M175 175C184.4 165.7 199.6 165.7 208.1 175L255.1 222.1L303 175C312.4 165.7 327.6 165.7 336.1 175C346.3 184.4 346.3 199.6 336.1 208.1L289.9 255.1L336.1 303C346.3 312.4 346.3 327.6 336.1 336.1C327.6 346.3 312.4 346.3 303 336.1L255.1 289.9L208.1 336.1C199.6 346.3 184.4 346.3 175 336.1C165.7 327.6 165.7 312.4 175 303L222.1 255.1L175 208.1C165.7 199.6 165.7 184.4 175 175V175zM512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256zM256 48C141.1 48 48 141.1 48 256C48 370.9 141.1 464 256 464C370.9 464 464 370.9 464 256C464 141.1 370.9 48 256 48z" />
              </svg>
            </button>
          </div>
        </div>

        {/* <div className={`grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-12 mx-20 h-[24rem] overflow-y-scroll no-scrollbar `}> */}
        <div
          className={`no-scrollbar grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mx-12 h-[24rem] overflow-y-scroll no-scrollbar `}
        >
          {props.files.map((image, index) => (
            <div
              className="mx-auto w-full"
              key={index + "key"}
              id={index + "imagesDiv"}
            >
              <ImageCard
                campaignId={props.campaignId}
                loading={props.loading}
                isImageChanged={props.isImageChanged}
                responseAlert={responseAlert}
                setResponseAlert={setResponseAlert}
                showCrop={showCrop}
                setShowCrop={setShowCrop}
                helperForIndex={helperForIndex}
                setFiles={props.setFiles}
                images={props.files}
                index={index}
                image={image.image}
                size={image.size}
                imageName={image.name}
                imagesUrl={props.imagesUrl}
                setImagesUrl={props.setImagesUrl}
                dp={props.dp}
                setAsDp={props.setAsDp}
              />
            </div>
          ))}

          {responseAlert ? (
            <>
              <div>
                <div className="fixed inset-0 flex justify-center opacity-75 bg-black z-40"></div>
                <div className="fixed bottom-[50%] bg-white opacity-100 w-fit h-auto z-50 mx-auto left-0 right-0 rounded-sm">
                  <div className="flex flex-col justify-center">
                    {removingImageDp ? (
                      <div className="mt-4 mx-16 text-sm" id="alert-message-dp">
                        Are you Sure You Want to Remove this, this is your
                        campaign dp as well?
                      </div>
                    ) : (
                      <div className="mt-4 mx-16" id="alert-message">
                        Are you Sure You Want to Remove this?
                      </div>
                    )}
                    <div className="mt-7 mb-6 mx-auto flex flex-row justify-between gap-4">
                      <div className="">
                        <button
                          className="w-[70px] text-sm  text-white py-1 bg-red-500 hover:bg-red-400 "
                          onClick={() => {
                            removeImageHandler();
                            console.log("remove pressed");
                          }}
                        >
                          Remove
                        </button>
                      </div>
                      <button
                        className=" w-[70px] text-sm bg-primary-brand hover:bg-sky-500  text-white py-1 "
                        onClick={() => {
                          setResponseAlert(false);
                          console.log("cancelled called");
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>

        <div className="w-full flex justify-end mb-3 items-center mt-8">
          <div className="">
            <Image
              className="inline-block"
              src="/images/add photos.png "
              height={30}
              width={30}
              alt=""
            />
            <input
              type="file"
              id="campaign images"
              className="hidden mt-8"
              accept="image/png, image/jpg, image/jpeg"
              onChange={props.fileInputHandler}
              multiple
            />
            <label
              htmlFor="campaign images"
              className="text-primary-brand rounded-sm px-3 py-1 mt-8 hover:bg-gray-300"
            >
              Add More Photos
            </label>
          </div>

          <div className="mx-6 ">
            <button
              className="bg-primary-brand hover:bg-sky-500 rounded-sm px-3 py-1 text-white "
              onClick={() => props.setIsImageChanged(false)}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ImagesGalleryViewer;
