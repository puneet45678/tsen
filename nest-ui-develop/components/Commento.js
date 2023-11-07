import Script from "next/script";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const Commento = (props) => {
  const [rendered, setRendered] = useState(false);
  const [button, setButton] = useState();
  const commentoRef = useRef();
  let btn = useRef();

  useEffect(() => {
    if (!window || rendered) {
      return;
    }
    console.log("in commento use effect");
    const script = document.createElement("script");
    script.src = "http://localhost:3002/js/commento.js";
    // script["data-id-root"] = "about-the-campaign-updates2";
    script.setAttribute("data-id-root", props.id);
    script.setAttribute("data-hide-deleted", true);
    script.setAttribute("data-page-id", props.url);
    script.async = true;
    // const script = (
    //   <script
    //     src="http://localhost:8080/js/commento.js"
    //     data-id-root="about-the-campaign-comments"
    //     data-hide-deleted={true}
    //     data-page-id={`/about-the-campaign/1/comments`}
    //     defer
    //   />
    // );
    // const script = (
    //   <Script
    //     src="http://localhost:8080/js/commento.js"
    //     data-id-root="about-the-campaign-comments"
    //     data-hide-deleted={true}
    //     data-page-id={`/about-the-campaign/1/comments`}
    //   />
    // );
    // const script = document.createElement("script", {
    //   src: "http://localhost:8080/js/commento.js",
    //   "data-id-root": "about-the-campaign-comments",
    //   "data-page-id": `/about-the-campaign/1/comments`,
    // });
    const comments = document.getElementById("comments-container");
    console.log("comments", comments, "script", script);
    console.log("has children", comments.hasChildNodes());
    if (comments) comments.appendChild(script);
    setRendered(true);
    console.log("children", comments.children);

    setTimeout(() => {
      // btn.current = document.getElementById("commento-submit-button-root");
      console.log(
        "button",
        document.getElementById("commento-submit-button-root")
      );
    }, 1000);
    return () => {
      comments.removeChild(script);
      setRendered(false);
      setButton(null);
      console.log("in remove", comments.children);
    };
  }, [props.id]);
  useEffect(() => {
    // console.log("commentoRef", commentoRef);
    // if (
    //   commentoRef.current === undefined ||
    //   commentoRef.current === null ||
    //   commentoRef.current === ""
    // ) {
    //   console.log("in commnetoRef return");
    //   return;
    // }
    // let mainArea = null,
    //   superContainer = null,
    //   guestInput = null;
    // console.log("here");
    // if (
    //   commentoRef.current.children.length === undefined ||
    //   commentoRef.current.children.length === null ||
    //   commentoRef.current.children.length === "" ||
    //   commentoRef.current.children.length <= 0
    // ) {
    //   console.log("in children return", commentoRef.current.children);
    //   return;
    // }
    // for (let child of commentoRef.current.children) {
    //   if (child.id === "commento-main-area") {
    //     mainArea = child;
    //     break;
    //   }
    // }
    // console.log("mainArea", mainArea);
    // if (
    //   mainArea.current.children.length === undefined ||
    //   mainArea.current.children.length === null ||
    //   mainArea.current.children.length === "" ||
    //   mainArea.current.children.length <= 0
    // )
    //   return;
    // for (let child of mainArea.children) {
    //   if (child.id === "commento-textarea-super-container-root") {
    //     superContainer = child;
    //     break;
    //   }
    // }
    // console.log("superContainer", superContainer);
    // if (
    //   superContainer.current.children.length === undefined ||
    //   superContainer.current.children.length === null ||
    //   superContainer.current.children.length === "" ||
    //   superContainer.current.children.length <= 0
    // )
    //   return;
    // for (let child of superContainer.children) {
    //   if (child.id === "commento-guest-details-root") {
    //     guestInput = child;
    //     break;
    //   }
    // }
    // console.log("guestInput", guestInput);
    // if (
    //   guestInput.current === undefined ||
    //   guestInput.current === null ||
    //   guestInput.current === ""
    // )
    //   return;
    // console.log("guestInput2", guestInput);
    // guestInput.current.value = "testing name";
    console.log("btn", btn);
  }, [btn]);

  // useEffect(() => {
  //   const button = document.getElementById("commento-submit-button-root");
  //   const testfunc = async () => {
  //     const formData = new FormData();
  //     formData.append("commenterToken", "anonymous");
  //     formData.append("domain", "localhost:3000");
  //     formData.append("path", "/about-the-campaign/1");
  //     const response = await fetch("http://localhost:3002/api/comment/list", {
  //       method: "POST",
  //       mode: "cors",
  //       cache: "no-cache",
  //       credentials: "same-origin",
  //       headers: {
  //         "Content-Type": "application/x-www-form-urlencoded",
  //       },
  //       body: formData, // body data type must match "Content-Type" header
  //     });
  //     return response.json();
  //   };
  //   if (button !== null && button !== undefined && button !== "") {
  //     button.addEventListener("click", async (event) => {
  //       console.log("clicked");
  //       console.log(testfunc());
  //       event.stopPropagation();
  //     });
  //   }
  // }, [document.getElementById("commento-submit-button-root")]);

  return (
    <>
      <div id="comments-container"></div>
      <div id="commento" className="hidden"></div>
      <div id={props.id} ref={commentoRef}></div>
      {/* <div id={id} /> */}
    </>
  );
};
export default Commento;
