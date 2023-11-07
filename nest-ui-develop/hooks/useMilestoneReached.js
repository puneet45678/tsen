import { useFeedContext } from "react-activity-feed";

import useNotification from "./useNotification";

export default function useMilestoneReached() {
  const feed = useFeedContext();
  const { createNotification } = useNotification();
  const createMilestoneReachedNotification = async (
    notification_text,
    activity
  ) => {
    const actor = activity.actor;
    await feed.onAddReaction("milestone_reached", activity, { notification_text });
    createNotification(
      actor.id,
      "milestone_reached",
      { notification_text },
      `SO:milestone_reached_notification:${activity.object.id}`
    );
  };
  return {
    createMilestoneReachedNotification,
  };
}
