import Link from "next/link";
import LaptopLock from "../../icons/LaptopLock";
import ArrowLeftIcon from "../../icons/ArrowLeftIcon";
import { isEmailValid } from "../../UtilityFunctions/checkUserFields";

// TODO: show errors
const ForgotPasswordInput = ({
  email,
  setEmail,
  emailError,
  setEmailError,
  handleResetPassword,
  setShowCheckInboxPage,
}) => {
  const handleEmailChange = (event) => {
    const value = event.target.value;
    const emailValidity = isEmailValid(value);
    setEmailError(emailValidity.error);
    setEmail(value);
  };

  const handleResetPasswordClick = (event) => {
    event.preventDefault();
    handleResetPassword()
      .then((res) => {
        console.log("res", res);
        setShowCheckInboxPage(true);
      })
      .catch((err) => {
        console.log("err", err);
        // Status 404 -> no user found
        // TODO: check
        // Status 403 -> email not verified/third party
      });
  };
  return (
    <>
      <Link
        href="/login"
        className="p-[14px] bg-white shadow-xs border-[1px] border-light-neutral-600 absolute rounded-[6px] flex-center w-12 h-12 top-8 left-8"
      >
        <div className="h-[20px] w-[20px]">
          <ArrowLeftIcon />
        </div>
      </Link>
      <div className="flex-center flex-col gap-12">
        <div className="h-[166px] w-[166px]">
          <LaptopLock />
        </div>
        <div className="flex-center flex-col gap-8">
          <div className="text-center px-12 py-6">
            <h1 className="text-headline-lg font-bold text-dark-neutral-700">
              Forgot your Password?
            </h1>
          </div>
          <form className="flex-center flex-col gap-8 w-[552px]">
            <fieldset
              className={`w-full input-lg ${
                emailError ? "input-error" : "input-no-error"
              }`}
            >
              <label>Email Address:</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your Email ID"
                value={email}
                onChange={handleEmailChange}
              />
              {emailError && <span className="hint">{emailError}</span>}
            </fieldset>
            <div className="flex flex-col gap-6 w-full">
              <button
                onClick={handleResetPasswordClick}
                className="button-xl button-primary w-full"
                type="submit"
              >
                Reset Password
              </button>
              <div className="flex gap-2 text-lg">
                <span className="text-dark-neutral-50">
                  Having trouble logging in?
                </span>
                <Link
                  href="/support"
                  className="text-primary-purple-500 font-semibold hover:underline"
                >
                  Contact support
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordInput;
