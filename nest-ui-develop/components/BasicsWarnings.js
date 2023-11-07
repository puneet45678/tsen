import React, { useState, useEffect } from 'react'
import { useInView } from 'react-intersection-observer';
import { useDispatch, useSelector } from "react-redux";
import { changeSection } from '../store/sectionSlice';

const Warnings = (props) => {

  const dispatch = useDispatch();
  const menuClick = useSelector((state) => state.section.menuClick);
  const { ref, inView, entry } = useInView({ threshold: 0.8 });


  if (inView && !menuClick) {
    dispatch(changeSection("Warnings"));
  }
  const [warnings, setWarnings] = useState(false);

  return (
    <div className='flex justify-center'>
      <div className='bg-white  md:ml-32 lg:ml-8  rounded-[2px] lg:pl-4 mb-4 w-full md:w-[64%]' ref={ref} id="AboutCampaign">
        <div className='mt-7 ml-4 text-base font-[550]'>Warnings</div>
        <div className=' w-full md:w-[85%] lg:w-[45%] px-8 lg:px-6 md:mb-7'>
          <div className='mt-5 flex ml-4'>
            <input className={`w-5 h-5 rounded-sm px-2 py-1 bg-primary-brand`} id="primarycategory" type="checkbox" name="primarycategory" onChange={() => setWarnings(true)}></input>
            <div className='flex-wrap'>
              <span className='mb-1 sm:mb-2 text-[0.7rem] md:text-xs lg:text-[0.85rem] font-normal ml-3'>Select the box if this project has a delicate/sensitive or mature/sexual content?</span>
            </div>
          </div>
          {/* <div className='w-[50%] lg:w-[70%] mx-auto mt-4 sm:mt-6'>
            <button className='bg-primary-brand px-6 py-1 md:py-2 text-xs lg:text-sm text-white rounded-sm hover:bg-sky-600 max-h-[2.5rem]' onClick={() => { }}>Upload the model</button>
          </div> */}
        </div>
      </div>
      <div className='w-[0%] lg:w-[45%]'></div>
    </div >
  )
}

export default Warnings