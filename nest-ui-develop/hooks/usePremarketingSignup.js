import { useStreamContext, useFeedContext } from "react-activity-feed";
import useNotification from "./useNotification";

export default function usePremarketingSignup() {
  const feed = useFeedContext();
  const { user } = useStreamContext();
  const { createNotification } = useNotification();

  const premarket_signup = async (campaign_name, signee_name, activity) => {
    actor = activity.actor;
    await feed.onAddReaction("premarketing_signup", activity, {
      campaign_name: campaign_name,
      signee_name: signee_name,
    });
    if (actor === user.id) {
      createNotification(
        actor,
        "premaketing_signup",
        { campaign_name: campaign_name, signee_name: signee_name },
        `SO:premarketing_signup:${activity.object.id}`
      );
    }
  };
  return {
    premarket_signup
  }
}
