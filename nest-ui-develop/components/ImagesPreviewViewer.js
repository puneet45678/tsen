import React, { useState, useEffect } from 'react'
import Image from 'next/image';

const ImagesViewer = (props) => {

    const [showCrop, setShowCrop] = useState(false);
    console.log("files", props.files)


    useEffect(() => {
        const handleEsc = (event) => {
            if (event.keyCode === 27 && showCrop == false) {
                props.setShowImageViewer(false);
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, []);

    return (
        <>
            <div className='fixed opacity-75 bg-black top-0 bottom-0 left-0 right-0 z-40'></div>
            <div className='fixed top-36 left-20 right-20 bg-gray-200 z-40'>
                <div className='flex flex-rpw '>
                    <div className='w-1/3'></div>
                    <div className='flex justify-center m-4 w-1/3'>
                        <div className=''>
                            <h1 className='text-2xl'>Preview Images</h1>
                        </div>
                    </div>

                    <div className='w-1/3 ml-auto flex justify-end '>
                        <button className='text-2xl align-end h-[10%] w-[10%] mt-4' onClick={() => props.setShowImageViewer(false)}>
                            <svg className='w-[60%] ' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M175 175C184.4 165.7 199.6 165.7 208.1 175L255.1 222.1L303 175C312.4 165.7 327.6 165.7 336.1 175C346.3 184.4 346.3 199.6 336.1 208.1L289.9 255.1L336.1 303C346.3 312.4 346.3 327.6 336.1 336.1C327.6 346.3 312.4 346.3 303 336.1L255.1 289.9L208.1 336.1C199.6 346.3 184.4 346.3 175 336.1C165.7 327.6 165.7 312.4 175 303L222.1 255.1L175 208.1C165.7 199.6 165.7 184.4 175 175V175zM512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256zM256 48C141.1 48 48 141.1 48 256C48 370.9 141.1 464 256 464C370.9 464 464 370.9 464 256C464 141.1 370.9 48 256 48z" /></svg>
                        </button>
                    </div>
                </div>

                <div className={`${(props.carouselItems.length > 4) ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-12 mx-20 h-[24rem] overflow-y-scroll no-scrollbar" : " grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-12 mx-20 h-[24rem]"}`}>
                    {props.carouselItems.map((items, index) => (
                        <div className='mx-auto' key={index + "key"}>
                            <div className='flex flex-col w-[12rem]  group lg:w-[14rem] h-[14rem] lg:h-[17rem] rounded-[2px] relative shadow-md hover:h-[17.2rem] hover-w-[14.4rem] transition-all ease-in-out duration-500 hover:shadow-lg'>
                                <div className='w-full relative h-full rounded-[2px]'>
                                    <img src={items} alt={props.campaignAssets[index].metaData} id={index}
                                        className={`h-full w-full rounded-[2px]`}
                                        style={{ objectFit: "cover" }} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className='w-full flex justify-end mb-3'>
                    <div className='mt-9'>
                        {/* <Image className='inline-block' src="/images/add photos.png " height={30} width={30} alt="" />

                        <input
                            type="file"
                            id="campaign images"
                            className="hidden mt-8"
                            accept="image/png, image/jpg, image/jpeg"
                            multiple
                        />
                        <label
                            htmlFor="campaign images"
                            className="text-primary-brand rounded-sm px-3 py-1 mt-8 hover:bg-gray-300"
                        >
                            Add More Photos
                        </label> */}
                    </div>

                    <div className=' mx-6'>
                        {/* <button className='bg-primary-brand rounded-sm px-3 py-1 text-white mt-8' onClick={() => props.setIsImageChanged(false)} >Done</button> */}
                    </div>
                </div>


            </div>
        </>
    )
}

export default ImagesViewer