import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Milestones = (props) => {

  const [ milestonesData, setMilestonesData ] = useState([]);
  const presentCollection = props.raisedAmount;

  useEffect(()=>{
    const getMileStonesData = async () =>{
      const milestonesData = await axios.get(`${process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE}/api/v1/campaigns/${props.campaignId}/field/milestone`,{
        withCredentials: true
      });
      console.log('milestonesData.data.milestone ', milestonesData.data.milestone);
      setMilestonesData(milestonesData.data.milestone);      
    }

    getMileStonesData();
  },[])  

  return (
    <div className='flex flex-col gap-y-6 pl-4'>
      {milestonesData.map((item,index)=>(
        
        <div className='flex w-[87%] ml-auto relative shadow-xs'>
          <div className='absolute -left-[5rem] h-full'>            
            <div className={`w-8 h-8 rounded-full ${presentCollection/item.milestoneAmount >= 1 ? "bg-success" : 'border-[1px] border-primary-purple-300' }  flex justify-center items-center`}>
              <span className={`text-primary-purple-600 text-lg ${presentCollection/item.milestoneAmount < 1 ? '' : 'hidden'}`}>
                {index+1}
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className={presentCollection/item.milestoneAmount >= 1 ? '' : 'hidden'}>
                <path d="M13.3334 4.66663L6.47149 11.5286C6.21114 11.7889 5.78903 11.7889 5.52868 11.5286L2.66675 8.66663" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className={`${index === 3 ? 'hidden' : ''} w-[2px] h-[calc(100%-14px)] mt-[3px] bg-light-neutral-600 mx-auto relative`}>
              <div className={`${presentCollection/item.milestoneAmount >= 1 ? '' : 'hidden'} bg-primary-purple-300 absolute w-full h-full`}></div>
            </div>
          </div>
          <div className='w-[38%] overflow-hidden relative' style={{borderRadius:"6px 0px 0px 6px"}}>
            <div className={`${presentCollection/item.milestoneAmount < 1 && item.blurDp ? '' : 'hidden'} absolute flex justify-center items-center bg-gray-500/30 z-[4] backdrop-blur-md inset-0`}>
              <div className='bg-[#121212] rounded-2xl p-4'>                                            
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" className="w-6 h-6 fill-transparent stroke-[#B2B2B2]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>                        
              </div>                    
            </div>
            <img src={item.coverImage} className='w-full h-full object-cover object-right z-0' />
          </div>
          <div className='w-[62%] p-6 border-t-[1px] border-b-[1px] border-r-[1px] border-light-neutral-700' style={{borderRadius:"0px 6px 6px 0px"}}>
            <h3 className='text-xl text-dark-neutral-700 font-[500]'>
              Target amount
            </h3>
            <p className={`text-headline-xs ${(presentCollection/item.milestoneAmount)*100 < 100 ? '' : 'text-success'}  mt-[10px] font-[600]`}>
              ${item.milestoneAmount}
            </p>
            {
             (presentCollection/item.milestoneAmount)*100 < 100 ?  
              <>
                <div className='w-full text-end text-sm text-dark-neutral-200 font-[500]'>{(presentCollection/item.milestoneAmount)*100}%</div>
                <div className='w-full relative h-1 mt-[7px] bg-light-neutral-100 rounded-[10px]'>
                  <div className='absolute bg-success rounded-[10px] h-full' style={{width:(presentCollection/item.milestoneAmount)*100 +'%'}}></div>
                </div>
              </>              
              :<></>
            }            
            <h2 className='text-xl text-dark-neutral-700 mt-4 font-[500]'>
              {item.milestoneTitle}
            </h2>
            <p className='text-md text-dark-neutral-200 mt-3 font-[400]'>
              Modular STL files for 3d printing. 3es of legendary warriors of the Ancient Era aeready for your game. Free warriors of tEra are ready for your game. Fre warriors of the Ancient Era are ready for me. Friors of the Ancient Era are ready for your game. Free 
            </p>
          </div>
        </div>

      ))}
    </div>
  )
}

export default Milestones