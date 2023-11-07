import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import parse from "html-react-parser";
import { useEffect } from "react";
import axios from "axios";
import Image from "next/image";

const WebPushComponent = ({
  title,
  body,
  image,
  open,
  setOpen,
  getMessage,
}) => {
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);
  console.log("Title: ", title, "Body: ", body);

  useEffect(() => {
    console.log("image", image);
  }, []);

  return (
    <div className="rounded-md bg-black">
      <Modal
        open={open}
        onClose={onCloseModal}
        center
        classNames={{
          overlayAnimationIn: "customEnterOverlayAnimation",
          overlayAnimationOut: "customLeaveOverlayAnimation",
          modalAnimationIn: "customEnterModalAnimation",
          modalAnimationOut: "customLeaveModalAnimation",
          modal: "customModal",
        }}
      >
        <div className="flex gap-4">
          <div className="w-[480px] h-[280px] rounded-md flex flex-col gap-4">
            <h4 className="text-black mx-auto">{title}</h4>
            <Image
              width={150}
              height={150}
              src={image}
              alt="Notification Image"
            />
            {parse(body)}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default WebPushComponent;
