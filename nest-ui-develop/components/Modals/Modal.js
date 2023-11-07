
import React from "react";
import { Modal } from "react-responsive-modal";

const ReactModal = ({styles,...props}) => {
  return (
    <Modal
      {...props}
      styles={{
        ...styles,
        root: {
            zIndex:styles?.root?.zIndex || "30",
        },
        overlay: {
          ...styles?.overlay,
          background: "#101828E5",
        },
      }}
    >
      {props.children}
    </Modal>
  );
};

export default ReactModal;
