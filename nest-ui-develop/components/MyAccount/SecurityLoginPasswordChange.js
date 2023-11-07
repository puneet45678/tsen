import React, { useState, useEffect } from "react";
import SectionLayout from "../Layouts/SectionLayout";
import axios from "axios";
import Alert from "../Alerts/Alert";
import UploadcareImage from "@uploadcare/nextjs-loader";
import EyeIcon from "../../icons/Eye";
import Eye_OffIcon from "../../icons/Eye_Off";

const SecurityLoginPasswordChange = ({
  changes,
  setChanges,
  thirdPartyProvider,
}) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    currentPassword: null,
    newPassword: null,
    confirmNewPassword: null,
  });
  const [showValue, setShowValue] = useState({
    currentPassword: false,
    newPassword: false,
    confirmNewPassword: false,
  });
  const [showPasswordChangeAlert, setShowPasswordChangeAlert] = useState(false);

  const [areMandatoryFieldsFilled, setAreMandatoryFieldsFilled] =
  useState(false);

  const isConfirmPasswordValid = () => {
    console.log("isConfirmPasswordValid");
    if (!confirmPassword || confirmPassword !== newPassword) {
      return false;
    } else {
      return true;
    }
  };

  const handleChangePassword = () => {
    // if (
    //   !thirdPartyProvider &&
    //   !currentPassword &&
    //   !newPassword &&
    //   !isConfirmPasswordValid
    // ) {
    //   console.log("hereee");
    //   axios
    //     .put(
    //       `${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/password`,
    //       { currentPassword, newPassword },
    //       { withCredentials: true }
    //     )
    //     .then((res) => {
    //       console.log("res", res);
    //     })
    //     .catch((err) => {
    //       console.log("err", err);
    //       if (err.status === 403) {
    //         // Wrong pass
    //       } else if (err.status === 400) {
    //         // Wrong pass regex
    //       } else {
    //         // Internal
    //       }
    //     });
    // }
    console.log("hereee");
    axios
      .put(
        `${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/password`,
        { currentPassword, newPassword },
        { withCredentials: true }
      )
      .then((res) => {
        console.log("res", res);
      })
      .catch((err) => {
        console.log("err", err);
        if (err.status === 403) {
          // Wrong pass
        } else if (err.status === 400) {
          // Wrong pass regex
        } else {
          // Internal
        }
      });
  };

  return (
    <>
      <div className="scroll-mt-[120px]" id="changePassword">
        {showPasswordChangeAlert && (
          <div className="absolute bottom-12 right-[60px] w-80">
            <Alert
              type="success"
              size="sm"
              hideAlertAfterInterval={true}
              hideShowMoreOption={true}
              handleClose={() => setShowPasswordChangeAlert(false)}
            >
              <span>Password Changed successfully</span>
            </Alert>
          </div>
        )}
        <SectionLayout
          heading="Change password"
          subHeading="Manage your personal information, and control what information other people may access"
          showMandatoryFieldsText={true}
        >
          <div className="grid grid-cols-2 gap-6">
            <div className={`input-div-md ${thirdPartyProvider ? "input-div-disabled" : "input-div-no-error"}`}>
              <label
                htmlFor="oldPassword"
                // className={`input-label-sm ${
                //   thirdPartyProvider
                //     ? "input-label-disabled"
                //     : "input-label-default"
                // }`}
              >
                Old Password*
              </label>
              <div
                className={`input-container`}
              >
                <input
                  type={showValue.currentPassword ? "text" : "password"}
                  placeholder="Insert your password"
                  id="oldPassword"
                  className="grow"
                  onChange={(event) => {
                    if (!thirdPartyProvider) {
                      if (!changes) setChanges(true);
                      setCurrentPassword(event.target.value);
                    }
                  }}
                  value={currentPassword}
                  disabled={thirdPartyProvider}
                />
                <div
                  className="h-4 w-4 aspect-square overflow-hidden text-light-neutral-900 cursor-pointer"
                  onClick={() => {
                    if (!thirdPartyProvider) {
                      setShowValue((current) => ({
                        ...current,
                        currentPassword: !current.currentPassword,
                      }));
                    }
                  }}
                >
                  {showValue.currentPassword ? <EyeIcon /> : <Eye_OffIcon />}
                </div>
              </div>
            </div>
            <div></div>
            <div className={`input-div-md ${
                  thirdPartyProvider
                    ? "input-div-disabled"
                    : errors?.newPassword
                    ? "input-div-error"
                    : "input-div-no-error"
                }`}>
              <label
                htmlFor="newPassword "
                className={``}
              >
                New Password*
              </label>
              <div
                className={`input-container`}
              >
                <input
                  type={showValue.newPassword ? "text" : "password"}
                  placeholder="Create new password"
                  id="newPassword"
                  className="grow"
                  onChange={(event) => {
                    if (!thirdPartyProvider) {
                      if (!changes) setChanges(true);
                      setNewPassword(event.target.value);
                    }
                  }}
                  value={newPassword}
                  disabled={thirdPartyProvider}
                />
                <div
                  className="h-4 w-4 aspect-square overflow-hidden text-light-neutral-900 cursor-pointer"
                  onClick={() => {
                    if (!thirdPartyProvider) {
                      setShowValue((current) => ({
                        ...current,
                        newPassword: !current.newPassword,
                      }));
                    }
                  }}
                >
                  {showValue.newPassword ? <EyeIcon /> : <Eye_OffIcon />}
                </div>
              </div>
            </div>
            <div className={`input-div-md ${
                  thirdPartyProvider
                    ? "input-div-disabled"
                    : errors?.confirmNewPassword
                    ? "input-div-error"
                    : "input-div-no-error"
                }`}>
              <label
                htmlFor="confirmPassword"
                className={``}
              >
                Confirm Password*
              </label>
              <div
                className={`input-container`}
              >
                <input
                  type={showValue.confirmNewPassword ? "text" : "password"}
                  placeholder="Re-enter the new password"
                  id="confirmPassword"
                  className="grow"
                  value={confirmPassword}
                  onChange={(event) => {
                    if (!thirdPartyProvider) {
                      if (!changes) setChanges(true);
                      setConfirmPassword(event.target.value);
                    }
                  }}
                  disabled={thirdPartyProvider}
                />
                <div
                  className="h-4 w-4 aspect-square overflow-hidden text-light-neutral-900 cursor-pointer"
                  onClick={() => {
                    if (!thirdPartyProvider) {
                      setShowValue((current) => ({
                        ...current,
                        confirmNewPassword: !current.confirmNewPassword,
                      }));
                    }
                  }}
                >
                  {showValue.confirmNewPassword ? <EyeIcon /> : <Eye_OffIcon />}
                </div>
              </div>
            </div>
          </div>
          {changes &&
            !thirdPartyProvider &&
            currentPassword &&
            newPassword &&
            confirmPassword && (
              <div className="flex">
                <Alert
                  type="warning"
                  hideShowMoreOption={true}
                  hideCloseOption={true}
                >
                  <span>
                    Changing password will logout of all sessions expect this
                    current browser
                  </span>
                </Alert>
              </div>
            )}
          <button
            className={`w-fit button-md-2 ${
              changes &&
              !thirdPartyProvider &&
              currentPassword &&
              newPassword &&
              confirmPassword
                ? "button-primary"
                : "button-inactive"
            }`}
            onClick={handleChangePassword}
          >
            Change password
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
                    You cannot change your password as your account is connected
                    to your
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

export default SecurityLoginPasswordChange;
