import React, { useState, useEffect } from 'react'
import { useInView } from 'react-intersection-observer';
import { useDispatch, useSelector } from "react-redux";
import { changeSection } from '../store/sectionSlice';
import { changeBasicsMetaData } from '../store/campaignSlice';
import ImageSelector from './ImageSelector'
import axios from 'axios';
import { useRouter } from 'next/router';

const BasicsMetaData = (props) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [imageSelector, setImageSelector] = useState(false);
    const [metaImageName, setMetaImageName] = useState();
    const [uploadedImagesOnServer, setUploadedImagesOnServer] = useState();
    const menuClick = useSelector((state) => state.section.menuClick)
    const { ref, inView } = useInView({ threshold: 0.7 });
    const metaData = props.metaData;

    // const imageHandler = (e) => {
    //     if (e.target.files && e.target.files.length > 0) {
    //         props.setMetaImage(URL.createObjectURL(e.target.files[0]));
    //     }
    // }

    if (inView && !menuClick) {
        // console.log("AboutModel")
        dispatch(changeSection("MetaData"));
    }

    const getImagesUrl = async () => {
        console.log("rouer query", props.campaignId);
        // if (typeof props.campaignId === "undefined") {
        //     props.campaignId = router.query.id;
        // }
        await axios.get(`${process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE}/api/v1/campaigns/${props.campaignId}/details`, { withCredentials: true })
            .then(response => {
                setUploadedImagesOnServer(response.data.campaignAssets.campaignImages);
                console.log("result in metadata page", response.data.campaignAssets.campaignImages);
            })
            .catch(err => {
                // Handle errors
                console.error(err);
            });
    }

    const inputHandler = (e) => {
        props.setSave(false);
        let value, name;
        value = e.target.value;
        name = e.target.name;

        if (name === "title") {
            props.setMetaTitle(value);
        }
        else if (name === "description") {
            props.setMetaDescription(value);
        }
        dispatch(changeBasicsMetaData({ ...metaData, [name]: value }));
        console.log("meta data", metaData);
        console.log(dispatch(changeBasicsMetaData({ ...metaData, [name]: value })));
    }


    return (
        <>
            <div className='flex justify-center'>
                <div className='bg-white  md:ml-32 lg:ml-8  rounded-[2px] lg:pl-4 mb-2 w-full md:w-[64%]' ref={ref} id="AboutCampaign">
                    <div className='mt-7 ml-4 text-base font-[550]'>Meta Data (optional)</div>
                    <div className=' w-full md:w-[85%] lg:w-[45%] px-8 lg:px-6 mb-4'>
                        <div className='mt-2 sm:mt-4'>
                            <p className='mb-1 sm:mb-3 text-sm font-[500]'>Title</p>
                            <input className={`w-[95%] h-[2rem] sm:w-full mr-2 rounded-sm border-[1.5px] px-2 py-1 focus:ring-1 focus:ring-primary-brand outline-none`} id='title' name='title' defaultValue={metaData !== undefined && metaData.title !== undefined ? metaData.title : ""} onChange={inputHandler} />
                        </div>

                        <div className='mt-4'>
                            <p className='mb-1 sm:mb-2 text-sm font-[500]'>Description</p>
                            <input className={'w-[95%] h-[2rem] sm:w-full mr-2 rounded-sm border-[1.5px] px-2 py-1 focus:ring-1 focus:ring-primary-brand outline-none'} id="description" type="text" name="description" defaultValue={metaData !== undefined && metaData.description !== undefined ? metaData.description : ""} onChange={inputHandler}></input>
                        </div>

                        <div className='mt-4'>
                            <p className='mb-1 sm:mb-2 text-sm font-[500]'>Image</p>
                            <div className='flex flex-col'>
                                <div className='w-[80%] mb-2'>
                                    <button className='bg-primary-brand hover:bg-sky-500 px-6 py-1 md:py-2 text-xs lg:text-sm text-white rounded-sm  max-h-[2.5rem]' onClick={() => { setImageSelector(true); console.log("imageSelector", imageSelector); getImagesUrl(); }}>Select Image</button>
                                </div>
                                <span className='text-sm'>{metaImageName}</span>
                            </div>
                            {(imageSelector && uploadedImagesOnServer !== undefined) ? <ImageSelector setMetaImageName={setMetaImageName} setSave={props.setSave} metaImage={props.metaImage} setMetaImage={props.setMetaImage} uploadedImagesOnServer={uploadedImagesOnServer} imageSelector={imageSelector} setImageSelector={setImageSelector} metaData={metaData} buttonName={"Set as Meta Image"} metaCompo={true} tierCompo={false} /> : ""}
                        </div>
                    </div>


                    <div className={`${(metaData !== "" && props.metaImage !== "" && props.metaDescription !== "" && props.metaTitle !== "") ? "mt-4 mb-7 ml-8 w-[80%]" : "hidden"}`}>
                        <p className='mb-1 sm:mb-2 text-sm font-[500]'>Preview</p>
                        <div className='flex relative rounded-[5px] border-2'>
                            <div className='flex-col w-[50%]'>
                                <img className='h-[250px] w-[350px] rounded-[3px_1.5px_1.5px_3px]' src={props.metaImage} alt="" />
                            </div>

                            <div className='w-[40%] mb-2 mt-8 mr-5'>
                                <div className='font-bold ml-5 text-xl line-clamp-2'>
                                    {props.metaTitle}
                                </div>
                                <div className='ml-5 mt-1 text-sm line-clamp-5 '>
                                    {props.metaDescription}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='w-[0%] lg:w-[45%]'></div>
            </div>
        </>
    )
}

export default BasicsMetaData
