def tag_serializer(tag) -> dict:
    return {
        "id": str(tag["_id"]),
        "tags": tag["tags"],
    }


def tags_serializer(tags) -> list:
    return [tag_serializer(tag) for tag in tags]
