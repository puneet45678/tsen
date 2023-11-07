import Check from "../icons/Check";
import CloseCrossWhite from "../icons/CloseCrossWhite";
import { useState } from "react";
import ArrowRight from "../icons/ArrowRight";

export default function DeleteAccountConfirmation() {
  const [deleteInput, setDeleteInput] = useState("");
  const requiredInput = "DELETE";
  const isButtonDisabled = deleteInput !== requiredInput;
  const handleInputChange = (event) => {
    setDeleteInput(event.target.value.toUpperCase());
  };
  return (
    <>
      <div className=" bg-light-neutral-50 px-[212px] py-12 font-sans text-dark-neutral-700">
        <div className="text-headline-md font-semibold font-sans ">
          Delete account
        </div>
        <div className=" text-headline-xs font-semibold mt-12">
          Here’s what happens next:
        </div>
        <div className="w-[1192px] h-[126px] border-[1px] rounded-[10px] font-sans border-warning-600 bg-warning-50 mt-[28px] p-6">
          <div className="text-xl font-semibold text-warning-700">
            Account Deactivation
          </div>
          <div className="text-md font-[400px] text-warning-600">
            Your account will be deactivated for a period of 7 days. During the
            deactivation period, if you change your mind, you can restore your
            account by simply logging in using your previous credentials.
          </div>
        </div>
        <form className="mt-6">
          <fieldset className="flex items-end">
            <input
              type="checkbox"
              id="confirm"
              name="confirmation"
              value="CONFIRM"
              required
              className="checkbox-default:checked checkbox-default checkbox-square w-6 h-6 mr-3"
            />
            <label htmlFor="confirm">Okay, I got it</label>
          </fieldset>

          <div className="mt-12 text-dark-neutral-700 text-headline-xs font-semibold">
            Do you want to download your data before deleting?
          </div>

          <div className="text-xl font-sans text-dark-neutral-200 font-[400] mt-6 flex items-center">
            <span className="h-[18px] w-[18px] bg-success-700 border rounded-[50%] ml-3 flex items-center justify-center">
              <Check />
            </span>
            <span className="ml-3">
              Your data includes all your uploaded 3D files and uploaded media
              (Images, Videos, GLBs).
            </span>
          </div>
          <div className="text-xl font-sans text-dark-neutral-200 font-[400] mt-1 flex items-center">
            <span className="h-[18px] w-[18px] bg-error-700 border rounded-[50%] ml-3 flex items-center justify-center">
              <CloseCrossWhite />
            </span>
            <span className="ml-3">
              Your data does not include- Your purchased 3D files. You should
              download them before you select account deletion.
            </span>
          </div>
          <fieldset className="flex items-end">
            <input
              type="checkbox"
              id="request_data"
              name="request"
              value="REQUEST"
              className="checkbox-default:checked checkbox-default checkbox-square w-6 h-6 mr-3 mt-6"
            />
            <label
              htmlFor="request_data"
              className="text-dark-neutral-700 text-lg font-medium font-sans mt-8 block"
            >
              Request my data before deleting my account.
            </label>
          </fieldset>
          <div className="text-md ml-9 text-dark-neutral-50 font-sans font-[400]">
            Within 48 hours, an email will be sent to you containing a link to
            download all of your data.
          </div>
          <div className="mt-12 font-sans text-headline-xs text-dark-neutral-700 font-semibold">
            Complete account deletion
          </div>
          <label
            htmlFor="delete"
            className="mt-3 text-xl font-[400] font-sans text-dark-neutral-200 block"
          >
            Please type the word &apos;DELETE&apos; below to confirm the account
            deletion
          </label>
          <fieldset className="input-lg  w-[342px]">
            <input
              type="text"
              id="delete"
              name="delete"
              required
              placeholder="Type delete here"
              onChange={handleInputChange}
              className="mt-6 placeholder:text-light-neutral-900 placeholder:text-md placeholder:font-medium border-[1px] border-light-neutral-700 shadow-xs "
            />
          </fieldset>
          <button
            className={`mt-12 text-button-text-md font-semibold ${
              isButtonDisabled
                ? "bg-light-neutral-700 cursor-not-allowed"
                : "bg-primary-purple-500"
            } text-white px-[18px] py-[11px] border rounded-[6px] flex items-center`}
            disabled={isButtonDisabled}
          >
            Continue : Deleting your account
            <span className="w-[20px] h-[20px] ml-[6px]">
              <ArrowRight />
            </span>
          </button>
        </form>
      </div>
    </>
  );
}
