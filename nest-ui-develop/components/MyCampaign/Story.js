import React, { useEffect, useState } from 'react'
import parse from "html-react-parser";
import axios from 'axios';

const Story = (props) => {

  const [ storyDescription, setStoryDescription ] = useState("");

  useEffect(()=>{    
    const getStoryData = async ()=>{
      const storyDescriptionData = await axios.get(`${process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE}/api/v1/campaigns/${props.campaignId}/field/story`,{
        withCredentials: true
      });
      setStoryDescription(storyDescriptionData.data.story.storyDescription);
    }

    getStoryData();
  }, [])

  return (
    <div className='w-full '>      
      {parse(storyDescription)}
    </div>
  )
}

export default Story