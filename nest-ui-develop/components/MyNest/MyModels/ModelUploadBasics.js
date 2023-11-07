import { useState, useId, useEffect } from "react";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import ModelUploadNextButton from "./ModelUploadNextButton";
import {
  singleSelect,
  multiSelect,
  singleSelectError,
  multiSelectError,
} from "../../../styles/ReactSelectStyles";
import { useSelector, useDispatch } from "react-redux";
import {
  changeModelName,
  changeModelCategory,
  changeModelDescription,
  changeModelTags,
} from "../../../store/modelSlice";
import dynamic from "next/dynamic";
import axios from "axios";
import SectionLayout from "../../Layouts/SectionLayout";
import { useRouter } from "next/router";
const QuillEditor = dynamic(() => import("../../QuillEditor"), {
  ssr: false,
});

const ModelUploadBasics = ({
  modelId,
  changesToThePage,
  setChangesToThePage,
  handleModelSave,
  modelErrors,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const model = useSelector((state) => state.model);
  // const [name, setName] = useState("");
  // const [category, setCategory] = useState();
  // const [description, setDescription] = useState();
  const [tags, setTags] = useState();
  const [selectedTags, setSelectedTags] = useState([]);

  const categoryOptions = [
    { value: "Architecture", label: "Architecture" },
    { value: "Vehicle", label: "Vehicle" },
    { value: "Fanstasy", label: "Fanstasy" },
    { value: "Furniture", label: "Furniture" },
    { value: "Action Figures", label: "Action Figures" },
    { value: "Gadgets", label: "Gadgets" },
  ];

  const handleCreateNewTag = (newTagValue) => {
    console.log("here", newTagValue);
    const newTag = {
      label: newTagValue,
      value: newTagValue.toLowerCase().replace(/\W/g, ""),
    };
    axios
      .post(
        `${
          process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE
        }/api/v1/tags?value=${newTagValue}&label=${newTagValue
          .toLowerCase()
          .replace(/\W/g, "")}`,
        {},
        { withCredentials: true }
      )
      .then((res) => {
        console.log("res", res);
        if (!changesToThePage.basics.includes("tags")) {
          setChangesToThePage((current) => {
            return {
              ...current,
              basics: [...current.basics, "tags"],
            };
          });
        }
        dispatch(
          changeModelTags([...model.tags, { ...newTag, _id: res.data }])
        );
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE}/api/v1/tags`, {
        withCredentials: true,
      })
      .then((res) => {
        console.log("res", res);
        setTags(res.data);
      })
      .catch((err) => {
        console.log("err", err);
      });
  }, []);
  console.log("selectedTags", selectedTags);
  return (
    <div className="flex flex-col gap-5">
      <SectionLayout
        heading="Basics"
        subHeading="Establish basic details of your model"
      >
        <div className="flex gap-3">
          <div className="grow">
            <h3 className="font-semibold mb-2">Model Name *</h3>
            <input
              type="text"
              className={`${
                modelErrors?.basics && modelErrors?.basics?.modelName
                  ? "border-red-500"
                  : "border-borderGray"
              } border-[1px] h-10 w-full rounded-[5px] px-2.5 focus:outline-none`}
              value={model.modelName}
              onChange={(event) => {
                if (event.target.value.length <= 250) {
                  if (!changesToThePage.basics.includes("name")) {
                    setChangesToThePage((current) => {
                      return {
                        ...current,
                        basics: [...current.basics, "name"],
                      };
                    });
                  }
                  dispatch(changeModelName(event.target.value));
                }
              }}
            />
            {modelErrors?.basics && modelErrors?.basics?.modelName && (
              <span className="text-[0.875rem] text-red-500 font-medium">
                {modelErrors.basics.modelName}
              </span>
            )}
          </div>
          <div className="w-[300px]">
            <h3 className="font-semibold mb-2">Category *</h3>
            <Select
              options={categoryOptions}
              value={
                model?.category
                  ? {
                      label: model.category,
                      value: model.category.toLowerCase(),
                    }
                  : ""
              }
              styles={
                modelErrors?.basics && modelErrors?.basics?.category
                  ? singleSelectError
                  : singleSelect
              }
              instanceId={useId()}
              onChange={(selectedCategory) => {
                if (!changesToThePage.basics.includes("category")) {
                  setChangesToThePage((current) => {
                    return {
                      ...current,
                      basics: [...current.basics, "category"],
                    };
                  });
                }
                dispatch(changeModelCategory(selectedCategory.label));
              }}
              placeholder={"Select your Category"}
            />
            {modelErrors?.basics && modelErrors?.basics?.category && (
              <span className="text-[0.875rem] text-red-500 font-medium">
                {modelErrors.basics.category}
              </span>
            )}
          </div>
        </div>
        <div className="w-full">
          <h3 className="font-semibold mb-2">Description *</h3>
          <div className="max-w-[1000px] text-[10px]">
            <QuillEditor
              value={model.description}
              onChange={(value) => {
                if (!changesToThePage.basics.includes("description")) {
                  setChangesToThePage((current) => {
                    return {
                      ...current,
                      basics: [...current.basics, "description"],
                    };
                  });
                }
                dispatch(changeModelDescription(value));
              }}
              placeholder={""}
              maxLength={20000}
            />
          </div>
          {modelErrors?.basics && modelErrors?.basics?.description && (
            <span className="text-[0.875rem] text-red-500 font-medium">
              {modelErrors.basics.description}
            </span>
          )}
        </div>
        <div>
          <h3 className="font-semibold mb-2">Tags *</h3>
          <CreatableSelect
            isMulti
            options={tags}
            styles={
              modelErrors?.basics && modelErrors?.basics?.tags
                ? multiSelectError
                : multiSelect
            }
            value={model.tags}
            onChange={(newTags) => {
              console.log("newTag", newTags);
              if (model.tags.length < 5) {
                if (!changesToThePage.basics.includes("tags")) {
                  setChangesToThePage((current) => {
                    return {
                      ...current,
                      basics: [...current.basics, "tags"],
                    };
                  });
                }
                dispatch(changeModelTags(newTags));
              }
            }}
            onCreateOption={(tag) => {
              console.log("tag", tag);
              if (model.tags.length < 5) {
                handleCreateNewTag(tag);
              }
            }}
          />
          {modelErrors?.basics && modelErrors?.basics?.tags && (
            <span className="text-[0.875rem] text-red-500 font-medium">
              {modelErrors.basics.tags}
            </span>
          )}
        </div>
      </SectionLayout>
      <ModelUploadNextButton
        pageTitle="Pricing and Liscence"
        handleNextClick={() => {
          handleModelSave();
          router.push(`/my-nest/models/upload/${modelId}/pricing-and-license`);
        }}
      />
    </div>
  );
};
export default ModelUploadBasics;
