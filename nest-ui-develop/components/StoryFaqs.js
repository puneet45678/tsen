import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { changeStoryFaqs } from '../store/campaignSlice';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';


const Faqs = (props) => {
  const dispatch = useDispatch();  
  const [removeFaqAlert, setRemoveFaqAlert] = useState(false);
  let faqData = props.faqs;
  let temp = {
    faqId: "",
    question: "",
    answer: ""
  }

  const faqHandler = (e) => {    
    let parentId = e.target.parentElement.parentElement.id;
    if (e.target.name == "question") {
      
      if (faqData[parentId] === undefined || faqData[parentId] === null) {
        temp = {
          faqId: items[parentId].faqId,
          question: e.target.value,
          answer: null
        }
      } else {
        temp = faqData[parentId];
        temp = { ...temp, question: e.target.value };
      }
      const newarr = [...story.faqs];
      newarr[parentId] = temp;
      dispatch(changeStoryFaqs(newarr));
    }

    else if (e.target.name == "answer") {
      if (faqData[parentId] === undefined || faqData[parentId] === null) {
        temp = {
          faqId: items[parentId].faqId,
          question: null,
          answer: e.target.value
        }
      } else {
        temp = faqData[parentId];
        temp = { ...temp, answer: e.target.value };
      }      
      const newarr = [...story.faqs];
      newarr[parentId] = temp;      
      dispatch(changeStoryFaqs(newarr));
    }
  }

  const removeFaq = async (parentId) => {        
    
    let faqId = faqData[parentId].faqId;
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE}/api/v1/campaigns/${props.campaignId}/faqs/${faqId}`,
        {
          headers: {
            "accept": "application/json",
          },
          withCredentials: true,
        }
      );      
      let newArr = [...faqData.slice(0, parseInt(parentId)), ...faqData.slice(parseInt(parentId) + 1)];
      setItems(items.slice(0, items.length - 1));
      dispatch(changeStoryFaqs(newArr));
      setRemoveFaqAlert(false);
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  }

  const faqAddHandler = (length) => {
    const timestamp = Date.now();
    const faqId = uuidv4({ msecs: timestamp });
    let temp = {
      faqId: faqId,
      question: "",
      answer: ""
    }
    const newArr = [...faqData];    
    newArr[length - 1] = temp;
    dispatch(changeStoryFaqs(newArr));
    setItems(items.concat(1));
  }

  return (
    <div className='flex justify-center' id="faqs">
      <div className='bg-white rounded-[2px] w-full md:w-[65%]'>
        <div className='flex justify-center gap-2 text-primary-brand w-fit font-[500] items-center cursor-pointer' onClick={() => faqAddHandler(items.length + 1)}>
          <span>+</span>
          <span title='Add FAQ'>Add Another Question</span>
        </div>
        {(typeof faqData !== "undefined" ? faqData : items).map((item, index) => (
          <div className='w-full md:w-[85%] lg:w-[45%] relative' key={`question-${index}`} id={index}>
            <p className='text-sm font-[500]'>Question</p>
            <div className='flex items-center'>
              <input className='w-[95%] h-[2rem] sm:w-full rounded-sm border-[1.5px] px-2 py-1 focus:ring-1 focus:ring-primary-brand outline-none' id="question" type="text" name="question" defaultValue={story !== undefined && faqData[index].question !== undefined ? faqData[index].question : ""} onChange={faqHandler}></input>
              <div className='w-4 h-4 mx-2 bg-red-500 flex rounded-full justify-center items-center absolute -right-9 text-white text-xs font-semibold cursor-pointer	' title='Remove this faq' onClick={() => setRemoveFaqAlert(true)}>x</div>
            </div>
            <div>
              <p className='mb-1 sm:mb-2 text-sm font-[500] mt-4'>Answer</p>
              <input className='w-[95%] h-[2rem] sm:w-full rounded-sm border-[1.5px] px-2 py-1 focus:ring-1 focus:ring-primary-brand outline-none' id="answer" type="text" name="answer" defaultValue={story !== undefined && faqData[index].answer !== undefined ? faqData[index].answer : ""} onChange={faqHandler}></input>
            </div>

            {removeFaqAlert ? (
              <>
                <div>
                  <div className="fixed inset-0 flex justify-center opacity-75 bg-black z-40"></div>
                  <div className="fixed bottom-[50%] bg-white opacity-100 w-fit h-auto z-50 mx-auto left-0 right-0 rounded-sm">
                    <div className="flex flex-col justify-center">
                      <div className="mt-4 mx-16" id="alert-message">
                        Are you Sure You Want to Remove this Faq?
                      </div>
                      <div className="mt-7 mb-6 mx-auto flex flex-row justify-between gap-4">
                        <div className="">
                          <button
                            className="w-[70px] text-sm  text-white py-1 bg-red-500 hover:bg-red-400 cursor-pointer	"
                            onClick={() => {
                              removeFaq(index);
                              console.log("remove pressed");
                            }}
                          >
                            Remove
                          </button>
                        </div>
                        <button
                          className=" w-[70px] text-sm bg-primary-brand hover:bg-sky-500  text-white py-1 "
                          onClick={() => {
                            setRemoveFaqAlert(false);
                            console.log("cancelled called");
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}

          </div>
        )
        )}        
      </div>
      <div className='w-[0%] lg:w-[45%]'></div>

    </div>
  )
}

export default Faqs