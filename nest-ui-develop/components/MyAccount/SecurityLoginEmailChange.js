import React, { useEffect, useState } from "react";
import SectionLayout from "../Layouts/SectionLayout";
import axios from "axios";
import { useSelector } from "react-redux";
import Alert from "../Alerts/Alert";
import UploadcareImage from "@uploadcare/nextjs-loader";
import Modal from "../Modals/Modal";
import EyeIcon from "../../icons/Eye";
import Eye_OffIcon from "../../icons/Eye_Off";
import CloseCross from "../../icons/CloseCross";
import Session from "supertokens-auth-react/recipe/session";
import { debouncer } from "../../UtilityFunctions/debouncer";

const SecurityLoginEmailChange = ({
  changes,
  setChanges,
  thirdPartyProvider,
}) => {
  const user = useSelector((state) => state.user);
  const [newEmail, setNewEmail] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [showEmailSentSuccess, setShowEmailSentSuccess] = useState(false);
  const [showResendEmail, setShowResendEmail] = useState(false);
  const [accessTokenPayloadVal, setAccessTokenPayloadVal] = useState(false);
  const [showEmailAlreadyTaken, setShowEmailAlreadyTaken] = useState(false);
  const [showResentEmailSuccess, setShowResentEmailSuccess] = useState(false);

  const isNewEmailValid = () => {
    if (!newEmail || user.email === newEmail) {
      return false;
    } else {
      return true;
    }
  };

  useEffect(() => {
    console.log("showEmailAlreadyTaken: ", showEmailAlreadyTaken);
  }, [showEmailAlreadyTaken]);

  const checkIfEmailAlreadyTaken = ({ newEmail }) => {
    if (newEmail !== "" && newEmail !== undefined && newEmail !== null) {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_USER_SERVICE_URL}/api/v1/check-email/${newEmail}`,
          { withCredentials: true }
        )
        .then((response) => {
          setShowEmailAlreadyTaken(false);
        })
        .catch((error) => {
          // if(error.status===409){
          setShowEmailAlreadyTaken(true);
          // }
        });
    }
  };

  const handleChangeEmail = () => {
    if (!thirdPartyProvider && isNewEmailValid()) {
      axios
        .put(
          `${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/email`,
          { currentPassword: password, newEmail: newEmail },
          { withCredentials: true }
        )
        .then((res) => {
          console.log("res", res);
          setNewEmail("");
          setPassword("");
          setShowPassword(false);
          setShowPasswordModal(false);
          setShowResendEmail(true);
          setShowEmailSentSuccess(true);
        })
        .catch((err) => {
          console.log("err", err);
          if (err.status === 422) {
            // Invalid Email
          } else if (err.status === 404) {
            // User not found
          } else if (err.status === 403) {
            // Google/Fb user
          } else if (err.status === 403) {
            // Password wrong
          } else {
            // Internal
          }
        });
    }
  };

  useEffect(() => {
    const getUser = async () => {
      if (await Session.doesSessionExist()) {
        let accessTokenPayload = await Session.getAccessTokenPayloadSecurely();
        setAccessTokenPayloadVal(accessTokenPayload);
        if (accessTokenPayload.isChangeEmailRequested) {
          setShowResendEmail(true);
        }
      }
    };
    getUser();
  }, [showResendEmail]);

  useEffect(() => {
    console.log("token_load: ", accessTokenPayloadVal);
  }, [accessTokenPayloadVal]);

  const handleResendEmailChangeRequest = () => {
    axios
      .post(
        `${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/resend-change-email-verification-email/${accessTokenPayloadVal?.newEmail}`,
        {},
        { withCredentials: true }
      )
      .then((response) => {
        console.log(response);
        setShowResentEmailSuccess(true);
      })
      .catch((error) => {
        console.error("Error while Re-Sending verification link email", error);
      });
  };

  const handleCancelEmailChangeRequest = () => {
    axios
      .delete(
        `${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/cancel-email-change-request/${accessTokenPayloadVal?.newEmail}`,
        { withCredentials: true }
      )
      .then((response) => {
        setShowResendEmail(false);
        setChanges(false);
        console.log(response);
      })
      .catch((error) => {
        console.error("Error while Re-Sending verification link email", error);
      });
  };

  return (
    <>
      {showResentEmailSuccess && (
        <div className="absolute bottom-12 right-[60px] w-80">
          <Alert
            type="info"
            heading="Email Resent"
            size="sm"
            hideAlertAfterInterval={true}
            automaticCloseTimeout={10000}
            hideShowMoreOption={true}
            handleClose={() => setShowResentEmailSuccess(false)}
          >
            <span>Check {newEmail} to verify your new email address</span>
          </Alert>
        </div>
      )}
      {showEmailSentSuccess && (
        <div className="absolute bottom-12 right-[60px] w-80">
          <Alert
            type="info"
            heading="We’ve sent"
            size="sm"
            hideAlertAfterInterval={true}
            hideShowMoreOption={true}
            handleClose={() => setShowEmailSentSuccess(false)}
          >
            <span>{user.email} an email to verify your new email address</span>
          </Alert>
        </div>
      )}
      {showPasswordModal && !thirdPartyProvider && newEmail && (
        <Modal
          open={showPasswordModal}
          handleClose={() => setShowPasswordModal(false)}
          showCloseIcon={false}
          center={true}
          styles={{
            modal: {
              background: "white",
              padding: "24px",
              borderRadius: "10px",
            },
          }}
        >
          <div className="flex flex-col gap-8 input-div-md input-div-no-error">
            <div className="flex flex-col gap-3">
              <div className="flex justify-between">
                <span className="text-headline-2xs text-dark-neutral-700 font-semibold">
                  Verify IkarusNest password
                </span>
                <div
                  onClick={() => setShowPasswordModal(false)}
                  className="text-dark-neutral-50 h-6 w-6 cursor-pointer"
                >
                  <CloseCross />
                </div>
              </div>
              <p className="text-md text-dark-neutral-50">
                For your security, please enter your password for {user.email}
              </p>
            </div>
            <div className={`flex items-center gap-2 input-container`}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter current email password"
                id="emailPassword"
                className="grow "
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <div
                className="h-4 w-4 aspect-square overflow-hidden text-light-neutral-900 cursor-pointer"
                onClick={() => setShowPassword((current) => !current)}
              >
                {showPassword ? <EyeIcon /> : <Eye_OffIcon />}
              </div>
            </div>
            <div className="flex items-center justify-end gap-4">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="button-md-2 button-default w-fit"
              >
                Cancel
              </button>
              <button
                onClick={handleChangeEmail}
                className="button-md-2 button-primary w-fit"
              >
                Confirm
              </button>
            </div>
          </div>
        </Modal>
      )}
      <div className="scroll-mt-[120px] h-fit " id="changeEmail">
        <SectionLayout
          heading="Change Email"
          subHeading="Used to login to your account"
          showMandatoryFieldsText={true}
        >
          <div
            className={`grid grid-cols-2 ${
              showResendEmail ||
              accessTokenPayloadVal?.isChangeEmailRequested ||
              showEmailAlreadyTaken
                ? "gap-x-[24px] gap-y-[6px]"
                : "gap-[24px]"
            }`}
          >
            <div className="input-md input-no-error">
              <label htmlFor="oldEmail" className="">
                Old Email*
              </label>
              <input
                type="email"
                id="oldEmail"
                placeholder="Email you're currently logged in with"
                className={""}
                value={user?.email}
                disabled
              />
            </div>
            <div
              className={`input-md ${
                showEmailAlreadyTaken
                  ? "input-error"
                  : showResendEmail ||
                    accessTokenPayloadVal?.isChangeEmailRequested
                  ? "border-light-neutral-700  focus-within:border-primary-purple-500 focus-within:shadow-focused-primary"
                  : "input-no-error"
              }`}
            >
              <label
                htmlFor="confirmPassword"
                className={`input-label-sm ${
                  thirdPartyProvider
                    ? "input-label-disabled"
                    : "input-label-default"
                }`}
              >
                {showResendEmail ||
                accessTokenPayloadVal?.isChangeEmailRequested
                  ? "Pending email verification"
                  : "New Email*"}
              </label>
              <input
                type="email"
                id="confirmPassword"
                placeholder="New Email"
                className={`text-light-neutral-900`}
                value={
                  accessTokenPayloadVal?.newEmail
                    ? accessTokenPayloadVal?.newEmail
                    : newEmail
                }
                onChange={(event) => {
                  if (!changes) setChanges(true);
                  if (!thirdPartyProvider) {
                    if (!changes) setChanges(true);
                    setNewEmail(event.target.value);
                    debouncer(
                      checkIfEmailAlreadyTaken,
                      { newEmail: event.target.value },
                      500
                    );
                  }
                }}
                disabled={
                  accessTokenPayloadVal?.isChangeEmailRequested ||
                  thirdPartyProvider
                }
              />
            </div>
            {showEmailAlreadyTaken ? (
              <>
                <div></div>
                <div className="text-error-600 text-sm font-normal">
                  Email already taken
                </div>
              </>
            ) : null}
            {showResendEmail ||
            accessTokenPayloadVal?.isChangeEmailRequested ? (
              <>
                <div></div>
                <div className="flex gap-[24px]">
                  <button
                    onClick={() => {
                      handleResendEmailChangeRequest();
                    }}
                    className="text-primary-purple-500 text-sm font-normal"
                  >
                    Resend email
                  </button>
                  <button
                    onClick={() => {
                      handleCancelEmailChangeRequest();
                    }}
                    className="text-error-600 text-sm font-normal"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : null}
          </div>
          <button
            className={`w-fit button-md-2 ${
              showResendEmail ||
              accessTokenPayloadVal?.isChangeEmailRequested ||
              !changes
                ? "button-inactive"
                : changes
                ? "button-primary"
                : "button-inactive"
            }`}
            disabled={
              showResendEmail ||
              accessTokenPayloadVal?.isChangeEmailRequested ||
              !changes
                ? true
                : changes
                ? false
                : true
            }
            onClick={() => {
              if (!thirdPartyProvider && newEmail) {
                setShowPasswordModal(true);
              }
            }}
          >
            Change email
          </button>

          {thirdPartyProvider && (
            <div className="flex">
              <Alert
                type="warning"
                hideShowMoreOption={true}
                hideCloseOption={true}
              >
                <div className="flex">
                  <span>
                    You cannot change your email as your account is connected to
                    your
                  </span>
                  &nbsp;
                  <UploadcareImage
                    src="/images/Google.png"
                    alt="Google Icon"
                    height={20}
                    width={20}
                  />
                  &nbsp;
                  <span> google account.</span>
                </div>
              </Alert>
            </div>
          )}
        </SectionLayout>
      </div>
    </>
  );
};

export default SecurityLoginEmailChange;
