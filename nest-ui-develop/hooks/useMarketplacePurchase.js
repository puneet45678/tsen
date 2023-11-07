import { useFeedContext, useStreamContext } from "react-activity-feed";

import useNotification from "./useNotification";

export default function useMarketplacePurchase() {
  const feed = useFeedContext();
  const { user } = useStreamContext();
  const { createNotification } = useNotification();

  const purchase_from_marketplace = async (
    model_name,
    buyer_name,
    activity
  ) => {
    actor = activity.actor;
    await feed.onAddReaction("marketplace_purchase", activity, {
      model_name: model_name,
      buyer_name: buyer_name,
    });

    if (actor.id === user.id) {
      createNotification(
        actor.id,
        "marketplace_purchase",
        { model_name: model_name, buyer_name: buyer_name },
        `SO:marketplace_purchase:${activity.object.id}`
      );
    }
  };
  return{
    purchase_from_marketplace
  }
}
