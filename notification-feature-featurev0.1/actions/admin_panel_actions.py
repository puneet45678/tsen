from fastapi import UploadFile, File, HTTPException, status
from pyuploadcare import Uploadcare
from config.read_yaml import config_yaml
import os
from logger.logging import get_db_action_Logger
import stream
from datetime import datetime
from config.read_yaml import config_yaml

uploadcare_url_domain = config_yaml.uploadcare_config["uploadcare_url"]

logger = get_db_action_Logger(__name__)


def setUpGetstreamClient():
    getstream_api_key = config_yaml.getstream["api_key"]
    getstream_api_secret = config_yaml.getstream["api_secret"]
    getstream_connection_timeout = config_yaml.getstream_config["connection_timeout"]
    try:
        getstream_client = stream.connect(
            getstream_api_key,
            getstream_api_secret,
            use_async=True,
            timeout=getstream_connection_timeout,
        )
        return getstream_client
    except Exception as e:
        logger.error(str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to Stream Client",
        )


getstream_client = setUpGetstreamClient()

UPLOAD_CARE_PUBLIC_KEY = config_yaml.uploadcare["UPLOADCARE_PUBLIC_KEY"]
UPLOAD_CARE_PRIVATE_KEY = config_yaml.uploadcare["UPLOADCARE_SECRET_KEY"]


def get_current_timestamp():
    current_time = datetime.utcnow()
    formatted_timestamp = current_time.isoformat()
    return formatted_timestamp


def create_image_os(picture: UploadFile, filename: str):
    contents = picture.file.read()
    created_picture_name = f"images/{filename}"
    if not os.path.exists("images"):
        os.makedirs("images")
    with open(created_picture_name, "wb") as f:
        f.write(contents)
    return True


def delete_created_picture(path: str) -> None:
    logger.info("Deleting file from local environment")
    os.unlink(path)
    logger.debug("Picture deleted from local")


def upload_image(picture: UploadFile, filename: str):
    if create_image_os(picture, filename):
        uploadcare = Uploadcare(
            public_key=UPLOAD_CARE_PUBLIC_KEY,
            secret_key=UPLOAD_CARE_PRIVATE_KEY,
        )
        created_picture_name = f"images/{filename}"
        with open(created_picture_name, "rb") as created_picture:
            uploaded_picture: File = uploadcare.upload(created_picture)
        logger.debug(f"Picture uploaded to uploadcare with id:{uploaded_picture.uuid}")
        delete_created_picture(created_picture_name)
        return f"{uploadcare_url_domain}/{uploaded_picture.uuid}/"


async def add_marketing_notification_to_user_feeds(
    user_ids: list, verb: str, notification_data: str
):
    if getstream_client is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Getstream client not available",
        )
    timestamp = get_current_timestamp()
    try:
        notification_list = []
        for user_id in user_ids:
            notification_list.append(f"notification:{user_id}")
        user_feed_instance = getstream_client.feed("user", user_id)
        activity_data = {
            "actor": {"id": "1", "data": {"name": "Ikarus-Nest"}},
            "verb": verb,
            "text": notification_data,
            "object": "1",
            "to": notification_list,
            "time": timestamp,
        }
        activity_add_response = await user_feed_instance.add_activity(activity_data)
        return activity_add_response
    except Exception as e:
        logger.error(str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to add marketing notification to the user feeds",
        )


async def add_notification_to_user_feeds(user_id: str, verb: str, notification_data):
    if getstream_client is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Getstream client not available",
        )
    timestamp = get_current_timestamp()
    try:
        user_feed_instance = getstream_client.feed("user", user_id)
        activity_data = {
            "actor": {"id": "1", "data": {"name": "Ikarus Nest"}},
            "verb": verb,
            "text": notification_data,
            "object": user_id,
            "to": [f"notification:{user_id}"],
            "time": timestamp,
        }
        activity_add_response = await user_feed_instance.add_activity(activity_data)
        return activity_add_response
    except Exception as e:
        logger.error(str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to add notification to user feed for user: {user_id}",
        )


async def add_notification_to_multiple_user_feeds(
    user_id_list: str, verb: str, notification_data: str, owner_user_name: str
):
    if getstream_client is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Getstream client not available",
        )
    timestamp = get_current_timestamp()
    notification_user_id_list = []
    for user_id in user_id_list:
        notification_user_id_list.append(f"notification:{user_id}")
    try:
        user_feed_instance = getstream_client.feed("user", user_id)
        activity_data = {
            "actor": {"id": "1", "data": {"name": "Ikarus-Nest"}},
            "verb": verb,
            "text": notification_data,
            "object": user_id,
            "to": notification_user_id_list,
            "time": timestamp,
        }
        activity_add_response = await user_feed_instance.add_activity(activity_data)
        return activity_add_response
    except Exception as e:
        logger.error(str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to add notifications to multiple user feeds",
        )


async def get_user_following_activity(user_id: str):
    if getstream_client is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Getstream client not available",
        )
    try:
        user_feed_instance = getstream_client.feed("timeline", user_id)
        followers = await user_feed_instance.followers()
        following = await user_feed_instance.following()
        follow_list = {"followers": followers, "following": following}
        return follow_list
    except Exception as e:
        logger.error(str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve the following activity for user: {user_id}",
        )


async def get_user_activities_getstream(user_id: str):
    if getstream_client is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Getstream client not available",
        )

    try:
        user_feed_instance = getstream_client.feed("notification", user_id)
        result = await user_feed_instance.get(enrich=True)
        return result["results"]
    except Exception as e:
        logger.error(str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve the notifications for user {user_id}",
        )


async def take_action_follow_user(current_user_id: str, reciever_user_id: str):
    if getstream_client is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Getstream client not available",
        )
    try:
        user_feed_instance = getstream_client.feed("timeline", current_user_id)

        action_response = await user_feed_instance.follow("user", reciever_user_id)
        return action_response

    except Exception as e:
        logger.error(str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to Follow user {reciever_user_id}",
        )


async def take_action_unfollow_user(current_user_id: str, reciever_user_id: str):
    if getstream_client is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Getstream client not available",
        )
    try:
        user_feed_instance = getstream_client.feed("timeline", current_user_id)

        action_response = await user_feed_instance.unfollow("user", reciever_user_id)
        return action_response
    except Exception as e:
        logger.error(str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to Unfollow user {reciever_user_id}",
        )


async def update_user_data_field(user_id: str):
    if getstream_client is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Getstream client not available",
        )

    try:
        updation_response = await getstream_client.feed("user", user_id).get(
            mark_read=["ff967968-26c9-11ee-8080-8000672f64a0.marketing_2023-07-20"]
        )
        return updation_response
    except Exception as e:
        logger.error(str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update the user data field",
        )
