import React from 'react'
import StoryDescription from './StoryDescription'
import Faqs from './StoryFaqs'
import Menu from './Menu'
import { motion } from "framer-motion"
import axios from 'axios'
import { useDispatch, useSelector } from "react-redux";
import Link from 'next/link'

const Story = (props) => {
  const StoryDataDescription = useSelector((state) => state.campaign.story.description);
  const storyDetailsFaqs = useSelector((state) => state.campaign.story.faqs);
  const state = useSelector((state) => state.campaign);
  // const StoryDataDescription = state.about.title;
  // const storyDetailsFaqs = state.about.faqsData;

  const handleSaveStory = () => {
    console.log(StoryDataDescription);
    axios.put(
      `${process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE}/api/v1/campaigns/${props.campaignId}/story/description`,
      { description: StoryDataDescription },
      {
        withCredentials: true,
      }
    )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });

    const faqDataPost = axios.put(
      `${process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE}/api/v1/campaigns/${props.campaignId}/create-update-faq`, storyDetailsFaqs,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
      }
    ).then((res) => {
      console.log("faqdata response", res);
    }).catch((err) => {
      console.log("storyFaqRedux", storyDetailsFaqs);
      console.log(err);
    });

    console.log("faqsDataPost", faqDataPost);


    // axios
    //   .post(
    //     `http://localhost:8000/campaigns/6400329ea8b5ac29e43de889/faqs`,
    //     { faqs: storyDetailsFaqs },
    //     {
    //       withCredentials: true,
    //     }
    //   )
    //   .then((res) => {
    //     console.log(res);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    props.setSave(true);
  }


  const menuItems = [
    {
      title: "Story",
      setState: "title"
    },
    {
      title: "Faqs",
      setState: "faqs"
    }
  ];

  return (
    <>
      <div className='h-full hidden md:block bg-accent2 mr-16 lg:mr-0 '>
        <Menu heading="About" items={menuItems}></Menu>
      </div>

      <div className='top-32 flex justify-end fixed z-30 right-6 bg-accent2'>
        <motion.button whileTap={{ scale: 0.9 }} disabled={!props.save} className={`w-[80px] text-sm py-1 px-3 mr-2 rounded-[2px] shadow-md ${!props.save ? "bg-primary-brand hover:bg-sky-500 opacity-50 text-white disabled pointer-events-none" : "bg-primary-brand hover:bg-sky-500 text-white"}`} >
          <Link href={props.save ? `/campaign/${props.campaignId}/about` : ''} target="_blank">
            Preview
          </Link>
        </motion.button>
        <motion.button whileTap={{ scale: 0.9 }} className={`w-[80px] text-sm py-1 px-3 mr-2 rounded-[2px] shadow-md ${props.save ? "bg-primary-brand opacity-50 text-white disabled pointer-events-none" : "bg-primary-brand hover:bg-sky-500 text-white"}`} onClick={handleSaveStory}>
          Save
        </motion.button>
      </div>

      <div className='lg:ml-60 mt-24 bg-accent2 w-full lg:w-[85%] overflow-x-hidden top-32 font-montserrat'>
        <StoryDescription save={props.save} setSave={props.setSave} storyData={StoryDataDescription} />
        <Faqs save={props.save} campaignId={props.campaignId} setSave={props.setSave} storyData={storyDetailsFaqs} setCampaignData={props.setCampaignData} campaignData={props.campaignData} />
      </div>
    </>
  )
}

export default Story