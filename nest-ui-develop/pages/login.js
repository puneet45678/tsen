import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
// import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { emailPasswordSignIn } from "supertokens-auth-react/recipe/thirdpartyemailpassword";
import { getAuthorisationURLWithQueryParamsAndSetState } from "supertokens-auth-react/recipe/thirdpartyemailpassword";
import Session from "supertokens-auth-react/recipe/session";
import EyeIcon from "../icons/Eye";
import Eye_OffIcon from "../icons/Eye_Off";
import dynamic from "next/dynamic";
import {
  isEmailValid,
  isPasswordValid,
} from "../UtilityFunctions/checkUserFields";
import Alert from "../components/Alerts/Alert";
const ModelViewer = dynamic(() => import("../components/ModelViewer"), {
  ssr: false,
});

const LogIn = () => {
  const router = useRouter();
  const { redirectToPath, passwordChange, changeEmail } = router.query;
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    emailError: null,
    passwordError: null,
    loginError: null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showAlert, setShowAlert] = useState({
    passwordChange: false,
    emailChange: false,
  });

  const checkEmail = (email) => {
    const emailValidity = isEmailValid(email);
    setErrors((current) => ({ ...current, emailError: emailValidity.error }));
    return emailValidity.isValid;
  };

  const checkPassword = (password) => {
    const passwordValidity = isPasswordValid(password);
    setErrors((current) => ({
      ...current,
      passwordError: passwordValidity.error,
    }));
    return passwordValidity.isValid;
  };

  const handleInputChange = (event) => {
    const eventFor = event.target.name;
    const value = event.target.value;
    if (eventFor === "email") {
      checkEmail(value);
      setInputValue((current) => ({ ...current, email: value }));
    } else if (eventFor === "password") {
      checkPassword(value);
      setInputValue((current) => ({ ...current, password: value }));
    } else {
      return;
    }
  };

  const handleLogin = async () => {
    if (!checkEmail(inputValue.email) || !checkPassword(inputValue.password)) {
      return;
    }
    const isEmailValid = checkEmail(inputValue.email);
    const isPasswordValid = checkPassword(inputValue.password);
    if (isEmailValid && isPasswordValid) {
      try {
        let response = await emailPasswordSignIn({
          formFields: [
            {
              id: "email",
              value: inputValue.email,
            },
            {
              id: "password",
              value: inputValue.password,
            },
          ],
        });
        console.log("sign in response", response);
        if (response.status === "FIELD_ERROR") {
          response.formFields.forEach((formField) => {
            if (formField.id === "email") {
              setErrors((current) => ({
                ...current,
                loginError: formField.error,
              }));
            }
          });
        } else if (response.status === "WRONG_CREDENTIALS_ERROR") {
          setErrors((current) => ({
            ...current,
            loginError: "Email password combination is incorrect.",
          }));
        } else {
          setInputValue({
            email: "",
            password: "",
          });
          router.push(redirectToPath ? redirectToPath : "/home");
        }
      } catch (err) {
        console.log("submit err", err);
        if (err.isSuperTokensGeneralError === true) {
          setErrors((current) => ({ ...current, loginError: err.message }));
        } else {
          setErrors((current) => ({
            ...current,
            loginError: "Oops! Something went wrong.",
          }));
        }
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const authUrl = await getAuthorisationURLWithQueryParamsAndSetState({
        thirdPartyId: "google",
        frontendRedirectURI: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/auth/callback/google`,
      });
      window.location.assign(authUrl);
    } catch (err) {
      if (err.isSuperTokensGeneralError === true) {
        setErrors((current) => ({ ...current, loginError: err.message }));
      } else {
        setErrors((current) => ({
          ...current,
          loginError: "Oops! Something went wrong.",
        }));
      }
    }
  };

  const handleFacebookLogin = async () => {
    try {
      const authUrl = await getAuthorisationURLWithQueryParamsAndSetState({
        thirdPartyId: "facebook",
        frontendRedirectURI: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/auth/callback/facebook`,
      });
      window.location.assign(authUrl);
    } catch (err) {
      if (err.isSuperTokensGeneralError === true) {
        setErrors((current) => ({ ...current, loginError: err.message }));
      } else {
        setErrors((current) => ({
          ...current,
          loginError: "Oops! Something went wrong.",
        }));
      }
    }
  };

  useEffect(() => {
    (async () => {
      if (await Session.doesSessionExist()) {
        router.push("/home");
      }
    })();
  }, []);

  useEffect(() => {
    if (passwordChange === "success") {
      setShowAlert((current) => ({ ...current, passwordChange: true }));
    } else if (changeEmail === "success") {
      setShowAlert((current) => ({ ...current, emailChange: true }));
    }
  }, [passwordChange, changeEmail]);

  return (
    <>
      {showAlert.passwordChange && (
        <div className="absolute bottom-12 right-[60px] z-40">
          <Alert
            type="success"
            heading="Password Changed Successfully"
            size="sm"
            hideAlertAfterInterval={true}
            automaticCloseTimeout={5000}
            hideShowMoreOption={true}
            handleClose={() =>
              setShowAlert((current) => ({ ...current, passwordChange: false }))
            }
          >
            <span>Use your new password to log in.</span>
          </Alert>
        </div>
      )}
      {showAlert.emailChange && (
        <div className="absolute bottom-12 right-[60px] z-40">
          <Alert
            type="success"
            heading="Email Changed Successfully"
            size="sm"
            hideAlertAfterInterval={true}
            automaticCloseTimeout={5000}
            hideShowMoreOption={true}
            handleClose={() =>
              setShowAlert((current) => ({ ...current, emailChange: false }))
            }
          >
            <span>Use your new email to log in.</span>
          </Alert>
        </div>
      )}
      <div className="grid grid-cols-[45%_55%] w-full min-h-full bg-white">
        <div className="w-full h-full relative">
          <Image
            src="/images/onboarding/Background.png"
            className="object-cover object-center"
            fill
          />
          <div className="absolute w-full h-full z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <ModelViewer
              item="/models/3.glb"
              styles={{
                height: "100%",
                width: "100%",
              }}
            />
          </div>
        </div>
        <div className="flex-center h-full w-full p-20">
          <div className="flex flex-col gap-12 w-full max-w-[550px]">
            <div className="flex flex-col gap-7">
              <Image
                src="/images/logo.png"
                alt="Ikarus Logo"
                height={80}
                width={80}
              />

              <h1 className="text-headline-lg font-bold text-dark-neutral-700">
                Log In
              </h1>

              {errors.loginError && (
                <Alert
                  type="error"
                  size="sm"
                  hideShowMoreOption={true}
                  hideCloseOption={true}
                >
                  <span>{errors.loginError}</span>
                </Alert>
              )}

              <div className="flex flex-col gap-6 w-full">
                <div
                  className={`input-lg ${
                    errors?.emailError ? "input-error" : "input-no-error"
                  }`}
                >
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    placeholder="Insert your email"
                    id="email"
                    name="email"
                    onChange={handleInputChange}
                    value={inputValue.email}
                  />
                  {errors?.emailError && (
                    <p className="hint">{errors.emailError}</p>
                  )}
                </div>
                <div
                  className={`input-div-lg ${
                    errors?.passwordError
                      ? "input-div-error"
                      : "input-div-no-error"
                  }`}
                >
                  <label htmlFor="password">Password</label>
                  <div className={`input-container`}>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Insert your password"
                      id="password"
                      name="password"
                      onChange={handleInputChange}
                      value={inputValue.password}
                    />
                    <div
                      className="h-4 w-4 aspect-square overflow-hidden text-light-neutral-900 cursor-pointer"
                      onClick={() => setShowPassword((current) => !current)}
                    >
                      {showPassword ? <EyeIcon /> : <Eye_OffIcon />}
                    </div>
                  </div>
                  {errors?.passwordError && (
                    <p className="hint">{errors.passwordError}</p>
                  )}
                </div>
                <div className="w-full text-right">
                  <Link
                    href="/forgot-password"
                    className="text-md font-semibold text-primary-purple-500"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>

              <div className="relative w-full h-fit text-center">
                <div className="absolute w-full h-[0.6px] bg-light-neutral-700 top-1/2"></div>
                <span className="bg-white px-[10px] relative text-lg text-dark-neutral-700 font-semibold">
                  Or
                </span>
              </div>

              <div className="flex flex-col gap-6 w-full">
                <button
                  className="flex-center gap-2 w-full cursor-pointer border-[1px] border-light-neutral-700 rounded-[5px] shadow-xs p-4"
                  onClick={handleGoogleLogin}
                >
                  <Image
                    src="/SVG/Google.svg"
                    alt="Google"
                    height={20}
                    width={20}
                  />
                  <span className="text-md font-medium text-dark-neutral-700">
                    Sign in with Google
                  </span>
                </button>
                <button
                  className="flex-center gap-2 w-full cursor-pointer border-[1px] border-light-neutral-700 rounded-[5px] shadow-xs p-4"
                  onClick={handleFacebookLogin}
                >
                  <Image
                    src="/SVG/Facebook.svg"
                    alt="Facebook"
                    height={20}
                    width={20}
                  />
                  <span className="text-md font-medium text-dark-neutral-700">
                    Sign in with Facebook
                  </span>
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-6 w-full">
              <button
                onClick={handleLogin}
                className="w-full bg-primary-purple-500 rounded-[8px] py-4 px-6 text-center text-white text-button-lg font-semibold"
              >
                Log In
              </button>
              <div className="flex gap-2 text-lg">
                <span className="text-dark-neutral-50">
                  Don&#39;t have an account?
                </span>
                <Link
                  href={`/signup${
                    redirectToPath ? `?redirectToPath=${redirectToPath}` : ""
                  }`}
                  className="text-primary-purple-500 font-semibold"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps(context) {
  if (
    !context.req.cookies["sFrontToken"] ||
    context.req.cookies["sFrontToken"] === "" ||
    !context.req.cookies["sAccessToken"] ||
    context.req.cookies["sAccessToken"] === ""
  ) {
    return {
      props: {},
    };
  }

  return {
    redirect: {
      permanent: false,
      destination: "/home",
    },
    props: {},
  };
}

export default LogIn;
