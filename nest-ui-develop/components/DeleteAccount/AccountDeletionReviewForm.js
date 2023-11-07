import ArrowRight from "../../icons/ArrowRight";
import AccountDeletionRadioInput from "./AccountDeletionRadioInput";

const AccountDeletionReviewForm = ({
  selectedIssue,
  setSelectedIssue,
  comment,
  setComment,
  handleSubmit,
}) => {
  const reasonOptions = [
    {
      title: "Privacy concerns",
      value: "privacy concerns",
      id: "privacyConcerns",
    },
    {
      title: "Lack of relevant content",
      value: "lack of relevant content",
      id: "LackOfRelevantContent",
    },
    {
      title: "Technical issues or difficulties",
      value: "technical issues or difficulties",
      id: "technicalIssuesOrDifficulties",
    },
    {
      title: "Competition or alternative platforms",
      value: "competition or alternative platforms",
      id: "competitionOrAlternativePlatforms",
    },
    {
      title: "Dissatisfaction with platform features",
      value: "dissatisfaction with platform features",
      id: "dissatisfactionWithPlatformFeatures",
    },
    {
      title: "Dissatisfactory User experience",
      value: "dissatisfactory user experience",
      id: "dissatisfactoryUserExperience",
    },
    {
      title: "Difficulty reaching out to customer support",
      value: "difficulty reaching out to customer support",
      id: "difficultyReachingOutToCustomerSupport",
    },
    {
      title: "Other (Please specify)",
      value: "other",
      id: "other",
    },
  ];

  const isButtonDisabled = selectedIssue
    ? selectedIssue === "OTHER"
      ? comment && comment.length > 0
        ? false
        : true
      : false
    : true;

  const handleRadioChange = (event) => {
    setSelectedIssue(event.target.value);
  };

  const handleDeleteButtonClick = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <div className=" bg-light-neutral-50 px-[212px] py-12 font-sans text-dark-neutral-700">
        <div className="text-headline-md font-semibold font-sans ">
          Delete account
        </div>
        <div className="mt-12 text-headline-xs font-semibold ">
          We’re sorry to see you go
        </div>
        <div className="mt-3 text-xl font-[400] text-dark-neutral-200">
          To help us improve our services, please tell us why you want to close
          your account(select all that apply).
        </div>

        <div className="mt-12 flex items-end">
          <form
            action=""
            className="text-dark-neutral-700 text-lg  font-sans  font-medium"
          >
            {reasonOptions.map((reason, index) => (
              <fieldset key={`reason-${index}`} className="flex items-end">
                <AccountDeletionRadioInput
                  title={reason.title}
                  value={reason.value}
                  id={reason.id}
                  onChange={handleRadioChange}
                  comment={comment}
                  setComment={setComment}
                />
              </fieldset>
            ))}
            <span className="relative">
              <button
                className={`mt-12 text-button-text-md font-semibold ${
                  isButtonDisabled
                    ? "bg-light-neutral-700 cursor-not-allowed"
                    : "bg-primary-purple-500"
                } text-white px-[18px] py-[11px] border rounded-[6px] flex items-center`}
                disabled={isButtonDisabled}
                onClick={handleSubmit}
              >
                Continue : Deleting your account
                <span className="w-[20px] h-[20px] ml-[6px]">
                  <ArrowRight />
                </span>
              </button>
            </span>
          </form>
        </div>
      </div>
    </>
  );
};

export default AccountDeletionReviewForm;
