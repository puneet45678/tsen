import { useFeedContext } from "react-activity-feed";

import useNotification from "./useNotification";

export default function useCampaignUpdateToBackers() {
  const feed = useFeedContext();
  const { createNotification } = useNotification();
  const createCampaignUpdateToBackersNotification = async (
    notification_text,
    activity
  ) => {
    const actor = activity.actor;
    await feed.onAddReaction("update_on_campaigns", activity, { notification_text });
    createNotification(
      actor.id,
      "update_on_campaigns",
      { notification_text },
      `SO:early_bird_notification:${activity.object.id}`
    );
  };
  return {
    createCampaignUpdateToBackersNotification,
  };
}
