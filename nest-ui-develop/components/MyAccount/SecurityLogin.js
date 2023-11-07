import React, { useEffect, useState } from "react";
import SecurityLoginPasswordChange from "./SecurityLoginPasswordChange";
import SecurityLoginEmailChange from "./SecurityLoginEmailChange";
import SecurityLoginActivity from "./SecurityLoginActivity";
import SecurityLoginDeleteAccount from "./SecurityLoginDeleteAccount";
import { useRouter } from "next/router";
import Session from "supertokens-auth-react/recipe/session";

const SecurityLogin = (props) => {
  const router = useRouter();
  const [changePasswordChanges, setChangePasswordChanges] = useState(false);
  const [changeEmailChanges, setChangeEmailChanges] = useState(false);
  const [thirdPartyProvider, setThirdPartyProvider] = useState(null);
  const [currentSessionHandle, setCurrentSessionHandle] = useState();

  // useEffect(()=>{
  //   props.accountInfoInView=false;
  // },[])

  useEffect(() => {
    (async () => {
      if (await Session.doesSessionExist()) {
        const payload = await Session.getAccessTokenPayloadSecurely();
        if (payload?.third_party_info?.id) {
          setThirdPartyProvider(payload.third_party_info.id);
        }
        if (payload?.sessionHandle) {
          setCurrentSessionHandle(payload.sessionHandle);
        }
      }
    })();
  }, []);

  useEffect(() => {
    const handleBeforeRouteChange = (url) => {
      if ((changePasswordChanges, changeEmailChanges)) {
        if (!url.startsWith(`/settings/my-profile`)) {
          const shouldPreventRouteChange = window.confirm(
            "Are you sure you want to leave this page? Changes you made may not be saved."
          );
          if (!shouldPreventRouteChange) {
            throw "Route change aborted";
          }
        }
      }
    };
    router.events.on("beforeHistoryChange", handleBeforeRouteChange);
    return () => {
      router.events.off("beforeHistoryChange", handleBeforeRouteChange);
    };
  }, [changePasswordChanges, changeEmailChanges, router.events]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };
    if (changePasswordChanges || changeEmailChanges) {
      window.addEventListener("beforeunload", handleBeforeUnload);
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [changePasswordChanges, changeEmailChanges]);

  return (
    <div className="flex flex-col gap-[24px] w-full ">
      <div ref={props.changePasswordRef}>
        <SecurityLoginPasswordChange
          changes={changePasswordChanges}
          setChanges={setChangePasswordChanges}
          thirdPartyProvider={thirdPartyProvider}
        />
      </div>
      <div ref={props.changeEmailRef}>
        <SecurityLoginEmailChange
          data={{}}
          changes={changeEmailChanges}
          setChanges={setChangeEmailChanges}
          thirdPartyProvider={thirdPartyProvider}
        />
      </div>
      <div ref={props.loginActivityRef}>
        <SecurityLoginActivity
          data={{}}
          setData={{}}
          currentSessionHandle={currentSessionHandle}
        />
      </div>
      <div ref={props.deleteAccountRef}>
        <SecurityLoginDeleteAccount data={{}} setData={{}} />
      </div>
    </div>
  );
};

export default SecurityLogin;
