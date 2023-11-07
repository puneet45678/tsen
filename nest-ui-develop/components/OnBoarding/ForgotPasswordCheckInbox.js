import MailSent from "../../icons/MailSent";
import { useEffect, useState } from "react";
import Alert from "../Alerts/Alert";

// TODO: show errors
// TODO: we would need some maximum amount of times the user can hit this
const ForgotPasswordCheckInbox = ({ email, handleResetPassword }) => {
  const defaultRemainingSeconds = 60;
  const [remainingTime, setRemainingTime] = useState(defaultRemainingSeconds); // Seconds
  const [startTimer, setStartTimer] = useState(true);
  const [showEmailSentAlert, setShowEmailSentAlert] = useState(false);

  const handleResendResetPasswordLink = () => {
    setRemainingTime(defaultRemainingSeconds);
    setStartTimer(true);
    handleResetPassword()
      .then((res) => {
        console.log("res", res);
        setShowEmailSentAlert(true);
      })
      .catch((err) => {
        console.log("err", err);
        // Status 404 -> no user found
        // TODO: check
        // Status 403 -> email not verified/third party
      });
  };

  useEffect(() => {
    let timeoutId = null;
    if (remainingTime > 0 && startTimer) {
      timeoutId = setTimeout(() => {
        setRemainingTime((current) => current - 1);
      }, 1000);
    } else if (remainingTime === 0) {
      setStartTimer(false);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [remainingTime, startTimer]);

  return (
    <>
      {showEmailSentAlert && (
        <div className="absolute bottom-12 right-[60px] z-40">
          <Alert
            type="info"
            heading="Email Resent"
            size="sm"
            hideShowMoreOption={true}
            handleClose={() => setShowEmailSentAlert(false)}
          >
            <span>{email} email to verify your current email address</span>
          </Alert>
        </div>
      )}
      <div className="flex-center flex-col gap-12">
        <div className="w-[166px] h-[166px]">
          <MailSent />
        </div>
        <div className="flex flex-col text-center gap-[100px]">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <h1 className="text-headline-lg font-bold text-dark-neutral-700">
                Check your inbox
              </h1>
              <div className="text-md font-medium">
                <span className="text-dark-neutral-200">
                  We sent a reset password email to
                </span>{" "}
                <span className="text-primary-purple-600">{email}.</span>
              </div>
            </div>
            <span className="text-md text-dark-neutral-400">
              Please click the link to set your new password
            </span>
          </div>
          <div>
            <span className="text-xl text-dark-neutral-400 font-medium">
              Not receive the link?
            </span>
            <div className="text-md font-medium">
              {remainingTime <= 0 ? (
                <button
                  onClick={handleResendResetPasswordLink}
                  className="text-primary-purple-600 hover:underline"
                >
                  Resend Email
                </button>
              ) : (
                <>
                  <span className="text-dark-neutral-200">
                    You can resend the email
                  </span>{" "}
                  <span className="text-primary-purple-600">{`${parseInt(
                    remainingTime / 60
                  )}:${
                    remainingTime % 60 < 10
                      ? `0${remainingTime % 60}`
                      : remainingTime % 60
                  }`}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordCheckInbox;
