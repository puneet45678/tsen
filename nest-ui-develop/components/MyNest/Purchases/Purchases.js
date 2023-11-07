import ModelPurchases from "./ModelPurchases";
import CampaignPurchases from "./CampaignPurchases";

const MyNestPurchases = ({ queries }) => {
  const [page, ...pageQueries] = queries;
  console.log("page", page);
  if (page === "models") return <ModelPurchases />;
  else if (page === "campaigns")
    return <CampaignPurchases queries={pageQueries} />;
  else return <></>;
};

export default MyNestPurchases;
