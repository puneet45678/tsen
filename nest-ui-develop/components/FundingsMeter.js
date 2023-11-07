import React, { useState, useEffect } from 'react'
import Image from 'next/image';

const FundingsMeter = (props) => {

  const [fundsPercentage,setFundsPercentage] = useState(0);  
  console.log(fundsPercentage);

  useEffect(() => {

    setFundsPercentage(Math.round((props.reached/props.target)*100));
      
  }, [props.reached,props.target])
  useEffect(() => {

    console.log((props.reached/props.target)*100);
      
  }, [fundsPercentage])
  

  return (
    <div className='bg-[#eceeeccd] flex rounded-[2px] text-white h-full items-center'>      
      <div id="outerMeter" className={`bg-white h-[80%] rounded-full w-[29px] flex ml-36 justify-center items-end relative border-2  border-white ${fundsPercentage >=100? "shadow-xl shadow-[#579A60]":""}`}>
        <div id="innerMeter" className={`bg-[#579A60] rounded-full w-[29px] relative transition-all ease-in-out duration-1000`} style={{height:""+(fundsPercentage>=100 ? 100 : fundsPercentage)+"%"}}> {/*inline css has been used to facilitate usage of dynamic classes which do not work in the desired manner with tailwind css*/}
          <div className='absolute top-[1.4px] left-[1px] w-[23px] h-[23px] rounded-full bg-white text-black text-[9px] flex justify-center items-center font-semibold'>
            {fundsPercentage}%
          </div>
          <div className={`absolute ${fundsPercentage<90?"left-7":"right-7"} w-[80px] text-[#828282] text-xs flex justify-around`}>
            <div className='pt-[2px] ml-[4px]'>
              <Image src="/images/money-bag.png" height={12} width={15} />   
            </div>
            <div>
              <p>Reached</p>
              <p><span className='text-black'>USD</span> {props.reached}</p>
            </div>
            
          </div>
        </div>
        <div className='absolute flex top-0 left-7 w-[80px] text-[#828282] text-xs justify-around'>
          <div className='ml-[4px] pt-[1px]'>
            <Image src="/images/darts.png" height={12} width={15} />   
          </div>
          <div>
            <p>Target</p>
            <p><span className='text-black'>USD</span> {props.target}</p></div>          
        </div>
      </div>
      
    </div>
  )
}

export default FundingsMeter