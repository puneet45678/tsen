import { useState, useEffect, useRef } from "react";
import axios from "axios";
import BreadCrumbs from "../../BreadCrumbs";
import UploadModelMenu from "./UploadModelMenu";
import ModelUploadFiles from "./ModelUploadFiles";
import ModelUploadBasics from "./ModelUploadBasics";
import ModelUploadPricingAndLicense from "./ModelUploadPricingAndLicense";
import ModelUploadVisibility from "./ModelUploadVisibility";
import ModelUploadAdvanceInformation from "./ModelUploadAdvanceInformation";
import FirstModelUploadPage from "./FirstModelUploadPage";
import ModelUploadCancelModal from "./ModelUploadCancelModal";
import ModelPublishModal from "./ModelPublishModal";
import { useSelector, useDispatch } from "react-redux";
import { clearModel, setModel } from "../../../store/modelSlice";
import { useRouter } from "next/router";

const uploadMenu = [
  {
    title: "Upload Files",
    to: "upload-files",
    value: "uploadFiles",
  },
  {
    title: "Basics",
    to: "basics",
    value: "basics",
  },
  {
    title: "Pricing and License",
    to: "pricing-and-license",
    value: "pricingAndLicense",
  },
  {
    title: "Visibility",
    to: "visibility",
    value: "visibility",
  },
  {
    title: "Advance Information",
    to: "advance-information",
    value: "advanceInformation",
  },
];

const breadCrumbsData = [
  {
    title: "My Models",
    to: "/my-nest/models",
  },
  {
    title: "New Model",
    to: "/my-nest/models/upload",
  },
];

const defaultChangeObject = {
  basics: [],
  pricingAndLicense: [],
  visibility: [],
  advanceInformation: [],
};

const defaultErrorsObject = {
  uploadFiles: {},
  basics: {},
  pricingAndLicense: {},
  visibility: {},
  advanceInformation: {},
};

const ModelUploadPage = ({ modelId, currentUploadPage }) => {
  const contentDivRef = useRef();
  const router = useRouter();
  const dispatch = useDispatch();
  const model = useSelector((state) => state.model);

  const [showFirstUploadPage, setShowFirstUploadPage] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [changesToThePage, setChangesToThePage] = useState(defaultChangeObject);
  const [modelErrors, setModelErrors] = useState(defaultErrorsObject);

  const isModelDataValid = () => {
    let isValid = true;
    let errors = defaultErrorsObject;
    if (!model?.coverImage) {
      errors = {
        ...errors,
        uploadFiles: {
          ...errors.uploadFiles,
          images: "Cover image should be set.",
        },
      };
      isValid = false;
    }
    if (
      !model?.modelFileUrl.stl ||
      !model?.modelFileUrl.stl.name ||
      model?.modelFileUrl.stl.status !== "uploaded"
    ) {
      errors = {
        ...errors,
        uploadFiles: {
          ...errors.uploadFiles,
          stl: "stl files required.",
        },
      };
      isValid = false;
    }
    if (!model?.modelName) {
      errors = {
        ...errors,
        basics: {
          ...errors.basics,
          modelName: "Model name is required.",
        },
      };
      isValid = false;
    } else if (model.modelName.length > 250) {
      errors = {
        ...errors,
        basics: {
          ...errors.basics,
          modelName: "Model name should contain atmost 250 characters.",
        },
      };
      isValid = false;
    }
    if (!model?.category) {
      errors = {
        ...errors,
        basics: {
          ...errors.basics,
          category: "Model category is required.",
        },
      };
      isValid = false;
    }
    if (!model?.description) {
      errors = {
        ...errors,
        basics: {
          ...errors.basics,
          description: "Model Description is required.",
        },
      };
      isValid = false;
    } else if (model.description.length > 20000) {
      errors = {
        ...errors,
        basics: {
          ...errors.basics,
          description: "Model Description too long.",
        },
      };
      isValid = false;
    }
    if (!model?.tags) {
      errors = {
        ...errors,
        basics: {
          ...errors.basics,
          tags: "Model tags required.",
        },
      };
      isValid = false;
    } else if (model.tags.length > 5 || model.tags.length < 1) {
      errors = {
        ...errors,
        basics: {
          ...errors.basics,
          tags: "Model tags should be between 1 and 5 .",
        },
      };
      isValid = false;
    }
    if (!model?.price) {
      errors = {
        ...errors,
        pricingAndLicense: {
          ...errors.pricingAndLicense,
          price: "Model price is required.",
        },
      };
      isValid = false;
    } else if (parseFloat(model.price) < 1) {
      errors = {
        ...errors,
        pricingAndLicense: {
          ...errors.pricingAndLicense,
          price: "Minimum Model price should be 1.",
        },
      };
      isValid = false;
    }
    // if (!model?.license) {
    //   isValid = false;
    // }
    if (!model?.visibility) {
      errors = {
        ...errors,
        visibility: {
          ...errors.visibility,
          visibility: "Model visibility should be set.",
        },
      };
      isValid = false;
    } else if (
      !(model.visibility === "private" || model.visibility === "public")
    ) {
      errors = {
        ...errors,
        visibility: {
          ...errors.visibility,
          visibility: "Model visibility should either be public or private.",
        },
      };
      isValid = false;
    }
    if (model?.printDetails && model.printDetails.length > 20000) {
      errors = {
        ...errors,
        advanceInformation: {
          ...errors.advanceInformation,
          printingDetails: "Printing details too long.",
        },
      };
      isValid = false;
    }
    setModelErrors(errors);
    console.log("errors", errors, "model", model);
    return isValid;
  };

  const handleFirstUploadPageButtonClick = () => {
    axios
      .post(
        `${process.env.NEXT_PUBLIC_COMMON_SERVICE_URL}/page-view/firstModelUploadPage`,
        {},
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log("res", res);
        setShowFirstUploadPage(false);
        router.push(`/my-nest/models/upload/${modelId}/upload-files`);
      })
      .catch((err) => {
        console.log("Err", err);
      });
  };

  const saveModelAsDraft = () => {
    const { modelFileUrl, coverImage, modelImages, tags, ...data } = model;
    data["tagIds"] = tags.map((tag) => tag["_id"]);
    console.log("model", model, "data", data);
    axios
      .put(
        `${process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE}/api/v1/model/${modelId}`,
        data,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log("res", res);
        setChangesToThePage(defaultChangeObject);
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const saveModelAsDraftAndExitForm = () => {
    const { modelFileUrl, coverImage, modelImages, tags, ...data } = model;
    data["tagIds"] = tags.map((tag) => tag["_id"]);
    axios
      .put(
        `${process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE}/api/v1/model/${modelId}`,
        data,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log("res", res);
        setChangesToThePage(defaultChangeObject);
        dispatch(clearModel());
        router.push("/my-nest/models");
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const handlePublishClick = () => {
    if (isModelDataValid()) {
      axios
        .post(
          `${process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE}/api/v1/models/${modelId}/submit?comment=`,
          {},
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          console.log("res", res);
          setShowPublishModal(true);
        })
        .catch((err) => {
          console.log("Err", err);
        });
    }
  };

  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_COMMON_SERVICE_URL}/page-view/firstModelUploadPage`,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log("res", res);
        if (!res.data) setShowFirstUploadPage(true);
      })
      .catch((err) => {
        console.log("Err", err);
      });
    axios
      .get(
        `${process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE}/api/v1/model/${modelId}`,
        { withCredentials: true }
      )
      .then((res) => {
        console.log("res", res);
        dispatch(setModel(res.data));
      })
      .catch((err) => {
        console.log("err", err);
      });
  }, []);

  useEffect(() => {
    if (contentDivRef) {
      contentDivRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [currentUploadPage]);

  useEffect(() => {
    const handleBeforeRouteChange = (url) => {
      console.log("changesToThePage", changesToThePage, "url", url);
      if (
        changesToThePage.basics.length > 0 ||
        changesToThePage.pricingAndLicense.length > 0 ||
        changesToThePage.visibility.length > 0 ||
        changesToThePage.advanceInformation.length > 0
      ) {
        if (url.startsWith(`/my-nest/models/upload/${modelId}`)) {
          saveModelAsDraft();
        } else {
          const shouldPreventRouteChange = window.confirm(
            "Are you sure you want to leave this page? Changes you made may not be saved."
          );
          if (shouldPreventRouteChange) {
            dispatch(clearModel());
          } else {
            throw "Route change aborted";
          }
        }
      } else {
        if (!url.startsWith(`/my-nest/models/upload/${modelId}`)) {
          dispatch(clearModel());
        }
      }
    };
    router.events.on("beforeHistoryChange", handleBeforeRouteChange);
    return () => {
      router.events.off("beforeHistoryChange", handleBeforeRouteChange);
    };
  }, [changesToThePage, modelId, router.events]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };
    console.log("changesToThePage", changesToThePage);
    // TODO send saveasdraft here
    if (
      changesToThePage.basics.length > 0 ||
      changesToThePage.pricingAndLicense.length > 0 ||
      changesToThePage.visibility.length > 0 ||
      changesToThePage.advanceInformation.length > 0
    ) {
      window.addEventListener("beforeunload", handleBeforeUnload);
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [changesToThePage]);

  return (
    <div
      ref={contentDivRef}
      className="flex flex-col p-5 w-full h-full overflow-y-auto"
    >
      {showFirstUploadPage ? (
        <FirstModelUploadPage
          handleContinueClick={handleFirstUploadPageButtonClick}
        />
      ) : (
        <div className="flex flex-col gap-10">
          <div className="flex justify-between">
            <BreadCrumbs
              items={breadCrumbsData}
              previousPageButtonUrl={"/my-nest/models"}
            />
            <div className="flex text-[14px] h-10">
              <div className="pr-4 border-r-[1px] h-full grid items-center">
                <span
                  className="cursor-pointer"
                  onClick={() => setShowCancelModal(true)}
                >
                  Discard
                </span>
              </div>
              <div className="pl-4 flex gap-3">
                <button
                  onClick={() => {
                    saveModelAsDraft();
                    console.log("modelId", modelId);
                    router.push(`/model/${modelId}`);
                  }}
                  className="h-full w-32 border-[1px] border-black rounded-[5px]"
                >
                  Preview
                </button>
                <button
                  className="h-full w-32 border-[1px] border-black rounded-[5px]"
                  onClick={saveModelAsDraft}
                >
                  Save as draft
                </button>
                <button
                  className="h-full w-32 bg-black text-white rounded-[5px]"
                  onClick={handlePublishClick}
                >
                  Publish
                </button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-[250px_1fr]">
            <UploadModelMenu
              items={uploadMenu}
              modelId={modelId}
              currentPage={currentUploadPage}
              modelErrors={modelErrors}
            />
            <div className="">
              {currentUploadPage === "upload-files" ? (
                <ModelUploadFiles
                  modelId={modelId}
                  handleModelSave={saveModelAsDraft}
                  modelErrors={modelErrors}
                />
              ) : currentUploadPage === "basics" ? (
                <ModelUploadBasics
                  modelId={modelId}
                  changesToThePage={changesToThePage}
                  setChangesToThePage={setChangesToThePage}
                  handleModelSave={saveModelAsDraft}
                  modelErrors={modelErrors}
                />
              ) : currentUploadPage === "pricing-and-license" ? (
                <ModelUploadPricingAndLicense
                  modelId={modelId}
                  changesToThePage={changesToThePage}
                  setChangesToThePage={setChangesToThePage}
                  handleModelSave={saveModelAsDraft}
                  modelErrors={modelErrors}
                />
              ) : currentUploadPage === "visibility" ? (
                <ModelUploadVisibility
                  modelId={modelId}
                  changesToThePage={changesToThePage}
                  setChangesToThePage={setChangesToThePage}
                  handleModelSave={saveModelAsDraft}
                  modelErrors={modelErrors}
                />
              ) : currentUploadPage === "advance-information" ? (
                <ModelUploadAdvanceInformation
                  changesToThePage={changesToThePage}
                  setChangesToThePage={setChangesToThePage}
                  modelErrors={modelErrors}
                />
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      )}
      {showCancelModal && (
        <ModelUploadCancelModal
          closeModal={() => setShowCancelModal(false)}
          saveAsDraftHandler={saveModelAsDraftAndExitForm}
          cancelHandler={() => {
            dispatch(clearModel());
            router.push("/my-nest/models");
          }}
        />
      )}
      {showPublishModal && (
        <ModelPublishModal
          modelId={modelId}
          closeModal={() => setShowPublishModal(false)}
        />
      )}
    </div>
  );
};

// export const getServerSideProps = async (context) => {
//   const { req } = context;
//   const cookies = req.headers.cookie;
//   const config = {
//     withCredentials: true,
//     headers: {
//       cookie: cookies,
//     },
//   };
//   const response = await axios.get(
//     `${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/show-first-upload`,
//     config
//   );
//   console.log("response", response);
//   // axios
//   //   .get(
//   //     `${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/show-first-upload`,
//   //     config
//   //   )
//   //   .then((res) => {
//   //     console.log("res", res);
//   //   })
//   //   .catch((err) => {
//   //     console.log("err", err);
//   //   });
//   return {
//     props: {},
//   };
// };

export default ModelUploadPage;
