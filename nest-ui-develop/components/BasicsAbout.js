import React, { useState, useEffect, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import { useDispatch, useSelector } from "react-redux";
import { changeSection } from "../store/sectionSlice";
import { changeBasicsAbout } from "../store/campaignSlice";
import axios from "axios";
import { changeCampaignAssests } from "../store/campaignSlice";
import ImageGalleryViewer from "./ImageGalleryViewer";
import { useRouter } from "next/router";

const AboutCampaign = (props) => {
  const router = useRouter();
  const [showAlert, setShowAlert] = useState(false);
  const [linkValid, setLinkValid] = useState(false);
  const dispatch = useDispatch();
  const menuClick = props.menuClick;
  const aboutDetails = props.aboutDetails;
  const [dp, setAsDp] = useState("");
  const [loading, setLoading] = useState(false);
  const campaignAssetsRedux = useSelector(
    (state) => state.campaign.campaignAssets.campaignImages
  );
  let imagesUrl = [];
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({
    threshold: 0.5,
  });

  if (inView && !menuClick) {
    // console.log("AboutModel")
    dispatch(changeSection("AboutCampaign"));
  }

  const uploadToBackend = (formData, imageName) => {
    let isUploading = true;
    // console.log("imageName-->", imageName);
    // console.log(formData.getAll("file"));
    const config = {
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (isUploading) {
          const { loaded, total } = progressEvent;
          const progress = Math.round((loaded / total) * 100);
          // console.log(`Upload progress: ${progress}%`);
          document.getElementById(imageName + "image");
          document.getElementById(imageName + "button").classList.add("hidden");
          document
            .getElementById(imageName + "image")
            .classList.remove("hidden");
          // setLoading(true);
        }
      },
    };

    axios
      .post(
        `${process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE}/api/v1/campaigns/${props.campaignId}/campaign-assets`,
        formData,
        config
      )
      .then((res) => {
        // console.log(" result", res.status)
        imagesUrl = [...imagesUrl, res.data];
        console.log("result==> ", res.data, " image url", imagesUrl);
        props.setImagesUrl(props.imagesUrl.concat(imagesUrl));
        // console.log("typeofImagesUrl", props.imagesUrl);
        // console.log("e59f4410a1b9 local", imagesUrl);

        isUploading = false;
        // setLoading(false);
        document.getElementById(imageName + "image").classList.add("hidden");
        document
          .getElementById(imageName + "button")
          .classList.remove("hidden");
        document
          .getElementById(imageName + "success")
          .classList.remove("hidden");
        console.log(
          dispatch(changeCampaignAssests(...campaignAssetsRedux, res.data)),
          "imagesUrl-->",
          imagesUrl
        );
      })
      .catch((err) => {
        console.log(err);
        isUploading = false;
        // setLoading(false);
        document.getElementById(imageName + "image").classList.add("hidden");
        document
          .getElementById(imageName + "image")
          .classList.add("border-2", "border-red-500", "brightness-75");
        document.getElementById(imageName + "error").classList.remove("hidden");
      });
  };

  const handleUploadedFiles = (images) => {
    let imagesArray = [];
    for (let image of images) {
      let formData = new FormData();
      formData.append("file", image);
      imagesArray.push({
        image: URL.createObjectURL(image),
        name: image.name,
        size: image.size,
      });
      uploadToBackend(formData, image.name);
    }
    props.setUploadedFiles((current) => [...current, ...imagesArray]);
  };

  const checkDroppedFiles = (dataFiles) => {
    let finalFiles = [];
    for (let file of dataFiles) {
      let extension = file.name.split(".").at(-1);
      if (
        (extension === "png" || extension === "jpg" || extension === "jpeg") &&
        file.size <= 11000000
      )
        finalFiles.push(file);
    }
    return finalFiles;
  };

  function dragOverHandler(event) {
    event.preventDefault();
  }

  const fileInputHandler = (event) => {
    let files = checkDroppedFiles(event.target.files);
    if (files.length === 0) return;
    handleUploadedFiles(files);
    props.setFiles((current) => [...current, ...files]);
    // console.log("FILES-->>>", props.files);
    props.setIsImageChanged(true);
    props.setSave(true);
  };

  const dropHandler = (event) => {
    event.preventDefault();
    const files = checkDroppedFiles(event.dataTransfer.files);
    if (files.length === 0) return;
    handleUploadedFiles(files);
    props.setFiles((current) => [...current, ...files]);
    props.setIsImageChanged(true);
    props.setSave(false);
  };

  const inputHandler = (e) => {
    let nam, val;
    nam = e.target.name;
    val = e.target.value;
    props.setSave(false);
    if (nam === "campaignVideo") {
      setLinkValid(false);
    }
    console.log(dispatch(changeBasicsAbout({ ...aboutDetails, [nam]: val })));
  };

  const validateYouTubeUrl = (e) => {
    var url = document.getElementById("youTubeUrl").value;
    if (url === "") {
      // alert('Enter a valid URL of YouTube or Vimeo Video');
      setLinkValid(false);
      setShowAlert(true);
      return;
    }
    let a = url.match(
      /(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/
    );
    console.log("url", a[3]);
    if (a !== null && a[3] === "youtube.com") {
      if (url != undefined || url != "") {
        // var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
        // var match = url.match(regExp);
        // if (match && match[2].length == 11) {
        //   document.getElementById("videoObject").setAttribute('src', 'https://www.youtube.com/embed/' + match[2] + '?autoplay=1&enablejsapi=1');
        //   setLinkValid(true);
        // } else {
        //   setLinkValid(false);
        //   setShowAlert(true);
        //   // alert('Enter a valid URL of YouTube Video');
        // }
        const validYouTubeEmbedLinkRegex =
          /^https:\/\/www\.youtube\.com\/embed\/[A-Za-z0-9_-]{11}$/;

        if (!validYouTubeEmbedLinkRegex.test(url)) {
          setShowAlert(true);
        }

        try {
          const urlObj = new URL(url);
          if (
            urlObj.hostname !== "www.youtube.com" ||
            urlObj.pathname.split("/")[1] !== "embed"
          ) {
            setShowAlert(true);
            setLinkValid(false);
          }
        } catch (error) {
          setShowAlert(true);
          setLinkValid(false);
        }

        setLinkValid(true);
        setShowAlert(false);
        document
          .getElementById("videoObject")
          .setAttribute("src", url + "?autoplay=1&enablejsapi=1");
      }
    } else if (a !== null && a[3] === "vimeo.com") {
      console.log(
        /^(http\:\/\/|https\:\/\/)?(www\.)?(vimeo\.com\/)([0-9]+)$/.test(url)
      );
      if (
        /^(http\:\/\/|https\:\/\/)?(www\.)?(vimeo\.com\/)([0-9]+)$/.test(url)
      ) {
        setLinkValid(true);
        document
          .getElementById("videoObject")
          .setAttribute("src", "//player.vimeo.com/video/" + a[6]);
        // console.log(document.getElementById("videoObject"));
      } else {
        setLinkValid(false);
        setShowAlert(true);
        // alert('Enter a valid URL of Vimeo Video');
      }
    } else {
      setShowAlert(true);
      // alert('Enter a valid URL of YouTube or Vimeo Video');
    }
    props.setSave(false);
  };

  useEffect(() => {
    console.log(
      "campaignAssetredux",
      campaignAssetsRedux,
      "imagesUrl",
      props.imagesUrl
    );
  }, [campaignAssetsRedux]);

  return (
    <div className="flex justify-center mt-4">
      <div
        className="bg-white md:ml-32 lg:ml-8  rounded-[2px] lg:pl-4 mb-2 w-full md:w-[65%]"
        ref={ref}
        id="AboutCampaign"
      >
        <div className="mt-7 ml-4 text-base font-[550]">About Campaign</div>
        <div className=" w-full md:w-[85%] lg:w-[45%] px-8 lg:px-6 md:mb-7">
          <div className="mt-2 sm:mt-4">
            <p className="mb-1 sm:mb-2 text-sm font-[500]">Campaign Name</p>
            <input
              className={`w-[95%] h-[2rem] sm:w-full rounded-sm border-[1.5px] px-2 py-1 focus:ring-1 focus:ring-primary-brand outline-none`}
              id="title"
              type="text"
              defaultValue={
                aboutDetails !== undefined && aboutDetails.title !== undefined
                  ? aboutDetails.title
                  : ""
              }
              name="title"
              onChange={inputHandler}
            ></input>
          </div>
          <div className="mt-4">
            <p className="mb-1 sm:mb-2 text-sm font-[500]">Category</p>
            <input
              className={`w-[95%] h-[2rem] sm:w-full rounded-sm border-[1.5px] px-2 py-1 focus:ring-1 focus:ring-primary-brand outline-none`}
              id="category"
              type="text"
              defaultValue={
                aboutDetails !== undefined &&
                aboutDetails.category !== undefined
                  ? aboutDetails.category
                  : ""
              }
              name="category"
              onChange={inputHandler}
            ></input>
          </div>

          <div className="mt-4 focus:ring-1 focus:ring-primary-brand">
            <p className="mb-1 sm:mb-2 text-sm cursor-default font-[450]">
              Campaign Card Image
            </p>
            <div
              className="flex flex-col justify-center items-center h-52 w-[95%] sm:w-full border-[1.5px] relative rounded-sm bg-white"
              onDrop={dropHandler}
              onDragOver={dragOverHandler}
            >
              <div className="flex flex-col">
                <div className="flex flex-col items-center justify-center mb-4">
                  <div className="relative mb-2">
                    <img
                      src="/images/image.svg"
                      alt="Drag And Drop"
                      height={30}
                      width={30}
                    />
                  </div>
                  <div className="text-center text-sm">
                    <p>Drag & Drop</p>
                    <p>Image(.png, .jpg, .jpeg)</p>
                  </div>
                </div>
                <input
                  type="file"
                  id="campaign images"
                  className="hidden focus:ring-1 focus:ring-primary-brand"
                  accept="image/png, image/jpg, image/jpeg"
                  onChange={fileInputHandler}
                  multiple
                />
                <label
                  htmlFor="campaign images"
                  className={`${
                    props.files.length === 0
                      ? " w-[85%] font-[550] text-sm text-black bg-[#E7E9EC] mx-auto text-center px-3 py-1 rounded-sm cursor-pointer hover:bg-primary-brand hover:text-white hover:border-primary-brand"
                      : "hidden"
                  }`}
                >
                  Upload images
                </label>
                <button
                  onClick={() => props.setIsImageChanged(true)}
                  className={`${
                    props.files.length > 0
                      ? " w-[95%] font-[550] text-sm text-black bg-[#E7E9EC] mx-auto text-center px-3 py-1 rounded-sm cursor-pointer hover:bg-primary-brand hover:text-white hover:border-primary-brand"
                      : "hidden"
                  }`}
                >
                  Upload & Show images
                </button>
              </div>
              <p className="absolute bottom-2 text-sm">
                {(props.files.length &&
                  typeof campaignAssetsRedux === "undefined") === 0
                  ? "No File Chosen"
                  : props.files.length === 1
                  ? `1 File Added`
                  : `${props.files.length} Files Added`}
              </p>
            </div>
          </div>

          <div className="mt-4 ">
            <p className="mb-1 sm:mb-2 text-sm font-[500]">
              Campaign Video (Optional)
            </p>
            <div className="flex ">
              <div className=" w-[80%]">
                <input
                  className={
                    "w-full h-[2rem] mr-2 rounded-sm border-[1.5px] px-2 py-1 focus:ring-1 focus:ring-primary-brand outline-none"
                  }
                  id="youTubeUrl"
                  type="text"
                  name="campaignVideo"
                  defaultValue={
                    aboutDetails !== undefined &&
                    aboutDetails.campaignVideo !== undefined
                      ? aboutDetails.campaignVideo
                      : ""
                  }
                  onChange={inputHandler}
                ></input>
              </div>
              <div className="mt-auto flex ml-4 justify-end w-[20%]">
                <button
                  className="bg-gray-400 text-white px-1 h-[2rem] rounded-sm w-22 text-xs"
                  onClick={validateYouTubeUrl}
                >
                  Validiate
                </button>
              </div>
            </div>
            <div>
              <iframe
                className={`${
                  linkValid === false ? "hidden" : " mt-4 rounded-sm"
                }`}
                id="videoObject"
                type="text/html"
              ></iframe>
            </div>

            {showAlert === true ? (
              <>
                <div>
                  <div className="fixed inset-0 flex justify-center opacity-75 bg-black z-40"></div>
                  <div className="fixed bottom-[50%] bg-white opacity-100 w-fit h-auto z-50 mx-auto left-0 right-0 rounded-sm">
                    <div className="flex flex-col justify-center">
                      <div className="mt-4 mx-16" id="alert-message">
                        Enter a valid URL of YouTube or Vimeo Video
                      </div>
                      <div className="mt-7 mb-6 mx-auto flex flex-row justify-between gap-4">
                        <div className="">
                          <button
                            className="w-[70px] text-sm  text-white py-1 bg-red-500 hover:bg-red-400 "
                            onClick={() => {
                              setShowAlert(false);
                              console.log("okii pressed");
                            }}
                          >
                            Ok
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
        {props.isImageChanged ? (
          <ImageGalleryViewer
            campaignId={props.campaignId}
            loading={loading}
            count={count}
            setCount={setCount}
            fileInputHandler={fileInputHandler}
            handleUploadedFiles={handleUploadedFiles}
            notUploadedFiles={props.files}
            setFiles={props.setFiles}
            files={props.uploadedFiles}
            setFilesUploaded={props.setUploadedFiles}
            isImageChanged={props.isImageChanged}
            setIsImageChanged={props.setIsImageChanged}
            imagesUrl={props.imagesUrl}
            setImagesUrl={props.setImagesUrl}
            dp={dp}
            setAsDp={setAsDp}
          />
        ) : (
          ""
        )}
      </div>      
    </div>
  );
};

export default AboutCampaign;
