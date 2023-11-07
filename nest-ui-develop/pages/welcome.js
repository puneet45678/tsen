import logo from "../public/images/logo.png";
import { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import GradientBackgroundLayout from "../components/OnBoarding/GradientBackgroundLayout";
import UploadcareImage from "@uploadcare/nextjs-loader";
import Session from "supertokens-auth-react/recipe/session";
import { useRouter } from "next/router";
import {
  isFullNameValid,
  isPhoneNumberValid,
  isUsernameValid,
} from "../UtilityFunctions/checkUserFields";
import CircularLoading from "../components/skeletons/CircularLoading";
import { debouncer } from "../UtilityFunctions/debouncer";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addSignUpData } from "../store/userSlice";

// TODO: add a condition that if username is already set then this page should not come
export default function CheckPassword() {
  const router = useRouter();
  const { redirectToPath } = router.query;
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [values, setValues] = useState({
    username: "",
    fullName: "",
    phoneNumber: "",
  });
  const [errors, setErrors] = useState({
    usernameError: null,
    fullNameError: null,
    phoneNumberError: null,
  });
  const [
    termsAndConditionCheckboxSelected,
    setTermsAndConditionCheckboxSelected,
  ] = useState(false);
  const [submittingForm, setSubmittingForm] = useState(false);

  const checkIfUsernameIsTakenOrNot = (data) => {
    if (!data.username) return;
    axios
      .get(
        `${process.env.NEXT_PUBLIC_USER_SERVICE_URL}/api/v1/check-username/${data.username}`,
        {
          withCredentials: true,
        }
      )
      .then((res) => {})
      .catch((err) => {
        setErrors((current) => ({
          ...current,
          usernameError: err?.response?.data?.detail
            ? err.response.data.detail
            : "An error occurred.",
        }));
      });
  };

  const handlePhoneNumberInput = (phoneNumber, country) => {
    if (phoneNumber && country && country?.countryCode) {
      const countryPrefix = country.countryCode.toUpperCase();
      const phoneNumberValidity = isPhoneNumberValid(
        phoneNumber,
        countryPrefix
      );
      setErrors((current) => ({
        ...current,
        phoneNumberError: phoneNumberValidity.error,
      }));
      setValues((current) => ({
        ...current,
        phoneNumber: {
          number: phoneNumber,
          country: country,
        },
      }));
    }
  };

  const checkUsername = (username) => {
    const usernameValidity = isUsernameValid(username);
    setErrors((current) => ({
      ...current,
      usernameError: usernameValidity.error,
    }));
    return usernameValidity.isValid;
  };

  const checkFullName = (name) => {
    const nameValidity = isFullNameValid(name);
    console.log("nameValidity", nameValidity);
    setErrors((current) => ({
      ...current,
      fullNameError: nameValidity.error,
    }));
    return nameValidity.isValid;
  };

  const handleInputChange = (event) => {
    const target = event.target.name;
    const value = event.target.value;
    if (target === "username") {
      const usernameValidity = checkUsername(value);
      if (usernameValidity) {
        debouncer(
          checkIfUsernameIsTakenOrNot,
          { username: event.target.value },
          500
        );
      }
      setValues((current) => ({ ...current, username: value }));
    } else if (target === "fullName") {
      checkFullName(value);
      setValues((current) => ({ ...current, fullName: value }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const termsAndConditionSelected = termsAndConditionCheckboxSelected;
    const isUsernameValid = checkUsername(values.username);
    const isFullNameValid = checkFullName(values.fullName);
    if (isUsernameValid) {
      checkIfUsernameIsTakenOrNot({ username: values.username });
    }
    if (
      !termsAndConditionSelected ||
      !isUsernameValid ||
      !isFullNameValid ||
      submittingForm ||
      errors.usernameError ||
      errors.fullNameError ||
      errors.phoneNumberError
    ) {
      return;
    }

    let phoneNumberData = {};
    if (values?.phoneNumber?.number && values?.phoneNumber?.country) {
      phoneNumberData["phoneNumber"] = values.phoneNumber.number;
      phoneNumberData["country"] = {
        name: values.phoneNumber.country.name,
        dialCode: values.phoneNumber.country.dialCode,
        countryCode: values.phoneNumber.country.countryCode,
      };
    } else {
      phoneNumberData = null;
    }

    const data = {
      username: values.username,
      fullName: values.fullName,
      phoneNumber: phoneNumberData,
    };
    setSubmittingForm(true);
    axios
      .post(
        `${process.env.NEXT_PUBLIC_USER_SERVICE_URL}/api/v1/user/signup-details`,
        data,
        { withCredentials: true }
      )
      .then((res) => {
        console.log("res", res);
        dispatch(addSignUpData(data));
        setSubmittingForm(false);
        console.log("redirecting to home");
        router.push("/home");
      })
      .catch((err) => {
        console.log("err", err);
        setSubmittingForm(false);
      });
  };

  useEffect(() => {
    (async () => {
      if (await Session.doesSessionExist()) {
        if (user?.username) {
          router.push("/home");
        } else {
          const payload = await Session.getAccessTokenPayloadSecurely();
          setEmail(payload?.user_info?.email);
          const fullName = `${
            payload?.user_info?.full_name
              ? `${payload.user_info.full_name}`
              : ""
          }`;
          setValues((current) => ({ ...current, fullName }));
        }
      } else {
        router.push("/login");
      }
    })();
  }, [user]);

  return (
    <GradientBackgroundLayout>
      <div className="flex-center flex-col gap-12 relative w-full h-full p-20">
        <div className="flex-center flex-col gap-8">
          <UploadcareImage src={logo} height={100} width={100} alt="logo" />
          <div className="flex-center flex-col gap-3">
            <h1 className="text-dark-neutral-700 text-headline-lg font-bold">
              Welcome to Ikarus Nest
            </h1>
            <span className="text-dark-neutral-50 text-md font-medium">
              {email}
            </span>
          </div>
        </div>
        <form className="grid gap-8 w-[424px]">
          <div className="flex-center flex-col gap-6">
            <fieldset
              className={`input-lg w-full ${
                errors.usernameError ? "input-error" : "input-no-error"
              }`}
            >
              <label htmlFor="username">User name*</label>
              <input
                id="username"
                name="username"
                type="text"
                placeholder="Insert your username"
                value={values.username}
                onChange={handleInputChange}
              />
              <span className="text-md text-dark-neutral-50">
                This name will show in your profile
              </span>
              {errors?.usernameError && (
                <span className="hint">{errors.usernameError}</span>
              )}
            </fieldset>
            <fieldset
              className={`input-lg w-full ${
                errors.fullNameError ? "input-error" : "input-no-error"
              }`}
            >
              <label htmlFor="fullName">Full name*</label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Insert your full legal name"
                value={values.fullName}
                onChange={handleInputChange}
              />
              {errors?.fullNameError && (
                <span className="hint">{errors.fullNameError}</span>
              )}
            </fieldset>
            <fieldset className="grid gap-[6px] w-full">
              <label className="input-label-default text-md font-medium">
                Phone number (optional)
              </label>
              <PhoneInput
                country={"us"}
                value={values.phoneNumber.number}
                onChange={(value, country) =>
                  handlePhoneNumberInput(value, country)
                }
                countryCodeEditable={false}
                enableSearch={true}
                disableSearchIcon={true}
                autoFormat={false}
                containerClass={`flex px-4 py-[15px] h-[52px] w-full rounded-[5px] border-[1px] border-light-neutral-700 shadow:xs focus-within:border-primary-purple-500 focus-within:shadow-focused-primary bg-light-neutral-50`}
                inputClass={`bg-transparent font-medium placeholder-light-neutral-900 focus-within:outline-none grow ${
                  errors?.phoneNumberError
                    ? "text-error-600"
                    : "text-dark-neutral-700"
                }`}
                buttonStyle={{ border: "none", backgroundColor: "#fafbfc" }}
                searchStyle={{ width: "92%" }}
              />
              {errors?.phoneNumberError && (
                <div className="text-error-600 text-md">
                  {errors?.phoneNumberError}
                </div>
              )}
            </fieldset>
          </div>
          <fieldset className="flex items-center gap-3">
            <input
              id="termsAndConditions"
              type="checkbox"
              className="checkbox-square checkbox-sm"
              checked={termsAndConditionCheckboxSelected}
              onChange={(event) =>
                setTermsAndConditionCheckboxSelected(event.target.checked)
              }
            />
            <label
              htmlFor="termsAndConditions"
              className="text-dark-neutral-700"
            >
              I accept the{" "}
              <span className="text-primary-purple-500">Terms</span> and{" "}
              <span className="text-primary-purple-500">Privacy Policy</span>
            </label>
          </fieldset>
          <button
            disabled={submittingForm || !termsAndConditionCheckboxSelected}
            onClick={handleSubmit}
            type="submit"
            className="button-xl button-primary"
          >
            {submittingForm ? (
              <>
                <CircularLoading />
              </>
            ) : (
              <>Continue</>
            )}
          </button>
        </form>
      </div>
    </GradientBackgroundLayout>
  );
}
