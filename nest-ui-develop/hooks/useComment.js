import { useFeedContext, useStreamContext } from "react-activity-feed";

import useNotification from "./useNotification";

export default function useComment() {
  const feed = useFeedContext();
  const { createNotification } = useNotification();
  const { user } = useStreamContext();

  const createComment = async (comment_text, activity) => {
    const actor = activity.actor;
    await feed.onAddReaction("comment", activity, { comment_text });

    if (actor.id !== user.id) {
      createNotification(
        actor.id,
        "comment",
        { comment_text },
        `SO:campaign_comment:${activity.object.id}`
      );
    }
  };
  return {
    createComment,
  };
}
