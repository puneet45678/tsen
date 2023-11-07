import { useState, useEffect } from "react";
import "@google/model-viewer";

const ModelViewer = (props) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const modelViewer = document.getElementById("model-viewer");
    modelViewer.addEventListener("load", (event) => {
      setIsVisible(true);
    });
  }, []);

  return (
    <>
      <div className={`h-full w-full ${isVisible ? "" : "hidden"}`}>
        <model-viewer
          id="model-viewer"
          key={props.key}
          style={{ ...props.styles }}
          src={props.item}
          loading="eager"
          shadow-intensity="1"
          camera-controls
          min-field-of-view="20deg"
          max-field-of-view="60deg"
          min-camera-orbit="auto auto 200%"
          max-camera-orbit="auto auto 100%"
          touch-action="pan-y pinch-zoom"
          camera-orbit="calc(-0.25rad + env(window-scroll-y) * 12rad) calc(90deg + env(window-scroll-y) * 45deg) calc(10m - env(window-scroll-y) * 10m)"
        ></model-viewer>
      </div>
      <div className={`${!isVisible ? "" : "hidden"}`}>Loading</div>
    </>
  );
};

export default ModelViewer;
