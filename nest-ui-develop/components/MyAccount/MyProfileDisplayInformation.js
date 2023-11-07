import { useState, useMemo, useEffect, useId } from "react";
import DatePicker from "react-datepicker";
import Image from "next/image";
import countryList from "react-select-country-list";
import Select from "react-select";
import dynamic from "next/dynamic";
import UploadImage from "../UploadImage";
import { BsFillCameraFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import {
  changeProfilePicture,
  changeCoverPicture,
  changeUser,
} from "../../store/userSlice";
import axios from "axios";
import SectionLayout from "../Layouts/SectionLayout";
import { select } from "../../styles/ReactSelectStyles";
import EditIcon from "../../icons/EditIcon";
import UploadcareImage from "@uploadcare/nextjs-loader";
import PhotoCamera from "../../icons/PhotoCamera";
import LightBulbIcon from "../../icons/LightBulbIcon";
import CircularLoading from "../skeletons/CircularLoading";

const QuillEditor = dynamic(() => import("../QuillEditor"), {
  ssr: false,
});
import { components } from "react-select";
import Creatable from "react-select";
import InputSkeleton from "../skeletons/InputSkeleton";
import CircularSkeleton from "../skeletons/CircularSkeleton";
const SkillsMenu = (props) => {
  const optionSelectedLength = props.getValue().length || 0;
  console.log("props.getValue(): ", props.getValue());
  return (
    <components.Menu {...props}>
      {optionSelectedLength < 5 ? (
        props.children
      ) : (
        <div style={{ margin: 15 }}>You can only select upto 5 skills</div>
      )}
    </components.Menu>
  );
};

const MyProfileDisplayInformation = ({
  data,
  setData,
  changes,
  setChanges,
}) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const skillsOptions = useMemo(
    () => [
      { value: "3DModelling", label: "3D Modelling" },
      { value: "3DSculpting", label: "3D Sculpting" },
      { value: "rendering", label: "Rendering" },
      { value: "characterDesign", label: "Character Design" },
      { value: "RPGDesign", label: "RPG Design" },
      { value: "tabletopDesign", label: "Tabletop Design" },
      { value: "dioramaDesign", label: "Diorama Design" },
      { value: "3DPrinting", label: "3D Printing" },
      { value: "FDMPrinting", label: "FDM Printing" },
      { value: "resinPrinting", label: "Resin Printing" },
    ],
    []
  );
  const singleSelectMDNoError = useMemo(() => select("md", "no-error"), []);
  const use_id = useId();
  const [showMandatoryFieldsText, setShowMandatoryFieldsText] = useState(false);
  const [fiveSkillsSelected, setFiveSkillsSelected] = useState(false);
  const [areMandatoryFieldsFilled, setAreMandatoryFieldsFilled] =
    useState(false);
  const [showCropFor, setShowCropFor] = useState();
  const [editingPicture, setEditingPicture] = useState(false);
  const [personalWebsiteLink, setPersonalWebsiteLink] = useState(data.website);
  const [personalWebsiteChange, setPersonalWebsiteChange] = useState(false);

  const [showSavChangesLoader, setShowSavChangesLoader] = useState(false);

  const isValidNewOption = (inputValue, selectValue) =>
    inputValue.length > 0 && selectValue.length < 5;

  const handleProfilePictureInput = (event) => {
    // setProfilePicture(event.target.files[0]);
    setData((current) => ({
      ...current,
      profilePicture: event.target.files[0],
    }));
    setShowCropFor("profilePicture");
  };

  const handleNewProfilePictureUpload = (height, width, x, y) => {
    const formData = new FormData();
    formData.append("file", data.profilePicture);
    formData.append("height", height);
    formData.append("width", width);
    formData.append("x", x);
    formData.append("y", y);
    return new Promise((resolve, reject) => {
      axios
        .post(
          `${process.env.NEXT_PUBLIC_USER_SERVICE_URL}/api/v1/profile-picture`,
          formData,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((res) => {
          console.log("res", res);
          handleProfilePictureDispatch(res.data);
          setShowCropFor("");
          resolve();
        })
        .catch((err) => {
          console.log("err", err);
          reject();
        });
    });
  };

  const handleProfilePictureEdit = () => {
    setEditingPicture(true);
    setShowCropFor("profilePicture");
  };

  const handleEditProfilePictureUpload = (height, width, x, y) => {
    const formData = new FormData();
    formData.append("height", height);
    formData.append("width", width);
    formData.append("x", x);
    formData.append("y", y);
    return new Promise((resolve, reject) => {
      axios
        .put(
          `${process.env.NEXT_PUBLIC_USER_SERVICE_URL}/api/v1/profile-picture`,
          formData,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((res) => {
          console.log("res", res);
          handleProfilePictureDispatch(res.data);
          setShowCropFor("");
          setEditingPicture(false);
          resolve();
        })
        .catch((err) => {
          console.log("err", err);
          reject();
        });
    });
  };

  const handleCoverPictureInput = (event) => {
    setData((current) => ({
      ...current,
      coverPicture: event.target.files[0],
    }));
    // setCoverPicture(event.target.files[0]);
    setShowCropFor("coverPicture");
  };

  const handleNewCoverPictureUpload = (height, width, x, y) => {
    const formData = new FormData();
    formData.append("file", data.coverPicture);
    formData.append("height", height);
    formData.append("width", width);
    formData.append("x", x);
    formData.append("y", y);
    return new Promise((resolve, reject) => {
      axios
        .post(
          `${process.env.NEXT_PUBLIC_USER_SERVICE_URL}/api/v1/cover-picture`,
          formData,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((res) => {
          console.log("res", res);
          handleCoverPictureDispatch(res.data);
          setShowCropFor("");
          resolve();
        })
        .catch((err) => {
          console.log("err", err);
          reject();
        });
    });
  };

  const handleCoverPictureEdit = () => {
    setEditingPicture(true);
    setShowCropFor("coverPicture");
  };

  const handleEditCoverPictureUpload = (height, width, x, y) => {
    const formData = new FormData();
    formData.append("height", height);
    formData.append("width", width);
    formData.append("x", x);
    formData.append("y", y);
    return new Promise((resolve, reject) => {
      axios
        .put(
          `${process.env.NEXT_PUBLIC_USER_SERVICE_URL}/api/v1/cover-picture`,
          formData,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((res) => {
          console.log("res", res);
          handleCoverPictureDispatch(res.data);
          setShowCropFor("");
          setEditingPicture(false);
          resolve();
        })
        .catch((err) => {
          console.log("err", err);
          reject();
        });
    });
  };

  const handleCancelImageCrop = () => {
    setShowCropFor("");
    setEditingPicture(false);
  };

  const handleProfilePictureDispatch = (data) => {
    dispatch(changeProfilePicture(data));
  };

  const handleCoverPictureDispatch = (data) => {
    dispatch(changeCoverPicture(data));
  };

  const handleDisplayInformationSave = () => {
    if (areMandatoryFieldsFilled) {
      setShowSavChangesLoader(true);
      const displayInformationData = {
        description: data.description,
        skills: data.skills,
      };
      if (data.introductoryVideoUrl) {
        displayInformationData["introductoryVideoUrl"] =
          data.introductoryVideoUrl;
      }
      if (data.website) {
        displayInformationData["website"] = data.website;
      }
      axios
        .put(
          `${process.env.NEXT_PUBLIC_USER_SERVICE_URL}/api/v1/display-information`,
          displayInformationData,
          { withCredentials: true }
        )
        .then((res) => {
          console.log("res", res);
          setChanges(false);
          // dispatch(updateAccountInformation(displayInformationData));
          setShowSavChangesLoader(false);
        })

        .catch((err) => {
          console.log(err);
          setShowSavChangesLoader(false);
        });
    }
  };

  useEffect(() => {
    if (data.description && data.skills && data.skills.length > 0) {
      console.log("here", data.description, " ", data.skills);
      setAreMandatoryFieldsFilled(true);
    }
  }, [data.description, data.skills]);

  return (
    <div className="scroll-mt-[120px]" id="displayInformation">
      <SectionLayout
        heading="Display Information"
        subHeading="Manage your personal information, and control what information other people may access"
        showMandatoryFieldsText={true}
      >
        <div className="flex flex-col gap-8">
          <div>
            <div>
              {user?.email ? (
                <div className="w-full relative aspect-[4/1] bg-light-neutral-50">
                  <input
                    type="file"
                    id="cover picture"
                    className="hidden"
                    accept="image/png, image/jpg, image/jpeg"
                    onChange={handleCoverPictureInput}
                  />
                  {data?.croppedCoverPicture ? (
                    <>
                      <Image
                        src={data.croppedCoverPicture}
                        alt="User's Cover Picture"
                        fill
                        className="rounded-sm w-full"
                      />
                      <div
                        onClick={handleCoverPictureEdit}
                        className="cursor-pointer flex items-center gap-[6px] rounded-[5px] border-[1px] border-light-neutral-600 bg-white shadow-xs text-dark-neutral-700 absolute bottom-4 right-4 py-2 px-3"
                      >
                        <div className="h-4 w-4 overflow-hidden">
                          <PhotoCamera />
                        </div>
                        <span className="text-button-text-sm font-semibold">
                          Edit your banner
                        </span>
                      </div>
                    </>
                  ) : (
                    <label
                      htmlFor="cover picture"
                      className="cursor-pointer flex items-center gap-[6px] rounded-[5px] border-[1px] border-light-neutral-600 bg-white shadow-xs text-dark-neutral-700 absolute bottom-4 right-4 py-2 px-3"
                    >
                      <div className="h-4 w-4 overflow-hidden">
                        <PhotoCamera />
                      </div>
                      <span className="text-button-text-sm font-semibold">
                        Edit your banner
                      </span>
                    </label>
                  )}
                </div>
              ) : (
                <div className="h-[200px]">
                  <InputSkeleton width="full" height="216px" />
                </div>
              )}
              {showCropFor === "coverPicture" && (
                <UploadImage
                  aspectRatio={4 / 1}
                  picture={data.coverPicture}
                  setPicture={(picture) => {
                    setData((current) => ({
                      ...current,
                      coverPicture: picture,
                    }));
                  }}
                  editing={editingPicture}
                  setEditing={setEditingPicture}
                  cancelCrop={handleCancelImageCrop}
                  uploadNewPicture={handleNewCoverPictureUpload}
                  uploadNewCroppedPicture={handleEditCoverPictureUpload}
                />
              )}
            </div>
            <div>
              <div className="w-full h-12 relative">
                <div className="absolute bottom-0 left-8 h-24 w-24 aspect-square rounded-full bg-light-neutral-50">
                  <input
                    type="file"
                    id="profile picture"
                    className="hidden"
                    accept="image/png, image/jpg, image/jpeg"
                    value=""
                    onChange={handleProfilePictureInput}
                  />
                  {user?.email ? (
                    <div className="relative w-full h-full rounded-full">
                      {data.croppedProfilePicture ? (
                        <>
                          <Image
                            src={data.croppedProfilePicture}
                            alt="User's Profile Picture"
                            fill
                            className="rounded-full h-full w-full"
                          />
                          <div
                            onClick={handleProfilePictureEdit}
                            className="flex-center absolute -bottom-1 -right-1 rounded-full cursor-pointer bg-primary-purple-600 text-white h-8 w-8 aspect-square p-1"
                          >
                            <EditIcon />
                          </div>
                        </>
                      ) : (
                        <label
                          htmlFor="profile picture"
                          className="flex-center absolute -bottom-1 -right-1 rounded-full cursor-pointer bg-primary-purple-600 text-white h-8 w-8 aspect-square p-1"
                        >
                          <EditIcon />
                        </label>
                      )}
                    </div>
                  ) : (
                    <div className="h-[420px]">
                      <CircularSkeleton />
                    </div>
                  )}
                </div>
              </div>
              {showCropFor === "profilePicture" && (
                <UploadImage
                  aspectRatio={1}
                  picture={data.profilePicture}
                  setPicture={(picture) => {
                    setData((current) => ({
                      ...current,
                      profilePicture: picture,
                    }));
                  }}
                  editing={editingPicture}
                  setEditing={setEditingPicture}
                  cancelCrop={handleCancelImageCrop}
                  uploadNewPicture={handleNewProfilePictureUpload}
                  uploadNewCroppedPicture={handleEditProfilePictureUpload}
                />
              )}
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="input-md input-no-error">
              <label htmlFor="introductoryVideo" className="">
                Upload introductory video {"(optional)"}
              </label>

              {user?.email ? (
                <input
                  type="text"
                  id="introductoryVideo"
                  placeholder="Add a video link that describes you and your artwork."
                  value={data.introductoryVideoUrl}
                  onChange={(event) => {
                    if (!changes) setChanges(true);
                    setData((current) => ({
                      ...current,
                      introductoryVideoUrl: event.target.value,
                    }));
                  }}
                  className=""
                />
              ) : (
                <InputSkeleton />
              )}
            </div>
            <div className="grid gap-[6px] break-words">
              <p className="font-medium text-sm text-dark-neutral-700">
                Write something about yourself*
              </p>
              <div className="w-full min-h-[200px]">
                {user?.email ? (
                  <QuillEditor
                    value={data.description}
                    onChange={(value) => {
                      if (!changes && data.description !== value)
                        setChanges(true);
                      setShowMandatoryFieldsText(true);
                      setData((current) => ({
                        ...current,
                        description: value,
                      }));
                    }}
                    placeholder={"Enter your description."}
                  />
                ) : (
                  <InputSkeleton width="977px" height="204px" />
                )}
              </div>
            </div>
            <div className="grid gap-[6px]">
              <p className="font-medium text-sm text-dark-neutral-700">
                Mention your skills here*
              </p>

              <div className="w-full">
                {user?.email ? (
                  <Creatable
                    components={{ SkillsMenu }}
                    options={skillsOptions}
                    value={data.skills}
                    styles={singleSelectMDNoError}
                    instanceId={use_id}
                    isValidNewOption={isValidNewOption}
                    onChange={(selectedSkills) => {
                      if (!changes) setChanges(true);
                      setShowMandatoryFieldsText(true);
                      setData((current) => ({
                        ...current,
                        skills: selectedSkills,
                      }));
                      if (Object.keys(selectedSkills).length === 5)
                        setFiveSkillsSelected(true);
                    }}
                    placeholder={"Select your Area of Expertise"}
                    isMulti
                    isDisabled={fiveSkillsSelected}
                    isClearable={false}
                  />
                ) : (
                  <InputSkeleton />
                )}
              </div>
            </div>
            <div className="flex flex-col gap-[6px] input-div-md input-div-no-error">
              <label
                htmlFor="website"
                className="font-medium text-sm text-dark-neutral-700"
              >
                Personal Website URL
              </label>
              {user?.email ? (
                <div className="input-container">
                  <input
                    type="text"
                    id="videoLink"
                    placeholder="Add a link to your website"
                    className="grow "
                    value={personalWebsiteLink}
                    onChange={(event) => {
                      if (!personalWebsiteChange)
                        setPersonalWebsiteChange(true);
                      setPersonalWebsiteLink(event.target.value);
                    }}
                  />

                  <button
                    onClick={() => {
                      // TODO: add validations
                      if (!changes) setChanges(true);
                      setData((current) => ({
                        ...current,
                        website: personalWebsiteLink,
                      }));
                      setPersonalWebsiteChange(false);
                    }}
                    className={`button-xs w-fit whitespace-nowrap ${
                      personalWebsiteChange
                        ? "button-primary"
                        : "button-inactive"
                    }`}
                  >
                    + Add link
                  </button>
                </div>
              ) : (
                <InputSkeleton />
              )}
            </div>
            <div className="flex flex-col gap-2">
              {/* <button
                className={`w-fit button-md-2 ${
                  areMandatoryFieldsFilled && changes
                    ? "button-primary"
                    : "button-inactive"
                }`}
                onClick={() => {
                  if (areMandatoryFieldsFilled && changes) {
                    handleDisplayInformationSave();
                  }
                }}
              >
                Save changes
              </button> */}
              <button
                className={`w-[14%] button-md-2 ${
                  areMandatoryFieldsFilled && changes
                    ? "button-primary"
                    : "button-inactive"
                }`}
                onClick={() => {
                  if (areMandatoryFieldsFilled && changes) {
                    handleDisplayInformationSave();
                  }
                }}
              >
                {showSavChangesLoader ? <CircularLoading /> : "Save changes"}
              </button>
              <div
                className={`flex items-center justify-start gap-2 text-blue-secondary-500 ${
                  showMandatoryFieldsText && changes ? "flex" : "hidden"
                }`}
              >
                <div className="h-4 w-4">
                  <LightBulbIcon />
                </div>
                <p className="text-sm">
                  Please fill out all the mandatory fields to save your changes
                </p>
              </div>
            </div>
          </div>
        </div>
      </SectionLayout>
    </div>
  );
};

export default MyProfileDisplayInformation;
