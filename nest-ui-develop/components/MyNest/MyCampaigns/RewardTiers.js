import React, { useState, useEffect } from 'react'
import SectionLayout from '../../Layouts/SectionLayout'
import CreatedTierOrMilestoneCard from '../../CreatedTierOrMilestoneCard';
import TierFileCard from '../../TierFileCard';
import { useSelector, dispatch, useDispatch } from 'react-redux';
import { changeTiersData } from '../../../store/campaignSlice';
import axios from 'axios';
import { v1 as uuidv1 } from 'uuid';
import DatePicker from "react-datepicker";
import Image from 'next/image';

const RewardTiers = (props) => {

  const rewardsData = useSelector((state)=>state.campaign.rewardAndTier)
  const dispatch = useDispatch();  
  const [ selectedTier, setSelectedTier ] = useState();
  const [ showRewardEditing, setShowRewardEditing ] = useState();
  const [ selectedModelIds, setSelectedModelIds ] = useState([]);
  const [ modelsData, setModelsData ] = useState();
  const [ showRewardCreation, setShowRewardCreation ] = useState(false);
  const [ uploadFiles, setUploadFiles ] = useState(false);
  const [ filter, setFilter ] = useState('chocolate');
  const [ selectedCount, setSelectedCount ] = useState(0);
  const [ showFilterOptions, setShowFilterOptions ] = useState(false);
  const [ newTierData, setNewTierData ] = useState({});  
  const [ tierDp, setTierDp] = useState();
  const [ tierValid, setTierValid ] = useState(false);
  const filters = [
    "chocolate",
    "strawberry",
    "vanilla",
  ];

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

  const handleImgDeletion = async () =>{
    const deletedImg = await axios.delete(`${process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE}/api/v1/campaigns/${props.campaignId}/tierDp`,{
      withCredentials: true
    })
  }  

  const handleUploadedFiles = async (images) => {      
    
    let formData = new FormData();
    formData.append("file", images[0]);  
      
    const imgUrl =  await axios.post(`${process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE}/api/v1/campaigns/${props.campaignId}/image/tierDp`,formData,{
      withCredentials:true
    })      
    return imgUrl.data.imgUrl;
  };

  const handleRewardsImageChange = async (e) =>{        

    const files = checkFiles(e.target.files);                

    // if(newTierData.tierDp){
    //   const deletedImg = await handleImgDeletion();
    // }

    const uploadedImgUrl = await handleUploadedFiles(files);
    if(!newTierData.tierId){
      console.log("in not tierID ", typeof rewardsData);      
      setNewTierData({...newTierData, tierDp: uploadedImgUrl});
      dispatch(changeTiersData(rewardsData.concat({...newTierData, tierDp: uploadedImgUrl})));  
    }
    else{
      console.log("in tierID");
        const temp = [...rewardsData];
        let selectedTierData = temp.find(tier=>tier.tierId === newTierData.tierId);
        setNewTierData({...selectedTierData, tierDp: uploadedImgUrl});
    }        

    setTierDp(uploadedImgUrl)

  }
  const handleCreateReward = async () => {

    try{
      const timestamp = Date.now();
      const newTierId = uuidv1({ msecs: timestamp });

      const tiers = await axios.post(`${process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE}/api/v1/campaigns/${props.campaignId}/tiers`,{...newTierData, tierId: newTierId},{
        withCredentials : true
      })      
      console.log("tierCreated is ",tiers.data.data)
      dispatch(changeTiersData(tiers.data.data))
      setShowRewardCreation(false)      
    } 
    catch(e){
      console.log("tierCreationError: ",e)
    }   
  }
  const handleRewardsInput = (e) =>{    

    let name = e.target.id;
    let val = e.target.value;
    if(!val)
      setTierValid(false)
    console.log('input handler ',{...newTierData, [name]:val})
    setNewTierData({...newTierData, [name]:val});
  }

  const handleFilterChange = (filter) =>{
    console.log("filter is ",filter)
  }

  const handleEditReward = async () =>{

    const temp = [...rewardsData];
    console.log("rewardsData is ",rewardsData);
    const updatedRewardsData = temp.map(reward=>newTierData.tierId === reward.tierId ? newTierData : reward);
    console.log("updatedRewardsData ", updatedRewardsData);

    await axios.put(`${process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE}/api/v1/campaigns/${props.campaignId}/create-update-tier`,updatedRewardsData,
    {
      withCredentials: true
    })    

    dispatch(changeTiersData(updatedRewardsData));

    setShowRewardEditing(false);
    setTierValid(false)
    
  }

  const addModelIds = async () =>{
    const temp = [...rewardsData];
    let selectedTierData = temp.find(tier=>tier.tierId === selectedTier);    
    if(selectedTierData){      
      selectedTierData = {...selectedTierData, modelIds: selectedModelIds};
    }
    
    const updatedRewardsData = temp.map(reward=>selectedTier === reward.tierId ? selectedTierData : reward);
    
    await axios.put(`${process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE}/api/v1/campaigns/${props.campaignId}/create-update-tier`,updatedRewardsData,
    {
      withCredentials: true
    })    
    dispatch(changeTiersData(updatedRewardsData));    
    setSelectedCount(0);
    setUploadFiles(false)
  }


  const tierChildren = 
    <div>
      {typeof rewardsData === 'undefined' 
        ? <div className='w-full text-center flex flex-col items-center justify-center gap-4 h-[400px]'>
            <p>There're no rewards yet. Start creating some</p>
            <button onClick={()=>setShowRewardCreation(true)} className='bg-[#171717] px-5 py-2 flex gap-2 text-white rounded-md'>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" className="w-6 h-6 stroke-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <span>Start creating rewards</span>
            </button>            
          </div> 
        : <div className='flex flex-col gap-8'>
            <div className='w-full flex justify-between'>
              <p className='font-[500]'>Created Rewards ({rewardsData.length})</p>
              <button onClick={()=>{setNewTierData({}); setTierDp(null); setShowRewardCreation(true)}} className='bg-[#171717] px-5 py-2 flex items-center gap-2 text-white rounded-md'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" className="w-6 h-6 stroke-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <span>Add more</span>
              </button>
            </div>
            <div className='grid grid-cols-4 gap-4'>
              {rewardsData.length > 0 ? rewardsData.map((reward,index)=>(
                <CreatedTierOrMilestoneCard img={reward.tierDp} earlyBird={reward.isEarlyBird} objInvalid={props.publishClicked && props.rewardsInvalid.has(reward.tierId)} setShowobjEditing={setShowRewardEditing} title={reward.tierTitle} Id={reward.tierId} amount={reward.tierAmount} models={reward.modelIds ? reward.modelIds.length : 0} setUploadFiles={setUploadFiles} setSelectedObj={setSelectedTier}/>
              )):''}
            </div>
          </div>
        }
        {showRewardCreation || showRewardEditing
              ? <div>
                  <div className='fixed inset-0 w-screen h-screen bg-black/50 z-40 backdrop-blur-md'></div>
                  <div className='fixed w-[90vw] h-[90vh] left-0 right-0 top-12 z-50 m-auto bg-white rounded-md p-8 overflow-y-scroll no-scrollbar'>
                    <div className='w-full cursor-pointer' onClick={()=>{setShowRewardEditing(false); setShowRewardCreation(false)}}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" class="w-6 h-6 stroke-[#171717] ml-auto">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <div className='flex text-left gap-12'>
                      <div className='w-1/2 flex flex-col gap-8'>
                        <div className='flex flex-col gap-4'>
                          <label for='tierTitle' className='font-[500] text-black text-base'>Tier name *</label>
                          <input id='tierTitle' defaultValue={newTierData.tierTitle} value={newTierData.tierTitle} onChange={handleRewardsInput} className='h-12 w-full p-2 rounded-md border-[1.5px] border-borderGrayColor' placeholder='Enter title here' />
                        </div>
                        <div className='flex flex-col gap-4'>
                          <label for='tierAmount' className='font-[500] text-black text-base'>Set amount *</label>
                          <input id='tierAmount' defaultValue={newTierData.tierAmount} value={newTierData.tierAmount} onChange={handleRewardsInput} type='number' className='h-12 w-full p-2 rounded-md border-[1.5px] border-borderGrayColor' placeholder='$0000+' />
                        </div>
                        <div className='flex flex-col gap-4'>
                          <p className='font-[500]'>Upload tier image *</p>
                          <input              
                            type="file"              
                            id="tierDp"
                            onChange={handleRewardsImageChange}
                            className="hidden focus:ring-1 focus:ring-primary-brand"
                            accept="image/png, image/jpg, image/jpeg, image/webp"                        
                          />
                          <label
                            htmlFor="tierDp"
                            className='h-36 bg-white flex justify-center items-center border-2 border-dashed border-borderGrayColor w-full font-[550] text-sm text-black mx-auto text-center rounded-sm cursor-pointer'
                          >
                            Upload image
                          </label>
                        </div>
                        <div className='flex flex-col gap-4'>
                          <label for='tierDescription' className='font-[500] text-black text-base'>Description *</label>
                          <textarea rows={6} value={newTierData.tierDescription} onChange={handleRewardsInput} id='tierDescription' className='w-full p-2 rounded-md border-[1.5px] border-borderGrayColor' placeholder='The description of the project goes here...................' />
                        </div>
                      </div>
                      <div className='w-1/2 flex flex-col justify-start gap-8'>
                        <div className='w-full flex flex-col gap-4'>                        
                          <p className='font-[500] text-black'>Preview</p>                        
                          <div className='flex rounded-md border-[1.5px] border-borderGrayColor overflow-hidden'>
                            <div className='w-[30%]'>
                              {
                                tierDp
                                ? <img src={tierDp} className='w-full h-full object-cover'/>
                                : <div className='bg-[#F4F4F4]'></div>
                              }
                            </div>
                            <div className='w-[70%] px-4 py-6'>
                              <h2 className='font-[600] text-2xl'>{newTierData.tierAmount ? newTierData.tierAmount : "Tier Amount"}</h2>
                              <h3 className='font-[600] text-lg'>{newTierData.tierTitle ? newTierData.tierTitle : "Tier Title"}</h3>
                              <p className='font-[400] text-sm'>{newTierData.tierDescription ? newTierData.tierDescription : "The tier's description goes here."}</p>
                              <div className='flex gap-4 mt-2'>
                                <button className='w-[35%] py-3 rounded-md border-[1.5px] border-borderGrayColor text-center text-black'>View 4 Objects</button>
                                <button className='w-[65%] py-3 rounded-md bg-[#171717] text-center text-white'>Add to cart</button>
                              </div>
                            </div>
                          </div>
                          <div className='flex gap-2'>
                            <input onChange={(e)=> setNewTierData({...newTierData, isEarlyBird: e.target.checked})} type='checkbox' checked={newTierData.isEarlyBird} className='w-5 h-5'></input>
                            <span className='font-[600]'>This is early bird</span>
                            <span>( read instructions )</span>
                          </div>
                        </div>
                        <div className={`${newTierData.isEarlyBird ? 'opacity-100':'opacity-0 pointer-events-none'}`}>
                          <div className='flex flex-col gap-4'>
                            <label for="earlyBirdPrice" className='font-[500]'>Set amount</label>
                            <input id="earlyBirdPrice" value={newTierData.earlyBird?.amount} onChange={(e)=>setNewTierData({...newTierData, earlyBird: {...newTierData.earlyBird, amount:e.target.value}})} className='h-12 w-full p-2 rounded-md border-[1.5px] border-borderGrayColor'/>
                          </div>
                          <div className='bg-[#F5F5F5] border-l-4 border-[#525252] w-full text-black font-[400] py-4 px-8 mt-8'>
                            <p>
                              You can choose to fill both or either of specified fields mentioned below.
                            </p>
                          </div>
                          <div className='flex justify-between gap-4 mt-6'>
                            <div className='w-[50%]'>
                              <p className='font-[500]'>
                                Mention date of ending *
                              </p>
                              <div className="border-[1.5px] border-borderGrayColor flex items-center gap-2 h-12 p-2 rounded-[5px] mt-4">
                                <div className="relative w-[20px] h-[20px] mx-3">
                                  <Image src="/temp/calendar.svg" alt="Calendar" fill />
                                </div>
                                <DatePicker
                                  placeholderText='dd/mm/yy'
                                  id='launchDate'
                                  selected={new Date(newTierData.earlyBird && newTierData.earlyBird.endingDate ? newTierData.earlyBird.endingDate : new Date())} // Convert the string to a Date object
                                  dateFormat="dd-MM-yy"
                                  minDate={new Date()}
                                  onChange={(d) => {                                                                                                      
                                    setNewTierData({...newTierData, earlyBird: {...newTierData.earlyBird, endingDate:d}})
                                  }}
                                  className="w-full h-[25px] focus:outline-none bg-white"
                                />                                
                              </div>                            
                            </div>
                            <div className='w-[50%]'>
                              <label className='font-[500]' for="noOfBackers">
                                No of backers
                              </label>
                              <input placeholder='eg. 1-30' type='number' value={newTierData.earlyBird?.noOfBackers} min={0} id="noOfbackers" onBlur={(e)=>setNewTierData({...newTierData, earlyBird: {...newTierData.earlyBird, noOfBackers:e.target.value}})} className='p-2 mt-4 rounded-md focus:outline-none h-12 w-full border-[1.5px] border-borderGrayColor' ></input>
                            </div>
                          </div>
                        </div>
                        <div className='w-fit ml-auto h-fit'>
                          <button className='px-8 py-2 rounded-md' onClick={()=>{setShowRewardEditing(false); setShowRewardCreation(false)}}>Cancel</button>
                          <button disabled={!tierValid} onClick={showRewardCreation ? handleCreateReward : handleEditReward} className='disabled:opacity-50 px-8 py-2 rounded-md bg-[#171717] text-white'>Create</button>
                        </div>
                      </div>                      
                    </div>
                  </div>
                </div>
              :''
            }
            {
              uploadFiles
              ?<div>
                <div className='fixed inset-0 w-screen h-screen bg-black/50 z-40 backdrop-blur-md'></div>
                <div className='fixed flex flex-col w-[90vw] h-[90vh] left-0 right-0 top-12 z-50 m-auto bg-white rounded-md pt-8 px-8 overflow-hidden'>
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
                        <button className='px-8 py-2 rounded-md font-[600]' onClick={()=>{setUploadFiles(false); setShowRewardEditing(false)}}>Cancel</button>
                        <button className='px-8 py-2 rounded-md font-[600] text-white bg-[#171717]' onClick={addModelIds}>Done</button>
                      </div>
                    </div>
                    <div className='mt-8 h-auto grow overflow-y-scroll no-scrollbar py-4'>
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
        if(selectedTier){             
          const models = await axios.get('http://localhost:8002/api/v1/models?status=All&deprecated=false&visibility=all',{withCredentials:true});          
          console.log("begottten models are ", models);
          setModelsData([...models.data]);
        }
      } 
      
      if(selectedTier)
        getModelsData();

    }, [uploadFiles])

    useEffect(()=>{

      if(showRewardEditing){
        console.log("inside useEffect ", rewardsData);
        const temp = [...rewardsData];
        let selectedTierData = temp.find(tier=>tier.tierId === selectedTier);          
        console.log("selectedTierData ", {...selectedTierData})
        setTierDp(selectedTierData.tierDp);
        setNewTierData({...selectedTierData});
      }        

    },[showRewardEditing])

    useEffect(()=>{
      console.log("newTierEffect ", newTierData.tierTitle, newTierData.tierAmount, newTierData.tierDescription, tierDp)
      if(newTierData.tierTitle && newTierData.tierAmount && newTierData.tierDescription && tierDp)
        setTierValid(true);
      
      else
        setTierValid(false);
    },[newTierData])
    

  return (
    <SectionLayout heading='Reward Tiers' subHeading="Get backers excited by adding rewards to your tiers!" children={tierChildren}/>
  )
}

export default RewardTiers