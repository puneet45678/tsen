import React, { useState, useEffect } from "react";
import PictureIcon from "../../icons/PictureIcon";
import PlusBlue from "../../icons/PlusBlue";

import EditIcon from "../../icons/EditIcon";
import TrashIcon from "../../icons/TrashIcon";
import RetryIcon from "../../icons/RetryIcon";
import Image from "next/image";
import CircularLoading from "../skeletons/CircularLoading";
import UploadImageWithoutChooseButton from "../UploadImageWithoutChooseButton";
import UploadArrow from "../../icons/UploadArrow";

const ImageGallery = (props) => {
  const checkFiles = (files) => {
    const finalFiles = [];
    for (let file of files) {
      let extension = file.name.split(".").at(-1);
      if (
        (extension === "png" ||
          extension === "jpg" ||
          extension === "jpeg" ||
          extension === "webp") &&
        file.size <= 10485760
      )
        finalFiles.push(file);
    }
    return finalFiles;
  };

  const handleUploadedFiles = (images) => {
    const imagesArray = [];
    console.log("images", images);
    for (let image of images) {
      imagesArray.push({
        imageUrl: URL.createObjectURL(image),
        isNewPicture: true,
        status: "uploading",
      });
    }
    props.setPictures([...props.pictures, ...imagesArray]);
    for (let index = 0; index < images.length; index++) {
      const image = images[index];
      let formData = new FormData();
      formData.append("file", image);
      console.log("props.pictures", props.pictures);
      props.uploadImageToBackend(formData, props.pictures.length + index);
    }
  };

  const dropHandler = (event) => {
    event.preventDefault();
    const files = checkFiles(event.dataTransfer.files);
    if (files.length === 0) return;
    handleUploadedFiles(files);
  };

  const handleImageInput = (event) => {
    const files = checkFiles(event.target.files);
    if (files.length === 0) return;
    handleUploadedFiles(files);
  };

  return (
    <>
    {/* <div className="mb-2">
    <label className="font-[500] text-md text-dark-neutral-700  ">
    Upload Images*
  </label>
  </div> */}
    <div className="mb-2 flex flex-row justify-between">
         <label className="font-[500] text-md text-dark-neutral-700 ">
                    Upload Images* 
        </label>
        {props?.pictures?.length > 0 >=1 && (
        <div className=" mr-2">
            <div className="flex items-center">
              <div className="w-4 h-4 mr-[6px]">
                <PlusBlue />
              </div>
              <label
                htmlFor="imageInput"
                className="text-button-text-sm text-primary-purple-500 font-semibold cursor-pointer"
              >
                Add more images
              </label>{" "}
            </div>
            <input
        type="file"
        id="imageInput"
        className="hidden"
        multiple
        accept=".jpg, .jpeg, .png, .webp"
        onChange={handleImageInput}
      />
          </div>
          )}
        </div>
    <div className="h-full w-full bg-light-neutral-50  rounded-[10px] hover:bg-light-neutral-400 active:bg-light-neutral-700">
      <input
        type="file"
        id="imageInput"
        className="hidden"
        multiple
        accept=".jpg, .jpeg, .png, .webp"
        onChange={handleImageInput}
      />
      {props?.pictures?.length > 0 ? (
        <div
          className="grid gap-3 border-2 border-borderGray rounded-[5px] px-5 py-4"
          onDragOver={(event) => event.preventDefault()}
          onDrop={dropHandler}
        >
          <div className="flex justify-between ">
            <span>{props.pictures.length} images uploaded</span>
            <label
              htmlFor="imageInput"
              className="flex items-center gap-1 cursor-pointer"
            >
              <div className="flex items-center">
                {/* <div className="w-4 h-4 mr-[6px]">
                  {" "}
                  <PlusBlue />
                </div> */}

                {/* <span className="text-button-text-sm text-primary-purple-500 font-semibold  ">
                  Add more images
                </span> */}
              </div>
            </label>
          </div>
          <div className="grid grid-cols-4 gap-4 h-[15rem] overflow-hidden overflow-y-auto no-scrollbar">
            {props.pictures.map((picture, index) => (
              <div key={index}>
                <ImageCard
                  picture={picture}
                  deleteImage={props.deleteImage}
                  handleImageCrop={props.handleImageCrop}
                  coverImage={props.coverImage}
                  handleUseAsCoverPhoto={props.handleUseAsCoverPhoto}
                  aspectRatio={props.aspectRatio}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div
          className="border-2 border-light-neutral-700 border-dashed rounded-[10px] p-10"
          onDragOver={(event) => event.preventDefault()}
          onDrop={dropHandler}
        >
          <div className="grid justify-items-center gap-[16px] w-fit mx-auto ">
            <div className=" mt-[89px] border-[1px] p-[14px]  bg-white shadow-xs border-light-neutral-600 rounded-[100px]">
              <div className="h-[20px] w-[20px]">
                <UploadArrow />
              </div>
            </div>
            <div className="flex flex-col gap-[4px]">
              <p className="text-center text-dark-neutral-700 font-[500] text-lg">
                Drag and Drop or{" "}
                <label
                  htmlFor="imageInput"
                  className="text-primary-purple-600 cursor-pointer"
                >
                  choose your file
                </label>{" "}
                for upload
              </p>

              <p className="text-center mb-[89px] mt-[4px]">
                <span className="text-dark-neutral-50 text-sm font-[500]">
                  JPG, PNG or JPEG
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

const ImageCard = (props) => {
  const [showImageEditor, setShowImageEditor] = useState(false);

  const handelSave = (height, width, x, y) => {
    return new Promise((resolve, reject) => {
      console.log("props.picture", props.picture);
      props
        .handleImageCrop(height, width, x, y, props.picture.imageId)
        .then(() => {
          setShowImageEditor(false);
          resolve();
        })
        .catch((err) => {
          console.log(err);
          reject();
        });
    });
  };

  return (
    <>
      {showImageEditor && (
        <UploadImageWithoutChooseButton
          aspectRatio={props.aspectRatio}
          picture={props.picture.imageUrl}
          handelSave={handelSave}
          cancelCrop={() => setShowImageEditor(false)}
        />
      )}
      <div
        style={{
          aspectRatio: props.aspectRatio ?? "1/1",
        }}
        className="group relative grid justify-items-center w-full"
      >
        {console.log("here picture", props.picture)}
        {props.picture?.isNewPicture &&
        props.picture?.status === "uploading" &&
        props.picture.imageUrl ? (
          <>
            <Image
              src={props.picture.imageUrl}
              alt="Model Image"
              className="object-cover"
              fill
            />
            <div className="absolute w-full h-full top-0 left-0 bg-cropper-background p-2 flex items-center justify-center">
              <CircularLoading />
            </div>
          </>
        ) : props.picture?.isNewPicture && props.picture?.status === "error" ? (
          <>
            <Image src={props.picture.imageUrl} className="object-cover" fill />
            <div className="flex items-center justify-center absolute w-full h-full top-0 left-0 bg-cropper-background text-red-500">
              <div className="w-10 h-10 cursor-pointer">
                <RetryIcon />
              </div>
            </div>
          </>
        ) : (
          <>
            <Image
              src={
                props.picture.croppedUrl
                  ? props.picture.croppedUrl
                  : props.picture.imageUrl
              }
              alt="Model Image"
              className="object-cover"
              fill
            />
            <div className="group-hover:opacity-100 opacity-0 flex gap-2 absolute top-2 right-2 transition-all duration-500 ease-in-out">
              <div
                className="h-6 w-6 bg-white p-1 rounded-[5px] cursor-pointer"
                onClick={() => setShowImageEditor(true)}
              >
                <EditIcon />
              </div>
              <div
                className="h-6 w-6 bg-black text-white p-1 rounded-[5px] cursor-pointer"
                onClick={() => props.deleteImage(props.picture.imageId)}
              >
                <TrashIcon />
              </div>
            </div>
            {console.log("props.picture.croppedUrl", props.picture.croppedUrl)}
            {console.log("props.picture.imageUrl", props.picture.imageUrl)}
            {console.log("props.coverImage", props.coverImage)}
            {props.coverImage &&
            (props.picture.croppedUrl === props.coverImage ||
              props.picture.imageUrl === props.coverImage) ? (
              <div className="flex items-center justify-center gap-2 absolute bottom-2 bg-white p-1 rounded-[5px] cursor-pointer">
                <span className="text-[12px]">Cover Image</span>
              </div>
            ) : (
              <div className="group-hover:opacity-100 opacity-0 flex items-center justify-center gap-2 absolute bottom-2 bg-white p-1 rounded-[5px] cursor-pointer transition-all duration-500 ease-in-out">
                <div className="flex gap-2 text-[12px]">
                  <div className="h-5 w-5">
                    <PictureIcon />
                  </div>
                  <span
                    onClick={() =>
                      props.handleUseAsCoverPhoto(
                        props.picture.croppedUrl
                          ? props.picture.croppedUrl
                          : props.picture.imageUrl
                      )
                    }
                  >
                    Use as a cover image
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default ImageGallery;
