import { useSelector } from 'react-redux';
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import axios from 'axios';

const SubMenu = (props) => {

    const router = useRouter();
    const campaignData = useSelector((state)=>state.campaign);    

    const updateCampaignData = async () =>{
      try {        
        await axios.put(`${process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE}/api/v1/campaign/${props.campaignId}`,
          campaignData, {
            withCredentials: true
        })      
        props.setCampaignDataChanged(new Set());
      }

      catch(e){
        console.log(e);
      }
    }

    const handleSubSectionChange = (item) =>{

      if(item.to.split('/')[item.to.split('/').length-1] === 'updates' && campaignData.statusOfCampaign === 'Draft')
        return;

      if(props.campaignDataChanged.size !== 0)              
        updateCampaignData(item);                    
      router.push(item.to)

    }

  return (
    <div className='w-full flex flex-col gap-6 h-full'>
        {props.subMenuItems.map((item, index)=>(
            <button className={`${item.to.split('/')[item.to.split('/').length-1] === 'updates' && campaignData.statusOfCampaign === 'Draft' ? "text-borderGray cursor-not-allowed" : "text-[#404040] hover:bg-[#D4D4D4] cursor-pointer"}                                 
                                ${props.subSection !== 'updates' && props.subSection === item.to.split('/')[item.to.split('/').length-1] ? "bg-[#D4D4D4] font-[600] text-[#171717]" : "font-[500]"} 
                                rounded-md px-3 py-2 w-fit flex justify-between items-center gap-2`} onClick={()=>handleSubSectionChange(item)}>
                {item.title}
                {
                  item.to.split('/')[item.to.split('/').length-1] === 'updates' && campaignData.statusOfCampaign === 'Draft' 
                  ? <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
                      <g clipPath="url(#clip0_3635_1197)">
                        <path d="M2.5 8.5C2.5 9.28793 2.65519 10.0681 2.95672 10.7961C3.25825 11.5241 3.70021 12.1855 4.25736 12.7426C4.81451 13.2998 5.47595 13.7417 6.2039 14.0433C6.93185 14.3448 7.71207 14.5 8.5 14.5C9.28793 14.5 10.0681 14.3448 10.7961 14.0433C11.5241 13.7417 12.1855 13.2998 12.7426 12.7426C13.2998 12.1855 13.7417 11.5241 14.0433 10.7961C14.3448 10.0681 14.5 9.28793 14.5 8.5C14.5 7.71207 14.3448 6.93185 14.0433 6.2039C13.7417 5.47595 13.2998 4.81451 12.7426 4.25736C12.1855 3.70021 11.5241 3.25825 10.7961 2.95672C10.0681 2.65519 9.28793 2.5 8.5 2.5C7.71207 2.5 6.93185 2.65519 6.2039 2.95672C5.47595 3.25825 4.81451 3.70021 4.25736 4.25736C3.70021 4.81451 3.25825 5.47595 2.95672 6.2039C2.65519 6.93185 2.5 7.71207 2.5 8.5Z" stroke="#121212" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8.5 11.8333V11.8408" stroke="#121212" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8.49935 9.50003C8.48707 9.28361 8.54545 9.06906 8.66569 8.8887C8.78593 8.70834 8.96152 8.57194 9.16602 8.50003C9.4166 8.4042 9.64152 8.25152 9.82306 8.054C10.0046 7.85648 10.1378 7.61951 10.2122 7.36175C10.2866 7.104 10.3002 6.83249 10.2518 6.56861C10.2035 6.30472 10.0945 6.05566 9.93356 5.84104C9.77259 5.62642 9.564 5.45209 9.32421 5.33177C9.08442 5.21146 8.81998 5.14846 8.5517 5.14771C8.28342 5.14697 8.01863 5.20851 7.77818 5.32749C7.53773 5.44647 7.32817 5.61963 7.16602 5.83336" stroke="#121212" strokeLinecap="round" strokeLinejoin="round"/>
                      </g>
                      <defs>
                        <clipPath id="clip0_3635_1197">
                          <rect width="16" height="16" fill="white" transform="translate(0.5 0.5)"/>
                        </clipPath>
                      </defs>
                    </svg>
                  :''
                }
                <div className={`${props.publishClicked && props.invaliditySets[index].size !== 0 ? console.log("bleem", props.invaliditySets[index]) : "hidden"} rounded-full h-2 aspect-square bg-red-400`}>                  
                </div>
            </button>
        ))}
    </div>
  )
}

export default SubMenu