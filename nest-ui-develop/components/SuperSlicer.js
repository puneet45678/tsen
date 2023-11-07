import { useContext } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import SlicerContext from "../SlicerContext";

const SuperSlicer = () => {
  const router = useRouter();
  const { setSlicerUrl } = useContext(SlicerContext);

  async function callAPIClicked() {
    let url = "";
    axios
      .get(
        `${process.env.NEXT_PUBLIC_SLICER_SERVICE_URL}/aws/start-container`,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log(res);
        setSlicerUrl(res.data.url);
        router.push("/slicer");
        // window.open("http://localhost:3000/slicer")
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <button
      onClick={callAPIClicked}
      className="bg-primary-brand px-5 cursor-pointer text-white rounded-sm w-full h-full"
    >
      Super Slicer
    </button>
  );
};

export default SuperSlicer;
