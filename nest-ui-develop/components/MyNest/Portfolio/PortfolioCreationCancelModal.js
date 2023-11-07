import React from "react";
import ModalTop from "../../ModalTop";
import CancelIcon from "../../../icons/CancelIcon";
import { useRouter } from "next/router";

export default function PortfolioCreationCancelModal(props) {
  const router = useRouter();



  return (
    <ModalTop>
      <div className="flex gap-3 px-5 py-7 bg-white max-w-[50vw] rounded-[5px]">
        <div className="grid gap-[12px] grow">
          <h3 className="text-dark-neutral-700 font-semibold text-headline-2xs">
            Cancel new project
          </h3>
          <div className="flex flex-col gap-[32px]">
            <p className="text-dark-neutral-50 font-[400]">
              Are you sure you want to cancel this project? This action cannot
              be <br /> undone.
            </p>
            <div className="block">
              <div className="float-right flex gap-[16px]">
                <button
                  className="border-[1px] border-black text-button-text-md font-[600] h-full px-[18px] py-[11px] rounded-[5px]"
                  onClick={props.cancelHandler}
                >
                  Discard & Close
                </button>
                <button
                  className="bg-primary-purple-500 text-button-text-md font-[600] border-[1px] text-white h-full px-[18px] py-[11px] rounded-[5px]"
                  // onClick={props.saveAsDraftHandler}
                  onClick={props.continueEditingHandler}
                >
                  Continue Editing
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="h-6 w-6 cursor-pointer" onClick={props.closeModal}>
          <CancelIcon />
        </div>
      </div>
    </ModalTop>
  );
}
