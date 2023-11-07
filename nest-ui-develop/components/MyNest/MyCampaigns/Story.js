import React from 'react'
import StoryDescription from '../../StoryDescription'
import Faqs from './Faqs';
import SectionLayout from '../../Layouts/SectionLayout'
import { useSelector } from 'react-redux'; 

const Story = (props) => {

    const story = useSelector((state) => state.campaign.story);

    const storyChildren = 
        <div className='flex flex-col gap-8'>
            <div>
                <StoryDescription setStoryInvalid={props.setStoryInvalid} storyInvalid={props.storyInvalid} publishClicked={props.publishClicked} setCampaignDataChanged={props.setCampaignDataChanged} />          
            </div>
            <div>
                <Faqs faqs={story ? story.faqs : []} campaignId={props.campaignId} />
            </div>
        </div>

  return (
    <div className='bg-white h-auto'>
        <SectionLayout heading='Story' subHeading="Describe your tale to the viewers" children={storyChildren}/>       
    </div>
  )
}

export default Story