import React, { useState, useRef, useEffect } from 'react'
import CreatedTierOrMilestoneCard from '../../CreatedTierOrMilestoneCard';
import SectionLayout from '../../Layouts/SectionLayout';
import ImgVidUploadWithoutPreview from '../../Img-Vid-Upload-withoutPreview';
import { useSelector, useDispatch } from 'react-redux';
import { changeMilestoneData } from '../../../store/campaignSlice';
import axios from 'axios';
import { v1 as uuidv1 } from 'uuid';
import TierFileCard from '../../TierFileCard';

const Milestones = (props) => {
  
  const milestonesData = useSelector((state)=>state.campaign.milestone)
  const dispatch = useDispatch();
  const [selectedMilestone, setSelectedMilestone] = useState();
  const [blurImage, setBlurImage] = useState(false);
  const [filter, setFilter] = useState('chocolate');
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [ modelsData, setModelsData ] = useState();
  const [ selectedModelIds, setSelectedModelIds ] = useState([]);
  const [ milestoneValid, setMilestoneValid ] = useState(false);
  const [selectedCount, setSelectedCount] = useState(0);
  const [showMilestoneCreation, setShowMilestoneCreation] = useState(false);
  const [showMilestoneEditing, setShowMilestoneEditing] = useState(false);
  const [newMilestoneData, setNewMilestoneData] = useState({});
  const [coverImage, setMilestoneImage] = useState(null);
  const [coverVideo, setCoverVideo] = useState(null);  
  const [uploadFiles,setUploadFiles] = useState(false);
  const coverVideoRef = useRef(null);
  const filters = [
    "chocolate",
    "strawberry",
    "vanilla",
  ];

  const handleUploadedFiles = async (images) => {

    let formData = new FormData();
    formData.append("file", images[0]);  
    console.log("cover Img uploaded!");
    const imgUrl =  await axios.post(`${process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE}/api/v1/campaigns/${props.campaignId}/image/milestone`,formData,{
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

  const handleMilestoneImageChange = async (e) =>{        

    const files = checkFiles(e.target.files);               

    const uploadedImgUrl = await handleUploadedFiles(files);
    if(!newMilestoneData.milestoneId){      
      setNewMilestoneData({...newMilestoneData, coverImage: uploadedImgUrl});
      dispatch(changeMilestoneData(milestonesData.concat({...newMilestoneData, coverImage: uploadedImgUrl})));
      console.log("blem ", milestonesData.concat({...newMilestoneData, coverImage: uploadedImgUrl}));
    }
    else{
      
        const temp = [...milestonesData];
        let selectedMilestoneData = temp.find(milestone=>milestone.milestoneId === newMilestoneData.milestoneId);
        setNewMilestoneData({...selectedMilestoneData, coverImage: uploadedImgUrl});
    }        
    setMilestoneImage(uploadedImgUrl)
  }


  const handleCoverVideoChange = () =>{
    setMilestoneImage(null); 
    setCoverVideo(coverVideoRef.current.value)    
    props.setCampaignDataChanged(props.campaignDataChanged.add('coverVideo'));
    dispatch(changeBasics({...props.campaignBasics, coverVideo:coverVideoRef.current.value, coverImage:''}))
  }

  const handleMilestoneEditing = async () =>{
    console.log("editing...")
    const temp = [...milestonesData];
    console.log("milestonesData is ",milestonesData);
    const updatedMilestonesData = temp.map(milestone=>newMilestoneData.milestoneId === milestone.milestoneId ? newMilestoneData : milestone);
    console.log("updatedMilestonesData ", updatedMilestonesData);

    await axios.put(`${process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE}/api/v1/campaigns/${props.campaignId}/update-milestone`,updatedMilestonesData,
    {
      withCredentials: true
    })    

    dispatch(changeMilestoneData(updatedMilestonesData));

    setShowMilestoneEditing(false);
    setMilestoneValid(false)
  }

  const handleMilestoneInput = (e)=>{

    let name = e.target.id;
    let val = e.target.value;

    if(!val)
      setMilestoneValid(false);

    setNewMilestoneData({...newMilestoneData, [name]:val});    

  }

  const handleCreateMilestone = async () =>{
    console.log("creating...")
    try{
      const timestamp = Date.now();
      const newMilestoneId = uuidv1({ msecs: timestamp });

      const milestones = await axios.post(`${process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE}/api/v1/campaigns/${props.campaignId}/milestone/?campaignnID=${props.campaignId}`,{...newMilestoneData, milestoneId: newMilestoneId},{
        withCredentials : true
      })      
      console.log("milestones are",milestones)
      dispatch(changeMilestoneData(milestones.data.data))
      setShowMilestoneCreation(false)
      setMilestoneValid(false)
    } 
    catch(e){
      console.log("tierCreationError: ",e)
    }  

  }

  const addModelIds = async () =>{
    const temp = [...milestonesData];
    let selectedMilestoneData = temp.find(milestone=>milestone.milestoneId === selectedMilestone);    
    if(selectedMilestoneData){

      console.log(typeof selectedMilestoneData, selectedMilestoneData)
      selectedMilestoneData = {...selectedMilestoneData, modelIds: selectedModelIds};
    }
    
    const updatedMilestonesData = temp.map(milestone=>selectedMilestone === milestone.milestoneId ? selectedMilestoneData : milestone);
    console.log("updatedMilestoneData ", updatedMilestonesData);
    await axios.put(`${process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE}/api/v1/campaigns/${props.campaignId}/update-milestone`,updatedMilestonesData,
    {
      withCredentials: true
    })    
    dispatch(changeMilestoneData(updatedMilestonesData));
    setSelectedCount(0);
    setUploadFiles(false)
  }

  const milestonesChildren = 
  <div>
    {typeof milestonesData === 'undefined' 
      ? <div className='w-full text-center flex flex-col items-center justify-center gap-4 h-[400px]'>
          <p>There're no milestones yet. Start creating some</p>
          <button onClick={()=>setShowMilestoneCreation(true)} className='bg-[#171717] px-5 py-2 flex gap-2 text-white rounded-md'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" className="w-6 h-6 stroke-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span>Start creating milestones</span>
          </button>            
        </div> 
      : <div className='flex flex-col gap-8'>
          <div className='w-full flex justify-between'>
            <p className='font-[500]'>Created Milestones ({milestonesData.length})</p>
            <button onClick={()=>{setNewMilestoneData({}); setMilestoneImage(null); setBlurImage(false); setShowMilestoneCreation(true)}} className='bg-[#171717] px-5 py-2 flex items-center gap-2 text-white rounded-md'>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" className="w-6 h-6 stroke-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <span>Add more</span>
            </button>
          </div>
          <div className='grid grid-cols-4 gap-4'>
            {milestonesData.map((milestone,index)=>(
              <CreatedTierOrMilestoneCard blurImage={milestone.blurDp} img={milestone.coverImage} objInvalid={props.publishClicked && props.milestonesInvalid.has(milestone.milestoneId)} setShowobjEditing={setShowMilestoneEditing} title={milestone.milestoneTitle} Id={milestone.milestoneId} amount={milestone.milestoneAmount} models={milestone.modelIds ? milestone.modelIds.length : 0} setUploadFiles={setUploadFiles} setSelectedObj={setSelectedMilestone}/>
            ))}
          </div>
        </div>
      }
      {showMilestoneCreation || showMilestoneEditing  
      ? <div>
          <div className='fixed inset-0 w-screen h-screen bg-black/50 z-40 backdrop-blur-md'></div>
          <div className='fixed w-[90vw] h-[90vh] left-0 right-0 top-12 z-50 m-auto bg-white rounded-md p-8 overflow-y-scroll no-scrollbar'>
            <div className='w-full cursor-pointer' onClick={()=>{setShowMilestoneCreation(false); setShowMilestoneEditing(false)}}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" class="w-6 h-6 stroke-[#171717] ml-auto">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div className='flex text-left gap-12'>
              <div className='w-1/2 flex flex-col gap-8'>
                <div className='flex flex-col gap-4'>
                  <label for='milestoneTitle' className='font-[500] text-black text-base'>Milestone name *</label>
                  <input id='milestoneTitle' value={newMilestoneData.milestoneTitle} onChange={handleMilestoneInput} className='h-12 w-full p-2 rounded-md border-[1.5px] border-borderGrayColor' placeholder='Enter title here' />
                </div>
                <div className='flex flex-col gap-4'>
                  <label for='milestoneAmount' className='font-[500] text-black text-base'>Milestone amount *</label>
                  <input id='milestoneAmount' value={newMilestoneData.milestoneAmount} onChange={handleMilestoneInput} type='number' className='h-12 w-full p-2 rounded-md border-[1.5px] border-borderGrayColor' placeholder='$0000+' />
                </div>
                <div className='flex flex-col gap-4'>
                  <p className='font-[500]'>Upload cover image *</p>
                  <ImgVidUploadWithoutPreview handleImageChange={handleMilestoneImageChange} handleVideoChange={handleCoverVideoChange} imageSrc={coverImage} videoSrc={coverVideo} coverImage={coverImage} coverVideo={coverVideo} coverVideoRef={coverVideoRef}/>
                </div>                
              </div>              
              <div className='w-1/2 flex flex-col gap-4'>                        
                <p className='font-[500] text-black'>Preview</p>                        
                <div className='flex rounded-md border-[1.5px] border-borderGrayColor overflow-hidden relative'>
                  <div className={`w-[35%] bg-black/30 backdrop-blur-sm flex justify-center items-center ${blurImage ? 'z-20' : 'opacity-0 z-0'}`}>
                    <div className='bg-[#121212] rounded-2xl p-4'>                                            
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" className="w-6 h-6 fill-transparent stroke-[#B2B2B2]">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                      </svg>                        
                    </div>                    
                  </div>
                  <div className={`w-[35%] bg-black/30 flex justify-center items-center absolute h-full z-10`}>
                    {
                      coverImage ? 
                        <img src={coverImage} alt='No image' className='object-cover w-full h-full' />
                      :
                        <p>
                          No image to display
                        </p>
                    }                    
                                       
                  </div>
                  <div className='w-[65%] px-4 py-6'>
                    <div>
                      <p className='text-sm font-[400]'>Target amount</p>
                      <div className='flex flex-col gap-4 mt-8'>
                        <div className='flex justify-between'>
                          <span className='font-[600]'>$0</span>
                          <span className='font-[500] text-[#404040]'>$00 left</span>
                        </div>
                        <div className='relative bg-[#E5E5E5] h-2 w-full rounded-md'>
                          <div className='absolute h-full left-0 top-0 bg-[#171717] w-1 rounded-md'></div>
                        </div>
                      </div>
                    </div>
                    <h3 className='font-[600] text-lg mt-8'>The Underground Army marketing sign-up</h3>
                    <p className='font-[400] text-sm'>Modular STL files for 3d printing. 3es of legendary warriors of the Ancient Era aeready for your game. Free warriors of tEra are ready for your game. Fre warriors of the Ancient Era are ready for me. Friors of the Ancient Era are ready for your game. Free </p>                    
                  </div>
                </div>
                <div className='flex gap-2'>
                  <input type='checkbox' checked={newMilestoneData.blurDp} onChange={(e)=>e.target.checked ? 
                                                                           (setBlurImage(true), setNewMilestoneData({...newMilestoneData, blurDp: true}))
                                                                         : (setBlurImage(false), setNewMilestoneData({...newMilestoneData, blurDp: false}))
                                                  } id='blurImage' className='w-5 h-5'></input>
                  <span className='font-[600]'>Blur the image until milestone amount meet</span>                  
                </div>
              </div>                                               
            </div>
            <div className='w-fit ml-auto h-fit mt-4'>
              <button className='px-8 py-2 rounded-md' onClick={()=>{setShowMilestoneCreation(false); setShowMilestoneEditing(false);}}>Cancel</button>
              <button disabled={!milestoneValid} onClick={showMilestoneCreation ? handleCreateMilestone : handleMilestoneEditing} className='px-8 py-2 rounded-md disabled:opacity-50 bg-[#171717] text-white'>Create</button>
            </div>
          </div>
        </div>
      :''
    }
    {
      uploadFiles
      ?<div>
        <div className='fixed inset-0 w-screen h-screen bg-black/50 z-40 backdrop-blur-md'></div>
        <div className='fixed w-[90vw] h-[90vh] left-0 right-0 top-12 z-50 m-auto bg-white rounded-md pt-8 px-8 overflow-hidden'>
            <div className='flex justify-between'>
              <div className='flex gap-2 w-[60%]'>
                <div className='px-2 flex items-center gap-1 border-[1.5px] border-borderGrayColor rounded-md w-full'>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" class="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                  <input placeholder='Search for you models' className='focus:outline-none h-12 w-full' />
                </div>
                <div className='relative flex items-center gap-1 border-[1.5px] border-borderGrayColor rounded-md px-2 py-2'>
                  <span className='font-[600] text-[#525252]'>
                    Visibility:
                  </span>                                                                                
                  <div className='ml-1 flex items-center gap-1 rounded-md' onClick={()=>setShowFilterOptions(!showFilterOptions)}>
                    <span>{filter}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" className="w-5 h-5 stroke-[#171717]">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>                            
                  </div>
                  <div className={`absolute ${ !showFilterOptions ?'hidden':''} w-full shadow-sm top-14 left-0 h-40 border-[1.5px] border-borderGrayColor overflow-y-scroll no-scrollbar rounded-md`}>
                    {filters.map((filter, index)=>(
                      <div className='hover:bg-slate-200 p-2 mx-1 rounded-md' onClick={()=>setFilter(filter)}>
                        <div className={`border-slate-500 ${index !== filters.length -1 ? "border-b-[1px]":""}`}>
                          {filter}
                        </div>                                
                      </div>                                
                    ))}
                  </div>
                </div>
              </div>
              <div className='flex gap-4'>
                <button className='px-8 py-2 rounded-md font-[600]' onClick={()=>setUploadFiles(false)}>Cancel</button>
                <button className='px-8 py-2 rounded-md font-[600] text-white bg-[#171717]' onClick={addModelIds}>Done</button>
              </div>
            </div>
            <div className='mt-8 h-[90%] overflow-y-scroll no-scrollbar'>
              <p className='font-[500]'>{selectedCount} items selected</p>
              <div className='grid grid-cols-5 gap-4 mt-4'>
              {typeof modelsData !== "undefined" && modelsData.length > 0 ? modelsData.map((tierItem, index)=>(                          
                  <TierFileCard setSelectedCount={setSelectedCount} tierItem={tierItem} selectedModelIds={selectedModelIds} setSelectedModelIds={setSelectedModelIds} />                          
                )):''}
              </div>
            </div>
        </div>
      </div>
    :<></>
    }
  </div>

useEffect(() => {  
  
  const getModelsData = async () =>{            
    if(selectedMilestone){             
      const models = await axios.get('http://localhost:8002/api/v1/models?status=All&deprecated=false&visibility=all',{withCredentials:true});
      console.log(models.data)
      setModelsData([...models.data]);  
    }
  } 
  if(selectedMilestone)
    getModelsData();

}, [selectedMilestone])

useEffect(()=>{

  if(showMilestoneEditing){    
    const temp = [...milestonesData];
    let selectedMilestoneData = temp.find(milestone=>milestone.milestoneId === selectedMilestone);              
    setNewMilestoneData({...selectedMilestoneData});
    setMilestoneImage(selectedMilestoneData.coverImage);
  }        

},[showMilestoneEditing])

useEffect(()=>{  

  if(newMilestoneData.milestoneTitle && newMilestoneData.milestoneAmount && ( coverImage || coverVideo))
    setMilestoneValid(true);

  else
    setMilestoneValid(false);

  setBlurImage(newMilestoneData.blurDp);

}, [newMilestoneData])

  return (
    <SectionLayout heading="Milestones" subHeading="Set the milestones of your campaign through timelines" children={milestonesChildren} />
  )
}

export default Milestones