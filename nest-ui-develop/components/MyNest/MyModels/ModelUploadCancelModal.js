import ModalTop from "../../ModalTop";
import CancelIcon from "../../../icons/CancelIcon";

const ModelUploadCancelModal = (props) => {
  return (
    <ModalTop closeModal={props.closeModal}>
      <div className="flex gap-3 px-5 py-7 bg-white max-w-[50vw] rounded-[5px]">
        <div className="grid gap-10 grow">
          <h3 className="text-[20px] font-medium">
            Cancel submission / upload
          </h3>
          <p>
            Would you like to save your progress as a draft or discard the
            changes and close the form?
          </p>
          <div className="block">
            <div className="float-right flex gap-2 h-10">
              <button
                className="border-[1px] border-black h-full px-5 rounded-[5px]"
                onClick={props.cancelHandler}
              >
                Discard & Close
              </button>
              <button
                className="bg-black text-white h-full px-5 rounded-[5px]"
                onClick={props.saveAsDraftHandler}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
        <div className="h-6 w-6 cursor-pointer" onClick={props.closeModal}>
          <CancelIcon />
        </div>
      </div>
    </ModalTop>
  );
};
export default ModelUploadCancelModal;
