import React, { useState, useEffect } from 'react'
import SectionLayout from '../../Layouts/SectionLayout';
import CreatedUpdatesCard from '../../CreatedUpdatesCard';
import { useSelector, useDispatch } from 'react-redux';
import { changeUpdates } from '../../../store/campaignSlice';
import axios from 'axios';
import { v1 as uuidv1 } from 'uuid';
import dynamic from 'next/dynamic';

const Updates = (props) => {

  const QuillEditor = dynamic(() => import("../../QuillEditor"), {
    ssr: false,
  });

  const dispatch = useDispatch();
  const [showUpdateCreation, setShowUpdateCreation] = useState(false);
  const updatesData = useSelector((state)=>state.campaign.updates);
  const [ newUpdateData, setNewUpdate ] = useState({});  
  const [ updateValid, setUpdatesValid ] = useState(false);
  const [ showUpdateUpdation, setShowUpdateUpdation ] = useState(false);    

  const handleCreateUpdate = async () =>{

    const timestamp = Date.now();
    const newUpdateId = uuidv1({ msecs: timestamp });
    const uploadedUpdateData = await axios.post(`${process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE}/api/v1/campaigns/${props.campaignId}/update`, { ...newUpdateData, updateId: newUpdateId, updateTime:new Date()}, {
      withCredentials: true
    })        

    dispatch(changeUpdates(updatesData.concat(uploadedUpdateData.data)));  

    setShowUpdateCreation(false);
    
  }

  const handleUpdateUpdate = () =>{
    
  }

  const updatesChildren = 
    <div>
      {typeof updatesData === 'undefined' || updatesData.length < 1
        ? <div className='w-full text-center flex flex-col items-center justify-center gap-4 h-[400px]'>
            <p>Start adding some updates for your campaign</p>
            <button onClick={()=>setShowUpdateCreation(true)} className='bg-[#171717] px-5 py-2 flex gap-2 text-white rounded-md'>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" className="w-6 h-6 stroke-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <span>Add an update</span>
            </button>            
          </div> 
        : <div className='flex flex-col gap-8'>
            <div className='w-full flex justify-between'>
              <p className='font-[500]'>Created Rewards ({updatesData.length})</p>
              <button onClick={()=>{setShowUpdateCreation(true); setNewUpdate({})}} className='bg-[#171717] px-5 py-2 flex items-center gap-2 text-white rounded-md'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" className="w-6 h-6 stroke-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <span>Add more</span>
              </button>
            </div>
            <div className='flex flex-col gap-4'>   
              {updatesData.map((update,index)=>(
                <CreatedUpdatesCard index={index+1} setSelectedObj={setNewUpdate} setShowObjUpdate={setShowUpdateUpdation} updateData={ update }/>  
              ))}              
            </div>
          </div>
      }
      {
        showUpdateCreation || showUpdateUpdation
        ? <div>
            <div className='fixed inset-0 w-screen h-screen bg-black/50 z-40 backdrop-blur-md'></div>
            <div className='fixed w-[90vw] h-[90vh] left-0 right-0 top-12 z-50 m-auto bg-white rounded-md p-8 overflow-y-scroll no-scrollbar'>
              <div className='w-full cursor-pointer' onClick={()=>{setShowUpdateCreation(false); setShowUpdateUpdation(false)}}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" class="w-6 h-6 stroke-[#171717] ml-auto">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div className='flex flex-col gap-8'>
                <div className='flex flex-col gap-4'>
                  <label for="updatesTitle" className='font-[500]'>Update title *</label>
                  <input onChange={(e)=>setNewUpdate({...newUpdateData, updateTitle : e.target.value})} value={newUpdateData.updateTitle} id="updatesTitle" type='text' className='h-14 p-2 rounded-md border-2 border-borderGrayColor'></input>
                </div>
                <div className='flex flex-col gap-4'>
                  <label className='font-[500]' for="updateDescription">Description *</label>                  
                  <div className='w-full min-h-[250px]'>
                    <QuillEditor
                      maxLength={20000}
                      value={newUpdateData.updateDescription}
                      onChange={(value)=>setNewUpdate({...newUpdateData, updateDescription:value})}                      
                      placeholder="The description of the project goes here..................."       
                    />
                  </div>
                </div>
                <div className='w-fit mt-auto ml-auto'>
                  <button className='rounded-md px-8 py-2 font-[600]' onClick={()=>{setShowUpdateCreation(false); setShowUpdateUpdation(false)}}>Cancel</button>
                  <button disabled={!updateValid} className='rounded-md px-8 py-2 font-[600] disabled:opacity-50 bg-[#171717] text-white' onClick={showUpdateCreation ? handleCreateUpdate : handleUpdateUpdate}>Create</button>
                </div>
              </div>
            </div>
          </div>        
        :''
      }
    </div>

    useEffect(()=>{ 

      if(newUpdateData.updateTitle && newUpdateData.updateDescription)
        setUpdatesValid(true);
      else
        setUpdatesValid(false);

    }, [newUpdateData])

    useEffect(()=>{
      const getUpdatesData = async () =>{
        const updatesData = await axios.get(`${process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE}/api/v1/campaigns/${props.campaignId}/field/updates`)
        console.log("updatesData.data.updates ", updatesData.data.updates);
        dispatch(changeUpdates(updatesData.data.updates))
      }
      getUpdatesData();
    },[])


  return (
    <SectionLayout heading='Updates' subHeading='Name your model,upload an image , and establish model details' children={updatesChildren} />
  )
}

export default Updates