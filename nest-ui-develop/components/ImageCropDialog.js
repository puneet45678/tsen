import { useState, useEffect, useRef } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import axios from "axios";
import CircularLoading from "../components/skeletons/CircularLoading";

const UploadImage = (props) => {
    const [image, setImage] = useState("");
    const [cropper, setCropper] = useState();
    const [loading, setLoading] = useState(false);
    const [originalData, setOriginalData] = useState({ width: 0, height: 0 });

    const containerRef = useRef();

    // const fileInputHandler = (event) => {
    //   props.setPicture(event.target.files[0]);
    //   const reader = new FileReader();
    //   reader.onload = () => {
    //     setImage(reader.result);
    //   };
    //   reader.readAsDataURL(event.target.files[0]);
    // };
    const handleImageLoad = (e) => {
        setOriginalData({
            width: e.target.naturalWidth,
            height: e.target.naturalHeight,
        });
    };

    const getCroppedImage = async () => {
        if (typeof cropper !== "undefined") {
            setLoading(true);
            const croppedCanvas = cropper.getData();
            console.log("data of cropped", cropper.getData());
            const updatedWidth = parseInt(croppedCanvas.width);
            const updatedHeight = parseInt(croppedCanvas.height);
            console.log(
                "original Width",
                originalData.width,
                " original Height",
                originalData.height
            );
            console.log(
                "updated width",
                updatedWidth,
                " updated height",
                updatedHeight
            );

            let getCampaignDp = await axios.get(
                `${process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE}/api/v1/campaigns/${props.campaignId}/display-picture`,
                {
                    withCredentials: true,
                }
            );
            // if (props.imagesUrl[props.index].url === getCampaignDp.data) {
            //   axios.post
            // }
            axios.put(
                `${process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE}/api/v1/campaigns/${props.campaignId}/asset-url/${props.imageUuid}?height=${updatedHeight}&width=${updatedWidth}`,
                {
                    withCredentials: true,
                }
            )
                .then((res) => {
                    console.log("response", res);
                    props.setShowCrop(false);
                    props.imagesUrl[props.index].url = res.data;
                    console.log("image url  data", props.imagesUrl[props.index]);
                })
                .catch((err) => {
                    console.log("error", err);
                    // props.setShowCrop(false);
                });
        }
    };


    return (
        <div
            className="fixed w-[100vw] h-[100vh] top-0 left-0 z-40 bg-cropper-background flex items-center justify-center rounded-sm"
            ref={containerRef}
        >
            <div className="relative bg-dark-primary-2 flex flex-col p-8 h-[85%] w-[85%] rounded-sm">
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
                        aspectRatio={1}
                        src={props.picture}
                        zoomTo={0.1}
                        viewMode={2}
                        minCropBoxHeight={100}
                        checkOrientation={false}
                        onInitialized={(instance) => {
                            setCropper(instance);
                        }}
                        guides={false}
                        ready={handleImageLoad}
                    />
                </div>
                <div className="flex flex-col md:flex-row items-center justify-between w-full text-[14px] sm:text-[16px] mt-3">
                    <div className="flex flex-col sm:flex-row font-medium w-full md:w-max">
                        <button
                            className="text-primary-brand py-2 px-16 border-[1px] border-primary-brand rounded-sm sm:mr-2 mb-2 sm:mb-0 w-full sm:w-1/2 md:w-max"
                            onClick={() => {
                                props.setShowCrop(false);
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            className="bg-primary-brand text-white rounded-sm py-2 px-16 w-full sm:w-1/2 md:w-max"
                            onClick={getCroppedImage}
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UploadImage;
