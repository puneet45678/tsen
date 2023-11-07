import { useEffect, useRef } from "react";
import CrossPortfolioDetailed from "../../../icons/CrossPortfolioDetailed";

const PortfolioDetailModal = ({ setShowDetailPortolioModal, children }) => {
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

  const handleClosePublishedModal = () => {
    setShowDetailPortolioModal(false);
    // router.push("/my-nest/portfolio");
  };

  return (
    <div className="flex items-center fixed w-[100vw] h-[100vh] top-0 left-0 z-40 bg-cropper-background">
      <div className="flex justify-center h-fit max-h-full w-full overflow-y-hidden py-[72px] mx-[60px]">
        <div ref={modalRef} className="w-full h-[calc(100vh_-104px)]">
          <div className="text-right bg-white">
            <button
              onClick={() => {
                handleClosePublishedModal();
              }}
              className=" mt-[24px] mr-[24px] w-[32px] h-[32px]"
            >
              <CrossPortfolioDetailed />
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default PortfolioDetailModal;
