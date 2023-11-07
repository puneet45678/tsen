import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { changeStoryFaqs } from '../../../store/campaignSlice';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

const Faqs = (props) => {

    const dispatch = useDispatch();    
    const [ selectedFaq, setSelectedFaq ] = useState(-1)
    const [faqs, setFaqs] = useState([{
        question:"",
        answer:""
    }]);
    const [newFaq, setNewFaq] = useState({
        question:"",
        answer:""
    });
    const [showFaqInput,setShowFaqInput] = useState(false);

    const handleFaqAddition = async () =>{
                
        if(newFaq.question !== "" && newFaq.answer !== ""){
            
            const timestamp = Date.now();
            let faqId;
            let temp = [...props.faqs];

            if(typeof newFaq.faqId !== 'undefined'){                
                faqId = newFaq.faqId;
                for(var i = 0; i < temp.length; i++)
                    if(typeof temp[i].faqId !== 'undefined' && temp[i].faqId == newFaq.faqId)
                        temp[i] = newFaq;
            }
            else{                
                faqId = uuidv4({ msecs: timestamp });
                temp.push({...newFaq, faqId:faqId});
            }            

            try {                
                await axios.put(`${process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE}/api/v1/campaigns/${props.campaignId}/create-update-faq`,temp,{
                    withCredentials: true
                });                                   
                                
                dispatch(changeStoryFaqs(temp));                
                setNewFaq({
                    question:"",
                    answer:""
                })

            }
            catch (e){
                console.log(e);
            }
            
        }
    }

    const handleFaqDeletion = async (index, faqId) =>{
        
        try{
            await axios.delete(`${process.env.NEXT_PUBLIC_CAMPAIGN_SERVER}/api/v1/campaigns/${props.campaignId}/faqs/${faqId}`,{
                withCredentials: true
            });
            let temp = [...props.faqs];
            temp.splice(index, 1);

            dispatch(changeStoryFaqs(temp));
            
        }        
        catch(e){
            console.log(e)
        }
    }  
    
    const handleFaqUpdation = (index, faqId, faqQuestion, faqAnswer) =>{
        setNewFaq({
            faqId:faqId,
            question: faqQuestion,
            answer: faqAnswer
        });  
        
        handleFaqAddition();
    }

  return (
    <div className='flex flex-col gap-8 items-start w-full'>
        <button className='text-[#171717] font-[500]' onClick={()=>setShowFaqInput(true)}>
            + Add more Faqs
        </button>
        {
            showFaqInput 
            ? 
                <div className='rounded-md w-full bg-[#FAFAFA] flex flex-col gap-8 px-8 py-6'>
                    <div className='flex flex-col gap-4'>
                        <p>Question</p>
                        <input onChange={(e)=>setNewFaq({...newFaq, question:e.target.value})} value={newFaq.question} className='h-10 p-2 focus:outline-none border-[1.5px] border-borderGrayColor rounded-md'></input>
                    </div>
                    <div className='flex flex-col gap-4'>
                        <p>Answer</p>
                        <textarea onChange={(e)=>setNewFaq({...newFaq, answer:e.target.value})} value={newFaq.answer} rows={6} className='p-2 focus:outline-none border-[1.5px] border-borderGrayColor rounded-md'></textarea>
                    </div>
                    <div className='w-full flex justify-end gap-2'>
                        <button className='py-2 px-4 rounded-md' onClick={()=>setShowFaqInput(false)}>Cancel</button>
                        <button className='bg-[#171717] py-2 px-4 rounded-md text-white' onClick={handleFaqAddition}>Done</button>
                    </div>
                </div>
            : <></>
        }
        <div className='flex flex-col gap-4 w-full'>
            {
                typeof props.faqs !== 'undefined' && props.faqs.length > 0 ? props.faqs.map((faq,index)=>(
                    <div className='flex justify-start gap-4'>
                        <div className='w-full border-[1.5px] border-borderGrayColor rounded-md'>
                            <div className={`p-2 flex justify-between items-center cursor-pointer ${selectedFaq === index ? 'border-b-[1.5px] border-borderGrayColor':''} rounded-md h-12`} onClick={()=>{ selectedFaq === index ? setSelectedFaq(-1) : setSelectedFaq(index)}}>
                                <h3>
                                    { faq.question }
                                </h3>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" class="w-6 h-6">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                </svg>
                            </div>
                            <div className={`${selectedFaq === index ? 'h-20 opacity-100 p-2':'opacity-0 h-0'} rounded-md transition-all ease-out duration-500`}>
                                <h3>
                                    { faq.answer }
                                </h3>
                            </div>
                        </div>
                        <button className='bg-[#171717] p-2 w-10 h-10 rounded-md flex justify-center items-center mt-1' onClick={()=>handleFaqUpdation(index, faq.faqId, faq.question, faq.answer)}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" className="w-8 h-8 stroke-white">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>
                        </button>
                        <button className='bg-[#171717] p-2 w-10 h-10 rounded-md flex justify-center items-center mt-1' onClick={()=>handleFaqDeletion(index, faq.faqId)}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" className="w-8 h-8 stroke-white">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                        </button>
                    </div>
                ))
                :''
            }
        </div>
    </div>
  )
}

export default Faqs