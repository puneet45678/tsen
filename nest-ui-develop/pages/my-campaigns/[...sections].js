import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router';  
import axios from 'axios';
import CampaignDetailedView from '../../components/CampaignDetailedView';
import Tiers from '../../components/MyCampaign/Tiers';
import Tier from '../../components/MyCampaign/Tier';

const MyCampaigns = () => {

  const router = useRouter();
  const campaignId = router.query && router.query.sections ? router.query.sections[0]:'';

  // const [ campaignData, setCampaignData ] = useState();
  
  // useEffect(()=>{
  //   const getCampaignData = async () =>{
  //     try{
  //       const campaignData = await axios.get(`${process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE}/api/v1/campaings/${campaignId}/field/all`);
  //       setCampaignData(campaignData);
  //     }
  //     catch(e){
  //       console.log("error fetching campaignData");
  //     }
  //   }
  
  //   getCampaignData();
  // })

  return (
    <>
      { router.query && router.query.sections 
        ? router.query.sections.length === 1 
          ? <CampaignDetailedView tiersLink="/my-campaigns" campaignId={campaignId} /> 
          : router.query.sections.length === 3 && router.query.sections[1] === 'tiers'
            ? <Tier tiersLink="/my-campaigns" campaignId={campaignId} tierId={router.query.sections[2]} />
            : router.query.sections[1] === 'tiers' 
              ? <Tiers campaignId={campaignId} tiersLink="/my-campaigns"/>
              : ''
        : ''
      }
    </>    
  )
}
export default MyCampaigns