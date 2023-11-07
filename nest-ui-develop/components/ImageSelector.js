import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { changeBasicsMetaData } from "../store/campaignSlice";
import Image from "next/image";
import axios from "axios";
import {
  changeTiersData,
  addTier,
  removeTier,
  updateTier,
} from "../store/campaignSlice";

import CircularLoading from "../components/skeletons/CircularLoading";

const ImageSelector = (props) => {
  const dispatch = useDispatch();

  const [metaLoader, setMetaLoader] = useState(false);
  // const [uploadedImagesOnServer, setUploadedImagesOnServer] = useState();

  // const tempUploadedImages = [{ location: "", altText: "" }];
  console.log("files", props.uploadedImagesOnServer);

  const handleMetaImageSave = (index) => {
    props.setSave(false);
    setMetaLoader(true);
    console.log(
      document
        .getElementById(props.uploadedImagesOnServer[index].fileName)
        .classList.remove("hidden")
    );
    props.setMetaImage(props.uploadedImagesOnServer[index].location);
    props.setMetaImageName(props.uploadedImagesOnServer[index].fileName);
    console.log(
      dispatch(
        changeBasicsMetaData({
          ...props.metaData,
          asset: { url: props.metaImage, fileName: props.metaImage },
        })
      )
    );
    console.log(
      "index",
      index,
      "props.uploadedImagesOnServer ==>",
      props.uploadedImagesOnServer[index].fileName
    );
    setTimeout(() => {
      document
        .getElementById(props.uploadedImagesOnServer[index].fileName)
        .classList.add("hidden");
      console.log("metaImage", props.metaImage);
      props.setImageSelector(false);
    }, 500);
  };

  const handleTierImageSave = (index) => {
    let tierId = props.tierId;
    props.setSave(false);
    console.log("tierId", props.tierId);
    props.setTierAsset(props.uploadedImagesOnServer[index].fileName);
    props.setImageSelector(false);
    console.log(
      "tier handle pressed",
      index,
      "props.uploadedImagesOnServer[index]  ",
      props.uploadedImagesOnServer[index],
      "tierId",
      props.tierId
    );
    props.setTierDataInput((prevState) => ({
      ...prevState,
      tierAsset: props.uploadedImagesOnServer[index],
    }));
    console.log(
      dispatch(
        updateTier({
          tierId,
          tierData: {
            ...props.tierDataInput,
            tierAsset: props.uploadedImagesOnServer[index],
          },
        })
      )
    );

    // axios.post(`http://localhost:8002/api/v1/646ca4bef1fc55c1be9ccc0a/tiers/d9e5b38a-b856-4a7b-b89f-38e32eaf9bf2/tier-asset/gallery?fileUUID=0f422b92-872b-44a6-ba83-897d35068046`,
    // axios.post(`${process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE}/api/v1/${props.campaignId}/tiers/${props.tierId}/tier-asset/gallery?fileUUID=${props.uploadedImagesOnServer[index].file_UUID}`,
    //     '',
    //     {
    //         withCredentials: true,
    //     }
    // ).then((res) => {
    //     console.log("res", res);
    //     props.setTierAsset(props.uploadedImagesOnServer[index].fileName);
    //     props.setImageSelector(false);
    //     let tierId = props.tierId;
    //     props.setTierDataInput((prevState) => ({
    //         ...prevState,
    //         tierAsset: props.uploadedImagesOnServer[index],
    //     }));
    //     console.log(dispatch(updateTier({ tierId, tierData: { ...props.tierDataInput, tierAsset: props.uploadedImagesOnServer[index] } })));

    // }).catch((err) => {
    //     console.log(err)
    // });
  };

  const fileInputHandler = (event) => {
    let file = event.target.files[0];
    console.log("event", file);
    const formData = new FormData();
    formData.append("file", file, file.name);

    console.log("formData", formData);

    // let files = checkDroppedFiles(event.target.files);
    // if (files.length === 0) return;
    // handleUploadedFiles(files);
    // props.setFiles((current) => [...current, ...files]);
    // // console.log("FILES-->>>", props.files);
    // props.setIsImageChanged(true);
    // props.setSave(true);
  };

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        props.setImageSelector(false);
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
      <div className="fixed top-36 left-20 right-20 bg-gray-200 z-40">
        <div className="flex flex-rpw ">
          <div className="w-1/3"></div>
          <div className="flex justify-center m-4 w-1/3">
            <div className="">
              <h1 className="text-2xl">Select Image</h1>
            </div>
          </div>

          <div className="w-1/3 ml-auto flex justify-end ">
            <button
              className="text-2xl align-end h-[10%] w-[10%] mt-4"
              onClick={() => props.setImageSelector(false)}
            >
              <svg
                className="w-[60%] "
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path d="M175 175C184.4 165.7 199.6 165.7 208.1 175L255.1 222.1L303 175C312.4 165.7 327.6 165.7 336.1 175C346.3 184.4 346.3 199.6 336.1 208.1L289.9 255.1L336.1 303C346.3 312.4 346.3 327.6 336.1 336.1C327.6 346.3 312.4 346.3 303 336.1L255.1 289.9L208.1 336.1C199.6 346.3 184.4 346.3 175 336.1C165.7 327.6 165.7 312.4 175 303L222.1 255.1L175 208.1C165.7 199.6 165.7 184.4 175 175V175zM512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256zM256 48C141.1 48 48 141.1 48 256C48 370.9 141.1 464 256 464C370.9 464 464 370.9 464 256C464 141.1 370.9 48 256 48z" />
              </svg>
            </button>
          </div>
        </div>

        <div
          className={`no-scrollbar grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mx-12 h-[24rem] overflow-y-scroll no-scrollbar`}
        >
          {props.uploadedImagesOnServer.map((items, index) => (
            <div className="mx-auto" key={index + "key"}>
              <div className="flex flex-col w-[12rem] group lg:w-[14rem] h-[14rem] lg:h-[17rem] rounded-[2px] relative shadow-md hover:h-[17.2rem] hover-w-[14.4rem] transition-all ease-in-out duration-500 hover:shadow-lg">
                <div className="w-full relative h-full rounded-[2px]">
                  <img
                    src={props.uploadedImagesOnServer[index].location}
                    alt={props.uploadedImagesOnServer[index].altText}
                    id={index}
                    className={`h-full w-full rounded-[2px]`}
                    style={{ objectFit: "cover" }}
                  />

                  <div className="flex text-xs  flex-wrap justify-between md:mt-4 my-2">
                    <div className=" whitespace-nowrap ">
                      <span
                        className="overflow-hidden overflow-ellipsis"
                        title={props.uploadedImagesOnServer[index].fileName}
                      >
                        Name :-{" "}
                        {props.uploadedImagesOnServer[index].fileName.substr(
                          0,
                          25
                        )}{" "}
                        . . .
                      </span>
                    </div>
                  </div>

                  <div
                    className="hidden"
                    id={props.uploadedImagesOnServer[index].fileName}
                  >
                    <div className="absolute flex items-center top-0 left-0 justify-center w-full h-full bg-cropper-background z-10">
                      <div className="inline-block w-16 h-16">
                        <CircularLoading />
                      </div>
                    </div>
                  </div>

                  <div className="absolute flex-col top-10 left-11 opacity-0 group-hover:opacity-100 ">
                    <button
                      onClick={() => {
                        props.tierCompo === true
                          ? handleTierImageSave(index)
                          : handleMetaImageSave(index);
                      }}
                      className="w-full text-sm bg-primary-brand text-white p-1 hover:bg-sky-500"
                    >
                      {props.buttonName}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {props.tierCompo === true ? (
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
                onChange={fileInputHandler}
              />
              <label
                htmlFor="campaign images"
                className="text-primary-brand rounded-sm px-3 py-1 mt-8 hover:bg-gray-300"
              >
                Add Another Image
              </label>
            </div>

            <div className="mx-6 ">
              <button
                className="bg-primary-brand hover:bg-sky-500 rounded-sm px-3 py-1 text-white "
                onClick={() => props.setImageSelector(false)}
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <></>
        )}

        {/* <div className='w-full flex justify-end mb-3'>
                    <div className='mt-9'>
                    </div>

                    <div className=' mx-6'>
                        <button className='bg-primary-brand rounded-sm px-3 py-1 text-white mt-8' onClick={() => props.setIsImageChanged(false)} >Done</button>
                    </div>
                </div> */}
      </div>
    </>
  );
};

export default ImageSelector;
