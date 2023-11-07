import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import ArrowTopRightRectangle from "../../../icons/ArrowTopRightRectangle";
import LockIcon from "../../../icons/LockIcon";
import MoreIcon from "../../../icons/MoreIcon";
import moment from "moment";
import Image from "next/image";
import ModalCenter from "../../ModalCenter";
import CancelIcon from "../../../icons/CancelIcon";
import axios from "axios";

const MyModelCard = (props) => {
  const moreMenuRef = useRef();
  const moreIconRef = useRef();
  const dateToday = moment.utc(new Date());
  const modelDate = moment.utc(props.date);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [updatedDate, setUpdatedDate] = useState(
    dateToday.diff(modelDate, "years") > 1
      ? `${dateToday.diff(modelDate, "years")} years`
      : dateToday.diff(modelDate, "years") == 1
      ? `${dateToday.diff(modelDate, "years")} year`
      : dateToday.diff(modelDate, "months") > 1
      ? `${dateToday.diff(modelDate, "months")} months`
      : dateToday.diff(modelDate, "months") == 1
      ? `${dateToday.diff(modelDate, "months")} month`
      : dateToday.diff(modelDate, "days") > 1
      ? `${dateToday.diff(modelDate, "days")} days`
      : dateToday.diff(modelDate, "days") == 1
      ? `${dateToday.diff(modelDate, "days")} day`
      : dateToday.diff(modelDate, "hours") > 1
      ? `${dateToday.diff(modelDate, "hours")} hours`
      : dateToday.diff(modelDate, "hours") == 1
      ? `${dateToday.diff(modelDate, "hours")} hour`
      : dateToday.diff(modelDate, "minutes") > 1
      ? `${dateToday.diff(modelDate, "minutes")} minutes`
      : dateToday.diff(modelDate, "minutes") == 1
      ? `${dateToday.diff(modelDate, "minutes")} minute`
      : 0
  );

  const deleteModelHandler = () => {
    axios
      .post(
        `${process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE}/api/v1/models/${props.id}/discard?comment=`,
        {},
        { withCredentials: true }
      )
      .then((res) => {
        console.log("res", res);
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        moreMenuRef.current &&
        moreIconRef.current &&
        !moreMenuRef.current.contains(event.target) &&
        !moreIconRef.current.contains(event.target)
      ) {
        setShowMoreMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {showDeleteModal && (
        <ModalCenter closeModal={() => setShowDeleteModal(false)}>
          <div className="bg-white py-8 px-11 rounded-[5px] w-[40rem]">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[1.3rem]">
                Delete model ({props.modelName ?? ""})
              </span>
              <div
                className="w-5 h-5 cursor-pointer"
                onClick={() => setShowDeleteModal(false)}
              >
                <CancelIcon />
              </div>
            </div>
            <p className="mt-6 mb-16">
              Are you sure you want to delete this model? This action cannot be
              undone.
            </p>
            <div className="flex items-center justify-end gap-3 font-semibold text-[0.875rem]">
              <button
                className="flex items-center justify-center h-10 px-5 border-[1px] border-black rounded-[5px]"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="flex items-center justify-center h-10 px-5 bg-black text-white rounded-[5px]"
                onClick={deleteModelHandler}
              >
                Delete
              </button>
            </div>
          </div>
        </ModalCenter>
      )}
      <div className="flex flex-col gap-2 max-w-[18rem] border-[1px] group rounded-[5px]">
        <div
          className={`bg-gray-300 w-full aspect-[5/3] overflow-hidden relative`}
        >
          {props.coverImage && (
            <Image
              src={props.coverImage ?? ""}
              className="w-full h-full object-cover object-center"
              alt="Model Cover Image"
              fill
            />
          )}

          {props.visibility === "private" && (
            <div className="flex items-center justify-center gap-1 p-1 rounded-[5px] bg-primary-brand text-white absolute top-2 left-2 text-[10px]">
              <div className="w-4 h-4">
                <LockIcon />
              </div>
              <span>Private</span>
            </div>
          )}
          <div
            className={`opacity-0 group-hover:opacity-100 absolute top-2 right-2 bg-white p-1 rounded-[5px] duration-500 ease-in-out`}
          >
            <Link href={`/model/${props.id}`} className="h-4 w-4 block">
              <ArrowTopRightRectangle />
            </Link>
          </div>
        </div>

        <div className="grid gap-4 bg-white px-3 pb-4">
          <div className="font-medium text-left w-full truncate">
            {props.modelName}
          </div>
          <div className="flex text-[14px] bg-gray-200 p-2 rounded-sm justify-between w-full">
            <span>License</span>
          </div>
          {/* TODO complete the div */}
          <div className="flex items-center justify-between w-full relative">
            <div className="flex items-center gap-1 text-[0.65rem]">
              <span className="font-medium">
                {props.approvalStatus === "In_review"
                  ? "Reviewing."
                  : props.approvalStatus === "Mark_for_deletion"
                  ? "Marked for Deletion."
                  : props.approvalStatus === "Ready_for_deletion"
                  ? "Ready for Deletion."
                  : `${props.approvalStatus}.`}
              </span>
              {props.approvalStatus !== "Discarded" && (
                <span>
                  {" "}
                  {props.approvalStatus === "Draft"
                    ? "edited"
                    : props.approvalStatus === "In_review"
                    ? "sent"
                    : ""}{" "}
                  {updatedDate} ago
                </span>
              )}
            </div>
            <div
              className="w-5 h-5 cursor-pointer"
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              ref={moreIconRef}
            >
              <MoreIcon />
            </div>
            {showMoreMenu && (
              <div
                className="grid absolute z-10 top-full right-0 rounded-[5px] bg-white shadow-2xl min-w-[7rem]"
                ref={moreMenuRef}
              >
                {/* TODO which options according to the status */}
                <Link
                  href={`/my-nest/models/upload/${props.id}/upload-files`}
                  className="cursor-pointer py-2 px-2 text-left"
                >
                  Edit
                </Link>
                <div className="cursor-pointer py-2 px-2 text-left">Share</div>
                <div className="cursor-pointer py-2 px-2 text-left">
                  View Statistics
                </div>
                <div
                  className="cursor-pointer py-2 px-2 text-left"
                  onClick={() => setShowDeleteModal(true)}
                >
                  Delete
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default MyModelCard;
