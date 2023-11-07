import React from 'react'
import dynamic from 'next/dynamic';
import { changeStoryData } from '../store/campaignSlice';
import { useDispatch, useSelector } from 'react-redux';


const EditorBlock = dynamic(() => import('./Editor'), {
  ssr: false,
});

const QuillEditor = dynamic(() => import("./QuillEditor"), {
  ssr: false,
});

const StoryDescription = (props) => {
  const dispatch = useDispatch();
  const story = useSelector((state) => state.campaign.story);  

  return (
    <div className='flex justify-center' id="title">
      <div className='bg-white rounded-[2px] w-full'>        
        <div className='w-full'>
          <div className='mt-4 flex flex-col gap-4'>
            <div className='flex'>
              <p className='font-[500]'>Description *</p>              
            </div>            
            {/* <textarea className='p-2 border-[1.5px] border-borderGrayColor rounded-md' rows={12} /> */}
            <QuillEditor
              maxLength={20000}
              value={story?.storyDescription}
              onChange={(value) =>{
                  if(value)
                    props.setStoryInvalid(prevSet => {
                      const newSet = new Set(prevSet);
                      newSet.delete('storyDescription');
                      return newSet;
                    })
                  
                  dispatch(changeStoryData(value))
                }
              }
              placeholder={""}
              imageSaveUrl={``}
              imageDeleteUrl={``}
            />
            {/* <span className={`text-red-600 ${props.storyInvalid.has('storyDescription') && props.publishClicked ? '' : 'hidden'}`}>This field cannot be left empty</span> */}
            
            {/* <div className={`bg-white sm:w-full w-[95%] min-h-[108px] focus:ring-1 focus:ring-primary-brand rounded-sm border-[1.5px] px-2 py-1 outline-none placeholder:text-center`} >
              <EditorBlock holder={"editorjs-container-2"}
                data={story !== undefined && storyDescriptionData !== undefined ? storyDescriptionData : " "}
                show={true}
                onChange={(value) => {
                  console.log({ ...storyDescriptionData, ...value });
                  props.setCampaignDataChanged(true);                  
                }}
              />              
            </div> */}
          </div>
        </div>
      </div>
      {/* <div className='w-[0%] lg:w-[45%]'></div> */}

    </div>
  )
}

export default StoryDescription