import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import SlicerContext from "../SlicerContext";

const Slicer = (props) => {
  const router = useRouter();
  const { slicerUrl } = useContext(SlicerContext);
  console.log(slicerUrl);

  //   useEffect(() => {
  //     const handleBeforeUnload = (event) => {
  //       event.preventDefault();
  //       event.returnValue = "Your changes might not be saved. Do you want to continue?";
  //     };

  //     window.addEventListener("beforeunload", handleBeforeUnload);

  //     return () => {
  //       window.removeEventListener("beforeunload", handleBeforeUnload);
  //     };
  //   }, []);

  //   useEffect(() => {
  //     const stopContainer = () => {
  //       axios
  //         .get("http://localhost:8003/stop-container", { withCredentials: true })
  //         .then((res) => {
  //           console.log(res);
  //         })
  //         .catch((err) => {
  //           console.log(err);
  //         });
  //     };

  //     const handleVisibilityChange = () => {
  //       if (document.visibilityState === "hidden") {
  //         stopContainer();
  //       }
  //     };

  //     document.addEventListener("visibilitychange", handleVisibilityChange);

  //     return () => {
  //       document.removeEventListener("visibilitychange", handleVisibilityChange);
  //     };
  //   }, []);

  return (
    <div className="relative w-full min-h-full">
      <iframe
        src={slicerUrl}
        title="slicer-frame"
        name="slicer-frame"
        className="absolute top-0 bottom-0 min-h-full w-full"
      ></iframe>
    </div>
  );
};

export async function getServerSideProps(context) {
  if (
    !context.req.cookies["sFrontToken"] ||
    context.req.cookies["sFrontToken"] === "" ||
    !context.req.cookies["sAccessToken"] ||
    context.req.cookies["sAccessToken"] === ""
  ) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
      props: {},
    };
  }
  return {
    props: {},
  };
}

export default Slicer;
