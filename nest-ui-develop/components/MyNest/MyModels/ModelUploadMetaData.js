import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addRemixValues,
  deleteRemixValues,
  changeRemixImageUrl,
} from "../../../store/modelSlice";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/router";
import TrashIcon from "../../../icons/TrashIcon";

const ModelUploadMetaData = ({ changesToThePage, setChangesToThePage }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const model = useSelector((state) => state.model);
  const [url, setUrl] = useState("");

  const handleLinkClick = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleAddLink = () => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_COMMON_SERVICE_URL}/meta-data?url=${url}`,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log("ress", res);
        if (!changesToThePage.advanceInformation.includes("remix")) {
          setChangesToThePage((current) => {
            return {
              ...current,
              advanceInformation: [...current.advanceInformation, "remix"],
            };
          });
        }
        dispatch(addRemixValues({ siteUrl: url, imageUrl: res.data }));
        setUrl("");
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const handleImageReplace = (event, index) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    axios
      .post(
        `${process.env.NEXT_PUBLIC_COMMON_SERVICE_URL}/picture?source=remixLink`,
        formData,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log("res", res);
        if (!changesToThePage.advanceInformation.includes("remix")) {
          setChangesToThePage((current) => {
            return {
              ...current,
              advanceInformation: [...current.advanceInformation, "remix"],
            };
          });
        }
        dispatch(changeRemixImageUrl({ index: index, imageUrl: res.data }));
        setUrl("");
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const handleRemixDelete = (index) => {
    if (!model?.remixes?.[index]?.imageUrl) return;
    if (model.remixes[index].imageUrl.includes("ucarecdn.com")) {
      axios
        .delete(
          `${process.env.NEXT_PUBLIC_COMMON_SERVICE_URL}/picture?image_url=${model.remixes[index].imageUrl}`,
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          console.log("res", res);
          if (!changesToThePage.advanceInformation.includes("remix")) {
            setChangesToThePage((current) => {
              return {
                ...current,
                advanceInformation: [...current.advanceInformation, "remix"],
              };
            });
          }
          dispatch(deleteRemixValues(index));
        })
        .catch((err) => {
          console.log("err", err);
        });
    } else {
      dispatch(deleteRemixValues(index));
    }
  };

  return (
    <div className="grid gap-3">
      <label htmlFor="metaDataUrl" className="font-medium">
        Add the sources of your design
      </label>
      <div className="flex gap-2 items-center border-[1px] border-borderGray h-10 w-full rounded-[5px] px-2.5 py-1">
        <input
          type="text"
          id="metaDataUrl"
          placeholder="Enter link or search the object"
          className="focus:outline-none grow"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
        />
        <button
          onClick={handleAddLink}
          className="text-[14px] text-white bg-black px-2 h-full rounded-[30px]"
        >
          + Add link
        </button>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {model?.remixes &&
          model.remixes.map((link, index) => (
            <div
              key={index}
              className={`${
                link.imageUrl ? "" : "bg-gray-400"
              } relative grid justify-items-center aspect-square cursor-pointer`}
            >
              {link.imageUrl && (
                <Image
                  src={link.imageUrl}
                  onClick={() => handleLinkClick(link.url)}
                  fill
                  className="object-cover"
                />
              )}
              <button
                className="absolute right-2 top-2 h-7 w-7 p-1 rounded-[5px] bg-black text-white"
                onClick={() => handleRemixDelete(index)}
              >
                <TrashIcon />
              </button>
              <input
                type="file"
                id={`remixImage-${index}`}
                className="hidden"
                onChange={(event) => handleImageReplace(event, index)}
              />
              <label
                htmlFor={`remixImage-${index}`}
                className="absolute bottom-2 py-1 px-3 rounded-[5px] bg-black text-white cursor-pointer"
              >
                Replace Image
              </label>
            </div>
          ))}
      </div>
    </div>
  );
};
export default ModelUploadMetaData;
