import React, { useEffect, useState } from 'react'
import { useRouter } from "next/router";
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setAllData } from '../../store/campaignSlice';
import { CollectionPageJsonLd } from 'next-seo';

const MyCampaigns = ({ queries }) => {
  
  const router = useRouter();  
  const [ myCampaignsData, setMyCampaignsData ] = useState();  
  const [ showFileFilter, setShowFileFilter ] = useState(false);
  const [ showStatusFilter, setShowStatusFilter ] = useState(false);
  const [ showSortFilter, setShowSortFilter ] = useState(false);
  const [ showMoreOptions, setShowMoreOptions ] = useState(false);
  
  const handelCreateCampaign = async () =>{
    
    try {      
      const campaignId = await axios.post(`${process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE}/api/v1/campaign`,'',{
        withCredentials: true
      })    
      router.push(`/my-nest/createCampaign/${campaignId.data}/basics`)
    }            
    catch(e){
      console.log(e);
    }
  }

  useEffect(()=>{
    
      const getCampaignsData = async ()=>{      
        try{
          const myCampaignsData = await axios.get(`${process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE}/api/v1/users/myCampaigns?pageSize=8&nthPage=1`,{
            withCredentials: true
          });                  
          console.log("myCampaignsData.data", myCampaignsData.data)
          setMyCampaignsData(myCampaignsData.data);
          }
          catch(e){
            console.log("error while fetching my campaignsData: ", e)
          }    
        }    
      getCampaignsData();        
  },[])

  return (
    <div className='bg-light-neutral-50'>
      <div className='flex justify-between px-[51px] pt-8'>
        <h2 className='text-3xl font-[600]'>
          My campaigns
        </h2>
        <button className='bg-primary-brand text-white rounded-md px-8 py-3 flex gap-2 items-center' onClick={handelCreateCampaign}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" class="w-7 h-7">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span>
            Create new campaign
          </span>
        </button>
      </div>
      { myCampaignsData 
        ? <div className='h-full w-full border-[1px] border-transparent'>
            <div className='mx-page-mx-lg mt-6 flex'>
              <div className='py-[10px] px-4 flex items-center shadow-xs rounded-[5px] bg-white w-fit'>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <g clipPath="url(#clip0_1918_8614)">
                    <path d="M14.8024 15.8637C15.0952 16.1566 15.5701 16.1566 15.863 15.8637C16.1559 15.5709 16.1559 15.096 15.863 14.8031L14.8024 15.8637ZM11.9944 6.70596C11.9944 9.62712 9.62638 11.9952 6.70523 11.9952V13.4952C10.4548 13.4952 13.4944 10.4555 13.4944 6.70596H11.9944ZM6.70523 11.9952C3.78408 11.9952 1.41602 9.62712 1.41602 6.70596H-0.0839844C-0.0839844 10.4555 2.95565 13.4952 6.70523 13.4952V11.9952ZM1.41602 6.70596C1.41602 3.78481 3.78408 1.41675 6.70523 1.41675V-0.083252C2.95565 -0.083252 -0.0839844 2.95638 -0.0839844 6.70596H1.41602ZM6.70523 1.41675C9.62638 1.41675 11.9944 3.78481 11.9944 6.70596H13.4944C13.4944 2.95638 10.4548 -0.083252 6.70523 -0.083252V1.41675ZM10.4886 11.55L14.8024 15.8637L15.863 14.8031L11.5493 10.4894L10.4886 11.55Z" fill="#A1A4AC"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_1918_8614">
                      <rect width="16" height="16" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
                <input className='ml-2 w-[304px]' placeholder='Search' />
              </div>                                                  
              <div className='bg-white rounded-[5px] shadow-xs relative ml-4 py-[9px] px-[14px] flex items-center'>
                <div className={`absolute w-full h-[200px] bg-white shadow-xs rounded-[5px] top-12 left-0 ${showFileFilter ? '':'hidden'}`}></div>
                <span className='text-xs text-dark-neutral-50 font-[600]'>
                  File:
                </span>
                <span className='ml-2 text-md text-dark-neutral-400 font-[500]'>
                  Any
                </span>
                <svg onClick={()=>showFileFilter ? setShowFileFilter(false) : setShowFileFilter(true)} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className='ml-6'>
                  <path d="M15 8.33325L10.5893 12.744C10.2638 13.0694 9.73618 13.0694 9.41074 12.744L5 8.33325" stroke="#858C95" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <div className='bg-white rounded-[5px] shadow-xs relative ml-4 py-[9px] px-[14px] flex items-center'>
                <div className={`absolute w-full h-[200px] bg-white shadow-xs rounded-[5px] top-12 left-0 ${showStatusFilter ? '':'hidden'}`}></div>
                <span className='text-xs text-dark-neutral-50 font-[600]'>
                  Status:
                </span>
                <span className='ml-2 text-md text-dark-neutral-400 font-[500]'>
                  Any
                </span>
                <svg onClick={()=>showStatusFilter ? setShowStatusFilter(false) : setShowStatusFilter(true)} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className='ml-6'>
                  <path d="M15 8.33325L10.5893 12.744C10.2638 13.0694 9.73618 13.0694 9.41074 12.744L5 8.33325" stroke="#858C95" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <div className='rounded-[5px] relative ml-auto py-[9px] px-[14px] flex items-center'>
                <div className={`absolute w-full h-[200px] bg-white shadow-xs rounded-[5px] top-12 left-0 ${showSortFilter ? '':'hidden'}`}></div>
                <span className='text-xs text-dark-neutral-400 font-[600]'>
                  Sort by:
                </span>
                <span className='ml-2 text-md text-primary-purple-600 font-[500]'>
                  Any
                </span>
                <svg onClick={()=>showSortFilter ? setShowSortFilter(false) : setShowSortFilter(true)} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className='ml-6'>
                  <path d="M15 8.33325L10.5893 12.744C10.2638 13.0694 9.73618 13.0694 9.41074 12.744L5 8.33325" stroke="#858C95" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
            <div className='grid grid-cols-5 gap-6 mx-page-mx-lg mt-6'>
              {myCampaignsData.map((campaign, index)=>(
                <div className='rounded-md w-full shadow-xs relative'>
                  <div className={`absolute top-[14px] left-[18px] px-[10px] py-1 text-${
                    campaign.statusOfCampaign === 'Live' ? 'success-800'
                    : campaign.statusOfCampaign === 'Prelaunch' ? 'success-800'
                    : campaign.statusOfCampaign === 'Prelaunch' ? 'pink-secondary-600'
                    : campaign.statusOfCampaign === 'InReview' ? 'blue-secondary-700'
                    : campaign.statusOfCampaign === 'Ended' ? 'error-700'
                    : 'warning-800'
                  } flex items-center rounded-sm bg-success-50`}>
                    <div className={`${campaign.statusOfCampaign === 'Ended' ? 'hidden':''} w-[6px] h-[6px] rounded-[10px] mr-1`} style={{backgroundColor:campaign.statusOfCampaign === 'Live' ? '#268E34'
                                : campaign.statusOfCampaign === 'Prelaunch' ? '#B400C5'
                                : campaign.statusOfCampaign === 'InReview' ? '#437ABA'
                                : campaign.statusOfCampaign === 'Ended' ? '#C8322B'
                                : '#A15C00'}}>                              
                      </div>
                    <span className='text-sm font-[500] text-warning-800'>{campaign.statusOfCampaign}</span>
                  </div>
                  <div className='w-full aspect-square'>
                    <img src={campaign.coverImage} className='object-cover w-full h-full' style={{borderRadius:"6px 6px 0px 0px"}}/>
                  </div>
                  <div className='p-4 bg-white'>
                    <h2 className="text-dark-neutral-700 text-lg font-[600]">
                      {campaign.campaignTitle}
                    </h2>
                    <div className='bg-light-neutral-100 rounded-[5px] py-3 px-4 flex items-center mt-4'>
                      <span className='text-dark-neutral-700 text-sm font-[500]'>
                        {campaign.rewardAndTier.length}
                      </span>
                      <span className='ml-[5px] text-sm text-dark-neutral-200 font-[400]'>
                        Tiers
                      </span>
                      <span className='ml-auto text-dark-neutral-700 text-sm font-[500]'>
                        {campaign.milestones.length}
                      </span>
                      <span className='ml-[5px] text-sm text-dark-neutral-200 font-[400]'>
                        Milestones
                      </span>
                    </div>
                    <div className='flex items-center mt-4'>
                      <span className='text-xs text-dark-neutral-200 font-[500]'>
                        Published
                      </span>
                      <span className='text-xs text-dark-neutral-200 font-[300] ml-[5px]'>
                        2 days ago
                      </span>
                      <div className='relative ml-auto'>
                        <div className={`${showMoreOptions === index+1 ? '' : 'hidden'} absolute z-10 left-6 top-0 w-[100px] bg-white rounded-[5px] text-dark-neutral-700 text-sm shadow-xs flex flex-col gap-y-[1px]`}>
                          <p onClick={()=>router.push(`/my-nest/createCampaign/${campaign.campaignId}/${campaign.statusOfCampaign === 'Draft'?'basics':'milestones'}`)} className={`${campaign.statusOfCampaign === 'InReview' || campaign.statusOfCampaign === 'Ended' ? 'hidden':''} px-3 py-[5px] hover:bg-light-neutral-400 rounded-sm`}>Edit</p>
                          <p className={`${campaign.statusOfCampaign === 'PreLaunched' || campaign.statusOfCampaign === 'Draft' ? '':'hidden'} px-3 py-[5px] hover:bg-light-neutral-400 rounded-sm`}>Delete</p>
                          <p className={`${campaign.statusOfCampaign ==='Live'? '':'hidden'} px-3 py-[5px] hover:bg-light-neutral-400 rounded-sm`}>End Campaign</p>
                          <p className={`${campaign.statusOfCampaign === 'InReview' || campaign.statusOfCampaign === 'Draft' ? 'hidden':''} px-3 py-[5px] hover:bg-light-neutral-400 rounded-sm`}>View Statistics</p>                          
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" onClick={()=>!showMoreOptions ? setShowMoreOptions(index+1) : setShowMoreOptions(false)}>
                          <path d="M12.3751 11.6248L12.3751 12.3748M11.6251 11.6248V12.3748M12.3751 4.62476L12.3751 5.37476M11.6251 4.62476V5.37476M12.3751 18.6248L12.3751 19.3748M11.6251 18.6248V19.3748M12 13C11.4477 13 11 12.5523 11 12C11 11.4477 11.4477 11 12 11C12.5523 11 13 11.4477 13 12C13 12.5523 12.5523 13 12 13ZM12 6C11.4477 6 11 5.55229 11 5C11 4.44772 11.4477 4 12 4C12.5523 4 13 4.44772 13 5C13 5.55229 12.5523 6 12 6ZM12 20C11.4477 20 11 19.5523 11 19C11 18.4477 11.4477 18 12 18C12.5523 18 13 18.4477 13 19C13 19.5523 12.5523 20 12 20Z" stroke="#282828" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>  
                      </div>                      
                    </div>
                  </div>
                </div>
              ))}
            </div>              
          </div>
        : <div className='flex justify-center items-center h-full w-full text-center'>
            <div className='h-fit -mt-20'>
              <img src="/images/megaPhone.png" className='w-full' />
              <h3 className='text-[28px] font-[500]'>
                This is your creative world
              </h3>
              <h4 className='text-[21px] font-[400]'>
                Build your first campaign with Ikarus Nest
              </h4>
            </div>        
          </div>
    }      
    </div>    
  )
}

export default MyCampaigns