from fastapi import APIRouter
from logger.logging import get_db_action_Logger
from firebase_admin import credentials
import firebase_admin
import os
from services import web_push_service
from models import web_push_content_model

base_api_path = "/web_push_notification/api/v1"

router = APIRouter(tags=["Web Push Notification Service"], prefix=base_api_path)

logger = get_db_action_Logger(__name__)

## intialization of admin sdk
service_auth_file_path = os.path.join(
    "config", "ikarus_nest_demo_firebase_adminsdk.json"
)
cred = credentials.Certificate(service_auth_file_path)
firebase_admin.initialize_app(cred)


@router.post("/device", status_code=201)
async def send_notification_to_single_device(
    data: web_push_content_model.WebPushContentModel,
):
    data = data.dict()
    title = data["title"]
    body = data["body"]
    token = data["tokens"]
    logger.info(f"Sending notification to device with registration_id: {token}")
    sent_message_id = (
        await web_push_service.trigger_send_webPush_notification_to_single_device(
            title, body, token
        )
    )
    return sent_message_id


@router.post("/multiple-devices", status_code=201)
async def send_notification_to_multiple_devices(
    data: web_push_content_model.WebPushContentModel,
):
    data = data.dict()
    title = data["title"]
    body = data["body"]
    tokens = data["tokens"]
    logger.info(f"Sending notification to multiple devices")
    sent_messages_id = (
        await web_push_service.trigger_send_webPush_notification_to_multiple_devices(
            title, body, tokens
        )
    )
    return sent_messages_id
