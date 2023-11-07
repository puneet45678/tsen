import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import Menu from './Menu';
import AboutCampaign from './BasicsAbout';
import BasicsMetaData from './BasicsMetaData';
import PrintingRecommendations from './BasicsPrinting';
import Warnings from './BasicsWarnings';
import Tags from './BasicsTags';
import { changeSection } from '../store/sectionSlice';
import { motion } from "framer-motion"
import axios from 'axios';
import Link from 'next/link'

const CreateCampaignBasics = (props) => {

  const aboutDetails = useSelector((state) => state.campaign.basics.about);
  const tagsDetails = useSelector((state) => state.campaign.basics.tags);
  const printingDetails = useSelector((state) => state.campaign.basics.printingDetails);
  const metaData = useSelector((state) => state.campaign.basics.metaData);
  const menuClick = useSelector((state) => state.section.menuClick);
  const [metaImage, setMetaImage] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState();



  const [isImageChanged, setIsImageChanged] = useState(false);
  const section = useSelector((state) => state.section.section);
  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const dispatch = useDispatch();
  const [imagesUrl, setImagesUrl] = useState([]);

  const handleSave = () => {
    console.log("tagsDetails", tagsDetails)
    axios.put(
      `${process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE}/api/v1/campaigns/${props.campaignId}/basics`,
      { about: aboutDetails, tags: tagsDetails, printingDetails, metaData },
      {
        withCredentials: true,
      }
    ).then((res) => {
      console.log(res);
    }).catch((err) => {
      console.log(err);
    });
    props.setSave(true);
    // }
  };

  const menuItems = [
    {
      title: "About Campaign",
      setState: "AboutCampaign"
    },
    {
      title: "Tags",
      setState: "Tags"
    },
    // {
    //   title: "Printing details",
    //   setState: "PrintingDetails"

    // },
    {
      title: "Meta Data",
      setState: "MetaData"

    },
    {
      title: "Warnings",
      setState: "Warnings"
    }
  ];

  useEffect(() => {
    const element = document.getElementById(section);
    console.log(section)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, [section])

  useEffect(() => {
    dispatch(changeSection("AboutModel"))
  }, [])
  return (
    <>
      <div className='h-full hidden md:block bg-accent2 mr-16 lg:mr-0 '>
        <Menu heading="Basics" items={menuItems}></Menu>
      </div>

      <div className='top-36 md:top-32 flex justify-end fixed z-30 right-6 bg-accent2'>
        <motion.button whileTap={{ scale: 0.9 }} disabled={!props.save} className={`w-[80px] text-sm py-1 px-3 mr-2 rounded-[2px] shadow-md ${!props.save ? "bg-primary-brand hover:bg-sky-500 opacity-50 text-white disabled pointer-events-none" : "bg-primary-brand hover:bg-sky-500 text-white"}`} >
          <Link href={props.save ? `/campaign/${props.campaignId}/about` : ''} target="_blank">
            Preview
          </Link>
        </motion.button>
        <motion.button whileTap={{ scale: 0.9 }} className={`w-[80px] text-sm py-1 px-3 mr-2 rounded-[2px] shadow-md ${props.save ? "bg-primary-brand hover:bg-sky-500 opacity-50  text-white disabled pointer-events-none" : "bg-primary-brand hover:bg-sky-500 text-white"}`} onClick={handleSave}>
          Save
        </motion.button>
      </div>

      <div className='lg:ml-60 mt-24 bg-accent2 w-full lg:w-[85%] overflow-x-hidden top-32 font-montserrat '>
        <AboutCampaign campaignId={props.campaignId} save={props.save} setSave={props.setSave} aboutDetails={aboutDetails} menuClick={menuClick} isImageChanged={isImageChanged} setIsImageChanged={setIsImageChanged} files={files} setFiles={setFiles} uploadedFiles={uploadedFiles} setUploadedFiles={setUploadedFiles} imagesUrl={imagesUrl} setImagesUrl={setImagesUrl} />
        <Tags save={props.save} setSave={props.setSave} tagsData={tagsDetails} menuClick={menuClick} />
        {/* <PrintingRecommendations save={props.save} setSave={props.setSave} printingDetails={printingDetails} menuClick={menuClick} /> */}
        <BasicsMetaData campaignId={props.campaignId} imagesUrl={imagesUrl} save={props.save} setSave={props.setSave} metaData={metaData} menuClick={menuClick} metaTitle={metaTitle} setMetaTitle={setMetaTitle} metaImage={metaImage} setMetaImage={setMetaImage} metaDescription={metaDescription} setMetaDescription={setMetaDescription} />
        <Warnings save={props.save} setSave={props.setSave} campaignData={props.campaignData} menuClick={menuClick} setCampaignData={props.setCampaignData} />
      </div >
    </>
  )
}

export default CreateCampaignBasics
// props.imagesUrl