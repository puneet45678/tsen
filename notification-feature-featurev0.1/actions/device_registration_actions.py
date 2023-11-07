from fastapi import HTTPException, status
from logger.logging import get_db_action_Logger
from firebase_admin import messaging
from constants.web_push_topic import web_push_topic

logger = get_db_action_Logger(__name__)


def register_device(device_id: str, registration_token: str):
    try:
        topic = web_push_topic
        messaging.subscribe_to_topic(registration_token, topic)
        ## We don't need to store the tokens to the Database anymore, because we're using topics
        return {
            "Message": "Device registred successfully",
            "Device_id": device_id,
            "Registration_token": registration_token,
        }
    except Exception as e:
        logger.error(str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not register device for device_id: {device_id}",
        )
