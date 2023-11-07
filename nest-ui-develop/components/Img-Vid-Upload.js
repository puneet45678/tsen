import React, { useRef } from 'react'

const ImgVidUpload = (props) => {    

  return (
    <div className='flex justify-between'>
        <div className='w-[58%] p-4 border-2 border-borderGrayColor rounded-md h-80 flex flex-col gap-4 justify-between'>
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
        <div className='w-[40%] bg-[#F6F6F6] rounded-md h-full flex flex-col justify-center items-center gap-8 text-center'>
          
          {            
            props.coverImage 
            ? <img src={props.imageSrc} className='w-full h-full object-cover mx-auto'/>              
            : props.coverVideo 
            ? <iframe className='object-cover h-full w-full' src={props.videoSrc} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>                          
            : <>
                <img src="/images/icons/coverPreview.svg" className='w-[180px] mx-auto'/>              
                <p>
                  No video/ Image found
                </p>
              </> 
          }                        
        </div>     
    </div>        
  )
}

export default ImgVidUpload