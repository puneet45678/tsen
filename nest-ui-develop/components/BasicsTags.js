import React, { useState, useEffect } from 'react'
import { useInView } from 'react-intersection-observer';
import { useDispatch, useSelector } from "react-redux";
import { changeSection } from '../store/sectionSlice';
import { changeBasicsTags } from '../store/campaignSlice';
import CreatableSelect from 'react-select/creatable';
import makeAnimated from 'react-select/animated';
import axios from 'axios';

const Tags = (props) => {
  const dispatch = useDispatch();
  const menuClick = props.menuClick;
  const { ref, inView, entry } = useInView({ threshold: 0.6 });


  if (inView && !menuClick) {
    // console.log("Tags")
    dispatch(changeSection("Tags"));
  }

  const animatedComponents = makeAnimated();
  const tagsData = useSelector((state) => state.campaign.basics.tags);
  const [disableTags, setDisableTags] = useState(false);
  let [options, setOptions] = useState([
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
  ])


  const filterTags = async () => {
    const tagOptions = await axios.get(`${process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE}/api/v1/tags`, { withCredentials: true });
    let list = tagOptions.data[0].tags.map((item) => { return { value: item, label: item } })
    // console.log(list)

    setOptions(list)
    return tagOptions
  }

  const tagsHandler = (value) => {
    //console.log(value);
    props.setSave(false);
    const tags = value.map((item) => item.label)
    if (tags.length >= 5) {
      setDisableTags(true)
    }
    else {
      setDisableTags(false)
    }
    console.log(dispatch(changeBasicsTags(tags)));
  }

  const loadOptions = (inputValue, callback) => {
    setTimeout(() => {
      callback(filterTags(inputValue))
    }, 500)
  };
  useEffect(() => {

    (async () => {
      const bleh = await filterTags();
    })();
  }, [])


  let defaultSelectedValue = [];



  // const selectOptions = tagsData.map((item) => ({
  //   value: item, // Replace 'id' with the unique identifier in your data
  //   label: item // Replace 'name' with the display property in your data
  // }));

  useEffect(() => {
    if (typeof tagsData !== "undefined") {
      console.log("this os tag data", tagsData);
      for (let i = 0; i < tagsData.length; i++) {
        defaultSelectedValue.push({ "value": tagsData[i], "label": tagsData[i] });
      }
    }
    console.log("defaultSelectedValue", defaultSelectedValue, "tagsData", tagsData);
  }, [tagsData])


  return (
    <div className='flex justify-center' id="Tags">
      <div className='bg-white md:ml-32 lg:ml-8  rounded-[2px] lg:pl-4 mb-2 w-full md:w-[65%]' ref={ref} id="AboutCampaign">
        <div className='mt-7 ml-4 text-base font-[550]'>Tags</div>
        <div className=' w-full md:w-[85%] lg:w-[45%] px-8 lg:px-6 mb-7'>
          <div className='mt-2 sm:mt-4 z-9999'>
            <p className='mb-1 sm:mb-3 text-sm font-[500]'>Enter up to five keywords that best describe your campaign.These tags will help with organization and discoverability .</p>
            <div className='w-[95%]'>
              <CreatableSelect defaultValue={defaultSelectedValue} isOptionDisabled={() => disableTags} components={animatedComponents} isMulti options={options} onChange={(value) => tagsHandler(value)} />
            </div>
          </div>
        </div>
      </div>

      <div className='w-[0%] lg:w-[45%] px-6 hidden lg:block '>
        <div className='mt-7'>
          <h1 className='text-lg font-[550] text-primary-brand'>Tags</h1>
          <h3 className='text-xs'>Register some keywords to help buyers and search engines find your model. Here you can  put words or phrases related to your model, such as the name of the actor who plays, name of the comics etc</h3>
        </div>
      </div>

    </div>
  )
}
export default Tags