import Link from "next/link";
import Image from "next/image";

const TierMilestoneCard = (props) => {
  return (
    <div className="flex flex-col gap-2 border-[1px] group rounded-[5px] overflow-hidden">
      <div
        className={`bg-gray-300 w-full aspect-[5/3] overflow-hidden relative`}
      >
        {props.coverImage && (
          <Image
            src={props.coverImage}
            className="w-full h-full object-cover object-center"
            alt="Campaign Cover Image"
            fill
          />
        )}
      </div>
      <div className="grid gap-3 bg-white p-4">
        <div className="text-lg font-medium text-left w-full truncate">
          {props.name}
        </div>
        <div className="flex items-center justify-start gap-3">
          <div className="h-8 w-8 relative rounded-full overflow-hidden">
            <Image
              src={props.ownerImage}
              fill
              className="rounded-full object-cover object-center"
            />
          </div>
          <span className="text-sm text-dark-neutral-700">
            by {props.ownerName}
          </span>
        </div>
        <div className="flex bg-light-neutral-100 p-2 rounded-[5px] justify-between w-full">
          <span className="text-sm text-dark-neutral-200">Models</span>
          <span className="text-uppercase font-semibold text-black">
            {props.modelsNumber}
          </span>
        </div>
        <div
          className="flex items-center justify-center h-9 w-full bg-primary-purple-500 text-white text-button-text-sm font-semibold shadow-xs rounded-[5px]"
          onClick={props.buttonClickHandler}
        >
          View all the models
        </div>
      </div>
    </div>
  );
};

export default TierMilestoneCard;
