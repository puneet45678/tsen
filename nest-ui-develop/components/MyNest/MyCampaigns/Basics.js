import React, { useEffect, useState, useRef } from 'react'
import SectionLayout from '../../Layouts/SectionLayout';
import DatePicker from "react-datepicker";
import Image from 'next/image';
import CreatableSelect from 'react-select/creatable';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { changeBasics } from '../../../store/campaignSlice';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import BasicsMetaData from '../../BasicsMetaData';
import ImgVidUpload from '../../Img-Vid-Upload';
import { useFeedContext } from 'react-activity-feed';
import ImageGallery from '../../Image/ImageGallery';
import { changeBasicsImages, changeBasicsImage } from '../../../store/campaignSlice';

const Basics = (props) => {    

  const campaignBasics = useSelector((state)=>state.campaign.basics)
  const [launchDate, setLaunchDate] = useState(campaignBasics ? campaignBasics.launchDate ? campaignBasics.launchDate : new Date():new Date());
  const [disableTags, setDisableTags] = useState(false);
  const initialRender = useRef(0);
  const animatedComponents = makeAnimated();  
  const [ coverImage , setBasicsImage ] = useState();
  // const [coverImage, setCoverImage] = useState(campaignBasics && campaignBasics.coverImage ? campaignBasics.coverImage: null);
  // const [coverVideo, setCoverVideo] = useState(campaignBasics && campaignBasics.coverVideo ? campaignBasics.coverVideo: null);
  const [numberOfDays, setNumberOfDays] = useState(
    campaignBasics &&
    campaignBasics.launchDate &&
    campaignBasics.endingOn
    ? ()=>{console.log("campaignBasics.endingOn ", campaignBasics.endingOn); return campaignBasics.endingOn.getDate() - campaignBasics.launchDate.getDate()}
    : 0
    // ''
  );
  const [endDate ,setEndDate] = useState(campaignBasics && campaignBasics.launchDate ? campaignBasics.launchDate : new Date());  
  const [showMetaInputs, setShowMetaInputs] = useState(false);
  const [metaImage, setMetaImage] = useState(campaignBasics ? campaignBasics.metaImage : null);
  const metaImgRef = useRef(null);
  const [showMetaPreview, setShowMetaPreview] = useState();
  const coverVideoRef = useRef(null);

  const dispatch = useDispatch();

  let [options, setOptions] = useState([
    { value: 'ActionFigures', label: 'Action Figures'},
    { value: 'Aircrafts', label: 'Aircrafts'},
    { value: 'Architecture', label: 'Architecture'},
    { value: 'Art', label: 'Art'},
    { value: 'Boardgames', label: 'Boardgames'},
    { value: 'Cars', label: 'Cars'},
    { value: 'Diorama', label: 'Diorama'},
    { value: 'Education', label: 'Education'},
    { value: 'Fantasy', label: 'Fantasy'},
    { value: 'Fashion&accessories', label: 'Fashion & Accessories'},
    { value: 'Furniture', label: 'Furniture'},
    { value: 'Gadgets', label: 'Gadgets'},
    { value: 'Garden', label: 'Garden'},
    { value: 'Household&Kitchen', label: 'Household & Kitchen'},
    { value: 'Interior', label: 'Interior'},
    { value: 'Military', label: 'Military'},
    { value: 'Mythology', label: 'Mythology'},
    { value: 'PropsAndCosplay', label: 'Props and Cosplay'},
    { value: 'Sci-fi', label: 'Sci-fi'},
    { value: 'Ships&Submarines', label: 'Ships & Submarines'},
    { value: 'Space', label: 'Space'},
    { value: 'SportsAndOutdoors', label: 'Sports and Outdoors'},
    { value: 'TabletopRPG', label: 'Tabletop RPG'},
    { value: 'Technology', label: 'Technology'},
    { value: 'Tools', label: 'Tools'},
    { value: 'Toys', label: 'Toys'},
    { value: 'Trains', label: 'Trains'},
    { value: 'UtilityItems', label: 'Utility Items'},
    { value: 'Vehicle', label: 'Vehicle'},
    { value: '3DPrintingAccessories', label: '3D Printing Accessories'},   
  ])
  
  const metaExamples = ["Twitter", "Whatsapp", "LinkedIn", "Discord"]

  const tagsHandler = (value) =>{

    const tags = value.map((item)=>item.label)
    if(tags.length >= 5){
      setDisableTags(true)
    }        
    dispatch(changeBasics({...campaignBasics, 'tags':tags}))
  }  

  const handleImgDeletion = async (endPoint) =>{
    const deletedImg = await axios.delete(`${process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE}/api/v1/campaigns/${props.campaignId}/${endPoint}`,{
      withCredentials: true
    })
  }  

  const handleUploadedFiles = async (images, endPoint) => {
    
    console.log("console logg in handleUploadedFiles")
    
    let formData = new FormData();
    formData.append("file", images[0]);  
      
    const imgUrl =  await axios.post(`${process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE}/api/v1/campaigns/${props.campaignId}/image/${endPoint}`,formData,{
      withCredentials:true
    })      
    return imgUrl.data.imgUrl;
  };

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

  // const handleCoverImageChange = async (e) =>{            

  //   setCoverVideo(null);

  //   const files = checkFiles(e.target.files);                

  //   if(campaignBasics && campaignBasics.coverImage){
  //     const deletedImg = await handleImgDeletion('coverImage');
  //   }

  //   const uploadedImgUrl = await handleUploadedFiles(files,'coverImage');

  //   setCoverImage(uploadedImgUrl);
    
  //   dispatch(changeBasics({...campaignBasics, coverImage:uploadedImgUrl, coverVideo:''}))
    
  //   props.setCampaignDataChanged(prevSet => new Set([...prevSet, 'coverImage']));        
  // }

  const uploadImageToBackend = (formData, index) => {

    const config = {
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    };

    axios
      .post(
        `${process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE}/api/v1/campaigns/${props.campaignId}/upload_images/`,
        formData,
        config
      )
      .then((res) => {                
        console.log(res.data)
        dispatch(
          changeBasicsImage({
            imageData: {
              imageUrl: res.data.imageUrl,
              imageId: res.data.imageId,
            },
            index: index,
          })
        );    
      })              
        // dispatch(
        //   changeBasicsImages([
        //     ...model.modelImages.slice(0, index),
        //     {
        //       imageUrl: res.data.imageUrl,
        //       imageId: res.data.imageId,
        //     },
        //     ...model.modelImages.slice(index + 1),
        //   ])
        // );      
      .catch((err) => {
        console.log("err", err);
        console.log("error index", index);
        // dispatch(
        //   changeBasicsImages([
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
    console.log("This is in coverimgset")
    axios
      .put(
        `${process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE}/api/v1/campaigns/${props.campaignId}/cover-image/?url=${imageUrl}`,
        { coverImage: imageUrl },
        { withCredentials: true }
      )
      .then((res) => {      
        dispatch(changeBasics({...campaignBasics, coverImage:imageUrl}));
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const deleteImage = (uuid) => {
    // TODO add axios call
    console.log("uuid ", uuid);
    axios
      .delete(
        `${process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE}/api/v1/campaignImages/${props.campaignId}?imageId=${uuid}`,
        { withCredentials: true }
      )
      .then((res) => {                
        console.log("uuid form res ", res.data.message);
        dispatch(
          changeBasicsImages(
            campaignBasics.basicsImages.filter((picture) =>{ console.log("pictureComp ",picture.imageId, res.data.message ,picture.imageId !== res.data.message); return picture.imageId !== res.data.message })
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
          `${process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE}/api/v1/campaigns/updateCroppedUrl?campaignId=${props.campaignId}&imageId=${uuid}`,
          { height, width, x, y },
          { withCredentials: true }
        )
        .then((res) => {          
          dispatch(
            changeBasics({...campaignBasics, basicsImages: campaignBasics.basicsImages.map((picture) => {
                if (picture.imageId === uuid) {
                  return { ...picture, croppedUrl: res.data.croppedUrl };
                } else return picture;
              }) 
            }              
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

  // const handleCoverVideoChange = () =>{
  //   setCoverImage(null); 
  //   setCoverVideo(coverVideoRef.current.value)    
  //   props.setCampaignDataChanged(prevSet => new Set([...prevSet, 'coverVideo']));
  //   dispatch(changeBasics({...campaignBasics, coverVideo:coverVideoRef.current.value, coverImage:''}))
  // }

  const handleMetaImageChange = async (e) =>{    

    const files = checkFiles(e.target.files);                    

    // if(campaignBasics && campaignBasics.metaImage){
    //   const deletedImg = await handleImgDeletion('metaImage');
    // }
    
    const uploadedImgUrl = await handleUploadedFiles(files,'metaImage');
    
    setMetaImage(uploadedImgUrl);
    
    dispatch(changeBasics({...campaignBasics, metaImage:uploadedImgUrl}))
    
    props.setCampaignDataChanged(prevSet => new Set([...prevSet, 'metaImage']));
  }

  const handleMetaTagRemoval = () =>{
    
    props.setCampaignDataChanged(prevSet => new Set([...prevSet, 'metaName']));       
             
    dispatch(changeBasics({...campaignBasics, 'metaTitle':'', metaDesc:'', metaImage:''}))

    setShowMetaInputs(false);
  }

  const handleBasicsInput = (e) =>{

    let name = e.target.id;
    let val = e.target.value;
    if(val)
      props.setBasicsInvalid(prevSet => {
        const newSet = new Set(prevSet);
        newSet.delete(name);
        return newSet;
      })
    props.setCampaignDataChanged(prevSet => new Set([...prevSet, 'metaTitle']));       
    
    dispatch(changeBasics({...campaignBasics, [name]:val}))        

  }  

  

  const basicsChildren = 

    <div className='flex flex-col gap-8'>
      <div className='w-full bg-[#171717]/80 py-5 px-7 flex gap-2 items-center rounded-md text-[#FAFAFA]'>
        <img src="/images/icons/advMarketingTools.svg" className='w-6 h-6'/>
        <h3 className='font-[500]'>Try Advanced marketing tools</h3>
        <a className='flex gap-1 cursor-pointer'>
          <span className='font-[600]'>Learn more</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#FAFAFA" class="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
          </svg>
        </a>
      </div>
      <div className='flex justify-between gap-2'>
        <div className='flex flex-col gap-4 w-[60%]'>
          <div>
            <label for="campaignTitle" className='font-[500]'>Campaign name *</label>            
          </div>          
          <input placeholder='Enter title here' defaultValue={campaignBasics ? campaignBasics.campaignTitle : ''} onBlur={handleBasicsInput} id="campaignTitle" type='text' className='h-14 p-2 rounded-md border-2 border-borderGrayColor'></input>
          <span className={`text-red-600 ${props.basicsInvalid.has('campaignTitle') && props.publishClicked ? '' : 'hidden' }`}>this field cannot be left empty</span>
        </div>
        <div className='flex flex-col w-[40%] gap-4'>      
          <div className='flex'>
            <h2 for="category" className='font-[500]'>Category *</h2>             
          </div>              
          {console.log("smthns", campaignBasics&&campaignBasics.category?campaignBasics.category:'bleh')}
          <Select 
            value={{ value:campaignBasics&&campaignBasics.category?campaignBasics.category:'' , label:campaignBasics&&campaignBasics.category?campaignBasics.category:''  }}
            placeholder="Select the category"
            components={animatedComponents} 
            options={options}             
            onChange={(category)=>{              
                props.setBasicsInvalid(prevSet => {
                  const newSet = new Set(prevSet);
                  newSet.delete("category");
                  return newSet;
                })              
              dispatch(changeBasics({...campaignBasics, 'category':category.value}))}
            }
            styles={{
              control: (baseStyles) => ({
                ...baseStyles,
                backgroundColor: '#E5E5E5',
                colorScheme:'#121212',
                borderColor: '#A3A3A3',
                borderWidth: '2px',
                height: '3.5rem',                
              }),
              dropdownIndicator: base => ({
                ...base,
                color: "#121212" // Custom colour
              })
            }}  
          />
          <span className={`text-red-600 ml-2 ${props.basicsInvalid.has('category') && props.publishClicked ? '' : 'hidden' }`}>this field cannot be left empty</span>                     
        </div>        
      </div>
      <div className='flex flex-col gap-4'>
        <label for='tagline' className='font-[500]'>Tagline {'(optional)'}</label>
        <textarea placeholder='Add a short tagline' defaultValue={campaignBasics ? campaignBasics.tagline : ''} rows="5" id="tagline" onBlur={handleBasicsInput} className='p-2 border-2 border-borderGrayColor rounded-md'></textarea>
      </div>
      <div className='flex flex-col gap-4'>
        <div className='flex flex-wrap'>
          <h2 className='font-[500]'>Cover image/video *</h2>                    
        </div>        
        {/* <ImgVidUpload handleImageChange={handleCoverImageChange} handleVideoChange={handleCoverVideoChange} imageSrc={coverImage} videoSrc={coverVideo} coverImage={coverImage} coverVideo={coverVideo} coverVideoRef={coverVideoRef}/> */}
        <ImageGallery
          pictures={campaignBasics.basicsImages}
          setPictures={(pictures) => { 
            dispatch(changeBasicsImages(pictures));
            if(pictures.length > 0)
            props.setBasicsInvalid(prevSet => {
              const newSet = new Set(prevSet);
              newSet.delete('coverMedia');
              return newSet;
            })                       
          }}          
          uploadImageToBackend={uploadImageToBackend}
          coverImage={campaignBasics.coverImage}          
          handleUseAsCoverPhoto={handleUseAsCoverPhoto}
          deleteImage={deleteImage}
          handleImageCrop={handleImageCrop}
          aspectRatio={"14/11"}
        />
        <span className={`text-red-600 ml-2 ${props.basicsInvalid.has('coverMedia') && props.publishClicked ? '' : 'hidden' }`} >Invalid or empty cover image/cover video</span>
      </div>
      <div className='flex justify-between items-end'>
        <div className='flex flex-col w-[30%] gap-4'>
          <label for="launchDate" className='font-[500]'>Campaign launch date *</label>
          <div className="flex items-center border-2 border-borderGrayColor h-14 p-2 rounded-[5px]">
            <div className="relative w-[20px] h-[20px] mx-3">
              <Image src="/temp/calendar.svg" alt="Calendar" fill />
            </div>
            <DatePicker
              id='launchDate'
              selected={launchDate}
              dateFormat="dd-MM-yy"
              minDate={new Date()}
              onChange={(d) => {                
                setLaunchDate(d);                
                // setCampaignBasics({...campaignBasics, "launchDate":d})
                dispatch(changeBasics({...campaignBasics, "launchDate":d}))
                numberOfDays > 0 ? setEndDate(new Date(d.getTime() + 86400000*numberOfDays)) : setEndDate(new Date(d.getTime()));
              }}
              className="w-full h-[25px] focus:outline-none bg-white"
            />
          </div>
        </div>
        <div className='flex flex-col w-[30%] gap-4'>
          <label for="No. of days" className='font-[500]'>No. of days</label>
          <div className='w-full rounded-md border-2 border-borderGrayColor px-2 py-1 flex justify-between h-14'>
            <input type="number" id="No. of days" className='w-[80%] focus:outline-none' min={1} value={numberOfDays} required onChange={(e)=>{if(e.target.value > 1){setNumberOfDays(e.target.value);setEndDate(new Date(launchDate.getTime() + 86400000*e.target.value))}}}/>
            <div className='flex flex-col justify-between'>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" className="w-5 h-5 stroke-[#171717] hover:bg-[#171717]/20 rounded-sm" onClick={()=>{setNumberOfDays(Number(numberOfDays)+1); setEndDate(new Date(launchDate.getTime() + 86400000*(numberOfDays+1)))}}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" className="w-5 h-5 stroke-[#171717] hover:bg-[#171717]/20 rounded-sm" onClick={()=>{numberOfDays > 0 ? setNumberOfDays(Number(numberOfDays)-1) : ""; setEndDate(new Date(launchDate.getTime() + 86400000*(numberOfDays-1)))}}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
          </div>
        </div>
        <div className='w-[25%] bg-[#F5F5F5] h-14 flex px-6 items-center py-4 justify-between rounded-md'>
          <div className='text-[#737373] font-[500]'>
            Starting
            <p className='text-[#404040]'>
              {launchDate ? launchDate.getDate()+'/'+(launchDate.getMonth()+1)+'/'+launchDate.getFullYear() :"dd/mm/yy"}
            </p>
          </div>
          <div className='text-[#737373] font-[500]'>
            Ending
            <p className='text-[#404040]'>
              {endDate ? endDate.getDate()+'/'+(endDate.getMonth()+1)+'/'+endDate.getFullYear() :"dd/mm/yy"}
            </p>
          </div>
        </div>
      </div>
      <div className='flex flex-col gap-4'>
        <label className='font-[500]'>Tags</label>
        <CreatableSelect 
          placeholder='Select tags'
          isOptionDisabled={()=> disableTags}
          components={animatedComponents} 
          isMulti 
          id='tags'
          value={campaignBasics.tags.map((tag, index)=>(
            {
              value: tag,
              label: tag
            }
          ))}
          options={options} 
          onChange={(value)=>tagsHandler(value)} 
          styles={{
            control: (baseStyles) => ({
              ...baseStyles,
              borderColor: '#A3A3A3',
              borderWidth: '2px',
              height: '3.5rem',
            }),
          }}
        />
      </div>
      <div>
        <div className='flex flex-col gap-4 cursor-pointer'>
          <div className='flex' onClick={()=>{!showMetaInputs ? setShowMetaInputs(true) : handleMetaTagRemoval()}}>
            {
              !showMetaInputs ?
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" class="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                </svg>
            
            }
            
            <p className='font-[500]'>
              { !showMetaInputs ?
                  'Add your own meta tags' 
                : 'Remove meta tags'
              }              
            </p>
          </div>                       
        {
          showMetaInputs || ( campaignBasics && (campaignBasics.metaTitle || campaignBasics.desc || campaignBasics.metaImage) )           
          ? <div className='flex justify-between'>
              <div className='rounded-md bg-[#FAFAFA] flex flex-col gap-8 px-8 py-6 w-[55%]'>
                <div className='flex flex-col gap-4'>
                  <div>
                    <label>Meta title</label>                    
                  </div>                  
                  <input defaultValue={campaignBasics ? campaignBasics.metaTitle:''} onBlur={handleBasicsInput} id='metaTitle' className='h-10 p-2 focus:outline-none border-[1.5px] border-borderGrayColor rounded-md'></input>
                  {/* <span className={`text-red-600 ml-2 ${props.basicsInvalid.has('metaTitle') && props.publishClicked ? '' : 'hidden' }`}>Invalid meta title</span> */}
                </div>
                <div className='flex flex-col gap-4'>
                  <div>
                    <label>Meta description</label>                    
                  </div>
                  <input defaultValue={campaignBasics ? campaignBasics.metaDesc:''} onBlur={handleBasicsInput} id='metaDesc' className='h-10 p-2 focus:outline-none border-[1.5px] border-borderGrayColor rounded-md'></input>
                  {/* <span className={`text-red-600 ml-2 ${props.basicsInvalid.has('metaDesc') && props.publishClicked ? '' : 'hidden' }`}>Invalid meta description</span> */}
                </div>                
                <div className=''>
                  <span className='font-[500]'>
                    Meta image
                  </span>
                  <div className='w-full p-4 mt-4 border-2 border-borderGrayColor rounded-md h-80 flex flex-col gap-4 justify-between'>
                    <input                                      
                      type="file"              
                      id="metaImage"             
                      onChange={handleMetaImageChange}              
                      className="hidden focus:ring-1 focus:ring-primary-brand"
                      accept="image/png, image/jpg, image/jpeg"                        
                    />
                    <label
                      htmlFor="metaImage"
                      className='h-[40%] bg-white flex justify-center items-center border-2 border-dashed border-borderGrayColor w-full font-[550] text-sm text-black mx-auto text-center rounded-sm cursor-pointer'
                    >
                      Upload image
                    </label>  
                    <div className='flex justify-between items-center'>
                      <div className='border-black h-0 border-[1px] w-[45%]'></div>
                      <span> OR </span>
                      <div className='border-black h-0 border-[1px] w-[45%]'></div>
                    </div>
                    <div className='flex flex-col gap-4'>                          
                      <div className='w-full rounded-md border-2 border-borderGrayColor p-2 flex justify-between bg-white'>
                        <input type="text" ref={metaImgRef} pattern="^(https?:\/\/)?(www\.)?youtube\.com\/embed\/[a-zA-Z0-9_-]{11}$" className='w-[80%]' required />
                        <button className='bg-black rounded-3xl px-2 py-1 text-white min-w-max'>+ Add link</button>
                      </div>            
                    </div>
                  </div>                       
                </div>                        
              </div> 
              <div className='w-[35%] px-8 py-6'>
                <div className='border-[1.5px] border-borderGrayColor rounded-md overflow-hidden'>
                  {metaExamples.map((item, index)=>(
                    <div className=''>
                      <div onClick={()=>{showMetaPreview === index ? setShowMetaPreview('') : setShowMetaPreview(index)}} className={`py-3 px-4 flex justify-between cursor-pointer ${index !== metaExamples.length - 1 ? "border-b-[1.5px] border-b-borderGrayColor" : ""}`}>
                        <span>{item}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" class="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                      </div>
                      <div className={`${showMetaPreview === index ? "h-24 opacity-100":"h-0 opacity-0"} ${index !== metaExamples.length -1 ? "border-b-[1.5px]" : "border-t-[1.5px]"} border-borderGrayColor flex justify-between transition-all duration-500 ease-out`}>
                        <div className='w-[30%]'>
                          <img src={metaImage} className='object-cover object-right w-full h-full' />                          
                        </div>
                        <div className='w-[65%] flex flex-col gap-[2px] text-xs py-2'>
                          <p>
                            ikarus3d.com
                          </p>
                          <p className='truncate'>
                            {campaignBasics ? campaignBasics.metaTitle:''}
                          </p>
                          <p className='truncate'>
                            {campaignBasics ? campaignBasics.metaDescription:''}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>      
            </div>              
          : ''
        }
        </div>
      </div>
    </div>             

    useEffect(() => {            

      if(campaignBasics && (campaignBasics.metaTitle || campaignBasics.metaDesc || campaignBasics.metaCoverImg))
        setShowMetaInputs(true)    
    }, [])

    useEffect(() => { 
      console.log("endDate is ", endDate)       
      if (initialRender.current === 0) {
        // this prevents the useEffect with non-empty dependency array from running on the first render.
        initialRender.current = 1;
      }
      else if (initialRender.current === 1) {
        // this prevents the useEffect with non-empty dependency array from running on the first render.
        initialRender.current = 2;
      }
      else{        
        dispatch(changeBasics({...campaignBasics, endingOn:endDate}))
      }      
    }, [endDate])   
    
    useEffect(()=>{
      console.log("updated basics data ", campaignBasics);
      setLaunchDate(campaignBasics.launchDate);
      setEndDate(campaignBasics.endingOn);
      setNumberOfDays((campaignBasics.endingOn.getTime() - campaignBasics.launchDate.getTime())/(1000 * 3600 * 24));
      setMetaImage(campaignBasics.metaImage);      
    },[campaignBasics])
    
    console.log('blyat ', campaignBasics);
  return (    
      <div className='bg-white h-auto'>
        <SectionLayout heading='Basics' subHeading="Name your model, upload an image, and establish model details" children={basicsChildren}/>
      </div>           
  )
}

export default Basics