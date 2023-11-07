import React, { useState, useRef, useId } from "react";
import Select from "react-select";
import { singleSelect } from "../../../styles/ReactSelectStyles";
import ModelUploadNextButton from "./ModelUploadNextButton";
import CheckIcon from "../../../icons/CheckIcon";
import { useSelector, useDispatch } from "react-redux";
import {
  changeModelPrice,
  changeModelLicenseType,
  changeModelLicenseValue,
} from "../../../store/modelSlice";
import SectionLayout from "../../Layouts/SectionLayout";
import { useRouter } from "next/router";

const ModelUploadPricingAndLicense = ({
  modelId,
  changesToThePage,
  setChangesToThePage,
  handleModelSave,
  modelErrors,
}) => {
  const creativeCommonLicenseOptions = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];

  const dispatch = useDispatch();
  const router = useRouter();
  const model = useSelector((state) => state.model);
  console.log("model", model);
  // const modelAmountRef = useRef();
  // const ikarusLicenseInputRef = useRef();
  // const [selectedLicense, setselectedLicense] = useState();
  // const [creativeCommonsLicense, setCreativeCommonsLicense] = useState();

  return (
    <div className="flex flex-col gap-5">
      <SectionLayout
        heading="Pricing and License"
        subHeading="Name your model, upload an image, and establish model details"
      >
        <div className="grid grid-cols-2 gap-5">
          <div>
            <h3 className="font-semibold mb-2">Set amount *</h3>
            <div
              className={`${
                modelErrors?.basics && modelErrors?.basics?.modelName
                  ? "border-red-500"
                  : "border-borderGray"
              } flex items-center gap-2 border-[1px] h-10 rounded-[5px] px-2.5`}
            >
              <span>$</span>
              <input
                type="number"
                min={1}
                className="grow focus:outline-none"
                // ref={modelAmountRef}
                value={model.price ?? ""}
                onChange={(event) => {
                  if (!changesToThePage.pricingAndLicense.includes("price")) {
                    setChangesToThePage((current) => {
                      return {
                        ...current,
                        pricingAndLicense: [
                          ...current.pricingAndLicense,
                          "price",
                        ],
                      };
                    });
                  }
                  dispatch(changeModelPrice(event.target.value));
                }}
              />
            </div>
            {modelErrors?.pricingAndLicense &&
              modelErrors?.pricingAndLicense?.price && (
                <span className="text-[0.875rem] text-red-500 font-medium">
                  {modelErrors.pricingAndLicense.price}
                </span>
              )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-5">
          {/* TODO license will give error if filled */}
          <LicenseLayoutContainer
            heading="IKARUS 3D License"
            id="ikarusLicense"
            currentLicense={model.license}
            setLicense={(license) => {
              if (!changesToThePage.pricingAndLicense.includes("license")) {
                setChangesToThePage((current) => {
                  return {
                    ...current,
                    pricingAndLicense: [
                      ...current.pricingAndLicense,
                      "license",
                    ],
                  };
                });
              }
              dispatch(changeModelLicenseType(license));
            }}
          >
            <div className="flex items-center gap-2">
              <div className="h-4 w-4">
                <CheckIcon />
              </div>
              <span>Your files will be protected on our cloud</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4">
                <CheckIcon />
              </div>
              <span>No piracy</span>
            </div>
            <div className="flex items-center flex-wrap gap-4">
              <span className="whitespace-nowrap">
                No. of print allowed to a user *
              </span>
              <div className="grid grid-cols-[max-content_1fr] items-center justify-center gap-2">
                <span className="font-semibold">IKN - P -</span>
                <input
                  type="number"
                  min={1}
                  className="border-[1px] border-borderGray h-10 rounded-[5px] px-2.5 focus:outline-none w-[5rem]"
                  disabled={model.license?.type !== "ikarusLicense"}
                  // ref={ikarusLicenseInputRef}
                  value={
                    model.license?.type === "ikarusLicense"
                      ? model.license?.value
                      : ""
                  }
                  onChange={(event) => {
                    if (
                      !changesToThePage.pricingAndLicense.includes("license")
                    ) {
                      setChangesToThePage((current) => {
                        return {
                          ...current,
                          pricingAndLicense: [
                            ...current.pricingAndLicense,
                            "license",
                          ],
                        };
                      });
                    }
                    dispatch(changeModelLicenseValue(event.target.value));
                  }}
                />
              </div>
            </div>
          </LicenseLayoutContainer>
          <LicenseLayoutContainer
            heading="Creative Commons License"
            id="CCLicense"
            currentLicense={model.license}
            setLicense={(license) => dispatch(changeModelLicenseType(license))}
          >
            <div>
              <Select
                options={creativeCommonLicenseOptions}
                value={
                  model.license?.type === "CCLicense"
                    ? model.license?.value
                    : ""
                }
                styles={singleSelect}
                instanceId={useId()}
                onChange={(selectedCCLicense) => {
                  if (!changesToThePage.pricingAndLicense.includes("license")) {
                    setChangesToThePage((current) => {
                      return {
                        ...current,
                        pricingAndLicense: [
                          ...current.pricingAndLicense,
                          "license",
                        ],
                      };
                    });
                  }
                  dispatch(changeModelLicenseValue(selectedCCLicense));
                }}
                placeholder={"Select your Creative Commons License"}
                isDisabled={model.license?.type !== "CCLicense"}
              />
            </div>
          </LicenseLayoutContainer>
        </div>
      </SectionLayout>
      <ModelUploadNextButton
        pageTitle="Visibility"
        handleNextClick={() => {
          handleModelSave();
          router.push(`/my-nest/models/upload/${modelId}/visibility`);
        }}
      />
    </div>
  );
};

const LicenseLayoutContainer = (props) => {
  return (
    <div className="border-[1px] border-borderGray w-full rounded-[5px]">
      <div className="flex items-center gap-2 border-b-[1px] border-borderGray px-5 py-3">
        <input
          type="radio"
          id={props.id}
          name="license"
          value={props.id}
          className="w-5 h-5 appearance-none rounded-full border-[1.5px] border-borderGray checked:border-primary-brand checked:border-[5.5px]"
          onClick={() => props.setLicense(props.id)}
        />
        <label htmlFor={props.id} className="font-semibold">
          {props.heading}
        </label>
      </div>
      <div className="flex flex-col gap-5 px-5 py-5">{props.children}</div>
    </div>
  );
};

export default ModelUploadPricingAndLicense;
