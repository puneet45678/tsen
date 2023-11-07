import React, { useEffect, useState } from 'react'
import CampaignBasics from "./MyCampaigns/Basics";
import CampaignStory from './MyCampaigns/Story';
import CampaignPreMarketing from "./MyCampaigns/PreMarketing";
import CampaignRewardTiers from "./MyCampaigns/RewardTiers";
import CampaignMilestones from "./MyCampaigns/Milestones";
import CampaignUpdates from "./MyCampaigns/Updates";
import { useRouter } from "next/router";
import SubMenu from '../SubMenu';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { changeBasics, setAllData } from '../../store/campaignSlice';

const CreateCampaign = ({ setChangesToPage, queries }) => {
  
  const dispatch = useDispatch();
  const router = useRouter();
  const [ publishClicked, setPublishClicked ] = useState(false);
  const campaignData = useSelector((state)=>state.campaign);  
  const [basicsInvalid, setBasicsInvalid] = useState(new Set());
  const [storyInvalid, setStoryInvalid] = useState(new Set());
  const [premarketingInvalid, setPremarketingInvalid] = useState(new Set());
  const [rewardsInvalid, setRewardsInvalid] = useState(new Set());
  const [milestonesInvalid, setMilestonesInvalid] = useState(new Set());
  const [updatesInvalid, setUpdatesInvalid] = useState(new Set());
  const [campaignDataChanged, setCampaignDataChanged] = useState(new Set());
  const [showDraftBanner, setShowDraftBanner] = useState(false);

  const subMenuItems =campaignData.statusOfCampaign === 'Draft' ? [
    {
        title: "Basics",        
        to: `createCampaign/${queries[0]}/basics`
    },
    {
      title:"Story",
      to: `createCampaign/${queries[0]}/story`
    },
    {
        title: "Pre-marketing",        
        to: `createCampaign/${queries[0]}/pre-marketing`
    },    
    {
        title: "Reward tiers",        
        to: `createCampaign/${queries[0]}/reward-tiers`
    },
    {
      title: "Milestones",      
      to: `createCampaign/${queries[0]}/milestones`
    },
    {
        title: "Updates",        
        to: `createCampaign/${queries[0]}/updates`
    }
  ]
  :[
    {
      title: "Milestones",      
      to: `createCampaign/${queries[0]}/milestones`
    },
    {
        title: "Updates",        
        to: `createCampaign/${queries[0]}/updates`
    }
  ];  

  const handleSaveAsDraft = async (exit) =>{    
    try {      

      if(exit){
        const draftResponse = await axios.put(`${process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE}/api/v1/campaign/${queries[0]}`, campaignData, {
            withCredentials: true
        })    

        setShowDraftBanner(false);
        setCampaignDataChanged(new Set());
        router.push("/my-nest/mycampaigns");
      }

      else{

        const draftResponse = await axios.put(`${process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE}/api/v1/campaign/${queries[0]}`,
          {...campaignData, statusOfCampaign:"Live"}
        , {
            withCredentials: true
        })   

        setShowDraftBanner(false);
      }   
    
    }
    catch(e){
      console.log(e);
    }
  }  

  const handleDiscardCampaign = async ()=>{
    const campaignDiscarded = axios.post(`${process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE}/api/v1/campaign/${queries[0]}/discard?comment=testSubmitComment`,'',{
      withCredentials:true
    })
    console.log("camapaign discarded ", campaignDiscarded)
  }

  const publishHandler = async () =>{

    setPublishClicked(true);
    console.log("publish handler basics", basicsInvalid, "preMarkDp", campaignData.premarketing.premarketingDp, "preMarkdesc", campaignData.premarketing.premarketingDescription, "storydesc", campaignData.story.storyDescription, "tierModelIds", campaignData.rewardAndTier, "mileModelIds", campaignData.milestone);
    //Basics Validation
    if(!campaignData.basics.campaignTitle)
      setBasicsInvalid(prevSet => new Set([...prevSet, 'campaignTitle']))
    if(!campaignData.basics.category)
      setBasicsInvalid(prevSet => new Set([...prevSet, 'category']))
    // if(!campaignData.basics.coverImage && !campaignData.basics.coverVideo)
    //   setBasicsInvalid(prevSet => new Set([...prevSet, 'coverMedia']))
    // if(!campaignData.basics.metaTitle)
    //   setBasicsInvalid(prevSet => new Set([...prevSet, 'metaTitle']))
    // if(!campaignData.basics.metaDesc)
    //   setBasicsInvalid(prevSet => new Set([...prevSet, 'metaDesc']))
    // if(!campaignData.basics.metaImage)
    //   setBasicsInvalid(prevSet => new Set([...prevSet, 'metaImage']))
      
    //PreMarketing Validation
    if(!campaignData.premarketing.premarketingDp && !campaignData.premarketing.premarketingVideo)
      setPremarketingInvalid(prevSet => new Set([...prevSet, 'premarketingMedia']))
    if(!campaignData.premarketing.premarketingDescription)
      setPremarketingInvalid(prevSet => new Set([...prevSet, 'premarketingDescription']))

    //Story Validation
    if(!campaignData.story.storyDescription)
      setStoryInvalid(prevSet => new Set([...prevSet, 'storyDescription']))

    //Tiers Validation
    for(let i = 0; i < campaignData.rewardAndTier.length; i++)
      if(!campaignData.rewardAndTier[i].modelIds || campaignData.rewardAndTier[i].modelIds.length === 0
        )
        setRewardsInvalid(prevSet => new Set([...prevSet, campaignData.rewardAndTier[i].tierId]))    

    //Milestone validations
    // console.log("campaignDataa ", campaignData)
    for(let i = 0; i < campaignData.milestone.length; i++){      

      if(!campaignData.milestone[i].modelIds || campaignData.milestone[i].modelIds.length === 0
        )
        setMilestonesInvalid(prevSet => new Set([...prevSet, campaignData.milestone[i].milestoneId]))
    }

    if(basicsInvalid.size == 0 && premarketingInvalid.size == 0 && storyInvalid.size == 0 && rewardsInvalid.size == 0 && milestonesInvalid.size == 0){
      const campaignPublished = await axios.post(`${process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE}/api/v1/campaign/${queries[0]}/submit?comment=testSubmitComment`,'',{
        withCredentials:true
      })
      console.log("statusOfCampSubmission ", campaignPublished.data)
    }

  }
  useEffect(()=>{    
    const getCampaignData = async () =>{
      const campData = await axios.get(`${process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE}/api/v1/campaigns/${queries[0]}/field/all`, {
        withCredentials: true
      });
      console.log("{...campData.data} ", {...campData.data, basics:{...campData.data.basics, launchDate: new Date(campData.data.basics.launchDate), endingOn: new Date(campData.data.basics.endingOn)}});
      dispatch(setAllData({...campData.data, basics:{...campData.data.basics, launchDate: new Date(campData.data.basics.launchDate), endingOn: new Date(campData.data.basics.endingOn)}}))            
    }    

    getCampaignData();
  },[])

  useEffect(()=>{
    console.log(console.log('begotten campaignData ', campaignData))
  },[campaignData])
  
  return (
    <div className='overflow-y-hidden relative'>
      <div className={`${showDraftBanner ? "" : "hidden"} absolute bg-black/30 backdrop-blur-md inset-0 w-full h-full z-20`}></div>
      <div className={`${showDraftBanner ? "" : "hidden"} absolute bg-[#FFF] rounded-md px-12 py-8 z-30 w-fit mx-auto left-0 right-0 mt-12 flex flex-col gap-8`}>
        <div className='flex w-full justify-between'>
          <span className='text-2xl font-[600]'>Save as Draft</span>
          <div onClick={()=>setShowDraftBanner(false)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 stroke-[1.5px] hover:stroke-[2px]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>                
          </div>
        </div>
        <div className='text-base font-[500] w-[90%]'>
            You have unsaved changes. Save as draft to preserve your progress for later editing?
        </div>
        <div className='flex justify-end gap-4'>
            <button className='rounded-md px-4 py-3 border-[1.5px] border-[#171717] hover:bg-[#171717] hover:text-[#FFF]' onClick={()=>handleSaveAsDraft(true)}>Save & exit</button>
            <button className='rounded-md px-4 py-3 bg-[#171717] text-white' onClick={()=>handleSaveAsDraft(false)}>Continue editing</button>
        </div>            
      </div>
      <div className='px-10 py-8 bg-[#f5f5f5] flex justify-between items-center'>
        <div className='w-fit flex gap-4'>
          <h2 className='text-[#181818]/60'>
              My Campaigns
          </h2>
          <span>
              {'>'}
          </span>
          <h2>
              New Campaign
          </h2>
        </div>
        <div className='w-fit flex gap-4'>
            <button className='bg-white p-2 rounded-md' onClick={handleDiscardCampaign}>Discard</button>
            <button className='border-[#262626] border-2 p-2 rounded-md hover:bg-[#171717] hover:text-[#FFF]' onClick={()=>router.push(`/my-campaigns/${queries[0]}`)}>Preview</button>
            <button className='border-[#262626] border-2 p-2 rounded-md hover:bg-[#171717] hover:text-[#FFF]'  onClick={()=>setShowDraftBanner(true)}>Save as draft</button>
            <button className='bg-primary-brand text-white p-2 rounded-md' onClick={publishHandler}>Publish</button>
        </div>
      </div>
      <div className='flex h-full bg-[#f5f5f5]'>
        <div className='bg-[#f5f5f5] w-[20%] pl-8'>
          <SubMenu subSection={queries[1]} campaignId={queries[0]} subMenuItems={subMenuItems} 
            campaignDataChanged={campaignDataChanged} setCampaignDataChanged={setCampaignDataChanged}              
            invaliditySets={[
              basicsInvalid,
              storyInvalid,
              premarketingInvalid,
              rewardsInvalid,
              milestonesInvalid,
              updatesInvalid           
            ]}            
            publishClicked={publishClicked}
          />
        </div>
        <div className='w-[80%] overflow-y-scroll bg-white' style={{height: "calc(100vh - 167px)"}}>
          {            
            queries[1] === 'basics'
            ? <CampaignBasics setBasicsInvalid={setBasicsInvalid} campaignData={campaignData} publishClicked={publishClicked} basicsInvalid={basicsInvalid} setCampaignDataChanged={setCampaignDataChanged} campaignId={queries[0]} />
            : queries[1] === 'story'
            ? <CampaignStory publishClicked={publishClicked} setStoryInvalid={setStoryInvalid} storyInvalid={storyInvalid} setCampaignDataChanged={setCampaignDataChanged} campaignId={queries[0]} />
            : queries[1] === 'pre-marketing'
            ? <CampaignPreMarketing publishClicked={publishClicked} setPremarketingInvalid={setPremarketingInvalid} premarketingInvalid={premarketingInvalid} setCampaignDataChanged={setCampaignDataChanged} campaignId={queries[0]} />
            : queries[1] === 'reward-tiers'
            ? <CampaignRewardTiers publishClicked={publishClicked} rewardsInvalid={rewardsInvalid} setCampaignDataChanged={setCampaignDataChanged} campaignId={queries[0]} />
            : queries[1] === 'milestones'
            ? <CampaignMilestones publishClicked={publishClicked} milestonesInvalid={milestonesInvalid} setCampaignDataChanged={setCampaignDataChanged} campaignId={queries[0]} />
            : queries[1] === 'updates'
            ? <CampaignUpdates setCampaignDataChanged={setCampaignDataChanged} campaignId={queries[0]} />
            : <></>
          }
        </div>          
      </div>
    </div>    
  )
}

export default CreateCampaign