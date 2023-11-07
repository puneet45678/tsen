import Link from "next/link";
import ArrowTopRightRectangle from "../../../icons/ArrowTopRightRectangle";
import Image from "next/image";

const CampaignCard = (props) => {
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
        <div
          className={`opacity-0 group-hover:opacity-100 absolute top-2 right-2 bg-white p-1 rounded-[5px] duration-500 ease-in-out`}
        >
          <Link href={`/campaign/${props.id}`} className="h-4 w-4 block">
            <ArrowTopRightRectangle />
          </Link>
        </div>
      </div>
      <div className="grid gap-3 bg-white p-4">
        <div className="text-lg font-medium text-left w-full truncate">
          {props.campaignName}
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
          <div className="">
            <span className="text-uppercase text-dark-neutral-700 font-semibold">
              {props.tiersNumber}{" "}
            </span>
            <span className="text-sm text-dark-neutral-200">
              {props.tiersNumber > 1 ? "Tiers" : "Tier"}
            </span>
          </div>
          <div className="">
            <span className="text-uppercase text-dark-neutral-700 font-semibold">
              {props.unlockedMilestonesNumber}{" "}
            </span>
            <span className="text-sm text-dark-neutral-200">
              {props.unlockedMilestonesNumber > 1 ? "Milestones" : "Milestone"}
            </span>
          </div>
        </div>
        <div
          className="flex items-center justify-center h-9 w-full bg-primary-purple-500 text-white text-button-text-sm font-semibold shadow-xs rounded-[5px]"
          onClick={props.buttonClickHandler}
        >
          View Files
        </div>
      </div>
    </div>
  );
};

export default CampaignCard;
