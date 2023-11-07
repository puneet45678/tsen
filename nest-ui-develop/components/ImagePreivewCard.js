import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import CampaignImagesEditor from './CampaignImagesEditor';

const ImageCard = (props) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [indexShow, setIndexShow] = useState(null);
    const [showCrop, setShowCrop] = useState(false);
    // console.log("files in image card", props.images)
    const [asDp, setAsDp] = useState("")

    const handleEdit = (e, index) => {
        console.log("handleEdit called")
        setShowCrop(true);
        setSelectedImage(props.image);
        setIndexShow(props.index);
        console.log("selectedImage", props.index)
    }
    useEffect(() => {
        const handleEsc = (event) => {
            if (event.keyCode === 27) {
                setShowCrop(false);
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, []);

    console.log("Files wala arrayss", props.images, "Images url wala arrays", props.imagesUrl)
    console.log("")
    // setShowCrop(false)
    return (
        <div className='flex flex-col w-[12rem]  group lg:w-[14rem] h-[14rem] lg:h-[17rem] rounded-[2px] relative shadow-md hover:h-[17.2rem] hover-w-[14.4rem] transition-all ease-in-out duration-500 hover:shadow-lg'>
            <div className='w-full relative h-full rounded-[2px]'>
                <img src={props.image} alt="" id={props.index}
                    // className={`${(props.imagesUrl.name.find(props.imageName) !== undefined) ? "h-full w-full rounded-[2px]" : "h-full w-full rounded-[2px] brightness-50"}`}
                    className={`h-full w-full rounded-[2px] brightness-50`}
                    style={{ objectFit: "cover" }} />
            </div>
        </div>
    )
}

export default ImageCard