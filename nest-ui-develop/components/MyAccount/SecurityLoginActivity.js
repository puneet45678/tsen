import React, { useState, useEffect } from "react";
import SectionLayout from "../Layouts/SectionLayout";
import axios from "axios";

const SecurityLoginActivity = ({ data, setData, currentSessionHandle }) => {
  const [sessions, setSessions] = useState([]);

  // TODO: redirect to login?
  const handleLogOutOfAllSessions = () => {
    axios
      .delete(`${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/sessions`, {
        withCredentials: true,
      })
      .then((res) => {
        console.log("res", res);
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const handleLogOut = (sessionHandle) => {
    axios
      .delete(
        `${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/sessions/${sessionHandle}`,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log("res", res);
        // TODO: check
        setSessions((current) =>
          current.filter((session) => session.sessionHandle !== sessionHandle)
        );
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/sessions`, {
        withCredentials: true,
      })
      .then((res) => {
        console.log("res", res);
        setSessions(res.data);
      })
      .catch((err) => {
        console.log("err", err);
      });
  }, []);
  return (
    <div className="scroll-mt-[120px]" id="loginActivity">
      <SectionLayout
        heading="Login Activity"
        subHeading="Review the devices used to login to your account"
      >
        <div className="flex flex-col gap-4">
          {sessions.map((session, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-4 px-6 rounded-[5px] border-[1px] border-light-neutral-600 shadow-xs"
            >
              <div>
                <span className="text-md font-medium text-dark-neutral-700">
                  {session.device}. {session.browser}-
                </span>{" "}
                <span className="text-md font-medium text-dark-neutral-50">
                  {session.location}
                </span>
              </div>
              {currentSessionHandle === session.sessionHandle ? (
                <span className="text-button-text-sm font-semibold text-primary-purple-500">
                  Current session
                </span>
              ) : (
                <button
                  onClick={() => handleLogOut(session.sessionHandle)}
                  className="button-xs button-primary-border w-fit"
                >
                  Log out
                </button>
              )}
            </div>
          ))}
        </div>
        <div>
          <button
            onClick={handleLogOutOfAllSessions}
            className="button-sm button-primary w-fit"
          >
            Log out all sessions
          </button>
        </div>
      </SectionLayout>
    </div>
  );
};

export default SecurityLoginActivity;
