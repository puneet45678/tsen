import { useStreamContext } from "react-activity-feed";
import {useState,useEffect} from "react";
import axios from "axios";
import { connect } from "getstream";
const APP_ID = "1250820";
const API_KEY = "6smvj34vkz4d";
export default function useNotification() {
  // const { client } = useStreamContext();
  const [getstreamUserToken, setGetstreamUserToken] = useState('');
  const [client, setClient] = useState(null);
  useEffect(() => {
    // const fetchUserId = async () => {
    //   try {
    //     const id = await getUserId();
    //     setUserId(id);
    //   } catch (error) {
    //     console.error("Error fetching user ID:", error);
    //   }
    // };

    // fetchUserId();

    // console.log("user_id: ", userId);

    axios
      .get(`${process.env.NEXT_PUBLIC_USER_SERVICE_URL}/api/v1/notification/token`, {
        withCredentials: true,
      })
      .then((response) => {
        setGetstreamUserToken(response.data);
        console.log("inside_promise_res: ", response.data);
      })
      .catch((error) => {
        console.error(error);
      });
    console.log("token_response: ", getstreamUserToken?.data);
    async function init() {
      if (getstreamUserToken !== null && getstreamUserToken !== undefined) {
        const user_token = getstreamUserToken;
        // const client = new StreamClient(API_KEY, user_token, APP_ID);
        const client = connect(API_KEY, null, APP_ID);
        setClient(client);
      }
    }
    init();
  }, [getstreamUserToken]);

  console.log("useNotificationClient: ",client);
  const createNotification = async (userId, verb, data, reference = {}) => {
   if(userId!==undefined && userId !== null && userId!=="" && getstreamUserToken!==null && getstreamUserToken!==undefined && getstreamUserToken!==""){
    const userNotificationFeed = client?.feed("notification", userId,getstreamUserToken);

    const newActivity = {
      verb,
      object: reference,
      ...data,
    };

    await userNotificationFeed.addActivity(newActivity);
   }
  };

  return { createNotification };
}
