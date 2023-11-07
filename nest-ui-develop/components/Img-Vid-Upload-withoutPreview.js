import React, { useRef } from 'react'

const ImgVidUploadWithoutPreview = (props) => {    

  return (
    <div className='flex justify-between'>
        <div className='w-full p-4 border-2 border-borderGrayColor rounded-md h-80 flex flex-col gap-4 justify-between'>
          <input              
            type="file"              
            id="coverImage"             
            onChange={props.handleImageChange}              
            className="hidden focus:ring-1 focus:ring-primary-brand"
            accept="image/png, image/jpg, image/jpeg"                        
          />
          <label
            htmlFor="coverImage"
            className='h-[40%] flex justify-center items-center border-2 border-dashed border-borderGrayColor w-full font-[550] text-sm text-black bg-[#F6F6F6] mx-auto text-center rounded-sm cursor-pointer'
          >
            Upload image
          </label>  
            <div className='flex justify-between items-center'>
              <div className='border-black h-0 border-[1px] w-[45%]'></div>
              <span> OR </span>
              <div className='border-black h-0 border-[1px] w-[45%]'></div>
            </div>
            <div className='flex flex-col gap-4'>
              <h2 className='font-[500]'>
                Add a video that describes your project.
              </h2>
              <div className='w-full rounded-md border-2 border-borderGrayColor p-2 flex justify-between'>
                <input type="text" ref={props.coverVideoRef} pattern="^(https?:\/\/)?(www\.)?youtube\.com\/embed\/[a-zA-Z0-9_-]{11}$" className='w-[80%]' required />
                <button className='bg-black rounded-3xl px-2 py-1 text-white min-w-max' onClick={props.handleVideoChange}>+ Add link</button>
              </div>            
          </div>
        </div>  
    </div>        
  )
}

export default ImgVidUploadWithoutPreview