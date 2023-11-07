import React, { useState, useEffect } from "react";
import Image from "next/image";
import CampaignImagesEditor from "./CampaignImagesEditor";
import axios from "axios";
import FullScreenView from "./FullScreenView";
import CircularLoading from "../components/skeletons/CircularLoading";

const ImageCard = (props) => {
  const [fullScreenView, setFullScreenView] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [indexShow, setIndexShow] = useState(null);
  const [showCrop, setShowCrop] = useState(false);
  // console.log("files in image card", props.images)

  const handleEdit = (e, index) => {
    console.log("handleEdit called");
    setShowCrop(true);
    setSelectedImage(props.image);
    setIndexShow(props.index);
    console.log("selectedImage", props.index);
  };

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        setShowCrop(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const changeDp = (index, imageName) => {
    let newDp = props.imagesUrl[index].url;
    let newDpUuid = props.imagesUrl[index].uuid;
    console.log(
      document.getElementById(imageName + "success").classList.add("hidden")
    );
    console.log(
      document.getElementById(imageName + "error").classList.add("hidden")
    );

    props.setAsDp(newDp);
    axios.post(
      `${process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE}/api/v1/campaigns/${props.campaignId}/display-picture?assetId=${newDpUuid}`,
      "",
      {
        withCredentials: true,
      }
    )
      .then((res) => {
        console.log("response", res);
        console.log(document.getElementById(imageName + "success"));
        console.log(
          document
            .getElementById(imageName + "success")
            .classList.remove("hidden")
        );
      })
      .catch((err) => {
        console.log("error", err);
        console.log(
          document
            .getElementById(imageName + "success")
            .classList.remove("hidden")
        );
      });
  };
  return (
    <div className="flex flex-col w-full group h-[14rem] lg:h-[17rem] rounded-[2px] relative shadow-md transition-all ease-in-out duration-500 hover:shadow-lg">
      <div className="w-full relative h-full rounded-[2px]">
        {/* div for adding loader on a uploading image */}
        <div className="hidden" id={props.images[props.index].name + "image"}>
          <div className="absolute flex items-center top-0 left-0 justify-center w-full h-full bg-cropper-background z-10">
            <div className="inline-block w-16 h-16">
              <CircularLoading />
            </div>
          </div>
        </div>

        {/* div for adding a success mark on every succesfull upload */}
        <div
          className="dz-success-mark hidden "
          id={props.images[props.index].name + "success"}
        >
          <svg
            width="54"
            height="54"
            viewBox="0 0 54 54"
            fill="white"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10.2071 29.7929L14.2929 25.7071C14.6834 25.3166 15.3166 25.3166 15.7071 25.7071L21.2929 31.2929C21.6834 31.6834 22.3166 31.6834 22.7071 31.2929L38.2929 15.7071C38.6834 15.3166 39.3166 15.3166 39.7071 15.7071L43.7929 19.7929C44.1834 20.1834 44.1834 20.8166 43.7929 21.2071L22.7071 42.2929C22.3166 42.6834 21.6834 42.6834 21.2929 42.2929L10.2071 31.2071C9.81658 30.8166 9.81658 30.1834 10.2071 29.7929Z" />
          </svg>
        </div>

        {/* div for adding a error mark on every error upload */}
        <div
          className="dz-error-mark hidden"
          id={props.images[props.index].name + "error"}
        >
          <svg
            width="54"
            height="54"
            viewBox="0 0 54 54"
            fill="white"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M26.2929 20.2929L19.2071 13.2071C18.8166 12.8166 18.1834 12.8166 17.7929 13.2071L13.2071 17.7929C12.8166 18.1834 12.8166 18.8166 13.2071 19.2071L20.2929 26.2929C20.6834 26.6834 20.6834 27.3166 20.2929 27.7071L13.2071 34.7929C12.8166 35.1834 12.8166 35.8166 13.2071 36.2071L17.7929 40.7929C18.1834 41.1834 18.8166 41.1834 19.2071 40.7929L26.2929 33.7071C26.6834 33.3166 27.3166 33.3166 27.7071 33.7071L34.7929 40.7929C35.1834 41.1834 35.8166 41.1834 36.2071 40.7929L40.7929 36.2071C41.1834 35.8166 41.1834 35.1834 40.7929 34.7929L33.7071 27.7071C33.3166 27.3166 33.3166 26.6834 33.7071 26.2929L40.7929 19.2071C41.1834 18.8166 41.1834 18.1834 40.7929 17.7929L36.2071 13.2071C35.8166 12.8166 35.1834 12.8166 34.7929 13.2071L27.7071 20.2929C27.3166 20.6834 26.6834 20.6834 26.2929 20.2929Z" />
          </svg>
        </div>

        <img
          src={props.image}
          alt={"Image " + props.images[props.index].name + "of Campaign"}
          id={props.index}
          className="h-full w-full rounded-[2px] hover:cursor-pointer object-cover"
          onClick={() => setFullScreenView(true)}
        />

        {fullScreenView == true ? (
          <FullScreenView setFullScreen={setFullScreenView} src={props.image} />
        ) : (
          <></>
        )}
        <div className="flex text-xs  flex-wrap justify-between md:mt-4 my-2">
          <div className=" whitespace-nowrap ml-2">
            <span
              className="overflow-hidden overflow-ellipsis"
              title={props.images[props.index].name}
            >
              Name :- {props.images[props.index].name.substr(0, 7)} . . .
            </span>
          </div>
          <div className="inline-block ml-2 ">
            Size :- {(props.size / 1024 ** 2).toFixed(2)} MB
          </div>
        </div>

        <div
          className="absolute flex-col top-4 left-4 opacity-0 group-hover:opacity-100"
          id={props.images[props.index].name + "button"}
        >
          <button
            onClick={() => handleEdit(props.index)}
            className="w-[70px] text-sm bg-primary-brand text-white py-1 hover:bg-sky-500"
          >
            {" "}
            Edit{" "}
          </button>
          <div>
            <button
              onClick={() =>
                changeDp(props.index, props.images[props.index].name)
              }
              className="w-[90px] text-sm bg-primary-brand text-white py-1 hover:bg-sky-500 mt-2 "
            >
              Set as DP
            </button>
          </div>
          <div>
            <button
              onClick={(e) => props.helperForIndex(props.index, e)}
              className="w-[150px] text-sm bg-red-500 text-white py-1 hover:bg-red-400 mt-2 "
            >
              Remove the Image
            </button>
          </div>
        </div>
      </div>
      {showCrop === true ? (
        <CampaignImagesEditor
          campaignId={props.campaignId}
          imagesUrl={props.imagesUrl}
          setFiles={props.setFiles}
          index={props.index}
          setShowCrop={setShowCrop}
          images={props.images}
          image={props.image}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          indexShow={indexShow}
          setIndexShow={setIndexShow}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default ImageCard;
