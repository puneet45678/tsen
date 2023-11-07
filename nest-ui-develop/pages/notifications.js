import { useState, useEffect } from "react";
import Layout from "../components/NotificationLayout";
import NotificationContent from "../components/Notifications/NotificationContent";
import { StreamClient } from "getstream";
import { StreamApp } from "react-activity-feed";
import { getFromStorage } from "../UtilityFunctions/storage";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import axios from "axios";

import { getUserId } from "supertokens-auth-react/recipe/session";

const APP_ID = "1250820";
const API_KEY = "6smvj34vkz4d";

let onNotificationsPage = false;

export default function Notifications() {
  const [client, setClient] = useState(null);
  const [userId, setUserId] = useState("");
  const [getstreamUserToken, setGetstreamUserToken] = useState();

  useEffect(() => {
    console.log("insie_notification");
    axios
      .post(
        `${process.env.NEXT_PUBLIC_NOTIFICATION_SERVICE}/admin_panel/api/v1/user_activity/is_seen`,
        {},
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log("activity_seen_resp", response.data);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, []);

  async function init() {
    if (getstreamUserToken !== undefined && getstreamUserToken !== null) {
      const client = new StreamClient(API_KEY, getstreamUserToken, APP_ID);
      setClient(client);
    }
  }

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await getUserId();
        setUserId(id);
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };

    fetchUserId();


   if(userId !== undefined && userId !== null){
    axios
    .get(
      `${process.env.NEXT_PUBLIC_USER_SERVICE_URL}/api/v1/notification/token`,
      {
        withCredentials: true,
      }
    )
    .then((response) => {
      setGetstreamUserToken(response.data);
      console.log("inside_promise_res: ", response.data);
    })
    .catch((error) => {
      console.error(error);
    });
   }

    init();
  }, [userId]);

  useEffect(() => {
    axios
      .post(
        `${process.env.NEXT_PUBLIC_USER_SERVICE_URL}/api/v1/notification/getstream-user`,
        {},
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log("getstreamUser: ", response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      {console.log("token_response_ret: ", getstreamUserToken)}
      {getstreamUserToken !== undefined ? (
        <StreamApp token={getstreamUserToken} appId={APP_ID} apiKey={API_KEY}>
          <div className="w-full">
            {/* <Layout> */}
            {!client ? (
              <Skeleton className="h-screen" />
            ) : (
              <NotificationContent onNotificationsPage={onNotificationsPage} />
            )}
          </div>
        </StreamApp>
      ) : null}
    </>
  );
}

export async function getServerSideProps(context) {
  if (
    !context.req.cookies["sFrontToken"] ||
    context.req.cookies["sFrontToken"] === "" ||
    !context.req.cookies["sAccessToken"] ||
    context.req.cookies["sAccessToken"] === ""
  ) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
      props: {},
    };
  }
  return {
    props: {},
  };
}
