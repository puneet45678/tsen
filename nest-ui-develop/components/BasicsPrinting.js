import React, { useState, useEffect } from 'react'
import { useInView } from 'react-intersection-observer';
import { useDispatch, useSelector } from "react-redux";
import { changeSection } from '../store/sectionSlice';
import { changeBasicsPrinting } from '../store/campaignSlice';
import dynamic from 'next/dynamic';
import Select from "react-select";

const EditorBlock = dynamic(() => import('./Editor'), {
  ssr: false,
});



const PrintingRecommendations = (props) => {

  // configuration and style for dropDowns
  const singleSelect = {
    control: (styles, state) => ({
      alignItems: "center",
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-between",
      position: "relative",
      transition: "all 100ms",
      backgroundColor: "hsl(0, 0%, 100%)",
      borderColor: "hsl(0, 0%, 80%)",
      borderRadius: 4,
      borderStyle: "solid",
      borderWidth: 1,
      boxShadow: undefined,
      boxSizing: "border-box",
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: "#D9D9D9",
      borderRadius: "2px",
      marginTop: "0.5rem",
      padding: "",
      fontSize: "16px",
      // borderWidth: state.isFocused ? "0" : "10px",
    }),
    option: (styles, { isFocused, isSelected }) => {
      return {
        ...styles,
        maxWidth: "435px",
        backgroundColor: isSelected ? "#1D75BD" : isFocused ? "#D9D9D9" : "",
      };
    },
  };

  const preferredPrintersOptions = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];


  const dispatch = useDispatch();
  const menuClick = props.menuClick;
  const { ref, inView } = useInView({ threshold: 0.9 });

  const printingDetails = props.printingDetails;

  if (inView && !menuClick) {
    // console.log("AboutModel")
    dispatch(changeSection("PrintingDetails"));
  }

  const inputHandler = (e) => {
    props.setSave(false);
    let nam, val;
    nam = e.target.name;
    val = e.target.value;
    dispatch(changeBasicsPrinting({ ...printingDetails, [nam]: val }));
  };

  return (
    <>
      <div className='flex justify-center'>
        <div className='bg-accent2 md:border-[1px]  md:ml-32 lg:ml-8 border-accent1 rounded-[2px] lg:pl-4 mb-2 w-full md:w-[64%]' ref={ref} id="AboutCampaign">
          <div className='mt-7 ml-4 text-base font-[550]'>Printing Details</div>
          <div className=' w-full md:w-[85%] lg:w-[45%] px-8 lg:px-6 mb-7'>
            <div className='mt-2 sm:mt-4'>
              <p className='mb-1 sm:mb-3 text-sm font-[500]'>Printing details description</p>
              <div className={`bg-white sm:w-full w-[95%] min-h-[108px] focus:ring-1 focus:ring-primary-brand rounded-sm border-[1.5px] px-2 py-1 outline-none placeholder:text-center`} >
                <EditorBlock holder={"editorjs-container"}
                  data={printingDetails !== undefined && printingDetails.description !== undefined ? printingDetails.description : " "}
                  show={true}
                  onChange={(value) => {
                    props.setSave(false);
                    console.log("qeffdqe");
                    dispatch(changeBasicsPrinting({ ...printingDetails, description: value }));
                    console.log("printing title", printingDetails.description)
                  }} />
              </div>
            </div>

            <div className="my-5 flex flex-col">
              <p className="font-medium">Type Of Printer</p>
              <div className="max-w-[435px] mt-2">
                <Select
                  options={preferredPrintersOptions}
                  styles={singleSelect}
                  placeholder={"Select Printer"}
                />
              </div>
            </div>

            <div className='mt-4'>
              <p className='mb-1 sm:mb-2 text-sm font-[500]'>Size of file (approx.)</p>
              <div className='flex'>
                <input className={'w-[65%] sm:w-full h-[2rem] mr-2 rounded-sm border-[1.5px] px-2 py-1 focus:ring-1 focus:ring-primary-brand outline-none'} id="size" type="number" defaultValue={printingDetails !== undefined && printingDetails.size !== undefined ? printingDetails.size : " "} name="size" onChange={inputHandler}></input>
                <select className='focus:outline-none w-[25%] rounded-sm border-[1.5px] text-black text-center text-sm' name='unitsOfSize' >
                  <option value="mb">MB</option>
                  <option value="gb">GB</option>
                </select>
              </div>
            </div>

            {/* <div className='mt-2 sm:mt-4'>
              <p className='mb-1 sm:mb-3 text-sm font-[500]'>Material Type</p>
              <select className='w-[95%] h-[2rem] sm:w-full mr-2 rounded-sm border-[1.5px] px-2 py-1 focus:ring-1 focus:ring-primary-brand outline-none' name='unitsOfSize' placeholder='Select...'>
                <option value="option1">Option1</option>
                <option value="option2">Option2</option>
              </select>
            </div> */}

            <div className="my-5 flex flex-col">
              <p className="font-medium">Material Type</p>
              <div className="max-w-[435px] mt-2">
                <Select
                  options={preferredPrintersOptions}
                  styles={singleSelect}
                  placeholder={"Select Printer"}
                />
              </div>
            </div>

            <div className='mt-2 sm:mt-4'>
              <p className='mb-1 sm:mb-3 text-sm font-[500]'>Time to Print</p>
              <div className='flex '>
                <input className={`w-[48%]  border-[1.5px] text-sm rounded-sm px-1 placeholder:text-right`} id="timePrint" type="number" name="timePrint" placeholder='days' />
                <input className={`w-[50%]  border-[1.5px] text-sm rounded-sm px-1 mx-8 placeholder:text-right`} id="timePrint" type="number" name="timePrint" placeholder='hours' />
                <input className={`w-[50%]  border-[1.5px] text-sm rounded-sm px-1 placeholder:text-right`} id="timePrint" type="number" name="timePrint" placeholder='mins' />
                <p className='text-sm mx-2 mt-2'>Approx.</p>
              </div>
            </div>

            <div className='mt-2 sm:mt-4'>
              <p className='mb-1 sm:mb-3 text-sm font-[500]'>Dimension</p>
              <input className={`w-[95%] h-[2rem] sm:w-full mr-2 rounded-sm border-[1.5px] px-2 py-1 focus:ring-1 focus:ring-primary-brand outline-none`} id="" type="text" name="dimensions" defaultValue={printingDetails !== undefined && printingDetails.dimensions !== undefined ? printingDetails.dimensions : " "} onChange={inputHandler} />
            </div>



            <div className='mt-2 sm:mt-4'>
              <p className='mb-1 sm:mb-3 text-sm font-[500]'>Material Quantity</p>
              <input className={`w-[95%] h-[2rem] sm:w-full mr-2 rounded-sm border-[1.5px] px-2 py-1 focus:ring-1 focus:ring-primary-brand outline-none`} id="" type="text" name="materialQuantity" defaultValue={printingDetails !== undefined && printingDetails.materialQuantity !== undefined ? printingDetails.materialQuantity : " "} onChange={inputHandler} />
            </div>

            {/* <div className='mt-2 sm:mt-4'>
              <p className='mb-1 sm:mb-3 text-sm font-[500]'>Approximate size of the file</p>
              <input className={`w-[100%]  sm:w-full rounded-sm border-[1.5px] px-2 py-1 outline-none`} id="" type="text" name="approxSizeOfFile" defaultValue={printingDetails !== undefined && printingDetails.approxSizeOfFile !== undefined ? printingDetails.approxSizeOfFile : " "} onChange={inputHandler} />
            </div> */}
          </div>
        </div>
        <div className='w-[0%] lg:w-[45%]'></div>
      </div>
    </>
  )
}

export default PrintingRecommendations