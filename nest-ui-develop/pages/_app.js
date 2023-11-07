import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AnimatePresence } from "framer-motion";
import { Provider } from "react-redux";
import Header from "../components/Header";
import store from "../store/store";
import { useDispatch, useSelector } from "react-redux";
import "../styles/globals.css";
import "react-datepicker/dist/react-datepicker.css";
import "react-calendar/dist/Calendar.css";
import "../styles/homePage.css";
import { getCurrentUserThunk } from "../store/userSlice";
import { frontendConfig } from "../config/frontendConfig";
import SuperTokensReact, { redirectToAuth } from "supertokens-auth-react";
import Session from "supertokens-auth-react/recipe/session";
import SlicerContext from "../SlicerContext";
import "../styles/quill.snow.css";
import "../styles/phoneNumber.css";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { onMessageListener } from "../UtilityFunctions/firebase";
import WebPushComponent from "../components/WebPushComponent";
import WebPushNotification from "../components/WebPushNotification";
import axios from "axios";
import "@splidejs/react-splide/css";
import firebase from "firebase/app";
import "firebase/messaging";
let messaging = null;
const crypto = require("crypto");
const base64url = require("base64url");

import "react-responsive-modal/styles.css";

import { getUserId } from "supertokens-auth-react/recipe/session";
import { EmailVerificationClaim } from "supertokens-web-js/recipe/emailverification";
import { connect } from "getstream";

const APP_ID = `"1250820"`;
const API_KEY = "6smvj34vkz4d";

if (typeof window !== "undefined") {
  SuperTokensReact.init(frontendConfig());
}

function setCookieIfNotPresent(cookieName, cookieValue, expirationMinutes) {
  if (!document.cookie.includes(cookieName)) {
    // Hash and encode the cookie value
    const hash = crypto.createHash("sha256");
    hash.update(cookieValue);
    const hashedValue = hash.digest("hex");
    console.log("hashed_value", hashedValue);
    const base64UrlEncodedValue = base64url.encode(hashedValue);
    console.log("base64encodedvalue", base64UrlEncodedValue);
    // Calculate the expiration date
    const date = new Date();
    date.setTime(date.getTime() + expirationMinutes * 60 * 1000);
    const expires = "expires=" + date.toUTCString();
    if (
      process.env.NEXT_PUBLIC_ENV &&
      process.env.NEXT_PUBLIC_ENV === "development"
    ) {
      document.cookie = `${cookieName}=${base64UrlEncodedValue}; ${expires}; path=/; domain=${process.env.NEXT_PUBLIC_FRONTEND_DOMAIN}`;
    } else {
      document.cookie = `${cookieName}=${base64UrlEncodedValue}; ${expires}; path=/`;
    }
  }
}
function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [slicerUrl, setSlicerUrl] = useState(null);
  const [client, setClient] = useState(null);
  const [show, setShow] = useState(false);
  const [userId, setUserId] = useState("");
  const [getstreamUserToken, setGetstreamUserToken] = useState("");
  const [notification, setNotification] = useState({
    title: "",
    body: "",
    image: "",
  });
  const [open, setOpen] = useState(false);
  const [notificatiionActivities, setNotificatiionActivities] = useState([]);
  const [newNotifications, setNewNotifications] = useState(0);
  const [doesSessionExistState, setDoesSessionExistState] = useState(false);

  // const [ws, setWS] = useState(null);
  // const [wsData, setWsData] = useState('');

  // useEffect(() => {
  //   const newWS = new WebSocket("ws://localhost:8020/export/gcode");

  //   newWS.onerror = err => console.error("Websocket Connection Failed: ",err);
  //   newWS.onopen = () => {setWS(newWS);console.log("Websocket Connection established ");newWS.send("Hello, WebSocket!");}

  //   newWS.onmessage = event => {
  //     console.log("msg.data: ",event.data)

  //     // const parsedData = JSON.parse(msg.data);
  //     // const parsedUINT8data = new Uint8Array(msg.data);
  //     // console.log("UINT-array: ",parsedUINT8data)
  //     // const encoding = "utf-8";
  //     // const textDecoder = new TextDecoder(encoding);
  //     // const decodedString = textDecoder.decode(parsedUINT8data);
  //     setWsData(event.data);
  //     // console.log("Received message: ", decodedString);
  //   };

  //   return () => {

  //     if (newWS) {
  //       newWS.close();
  //     }
  //   };
  // }, []);

  const [message, setMessage] = useState("");
  const [ws, setWs] = useState(null);

  useEffect(() => {
    let slicerUrlVar;
    let webSocketVar;
    let socket;
    axios
      .get(
        `${process.env.NEXT_PUBLIC_SLICER_SERVICE_URL}/gcp/url?url_type=${process.env.NEXT_PUBLIC_WEBSOCKET_URL_TYPE}`,
        { withCredentials: true }
      )
      .then((response) => {
        slicerUrlVar = response.data;
        slicerUrlVar = slicerUrlVar.replace("https://", "");
        webSocketVar = `${process.env.NEXT_PUBLIC_WEBSOCKET_PROTOCOL}://${slicerUrlVar}/ws`;
        console.log(
          "slicerUrlVar",
          response.data,
          "webSocketVar",
          webSocketVar
        );
        socket = new WebSocket(webSocketVar);

        socket.onopen = () => {
          console.log("WebSocket connection opened");
        };

        socket.onmessage = (event) => {
          console.log("Received WebSocket message:", event.data);

          // Parse the received JSON data
          const receivedData = JSON.parse(event.data);

          // Extract the presigned URL and file name from the parsed JSON data
          let presignedURL = receivedData.presigned_url;
          const fileName = receivedData.file_name;

          let correctedPresignedURL = presignedURL.replace(/\u0026/g, "&");
          setMessage(correctedPresignedURL); // or set it to the full receivedData object if you wish

          console.log("correctedPresignedURL: ", correctedPresignedURL);

          // Initiate a download using the presigned URL
          const link = document.createElement("a");
          link.href = correctedPresignedURL;
          link.download = fileName; // Use the actual file name from the received data
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        };

        socket.onerror = (error) => {
          console.log("WebSocket error:", error);
        };

        setWs(socket);
      })
      .catch((error) => {
        console.error(error);
      });

    // Connect to the WebSocket when the component mounts

    // Cleanup the WebSocket connection when the component unmounts
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []);

  // useEffect(()=>{
  //   console.log("Received message: ",wsData);
  // },[wsData])

  useEffect(() => {
    (async () => {
      try {
        const id = await getUserId();
        setUserId(id);
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    })();

    (async () => {
      if (await Session.doesSessionExist()) {
        setDoesSessionExistState(true);
      }
    })();
  }, []);

  useEffect(() => {
    console.log("doesSessionExistState: ", doesSessionExistState);
  }, [doesSessionExistState]);

  useEffect(() => {
    console.log("user_id: ", userId);

    if (userId !== null && userId !== undefined && userId !== "") {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_USER_SERVICE_URL}/api/v1/notification/token`,
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          setGetstreamUserToken(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }

    async function init() {
      if (getstreamUserToken !== null && getstreamUserToken !== undefined) {
        const user_token = getstreamUserToken;
        // const client = new StreamClient(API_KEY, user_token, APP_ID);
        const client = connect(API_KEY, null, APP_ID);
        setClient(client);
      }
    }
    init();
  }, [userId]);

  useEffect(() => {
    // axios
    //   .get(
    //     `${process.env.NEXT_PUBLIC_NOTIFICATION_SERVICE}/admin_panel/api/v1/notification_activities`,
    //     {
    //       withCredentials: true,
    //     }
    //   )
    //   .then((response) => {
    //     console.log("notifiActivities: ", response.data);
    //     setNotificatiionActivities(response.data);
    //   })
    //   .catch((error) => {
    //     console.error("error:", error);
    //   });

    // const unread = notificatiionActivities?.filter(
    //   (notification) => !notification.is_seen
    // )
    // console.log("APPunread: ",unread)

    // setNewNotifications(unread?.length)

    if (
      getstreamUserToken !== undefined &&
      getstreamUserToken !== null &&
      userId !== undefined &&
      userId !== null &&
      userId !== "" &&
      getstreamUserToken !== ""
    ) {
      console.log(
        "feedUserToken: ",
        getstreamUserToken,
        "FeeduserId: ",
        userId
      );
      const notificationFeed = client?.feed(
        "notification",
        userId,
        getstreamUserToken
      );
      console.log("notificationFeed: ", notificationFeed);

      function callback(data) {
        // alert('A new activity: ' + JSON.stringify(data));
        setNewNotifications(newNotifications + 1);
      }

      function successCallback() {
        // alert('listening_to_changes_in_realtime.');
      }

      function failCallback(data) {
        console.error("Something went wrong, check the console logs");
        console.log("failbackData: ", data);
      }

      notificationFeed?.subscribe(callback).then(successCallback, failCallback);
    }
  }, [userId, getstreamUserToken]);

  onMessageListener()
    .then((payload) => {
      setShow(true);
      setOpen(true);
      messaging?.onMessage(function (payload) {
        console.log("onMessage: ", payload);
        navigator.serviceWorker
          .getRegistration("/firebase-cloud-messaging-push-scope")
          .then((registration) => {
            registration.showNotification(
              notification.title,
              notification.body,
              notification.image
            );
          });
      });

      setNotification({
        title: payload.notification.title,
        body: payload.notification.body,
        image: payload.notification.image,
      });
    })
    .catch((err) => console.log("failed: ", err));

  useEffect(() => {
    console.log("pageProps", pageProps);
    async function doRefresh() {
      if (pageProps.fromSupertokens === "needs-refresh") {
        console.log("needs refresh", pageProps);
        if (await Session.attemptRefreshingSession()) {
          location.reload();
        } else {
          redirectToAuth();
        }
      }
    }
    doRefresh();
  }, [pageProps.fromSupertokens]);

  useEffect(() => {
    const getUser = async () => {
      if (await Session.doesSessionExist()) {
        let userId = await Session.getUserId();
        let accessTokenPayload = await Session.getAccessTokenPayloadSecurely();
        // console.log("userid", userId, "payload", accessTokenPayload);
      }
    };
    getUser();
    const setFp = async () => {
      // console.log("inside effect")
      const fp = await FingerprintJS.load();
      console.log("fpObj: ", fp);
      const { visitorId } = await fp.get();
      console.log("vis_id: ", visitorId);

      setCookieIfNotPresent("gadget-echo-nibbles", visitorId, 600);
    };

    setFp();
  }, []);

  useEffect(() => {
    window.OneSignalDeferred = window.OneSignalDeferred || [];
    OneSignalDeferred.push(function (OneSignal) {
      OneSignal.init({
        appId: "92c30f84-8b03-4333-90e7-beb2ad5002ee",
      });
    });

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .catch((error) => {
          console.error("Unable to register service worker: ", error);
        });
    }
  }, []);

  useEffect(() => {
    setToken();

    // Event listener that listens for the push notification event in the background
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("message", (event) => {
        console.log("event for the service worker", event);
      });
    }

    // Calls the getMessage() function if the token is there
    async function setToken() {
      try {
        const token = await firebaseCloudMessaging.init();
        if (token) {
          console.log("FCmtoken", token);
          getMessage();
        }
      } catch (error) {
        console.log(error);
      }
    }
  });

  const handleClickPushNotification = (url) => {
    router.push(url);
  };

  // Get the push notification message and triggers a toast to show it
  function getMessage() {
    const messaging = firebase.messaging();
    messaging.onMessage((message) => {
      toast(
        <div onClick={() => handleClickPushNotification(message?.data?.url)}>
          <h5>{message?.notification?.title}</h5>
          <h6>{message?.notification?.body}</h6>
        </div>,
        {
          closeOnClick: false,
        }
      );
    });
  }

  useEffect(() => {
    if (userId !== null && userId !== undefined && userId !== "") {
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
    }
  }, [userId]);

  if (pageProps.fromSupertokens === "needs-refresh") {
    return null;
  }

  //Wrapping _app with <StreamApp> because we need to provide clients in the user/about page and other pages in the future
  // Therefore, We need a StreamApp instance under which we provide the basic client.

  if (
    router.pathname === "/" ||
    router.pathname === "/login" ||
    router.pathname === "/signup" ||
    router.pathname === "/email/verify" ||
    router.pathname === "/forgot-password" ||
    router.pathname === "/welcome" ||
    (!doesSessionExistState && router.pathname === "/terms-and-conditions")
  ) {
    return (
      <>
        {console.log("Session_not_present")}
        <Provider store={store}>
          <SlicerContext.Provider value={{ slicerUrl, setSlicerUrl }}>
            <App setDoesSessionExistState={setDoesSessionExistState}>
              {show ? (
                <WebPushComponent
                  title={notification.title}
                  body={notification.body}
                  image={notification.image}
                  open={open}
                  setOpen={setOpen}
                  getMessage={getMessage}
                />
              ) : (
                <></>
              )}
              <WebPushNotification />
              <AnimatePresence initial={false} mode="wait">
                <Component {...pageProps} key={router.pathname} />
              </AnimatePresence>
            </App>
          </SlicerContext.Provider>
        </Provider>
      </>
    );
  } else {
    return (
      <>
        {console.log("session_present")}
        {getstreamUserToken !== undefined ? (
          <Provider store={store}>
            <SlicerContext.Provider value={{ slicerUrl, setSlicerUrl }}>
              <Header newNotifications={newNotifications} />
              <App setDoesSessionExistState={setDoesSessionExistState}>
                {show ? (
                  <WebPushComponent
                    title={notification.title}
                    body={notification.body}
                    image={notification.image}
                    open={open}
                    setOpen={setOpen}
                  />
                ) : (
                  <></>
                )}

                <WebPushNotification />
                <AnimatePresence initial={false} mode="wait">
                  <Component {...pageProps} key={router.pathname} />
                </AnimatePresence>
              </App>
            </SlicerContext.Provider>
          </Provider>
        ) : (
          <>
            <Provider store={store}>
              <SlicerContext.Provider value={{ slicerUrl, setSlicerUrl }}>
                <Header newNotifications={newNotifications} />
                <App setDoesSessionExistState={setDoesSessionExistState}>
                  {show ? (
                    <WebPushComponent
                      title={notification.title}
                      body={notification.body}
                      image={notification.image}
                      open={open}
                      setOpen={setOpen}
                    />
                  ) : (
                    <></>
                  )}
                  <WebPushNotification />
                  <AnimatePresence initial={false} mode="wait">
                    <Component {...pageProps} key={router.pathname} />
                  </AnimatePresence>
                </App>
              </SlicerContext.Provider>
            </Provider>
          </>
        )}
      </>
    );
  }
}

const App = ({ children, doesSessionExistState }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      if (await Session.doesSessionExist()) {
        if (!user?.email) {
          dispatch(getCurrentUserThunk());
          // .unwrap()
          // .then((dispatchRes) => {
          //   if (!dispatchRes?.username) {
          //     // router.push("/welcome");
          //   }
          // })
          // .catch(async (dispatchErr) => {
          //   console.log("dispatchErr", dispatchErr);
          //   console.log("username", user.username);
          // });
        }
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (
        (await Session.doesSessionExist()) &&
        router.pathname !== "/email/verify" &&
        user?.email
      ) {
        let validationErrors = await Session.validateClaims();
        let isEmailVerified = true;
        if (validationErrors.length !== 0) {
          for (const err of validationErrors) {
            if (err.validatorId === EmailVerificationClaim.id) {
              isEmailVerified = false;
              if (router.pathname !== "/email/verify")
                router.push("/email/verify");
            }
          }
        } else if (isEmailVerified) {
          if (user?.email && !user?.username) {
            router.push("/welcome");
          }
        }
      }
    })();
  }, [user]);

  if (
    router.pathname === "/" ||
    router.pathname === "/login" ||
    router.pathname === "/signup" ||
    router.pathname === "/email/verify" ||
    router.pathname === "/forgot-password" ||
    router.pathname === "/welcome" ||
    (!doesSessionExistState && router.pathname === "/terms-and-conditions")
  ) {
    return (
      <div className="grid min-h-[calc(100vh)] bg-light-neutral-50">
        {children}
      </div>
    );
  } else {
    return (
      <div className="grid min-h-[calc(100vh_-_72px)] bg-light-neutral-50">
        {children}
      </div>
    );
  }
};

export default MyApp;
