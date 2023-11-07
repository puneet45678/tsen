import React from 'react'
import { useState, useEffect } from "react";


const CampaignFAQ = (props) => {

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [delay, setDelay] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setDelay(true);
    }, 300);
  }, [currentQuestion])

  return (
    <>
      {/* <div className="flex justify-between">
        <div className="w-full mx-auto">
          <div className="flex flex-col-reverse tab:flex-row tab:justify-around"> */}
      <div className="py-4 tab:ml-12 w-[73%]">
        {props.faqsData.map((item, index) => (
          <div key={index} className={`${index === 0 ? 'border-t-[1px] border-b-[1px] bg-white' : ' bg-white border-b-[1px]'} ${currentQuestion === index ? "h-[10rem] tab:h-[9.5rem] z-10" : "h-[4rem] z-40 "} overflow-y-hidden rounded-[5px] px-3 relative transition-all ease-in duration-300`} onClick={() => { if (currentQuestion === index) setCurrentQuestion(-1); else setCurrentQuestion(index) }}>
            <div className="flex justify-between items-center">
              <h2 className={`pt-2 hover:text-black ${index === currentQuestion ? "bg-white" : ""} z-50 relative`}>{item.question}</h2>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="black" className={`w-6 transition-all duration-300 ease-linear h-6 pt-3 ${index === currentQuestion ? "rotate-180" : ""}`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
            <div className={`overflow-y-hidden ${currentQuestion === index && delay ? "translate-y-0 opacity-100" : "-translate-y-32 opacity-0"} transition-transform ease-out -z-20 duration-300 relative`}>
              <h3 className="pt-3 text-sm">{item.answer}</h3>
            </div>
          </div>
        ))}
      </div >
      {/* </div>
        </div>
      </div> */}



    </>
  )
}

export default CampaignFAQ