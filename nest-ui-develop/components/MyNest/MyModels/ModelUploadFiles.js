import React, { useState, useEffect } from "react";
import ModelUploadNextButton from "./ModelUploadNextButton";
import ImageGallery from "../../Image/ImageGallery";
import UploadFile from "../../UploadFile";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import {
  changeGlbFile,
  changeModelPictures,
  changeModelPicture,
  changeCoverImage,
  changeStlFile,
  changeGlbFileStatus,
  changeStlFileStatus,
} from "../../../store/modelSlice";
import SectionLayout from "../../Layouts/SectionLayout";
import { useRouter } from "next/router";

const ModelUploadFiles = ({ modelId, handleModelSave, modelErrors }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const model = useSelector((state) => state.model);
  const [controller, setController] = useState();
  // const [controller, setController] = useState(new AbortController());
  const [selectedPictures, setSelectedPictures] = useState([]);
  const [files, setFiles] = useState([]);
  const [fileUploadPercentageGlb, setFileUploadPercentageGlb] = useState(0);
  const [fileUploadPercentageStl, setFileUploadPercentageStl] = useState(0);
  const [stlFileError, setStlFileError] = useState();
  console.log("model", model);

  const uploadImageToBackend = (formData, index) => {
    console.log(
      "hereeeeeeeeeeeeeee",
      index,
      model.modelImages,
      selectedPictures
    );
    const config = {
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    };

    axios
      .post(
        `${process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE}/api/v1/model/${modelId}/upload-images/`,
        formData,
        config
      )
      .then((res) => {
        console.log("Res", res);
        console.log("hereeeeeeeeeeeeeee2", index, model.modelImages);
        dispatch(
          changeModelPicture({
            imageData: {
              imageUrl: res.data.imageUrl,
              imageId: res.data.imageID,
            },
            index: index,
          })
        );

        // dispatch(
        //   changeModelPictures([
        //     ...model.modelImages.slice(0, index),
        //     {
        //       imageUrl: res.data.imageUrl,
        //       imageId: res.data.imageId,
        //     },
        //     ...model.modelImages.slice(index + 1),
        //   ])
        // );
      })
      .catch((err) => {
        console.log("err", err);
        console.log("error index", index);
        // dispatch(
        //   changeModelPictures([
        //     ...model.modelImages.slice(0, index),
        //     {
        //       ...model.modelImages[index],
        //       status: "error",
        //     },
        //     ...model.modelImages.slice(index + 1),
        //   ])
        // );
      });
  };

  const handleUseAsCoverPhoto = (imageUrl) => {
    // TODO add axios call
    console.log("imageurl", imageUrl);
    axios
      .put(
        `${process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE}/api/v1/model/${modelId}/cover-image/?url=${imageUrl}`,
        {},
        { withCredentials: true }
      )
      .then((res) => {
        console.log("res", res);
        dispatch(changeCoverImage(imageUrl));
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const deleteImage = (uuid) => {
    // TODO add axios call
    axios
      .delete(
        `${process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE}/api/v1/model-Images/${modelId}?imageId=${uuid}`,
        { withCredentials: true }
      )
      .then((res) => {
        console.log("result==> ", res);
        console.log("index", index);
        dispatch(
          changeModelPictures(
            model.modelImages.filter((picture) => picture.uuid !== uuid)
          )
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleImageCrop = (height, width, x, y, uuid) => {
    return new Promise((resolve, reject) => {
      axios
        .put(
          `${process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE}/api/v1/update-cropped-url?modelId=${modelId}&imageId=${uuid}`,
          { height, width, x, y },
          { withCredentials: true }
        )
        .then((res) => {
          console.log("result ", res);
          dispatch(
            changeModelPictures(
              model.modelImages.map((picture) => {
                if (picture.imageId === uuid) {
                  return { ...picture, croppedUrl: res.data.croppedUrl };
                } else return picture;
              })
            )
          );
          resolve();
        })
        .catch((err) => {
          console.log(err);
          reject();
        });
    });
  };

  const uploadFileToBackend = (formData, fileName, fileType) => {
    const newController = new AbortController();
    setController(newController);
    console.log("fileName", fileName, "fileType", fileType);
    if (fileType === "glb") {
      console.log("glb1");
      dispatch(changeGlbFile({ name: fileName, status: "uploading" }));
    } else if (fileType === "stl") {
      console.log("stl1");
      dispatch(changeStlFile({ name: fileName, status: "uploading" }));
    }
    const config = {
      headers: {
        // Accept: "application/json",
        "Content-Type": "application/zip",
        // "Content-Encoding": "gzip",
      },
      signal: newController.signal,
      onUploadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        const progress = Math.round((loaded / total) * 100);
        if (fileType === "glb") {
          setFileUploadPercentageGlb(progress);
        } else if (fileType === "stl") {
          setFileUploadPercentageStl(progress);
        }
        console.log("progress", progress);
      },
    };
    axios
      .get(
        `${process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE}/api/v1/model/${modelId}/upload/url?fileName=${fileName}&fileType=${fileType}`,
        { withCredentials: true }
      )
      .then((res) => {
        console.log("res", res);
        const presignedurl = res.data.presignedurl;
        axios
          .put(presignedurl, formData, config)
          .then((res) => {
            console.log("Res2", res);
            axios
              .post(
                `${process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE}/api/v1/model/${modelId}/file?&fileType=${fileType}&fileName=${fileName}`,
                {},
                { withCredentials: true }
              )
              .then((res) => {
                console.log("res", res);
                if (fileType === "glb") {
                  console.log("glb2");
                  dispatch(
                    changeGlbFile({ name: fileName, status: "uploaded" })
                  );
                } else if (fileType === "stl") {
                  console.log("stl2");
                  dispatch(
                    changeStlFile({ name: fileName, status: "uploaded" })
                  );
                }
              })
              .catch((err) => {
                console.log("err", err);
                if (fileType === "glb") {
                  console.log("glb2");
                  dispatch(changeGlbFile({ name: fileName, status: "error" }));
                } else if (fileType === "stl") {
                  console.log("stl2");
                  dispatch(changeStlFile({ name: fileName, status: "error" }));
                }
              });
          })
          .catch((err) => {
            console.log("err", err);
          });
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const cancelFileUpload = (fileType) => {
    console.log("cancel");
    if (fileType === "glb") {
      console.log("glb2");
      dispatch(changeGlbFileStatus("error"));
      setFileUploadPercentageGlb(0);
    } else if (fileType === "stl") {
      console.log("stl2");
      dispatch(changeStlFileStatus("error"));
      setFileUploadPercentageStl(0);
    }
    controller.abort();
  };

  useEffect(() => {
    // dispatch(
    //   changeModelPictures([
    //     {
    //       image: "https://ucarecdn.com/48458a63-5924-45ae-aa97-3feb43b38bc5/",
    //       uuid: 1,
    //     },
    //     {
    //       image: "https://ucarecdn.com/48458a63-5924-45ae-aa97-3feb43b38bc5/",
    //       uuid: 2,
    //     },
    //   ])
    // );
    // dispatch(
    //   changeCoverImage(
    //     "https://ucarecdn.com/48458a63-5924-45ae-aa97-3feb43b38bc5/"
    //   )
    // );
  }, []);

  return (
    <div className="flex flex-col w-full gap-5">
      <div className="flex flex-col gap-2 w-full">
        <SectionLayout
          heading="Add glb files"
          subHeading="If possible, include images to show them what your project is all about and what rewards look like."
        >
          <div className="grid grid-cols-2 gap-5">
            <div>
              {stlFileError}
              <UploadFile
                fileExtesions={["glb"]}
                fileType="glb"
                file={model?.modelFileUrl?.glb}
                setFile={setFiles}
                uploadFileToBackend={(formData, fileName) =>
                  uploadFileToBackend(formData, fileName, "glb")
                }
                fileUploadPercentage={fileUploadPercentageGlb}
                setFileError={setStlFileError}
                cancelSource={() => cancelFileUpload("glb")}
                // retryFileUpload={() =>}
              />
            </div>
            <div className="grid gap-5">
              <p className="font-medium">
                You can upload your model as an archive (.zip or .rar preferred)
                or as separate files (.obj, .fbx, .stl, etc.). Add previews in
                .png or .jpeg file formats.
              </p>
              <div className="grid gap-3">
                <p>
                  Simply drag & drop your model folder on this page to upload.
                </p>
                <ul className="ml-5 list-disc">
                  <li>Zip file size limit: 5.00 GB</li>
                  <li>Single file size limit: 500 MB</li>
                </ul>
              </div>
            </div>
          </div>
        </SectionLayout>
      </div>
      <div className="flex flex-col gap-2 w-full">
        {modelErrors?.uploadFiles && modelErrors?.uploadFiles?.images && (
          <div className="bg-backgroundGrayLight border-[1px] border-borderGray p-5 font-medium">
            {modelErrors.uploadFiles.images}
          </div>
        )}
        <SectionLayout
          heading="Upload Images"
          subHeading="Add clear images and test prints of your model."
        >
          <ImageGallery
            pictures={model.modelImages}
            setPictures={(pictures) => {
              console.log("pictures", pictures);
              dispatch(changeModelPictures(pictures));
            }}
            uploadImageToBackend={uploadImageToBackend}
            coverImage={model.coverImage}
            handleUseAsCoverPhoto={handleUseAsCoverPhoto}
            deleteImage={deleteImage}
            handleImageCrop={handleImageCrop}
            aspectRatio={5 / 3}
          />
        </SectionLayout>
      </div>
      <div className="flex flex-col gap-2 w-full">
        {modelErrors?.uploadFiles && modelErrors?.uploadFiles?.stl && (
          <div className="bg-backgroundGrayLight border-[1px] border-borderGray p-5 font-medium">
            {modelErrors.uploadFiles.stl}
          </div>
        )}
        <SectionLayout
          heading="Upload model files"
          subHeading="If possible, include images to show them what your project is all about and what rewards look like."
        >
          <div className="grid grid-cols-2 gap-5">
            <div>
              {stlFileError}
              <UploadFile
                fileExtesions={["obj", "fbx", "stl"]}
                fileType="stl"
                file={model?.modelFileUrl?.stl}
                setFile={setFiles}
                uploadFileToBackend={(formData, fileName) =>
                  uploadFileToBackend(formData, fileName, "stl")
                }
                fileUploadPercentage={fileUploadPercentageStl}
                setFileError={setStlFileError}
                cancelSource={() => cancelFileUpload("stl")}
                // retryFileUpload={() =>}
              />
            </div>
            <div className="grid gap-5">
              <p className="font-medium">
                You can upload your model as an archive (.zip or .rar preferred)
                or as separate files (.obj, .fbx, .stl, etc.). Add previews in
                .png or .jpeg file formats.
              </p>
              <div className="grid gap-3">
                <p>
                  Simply drag & drop your model folder on this page to upload.
                </p>
                <ul className="ml-5 list-disc">
                  <li>Zip file size limit: 5.00 GB</li>
                  <li>Single file size limit: 500 MB</li>
                </ul>
              </div>
            </div>
          </div>
        </SectionLayout>
      </div>
      <ModelUploadNextButton
        pageTitle="Basics"
        handleNextClick={() => {
          handleModelSave();
          router.push(`/my-nest/models/upload/${modelId}/basics`);
        }}
      />
    </div>
  );
};
export default ModelUploadFiles;
