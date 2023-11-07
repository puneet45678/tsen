import ThirdPartyEmailPasswordReact from "supertokens-auth-react/recipe/thirdpartyemailpassword";
import EmailVerification from "supertokens-auth-react/recipe/emailverification";
import SessionReact from "supertokens-auth-react/recipe/session";
import { appInfo } from "./appInfo";
import Router from "next/router";
import store from "../store/store";
import userSlice, { getCurrentUser } from "../store/userSlice";

export let userEmail = null;

export let frontendConfig = null;

if (
  process.env.NEXT_PUBLIC_ENV &&
  process.env.NEXT_PUBLIC_ENV === "development"
) {
  console.log("development");
  frontendConfig = () => {
    return {
      appInfo,
      enableDebugLogs: true,
      recipeList: [
        EmailVerification.init(),
        ThirdPartyEmailPasswordReact.init({
          onHandleEvent: async (context) => {
            console.log("context signin/up", context);
            if (context.action === "SUCCESS") {
              const userResponse = await getCurrentUser(context.user.id);
              console.log("userResponse.username", userResponse.username);
              console.log("userResponse", userResponse);
              store.dispatch(userSlice.actions.changeUser(userResponse));
            }
          },
          signInAndUpFeature: {
            providers: [
              ThirdPartyEmailPasswordReact.Google.init(),
              ThirdPartyEmailPasswordReact.Facebook.init(),
            ],
          },
          getRedirectionURL: async (context) => {
            console.log("redirection URL", context);
            if (context.action === "SUCCESS") {
              if (context.isNewRecipeUser) {
                return context.redirectToPath
                  ? `/welcome?redirectToPath=${context.redirectToPath}`
                  : `/welcome`;
              }
              return context.redirectToPath ? context.redirectToPath : "/home";
            }
            return "/login";
          },
        }),
        SessionReact.init({
          sessionTokenFrontendDomain: `${process.env.NEXT_PUBLIC_FRONTEND_DOMAIN}`,
        }),
      ],
      windowHandler: (oI) => {
        return {
          ...oI,
          location: {
            ...oI.location,
            setHref: (href) => {
              Router.push(href);
            },
          },
        };
      },
    };
  };
} else {
  console.log("local");
  frontendConfig = () => {
    return {
      appInfo,
      enableDebugLogs: true,
      recipeList: [
        EmailVerification.init(),
        ThirdPartyEmailPasswordReact.init({
          onHandleEvent: async (context) => {
            console.log("context signin/up", context);
            console.log("context.action", context.action);

            if (context.action === "SUCCESS") {
              const userResponse = await getCurrentUser(context.user.id);
              console.log("userResponse.username", userResponse.username);
              console.log("userResponse", userResponse);
              store.dispatch(userSlice.actions.changeUser(userResponse));
            }
          },
          signInAndUpFeature: {
            providers: [
              ThirdPartyEmailPasswordReact.Google.init(),
              ThirdPartyEmailPasswordReact.Facebook.init(),
            ],
          },
          getRedirectionURL: async (context) => {
            console.log("redirection URL", context);
            if (context.action === "SUCCESS") {
              if (context.isNewRecipeUser) {
                return context.redirectToPath
                  ? `/welcome?redirectToPath=${context.redirectToPath}`
                  : `/welcome`;
              }
              return context.redirectToPath ? context.redirectToPath : "/home";
            }
            return "/login";
          },
        }),
        SessionReact.init(),
      ],
      windowHandler: (oI) => {
        return {
          ...oI,
          location: {
            ...oI.location,
            setHref: (href) => {
              Router.push(href);
            },
          },
        };
      },
    };
  };
}
