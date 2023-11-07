import { useState } from "react";
import Link from "next/link";
import ModelUploadNextButton from "./ModelUploadNextButton";
import { useSelector, useDispatch } from "react-redux";
import { changeModelVisibility } from "../../../store/modelSlice";
import SectionLayout from "../../Layouts/SectionLayout";
import { useRouter } from "next/router";

const ModelUploadVisibility = ({
  modelId,
  changesToThePage,
  setChangesToThePage,
  handleModelSave,
  modelErrors,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const model = useSelector((state) => state.model);
  console.log("model", model);
  // const [selectedVisibility, setSelectedVisibility] = useState("private");

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2 w-full">
        {modelErrors?.visibility && modelErrors?.visibility?.visibility && (
          <div className="bg-backgroundGrayLight border-[1px] border-borderGray p-5 font-medium">
            {modelErrors.visibility.visibility}
          </div>
        )}
        <SectionLayout
          heading="Visibility"
          subHeading="Name your model, upload an image, and establish model details"
        >
          <div className="flex flex-col gap-5">
            <ViewLayoutContainer
              heading="Public"
              id="public"
              description="After your model is approved, it will be visible everywhere on the platform"
              link=""
              currentVisibility={model.visibility}
              setCurrentVisibility={(visibility) => {
                if (!changesToThePage.visibility.includes("visibility")) {
                  setChangesToThePage((current) => {
                    return {
                      ...current,
                      visibility: [...current.visibility, "visibility"],
                    };
                  });
                }
                dispatch(changeModelVisibility(visibility));
              }}
            />
            <ViewLayoutContainer
              heading="Private"
              id="private"
              description="After your model is approved, it will be visible only in places you select"
              link=""
              currentVisibility={model.visibility}
              setCurrentVisibility={(visibility) => {
                if (!changesToThePage.visibility.includes("visibility")) {
                  setChangesToThePage((current) => {
                    return {
                      ...current,
                      visibility: [...current.visibility, "visibility"],
                    };
                  });
                }
                dispatch(changeModelVisibility(visibility));
              }}
            />
          </div>
        </SectionLayout>
      </div>
      <ModelUploadNextButton
        pageTitle="Advance Information"
        handleNextClick={() => {
          handleModelSave();
          router.push(`/my-nest/models/upload/${modelId}/advance-information`);
        }}
      />
    </div>
  );
};

const ViewLayoutContainer = (props) => {
  return (
    <div className="flex gap-3 w-full">
      <div className="pt-[0.12rem]">
        <input
          type="radio"
          id={props.id}
          name="license"
          value={props.id}
          className="w-5 h-5 appearance-none rounded-full border-[1.5px] border-borderGray checked:border-primary-brand checked:border-[5.5px]"
          checked={props.currentVisibility === props.id}
          onChange={() => props.setCurrentVisibility(props.id)}
        />
      </div>
      <div className="flex flex-col gap-3 grow">
        <div className="flex gap-3">
          <label htmlFor={props.id} className="font-semibold">
            {props.heading}
          </label>
          <p>
            (See our Guidelines for{" "}
            <Link href={props.link} className="underline">
              {props.id} content
            </Link>
            )
          </p>
        </div>
        <p>{props.description}</p>
      </div>
    </div>
  );
};

export default ModelUploadVisibility;
