import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import ImageCropDialog from "./ImageCropDialog";

const CampaignImagesEditor = (props) => {
  const Carrousel = dynamic(() => import("../components/Carousel"), {
    ssr: false,
  });

  // const [altText, setAltText] = useState("");
  let altText = "";
  const [showAlt, setShowAlt] = useState(false);
  const [showCrop, setShowCrop] = useState(false);
  const [OGImage, setOGImage] = useState({ croppedImageUrl: props.image });
  // const [index, setIndex] = useState(0);
  const [newImage, setNewImage] = useState(props.image);

  const setCroppedImageFor = (crop, zoom, aspect, croppedImageUrl) => {
    const newImage = { ...OGImage, crop, zoom, aspect, croppedImageUrl };
    console.log(props.image + "   " + croppedImageUrl);
    props.images[props.index].image = newImage.croppedImageUrl;
    props.setFiles(props.images);
    setShowCrop(false);
  };

  let items = [];
  // let imageUuid = "";
  props.images.map((image) => items.push(image.image));
  const map = items.map;

  useEffect(() => {
    console.log(
      props.index + " " + props.image + "  items",
      items[props.index]
    );
  }, [props.index]);
  console.log(
    "Index To show",
    props.indexShow,
    "Index To IN props.index ",
    props.index
  );

  const metaAltText = () => {
    console.log("alt button clicked", altText, "index", props.indexShow);
    console.log("image uuid", props.imagesUrl[props.indexShow].uuid);
    let imageUuid = props.imagesUrl[props.indexShow].uuid;
    altText = document.getElementById("alt-input").value;
    axios
      .put(
        `${process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE}/api/v1/campaigns/${props.campaignId}/asset-metadata/${imageUuid}?value=${altText}`,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log("response", res);
        document.getElementById("data-not-saved").classList.add("hidden");
        document.getElementById("data-saved").classList.remove("hidden");
      })
      .catch((err) => {
        console.log("error", err);
        document.getElementById("data-not-saved").classList.remove("hidden");
      });
  };

  // TODO to add cropped image's by using uploadcare
  return (
    <>
      {/* <div className='fixed opacity-75 bg-black top-0 bottom-0 left-0 right-0 z-10'></div> */}
      <div
        className="flex fixed top-16 left-16 right-16 bottom-8 bg-gray-200 border-2 ease-in duration-300 rounded-sm"
        style={{ zIndex: "40" }}
      >
        <div className="w-[80%] h-full border-2 ease-in-out duration-200">
          <Carrousel
            items={items}
            map={map}
            index={props.index}
            selectedImage={props.selectedImage}
            setSelectedImage={props.setSelectedImage}
            indexShow={props.indexShow}
            setIndexShow={props.setIndexShow}
          />
        </div>

        <div className="flex flex-col w-[20%] h-full border-2 ">
          <button
            className="w-[15%] ml-auto"
            onClick={() => props.setShowCrop(false)}
          >
            <svg
              className="w-full h-[60%]"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path d="M175 175C184.4 165.7 199.6 165.7 208.1 175L255.1 222.1L303 175C312.4 165.7 327.6 165.7 336.1 175C346.3 184.4 346.3 199.6 336.1 208.1L289.9 255.1L336.1 303C346.3 312.4 346.3 327.6 336.1 336.1C327.6 346.3 312.4 346.3 303 336.1L255.1 289.9L208.1 336.1C199.6 346.3 184.4 346.3 175 336.1C165.7 327.6 165.7 312.4 175 303L222.1 255.1L175 208.1C165.7 199.6 165.7 184.4 175 175V175zM512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256zM256 48C141.1 48 48 141.1 48 256C48 370.9 141.1 464 256 464C370.9 464 464 370.9 464 256C464 141.1 370.9 48 256 48z" />
            </svg>
          </button>
          <button
            className="bg-primary-brand hover:bg-sky-500 rounded-sm px-3 py-1 text-white mt-8 w-[70%] mx-auto"
            onClick={() => setShowCrop(true)}
          >
            Crop
          </button>
          {/* <button className='bg-primary-brand hover:bg-sky-500 rounded-sm px-3 py-1 text-white mt-4 w-[50%] mx-auto' onClick={() => { showAlt ? setShowAlt(false) : setShowAlt(true); }}>Alternate Text</button>
                    <input className={showAlt ? `mt-4 w-[60%] mx-auto ` : `mt-4 w-[60%] mx-auto hidden`} type="text" placeholder='Type ALt Txt here ' id="alt-text" onChange={(e) => { console.log(e.target.value); }} /> */}

          <div className="mt-4  w-[70%] mx-auto ">
            Alternate Text
            <div className="flex flex-col lg:flex-row  mx-auto mt-1 ">
              <div className="flex-col lg:flex-row ">
                <input
                  className=" h-[2rem] sm:w-full mr-2 rounded-sm border-[1.5px] px-2 py-1 outline-none"
                  id="alt-input"
                  type="text"
                  placeholder="Type ALt-Txt here"
                  onChange={() => {
                    document
                      .getElementById("data-saved")
                      .classList.add("hidden");
                    document
                      .getElementById("data-not-saved")
                      .classList.add("hidden");
                  }}
                />
              </div>
              <div className="mt-2 lg:mt-0">
                <button
                  className="bg-primary-brand lg:ml-2 hover:bg-sky-500 rounded-sm p-1 text-white  mx-auto"
                  onClick={metaAltText}
                >
                  Save
                </button>
              </div>
            </div>
            <p
              className="mt-1 text-red-500 ml-4 text-[12px] hidden"
              id="data-saved"
            >
              Your data is succsefully saved
            </p>
            <p
              className="mt-1 text-red-500 ml-4 text-[12px] hidden"
              id="data-not-saved"
            >
              Your data is not succsefully saved
            </p>
          </div>
        </div>

        {showCrop === true ? (
          <ImageCropDialog
            campaignId={props.campaignId}
            aspectRatio={1}
            zoomInit={OGImage.zoomInit || 1}
            setShowCrop={setShowCrop}
            picture={items[props.indexShow]}
            imagesUrl={props.imagesUrl}
            index={props.indexShow}
            imageUuid={props.imagesUrl[props.indexShow].uuid}
            // setPicture={setProfilePicture}
            pictureType="campagign asset"
          />
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default CampaignImagesEditor;
