import DisplayModel from "./DisplayModel";
import ModelUploadPage from "./ModelUploadPage";

const MyModels = ({ queries }) => {
  console.log("queries", queries);
  if (queries.length === 0) {
    return <DisplayModel />;
  } else if (queries[0] === "upload") {
    return (
      <ModelUploadPage modelId={queries[1]} currentUploadPage={queries[2]} />
    );
  } else {
    return <></>;
  }
};
export default MyModels;
