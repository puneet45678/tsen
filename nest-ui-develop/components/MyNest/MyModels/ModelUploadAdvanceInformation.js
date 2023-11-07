import { useState, useId, useRef, useEffect } from "react";
import Select from "react-select";
import { singleSelect } from "../../../styles/ReactSelectStyles";
import { useSelector, useDispatch } from "react-redux";
import {
  changeModelPrintingInformation,
  changeModelMaterialType,
  changeModelMaterialQuantity,
  changeModelDimensionsLength,
  changeModelDimensionsWidth,
  changeModelDimensionsDepth,
  changeModelMinimumScale,
  changeModelMaximumScale,
  changeModelHoursToPrint,
  changeModelMinutesToPrint,
  changeModelSupportValue,
  changeModelNSFWValue,
  changeModelRemixValue,
} from "../../../store/modelSlice";
import dynamic from "next/dynamic";
import ModelUploadMetaData from "./ModelUploadMetaData";
import SectionLayout from "../../Layouts/SectionLayout";
const QuillEditor = dynamic(() => import("../../QuillEditor"), {
  ssr: false,
});

const ModelUploadAdvanceInformation = ({
  changesToThePage,
  setChangesToThePage,
  modelErrors,
}) => {
  const materialTypes = [
    { value: "Plastic", label: "Plastic" },
    { value: "Resin", label: "Resin" },
    { value: "Composite Material", label: "Composite Material" },
    { value: "Ceramic", label: "Ceramic" },
  ];

  const dispatch = useDispatch();
  const model = useSelector((state) => state.model);
  console.log("model", model);
  const materialQuantity = useRef();
  const modelLengthDimension = useRef();
  const modelWidthDimension = useRef();
  const modelDepthDimension = useRef();
  const modelMinimumScale = useRef();
  const modelMaximumScale = useRef();
  const minimumTimeToPrintHours = useRef();
  const minimumTimeToPrintMinutes = useRef();
  const [isRemix, setIsRemix] = useState();

  useEffect(() => {
    setIsRemix(model?.remixes ? model.remixes.length > 0 : false);
  }, [model.remixes]);

  return (
    <div className="flex flex-col gap-5">
      <SectionLayout
        heading="Printing Information"
        subHeading="Name your model, upload an image, and establish model details"
      >
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold">Printing details ( optional )</h3>
            <div className="max-w-[1000px]">
              <QuillEditor
                value={model.printDetails}
                onChange={(value) => {
                  if (
                    !changesToThePage.advanceInformation.includes(
                      "printingDetails"
                    )
                  ) {
                    setChangesToThePage((current) => {
                      return {
                        ...current,
                        advanceInformation: [
                          ...current.advanceInformation,
                          "printingDetails",
                        ],
                      };
                    });
                  }
                  dispatch(changeModelPrintingInformation(value));
                }}
                placeholder={""}
                maxLength={20000}
                container={[
                  [{ header: [1, 2, 3, 4, 5, 6, false] }],
                  [{ font: [] }],
                  [
                    "bold",
                    "italic",
                    "underline",
                    "strike",
                    "blockquote",
                    "code-block",
                  ],
                  [{ script: "sub" }, { script: "super" }],
                  [{ color: [] }, { background: [] }],
                  [
                    { list: "ordered" },
                    { list: "bullet" },
                    { indent: "-1" },
                    { indent: "+1" },
                  ],
                  ["link"],
                  ["clean"],
                  [{ align: [] }],
                ]}
              />
            </div>
            {modelErrors?.advanceInformation &&
              modelErrors?.advanceInformation?.printingDetails && (
                <span className="text-[0.875rem] text-red-500 font-medium">
                  {modelErrors.advanceInformation.printingDetails}
                </span>
              )}
          </div>
          <div className="grid grid-cols-2 gap-4 gap-y-5">
            <div className="flex flex-col gap-3">
              {/* TODO gives error if selected */}
              <h3 className="font-semibold">Material Type ( optional )</h3>
              <Select
                options={materialTypes}
                value={
                  model?.printMaterial
                    ? {
                        label: model.printMaterial,
                        value: model.printMaterial.toLowerCase(),
                      }
                    : ""
                }
                onChange={(material) => {
                  if (
                    !changesToThePage.advanceInformation.includes(
                      "materialType"
                    )
                  ) {
                    setChangesToThePage((current) => {
                      return {
                        ...current,
                        advanceInformation: [
                          ...current.advanceInformation,
                          "materialType",
                        ],
                      };
                    });
                  }
                  dispatch(changeModelMaterialType(material.label));
                }}
                styles={singleSelect}
                instanceId={useId()}
                placeholder={"Select the Material Type"}
              />
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="font-semibold">Material quantity ( optional )</h3>
              <div className="flex gap-2 items-center border-[1px] border-borderGray h-10 w-full rounded-[5px] px-2.5">
                <input
                  type="number"
                  min={1}
                  value={model.materialQuantity ?? ""}
                  onChange={(event) => {
                    if (
                      !changesToThePage.advanceInformation.includes(
                        "materialQuantity"
                      )
                    ) {
                      setChangesToThePage((current) => {
                        return {
                          ...current,
                          advanceInformation: [
                            ...current.advanceInformation,
                            "materialQuantity",
                          ],
                        };
                      });
                    }
                    dispatch(
                      changeModelMaterialQuantity(parseInt(event.target.value))
                    );
                  }}
                  className="grow focus:outline-none"
                  placeholder="eg. 600"
                  ref={materialQuantity}
                />
                <span>grams</span>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="font-semibold">Model dimension ( optional )</h3>
              <div className="grid grid-cols-3 gap-2">
                <div className="flex gap-2 items-center border-[1px] border-borderGray h-10 rounded-[5px] px-2.5">
                  <input
                    type="number"
                    className="grow overflow-hidden focus:outline-none"
                    placeholder="length"
                    ref={modelLengthDimension}
                    value={model?.dimensions?.modelLength ?? ""}
                    onChange={(event) => {
                      if (
                        !changesToThePage.advanceInformation.includes(
                          "dimensions"
                        )
                      ) {
                        setChangesToThePage((current) => {
                          return {
                            ...current,
                            advanceInformation: [
                              ...current.advanceInformation,
                              "dimensions",
                            ],
                          };
                        });
                      }
                      dispatch(changeModelDimensionsLength(event.target.value));
                    }}
                  />
                  <span>cm</span>
                </div>
                <div className="flex gap-2 items-center border-[1px] border-borderGray h-10 rounded-[5px] px-2.5">
                  <input
                    type="number"
                    className="grow overflow-hidden focus:outline-none"
                    placeholder="width"
                    ref={modelWidthDimension}
                    value={model?.dimensions?.modelWidth ?? ""}
                    onChange={(event) => {
                      if (
                        !changesToThePage.advanceInformation.includes(
                          "dimensions"
                        )
                      ) {
                        setChangesToThePage((current) => {
                          return {
                            ...current,
                            advanceInformation: [
                              ...current.advanceInformation,
                              "dimensions",
                            ],
                          };
                        });
                      }
                      dispatch(changeModelDimensionsWidth(event.target.value));
                    }}
                  />
                  <span>cm</span>
                </div>
                <div className="flex gap-2 items-center border-[1px] border-borderGray h-10 rounded-[5px] px-2.5">
                  <input
                    type="number"
                    className="grow overflow-hidden focus:outline-none"
                    placeholder="depth"
                    ref={modelDepthDimension}
                    value={model?.dimensions?.modelHeight ?? ""}
                    onChange={(event) => {
                      if (
                        !changesToThePage.advanceInformation.includes(
                          "dimensions"
                        )
                      ) {
                        setChangesToThePage((current) => {
                          return {
                            ...current,
                            advanceInformation: [
                              ...current.advanceInformation,
                              "dimensions",
                            ],
                          };
                        });
                      }
                      dispatch(changeModelDimensionsDepth(event.target.value));
                    }}
                  />
                  <span>cm</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="font-semibold">Define Scale ( optional )</h3>
              <div className="flex gap-2">
                <input
                  type="number"
                  className="border-[1px] border-borderGray h-10 w-1/2 rounded-[5px] px-2.5 focus:outline-none"
                  placeholder="Minimum value"
                  ref={modelMinimumScale}
                  value={model?.scale?.minScale ?? ""}
                  onChange={(event) => {
                    if (
                      !changesToThePage.advanceInformation.includes("scale")
                    ) {
                      setChangesToThePage((current) => {
                        return {
                          ...current,
                          advanceInformation: [
                            ...current.advanceInformation,
                            "scale",
                          ],
                        };
                      });
                    }
                    dispatch(changeModelMinimumScale(event.target.value));
                  }}
                />
                <input
                  type="number"
                  className="border-[1px] border-borderGray h-10 w-1/2 rounded-[5px] px-2.5 focus:outline-none"
                  placeholder="Maximum value"
                  ref={modelMaximumScale}
                  value={model?.scale?.maxScale ?? ""}
                  onChange={(event) => {
                    if (
                      !changesToThePage.advanceInformation.includes("scale")
                    ) {
                      setChangesToThePage((current) => {
                        return {
                          ...current,
                          advanceInformation: [
                            ...current.advanceInformation,
                            "scale",
                          ],
                        };
                      });
                    }
                    dispatch(changeModelMaximumScale(event.target.value));
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="font-semibold">
                Minimum time to print ( optional )
              </h3>
              <div className="flex gap-2">
                <div className="flex items-center border-[1px] border-borderGray rounded-[5px] h-10 px-2.5 grow">
                  <input
                    type="number"
                    className="w-full focus:outline-none"
                    placeholder="In hours"
                    min={0}
                    max={24}
                    ref={minimumTimeToPrintHours}
                    value={model?.timetoPrint?.hours ?? ""}
                    onChange={(event) => {
                      if (
                        !changesToThePage.advanceInformation.includes(
                          "timetoPrint"
                        )
                      ) {
                        setChangesToThePage((current) => {
                          return {
                            ...current,
                            advanceInformation: [
                              ...current.advanceInformation,
                              "timetoPrint",
                            ],
                          };
                        });
                      }
                      dispatch(changeModelHoursToPrint(event.target.value));
                    }}
                  />
                  <span>hh</span>
                </div>
                <span>:</span>
                <div className="flex items-center border-[1px] border-borderGray rounded-[5px] h-10 px-2.5 grow">
                  <input
                    type="number"
                    className="w-full focus:outline-none"
                    placeholder="In minutes"
                    min={0}
                    max={60}
                    ref={minimumTimeToPrintMinutes}
                    value={model?.timetoPrint?.minutes ?? ""}
                    onChange={(event) => {
                      if (
                        !changesToThePage.advanceInformation.includes(
                          "timetoPrint"
                        )
                      ) {
                        setChangesToThePage((current) => {
                          return {
                            ...current,
                            advanceInformation: [
                              ...current.advanceInformation,
                              "timetoPrint",
                            ],
                          };
                        });
                      }
                      dispatch(changeModelMinutesToPrint(event.target.value));
                    }}
                  />
                  <span>mm</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold">Support ( optional )</h3>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="extensionCheckbox"
                checked={model.supportNeeded}
                onChange={(event) => {
                  if (
                    !changesToThePage.advanceInformation.includes("supports")
                  ) {
                    setChangesToThePage((current) => {
                      return {
                        ...current,
                        advanceInformation: [
                          ...current.advanceInformation,
                          "supports",
                        ],
                      };
                    });
                  }
                  dispatch(changeModelSupportValue(event.target.checked));
                }}
              />
              <label htmlFor="extensionCheckbox">
                Tick this box if the object DOES NOT require support/extensions.
              </label>
            </div>
          </div>
        </div>
      </SectionLayout>
      <SectionLayout
        heading="Warnings"
        subHeading="Name your model, upload an image, and establish model details"
      >
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold">NSFW ( optional )</h3>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="nsfwCheckbox"
                checked={model.nsfw}
                onChange={(event) => {
                  if (!changesToThePage.advanceInformation.includes("NSFW")) {
                    setChangesToThePage((current) => {
                      return {
                        ...current,
                        advanceInformation: [
                          ...current.advanceInformation,
                          "NSFW",
                        ],
                      };
                    });
                  }
                  dispatch(changeModelNSFWValue(event.target.checked));
                }}
              />
              <label htmlFor="nsfwCheckbox">
                Has mature content (See our Guidelines for Mature content)
              </label>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold">Remix ( optional )</h3>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="remixCheckbox"
                checked={isRemix}
                onChange={(event) => {
                  if (
                    !(
                      model.remixes &&
                      model.remixes.length > 0 &&
                      !event.target.checked
                    )
                  ) {
                    if (
                      !changesToThePage.advanceInformation.includes("remix")
                    ) {
                      setChangesToThePage((current) => {
                        return {
                          ...current,
                          advanceInformation: [
                            ...current.advanceInformation,
                            "remix",
                          ],
                        };
                      });
                    }
                    setIsRemix(event.target.checked);
                  }
                }}
              />
              <label htmlFor="remixCheckbox">
                This Object is a Remix of other Objects
              </label>
            </div>
          </div>
          <div className="flex flex-col gap-3 ml-[1.3rem]">
            <p>
              Please attach or mention the name of models .zip or .rar
              preferred) or as separate files (.obj, .fbx, .stl, etc.). Add
              previews in .png or .jpeg file formats.
            </p>
            {isRemix && (
              <ModelUploadMetaData
                changesToThePage={changesToThePage}
                setChangesToThePage={setChangesToThePage}
              />
            )}
          </div>
        </div>
      </SectionLayout>
    </div>
  );
};
export default ModelUploadAdvanceInformation;
