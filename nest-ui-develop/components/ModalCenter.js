import { useEffect, useRef } from "react";

const ModalCenter = ({ closeModal, children }) => {
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

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex items-center fixed w-[100vw] h-[100vh] top-0 left-0 z-40 bg-cropper-background">
      <div className="flex justify-center h-fit max-h-full w-full overflow-y-auto py-5">
        <div ref={modalRef} className="w-fit h-fit">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ModalCenter;
