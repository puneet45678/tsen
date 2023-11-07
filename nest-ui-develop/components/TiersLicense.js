import React, { useState, useEffect } from 'react'
import { changeTierslicense } from '../store/campaignSlice';
import { useSelector, useDispatch } from 'react-redux';
import Select from "react-select";


const License = (props) => {

  // configuration and style for dropDowns
  const multiSelect = {
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
    multiValue: (styles) => {
      return {
        ...styles,
        backgroundColor: "#1D75BD",
        borderRadius: "2px",
      };
    },
    multiValueLabel: (styles) => ({
      ...styles,
      color: "white",
    }),
    multiValueRemove: (styles) => ({
      ...styles,
      color: "white",
      ":hover": {
        color: "red",
      },
    }),
  };

  const preferredLicenseOptions = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];

  const dispatch = useDispatch();
  const licenseDetails = useSelector((state) => state.campaign.tiers.license);

  // const [license, setLicense] = useState({
  //   remixes:"",
  //   commercialUse:"",
  //   exclusiveSharing:"",
  //   allAvailableModels:[]
  // })

  const inputLicenseHandler = (e) => {
    return 1;


  }


  const licenseHandler = (e) => {

    var ele = document.getElementsByName(e.target.name);
    props.setSave(false);
    for (let i = 0; i < ele.length; i++) {
      if (ele[i].checked)
        // dispatch(changeTierslicense({ ...tiersDataSlice, [nam]: val }));
        dispatch(changeTierslicense({ ...licenseDetails, [e.target.name]: `${ele[i].value}` }));
      console.log("liscedns details==> ", licenseDetails);
    }

  }

  return (
    <div className='flex mt-2 justify-center'>
      <div className='bg-white  md:ml-32 lg:ml-8  rounded-[2px] lg:pl-4 px-4 mb-2 w-full md:w-[65%]' id="Support">
        <div className='mt-7 ml-4 text-base font-[550]'>License</div>
        <div className='w-full lg:w-[45%] px-8 lg:px-6 md:mb-7'>
          <div className='my-3 sm:my-6'>
            <div className='mb-1 sm:mb-2 text-base md:text-sm font-[500]'>Allow remixes of your object to be shared?</div>
            <div className='flex flex-wrap'>
              <div className=' text-black rounded-l-sm px-4 py-2 flex items-center'>
                <input className='h-5 w-5 bg-primary-brand' type="radio" id="remixSharingYes" name="remixes" value="yes" onClick={licenseHandler} />
                <label className='text-sm md:text-xs mx-2' htmlFor="remixSharingYes">Yes</label>
              </div>
              <div className='text-black rounded-r-sm ml-[1px] px-4 py-2 flex items-center'>
                <input className='h-5 w-5 bg-primary-brand' type="radio" id="remixSharingNo" name="remixes" value="no" onClick={licenseHandler} />
                <label className='text-sm md:text-xs mx-2' htmlFor="remixSharingNo">No</label>
              </div>
            </div>
          </div>
          <div className='my-3 sm:my-6'>
            <div className='mb-1 sm:mb-2 text-base md:text-sm font-[500]'>Allow commercial uses of your object?</div>
            <div className='flex flex-wrap'>
              <div className='text-black rounded-l-sm px-4 py-2 flex items-center'>
                <input className='h-5 w-5 bg-primary-brand' type="radio" id="commercialUseYes" name="commercialUse" value="yes" onClick={licenseHandler} />
                <label className='text-sm md:text-xs mx-2' hmtlFor="commercialUseYes">Yes</label>
              </div>
              <div className='text-black rounded-r-sm ml-[1px] px-4 py-2 flex items-center'>
                <input className='h-5 w-5 bg-primary-brand' type="radio" id="commercialUseNo" name="commercialUse" value="no" onClick={licenseHandler} />
                <label className='text-sm md:text-xs mx-2' htmlFor="commercialUseNo">No</label>
              </div>
            </div>
          </div>
          <div className='my-3 sm:my-6'>
            <div className='mb-1 sm:mb-2 text-base md:text-sm font-[500]'>Allow my object to be exclusively shared on ikarusnest?</div>
            <div className='flex flex-wrap'>
              <div className='text-black rounded-l-sm px-4 py-2 flex items-center'>
                <input className='h-5 w-5 bg-primary-brand' type="radio" id="exclusiveYes" name="exclusiveSharing" value="yes" onClick={licenseHandler} />
                <label className='text-sm md:text-xs mx-2' htmlFor="exclusiveNo">Yes</label>
              </div>
              <div className='text-black rounded-r-sm ml-[1px] px-4 py-2 flex items-center'>
                <input className='h-5 w-5 bg-primary-brand' type="radio" id="exclusiveNo" name="exclusiveSharing" value="no" onClick={licenseHandler} />
                <label className='text-sm md:text-xs mx-2' htmlFor="exclusiveNo">No</label>
              </div>
            </div>
          </div>

          <div className="my-5 flex flex-col">
            <p className="font-medium">Preferred Tools</p>
            <div className="max-w-[435px] mt-2">
              <Select
                options={preferredLicenseOptions}
                styles={multiSelect}
                isMulti
                placeholder={"Select your License"}
              />
            </div>
          </div>

        </div>
      </div>
      <div className='w-[0%] lg:w-[45%]'></div>
    </div>
  )
}

export default License