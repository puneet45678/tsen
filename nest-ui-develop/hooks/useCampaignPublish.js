import { useFeedContext, useStreamContext } from "react-activity-feed";

import useNotification from "./useNotification";

export default function useCampaignPublished() {
  const feed = useFeedContext();
  const { createNotification } = useNotification();
  const { user } = useStreamContext();

  const publishCampaign = async (campaign_name, activity) => {
    const actor = activity.actor;
    await feed.onAddReaction("campaign_published", activity, { campaign_name });

    if (actor.id !== user.id) {
      createNotification(
        actor.id,
        "campaign_published",
        { campaign_name },
        `SO:campaign_published:${activity.object.id}`
      );
    }
  };
  return{
    publishCampaign
  }
}
