import { useStreamContext, useFeedContext } from "react-activity-feed";
import useNotification from "./useNotification";

export default function useCampaignBack() {
  const feed = useFeedContext();
  const { user } = useStreamContext();
  const { createNotification } = useNotification();

  const campaign_backed = async (campaign_name, backer_name, activity) => {
    actor = activity.actor;

    await feed.onAddReaction("campaign_backed", activity, {
      campaign_name: campaign_name,
      backer_name: backer_name,
    });

    if (actor === user.id) {
      createNotification(
        actor,
        "campaign_backed",
        { campaign_name: campaign_name, backer_name: backer_name },
        `SO:campaign_backed:${activity.object.id}`
      );
    }
  };
  return{
    campaign_backed
  }
}
