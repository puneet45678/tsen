import { useState } from "react";
import ForgotPasswordInput from "../components/OnBoarding/ForgotPasswordInput";
import ForgotPasswordCheckInbox from "../components/OnBoarding/ForgotPasswordCheckInbox";
import axios from "axios";
import GradientBackgroundLayout from "../components/OnBoarding/GradientBackgroundLayout";
import { isEmailValid } from "../UtilityFunctions/checkUserFields";

// TODO: add email validation
export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState();
  const [showCheckInboxPage, setShowCheckInboxPage] = useState(false);

  const handleResetPassword = async () => {
    const emailValidity = isEmailValid(email);
    if (!emailValidity.isValid) {
      setEmailError(emailValidity.error);
      const invalidEmailError = new Error(emailValidity.error);
      invalidEmailError.stack = undefined;
      throw invalidEmailError;
    }
    return await axios.put(
      `${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/forget-password`,
      {
        email,
      }
    );
  };

  return (
    <GradientBackgroundLayout>
      <div className="flex-center w-full h-full p-20">
        {showCheckInboxPage && email ? (
          <ForgotPasswordCheckInbox
            email={email}
            handleResetPassword={handleResetPassword}
          />
        ) : (
          <ForgotPasswordInput
            email={email}
            setEmail={setEmail}
            emailError={emailError}
            setEmailError={setEmailError}
            handleResetPassword={handleResetPassword}
            setShowCheckInboxPage={setShowCheckInboxPage}
          />
        )}
      </div>
    </GradientBackgroundLayout>
  );
}
