import Link from "next/link";
import SearchIcon from "../../icons/SearchIcon";
import Image from "next/image";

const MyNestContentWithCreateButton = (props) => {
  return (
    <div className="w-full h-full overflow-y-auto">
      <div className="flex flex-col w-full min-h-full">
        <div className="flex justify-between items-start mx-8 pt-8 pb-6 border-b-[1px] border-light-neutral-500">
          <h1 className="font-semibold text-headline-sm text-dark-neutral-700">
            {props.heading}
          </h1>
          <button
            className="flex items-center justify-center gap-[6px] h-10 py-[10px] px-4 bg-primary-purple-500 text-white rounded-[5px] text-button-text-sm font-semibold"
            onClick={props.handleCreate}
          >
            <Image src="/SVG/Upload_White.svg" height={18} width={18} />
            <span>{props.createLinkText}</span>
          </button>
        </div>
        {props.empty ? (
          <div className="w-full grow flex flex-col items-center justify-center gap-8 p-8">
            <div className="relative w-96 h-80">
              <Image src={props.emptyImage} alt="Empty Image" fill />
            </div>
            <div className="flex flex-col items-center justify-center gap-3">
              <h6 className="text-headline-sm font-medium">
                {props.emptyHeading}
              </h6>
              <span className="text-lg text-dark-neutral-50">
                {props.emptyText}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6 pt-6 px-8 pb-8">
            {props.children}
          </div>
        )}
      </div>
    </div>
  );
};
export default MyNestContentWithCreateButton;
