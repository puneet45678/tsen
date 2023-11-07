import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Menu from "../../components/MyNest/Menu";
import Portfolio from "../../components/MyNest/Portfolio/Portfolio";
import Purchases from "../../components/MyNest/Purchases/Purchases";
import MyModels from "../../components/MyNest/MyModels/MyModels";
import MyCampaigns from "../../components/MyNest/MyCampaigns";
import CreateCampaign from "../../components/MyNest/CreateCampaign";
import axios from "axios";
// import Session from "supertokens-node/recipe/session";
// import supertokensNode from "supertokens-node";
// import { backendConfig } from "../../config/backendConfig";

const MyNest = () => {
  const router = useRouter();
  const { sections } = router.query;
  const [page, ...queries] = router.query?.sections
    ? router.query.sections
    : [];

  const [changesToPage, setChangesToPage] = useState(false);

  // TODO add condition to handle invalid urls
  return (
    <div className="flex relative h-full">
      <div className="h-full">
        <Menu
          page={page}
          queries={queries}
          changesToPage={changesToPage}
          setChangesToPage={setChangesToPage}
        />
      </div>
      <div className="h-full w-full bg-light-neutral-50">
        {page === "portfolio" ? (
          <Portfolio queries={queries} />
        ) : page === "models" ? (
          <MyModels queries={queries} />
        ) : page === "mycampaigns" ? (
          <MyCampaigns queries={queries} />
        ) : page === "createCampaign" ? (
          <CreateCampaign
            setChangesToPage={setChangesToPage}
            queries={queries}
          />
        ) : page === "purchases" ? (
          <Purchases queries={queries} />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

// export const getServerSideProps = async (context) => {
//   const { sections } = context.params;
//   const [page, ...queries] = sections;

//   supertokensNode.init(backendConfig());
//   let session;
//   try {
//     session = await Session.getSession(context.req, context.res, {
//       overrideGlobalClaimValidators: () => {
//         return [];
//       },
//     });
//   } catch (err) {
//     if (err.type === Session.Error.TRY_REFRESH_TOKEN) {
//       return { props: { fromSupertokens: "needs-refresh" } };
//     } else if (err.type === Session.Error.UNAUTHORISED) {
//       return { props: { fromSupertokens: "needs-refresh" } };
//     }

//     throw err;
//   }
//   console.log("session1 ", session.userDataInAccessToken["st-perm"].v);
//   console.log("session2 ", session.userDataInAccessToken["st-role"].v);
//   // return {
//   //   props: { userId: session.getUserId() },
//   // };

//   if (page === "portfolio") {
//     if (queries.length !== 0 && queries.length !== 1) {
//       return {
//         notFound: true,
//       };
//     } else if (queries.length === 1 && queries[0] !== "create") {
//       return {
//         notFound: true,
//       };
//     }
//   } else if (page === "models") {
//     if (queries.length !== 0 && queries.length !== 2) {
//       return {
//         notFound: true,
//       };
//     } else if (queries.length === 2 && queries[0] !== "upload") {
//       return {
//         notFound: true,
//       };
//     }
//     // } else if (page === "campaigns") {
//     //   if (queries.length < 1 && queries.length > 3) {
//     //     return {
//     //       notFound: true,
//     //     };
//     //   } else if (
//     //     queries.length === 1 &&
//     //     queries[0] !== "models" &&
//     //     queries[0] !== "campaigns"
//     //   ) {
//     //     return {
//     //       notFound: true,
//     //     };
//     //   } else if (
//     //     (queries.length === 2 || queries.length === 3) &&
//     //     queries[0] !== "campaigns"
//     //   ) {
//     //     return {
//     //       notFound: true,
//     //     };
//     //   }
//   } else if (page === "purchases") {
//     if (queries.length === 0) {
//       return {
//         redirect: {
//           permanent: false,
//           destination: "/my-nest/purchases/models",
//         },
//       };
//     }
//     if (queries.length < 1 && queries.length > 3) {
//       return {
//         notFound: true,
//       };
//     } else if (
//       queries.length === 1 &&
//       queries[0] !== "models" &&
//       queries[0] !== "campaigns"
//     ) {
//       return {
//         notFound: true,
//       };
//     } else if (
//       (queries.length === 2 || queries.length === 3) &&
//       queries[0] !== "campaigns"
//     ) {
//       return {
//         notFound: true,
//       };
//     }
//   }

//   return {
//     props: {},
//   };
// };

export default MyNest;
