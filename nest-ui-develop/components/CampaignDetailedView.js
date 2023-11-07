import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import debounce from 'lodash.debounce';
import Comments from './MyCampaign/Comments';
import Faqs from './MyCampaign/Faqs';
import Milestones from './MyCampaign/Milestones';
import Reviews from './MyCampaign/Reviews';
import Story from './MyCampaign/Story';
import Updates from './MyCampaign/Updates';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

const CampaignDetailedView = (props) => { 
    
    const carouselRef = useRef();
    const user = useSelector((state)=>state.user)    
    const router = useRouter();    
    const [ statusOfCampaign, setStatusOfCampaign ] = useState();
    const [ carouselWidth, setCarouselCardWidth ] = useState(12);
    const [ basicsData, setBasicsData ] = useState({});
    const [ backersData, setBackersData ] = useState([]);
    const [ raisedAmount, setRaisedAmount ] = useState(0);
    const [ tiersData, setTiersData ] = useState();
    const [ disableLeft, setDisableLeft ] = useState(true);
    const [ disableRight, setDisableRight ] = useState(false);
    const [ campaignSection, setCampaignSection ] = useState("Story");
    const [ selectedMedia, setSelectedMedia ] = useState();    
    const updateCarouselCardWidth = debounce(async ()=>{        
        setCarouselCardWidth((carouselRef.current.clientWidth - 64)* 0.20);
    }, 300)

    const handleScrollForward = () => {
        
        setDisableLeft(false);

        if(carouselRef.current.scrollLeft >= (basicsData.basicsImages.length*carouselWidth + (basicsData.basicsImages.length-1)*16) - (5* carouselWidth + 4*16) - 1)
            setDisableRight(true);
        else{            
            carouselRef.current.scrollTo({
              left: carouselRef.current.scrollLeft + carouselWidth * 2,
              behavior: 'smooth',
            });
            
            if(carouselRef.current.scrollLeft >= (basicsData.basicsImages.length*carouselWidth + (basicsData.basicsImages.length-1)*16) - (5* carouselWidth + 4*16) - 1)
                setDisableRight(true);
            else
                setDisableRight(false);
        }
      };
    
    const handleScrollBackward = () => {
    
      setDisableRight(false);

      if(carouselRef.current.scrollLeft === 0){
        setDisableLeft(true);
      }
      else{        
        carouselRef.current.scrollTo({
          left: carouselRef.current.scrollLeft - carouselWidth * 2,
          behavior: 'smooth',
        });

        if(carouselRef.current.scrollLeft === 0)
            setDisableLeft(true);        
        else
            setDisableLeft(false);
      }
    };
    
    useEffect(()=>{                         

        const getCampaignStatus = async () =>{
            const statusOfCampaign = await axios.get(`${process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE}/api/v1/campaigns/${props.campaignId}/field/statusOfCampaign`,{
                widthCredentials: true
            })  
            setStatusOfCampaign(statusOfCampaign.data.statusOfCampaign);
        }                          

        const getBasicsData = async () =>{
            const basicsData = await axios.get(`${process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE}/api/v1/campaigns/${props.campaignId}/field/basics`,{
                widthCredentials: true
            })                  
            if(basicsData.data.basics.coverImage)
                setSelectedMedia(basicsData.data.basics.coverImage)
            else
                setSelectedMedia(basicsData.data.basics.basicsImages[0].imageUrl)
            setBasicsData(basicsData.data.basics);
            console.log("got the basics ", basicsData);
        }

        const getBackersData = async () =>{
            const backersData = await axios.get(`${process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE}/api/v1/campaigns/${props.campaignId}/field/backers`,{
                withCredentials: true
            });
            
            setBackersData(backersData.data.backers);
        }

        const getTiersData = async () =>{
            const tiersData = await axios.get(`${process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE}/api/v1/campaigns/${props.campaignId}/field/rewardAndTier`,{
                widthCredentials: true
            })
            console.log('tiersData.data.rewardAndTier', tiersData.data.rewardAndTier);
            let raisedAmount = 0;
            for(let i = 0; i < tiersData.data.rewardAndTier.length; i++)
                raisedAmount += tiersData.data.rewardAndTier[i].tierAmount*(tiersData.data.rewardAndTier[i].noOfBacker || 0);           
                
            setRaisedAmount(raisedAmount);
            setTiersData(tiersData.data.rewardAndTier);
        }
        
        window.addEventListener('resize',updateCarouselCardWidth);
        setCarouselCardWidth((carouselRef.current.clientWidth - 64) * 0.20);        
        getBasicsData();   
        getCampaignStatus();
        getBackersData();
        getTiersData();
    },[])
    
      return (
        <div className=''>
            <div className='mx-page-mx-lg flex justify-between gap-[48px] mt-section-my-lg'>
                <div className='w-[55%] flex flex-col'>                    
                    <div className='w-full aspect-[57/31]'>
                        {/* <iframe className={`${basicsData.coverVideo ? "" : "hidden"} w-full h-full rounded-[10px`} src="https://www.youtube.com/embed/nov6Q3h5_gM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>                     */}
                        <img src={selectedMedia} className='w-full aspect-[57/31] object-cover' />
                    </div>                    
                    <div className='flex items-center w-full mt-3'>
                        <button className={`${ disableLeft ? 'bg-light-neutral-700' : 'bg-primary-purple-500' } w-8 h-8 min-w-[32px] min-h-[32px] cursor-pointer rounded-full flex items-center justify-center`}
                            onClick={handleScrollBackward}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className='w-full h-full m-2' viewBox="0 0 18 18" fill="none">
                              <path d="M10.4999 4.5L6.53022 8.46967C6.23732 8.76256 6.23732 9.23744 6.53022 9.53033L10.4999 13.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                        </button>
                        <div ref={carouselRef} className='relative w-full overflow-x-scroll mx-4 no-scrollbar snap-x' style={{minHeight:carouselWidth*(31/45)+'px'}}>
                            <div className='absolute w-fit flex justify-between h-full gap-4'>
                                {basicsData && basicsData.basicsImages ? basicsData.basicsImages.map((item, index)=>(
                                    <div onClick={()=>setSelectedMedia(item.imageUrl)} className='relative rounded-[5px] snap-center aspect-[45/31]' style={{width:carouselWidth+'px', paddingTop:carouselWidth*0.02+'px', paddingBottom:carouselWidth*0.02+'px'}}>                                        
                                        <img src={item.imageUrl} className='h-full w-full object-cover object-right rounded-[5px]' />
                                    </div>
                                )):''}
                            </div>
                        </div>                        
                        <button className={`${ disableRight ? 'bg-light-neutral-700' : 'bg-primary-purple-500' } w-8 h-8 min-w-[32px] min-h-[32px] cursor-pointer rounded-full flex items-center justify-center`}
                            onClick={handleScrollForward}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className='w-full h-full m-2' viewBox="0 0 18 18" fill="none">
                              <path d="M7.5 4.5L11.4697 8.46967C11.7626 8.76256 11.7626 9.23744 11.4697 9.53033L7.5 13.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                        </button>                        
                    </div>
                </div>
                <div className='w-[45%] flex flex-col'>
                    <div className='flex flex-row gap-6 mt-4'>
                        <div className='rounded-[4px] px-[14px] py-[6px] bg-success flex justify-center items-center gap-1 text-md font-normal text-white'>
                            <div className='bg-white w-[6px] h-[6px] rounded-full'></div>
                            <span>
                                {statusOfCampaign}
                            </span>                        
                        </div>
                        <div className='bg-light-neutral-100 rounded-[100px] px-[14px] py-[6px] flex justify-center items-center gap-1'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <path d="M2 6.66667H14M6 3.33333H4.13333C3.3866 3.33333 3.01323 3.33333 2.72801 3.47866C2.47713 3.60649 2.27316 3.81046 2.14532 4.06135C2 4.34656 2 4.71993 2 5.46667V11.8667C2 12.6134 2 12.9868 2.14532 13.272C2.27316 13.5229 2.47713 13.7268 2.72801 13.8547C3.01323 14 3.3866 14 4.13333 14H11.8667C12.6134 14 12.9868 14 13.272 13.8547C13.5229 13.7268 13.7268 13.5229 13.8547 13.272C14 12.9868 14 12.6134 14 11.8667V5.46667C14 4.71993 14 4.34656 13.8547 4.06135C13.7268 3.81046 13.5229 3.60649 13.272 3.47866C12.9868 3.33333 12.6134 3.33333 11.8667 3.33333H10M6 3.33333H10M6 3.33333V3C6 2.44772 5.55228 2 5 2C4.44772 2 4 2.44772 4 3V3.33333M10 3.33333V3C10 2.44772 10.4477 2 11 2C11.5523 2 12 2.44772 12 3V3.33333" stroke="#323539" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                            <span className='text-md font-normal text-dark-neutral-700'>
                                Ends on {
                                            basicsData && basicsData.endingOn ? new Intl.DateTimeFormat('en', {
                                                month: 'short',
                                                day: 'numeric'
                                              }).format(new Date(basicsData.endingOn))
                                              : ''
                                        }
                            </span>
                        </div>
                    </div>
                    <div className='mt-8'>
                        <div className='flex items-center'>
                            <span className='text-xs font-normal text-dark-neutral-700'>
                                Category:
                            </span>
                            <h3 className='text-secondary-blue font-[500] ml-2 text-md'>{basicsData.category} </h3>                            
                        </div>
                        <h1 className='text-headline-sm font-[600] text-dark-neutral-700 mt-3'>
                            {basicsData.campaignTitle}
                        </h1>
                        <h3 className='mt-2 text-md text-dark-neutral-200'>
                            {basicsData.tagline}
                        </h3>
                    </div>
                    <div className='flex gap-[45px] items-center mt-12'>
                        <a href="" className='flex gap-5 items-center'>
                            <div className='w-16 h-16 rounded-full overflow-hidden'>                                
                                <img src={user && user.displayInformation ? user.displayInformation.profilePicture.croppedPictureUrl:''} 
                                    className='w-full h-full object-cover object-right'/>
                            </div>
                            <div>
                                <h3 className='text-lg text-dark-neutral-700 font-[500]'>{user && user.accountInformation ? user.accountInformation.fullName : ''}</h3>
                                <h4 className='text-md text-dark-neutral-50 font-[400]'>@{user ? user.username : ''}</h4>
                            </div>
                        </a>                        
                        <button className='shadow-xs px-3 py-[6px] rounded-[4px] border-[1px] border-light-neutral-600 text-xs flex gap-[6px]'>
                            <span className='font-[500]'>
                                Follow
                            </span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <path d="M8.00008 2.66675V13.3334M13.3334 8.00008L2.66675 8.00008" stroke="#323539" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                        </button>
                    </div>
                    <div className='p-6 mt-12 flex flex-col justify-center border-[1px] border-light-neutral-600 shadow-xs rounded-[5px]'>
                        <div className='flex'>
                            <div className='pr-6 border-r-[1px] border-light-neutral-600 flex items-center gap-1'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                                  <path d="M16 25.3334L16 8.00004M8 14.6667L15.0572 7.60952C15.5779 7.08882 16.4221 7.08882 16.9428 7.60952L24 14.6667" stroke="#2EBF43" strokeWidth="3" strokeLinecap="round"/>
                                </svg>
                                <div className='flex gap-2 items-end text-primary-purple-600 font-[600]'>
                                    <h2 className='text-headline-xs'>
                                        ${raisedAmount}
                                    </h2>
                                    <span className='text-headline-xs'>
                                        raised
                                    </span>
                                </div>                                
                            </div>
                            <a className='pl-6 flex items-center gap-2'>
                                <span className='text-neutral-700 text-button-text-sm font-[500]'>
                                    4.3
                                </span>
                                <img src='/images/icons/4 star.svg' className='w-[90px]'/>
                                <span className='text-xs text-dark-neutral-50 font-[400]'>
                                    (2 reviews)
                                </span>                                
                            </a>
                        </div>
                        <div className='rounded-[5px] bg-light-neutral-50 py-[18px] pl-[50px] flex gap-[100px] mt-6'>
                            <div className='flex items-center'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                  <g clipPath="url(#clip0_825_27091)">
                                    <path d="M3.73005 22.455L4.18404 21.564L3.73005 22.455ZM1.54497 20.27L2.43597 19.816L1.54497 20.27ZM18.455 20.27L17.564 19.816L18.455 20.27ZM16.27 22.455L15.816 21.564L16.27 22.455ZM16.27 5.54497L15.816 6.43597L16.27 5.54497ZM18.455 7.73005L17.564 8.18404L18.455 7.73005ZM3.73005 5.54497L4.18404 6.43597L3.73005 5.54497ZM1.54497 7.73005L2.43597 8.18404L1.54497 7.73005ZM19 18C18.4477 18 18 18.4477 18 19C18 19.5523 18.4477 20 19 20V18ZM4 5C4 5.55228 4.44772 6 5 6C5.55228 6 6 5.55228 6 5H4ZM5.3085 16.2776C4.90954 16.6595 4.89572 17.2925 5.27762 17.6915C5.65953 18.0905 6.29254 18.1043 6.6915 17.7224L5.3085 16.2776ZM13.3085 17.7224C13.7075 18.1043 14.3405 18.0905 14.7224 17.6915C15.1043 17.2925 15.0905 16.6595 14.6915 16.2776L13.3085 17.7224ZM9 6H11V4H9V6ZM18 13V15H20V13H18ZM11 22H9V24H11V22ZM2 15V13H0V15H2ZM9 22C7.58337 22 6.58104 21.9992 5.79744 21.9352C5.02552 21.8721 4.55435 21.7527 4.18404 21.564L3.27606 23.346C3.9753 23.7023 4.73898 23.8554 5.63458 23.9286C6.51851 24.0008 7.61637 24 9 24V22ZM0 15C0 16.3836 -0.000777721 17.4815 0.071442 18.3654C0.144616 19.261 0.297677 20.0247 0.653961 20.7239L2.43597 19.816C2.24729 19.4457 2.12787 18.9745 2.0648 18.2026C2.00078 17.419 2 16.4166 2 15H0ZM4.18404 21.564C3.43139 21.1805 2.81947 20.5686 2.43597 19.816L0.653961 20.7239C1.2292 21.8529 2.14708 22.7708 3.27606 23.346L4.18404 21.564ZM18 15C18 16.4166 17.9992 17.419 17.9352 18.2026C17.8721 18.9745 17.7527 19.4457 17.564 19.816L19.346 20.7239C19.7023 20.0247 19.8554 19.261 19.9286 18.3654C20.0008 17.4815 20 16.3836 20 15H18ZM11 24C12.3836 24 13.4815 24.0008 14.3654 23.9286C15.261 23.8554 16.0247 23.7023 16.7239 23.346L15.816 21.564C15.4457 21.7527 14.9745 21.8721 14.2026 21.9352C13.419 21.9992 12.4166 22 11 22V24ZM17.564 19.816C17.1805 20.5686 16.5686 21.1805 15.816 21.564L16.7239 23.346C17.8529 22.7708 18.7708 21.8529 19.346 20.7239L17.564 19.816ZM11 6C12.4166 6 13.419 6.00078 14.2026 6.0648C14.9745 6.12787 15.4457 6.24729 15.816 6.43597L16.7239 4.65396C16.0247 4.29768 15.261 4.14462 14.3654 4.07144C13.4815 3.99922 12.3836 4 11 4V6ZM20 13C20 11.6164 20.0008 10.5185 19.9286 9.63458C19.8554 8.73898 19.7023 7.9753 19.346 7.27606L17.564 8.18404C17.7527 8.55435 17.8721 9.02552 17.9352 9.79744C17.9992 10.581 18 11.5834 18 13H20ZM15.816 6.43597C16.5686 6.81947 17.1805 7.43139 17.564 8.18404L19.346 7.27606C18.7708 6.14708 17.8529 5.2292 16.7239 4.65396L15.816 6.43597ZM9 4C7.61637 4 6.51851 3.99922 5.63458 4.07144C4.73898 4.14462 3.9753 4.29768 3.27606 4.65396L4.18404 6.43597C4.55435 6.24729 5.02552 6.12787 5.79744 6.0648C6.58104 6.00078 7.58337 6 9 6V4ZM2 13C2 11.5834 2.00078 10.581 2.0648 9.79744C2.12787 9.02552 2.24729 8.55435 2.43597 8.18404L0.653961 7.27606C0.297677 7.9753 0.144616 8.73898 0.071442 9.63458C-0.000777721 10.5185 0 11.6164 0 13H2ZM3.27606 4.65396C2.14708 5.2292 1.2292 6.14708 0.653961 7.27606L2.43597 8.18404C2.81947 7.43139 3.43139 6.81947 4.18404 6.43597L3.27606 4.65396ZM9 2H18V0H9V2ZM22 6V15H24V6H22ZM22 15C22 16.6569 20.6569 18 19 18V20C21.7614 20 24 17.7614 24 15H22ZM18 2C20.2091 2 22 3.79086 22 6H24C24 2.68629 21.3137 0 18 0V2ZM9 0C6.23858 0 4 2.23858 4 5H6C6 3.34315 7.34315 2 9 2V0ZM6.6915 17.7224C8.51395 15.9778 11.4861 15.9778 13.3085 17.7224L14.6915 16.2776C12.0957 13.7928 7.90433 13.7928 5.3085 16.2776L6.6915 17.7224ZM11.683 12.5369C11.683 13.345 10.9858 14.0738 10.0328 14.0738V16.0738C12.0071 16.0738 13.683 14.531 13.683 12.5369H11.683ZM10.0328 14.0738C9.07983 14.0738 8.38264 13.345 8.38264 12.5369H6.38264C6.38264 14.531 8.0585 16.0738 10.0328 16.0738V14.0738ZM8.38264 12.5369C8.38264 11.7288 9.07983 11 10.0328 11V9C8.0585 9 6.38264 10.5428 6.38264 12.5369H8.38264ZM10.0328 11C10.9858 11 11.683 11.7288 11.683 12.5369H13.683C13.683 10.5428 12.0071 9 10.0328 9V11Z" fill="#323539"/>
                                  </g>
                                  <defs>
                                    <clipPath id="clip0_825_27091">
                                      <rect width="24" height="24" fill="white"/>
                                    </clipPath>
                                  </defs>
                                </svg>
                                <span className='ml-4 text-md text-black font-[500]'>{backersData.length}</span>
                                <span className='ml-2 text-md text-dark-neutral-200 font-[400]'>backers</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none" className='ml-[5px]'>
                                  <path d="M7 9.5V6.5M7 5V4.995M12.5 7C12.5 10.0376 10.0376 12.5 7 12.5C3.96243 12.5 1.5 10.0376 1.5 7C1.5 3.96243 3.96243 1.5 7 1.5C10.0376 1.5 12.5 3.96243 12.5 7Z" stroke="#525D6A" strokeWidth="1.5" strokeLinecap="round"/>
                                </svg>                                
                            </div>
                            <div className='flex items-center'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                  <path d="M10 8.4V4.6C10 4.03995 10 3.75992 9.89101 3.54601C9.79513 3.35785 9.64215 3.20487 9.45399 3.10899C9.24008 3 8.96005 3 8.4 3H7.66274C7.41815 3 7.29586 3 7.18077 3.02763C7.07873 3.05213 6.98119 3.09253 6.89172 3.14736C6.7908 3.2092 6.70432 3.29568 6.53137 3.46863L4.46863 5.53137C4.29568 5.70432 4.2092 5.7908 4.14736 5.89172C4.09253 5.98119 4.05213 6.07873 4.02763 6.18077C4 6.29586 4 6.41815 4 6.66274V8.4C4 8.96005 4 9.24008 4.10899 9.45399C4.20487 9.64215 4.35785 9.79513 4.54601 9.89101C4.75992 10 5.03995 10 5.6 10H8.4C8.96005 10 9.24008 10 9.45399 9.89101C9.64215 9.79513 9.79513 9.64215 9.89101 9.45399C10 9.24008 10 8.96005 10 8.4Z" stroke="#323539" strokeWidth="2"/>
                                  <path d="M10 19.4V15.6C10 15.0399 10 14.7599 9.89101 14.546C9.79513 14.3578 9.64215 14.2049 9.45399 14.109C9.24008 14 8.96005 14 8.4 14H7.66274C7.41815 14 7.29586 14 7.18077 14.0276C7.07873 14.0521 6.98119 14.0925 6.89172 14.1474C6.7908 14.2092 6.70432 14.2957 6.53137 14.4686L4.46863 16.5314C4.29568 16.7043 4.2092 16.7908 4.14736 16.8917C4.09253 16.9812 4.05213 17.0787 4.02763 17.1808C4 17.2959 4 17.4182 4 17.6627V19.4C4 19.9601 4 20.2401 4.10899 20.454C4.20487 20.6422 4.35785 20.7951 4.54601 20.891C4.75992 21 5.03995 21 5.6 21H8.4C8.96005 21 9.24008 21 9.45399 20.891C9.64215 20.7951 9.79513 20.6422 9.89101 20.454C10 20.2401 10 19.9601 10 19.4Z" stroke="#323539" strokeWidth="2"/>
                                  <path d="M20 8.4V4.6C20 4.03995 20 3.75992 19.891 3.54601C19.7951 3.35785 19.6422 3.20487 19.454 3.10899C19.2401 3 18.9601 3 18.4 3H17.6627C17.4182 3 17.2959 3 17.1808 3.02763C17.0787 3.05213 16.9812 3.09253 16.8917 3.14736C16.7908 3.2092 16.7043 3.29568 16.5314 3.46863L14.4686 5.53137C14.2957 5.70432 14.2092 5.7908 14.1474 5.89172C14.0925 5.98119 14.0521 6.07873 14.0276 6.18077C14 6.29586 14 6.41815 14 6.66274V8.4C14 8.96005 14 9.24008 14.109 9.45399C14.2049 9.64215 14.3578 9.79513 14.546 9.89101C14.7599 10 15.0399 10 15.6 10H18.4C18.9601 10 19.2401 10 19.454 9.89101C19.6422 9.79513 19.7951 9.64215 19.891 9.45399C20 9.24008 20 8.96005 20 8.4Z" stroke="#323539" strokeWidth="2"/>
                                  <path d="M20 19.4V15.6C20 15.0399 20 14.7599 19.891 14.546C19.7951 14.3578 19.6422 14.2049 19.454 14.109C19.2401 14 18.9601 14 18.4 14H17.6627C17.4182 14 17.2959 14 17.1808 14.0276C17.0787 14.0521 16.9812 14.0925 16.8917 14.1474C16.7908 14.2092 16.7043 14.2957 16.5314 14.4686L14.4686 16.5314C14.2957 16.7043 14.2092 16.7908 14.1474 16.8917C14.0925 16.9812 14.0521 17.0787 14.0276 17.1808C14 17.2959 14 17.4182 14 17.6627V19.4C14 19.9601 14 20.2401 14.109 20.454C14.2049 20.6422 14.3578 20.7951 14.546 20.891C14.7599 21 15.0399 21 15.6 21H18.4C18.9601 21 19.2401 21 19.454 20.891C19.6422 20.7951 19.7951 20.6422 19.891 20.454C20 20.2401 20 19.9601 20 19.4Z" stroke="#323539" strokeWidth="2"/>
                                </svg>
                                <span className='ml-4 text-md text-black font-[500]'>{tiersData ? tiersData.length : ''}</span>
                                <span className='ml-2 text-md text-dark-neutral-200 font-[400]'>Tiers</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none" className='ml-[5px]'>
                                  <path d="M7 9.5V6.5M7 5V4.995M12.5 7C12.5 10.0376 10.0376 12.5 7 12.5C3.96243 12.5 1.5 10.0376 1.5 7C1.5 3.96243 3.96243 1.5 7 1.5C10.0376 1.5 12.5 3.96243 12.5 7Z" stroke="#525D6A" strokeWidth="1.5" strokeLinecap="round"/>
                                </svg>                                
                            </div>
                        </div>
                        <div className='mt-4 flex gap-3'>
                            <button onClick={()=>statusOfCampaign !=='Draft' ? router.push(`${props.tiersLink}/${props.campaignId}/tiers`):''} className='w-[57%] bg-primary-purple-500 rounded-[8px] px-[18px] py-3 text-button-text-sm text-white font-[500] text-center'>
                                Back this campaign
                            </button>
                            <button className='w-[43%] flex gap-[6px] justify-center border-[1px] px-[18px] py-3 text-button-text-sm shadow-xs border-light-neutral-600 rounded-[8px] text-dark-neutral-700 font-[500]'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                  <path fillRule="evenodd" clip-rule="evenodd" d="M9.99486 4.93005C8.49535 3.18253 5.99481 2.71245 4.11602 4.31265C2.23723 5.91285 1.97273 8.58831 3.44815 10.4809C4.67486 12.0544 8.38733 15.3731 9.60407 16.4473C9.7402 16.5674 9.80827 16.6275 9.88766 16.6511C9.95695 16.6717 10.0328 16.6717 10.1021 16.6511C10.1815 16.6275 10.2495 16.5674 10.3857 16.4473C11.6024 15.3731 15.3149 12.0544 16.5416 10.4809C18.017 8.58831 17.7848 5.89602 15.8737 4.31265C13.9626 2.72929 11.4944 3.18253 9.99486 4.93005Z" stroke="#323539" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <span>
                                    Add to favourites
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>            
            <div className='mt-12 mx-page-mx-lg flex justify-between gap-12 pb-12'>
                <div className='w-[55%] flex flex-col -mt-[15px]'>
                    <div className='sticky top-[60px] py-[15px] flex gap-3 font-[500] bg-white z-10'>
                        <button onClick={()=>setCampaignSection('Story')} className={`rounded-[6px] px-4 py-[11px] flex items-center gap-3 text-xl ${campaignSection === 'Story' ? 'bg-primary-purple-50 text-primary-purple-500' : 'group text-dark-neutral-100 hover:text-dark-neutral-700 hover:bg-light-neutral-300'}`}>
                            <h4>
                                Story
                            </h4>
                            {/* <div className='w-6 h-6 px-[6px] py-1 leading-[12px] text-sm flex justify-center items-center group-hover:bg-light-neutral-700 bg-light-neutral-300 rounded-full'>
                                1
                            </div> */}
                        </button>
                        <button onClick={()=>setCampaignSection('Milestones')} className={`rounded-[6px] px-4 py-[11px] flex items-center gap-3 text-xl ${campaignSection === 'Milestones' ? 'bg-primary-purple-50 text-primary-purple-500' : 'group text-dark-neutral-100 hover:text-dark-neutral-700 hover:bg-light-neutral-300'}`}>
                            <h4>
                                Milestones
                            </h4>
                            {/* <div className='w-6 h-6 px-[6px] py-1 leading-[12px] text-xs flex justify-center items-center bg-light-neutral-300 rounded-full'>
                                1
                            </div> */}
                        </button>
                        <button onClick={()=>setCampaignSection('FAQs')} className={`rounded-[6px] px-4 py-[11px] flex items-center gap-3 text-xl ${campaignSection === 'FAQs' ? 'bg-primary-purple-50 text-primary-purple-500' : 'group text-dark-neutral-100 hover:text-dark-neutral-700 hover:bg-light-neutral-300'}`}>
                            <h4>
                                FAQs
                            </h4>
                            {/* <div className='w-6 h-6 px-[6px] py-1 leading-[12px] text-xs flex justify-center items-center bg-light-neutral-300 rounded-full'>
                                1
                            </div> */}
                        </button>
                        <button onClick={()=>{statusOfCampaign !== 'Draft'?setCampaignSection('Updates'):''}} className={`rounded-[6px] px-4 py-[11px] flex items-center gap-3 text-xl ${campaignSection === 'Updates' ? 'bg-primary-purple-50 text-primary-purple-500' : 'group text-dark-neutral-100 hover:text-dark-neutral-700 hover:bg-light-neutral-300'} ${statusOfCampaign === 'Draft' ?"cursor-not-allowed" : ""}`}>
                            <h4>
                                Updates
                            </h4>
                            {/* <div className='w-6 h-6 px-[6px] py-1 leading-[12px] text-sm flex justify-center items-center group-hover:bg-light-neutral-700 bg-light-neutral-300 rounded-full'>
                                1
                            </div> */}
                        </button>
                        <button onClick={()=>setCampaignSection('Comments')} className={`rounded-[6px] px-4 py-[11px] flex items-center gap-3 text-xl ${campaignSection === 'Comments' ? 'bg-primary-purple-50 text-primary-purple-500' : 'group text-dark-neutral-100 hover:text-dark-neutral-700 hover:bg-light-neutral-300'}`}>
                            <h4>
                                Comments
                            </h4>
                            {/* <div className='w-6 h-6 px-[6px] py-1 leading-[12px] text-xs flex justify-center items-center bg-light-neutral-300 rounded-full'>
                                1
                            </div> */}
                        </button>
                        <button onClick={()=>setCampaignSection('Reviews')} className={`rounded-[6px] px-4 py-[11px] flex items-center gap-3 text-xl ${campaignSection === 'Reviews' ? 'bg-primary-purple-50 text-primary-purple-500' : 'group text-dark-neutral-100 hover:text-dark-neutral-700 hover:bg-light-neutral-300'}`}>
                            <h4>
                                Reviews
                            </h4>
                            {/* <div className='w-6 h-6 px-[6px] py-1 leading-[12px] text-xs flex justify-center items-center bg-light-neutral-300 rounded-full'>
                                1
                            </div> */}
                        </button>
                    </div>
                    <div className='w-full mt-8 pl-[1px] pr-6'>                                                         
                        {
                            campaignSection === 'Story'
                            ? <Story campaignId={props.campaignId} />
                            : campaignSection === 'Milestones'
                            ? <Milestones raisedAmount={raisedAmount} campaignId={props.campaignId} />
                            : campaignSection === 'FAQs'
                            ? <Faqs campaignId={props.campaignId} />
                            : campaignSection === 'Updates'
                            ? <Updates username={user ? user.username : ''} campaignId={props.campaignId} />
                            : campaignSection === 'Comments'
                            ? <Comments campaignId={props.campaignId} />
                            : campaignSection === 'Reviews'
                            ? <Reviews campaignId={props.campaignId} />
                            : ''
                        }   
                    </div>                    
                </div>
                <div className='w-[45%]'>                    
                    <div className='sticky top-[75px]'>
                        <div className='shadow-xs flex flex-col rounded-[6px]  h-[calc(100vh-75px)]'>
                            <div className='flex p-4 border-[1px] border-light-neutral-600 bg-white z-10' style={{borderRadius:"6px 6px 0px 0px"}}>
                                <div className='flex items-center grow'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                                      <path d="M10 8.4V4.6C10 4.03995 10 3.75992 9.89101 3.54601C9.79513 3.35785 9.64215 3.20487 9.45399 3.10899C9.24008 3 8.96005 3 8.4 3H7.66274C7.41815 3 7.29586 3 7.18077 3.02763C7.07873 3.05213 6.98119 3.09253 6.89172 3.14736C6.7908 3.2092 6.70432 3.29568 6.53137 3.46863L4.46863 5.53137C4.29568 5.70432 4.2092 5.7908 4.14736 5.89172C4.09253 5.98119 4.05213 6.07873 4.02763 6.18077C4 6.29586 4 6.41815 4 6.66274V8.4C4 8.96005 4 9.24008 4.10899 9.45399C4.20487 9.64215 4.35785 9.79513 4.54601 9.89101C4.75992 10 5.03995 10 5.6 10H8.4C8.96005 10 9.24008 10 9.45399 9.89101C9.64215 9.79513 9.79513 9.64215 9.89101 9.45399C10 9.24008 10 8.96005 10 8.4Z" stroke="#323539" strokeWidth="2"/>
                                      <path d="M10 19.4V15.6C10 15.0399 10 14.7599 9.89101 14.546C9.79513 14.3578 9.64215 14.2049 9.45399 14.109C9.24008 14 8.96005 14 8.4 14H7.66274C7.41815 14 7.29586 14 7.18077 14.0276C7.07873 14.0521 6.98119 14.0925 6.89172 14.1474C6.7908 14.2092 6.70432 14.2957 6.53137 14.4686L4.46863 16.5314C4.29568 16.7043 4.2092 16.7908 4.14736 16.8917C4.09253 16.9812 4.05213 17.0787 4.02763 17.1808C4 17.2959 4 17.4182 4 17.6627V19.4C4 19.9601 4 20.2401 4.10899 20.454C4.20487 20.6422 4.35785 20.7951 4.54601 20.891C4.75992 21 5.03995 21 5.6 21H8.4C8.96005 21 9.24008 21 9.45399 20.891C9.64215 20.7951 9.79513 20.6422 9.89101 20.454C10 20.2401 10 19.9601 10 19.4Z" stroke="#323539" strokeWidth="2"/>
                                      <path d="M20 8.4V4.6C20 4.03995 20 3.75992 19.891 3.54601C19.7951 3.35785 19.6422 3.20487 19.454 3.10899C19.2401 3 18.9601 3 18.4 3H17.6627C17.4182 3 17.2959 3 17.1808 3.02763C17.0787 3.05213 16.9812 3.09253 16.8917 3.14736C16.7908 3.2092 16.7043 3.29568 16.5314 3.46863L14.4686 5.53137C14.2957 5.70432 14.2092 5.7908 14.1474 5.89172C14.0925 5.98119 14.0521 6.07873 14.0276 6.18077C14 6.29586 14 6.41815 14 6.66274V8.4C14 8.96005 14 9.24008 14.109 9.45399C14.2049 9.64215 14.3578 9.79513 14.546 9.89101C14.7599 10 15.0399 10 15.6 10H18.4C18.9601 10 19.2401 10 19.454 9.89101C19.6422 9.79513 19.7951 9.64215 19.891 9.45399C20 9.24008 20 8.96005 20 8.4Z" stroke="#323539" strokeWidth="2"/>
                                      <path d="M20 19.4V15.6C20 15.0399 20 14.7599 19.891 14.546C19.7951 14.3578 19.6422 14.2049 19.454 14.109C19.2401 14 18.9601 14 18.4 14H17.6627C17.4182 14 17.2959 14 17.1808 14.0276C17.0787 14.0521 16.9812 14.0925 16.8917 14.1474C16.7908 14.2092 16.7043 14.2957 16.5314 14.4686L14.4686 16.5314C14.2957 16.7043 14.2092 16.7908 14.1474 16.8917C14.0925 16.9812 14.0521 17.0787 14.0276 17.1808C14 17.2959 14 17.4182 14 17.6627V19.4C14 19.9601 14 20.2401 14.109 20.454C14.2049 20.6422 14.3578 20.7951 14.546 20.891C14.7599 21 15.0399 21 15.6 21H18.4C18.9601 21 19.2401 21 19.454 20.891C19.6422 20.7951 19.7951 20.6422 19.891 20.454C20 20.2401 20 19.9601 20 19.4Z" stroke="#323539" strokeWidth="2"/>
                                    </svg>
                                    <span className='ml-3 text-lg text-dark-neutral-700 font-[500]'>{tiersData ? tiersData.length : ''}</span>
                                    <span className='ml-2 text-lg text-dark-neutral-700 font-[500]'>Tiers</span>                            
                                </div>                        
                                <button className='w-fit ml-3 py-[6px] px-3 text-sm text-dark-neutral-700 font-[500] flex items-center gap-[6px] border-[1px] border-light-neutral-600 rounded-[4px] shadow-xs'>
                                    <span className='text-md'>Sort</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                      <path d="M3.33333 11.3333L3.33333 4.66663M4.66667 5.33329L3.56904 4.23566C3.43886 4.10549 3.22781 4.10549 3.09763 4.23566L2 5.33329M8 2.66663H14M8 7.99996H12M8 13.3333H9.33333M8 5.33329H13.3333M8 10.6666H10.6667" stroke="#323539" strokeWidth="1.5" strokeLinecap="round"/>
                                    </svg>
                                </button>
                                <button onClick={()=>router.push(`${props.tiersLink}/${props.campaignId}/tiers`)} className='w-fit ml-4 text-xs text-primary-purple-500 font-[500]'>
                                    view all
                                </button>
                            </div>
                            <div className='border-b-[1px] border-r-[1px] border-l-[1px] border-light-neutral-600 bg-light-neutral-50 flex flex-col justify-between gap-4 grow overflow-y-scroll p-4 no-scrollbar' style={{borderRadius:"0px 0px 6px 6px"}}>
                                {tiersData ? tiersData.map((item, index)=>(
                                    <div className='w-full h-fit flex bg-white rounded-[6px] shadow-xs'>
                                        <div className='w-[43%] relative overflow-hidden z-0' style={{borderRadius:"6px 0px 0px 6px"}}>
                                            {/* <div className='absolute z-30 -left-20 top-4 h-fit w-full bg-secondary-orange-600 -rotate-45 text-white text-center font-[600]'>
                                              <p className="mr-12 my-1">
                                                Early Bird
                                              </p>
                                            </div> */}
                                            <span className={`${item.isEarlyBird ? '' : 'hidden'} absolute left-0 top-0 text-white font-[600] z-10 w-[40%] ml-[2%] mt-[6%] -rotate-45 origin-center`}>
                                                Early bird
                                            </span>
                                            <div className={`${item.isEarlyBird ? '' : 'hidden'}  absolute left-0 top-0 w-[40%] aspect-square bg-secondary-orange-600`} style={{clipPath:'polygon(60% 0%, 100% 0%, 0% 100%, 0% 60%)'}}></div>
                                            <img src={item.tierDp} className='w-full h-full object-cover object-right' />
                                        </div>
                                        <div className='w-[57%] p-6 flex flex-col border-t-[1px] border-b-[1px] border-r-[1px] border-light-neutral-700' style={{borderRadius:"0px 6px 6px 0px"}}>
                                            <h3 className='text-headline-2xs text-dark-neutral-700 font-[600]'>
                                                $ {item.tierAmount}
                                            </h3>
                                            <h2 className='text-lg text-dark-neutral-700 font-[600] mt-4 truncate'>
                                                {item.tierTitle}
                                            </h2>
                                            <h3 className='text-xs text-dark-neutral-200 font-[400] mt-2 line-clamp-2'>
                                                {item.tierDescription}
                                            </h3>
                                            <div className='rounded-[5px] bg-light-neutral-100 px-6 py-3 flex items-center mt-4'>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                                  <g clipPath="url(#clip0_1238_51)">
                                                    <path d="M2.67578 13.0988L3.01627 12.4306L2.67578 13.0988ZM1.40115 11.8242L2.0694 11.4837L1.40115 11.8242ZM11.2654 11.8242L10.5971 11.4837L11.2654 11.8242ZM9.99072 13.0988L9.65023 12.4306L9.99072 13.0988ZM9.99072 3.23461L9.65023 3.90286L9.99072 3.23461ZM11.2654 4.50924L10.5971 4.84973L11.2654 4.50924ZM2.67578 3.23461L3.01627 3.90286L2.67578 3.23461ZM1.40115 4.50924L2.0694 4.84973L1.40115 4.50924ZM11.5833 10.3334C11.169 10.3334 10.8333 10.6692 10.8333 11.0834C10.8333 11.4976 11.169 11.8334 11.5833 11.8334V10.3334ZM2.66659 2.91671C2.66659 3.33092 3.00237 3.66671 3.41659 3.66671C3.8308 3.66671 4.16659 3.33092 4.16659 2.91671H2.66659ZM3.48129 9.37492C3.18208 9.66135 3.17171 10.1361 3.45814 10.4353C3.74456 10.7346 4.21932 10.7449 4.51854 10.4585L3.48129 9.37492ZM8.14796 10.4585C8.44718 10.7449 8.92194 10.7346 9.20837 10.4353C9.4948 10.1361 9.48443 9.66135 9.18521 9.37492L8.14796 10.4585ZM5.74992 3.66671H6.91659V2.16671H5.74992V3.66671ZM10.8333 7.58337V8.75004H12.3333V7.58337H10.8333ZM6.91659 12.6667H5.74992V14.1667H6.91659V12.6667ZM1.83325 8.75004V7.58337H0.333252V8.75004H1.83325ZM5.74992 12.6667C4.9208 12.6667 4.34407 12.6661 3.89533 12.6295C3.45535 12.5935 3.20488 12.5267 3.01627 12.4306L2.33529 13.7671C2.77059 13.9889 3.24044 14.081 3.77318 14.1245C4.29717 14.1673 4.94555 14.1667 5.74992 14.1667V12.6667ZM0.333252 8.75004C0.333252 9.55441 0.332669 10.2028 0.37548 10.7268C0.419007 11.2595 0.511095 11.7294 0.732895 12.1647L2.0694 11.4837C1.97331 11.2951 1.90645 11.0446 1.8705 10.6046C1.83384 10.1559 1.83325 9.57916 1.83325 8.75004H0.333252ZM3.01627 12.4306C2.60859 12.2228 2.27713 11.8914 2.0694 11.4837L0.732895 12.1647C1.08443 12.8546 1.64536 13.4155 2.33529 13.7671L3.01627 12.4306ZM10.8333 8.75004C10.8333 9.57916 10.8327 10.1559 10.796 10.6046C10.7601 11.0446 10.6932 11.2951 10.5971 11.4837L11.9336 12.1647C12.1554 11.7294 12.2475 11.2595 12.291 10.7268C12.3338 10.2028 12.3333 9.55441 12.3333 8.75004H10.8333ZM6.91659 14.1667C7.72095 14.1667 8.36934 14.1673 8.89332 14.1245C9.42606 14.081 9.89591 13.9889 10.3312 13.7671L9.65023 12.4306C9.46163 12.5267 9.21115 12.5935 8.77117 12.6295C8.32244 12.6661 7.7457 12.6667 6.91659 12.6667V14.1667ZM10.5971 11.4837C10.3894 11.8914 10.0579 12.2228 9.65023 12.4306L10.3312 13.7671C11.0211 13.4155 11.5821 12.8546 11.9336 12.1647L10.5971 11.4837ZM6.91659 3.66671C7.7457 3.66671 8.32244 3.66729 8.77117 3.70395C9.21115 3.7399 9.46163 3.80676 9.65023 3.90286L10.3312 2.56635C9.89591 2.34455 9.42606 2.25246 8.89332 2.20894C8.36934 2.16612 7.72095 2.16671 6.91659 2.16671V3.66671ZM12.3333 7.58337C12.3333 6.77901 12.3338 6.13062 12.291 5.60664C12.2475 5.0739 12.1554 4.60405 11.9336 4.16874L10.5971 4.84973C10.6932 5.03833 10.7601 5.28881 10.796 5.72879C10.8327 6.17752 10.8333 6.75426 10.8333 7.58337H12.3333ZM9.65023 3.90286C10.0579 4.11059 10.3894 4.44204 10.5971 4.84973L11.9336 4.16874C11.5821 3.47881 11.0211 2.91789 10.3312 2.56635L9.65023 3.90286ZM5.74992 2.16671C4.94555 2.16671 4.29717 2.16612 3.77318 2.20894C3.24044 2.25246 2.77059 2.34455 2.33529 2.56635L3.01627 3.90286C3.20488 3.80676 3.45535 3.7399 3.89533 3.70395C4.34407 3.66729 4.9208 3.66671 5.74992 3.66671V2.16671ZM1.83325 7.58337C1.83325 6.75426 1.83384 6.17752 1.8705 5.72879C1.90645 5.28881 1.97331 5.03833 2.0694 4.84973L0.732895 4.16874C0.511095 4.60405 0.419007 5.0739 0.37548 5.60664C0.332669 6.13063 0.333252 6.77901 0.333252 7.58337H1.83325ZM2.33529 2.56635C1.64536 2.91789 1.08443 3.47881 0.732895 4.16874L2.0694 4.84973C2.27713 4.44204 2.60859 4.11059 3.01627 3.90286L2.33529 2.56635ZM5.74992 1.33337H10.9999V-0.166626H5.74992V1.33337ZM13.1666 3.50004V8.75004H14.6666V3.50004H13.1666ZM13.1666 8.75004C13.1666 9.62449 12.4577 10.3334 11.5833 10.3334V11.8334C13.2861 11.8334 14.6666 10.4529 14.6666 8.75004H13.1666ZM10.9999 1.33337C12.1965 1.33337 13.1666 2.30342 13.1666 3.50004H14.6666C14.6666 1.475 13.025 -0.166626 10.9999 -0.166626V1.33337ZM5.74992 -0.166626C4.04704 -0.166626 2.66659 1.21383 2.66659 2.91671H4.16659C4.16659 2.04226 4.87547 1.33337 5.74992 1.33337V-0.166626ZM4.51854 10.4585C5.51719 9.50253 7.14932 9.50253 8.14796 10.4585L9.18521 9.37492C7.60653 7.86372 5.05998 7.86372 3.48129 9.37492L4.51854 10.4585ZM7.14833 7.31323C7.14833 7.68577 6.82319 8.04308 6.3524 8.04308V9.54308C7.58919 9.54308 8.64833 8.57528 8.64833 7.31323H7.14833ZM6.3524 8.04308C5.8816 8.04308 5.55646 7.68577 5.55646 7.31323H4.05646C4.05646 8.57528 5.1156 9.54308 6.3524 9.54308V8.04308ZM5.55646 7.31323C5.55646 6.94068 5.8816 6.58337 6.3524 6.58337V5.08337C5.1156 5.08337 4.05646 6.05117 4.05646 7.31323H5.55646ZM6.3524 6.58337C6.82319 6.58337 7.14833 6.94068 7.14833 7.31323H8.64833C8.64833 6.05117 7.58919 5.08337 6.3524 5.08337V6.58337Z" fill="#282828"/>
                                                  </g>
                                                  <defs>
                                                    <clipPath id="clip0_1238_51">
                                                      <rect width="14" height="14" fill="white" transform="translate(0.5)"/>
                                                    </clipPath>
                                                  </defs>
                                                </svg>
                                                <span className='ml-2 text-xs font-[500] text-dark-neutral-700'>
                                                    200
                                                </span>
                                                <span className='ml-[5px] text-dark-neutral-200 font-[400] text-xs'>
                                                    Backers
                                                </span>
                                                <div className={`${item.isEarlyBird ? '' : 'hidden'} ml-auto flex items-center`}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                                      <path d="M2.25 5.83333H12.75M5.75 2.91667H4.11667C3.46327 2.91667 3.13657 2.91667 2.88701 3.04383C2.66749 3.15568 2.48901 3.33416 2.37716 3.55368C2.25 3.80324 2.25 4.12994 2.25 4.78333V10.3833C2.25 11.0367 2.25 11.3634 2.37716 11.613C2.48901 11.8325 2.66749 12.011 2.88701 12.1228C3.13657 12.25 3.46327 12.25 4.11667 12.25H10.8833C11.5367 12.25 11.8634 12.25 12.113 12.1228C12.3325 12.011 12.511 11.8325 12.6228 11.613C12.75 11.3634 12.75 11.0367 12.75 10.3833V4.78333C12.75 4.12994 12.75 3.80324 12.6228 3.55368C12.511 3.33416 12.3325 3.15568 12.113 3.04383C11.8634 2.91667 11.5367 2.91667 10.8833 2.91667H9.25M5.75 2.91667H9.25M5.75 2.91667V2.625C5.75 2.14175 5.35825 1.75 4.875 1.75C4.39175 1.75 4 2.14175 4 2.625V2.91667M9.25 2.91667V2.625C9.25 2.14175 9.64175 1.75 10.125 1.75C10.6082 1.75 11 2.14175 11 2.625V2.91667" stroke="#282828" strokeWidth="1.5" strokeLinecap="round"/>
                                                    </svg>
                                                    <span className='ml-[5px] text-dark-neutral-200 font-[400] text-xs'>Ends on {
                                                        new Intl.DateTimeFormat('en', {
                                                            month: 'short',
                                                            day: 'numeric'
                                                          }).format(new Date(item.endingDate))
                                                    }</span>                                                    
                                                </div>
                                            </div>
                                            <div className='flex gap-6 items-center mt-4'>
                                                <button className='flex gap-[6px]' onClick={()=>router.push(`${props.tiersLink}/${props.campaignId}/tiers/${item.tierId}`)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
                                                      <path d="M5.30008 14.6667V13.6667V14.6667ZM11.7001 14.6667V15.6667V14.6667ZM13.8334 3.46671H14.8334H13.8334ZM13.6881 2.06139L14.5791 1.6074V1.6074L13.6881 2.06139ZM11.7001 1.33337V0.333374V1.33337ZM13.1054 1.4787L13.5594 0.587693L13.5594 0.587692L13.1054 1.4787ZM13.1054 14.5214L13.5594 15.4124V15.4124L13.1054 14.5214ZM13.6881 13.9387L12.7971 13.4847L13.6881 13.9387ZM3.89476 14.5214L4.34875 13.6304L3.89476 14.5214ZM3.31207 13.9387L4.20308 13.4847L3.31207 13.9387ZM13.8334 5.33337L14.8334 5.33497V5.33337H13.8334ZM3.17954 13.3334L2.17954 13.335L2.17959 13.3647L2.1814 13.3943L3.17954 13.3334ZM13.8206 13.3334L14.8188 13.3943L14.8206 13.3647L14.8206 13.335L13.8206 13.3334ZM5.30008 15.6667H11.7001V13.6667H5.30008V15.6667ZM14.8334 3.46671C14.8334 3.10984 14.8342 2.78205 14.8119 2.50954C14.7887 2.22537 14.7356 1.91447 14.5791 1.6074L12.7971 2.51538C12.7859 2.49352 12.8055 2.51191 12.8186 2.67241C12.8326 2.84458 12.8334 3.07684 12.8334 3.46671L14.8334 3.46671ZM11.7001 2.33337C12.0899 2.33337 12.3222 2.33415 12.4944 2.34822C12.6549 2.36133 12.6733 2.38084 12.6514 2.3697L13.5594 0.587692C13.2523 0.431229 12.9414 0.378079 12.6572 0.354861C12.3847 0.332596 12.0569 0.333374 11.7001 0.333374L11.7001 2.33337ZM14.5791 1.6074C14.3554 1.16835 13.9984 0.811396 13.5594 0.587693L12.6514 2.3697C12.7141 2.40166 12.7651 2.45266 12.7971 2.51538L14.5791 1.6074ZM11.7001 15.6667C12.0569 15.6667 12.3847 15.6675 12.6572 15.6452C12.9414 15.622 13.2523 15.5689 13.5594 15.4124L12.6514 13.6304C12.6733 13.6192 12.6549 13.6388 12.4944 13.6519C12.3222 13.6659 12.09 13.6667 11.7001 13.6667V15.6667ZM13.5594 15.4124C13.9984 15.1887 14.3554 14.8317 14.5791 14.3927L12.7971 13.4847C12.7651 13.5474 12.7141 13.5984 12.6514 13.6304L13.5594 15.4124ZM5.30008 13.6667C4.91021 13.6667 4.67795 13.6659 4.50578 13.6519C4.34529 13.6388 4.32689 13.6192 4.34875 13.6304L3.44077 15.4124C3.74785 15.5689 4.05874 15.622 4.34292 15.6452C4.61542 15.6675 4.94322 15.6667 5.30008 15.6667L5.30008 13.6667ZM4.34875 13.6304C4.28603 13.5984 4.23504 13.5474 4.20308 13.4847L2.42107 14.3927C2.64477 14.8317 3.00172 15.1887 3.44077 15.4124L4.34875 13.6304ZM11.7001 0.333374L7.99517 0.333374L7.99517 2.33337L11.7001 2.33337L11.7001 0.333374ZM4.46097 5.45337L7.28807 2.62627L5.87385 1.21205L3.04675 4.03916L4.46097 5.45337ZM14.8334 5.33337V3.46671H12.8334V5.33337H14.8334ZM2.1814 13.3943C2.20043 13.706 2.24801 14.0531 2.42107 14.3927L4.20308 13.4847C4.21478 13.5077 4.19058 13.4837 4.17768 13.2724L2.1814 13.3943ZM12.8225 13.2724C12.8096 13.4837 12.7854 13.5077 12.7971 13.4847L14.5791 14.3927C14.7521 14.053 14.7997 13.706 14.8188 13.3943L12.8225 13.2724ZM2.16808 6.16527L2.17954 13.335L4.17954 13.3318L4.16807 6.16208L2.16808 6.16527ZM12.8334 5.33178L12.8206 13.3318L14.8206 13.335L14.8334 5.33497L12.8334 5.33178ZM7.99517 0.333374C7.19952 0.333374 6.43646 0.649444 5.87385 1.21205L7.28807 2.62627C7.47561 2.43873 7.72996 2.33337 7.99517 2.33337L7.99517 0.333374ZM3.04675 4.03916C2.48297 4.60294 2.1668 5.36796 2.16808 6.16527L4.16807 6.16208C4.16765 5.89631 4.27304 5.6413 4.46097 5.45337L3.04675 4.03916Z" fill="#5558DA"/>
                                                    </svg>
                                                    <span className='text-primary-purple-500 text-sm font-[500]'>
                                                        Includes 4 Objects
                                                    </span>
                                                </button>
                                                <button className='py-2 px-3 bg-primary-purple-500 text-sm text-white text-center rounded-[4px] shadow-xs grow'>
                                                    Add to cart
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )):''}
                            </div>                        
                        </div>
                        <div className='font-[500] mt-[22px] flex items-center'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                              <path d="M3.7098 16.3754L3.28247 17.2795L3.28247 17.2795L3.7098 16.3754ZM3.7098 9.45787L4.13712 10.362H4.13712L3.7098 9.45787ZM4.30117 9.34127L4.46263 8.35439L4.30117 9.34127ZM4.85266 9.6906L5.6759 9.12291H5.6759L4.85266 9.6906ZM4.30117 16.492L4.46263 17.4789L4.30117 16.492ZM4.85266 16.1427L4.02942 15.575L4.02942 15.575L4.85266 16.1427ZM16.2901 16.3754L16.7174 17.2795L16.7175 17.2795L16.2901 16.3754ZM16.2901 9.45787L15.8628 10.362L16.2901 9.45787ZM15.6987 9.34127L15.5373 8.35439L15.6987 9.34127ZM15.1473 9.6906L14.324 9.12291L15.1473 9.6906ZM15.6987 16.492L15.5373 17.4789L15.6987 16.492ZM15.1473 16.1427L15.9705 15.575L15.9705 15.575L15.1473 16.1427ZM4.13712 15.4713C3.31833 15.0843 2.66663 14.1228 2.66663 12.9166H0.666626C0.666626 14.8234 1.70071 16.5319 3.28247 17.2795L4.13712 15.4713ZM2.66663 12.9166C2.66663 11.7104 3.31833 10.749 4.13712 10.362L3.28247 8.55377C1.70071 9.3014 0.666626 11.0099 0.666626 12.9166H2.66663ZM5.99996 15.3333V10.5H3.99996V15.3333H5.99996ZM4.13712 10.362C4.16612 10.3483 4.18741 10.3382 4.20672 10.3293C4.22553 10.3207 4.23752 10.3154 4.24554 10.3121C4.26127 10.3055 4.2516 10.3106 4.22753 10.3164C4.21522 10.3194 4.20114 10.3221 4.18597 10.324C4.17084 10.3259 4.15741 10.3267 4.14643 10.3269C4.12485 10.3272 4.1197 10.3249 4.13972 10.3282L4.46263 8.35439C4.23549 8.31723 4.00508 8.31278 3.75904 8.37206C3.55138 8.4221 3.36931 8.51272 3.28247 8.55377L4.13712 10.362ZM5.99996 10.5C5.99996 10.173 6.03085 9.63764 5.6759 9.12291L4.02942 10.2583C4.02353 10.2498 4.01214 10.2307 4.00228 10.2045C3.99288 10.1797 3.99117 10.165 3.99206 10.171C3.99346 10.1806 3.99636 10.2069 3.9981 10.2656C3.99987 10.3256 3.99996 10.3965 3.99996 10.5H5.99996ZM4.13972 10.3282C4.10307 10.3222 4.07776 10.3147 4.06576 10.3109C4.05294 10.3068 4.04625 10.3039 4.0458 10.3037C4.04504 10.3033 4.04738 10.3043 4.05236 10.307C4.05723 10.3096 4.06312 10.313 4.06948 10.317C4.07583 10.3211 4.08143 10.3249 4.08588 10.3282C4.09042 10.3316 4.09233 10.3333 4.0917 10.3327C4.09133 10.3324 4.08582 10.3276 4.07663 10.3178C4.06803 10.3086 4.0505 10.2889 4.02942 10.2583L5.6759 9.12291C5.51627 8.89142 5.29408 8.72528 5.13968 8.62748C4.98529 8.52968 4.74013 8.39979 4.46263 8.35439L4.13972 10.3282ZM3.28247 17.2795C3.36931 17.3206 3.55139 17.4112 3.75904 17.4612C4.00508 17.5205 4.23549 17.5161 4.46263 17.4789L4.13972 15.5051C4.1197 15.5084 4.12486 15.5061 4.14643 15.5064C4.15741 15.5066 4.17084 15.5074 4.18597 15.5093C4.20114 15.5112 4.21522 15.5139 4.22753 15.5169C4.2516 15.5227 4.26127 15.5278 4.24554 15.5212C4.23752 15.5179 4.22553 15.5126 4.20672 15.504C4.1874 15.4951 4.16612 15.485 4.13712 15.4713L3.28247 17.2795ZM3.99996 15.3333C3.99996 15.4368 3.99987 15.5077 3.9981 15.5677C3.99636 15.6264 3.99346 15.6527 3.99206 15.6622C3.99117 15.6683 3.99288 15.6536 4.00228 15.6287C4.01214 15.6026 4.02353 15.5835 4.02942 15.575L5.6759 16.7104C6.03085 16.1957 5.99996 15.6603 5.99996 15.3333H3.99996ZM4.46263 17.4789C4.74013 17.4335 4.98529 17.3036 5.13968 17.2058C5.29408 17.108 5.51627 16.9419 5.6759 16.7104L4.02942 15.575C4.0505 15.5444 4.06803 15.5247 4.07663 15.5155C4.08582 15.5057 4.09133 15.5009 4.0917 15.5006C4.09233 15.5 4.09042 15.5017 4.08588 15.5051C4.08143 15.5084 4.07583 15.5122 4.06948 15.5162C4.06313 15.5203 4.05723 15.5237 4.05236 15.5263C4.04738 15.529 4.04504 15.53 4.0458 15.5296C4.04626 15.5294 4.05294 15.5265 4.06576 15.5224C4.07776 15.5186 4.10307 15.5111 4.13972 15.5051L4.46263 17.4789ZM16.7175 17.2795C18.2992 16.5319 19.3333 14.8234 19.3333 12.9166H17.3333C17.3333 14.1228 16.6816 15.0843 15.8628 15.4713L16.7175 17.2795ZM19.3333 12.9166C19.3333 11.0099 18.2992 9.3014 16.7175 8.55377L15.8628 10.362C16.6816 10.749 17.3333 11.7104 17.3333 12.9166H19.3333ZM16 15.3333V10.5H14V15.3333H16ZM16.7175 8.55377C16.6306 8.51272 16.4485 8.4221 16.2409 8.37206C15.9948 8.31278 15.7644 8.31723 15.5373 8.35439L15.8602 10.3282C15.8802 10.3249 15.8751 10.3272 15.8535 10.3269C15.8425 10.3267 15.8291 10.3259 15.814 10.324C15.7988 10.3221 15.7847 10.3194 15.7724 10.3164C15.7483 10.3106 15.7387 10.3055 15.7544 10.3121C15.7624 10.3154 15.7744 10.3207 15.7932 10.3293C15.8125 10.3382 15.8338 10.3483 15.8628 10.362L16.7175 8.55377ZM16 10.5C16 10.3965 16 10.3256 16.0018 10.2656C16.0036 10.2069 16.0065 10.1806 16.0079 10.171C16.0088 10.165 16.007 10.1797 15.9976 10.2045C15.9878 10.2307 15.9764 10.2498 15.9705 10.2583L14.324 9.12291C13.9691 9.63764 14 10.173 14 10.5H16ZM15.5373 8.35439C15.2598 8.39979 15.0146 8.52968 14.8602 8.62748C14.7058 8.72527 14.4836 8.89142 14.324 9.12291L15.9705 10.2583C15.9494 10.2889 15.9319 10.3086 15.9233 10.3178C15.9141 10.3276 15.9086 10.3324 15.9082 10.3327C15.9076 10.3333 15.9095 10.3316 15.914 10.3282C15.9185 10.3249 15.9241 10.3211 15.9304 10.317C15.9368 10.313 15.9427 10.3096 15.9476 10.307C15.9525 10.3043 15.9549 10.3033 15.9541 10.3037C15.9537 10.3039 15.947 10.3068 15.9342 10.3109C15.9222 10.3147 15.8968 10.3222 15.8602 10.3282L15.5373 8.35439ZM15.8628 15.4713C15.8338 15.485 15.8125 15.4951 15.7932 15.504C15.7744 15.5126 15.7624 15.5179 15.7544 15.5212C15.7387 15.5278 15.7483 15.5227 15.7724 15.5169C15.7847 15.5139 15.7988 15.5112 15.814 15.5093C15.8291 15.5074 15.8425 15.5066 15.8535 15.5064C15.8751 15.5061 15.8802 15.5084 15.8602 15.5051L15.5373 17.4789C15.7644 17.5161 15.9948 17.5205 16.2409 17.4612C16.4485 17.4112 16.6306 17.3206 16.7174 17.2795L15.8628 15.4713ZM14 15.3333C14 15.6603 13.9691 16.1956 14.324 16.7104L15.9705 15.575C15.9764 15.5835 15.9878 15.6026 15.9976 15.6287C16.007 15.6536 16.0088 15.6683 16.0079 15.6622C16.0065 15.6527 16.0036 15.6264 16.0018 15.5677C16 15.5077 16 15.4368 16 15.3333H14ZM15.8602 15.5051C15.8968 15.5111 15.9222 15.5186 15.9342 15.5224C15.947 15.5265 15.9537 15.5294 15.9541 15.5296C15.9549 15.53 15.9525 15.529 15.9476 15.5263C15.9427 15.5237 15.9368 15.5203 15.9304 15.5162C15.9241 15.5122 15.9185 15.5084 15.914 15.5051C15.9095 15.5017 15.9076 15.5 15.9082 15.5006C15.9086 15.5009 15.9141 15.5057 15.9233 15.5155C15.9319 15.5247 15.9494 15.5444 15.9705 15.575L14.324 16.7104C14.4836 16.9419 14.7058 17.108 14.8602 17.2058C15.0146 17.3036 15.2598 17.4335 15.5373 17.4789L15.8602 15.5051ZM4.33329 9.99998C4.33329 6.87037 6.87035 4.33331 9.99996 4.33331V2.33331C5.76578 2.33331 2.33329 5.7658 2.33329 9.99998H4.33329ZM9.99996 4.33331C13.1296 4.33331 15.6666 6.87037 15.6666 9.99998H17.6666C17.6666 5.7658 14.2341 2.33331 9.99996 2.33331V4.33331Z" fill="#323539"/>
                            </svg>
                            <span className='text-md text-dark-neutral-700 ml-[6px]'>Need help?</span>
                            <a className='text-primary-purple-500 text-sm ml-1'>
                                Contact Support
                            </a>
                            <button className='px-4 py-[10px] font-[500] text-dark-neutral-700 text-sm rounded-md border-[1px] border-light-neutral-600 shadow-xs ml-auto'>
                                Report this campaign                                            
                            </button>
                        </div>            
                    </div>                        
                </div>                
            </div>
            <div className='bg-light-neutral-50 border-[1px] border-transparent'>
                <div className='mt-14 mx-page-mx-lg h-[1000px]'>
                    <h3 className='text-headline-xs text-dark-neutral-700 font-[500]'>
                        Tags for this project
                    </h3>
                    <div className='flex gap-3 mt-6'>                        
                            {basicsData && basicsData.tags ? basicsData.tags.map((item, index)=>(
                                <button className='py-[10px] px-4 border-[1px] border-light-neutral-600 shadow-xs rounded-[100px] text-sm'>
                                    {item}
                                </button>
                            )):''}
                    </div>
                </div>
            </div>            
        </div>
      )

}

export default CampaignDetailedView