import { useFeedContext, useStreamContext } from "react-activity-feed";

import useNotification from "./useNotification";

export default function useLike() {
  const feed = useFeedContext();
  const { createNotification } = useNotification();
  const { user } = useStreamContext();

  const toggleLike = async (activity, hasLiked) => {
    const actor = activity.actor;

    await feed.onToggleReaction("like", activity);

    if (actor.id !== user.id && !hasLiked) {
      createNotification(
        user.id,
        "like",
        {},
        `SO:campaign_like:${activity.object.id}`
      );
    }
  };
  return {
    toggleLike,
  };
}
