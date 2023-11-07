import React, { useState } from "react";
import FileUpload from "../icons/FileUpload";
import FileUpload2 from "../icons/FileUpload2";
import TrashIcon from "../icons/TrashIcon";
import RetryIcon from "../icons/RetryIcon";
import CancelIcon from "../icons/CancelIcon";
import JSZip from "jszip";
import PictureIcon from "../icons/PictureIcon";
import UploadArrow from "../icons/UploadArrow";

const UploadFile = (props) => {
  const [file, setFile] = useState();
  const [uploadedPercentage, setUploadedPercentage] = useState(0);

  const checkFileAndUpload = (file) => {
    if (isZippedFileValid(file)) {
      setFile(file);
      uploadFile(file);
    } else {
      console.log("An error occurred");
    }
  };

  const uploadFile = (file) => {
    const formData = new FormData();
    formData.append("file", file);
    console.log(formData)
    props.uploadFileToBackend(formData, file.name);
  };

  const isZippedFileValid = async (file) => {
    const extension = file.name.split(".").at(-1);
    if (extension !== "rar" && extension !== "zip") {
      props.setFileError("Unsupported File Type");
      return false;
    } else if (file.size > 5368709120) {
      props.setFileError("File Size Greater");
      return false;
    }
    try {
      const zip = new JSZip();
      const zipData = await zip.loadAsync(file);
      for (const [relativePath, zipEntry] of Object.entries(zipData.files)) {
        if (!zipEntry.dir) {
          const fileExtension = relativePath.split(".").at(-1);
          if (!props.fileExtesions.includes(fileExtension)) {
            props.setFileError("Unsupported File Type");
            return false;
          }
        }
      }
      console.log("valid files");
      return true;
    } catch {
      console.log("zipping error files");
      return false;
    }
  };

  const dropHandler = (event) => {
    event.preventDefault();
    
    checkFileAndUpload(event.dataTransfer.files[0]);
  };

  const handleFileInput = (event) => {
    checkFileAndUpload(event.target.files[0]);
  };

  return (
    <div className="h-full w-full bg-light-neutral-50 rounded-[10px] ">
      {console.log(`Extensions .${props?.fileExtesions?.join(", .")}`)}
      {console.log(`FileError .${props?.fileError}`)}
      <input
        type="file"
        id={`fileInput-${props.fileType}`}
        className="hidden"
        // accept=".zip,.rar"
        accept=".glb"
        onChange={handleFileInput}
      />
      {props?.file?.name ? (
        <div
          className="grid gap-3  px-5 py-4"
          onDragOver={(event) => event.preventDefault()}
          onDrop={dropHandler}
        >
          <div className="flex justify-between">
            <span>1 File uploaded</span>
            <label
              htmlFor={`fileInput-${props.fileType}`}
              className="flex items-center gap-1 cursor-pointer"
            >
              <div className="h-5 w-5">
                <PictureIcon />
              </div>
              Add more files
            </label>
          </div>
          <div className="grid gap-4 h-[15rem] overflow-hidden overflow-y-auto no-scrollbar">
            {props?.file?.status === "uploaded" ? (
              <div className="flex items-center gap-2 h-fit">
                <div className="h-6 w-6 aspect-square">
                  <FileUpload2 />
                </div>
                <div className="grow break-all">{props.file.name}</div>
                <div className="h-6 w-6 aspect-square cursor-pointer">
                  <TrashIcon />
                </div>
              </div>
            ) : props?.file?.status === "uploading" ? (
              <div className="flex items-end gap-2 h-fit">
                <div className="w-7 h-7">
                  <FileUpload2 />
                </div>
                <div className="grow grid gap-1">
                  <div className="flex justify-between text-[14px]">
                    <span>Uploading {props.file.name}</span>
                    <div>{props.fileUploadPercentage}%</div>
                  </div>
                  <div className="w-full">
                    <div className="w-full h-1 bg-borderGray">
                      <div
                        style={{ width: `${props.fileUploadPercentage}%` }}
                        className="h-full bg-black"
                      ></div>
                    </div>
                  </div>
                </div>
                <div
                  className="w-6 h-6 cursor-pointer"
                  onClick={props.cancelSource}
                >
                  <CancelIcon />
                </div>
              </div>
            ) : props?.file?.status === "error" ? (
              <div className="flex items-center gap-2 h-fit">
                <div className="h-6 w-6 aspect-square">
                  <FileUpload2 />
                </div>
                <div className="grow">{props.file.name}</div>
                <div
                  className="h-5 w-5 cursor-pointer"
                  onClick={() => uploadFile(file)}
                >
                  <RetryIcon />
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      ) : (
        <div
          className="border-2 border-light-neutral-700 border-dashed rounded-[10px] p-10 hover:bg-light-neutral-400 active:bg-light-neutral-700"
          onDragOver={(event) => event.preventDefault()}
          onDrop={dropHandler}
        >
          <div className="grid justify-items-center gap-[16px] w-fit mx-auto">
          <div className=" mt-[89px] border-[1px] p-[14px]  bg-white shadow-xs border-light-neutral-600 rounded-[100px]">
              <div className="h-[20px] w-[20px]">
                <UploadArrow />
              </div>
            </div>
            <div className="flex flex-col gap-[4px]">
              <p className="text-center text-dark-neutral-700 font-[500] text-lg">
                Drag and Drop or{" "}
                <label
                  htmlFor={`fileInput-${props.fileType}`}
                  className="text-primary-purple-600 cursor-pointer"
                >
                  choose your file
                </label>{" "}
                for upload
              </p>

              <p className="text-center mb-[89px]">
                <span className="text-dark-neutral-50 text-sm font-[500]">
                  OBJ, FBX, STL {"<="} 500 mb
                </span>
              </p>
              {/* <label
                htmlFor={`fileInput-${props.fileType}`}
                className="flex items-center bg-primary-brand text-white rounded-[5px] h-10 px-5 cursor-pointer"
              >
                Browse files
              </label> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadFile;
