import Link from "next/link";
import SearchIcon from "../../../icons/SearchIcon";
import UploadIcon from "../../../icons/UploadIcon";
import PlusNew from "../../../icons/PlusNew";
import MobilePortfolio from "../../../icons/MobilePortfolio";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

const MyNestPortfolioContent = (props) => {
  const router = useRouter();
  const user_current = useSelector((state) => state.user);
  console.log("user_current_portfolio: ", user_current);

  const handleCreatingNewPortfolio = () => {
    //done-works!
    axios
      .post(
        `${process.env.NEXT_PUBLIC_USER_SERVICE_URL}/api/v1/portfolio`,
        {},
        { withCredentials: true }
      )
      .then((response) => {
        console.log("------------->",response.data);
        router.push(`/my-nest/portfolio/${response.data}/create`);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="w-full h-full overflow-y-auto ">
      <div className="flex flex-col w-full min-h-full py-[37px] gap-5">
        <div className="flex justify-between items-end w-full">
          <h1 className="font-semibold text-headline-xs text-dark-neutral-700 ml-[32px]">
            {props.heading}
          </h1>
          <div className="flex gap-[12px]">
            <div
              onClick={() =>
                router.push(`/user/${user_current?.username}/about`)
              }
              className="flex border-[1px] border-light-neutral-600 items-center justify-center gap-[6px] px-5 h-10 rounded-[6px] bg-white text-dark-neutral-700 text-[12px] cursor-pointer shadow-xs  "
            >
              <div className="h-[18px] w-[18px] ">
                <MobilePortfolio />
              </div>
              <span className="font-[600] text-button-text-sm font-sans text-dark-neutral-700  my-[10px] mx-4">
                {" "}
                {props.PublicProfileCTA}
              </span>
            </div>
            <div
              onClick={() => {
                handleCreatingNewPortfolio();
              }}
              className="flex items-center justify-center gap-[6px] px-5 border-gray-400 h-10 rounded-[6px] bg-primary-purple-500 text-white text-[12px] cursor-pointer mr-[60px]  shadow-xs"
            >
              <div className="h-[18px] w-[18px]">
                <PlusNew />
              </div>
              <span className="font-[600] text-button-text-sm font-sans">
                {" "}
                {props.createLinkText}
              </span>
            </div>
          </div>
        </div>
        {props.empty ? (
          <div className="w-full grow flex flex-col items-center justify-center ">
            <div className="relative w-[376.744px] h-[212px] ">
              <Image src={props.emptyImage} alt="Empty Image" fill />
            </div>
            <h6 className="text-dark-neutral-700 text-headline-sm font-[500] font-sans mt-[32px]">
              {props.emptyHeading}
            </h6>

            <a className="text-lg font-[400] text-dark-neutral-50 font-sans mt-3">
             {props.emptyText}
            </a>
          </div>
        ) : (
          <>
            {/* <div className="flex flex-col gap-5"> */}
            {/* <div className="flex justify-between items-end w-full">
                <h1 className="font-medium text-[20px]">{props.heading}</h1>
                <div
                  onClick={props.handleCreate}
                  className="flex items-center justify-center gap-2 px-5 h-10 rounded-[10px] bg-primary-brand text-white text-[12px] cursor-pointer"
                >
                  <div className="h-4 w-4">
                    <UploadIcon />
                  </div>
                  {props.createLinkText}
                </div>
              </div> */}
            <div className="flex flex-col gap-[24px] ">
            <div className="border-[1px] ml-8 mr-[60px] border-light-neutral-500  mt-6 mb-6 items-center"></div>
              <div className="flex items-center justify-center gap-2 border-[1px] rounded-[5px] bg-white h-10 px-2 w-full max-w-[30rem] ml-8 text-light-neutral-900 text-sm shadow-xs">
                <div className="h-5 w-5 text-light-neutral-900 ">
                  <SearchIcon />
                </div>
                <input
                  type="text"
                  placeholder={props.searchText}
                  className="grow rounded-r-sm focus:outline-none w-full bg-transparent placeholder-gray-500 "
                  // onChange={handleSearchInputChange}
                />
              </div>
              <div>{props.children}</div>
            </div>
            {/* </div> */}
          </>
        )}
      </div>
    </div>
  );
};
export default MyNestPortfolioContent;
