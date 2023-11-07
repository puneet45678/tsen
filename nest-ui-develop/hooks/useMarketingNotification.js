import { useFeedContext } from "react-activity-feed";

import useNotification from "./useNotification";

export default function () {
  const feed = useFeedContext();
  console.log("feedsMarket: ",feed);
  const { createNotification } = useNotification();

  const createMarketingNotification = async (notification_text, activity) => {
    console.log("ActivityMarket: ",activity);
    const actor = activity.actor;
    await feed.onAddReaction("marketing", activity, { notification_text });

    createNotification(
      actor.id,
      "marketing",
      { notification_text },
      `SO:marketing_notification:${activity.object.id}`
    );
  };

  return {
    createMarketingNotification,
  };
}
