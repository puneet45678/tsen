import React, { useState } from "react";
import PlusBlue from "../icons/PlusBlue";
// import Content_Stl from "../public/SVG/Content_Stl.svg";
import UploadArrow from "../icons/UploadArrow";
import Trash from "../icons/Trash";
import Content from "../public/images/Content.png";
import Image from "next/image";

const UploadGlbFile = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const dropHandler = (event) => {
    event.preventDefault();
    checkFileAndUpload(event.target.files);
  };

  const handleFileInput = (event) => {
    event.preventDefault();
    checkFileAndUpload(event.target.files);
  };

  const checkFileAndUpload = (files) => {
    const fileList = Array.from(files);
    const validFiles = fileList.filter(
      (file) => file.size <= 500 * 1024 * 1024
    );
    setSelectedFiles((prevFiles) => [...prevFiles, ...validFiles]);
  };
  const formatFileSizeInMB = (sizeInBytes) => {
    const megabyte = 1024 * 1024;
    const sizeInMB = (sizeInBytes / megabyte).toFixed(2);
    return `${sizeInMB} MB`;
  };
  const deleteFile = (fileName) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  };

const renderUploadedFiles = () => {
    return (
      <>
      
        <div className="grid gap-4 relative h-[15rem] overflow-hidden overflow-y-auto no-scrollbar bg-white">
          {/* for each file */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-6">
            {selectedFiles.map((file) => (
              <div key={file.name} className="flex mt-[39px]">
                <div className="flex items-center w-[385px] h-[80px]  border-light-neutral-700 border-[1px] bg-white rounded-[10px] shadow-xs relative">
                  <div className="m-4">
                    <Image
                      src={Content}
                      alt="Content"
                      className="w-[36px] h-[42px]"
                    />
                  </div>

                  <div className="flex flex-col flex-grow">
                    <div className="text-sm font-medium text-dark-neutral-700">
                      {file.name}
                    </div>
                    <div className="absolute top-0 right-0 mr-4 mt-4 w-[20px] h-[20px]">
                      <div
                        className="h-6 w-6  text-white p-1 rounded-[5px] cursor-pointer"
                        onClick={() => deleteFile(file.name)}
                      >
                        <Trash />
                      </div>
                    </div>
                    <div className="text-sm text-dark-neutral-50 font-[400]">
                      {formatFileSizeInMB(file.size)}
                    </div>
                    {/* loader */}
                    <div className="w-[90%] bg-primary-purple-50 rounded-full h-2.5 mt-2 ">
                      <div
                        className="bg-primary-purple-600 h-2.5 rounded-full"
                        style={{ width: "75%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* <div className="absolute top-0 right-0  mr-2">
            <div className="flex items-center">
              <div className="w-4 h-4 mr-[6px]">
                <PlusBlue />
              </div>
              <label
                htmlFor="fileInput"
                className="text-button-text-sm text-primary-purple-500 font-semibold cursor-pointer"
              >
                Add more files
              </label>{" "}
            </div>
          <input
            type="file"
            id="fileInput"
            accept=".glb"
            className="hidden"
            onChange={handleFileInput}
            multiple
          />
          </div> */}
        </div>
      </>
    );
  };
  return (
    <div>
        <div className="mb-2 flex flex-row justify-between">
         <label className="font-[500] text-md text-dark-neutral-700 ">
                    Upload GLBs {"(optional)"}
        </label>
        {selectedFiles.length >=1 && (
        <div className=" mr-2">
            <div className="flex items-center">
              <div className="w-4 h-4 mr-[6px]">
                <PlusBlue />
              </div>
              <label
                htmlFor="fileInput"
                className="text-button-text-sm text-primary-purple-500 font-semibold cursor-pointer"
              >
                Add more files
              </label>{" "}
            </div>
          <input
            type="file"
            id="fileInput"
            accept=".glb"
            className="hidden"
            onChange={handleFileInput}
            multiple
          />
          </div>
          )}
        </div>
        
      {selectedFiles.length === 0 ? (
        <div
          className="border-2 border-light-neutral-700 border-dashed rounded-[10px] p-10 hover:bg-light-neutral-400 active:bg-light-neutral-700 bg-light-neutral-50"
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
                  htmlFor="fileInput"
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
              <input
                type="file"
                id="fileInput"
                accept=".glb"
                className="hidden"
                onChange={handleFileInput}
                multiple
              />
            </div>
          </div>
        </div>
      ) : (
        renderUploadedFiles()
      )}
    </div>
  );
};

export default UploadGlbFile;
