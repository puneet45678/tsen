import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Updates = (props) => {

  const [ updatesData, setUpdatesData ] = useState();
  
  useEffect(() => {          
    const getUpdatesData = async () =>{
      const updatesData = await axios.get(`${process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE}/api/v1/campaigns/${props.campaignId}/field/updates`)
      console.log("updatesData.data.updates ", updatesData.data.updates);      
      setUpdatesData(updatesData.data.updates);
    }
    getUpdatesData();
  }, [])
  

  return (
    <div className='flex flex-col gap-y-6'>
      {updatesData && updatesData.map((item, index)=>(
        <div className='rounded-md border-[1px] border-light-neutral-700 shadow-xs'>
          <div className='border-b-[1px] border-light-neutral-700 flex items-center px-6 py-4'>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 16V8M8.53566 14L15.4639 10M8.53566 10L15.4639 14M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C14.5612 2 16.8975 2.96285 18.6667 4.54631M19.7778 2V5.33333C19.7778 5.94698 19.2803 6.44444 18.6667 6.44444H15.3333" stroke="#323539" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span className='text-headline-2xs text-dark-neutral-700 font-[500] ml-3'>
              Update {index+1}
            </span>
            <h2 className='text-lg text-dark-neutral-400 ml-4'>
              By
              <a className='ml-1'>
                @{props.username}
              </a>               
            </h2>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className='ml-auto'>
              <path d="M2 6.66667H14M6 3.33333H4.13333C3.3866 3.33333 3.01323 3.33333 2.72801 3.47866C2.47713 3.60649 2.27316 3.81046 2.14532 4.06135C2 4.34656 2 4.71993 2 5.46667V11.8667C2 12.6134 2 12.9868 2.14532 13.272C2.27316 13.5229 2.47713 13.7268 2.72801 13.8547C3.01323 14 3.3866 14 4.13333 14H11.8667C12.6134 14 12.9868 14 13.272 13.8547C13.5229 13.7268 13.7268 13.5229 13.8547 13.272C14 12.9868 14 12.6134 14 11.8667V5.46667C14 4.71993 14 4.34656 13.8547 4.06135C13.7268 3.81046 13.5229 3.60649 13.272 3.47866C12.9868 3.33333 12.6134 3.33333 11.8667 3.33333H10M6 3.33333H10M6 3.33333V3C6 2.44772 5.55228 2 5 2C4.44772 2 4 2.44772 4 3V3.33333M10 3.33333V3C10 2.44772 10.4477 2 11 2C11.5523 2 12 2.44772 12 3V3.33333" stroke="#858C95" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span className='text-dark-neutral-50 text-md ml-[14px] font-[500]'>May 18, 2023</span>
          </div>
          <div className='bg-light-neutral-50 p-6'>
            <h1 className='text-headline-2xs font-[500] text-black'>
              {item.updateTitle}
            </h1>
            <div className='relative'>
              <p className='mt-4 text-dark-neutral-100'>
                {item.updateDescription}
              </p>
              <div className='absolute bottom-0 h-[80%] w-full bg-gradient-to-t from-light-neutral-50 to-transparent'></div>
            </div>
            <div className='flex items-center w-full mt-[33px]'>
              <div className='flex items-center'>
                <button>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M8.99538 4.43711C7.64581 2.86435 5.39533 2.44128 3.70442 3.88146C2.01351 5.32164 1.77545 7.72955 3.10333 9.43286C4.20738 10.849 7.5486 13.8359 8.64367 14.8026C8.76618 14.9108 8.82744 14.9648 8.89889 14.9861C8.96126 15.0046 9.0295 15.0046 9.09186 14.9861C9.16331 14.9648 9.22457 14.9108 9.34709 14.8026C10.4422 13.8359 13.7834 10.849 14.8874 9.43286C16.2153 7.72955 16.0063 5.30649 14.2863 3.88146C12.5664 2.45643 10.3449 2.86435 8.99538 4.43711Z" stroke="#525D6A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <span className='text-sm text-dark-neutral-200 font-[500] ml-1'>21 Likes</span>
              </div>
              <div className='flex items-center ml-3'>
                <button>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M9 15.75C12.7279 15.75 15.75 12.7279 15.75 9C15.75 5.27208 12.7279 2.25 9 2.25C5.27208 2.25 2.25 5.27208 2.25 9C2.25 10.1112 2.51851 11.1597 2.99419 12.0841C3.2162 12.5156 3.28457 13.0194 3.11266 13.4732L2.44242 15.2421C2.34946 15.4875 2.53073 15.75 2.7931 15.75H9Z" stroke="#525D6A" strokeWidth="1.5"/>
                  </svg>
                </button>
                <span className='text-sm text-dark-neutral-200 font-[500] ml-1'> 42 Comments</span>
              </div>
              <button className='ml-auto text-primary-purple-500 text-md font-[500] flex'>
                Read all
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className='ml-[6px]'>
                  <path d="M4.16663 10H15M10.8333 5L15.244 9.41074C15.5695 9.73618 15.5695 10.2638 15.244 10.5893L10.8333 15" stroke="#5558DA" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          </div>          
        </div>
      ))}
    </div>
  )
}

export default Updates