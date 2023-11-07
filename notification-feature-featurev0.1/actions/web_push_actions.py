from firebase_admin import messaging
from constants.web_push_topic import web_push_topic
from logger.logging import get_db_action_Logger
from fastapi import HTTPException, status


logger = get_db_action_Logger(__name__)


async def send_webPush_notification_to_single_device(title, body, token):
    try:
        message = messaging.Message(
            notification=messaging.Notification(title=title, body=body), token=token
        )
    except Exception as e:
        logger.error(str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create an FCM message",
        )
    try:
        response = messaging.send(message)
        return {"message_id": response}
    except Exception as e:
        logger.error(str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to send Web Push Notification",
        )


async def send_webPush_notification_to_multiple_devices(title, body, image):
    topic = web_push_topic

    try:
        notification = messaging.WebpushNotification(
            title=title,
            body=body,
            image=image,
        )
    except Exception as e:
        logger.error(str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create notification data for FCM Message",
        )

    try:
        message = messaging.Message(
            webpush=messaging.WebpushConfig(
                #   fcm_options=messaging.WebpushFCMOptions(
                #     link="https://gcode.ikarusnest.info"
                # ),
                notification=notification
            ),
            topic=topic,
        )
    except Exception as e:
        logger.error(str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create the FCM message",
        )

    try:
        response = messaging.send(message)
        return {"message_id": response}
    except Exception as e:
        logger.error(str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to send Web Push Notification",
        )
