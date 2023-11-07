import React, { useState } from "react";
import CancelIcon from "../icons/CancelIcon";
import ReportThankyou from '../icons/ReportThankyou'
import axios from "axios";

async function reportComment(contentId, payload){
  const res = await axios.post(process.env.NEXT_PUBLIC_COMMENT_REVIEWS_SERVICE +`/api/v1/comment/${contentId}/report`,payload,{
    withCredentials:true
  })
  return res.data
}
async function reportModel(contentId, payload){
  const res = await axios.post(process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE +`/api/v1/model/${contentId}/report`,payload,{
    withCredentials:true
  })
  return res.data
}

const ModelReportModal = (props) => {
  const [isModelReported, setIsModelReported] = useState(false);
  const [reporting,setReporting] = useState(false)
  const [reportReason,setReportReason] = useState("")


  const handleReport = () => {
    setReporting(true)
    const sendingForm = new FormData()
    if(!reportReason){
      sendingForm.append('text',"Empty Message")
    }else{
      sendingForm.append('text',reportReason)
    }
    if(props.reportFor==='comment'){
      reportComment(props.contentId,sendingForm).then(e=>{
          console.log("Report report->",e)
          setReporting(false)
          setIsModelReported(true);
      }).catch(e => {console.error(e);setReporting(false)})
      return
    }else if(props.reportFor==='model'){
      reportModel(props.contentId,sendingForm).then(e=>{
          console.log("Report report->",e)
          setReporting(false)
          setIsModelReported(true);
      }).catch(e => {console.error(e);setReporting(false)})
      return

    }
  };

  return (
    <div className="flex max-w-[40rem] bg-white p-14 rounded-[5px] relative top-[50%]">
      <div
        className="absolute top-5 right-5 h-5 w-5 cursor-pointer"
        onClick={props.closeModal}
      >
        <CancelIcon width={2} />
      </div>
      {isModelReported ? (
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-center">
            <div className="h-[166px] w-[166px]">
              <ReportThankyou />
            </div>
          </div>
          <div className="font-semibold text-[24px] text-center">Thank you for reporting this</div>
          <p className="text-center">
            We will get back to you super soon!
          </p>
          {props.reportFor==='model' && <button
            className="button-md-2 w-auto button-primary"
            onClick={props.closeModal}
          >
            Continue shopping
          </button>}
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <div className="font-semibold text-[24px] text-center">
            Report this {props.reportFor? props.reportFor:"model"}
          </div>
          <p>
            Please let us know if this {props.reportFor? props.reportFor:"model"} violates the community&apos;s code
            of conduct, or is not in line with Nest&apos;s Terms of Service. We
            take these reports very seriously.
          </p>
          <div className="flex flex-col gap-2">
            <label htmlFor="reportComment" className="font-semibold">
              Please share reason
            </label>
            <textarea
              id="reportComment"
              value={reportReason}
              onChange={(e)=>setReportReason(e.target.value)}
              textarea="Enter your reason"
              className="min-h-[10rem] border-[1px] border-borderGray resize-none rounded-[5px] p-3"
            />
          </div>
          <div className="flex items-center justify-end gap-8 font-semibold">
            <span className=" button-md-2 button-default w-auto cursor-pointer" onClick={props.closeModal}>
              Cancel
            </span>
            {!reporting
            ?<button
              className="button-md-2 button-primary w-auto"
              onClick={handleReport}
              >
                Report
              </button>
            :<i>Reporting...</i>}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelReportModal;
