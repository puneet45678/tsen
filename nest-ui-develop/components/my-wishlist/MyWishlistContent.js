import Link from "next/link";
import SearchIcon from "../../icons/SearchIcon";
import UploadIcon from "../../icons/UploadIcon";
import PlusNew from "../../icons/PlusNew";
import MobilePortfolio from "../../icons/MobilePortfolio";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

const MyNestPortfolioContent = (props) => {
  const router = useRouter();
  const user_current = useSelector((state) => state.user);
  console.log("user_current_portfolio: ", user_current);

  const handleCreatingNewPortfolio = () => {
    axios
      .post(
        `${process.env.NEXT_PUBLIC_USER_SERVICE_URL}/api/v1/portfolio`,
        {},
        { withCredentials: true }
      )
      .then((response) => {
        console.log(response.data);
        router.push(`/my-nest/portfolio/${response.data}/create`)
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="w-full h-full overflow-y-auto">
      <div className="flex flex-col w-full min-h-full py-[32px] gap-5">
        
        {props.empty ? (
          <div className="w-full grow flex flex-col gap-[107px] items-center justify-center ">
            <div className="relative w-[376.744px] h-[232px] ">
              <Image src={props.emptyImage} alt="Empty Image" fill />
            </div>
            <div className="flex flex-col gap-[32px]">
            <h6 className="text-dark-neutral-700 text-headline-sm font-[500]">{props.emptyHeading}</h6>
            <button className="px-[12px] py-[8px] bg-primary-purple-500 text-white rounded-[4px] shadow-xs w-fit mx-auto">Explore Campaigns</button>
            </div>
            
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
            <div className="flex flex-col gap-[24px]">
              
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
