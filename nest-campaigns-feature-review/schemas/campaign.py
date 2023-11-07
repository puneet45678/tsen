def campaign_serializer(campaign) -> dict:
    return {
        "id": str(campaign["_id"]),
        "basics": campaign["basics"],
        "tiers": campaign["tiers"],
        "story": campaign["story"],
    }


def campaigns_serializer(campaigns) -> list:
    return [campaign_serializer(campaign) for campaign in campaigns]
