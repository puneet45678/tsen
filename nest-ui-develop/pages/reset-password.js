import GradientBackgroundLayout from "../components/OnBoarding/GradientBackgroundLayout";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import EyeIcon from "../icons/Eye";
import Eye_OffIcon from "../icons/Eye_Off";
import {
  isConfirmPasswordValid,
  isPasswordValid,
} from "../UtilityFunctions/checkUserFields";

export default function CheckPassword() {
  const router = useRouter();
  const { userId, token } = router.query;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePasswordChange = (event) => {
    const value = event.target.value;
    const passwordValidity = isPasswordValid(value);
    setPasswordError(passwordValidity.error);
    setPassword(value);
    if (confirmPassword && value !== confirmPassword) {
      setConfirmPasswordError("Password and Confirm Password are not same.");
    } else {
      setConfirmPasswordError(null);
    }
  };

  const handleConfirmPasswordChange = (event) => {
    const value = event.target.value;
    const confirmPasswordValidity = isConfirmPasswordValid(password, value);
    setConfirmPasswordError(confirmPasswordValidity.error);
    setConfirmPassword(value);
  };

  const handleResetPassword = (event) => {
    event.preventDefault();
    const passwordValidity = isPasswordValid(password);
    if (!passwordValidity.isValid) {
      setPasswordError(passwordValidity.error);
      return;
    }
    const confirmPasswordValidity = isConfirmPasswordValid(
      password,
      confirmPassword
    );
    if (!confirmPasswordValidity.isValid) {
      setConfirmPasswordError(confirmPasswordValidity.error);
      return;
    }
    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("token", token);
    formData.append("password", password);
    axios
      .post(
        `${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/reset-password-confirm`,
        formData
      )
      .then((res) => {
        console.log("res", res);
        router.push("/login?passwordChange=success");
      })
      .catch((err) => {
        console.log("err", err);
        // Status 400 -> invalid data
      });
  };
  return (
    <GradientBackgroundLayout>
      <div className="flex-center relative w-full h-full p-20">
        <div className="grid gap-12">
          <div className="grid gap-4 text-center">
            <h1 className="text-headline-lg font-bold text-dark-neutral-700">
              Reset your password
            </h1>
            <span className="text-md font-medium text-dark-neutral-200">
              Resetting your password will log out of all existing session
            </span>
          </div>
          <form className="grid gap-8 w-[424px]">
            <div className="grid gap-6">
              <fieldset
                className={`input-div-lg ${
                  passwordError ? "input-div-error" : "input-div-no-error"
                }`}
              >
                <label htmlFor="password">Password</label>
                <div className="input-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter a strong password"
                    id="password"
                    onChange={handlePasswordChange}
                    value={password}
                  />
                  <div
                    className="h-4 w-4 aspect-square overflow-hidden text-light-neutral-900 cursor-pointer"
                    onClick={() => setShowPassword((current) => !current)}
                  >
                    {showPassword ? <EyeIcon /> : <Eye_OffIcon />}
                  </div>
                </div>
                {passwordError && <p className="hint">{passwordError}</p>}
              </fieldset>
              <fieldset
                className={`input-div-lg ${
                  confirmPasswordError
                    ? "input-div-error"
                    : "input-div-no-error"
                }`}
              >
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="flex items-center gap-2 input-container">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Retype your password"
                    id="confirmPassword"
                    onChange={handleConfirmPasswordChange}
                    value={confirmPassword}
                  />
                  <div
                    className="h-4 w-4 aspect-square overflow-hidden text-light-neutral-900 cursor-pointer"
                    onClick={() =>
                      setShowConfirmPassword((current) => !current)
                    }
                  >
                    {showConfirmPassword ? <EyeIcon /> : <Eye_OffIcon />}
                  </div>
                </div>
                {confirmPasswordError && (
                  <p className="hint">{confirmPasswordError}</p>
                )}
              </fieldset>
            </div>
            <button
              onClick={handleResetPassword}
              className="button-xl button-primary w-[424px]"
              type="submit"
            >
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </GradientBackgroundLayout>
  );
}

export const getServerSideProps = (context) => {
  console.log("query", context.query);
  if (!context.query.userId && !context.query.token) {
    return {
      redirect: {
        permanent: false,
        destination: "/home",
      },
      props: {},
    };
  }
  return {
    props: {},
  };
};
