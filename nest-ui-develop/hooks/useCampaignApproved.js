import { useFeedContext } from "react-activity-feed";

import useNotification from "./useNotification";

export default function useCampaignApproved() {
  const feed = useFeedContext();
  const { createNotification } = useNotification();
  const createCampaignApprovedNotification = async (
    notification_text,
    activity
  ) => {
    const actor = activity.actor;
    await feed.onAddReaction("campaign_approved", activity, { notification_text });
    createNotification(
      actor.id,
      "campaign_approved",
      { notification_text },
      `SO:model_approval_notification:${activity.object.id}`
    );
  };
  return {
    createCampaignApprovedNotification,
  };
}
