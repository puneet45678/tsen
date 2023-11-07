import React from 'react'
import Image from 'next/image'

const CreatedMilestoneCard = (props) => {
  return (
    <div className='h-fit w-full rounded-md overflow-hidden border-[1.5px] border-borderGrayColor'>
        <div className='h-[200px] bg-[#F4F4F4] flex justify-center items-center'>
            <img src="/images/icons/altImg.svg" className='w-[27%]'/>
        </div>
        <div className='py-2 px-3'>
            <p className='font-[600] mt-3'>Articulated Baby Dragon</p>
            <div className='px-3 py-2 mt-2 flex justify-between bg-[#F4F4F4] rounded-md'>
                <div className='flex gap-2'><span className='font-[400]'>Price</span><span className='font-[700]'>420</span></div>
                <div className='flex gap-2'><span className='font-[400]'>Models</span><span className='font-[700]'>69</span></div>
            </div>
            <div className='flex gap-2 justify-start mt-2'>
                <div className='group aspect-square border-[1.5px] border-[#171717] hover:bg-[#171717] p-2 rounded-md flex items-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" class="w-6 h-6 stroke-[#171717] group-hover:stroke-white">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                </div>
                <button className='bg-[#171717] text-white flex justify-center items-center gap-1 w-full rounded-md' onClick={()=>props.setUploadFiles(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" className="w-6 h-6 stroke-white">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                    </svg>
                    <span className='text-sm'>Simple cloud upload</span>
                </button>
            </div>
        </div>
    </div>
  )
}

export default CreatedMilestoneCard