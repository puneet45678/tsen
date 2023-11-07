import React, { useState, useEffect } from "react";
import MyNestPortfolioDisplay from "./MyNestPortfolioDisplay";
import MyNestPortfolioCreationPage from "./MyNestPortfolioCreationPage";

const Portfolio = ({ queries }) => {
  if (queries.length === 0) {
    return <MyNestPortfolioDisplay />;
  } else if (queries[1] === "create") {
    return <MyNestPortfolioCreationPage />;
  } else {
    return <></>;
  }
};

export default Portfolio;

