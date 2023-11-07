import { useEffect, useState } from "react";
import BurgerMenu_Big from "../../icons/BurgerMenu_Big";
import LinkedinIcon from "../../icons/LinkedinIcon";
import InstagramIcon from "../../icons/InstagramIcon";
import TwitterIcon from "../../icons/TwitterIcon";
import MediumIcon from "../../icons/MediumIcon";
import FacebookIcon from "../../icons/FacebookIcon";
import CloseCross from "../../icons/CloseCross";
import SocialMediaIcon from "../../icons/SocialMediaIcon";

const MyProfileSocialLinksContainer = (props) => {
  const [inputValue, setInputValue] = useState("");
  const [showInput, setShowInput] = useState(false);

  return (
    <div className="flex items-center justify-between gap-12 h-[72px] bg-white border-[1px] border-light-neutral-600 rounded-[5px] p-6 shadow-xs max-w-[730px]">
      <div className="flex">
        {props.accountUrl && (
          <div className="h-6 w-6 text-dark-neutral-700 mr-[46px]">
            <BurgerMenu_Big />
          </div>
        )}

        <div className="h-6 w-6 text-dark-neutral-700">
          <SocialMediaIcon
            name={props.socialAccountTitle.toLowerCase()}
            defaultComp={props.socialIcon}
            BurgerMenu_Big={props.burgerIcon}
          />
        </div>
      </div>
      <div className="flex items-center justify-start gap-2 h-full grow">
        <span className="font-medium">{props.socialAccountTitle}</span>
      </div>
      {showInput ? (
        <div className="input-sm input-no-error flex items-center gap-6 rounded-[5px]">
          <input
            type="text"
            id={props.socialAccountTitle}
            placeholder="Enter Link"
            value={inputValue}
            onChange={(event) => {
              if (!props.changes) {
                props.setChanges(true);
              }
              setInputValue(event.target.value);
            }}
            className=""
          />
          <button
            onClick={async () => {
              try {
                if (props?.submitUrlHandler) {
                  const res = await props.submitUrlHandler(
                    props.socialAccountTitle,
                    inputValue
                  );
                  if (res) {
                    setShowInput(false);
                    props.setChanges(false);
                  }
                }
              } catch (err) {
                console.error("22err", err);
              }
            }}
            className="text-button-text-sm text-primary-purple-500 font-semibold"
          >
            Submit
          </button>
          <div
            className="cursor-pointer h-6 w-6 text-black"
            onClick={() => setShowInput(false)}
          >
            <CloseCross />
          </div>
        </div>
      ) : props?.accountUrl ? (
        <div className="flex-center gap-4">
          <span className="text-md text-dark-neutral-200">
            {props.accountUrl}
          </span>
          <div
            onClick={() => {
              if (props?.deleteUrlHandler) {
                props.deleteUrlHandler(props.socialAccountValue);
              }
            }}
            className="cursor-pointer h-6 w-6 text-black"
          >
            <CloseCross />
          </div>
        </div>
      ) : (
        <button
          className="button-xs button-primary w-fit"
          onClick={() => setShowInput(true)}
        >
          Add link
        </button>
      )}
    </div>
  );
};

export default MyProfileSocialLinksContainer;
