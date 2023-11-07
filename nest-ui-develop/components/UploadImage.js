import { useState, useEffect, useRef } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import CircularLoading from "../components/skeletons/CircularLoading";
import ModalCenter from "./ModalCenter";

const UploadImage = (props) => {
  const [image, setImage] = useState();
  const [cropper, setCropper] = useState();
  const [loading, setLoading] = useState(false);

  const containerRef = useRef();

  const fileInputHandler = (event) => {
    props.setPicture(event.target.files[0]);
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(event.target.files[0]);
    props.setEditing(false);
  };

  const uploadPictures = () => {
    console.log("editing", props.editing);
    if (typeof cropper !== "undefined") {
      setLoading(true);
      const cropperData = cropper.getData();
      console.log("cropperData", cropper.getData());
      const height = parseInt(cropperData.height);
      const width = parseInt(cropperData.width);
      const x = parseInt(cropperData.x);
      const y = parseInt(cropperData.y);
      if (props.editing) {
        props
          .uploadNewCroppedPicture(height, width, x, y)
          .then(() => setLoading(false))
          .catch(() => setLoading(false));
      } else {
        props
          .uploadNewPicture(height, width, x, y)
          .then(() => setLoading(false))
          .catch(() => setLoading(false));
      }
    }
  };

  useEffect(() => {
    console.log("picture", props.picture, "image type", typeof props.picture);
    if (props.editing) {
      setImage(props.picture);
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(props.picture);
    }
  }, []);

  return (
    <ModalCenter>
      <div className="relative bg-dark-primary-2 flex flex-col p-8 h-[85vh] w-[85vw] rounded-sm">
        {loading ? (
          <div className="absolute flex items-center top-0 left-0 justify-center w-full h-full bg-cropper-background z-10">
            <div className="inline-block w-16 h-16">
              <CircularLoading />
            </div>
          </div>
        ) : (
          <></>
        )}
        <div className="w-full overflow-hidden h-[90%]">
          <Cropper
            dragMode="move"
            style={{
              height: "100%",
              width: "100%",
              borderRadius: "20px",
            }}
            aspectRatio={props.aspectRatio}
            src={image}
            zoomTo={0.5}
            viewMode={2}
            minCropBoxHeight={100}
            checkOrientation={false}
            onInitialized={(instance) => {
              setCropper(instance);
            }}
            guides={false}
          />
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between w-full text-[14px] sm:text-[16px] mt-3">
          <div className="w-full md:w-max mb-2 md:mb-0">
            <input
              type="file"
              id="upload picture in cropper"
              className="hidden"
              accept="image/png, image/jpg, image/jpeg"
              onChange={fileInputHandler}
            />
            <label
              htmlFor="upload picture in cropper"
              className="inline-block bg-primary-brand text-white rounded-sm font-medium w-full md:w-max py-2 px-16 text-center cursor-pointer"
            >
              Choose
            </label>
          </div>
          <div className="flex flex-col sm:flex-row font-medium w-full md:w-max">
            <button
              className="text-primary-brand py-2 px-16 border-[1px] border-primary-brand rounded-sm sm:mr-2 mb-2 sm:mb-0 w-full sm:w-1/2 md:w-max"
              onClick={props.cancelCrop}
            >
              Cancel
            </button>
            <button
              className="bg-primary-brand text-white rounded-sm py-2 px-16 w-full sm:w-1/2 md:w-max"
              onClick={uploadPictures}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </ModalCenter>
  );
};

export default UploadImage;
