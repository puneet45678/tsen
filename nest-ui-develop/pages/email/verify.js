import Image from "next/image";
import React, { useEffect, useState } from "react";
import Session from "supertokens-auth-react/recipe/session";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { EmailVerificationClaim } from "supertokens-web-js/recipe/emailverification";
import axios from "axios";
const ModelViewer = dynamic(() => import("../../components/ModelViewer"), {
  ssr: false,
});

const SignupVerify = () => {
  const defaultRemainingSeconds = 60;
  const router = useRouter();

  const [remainingTime, setRemainingTime] = useState(defaultRemainingSeconds); // Seconds
  const [email, setEmail] = useState("");

  const handleResendEmail = () => {
    if (!email) return;
    setRemainingTime(defaultRemainingSeconds);
    axios
      .post(
        `${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/send-verification-email/${email}`,
        {},
        { withCredentials: true }
      )
      .then((res) => {
        console.timeLog("res", res);
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  useEffect(() => {
    (async () => {
      if (await Session.doesSessionExist()) {
        let validationErrors = await Session.validateClaims();
        console.log("validationErrors", validationErrors);
        let isEmailVerified = true;
        if (validationErrors.length !== 0) {
          for (const err of validationErrors) {
            if (err.validatorId === EmailVerificationClaim.id) {
              isEmailVerified = false;
            }
          }
        }
        if (!isEmailVerified) {
          const payload = await Session.getAccessTokenPayloadSecurely();
          setEmail(payload?.user_info?.email);
        } else {
          router.push("/home");
        }
      } else {
        router.push("/login");
      }
    })();
  }, []);

  useEffect(() => {
    let timeoutId = null;
    if (remainingTime > 0) {
      timeoutId = setTimeout(() => {
        setRemainingTime((current) => current - 1);
      }, 1000);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [remainingTime]);

  return (
    <div className="grid grid-cols-[45%_55%] w-full min-h-full">
      <div className="w-full h-full relative">
        <Image
          src="/images/onboarding/Background.png"
          className="object-cover object-center"
          fill
        />
        <div className="absolute w-full h-full z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <ModelViewer
            item="/models/3.glb"
            styles={{
              height: "100%",
              width: "100%",
            }}
          />
        </div>
      </div>
      <div className="flex-center w-full">
        <div className="flex flex-col gap-[100px] w-full max-w-[550px]">
          <div className="flex flex-col gap-12">
            {/* <Image /> */}
            <div className="flex flex-col gap-3">
              <h1 className="text-dark-neutral-700 text-headline-lg font-bold">
                Check your inbox and <br />
                confirm your email address
              </h1>
              <p className="text-sm font-medium text-primary-purple-500">
                {email}
              </p>
            </div>
          </div>
          <div>
            <span className="text-md text-dark-neutral-400">
              Please click the link in email to verify your email address
            </span>
          </div>
          <div className="flex flex-col gap-3">
            <span className="text-xl text-dark-neutral-400 font-medium">
              Not receive the link?
            </span>
            <p className="text-sm">
              {/* <span className="text-dark-neutral-200">
                You can resend the email{" "}
              </span>
              <span className="text-primary-purple-500">
                {`${parseInt(remainingTime / 60)}:${
                  remainingTime % 60 < 10
                    ? `0${remainingTime % 60}`
                    : remainingTime % 60
                }`}
              </span> */}
              {remainingTime <= 0 ? (
                <button
                  onClick={handleResendEmail}
                  className="text-primary-purple-500"
                >
                  Resend Email
                </button>
              ) : (
                <>
                  <span className="text-dark-neutral-200">
                    You can resend the email
                  </span>{" "}
                  <span className="text-primary-purple-500">{`${parseInt(
                    remainingTime / 60
                  )}:${
                    remainingTime % 60 < 10
                      ? `0${remainingTime % 60}`
                      : remainingTime % 60
                  }`}</span>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupVerify;
