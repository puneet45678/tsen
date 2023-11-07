import React, { useEffect } from 'react';
import ExploreCampaigns from '../../components/Image/ExploreCampaigns';
import { useRouter } from 'next/router';
import CampaignDetailedView from '../../components/CampaignDetailedView';
import Tiers from '../../components/MyCampaign/Tiers';
import Tier from '../../components/MyCampaign/Tier';

const Campaigns = () => {

    const router = useRouter();    
    // console.log("router.query ",router.query)        

  return (
    <>
    {(router.query && router.query.sections && router.query.sections.length === 1 && router.query.sections[0] === "explore")
        ? <ExploreCampaigns />
        : (router.query  && router.query.sections && router.query.sections.length === 2)
            ? <CampaignDetailedView tiersLink="/campaigns/explore" campaignId={router.query.sections[1]} />
            : (router.query  && router.query.sections && router.query.sections.length === 3)
              ? <Tiers tiersLink="/campaigns/explore" campaignId={router.query.sections[1]} />
              : (router.query  && router.query.sections && router.query.sections.length === 4)
              ? <Tier tiersLink="/campaigns/explore" campaignId={router.query.sections[1]} tierId={router.query.sections[3]} />
              :''

    }
    </>
  )
}

export default Campaigns