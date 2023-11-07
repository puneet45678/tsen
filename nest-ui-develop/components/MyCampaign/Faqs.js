import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Faqs = (props) => {

  const [ faqsData, setFaqsData ] = useState();

  useEffect(()=>{    
    const getStoryData = async ()=>{
      const storyDescriptionData = await axios.get(`${process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE}/api/v1/campaigns/${props.campaignId}/field/story`,{
        withCredentials: true
      });      
      setFaqsData(storyDescriptionData.data.story.faqs);
    }

    getStoryData();
  }, [])

  return (
    <div className='flex flex-col gap-y-6 pl-4'>
      {faqsData ? faqsData.map((item, index)=>(
        <div>
          <h3 className='text-dark-neutral-700 text-headline-2xs font-[500]'>
            Question {index+1}.  {item.question}
          </h3>          
          <p className='text-md text-dark-neutral-200'>
            {item.answer}
          </p>
        </div>
      )):''}
    </div>
  )
}

export default Faqs