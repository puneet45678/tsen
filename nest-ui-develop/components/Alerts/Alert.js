import CheckboxIcon from "../../icons/Checkbox";
import QuestionIcon from "../../icons/Question";
import AlertIcon from "../../icons/Alert";
import CheckLoadingIcon from "../../icons/CheckLoading";
import ArrowRight from "../../icons/ArrowRight";
import CloseCross from "../../icons/CloseCross";
import { useEffect } from "react";

const Alert = (props) => {
  useEffect(() => {
    let timeoutId = null;
    if (props.hideAlertAfterInterval && props.handleClose) {
      if (props.automaticCloseTimeout) {
        timeoutId = setTimeout(props.handleClose, props.automaticCloseTimeout);
      } else {
        timeoutId = setTimeout(props.handleClose, 1000);
      }
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  return (
    <div
      className={`flex items-start justify-start gap-4 rounded-[5px] shadow-xs border-[1px] ${
        props.size === "sm" ? "p-4" : "p-6"
      } ${
        props.type === "info"
          ? "border-primary-purple-500 bg-primary-purple-50"
          : props.type === "warning"
          ? "border-warning-600 bg-warning-50"
          : props.type === "error"
          ? "border-error-600 bg-error-50"
          : "border-success-600 bg-success-50"
      }`}
    >
      {props.hideAlertIcon ? (
        <></>
      ) : (
        <div
          className={`h-6 w-6 shrink-0 ${
            props.type === "info"
              ? "text-primary-purple-700"
              : props.type === "warning"
              ? "text-warning-700"
              : props.type === "error"
              ? "text-error-700"
              : "text-success-700"
          }`}
        >
          {props.type === "info" ? (
            <CheckboxIcon />
          ) : props.type === "warning" ? (
            <QuestionIcon />
          ) : props.type === "error" ? (
            <AlertIcon />
          ) : (
            <CheckLoadingIcon />
          )}
        </div>
      )}
      <div className="flex flex-col items-start gap-4">
        <div className="flex flex-col gap-2">
          {props.heading && (
            <h6
              className={`text-headline-xs font-medium ${
                props.type === "info"
                  ? "text-primary-purple-700"
                  : props.type === "warning"
                  ? "text-warning-700"
                  : props.type === "error"
                  ? "text-error-700"
                  : "text-success-700"
              }`}
            >
              {props.heading}
            </h6>
          )}
          {props.children && (
            <p
              className={`text-md ${
                props.type === "info"
                  ? "text-primary-purple-500"
                  : props.type === "warning"
                  ? "text-warning-600"
                  : props.type === "error"
                  ? "text-error-600"
                  : "text-success-600"
              }`}
            >
              {props.children}
            </p>
          )}
        </div>
        {props.hideShowMoreOption ? (
          <></>
        ) : (
          <div
            className={`flex-center gap-[6px] cursor-pointer ${
              props.type === "info"
                ? "text-primary-purple-700"
                : props.type === "warning"
                ? "text-warning-700"
                : props.type === "error"
                ? "text-error-700"
                : "text-success-700"
            }`}
          >
            <span className="text-button-text-md font-semibold">Show More</span>
            <div className="w-5 h-5">
              <ArrowRight />
            </div>
          </div>
        )}
      </div>
      {props.hideCloseOption ? (
        <></>
      ) : (
        <div
          className={`h-5 w-5 cursor-pointer shrink-0 ${
            props.type === "info"
              ? "text-primary-purple-700"
              : props.type === "warning"
              ? "text-warning-700"
              : props.type === "error"
              ? "text-error-700"
              : "text-success-700"
          }`}
          onClick={props.handleClose}
        >
          <CloseCross />
        </div>
      )}
    </div>
  );
};

export default Alert;
