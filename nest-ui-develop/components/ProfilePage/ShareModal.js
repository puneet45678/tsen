import React, { useState } from "react";
import {
  DiscordIco,
  FacebookIco,
  InstagramIco,
  LinkedinIco,
  WhatsappIco,
} from "../../icons/SocialMediaIcons";
import CopyIcon from "../../icons/CopyIcon";

export default function ShareModal() {
    const [copied,setCopied] = useState(false) 
  function handleCopy() {
    navigator.clipboard.writeText(window.location.toString()).then(()=>{
        setCopied(true)
    })
  }
  return (
    <div className="w-[508px] h-[260px] flex flex-col items-center py-8 px-6">
      <div className="flex-1 text-[22px] font-semibold">
        {" "}
        {/*text pending*/}
        Share this profile
      </div>
      <div className="flex-1 flex flex-col gap-6 w-full">
        <div className="flex justify-center gap-2">
          <div className="p-[9px] shadow-xs rounded-md border border-light-neutral-600">
            <div className="h-[18px] w-[18px]">
              <InstagramIco />
            </div>
          </div>
          <div className="p-[9px] shadow-xs rounded-md border border-light-neutral-600">
            <div className="h-[18px] w-[18px]">
              <WhatsappIco />
            </div>
          </div>
          <div className="p-[9px] shadow-xs rounded-md border border-light-neutral-600">
            <div className="h-[18px] w-[18px]">
              <DiscordIco />
            </div>
          </div>
          <div className="p-[9px] shadow-xs rounded-md border border-light-neutral-600">
            <div className="h-[18px] w-[18px]">
              <LinkedinIco />
            </div>
          </div>
          <div className="p-[9px] shadow-xs rounded-md border border-light-neutral-600">
            <div className="h-[18px] w-[18px]">
              <FacebookIco />
            </div>
          </div>
        </div>

        <div className="flex rounded-[5px] border border-light-neutral-700 bg-light-neutral-50 justify-between items-center px-2 py-[5px] gap-2 shadow-sm  ">
          <input
            value={window.location.toString()}
            className="h-5 outline-1 bg-light-neutral-50 input-size-default grow overflow-x-scroll whitespace-nowrap no-scrollbar"
            placeholder="https://www.IkarusNest.com/artwork/m8589d"
          />
          <div className="button-primary button-sm w-auto h-[32px] hover:cursor-pointer">
            <div className="h-4 w-4">
              <CopyIcon />
            </div>
            <div onClick={handleCopy} className="whitespace-nowrap">
                {copied 
                ?"Copied"
                :"Copy Link"
                }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
