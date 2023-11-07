import { useEffect, useState } from "react";
import { useStreamContext } from "react-activity-feed";
import { connect } from "getstream";
import { getUserId } from "supertokens-auth-react/recipe/session";
import useNotification from "./useNotification";
import { useRouter } from "next/router";
import axios from "axios";
const APP_ID = "1250820";
const API_KEY = "6smvj34vkz4d";
export default function useFollow() {
  // const { client } = useStreamContext();
  const { createNotification } = useNotification();
  const [isFollowing, setIsFollowing] = useState(false);
  const [client, setClient] = useState(null);
  const [getstreamUserToken, setGetstreamUserToken] = useState("");
  const [visitProfileUserId, setVisitProfileUserId] = useState("");
  const [userId, setUserId] = useState("");
  const router = useRouter();
  const { username, section } = router.query;
  const [action, setAction] = useState("");

  // useEffect(() => {
  //   axios
  //     .get(
  //       `${process.env.NEXT_PUBLIC_USER_SERVICE_URL}/api/v1/user?username=${username}`,
  //       {
  //         withCredentials: true,
  //       }
  //     )
  //     .then((response) => {
  //       setVisitProfileUserId(response.data._id);
  //       console.log("VisitProfileUserID: ", response.data);
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //     });
  // }, [username]);

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


    if(userId!==null && userId !== undefined){
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
    async function init() {
      console.log("before_useFollow_before_useffect");
      if (
        userId !== null &&
        userId !== undefined &&
        userId !== "" &&
        getstreamUserToken !== null &&
        getstreamUserToken !== undefined &&
        getstreamUserToken !== ""
      ) {
        console.log("before_useFollow_inside_func_useeffect");
        const response = await client
          ?.feed("timeline", userId, getstreamUserToken)
          ?.following({ filter: [`user:${userId}`] })
          .catch((e) => console.log(e));

        if (response !== undefined && response !== null) {
          setIsFollowing(!!response.results.length);
        }
      }
    }

    init();
    let timelineFeed;
    if (
      getstreamUserToken !== undefined &&
      getstreamUserToken !== null &&
      userId !== undefined &&
      userId !== null &&
      getstreamUserToken !== ""
    ) {
      timelineFeed = client?.feed("timeline", userId, getstreamUserToken);
    }

    // console.log("timelineFeed: ", timelineFeed);
  }, [getstreamUserToken]);
  // let action
  const toggleFollow = async () => {
    isFollowing ? setAction("unfollow") : setAction("follow");

    // // if (getstreamUserToken!==null && getstreamUserToken!==undefined && getstreamUserToken!=="" && userId!==null && userId!== undefined && userId!=='' && action === "follow") {
    //   console.log("inside_createNoti_")
    //   await createNotification(userId, "follow");
    // // }
    // console.log("before_timeline_feed_init")
    // // if(getstreamUserToken!==null && getstreamUserToken!==undefined && getstreamUserToken!=="" && userId!==null && userId!== undefined && userId!==''){
    //   console.log("useFollowUserId: ",userId);
    //   const timelineFeed = client?.feed("timeline",userId,getstreamUserToken);
    //   console.log("timelineFeed: ", timelineFeed);
    //   await timelineFeed.client[action]("user", userId);
    // // }
  };
  useEffect(() => {
    if (
      visitProfileUserId !== undefined &&
      visitProfileUserId !== "" &&
      action !== undefined
    ) {
      axios
        .post(
          `${process.env.NEXT_PUBLIC_NOTIFICATION_SERVICE}/admin_panel/api/v1/follow_or_unfollow/user?action_taken=${action}&visited_profile_user_id=${visitProfileUserId}`,
          {},
          {
            withCredentials: true,
          }
        )
        .then()
        .catch((err) => {
          console.error(err);
        });
    }
    setIsFollowing((isFollowing) => !isFollowing);
  }, [action]);
  return { isFollowing, toggleFollow };
}
