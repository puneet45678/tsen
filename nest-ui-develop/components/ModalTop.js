import { useEffect, useRef } from "react";

const ModalTop = ({ children, closeModal }) => {
  const modalRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target) &&
        closeModal
      ) {
        closeModal();
      }
    };

    const handleKeyEvent = (event) => {
      console.log("event", event);
      if (modalRef?.current) {
        if (event.key !== "Tab") {
          event.preventDefault();
          return;
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyEvent);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyEvent);
    };
  }, []);

  return (
    <div className="fixed w-[100vw] h-[100vh] top-0 left-0 z-40 bg-cropper-background flex items-start justify-center pt-16">
      <div className="flex justify-center h-fit max-h-full w-full overflow-y-auto py-5">
        <div ref={modalRef} className="w-fit h-fit">
          {children}
        </div>
      </div>
    </div>
  );
};
export default ModalTop;
