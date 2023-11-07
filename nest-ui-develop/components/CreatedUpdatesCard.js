import React from 'react'
import parse from "html-react-parser";

const CreatedUpdatesCard = (props) => {
  return (
    <div className='border-[1.5px] border-borderGrayColor rounded-md'>
        <div className='border-b-[1.5px] border-borderGrayColor w-full flex items-center justify-between px-8 py-6'>
            <div className='flex gap-3 items-center'>
                <img src='/images/icons/update.svg' className='w-9 h-9'/>
                <span className='font-[600] text-xl'>
                    Update {props.index}
                </span>
            </div>
            <div className='flex gap-2'>
                <img src='/images/icons/calendar.svg' className='w-6 h-6' />
                <p className='text-sm font-[400]'>May 28, 2023</p>
            </div>
        </div>
        <div className='p-8'>
            <h3 className='text-2xl font-[600]'>
                {props.updateData.updateTitle} 
            </h3>
            <div className='h-20 relative overflow-hidden mt-4'>
                <p>
                    {parse(props.updateData.updateDescription)}
                </p>
                <div className='absolute h-20 w-full bottom-0 bg-gradient-to-t from-white to-transparent'></div>
            </div>
            <div className='w-full mt-8'>
                <button className='ml-auto bg-[#171717] px-5 py-3 flex gap-2 rounded-md' onClick={()=>{props.setShowObjUpdate(true); props.setSelectedObj(props.updateData)}}>
                    <img src='/images/icons/edit.svg' className='w-6 h-6'/>
                    <span className='font-[700] text-white'>
                        Edit
                    </span>
                </button>
            </div>
        </div>
    </div>
  )
}

export default CreatedUpdatesCard