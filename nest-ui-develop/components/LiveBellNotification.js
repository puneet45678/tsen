import { useState, useEffect } from "react";
import Bell from "../icons/Bell";
import { useStreamContext } from "react-activity-feed";
import Link from "next/link";
import { getUserId } from "supertokens-auth-react/recipe/session";
import axios from "axios";

export default function LiveBellNotification(props) {
  const { client, userData } = useStreamContext();
  // const [userId, setUserId] = useState("");
  // const [notificatiionActivities, setNotificatiionActivities] = useState([]);
  console.log("clientBell", client);
  console.log("userData", userData);
  // const {userData} = useStreamContext()
  // const [newNotifications, setNewNotifications] = useState(0);

  // useEffect(() => {
  //   // console.log("userData: ",userData)
  //   // if (!userData) return

  //   let notifFeed;

  //   async function init() {
  //     const fetchUserId = async () => {
  //       try {
  //         const id = await getUserId();
  //         setUserId(id);
  //       } catch (error) {
  //         console.error("Error fetching user ID:", error);
  //       }
  //     };

  //     fetchUserId();
  //     axios
  //       .get(
  //         `${process.env.NEXT_PUBLIC_NOTIFICATION_SERVICE}/admin_panel/api/v1/notification_activities`,
  //         {
  //           withCredentials: true,
  //         }
  //       )
  //       .then((response) => {
  //         console.log("notifiActivities: ", response.data);
  //         setNotificatiionActivities(response.data);
  //       })
  //       .catch((error) => {
  //         console.error("error:", error);
  //       });
  //     // if(client!==null && client!== undefined && userData!==undefined && userId!==undefined) {
  //     //   notifFeed = client.feed('notification', userId)
  //     //   console.log("bellUserId: ",userId);
  //     //   console.log("notification feed: ",notifFeed)
  //     // const notifications = await notifFeed.get()
  //       console.log("liveBellRes: ",notificatiionActivities)
  //     const unread = notificatiionActivities?.filter(
  //       (notification) => !notification.is_seen
  //     )
  //     console.log("unread: ",unread);

  //     setNewNotifications(unread?.length)

  //     notifFeed?.subscribe((data) => {
  //       setNewNotifications((prevNotifications) => prevNotifications + data.new.length);
  //     })

  //     // }
  //   }
  //   init();
  //   console.log("NotificationDetails: ", newNotifications);
  //   return () => notifFeed?.unsubscribe();
  // }, [userId]);

  return (
    <div className="relative">
      {props.newNotifications &&
      props.newNotifications !== null &&
      props.newNotifications !== undefined ? (
        <div className="absolute text-[14px] w-[70%] -top-[10px]  bg-[#CC1016] text-white rounded-full flex">
          <div className="mx-auto"> {props.newNotifications}</div>
        </div>
      ) : null}
      <Link href={`/notifications`}>
        {/* <div className={`${props.onNotificationsPage?"bg-red-500 w-full":"bg-red-500"}`}> */}
        <div className="bg-white shadow-sm p-[11px] rounded-[5px]"><Bell/></div>
        {/* </div> */}
      </Link>
    </div>
  );
}


