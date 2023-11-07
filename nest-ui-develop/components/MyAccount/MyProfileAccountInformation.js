import { useState, useMemo, useId, useEffect } from "react";
import DatePicker from "react-datepicker";
import countryList from "react-select-country-list";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { updateAccountInformation } from "../../store/userSlice";
import axios from "axios";
import SectionLayout from "../Layouts/SectionLayout";
import { select } from "../../styles/ReactSelectStyles";
import CalendarIcon from "../../icons/CalendarIcon";
import DatePickerContainer from "../../components/Layouts/DatePickerContainer";
import LightBulbIcon from "../../icons/LightBulbIcon";
import InputSkeleton from "../skeletons/InputSkeleton";
import "react-loading-skeleton/dist/skeleton.css";
import CircularLoading from "../skeletons/CircularLoading";

const MyProfileAccountInformation = ({
  data,
  setData,
  changes,
  setChanges,
}) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const options = useMemo(() => countryList().getData(), []);
  const accountTypeOptions = useMemo(
    () => [
      { label: "3DA", value: "3DA" },
      { label: "3DP", value: "3DP" },
    ],
    []
  );

  useEffect(() => {
    if (data.fullName && data.country && data.accountType && data.gender) {
      setAreMandatoryFieldsFilled(true);
    }
  }, [data.fullName, data.country, data.accountType, data.gender]);

  const singleSelectMDNoError = useMemo(() => select("md", "no-error"), []);
  const use_id = useId();

  const [areMandatoryFieldsFilled, setAreMandatoryFieldsFilled] =
    useState(false);
  const [showSavChangesLoader, setShowSavChangesLoader] = useState(false);

  const [showMandatoryFieldsText, setShowMandatoryFieldsText] = useState(false);

  const handleAccountInformationSave = () => {
    if (areMandatoryFieldsFilled) {
      const accountInformationData = {
        fullName: data.fullName,
        country: data.country,
        accountType: data.accountType,
        gender: data.gender,
      };
      if (data.dateOfBirth) {
        accountInformationData["dateOfBirth"] = data.dateOfBirth;
      }
      if (data.showMatureContent) {
        accountInformationData["showMatureContent"] = data.showMatureContent;
      }
      axios
        .put(
          `${process.env.NEXT_PUBLIC_USER_SERVICE_URL}/api/v1/account-information`,
          accountInformationData,
          { withCredentials: true }
        )
        .then((res) => {
          console.log("res", res);
          setChanges(false);
          setShowSavChangesLoader(false);
          dispatch(updateAccountInformation(accountInformationData));
        })
        .catch((err) => {
          setShowSavChangesLoader(false);
          console.log(err);
        });
    }
  };

  return (
    <div className="scroll-mt-[120px]" id="accountInformation">
      <SectionLayout
        heading="Account Information"
        subHeading="Manage your personal information, and control what information other people may access"
        showMandatoryFieldsText={true}
      >
        <div className="grid grid-cols-2 gap-[24px]">
          <div className="input-md input-no-error">
            <label htmlFor="fullName" className="">
              Legal full name*
            </label>

            {/* {data.fullName !== undefined && data.fullName !== null ? ( */}
            {user?.email ? (
              <input
                type="text"
                id="fullName"
                placeholder="Enter your name here"
                value={data.fullName}
                name="fullName"
                onChange={(event) => {
                  if (!changes) setChanges(true);
                  setShowMandatoryFieldsText(true);
                  setData((current) => ({
                    ...current,
                    fullName: event.target.value,
                  }));
                }}
              />
            ) : (
              <InputSkeleton />
            )}
          </div>
          <div className="grid gap-[6px]">
            <p className="font-medium text-sm text-dark-neutral-700">
              Country*
            </p>
            {user?.email ? (
              <div>
                <Select
                  options={options}
                  value={
                    data.country
                      ? {
                          label: data.country,
                          value: countryList().getValue(data.country),
                        }
                      : null
                  }
                  styles={singleSelectMDNoError}
                  instanceId={use_id}
                  onChange={(selectedCountry) => {
                    console.log("selectedCountry", selectedCountry);
                    if (!changes) setChanges(true);
                    setShowMandatoryFieldsText(true);
                    setData((current) => ({
                      ...current,
                      country: selectedCountry.label,
                    }));
                  }}
                  placeholder={"Select Country"}
                />
              </div>
            ) : (
              <InputSkeleton />
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-[24px]">
          <div className="input-md input-no-error">
            <label htmlFor="email" className="">
              Email*
            </label>
            {user?.email ? (
              <input
                type="email"
                id="email"
                className=""
                value={user?.email ? user.email : ""}
                disabled
              />
            ) : (
              <InputSkeleton />
            )}
          </div>
          <div className="grid gap-[6px]">
            <p className="font-medium text-sm text-dark-neutral-700">
              Account Type*
            </p>
            {/* {data.accountType !== undefined && data.accountType !== null ? ( */}
            {user?.email ? (
              <Select
                options={accountTypeOptions}
                value={
                  data.accountType
                    ? {
                        label: data.accountType,
                        value: data.accountType,
                      }
                    : null
                }
                styles={singleSelectMDNoError}
                instanceId={use_id}
                onChange={(selectedAccountType) => {
                  if (!changes) setChanges(true);
                  setShowMandatoryFieldsText(true);
                  setData((current) => ({
                    ...current,
                    accountType: selectedAccountType.value,
                  }));
                }}
                placeholder={"Select Account Type"}
              />
            ) : (
              <InputSkeleton />
            )}
          </div>
        </div>
        <div className="input-md input-no-error">
          <label className="">Username*</label>
          {/* {user?.username ? ( */}
          {user?.email ? (
            <input
              type="text"
              className=""
              value={user?.username ? user.username : ""}
              disabled
            />
          ) : (
            <InputSkeleton width="995px" />
          )}
        </div>
        <div className="flex flex-col gap-[32px]">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-[6px]">
              <p className="font-medium text-sm text-dark-neutral-700">
                Gender*
              </p>
              <div className="flex gap-4 h-10">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="male"
                    name="gender"
                    value="male"
                    className="w-5 h-5 radio-circle"
                    checked={data.gender === "male"}
                    onChange={() => {
                      if (!changes) setChanges(true);
                      setShowMandatoryFieldsText(true);
                      setData((current) => ({
                        ...current,
                        gender: "male",
                      }));
                    }}
                  />
                  <label htmlFor="male" className="text-md dark-neutral-700">
                    Male
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="female"
                    name="gender"
                    value="female"
                    className="w-5 h-5 radio-circle"
                    checked={data.gender === "female"}
                    onChange={() => {
                      if (!changes) setChanges(true);
                      setShowMandatoryFieldsText(true);
                      setData((current) => ({
                        ...current,
                        gender: "female",
                      }));
                    }}
                  />
                  <label htmlFor="female" className="text-md dark-neutral-700">
                    Female
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="other"
                    name="gender"
                    value="other"
                    className="w-5 h-5 radio-circle"
                    checked={data.gender === "other"}
                    onChange={() => {
                      if (!changes) setChanges(true);
                      setShowMandatoryFieldsText(true);
                      setData((current) => ({
                        ...current,
                        gender: "other",
                      }));
                    }}
                  />
                  <label htmlFor="other" className="text-md dark-neutral-700">
                    Other
                  </label>
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <label
                htmlFor="dob"
                className="font-medium text-sm text-dark-neutral-700"
              >
                Date Of Birth
              </label>

              <div className="flex items-center justify-between input-md  input-no-error w-[281px]">
                {/* {data.dateOfBirth !== undefined && data.dateOfBirth !== null ? ( */}
                {user?.email ? (
                  <div className="grow focus:outline-none bg-transparent">
                    <DatePickerContainer
                      id="dob"
                      value={data.dateOfBirth}
                      onChange={(date) => {
                        if (!changes) setChanges(true);
                        setShowMandatoryFieldsText(true);
                        setData((current) => ({
                          ...current,
                          dateOfBirth: date,
                        }));
                      }}
                    />
                  </div>
                ) : (
                  <InputSkeleton width="281px" />
                )}
                <div className="w-[20px] h-[20px] text-light-neutral-900 mx-3">
                  <CalendarIcon />
                </div>
              </div>
            </div>
          </div>
          <div className="border-[1px] border-light-neutral-600"></div>
        </div>
        <div className="flex flex-col gap-[32px]">
          <div className="flex gap-[12px] items-center">
            <input
              id="mature_content"
              type="checkbox"
              checked={data.showMatureContent}
              onChange={(event) => {
                if (!changes) setChanges(true);
                setShowMandatoryFieldsText(true);
                setData((current) => ({
                  ...current,
                  showMatureContent: event.target.checked,
                }));
              }}
              className="w-[18px] h-[18px] checkbox-square"
            />
            <label
              htmlFor="mature_content"
              className="text-dark-neutral-700 font-medium text-md"
            >
              Show mature content on platform
            </label>
          </div>
          <div className="flex flex-col gap-2">
            <button
              className={`w-[14%] button-md-2 ${
                areMandatoryFieldsFilled && changes
                  ? "button-primary"
                  : "button-inactive"
              }`}
              onClick={() => {
                if (areMandatoryFieldsFilled && changes) {
                  handleAccountInformationSave();
                  setShowSavChangesLoader(true);
                }
              }}
            >
              {showSavChangesLoader ? <CircularLoading /> : "Save changes"}
            </button>
            <div
              className={` items-center justify-start gap-2 text-blue-secondary-500 ${
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
      </SectionLayout>
    </div>
  );
};

export default MyProfileAccountInformation;
