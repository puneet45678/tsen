import React, { useEffect } from 'react'

const TierFileCard = (props) => {

    useEffect(()=>{
        console.log(props.tierItem)
    })

    const handleModelSelection = (e) =>{
        
        const cardId = props.tierItem._id;
        if (e.target.checked) {
          // Add the cardId to the checkedCards array
          props.setSelectedModelIds((prevState) => [...prevState, cardId]);
          props.setSelectedCount((initialCount)=>initialCount+1);
        } else {
          // Remove the cardId from the checkedCards array
          props.setSelectedModelIds((prevState) =>
            prevState.filter((id) => id !== cardId)
          );
        }
    }

  return (
    <div className='flex flex-col relative w-full rounded-md overflow-hidden border-[1.5px] border-borderGrayColor'>
        <input type='checkbox' onChange={handleModelSelection} className='absolute top-4 left-4 w-6 h-6'></input>
        <div className='h-[200px] bg-black/20 flex justify-center items-center'>
            <img src={props.tierItem.coverImage} className='w-full h-full object-cover'/>
        </div>
        <div className='py-2 px-3 flex flex-col justify-between grow'>
            <p className='font-[600] mt-3 '>{props.tierItem.modelName}</p>
            <div className='px-3 py-2 mt-2 flex justify-between bg-[#F4F4F4] rounded-md'>
                <span className='font-[400] text-sm'>License</span>
                <span className='font-[700] text-sm'>{props.tierItem.license ? props.tierItem.license.LicenseName : ''}</span>
            </div>
            <div className='flex gap-2 justify-between mt-2'>
                <span className='text-sm'>{props.tierItem.uploadDatetime}</span>
                <span className='text-lg font-[600]'>{props.tierItem.price}</span>
            </div>
        </div>
    </div>    
  )
}

export default TierFileCard