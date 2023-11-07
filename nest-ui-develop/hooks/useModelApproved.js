import { useFeedContext } from "react-activity-feed";

import useNotification from "./useNotification";

export default function useModelApproved() {
  const feed = useFeedContext();
  const { createNotification } = useNotification();
  const createModelApprovedNotification = async (
    notification_text,
    activity
  ) => {
    const actor = activity.actor;
    await feed.onAddReaction("model_approved", activity, { notification_text });
    createNotification(
      actor.id,
      "model_approved",
      { notification_text },
      `SO:model_approval_notification:${activity.object.id}`
    );
  };
  return {
    createModelApprovedNotification,
  };
}
