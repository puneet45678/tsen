import { useEffect, useRef, useState } from "react";
import { useFeedContext, useStreamContext } from "react-activity-feed";
import CommentNotification from "./CommentNotification";
import FollowNotification from "./FollowNotification";
import LikeNotification from "./LikeNotification";
import MarketingNotification from "./MarketingNotification";
import { getUserId } from "supertokens-auth-react/recipe/session";
import axios from "axios";
import { StreamClient } from "getstream";

const APP_ID = "1250820";
const API_KEY = "6smvj34vkz4d";

export default function NotificationGroup({ activityGroup }) {
  console.log("Inside NotificationGroup");
  const feed = useFeedContext();
  const [userId, setUserId] = useState("");
  const notificationContainerRef = useRef();
  const [client, setClient] = useState(null);
  const [getstreamUserToken, setGetstreamUserToken] = useState();
  const [userNotifications, setUserNotifications] = useState([]);

  const activities = activityGroup?.activities;
  console.log("Groupactivities: ", activityGroup);

  // const { user, client } = useStreamContext();

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
    // stop event propagation on links
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
      })
      .catch((error) => {
        console.error(error);
      });
    }

    if (!notificationContainerRef.current) return;

    const anchorTags = notificationContainerRef.current.querySelectorAll("a");

    anchorTags.forEach((element) => {
      element.addEventListener("click", (e) => e.stopPropagation());
    });
    init();
    return () =>
      anchorTags.forEach((element) => {
        element.addEventListener("click", (e) => e.stopPropagation());
      });
  }, [userId]);

  useEffect(() => {
    let notifFeed;

    if (
      getstreamUserToken !== undefined &&
      getstreamUserToken !== null &&
      userId !== undefined &&
      userId !== null &&
      getstreamUserToken !== ""
    ) {
      notifFeed = client?.feed("notification", userId);
    }

    notifFeed?.subscribe((data) => {
      if (data.new.length) {
        feed.refresh();
      }
    });

    return () => notifFeed?.unsubscribe();
  }, [userId]);

  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_NOTIFICATION_SERVICE}/admin_panel/api/v1/notifications/activities`,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log("USERnotifiActivities: ", response.data);
        setUserNotifications(response.data);
      })
      .catch((error) => {
        console.error("error:", error);
      });
  }, []);

  return (
    <div ref={notificationContainerRef}>
      {activityGroup?.verb === "like" && (
        <LikeNotification likedActivities={activities} />
      )}
      {activityGroup?.verb === "follow" && (
        <FollowNotification followActivities={activities} />
      )}
      {activityGroup?.verb === "comment" && (
        <CommentNotification commentActivities={activities} />
      )}
      {activityGroup?.verb === "marketing" && (
        <MarketingNotification marketingActivities={activities} />
      )}
    </div>
  );
}
