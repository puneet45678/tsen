import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import Menu from './Menu'
import License from './TiersLicense';
import TiersDataCompo from './TiersData';
import { motion } from "framer-motion"
import axios from 'axios';
import Link from 'next/link';

const Tiers = (props) => {
  const tiersDataSlice = useSelector((state) => state.campaign.tiers.tiersData);
  const tiersSlice2 = useSelector((state) => state.campaign.tiers);

  const handleSaveTiers = () => {
    console.log("tiersSlice2", tiersSlice2);
    axios.put(
      `${process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE}/api/v1/campaigns/${props.campaignId}/create-update-tier`,
      tiersSlice2,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json"
        }
      }
    ).then((res) => {
      console.log(res);
    }).catch((err) => {
      console.log(err);
    });

    props.setSave(true);
    console.log("tiers data saved", props.save);
  }

  const menuItems = [
    {
      title: "Tiers",
      setState: "Tiers"
    },
    // {
    //   title: "License",
    //   setState: "License"
    // },
  ];

  useEffect(() => {
    console.log("tierslice", tiersSlice2);
  }, [])

  return (
    <>
      <div className='h-full hidden md:block bg-accent2 mr-16 lg:mr-0 '>
        <Menu heading="Tiers" items={menuItems}></Menu>
      </div>

      <div className='top-32 flex justify-end fixed z-30 right-6 bg-accent2'>
        <motion.button whileTap={{ scale: 0.9 }} disabled={!props.save} className={`w-[80px] text-sm py-1 px-3 mr-2 rounded-[2px] shadow-md ${!props.save ? "bg-primary-brand hover:bg-sky-500 opacity-50 text-white disabled pointer-events-none" : "bg-primary-brand hover:bg-sky-500 text-white"}`} >
          <Link href={props.save ? `/campaign/${props.campaignId}/about` : ''} target="_blank">
            Preview
          </Link>
        </motion.button>
        <motion.button whileTap={{ scale: 0.9 }} className={`w-[80px] text-sm py-1 px-3 mr-2 rounded-[2px] shadow-md ${props.save ? "bg-primary-brand opacity-50 text-white" : "bg-primary-brand hover:bg-sky-500 text-white"}`} onClick={handleSaveTiers}>
          Save
        </motion.button>
      </div>

      <div className='lg:ml-60 mt-24 bg-accent2 w-full lg:w-[85%] overflow-x-hidden top-32 font-montserrat'>
        <TiersDataCompo campaignId={props.campaignId} save={props.save} setSave={props.setSave} tiersDataSlice={tiersDataSlice} tiersSlice2={tiersSlice2} />
        {/* <License save={props.save} setSave={props.setSave} /> */}
      </div>
    </>
  )
}

export default Tiers