import React, { useState, useRef } from "react";
import SectionLayout from "../Layouts/SectionLayout";
import ReactModal from "../Modals/Modal";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { updateUserStatus } from "../../store/userSlice";
import UploadcareImage from "@uploadcare/nextjs-loader";
import CircularLoading from "../skeletons/CircularLoading";
import axios from "axios";
import Alert from "../Alerts/Alert";

const SecurityLoginDeleteAccount = () => {
  const router = useRouter();
  const modalRef = useRef();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const hasDeletionFlowAlreadyStarted = user?.accountInformation?.accountType
    ? user.accountInformation.accountType === "3DA" &&
      user.status === "initiated_deletion"
      ? true
      : user.accountInformation.accountType === "3DP" &&
        user.status === "marked_for_deletion"
      ? true
      : false
    : false;

  const [showDeletionModal, setShowDeletionModal] = useState(false);
  const [showRequestReceivedModal, setShowRequestReceivedModal] =
    useState(false);
  const [showButtonLoader, setShowButtonLoader] = useState(false);

  const handleDeleteMyAccountClick = () => {
    if (showButtonLoader) return;
    if (
      user?.accountInformation?.accountType &&
      user.accountInformation.accountType === "3DP"
    ) {
      router.push("/delete-account");
    } else if (
      user?.accountInformation?.accountType &&
      user.accountInformation.accountType === "3DA"
    ) {
      setShowButtonLoader(true);
      axios
        .post(
          `${process.env.NEXT_PUBLIC_USER_SERVICE_URL}/api/v1/user/initiate-deletion`,
          {},
          { withCredentials: true }
        )
        .then((res) => {
          console.log("res", res);
          dispatch(updateUserStatus("initiated_deletion"));
          setShowButtonLoader(false);
          setShowRequestReceivedModal(true);
          setShowDeletionModal(false);
        })
        .catch((err) => {
          console.log("err", err);
          setShowButtonLoader(false);
        });
    }
  };

  return (
    <>
      {showDeletionModal && (
        <ReactModal
          // ref={modalRef}
          initialFocusRef={modalRef}
          classNames={{
            modalContainer: "flex-center",
            modal: "rounded-[10px]",
          }}
          open={showDeletionModal}
          onClose={() => setShowDeletionModal(false)}
        >
          <div className="grid gap-8 p-6">
            <div className="grid gap-3">
              <h6 className="text-headline-2xs font-semibold text-dark-neutral-700">
                Delete account?
              </h6>
              <p className="text-xl text-dark-neutral-50">
                We will email you a link shortly.Follow this link to delete your
                profile
              </p>
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeletionModal(false)}
                className="button-md-2 button-default w-fit"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteMyAccountClick}
                disabled={showButtonLoader}
                className="button-md-2 button-error w-[170px]"
              >
                {showButtonLoader ? (
                  <CircularLoading />
                ) : (
                  <>Delete my account</>
                )}
              </button>
            </div>
          </div>
        </ReactModal>
      )}
      {showRequestReceivedModal && (
        <ReactModal
          ref={modalRef}
          initialFocusRef={modalRef}
          closeOnOverlayClick={false}
          classNames={{
            modalContainer: "flex-center",
            modal: "rounded-[10px]",
          }}
          open={showRequestReceivedModal}
          onClose={() => setShowRequestReceivedModal(false)}
        >
          <div className="grid justify-items-center gap-12 p-12">
            <UploadcareImage
              src="/images/Inbox cleanup-amico 1.svg"
              alt=""
              width={166}
              height={166}
            />
            <div className="flex-center flex-col gap-9">
              <div className="grid gap-3 text-center">
                <h6 className="text-dark-neutral-700 text-headline-xs font-semibold">
                  We’ve received your deletion request
                </h6>
                <p>We’ll contact you at @{user.email}</p>
              </div>
              <button
                onClick={() => setShowRequestReceivedModal(false)}
                className="button-md-2 button-primary w-fit"
              >
                Ok, got it
              </button>
            </div>
          </div>
        </ReactModal>
      )}
      <div className="scroll-mt-[120px]" id="deleteAccount">
        <SectionLayout
          heading="Delete Account"
          subHeading="Permanently remove your account and all associated data from our platform."
        >
          <div className="flex flex-col gap-[12px]">
            <span className="text-dark-neutral-700 text-lg font-[400]">
              Deleting your account will delete all of your products and product
              files, as well as any credit card and payout information
            </span>
            <span
              onClick={() => {
                if (!hasDeletionFlowAlreadyStarted) {
                  setShowDeletionModal(true);
                }
              }}
              className={`text-sm font-semibold ${
                hasDeletionFlowAlreadyStarted
                  ? "text-light-neutral-700"
                  : "text-red-600 hover:underline cursor-pointer"
              }`}
            >
              I want to delete my account
            </span>
          </div>
          {hasDeletionFlowAlreadyStarted &&
            user?.accountInformation?.accountType === "3DA" && (
              <Alert
                type="info"
                size="sm"
                hideShowMoreOption={true}
                hideCloseOption={true}
              >
                <span>
                  Your account deletion request is already in progress. If you
                  have any questions or concerns, please contact us at Help and
                  Support.
                </span>
              </Alert>
            )}
        </SectionLayout>
      </div>
    </>
  );
};

export default SecurityLoginDeleteAccount;
