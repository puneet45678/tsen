import { useFeedContext } from "react-activity-feed";

import useNotification from "./useNotification";

export default function useEarlyBirdOffer() {
  const feed = useFeedContext();
  const { createNotification } = useNotification();
  const createEarlyBirdNotification = async (
    notification_text,
    activity
  ) => {
    const actor = activity.actor;
    await feed.onAddReaction("early_bird_tier", activity, { notification_text });
    createNotification(
      actor.id,
      "early_bird_tier",
      { notification_text },
      `SO:early_bird_notification:${activity.object.id}`
    );
  };
  return {
    createEarlyBirdNotification,
  };
}
