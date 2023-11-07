import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Image from "next/image";
import Script from "next/script";
import ImageCropDialog from "./ImageCropDialog";
import { useSelector, useDispatch } from "react-redux";
import { changeCoverPic, changeDisplayPic } from "../store/counterSlice";

const UploadAndDisplayImage = (props) => {
  const inputElement = useRef();
  const dispatch = useDispatch();
  const selectedImage = useSelector((state) => state.counter[`${props.usage}`]);
  const [newImage, setNewImage] = useState(null);
  const [showCrop, setShowCrop] = useState(false);
  const [changeCount, setChangeCount] = useState(0);
  const [OGImage, setOGImage] = useState({});
  const setCroppedImageFor = (crop, zoom, aspect, croppedImageUrl) => {
    const newImage = { ...selectedImage, crop, zoom, aspect, croppedImageUrl };

    if (props.usage == "displayPic") dispatch(changeDisplayPic(newImage));
    else dispatch(changeCoverPic(newImage));

    setShowCrop(false);
  };

  return (
    <div key={12121} className="h-full block">
      {showCrop && selectedImage.croppedImageUrl !== "" && (
        <div className="z-20">
          <ImageCropDialog
            imageUrl={OGImage.croppedImageUrl}
            cropInit={OGImage.cropInit || { x: 0, y: 0 }}
            zoomInit={OGImage.zoomInit || 1}
            aspectRatio={OGImage.aspect || props.aspect}
            setCroppedImageFor={setCroppedImageFor}
            setNewImage={setNewImage}
          />
          <br />
        </div>
      )}
      <Script src="https://use.fontawesome.com/3a2eaf6206.js" />
      {!showCrop &&
        selectedImage.croppedImageUrl !== null &&
        selectedImage.croppedImageUrl !== "" &&
        typeof selectedImage.croppedImageUrl !== "undefined" && (
          <>
            <Image
              id={props.id}
              src={newImage || selectedImage.croppedImageUrl} // Route of the image file
              fill
              style={{
                "border-radius": props.borderRadius,
                objectFit: "cover",
              }}
              placeholder="bleh"
            />
            {/*TODO On clicking the Sure button the input field should open.*/}
            <button
              className={`absolute top-3 ${
                props.usage === "coverPic"
                  ? "left-3 bg-white"
                  : "left-28 bg-[#ebecee]"
              } rounded-[2px] opacity-60 hover:opacity-80 px-2 py-[2px] shadow-md`}
              onClick={() => {
                setChangeCount(changeCount + 1);
                if (changeCount === 1) {
                  if (props.usage == "displayPic")
                    dispatch(
                      changeDisplayPic({
                        ...selectedImage,
                        croppedImageUrl: null,
                      })
                    );
                  else
                    dispatch(
                      changeCoverPic({
                        ...selectedImage,
                        croppedImageUrl: null,
                      })
                    );
                  setNewImage(null);
                  setChangeCount(0);
                  console.log(inputElement.current);
                }
              }}
            >
              {changeCount === 1 ? "Sure?" : "Change"}
            </button>
            <button
              className={`absolute top-12 ${
                props.usage === "coverPic"
                  ? "border-2 left-3 bg-white"
                  : "left-28 bg-[#ebecee]"
              } rounded-[2px] opacity-60 hover:opacity-80 px-2 py-[2px] shadow-md`}
              onClick={() => {
                setNewImage(null);
                setShowCrop(true);
              }}
            >
              Crop
            </button>
          </>
        )}

      {selectedImage.croppedImageUrl == null && (
        <label for={props.id} className="flex h-full">
          <div className="opacity-50 m-auto w-[99.99%] text-center">
            <i class="fa fa-2x fa-camera"></i>
          </div>
          <input
            id={props.id}
            type="file"
            name="myImage"
            className="invisible w-[0.01%]"
            onChange={(event) => {
              // console.log("1",event.target.files[0]);
              if (props.usage == "displayPic")
                dispatch(
                  changeDisplayPic({
                    ...selectedImage,
                    croppedImageUrl: URL.createObjectURL(event.target.files[0]),
                  })
                );
              else
                dispatch(
                  changeCoverPic({
                    ...selectedImage,
                    croppedImageUrl: URL.createObjectURL(event.target.files[0]),
                  })
                );
              setOGImage({
                ...OGImage,
                croppedImageUrl: URL.createObjectURL(event.target.files[0]),
              });
            }}
          />
          <br />
          <span id="imageName"></span>
        </label>
      )}
    </div>
  );
};

export default UploadAndDisplayImage;
