import ThirdPartyEmailPasswordNode from "supertokens-node/recipe/thirdpartyemailpassword";
import EmailVerification from "supertokens-web-js/recipe/emailverification";
import SessionNode from "supertokens-node/recipe/session";
import { appInfo } from "./appInfo";
// import { EmailVerificationClaim } from "supertokens-web-js/recipe/emailverification";

export const backendConfig = () => {
  return {
    framework: "express",
    supertokens: {
      // https://try.supertokens.com is for demo purposes. Replace this with the address of your core instance (sign up on supertokens.com), or self host a core.
      connectionURI: process.env.NEXT_PUBLIC_SUPERTOKENS_CONNECTION_URI,
      // apiKey: <API_KEY(if configured)>,
    },
    appInfo,
    recipeList: [
      // EmailVerification.init(),
      ThirdPartyEmailPasswordNode.init({
        // We have provided you with development keys which you can use for testing.
        // IMPORTANT: Please replace them with your own OAuth keys for production use.
        // providers: [
        //   {
        //     config: {
        //       thirdPartyId: "google",
        //       clients: [
        //         {
        //           clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        //           clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
        //         },
        //       ],
        //     },
        //   },
        //   {
        //     config: {
        //       thirdPartyId: "facebook",
        //       clients: [
        //         {
        //           clientId: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID,
        //           clientSecret: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_SECRET,
        //         },
        //       ],
        //     },
        //   },
        // ],
      }),
      SessionNode.init(),
    ],
    isInServerlessEnv: true,
  };
};
