import { useState } from "react";
import AccountDeletionConfirmation from "../components/DeleteAccount/AccountDeletionConfirmation";
import AccountDeletionReviewForm from "../components/DeleteAccount/AccountDeletionReviewForm";
import axios from "axios";
import { useDispatch } from "react-redux";
import { clearUser } from "../store/userSlice";
import { useRouter } from "next/router";

export default function DeleteAccount() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [comment, setComment] = useState("");
  const [requestData, setRequestData] = useState(false);
  const [showDeletionConfirmationSection, setShowDeletionConfirmationSection] =
    useState(false);

  // useEffect(() => {
  //   if (selectedIssue) {
  //     if (selectedIssue === "OTHER" && comment && comment.length > 0)
  //       setShowDeletionConfirmationSection(true);
  //   }
  // }, [selectedIssue, comment]);

  const handleReasonSubmission = () => {
    const isInputValid = selectedIssue
      ? selectedIssue === "OTHER"
        ? comment && comment.length > 0
          ? true
          : false
        : true
      : false;
    if (isInputValid) {
      setShowDeletionConfirmationSection(true);
    }
  };

  const handleDeletionConfirmation = () => {
    console.log("selectedIssue", selectedIssue, "comment", comment);
    const data = {
      reason: selectedIssue,
      comment: comment,
      getData: requestData,
    };
    axios
      .post(
        `${process.env.NEXT_PUBLIC_USER_SERVICE_URL}/api/v1/user/delete`,
        data,
        { withCredentials: true }
      )
      .then((res) => {
        console.log("res", res);
        // TODO: do we have to log out user?
        axios
          .post(`${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/signout`)
          .then((res) => {
            dispatch(clearUser());
            router.push("/home");
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  return (
    <>
      {showDeletionConfirmationSection ? (
        <AccountDeletionConfirmation
          requestData={requestData}
          setRequestData={setRequestData}
          handleSubmit={handleDeletionConfirmation}
        />
      ) : (
        <AccountDeletionReviewForm
          selectedIssue={selectedIssue}
          setSelectedIssue={setSelectedIssue}
          comment={comment}
          setComment={setComment}
          handleSubmit={handleReasonSubmission}
        />
      )}
    </>
  );
}

export const getServerSideProps = async (context) => {
  if (
    !context.req.cookies["sFrontToken"] ||
    !context.req.cookies["sAccessToken"]
  ) {
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
