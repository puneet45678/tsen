import { useRouter } from "next/router";
import HalfArrowRightIcon from "../../../icons/HalfArrowRightIcon";

const ModelUploadNextButton = ({ pageTitle, handleNextClick }) => {
  const router = useRouter();

  return (
    <div className="flex items-end justify-end">
      <div
        onClick={handleNextClick}
        className="flex items-center gap-2 cursor-pointer bg-primary-brand text-white h-10 px-5 rounded-[5px]"
      >
        <span>Next : {pageTitle}</span>
        <div className="h-4 w-4">
          <HalfArrowRightIcon />
        </div>
      </div>
    </div>
  );
};
export default ModelUploadNextButton;
