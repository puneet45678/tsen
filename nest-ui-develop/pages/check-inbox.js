import Image from "next/image";
import bg from "../public/images/bg.png";
import MailSent from "../icons/MailSent";

export default function CheckInbox() {
  return (
    <>
      <div className="flex justify-center items-center">
        <div
          className="bg-[#FFF]  border-[1px] rounded-[10px] border-light-neutral-700 absolute z-10 w-[1496px] h-[900px]
        "
        >
          <div className="flex justify-center items-center mt-[194px] w-[147.696] h-[147.696] shrink-0 ">
            <MailSent />
          </div>
          {/* inner conatiner */}
          <div className="flex flex-col items-center mt-12">
            <div className="text-dark-neutral-700 font-sans block text-[36px] font-bold leading-[44px] tracking-[-0.72px] text-center gap-12 w-[282px] h-[44px]">
              Check your inbox
            </div>
            <div className="text-md mt-4 font-medium w-[496px] h-[22px]">
              <span className="text-dark-neutral-200">
                We sent a reset password email to
              </span>
              <span className="text-primary-purple-600 ml-1">
                jane.smith.mobbin@gmail.com.
              </span>
              <div className="mt-[32px] text-center text-dark-neutral-400">
                Please click the link to set your new password
              </div>
            </div>
            <div className="text-dark-neutral-400 text-center mt-[100px] text-xl font-medium hover:underline ">
              Not receive the link?
            </div>
            <div>
              <span className="text-dark-neutral-400 w-[423px] h-[24px] text-center text-lg font-normal mt-3">
                You can resend the email
              </span>
              <span className=" ml-1 text-primary-purple-500">0:59</span>
            </div>
          </div>
        </div>
        <Image src={bg} className="h-[100%] w-[100%] absolute top-0 left-0" />
      </div>
    </>
  );
}
