import React, { useState, useRef, useEffect } from 'react';
import ImgVidUpload from '../../Img-Vid-Upload';
import SectionLayout from '../../Layouts/SectionLayout';
import { changePreMarketing } from '../../../store/campaignSlice';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import dynamic from 'next/dynamic';
const QuillEditor = dynamic(() => import("../../QuillEditor"), {
  ssr: false,
});

const PreMarketing = (props) => {


  const preMark = useSelector((state)=>state.campaign.premarketing);
  const [coverImage, setCoverImage] = useState(preMark ? preMark.premarketingDp:null);
  const [coverVideo, setCoverVideo] = useState(preMark ? preMark.premarketingVideo:null);  
  const coverVideoRef = useRef(null);
  const dispatch = useDispatch();

  const handleBlur = (e) =>{

    let name = e.target.name;
    let val = e.target.value;
    
    props.setCampaignDataChanged(prevSet => new Set([...prevSet, name]));
    dispatch(changePreMarketing({...preMark, [name]:val}))    

  }
    
  const handleCoverVideoChange = () =>{
    setCoverImage(null); 
    setCoverVideo(coverVideoRef.current.value)       
    dispatch(changePreMarketing({...preMark, premarketingVideo: coverVideoRef.current.value, premarketingDp: null}))    
  }  

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

  const handleUploadedFiles = async (images, endPoint) => {
    
    let formData = new FormData();
    formData.append("file", images[0]);  
    
    const imgUrl =  await axios.post(`${process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE}/api/v1/campaigns/${props.campaignId}/image/${endPoint}`,formData,{
      withCredentials:true
    })    
    return imgUrl.data.imgUrl;
  };

  const handleCoverImageChange = async (e) =>{            

    setCoverVideo(null);

    const files = checkFiles(e.target.files);                

    const uploadedImgUrl = await handleUploadedFiles(files,'preMarketingImage');

    setCoverImage(uploadedImgUrl);
    
    dispatch(changePreMarketing({...props.campaignPreMarketing, premarketingDp: uploadedImgUrl, premarketingVideo: null}))    
    props.setPremarketingInvalid(prevSet => {
      const newSet = new Set(prevSet);
      newSet.delete('premarketingMedia');
      return newSet;
    })
         
  }

  const preMarkChildren = 
  <div className='flex flex-col gap-8'>
    <div className='flex flex-col gap-4'>      
      <label for="title" className='font-[500]'>Pre-marketing campaign title</label>              
      <input id="title" name='premarketingTitle' defaultValue={preMark ? preMark.premarketingTitle : ''} type='text' className='h-14 p-2 rounded-md border-2 border-borderGrayColor' onBlur={handleBlur}></input>
    </div>
    <div className='flex flex-col gap-4'>
      <div className='flex'>
        <h2 className='font-[500]'>Cover image *</h2>
        <span className={`text-red-600 ml-2 ${props.premarketingInvalid.has('premarketingMedia') && props.publishClicked ? '' : 'hidden'}`}>This field cannot be left empty</span>        
      </div>      
      <ImgVidUpload handleImageChange={handleCoverImageChange} handleVideoChange={handleCoverVideoChange} imageSrc={coverImage} videoSrc={coverVideo} coverImage={coverImage} coverVideo={coverVideo} coverVideoRef={coverVideoRef}/>
    </div>
    <div className='flex flex-col gap-4'>
      <div className='flex'>
        <label className='font-[500]'>Description *</label>
        <span className={`text-red-600 ml-2 ${props.premarketingInvalid.has('premarketingDescription') && props.publishClicked ? '' : 'hidden'}`}>This field cannot be left empty</span>                
      </div>            
      <div className='w-full min-h-[250px]'>
        {/* <QuillEditor
          value={preMark?.premarketingDescription}
          onChange={(value) =>
            dispatch(changePreMarketing({...preMark, 'premarketingDescription':value}))   
          }
          placeholder="The description of the project goes here..................."        
        /> */}
          <QuillEditor
            maxLength={20000}
            value={preMark?.premarketingDescription}
            onChange={(value) =>{
                if(value)
                  props.setPremarketingInvalid(prevSet => {
                    const newSet = new Set(prevSet);
                    newSet.delete('premarketingDescription');
                    return newSet;
                  })
                
                dispatch(changePreMarketing({...preMark, 'premarketingDescription':value}))   
              }
            }
            placeholder={""}
            imageSaveUrl={``}
            imageDeleteUrl={``}
          />
      </div>
    </div>
    <div className='flex items-center gap-2'>
      <input type='checkbox' className='w-5 h-5'/>
      <p className='font-[600]'>Add campaign story to my premarketing details</p>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" class="w-5 h-5">
        <title className='bg-[#cfcfcf] shadow-md rounded-md p-2'>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
        </title>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
      </svg>
    </div>
  </div>

  useEffect(()=>{
    console.log("preMark yoyo", preMark)
    setCoverImage(preMark.premarketingDp);
    setCoverVideo(preMark.premarketingVideo);
  },[preMark])

  return (
    <div className='bg-white h-auto'>
        <SectionLayout heading='Pre-marketing' subHeading="Add details about your campaign for marketing" children={preMarkChildren}/>        
    </div>
  )
}

export default PreMarketing