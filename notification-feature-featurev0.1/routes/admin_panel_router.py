from fastapi import APIRouter, UploadFile, File, Form, WebSocket, Request, Query
from logger.logging import get_db_action_Logger
from services import admin_panel_service, web_push_service
from typing import List
from constants import getstream_verb
from models import (
    scheduled_in_app_notification_model,
    in_app_notifications_multiple_users,
)
from services import get_info_service

base_api_path = "/admin_panel/api/v1"
connected_clients: List[WebSocket] = []
router = APIRouter(tags=["ADMIN PANEL"], prefix=base_api_path)

logger = get_db_action_Logger(__name__)


async def send_web_push_notification(payload):
    title = payload["title"]
    content = payload["body"]
    image = payload["image"]
    res = await web_push_service.trigger_send_webPush_notification_to_multiple_devices(
        title, content, image
    )
    return res


@router.get("/test-session")
async def test_session(request: Request, user_id_list: list[str] = Query()):
    request_id = request.state.x_request_id
    # logger.debug("Info services called")
    # campaign_name = await get_info_service.get_user_data(user_id,request_id)

    # return campaign_name
    emails_list = await get_info_service.get_user_emails_list(user_id_list,request_id)
    return emails_list

@router.post("/notifications/web-push/send", status_code=201)
async def recieve_web_push_notification_data(
    title: str = Form(), content: str = Form(), picture: UploadFile = File(...)
):
    uploaded_image_response = admin_panel_service.trigger_upload_image_to_uploadCare(
        picture, picture.filename
    )
    payload = {
        "title": title,
        "body": content,
        "image": uploaded_image_response,
    }

    res = await send_web_push_notification(payload)
    return res


@router.post("/notifications/in-app/send", status_code=201)
async def recieve_in_app_notification_data(
    request: Request, title: str = Form(), notification_data: str = Form()
):
    request_id = request.state.x_request_id
    user_ids = await get_info_service.get_user_ids(request_id)
    verb = getstream_verb.getstream_marketing_activity_verb
    activity_response = (
        await admin_panel_service.trigger_adding_marketing_activity_to_user_feed(
            user_ids, verb, notification_data
        )
    )
    return activity_response


@router.get("/notifications/activities")
async def get_notification_activities(request: Request):
    user_id = request.state.user_id
    result = await admin_panel_service.trigger_get_user_notification_activities(user_id)
    return result


@router.get("/user/followers_and_followings")
async def get_user_followers_and_followings(profiler_user_id: str):
    user_id = profiler_user_id
    follow_list = await admin_panel_service.trigger_get_user_following_activities(
        user_id
    )
    return follow_list


@router.post("/follow/user", status_code=201)
async def follow_user(visited_profile_user_id: str, request: Request):
    cuurent_user_id = request.state.user_id
    action_response = await admin_panel_service.trigger_action_follow_user(
        cuurent_user_id, visited_profile_user_id
    )
    return action_response


@router.delete("unfollow/user")
async def unfollow_user(visited_profile_user_id: str, request: Request):
    cuurent_user_id = request.state.user_id
    action_response = await admin_panel_service.trigger_action_unfollow_user(
        cuurent_user_id, visited_profile_user_id
    )
    return action_response


@router.post("/user/activity/seen", status_code=201)
async def update_user_activity(request: Request):
    user_id = request.state.user_id
    updation_response = await admin_panel_service.trigger_updating_user_activities(
        user_id
    )
    return updation_response


@router.post("/notifications/in-app/scheduler/user/single", status_code=201)
async def add_scheduled_notification_to_user_feed(
    data: scheduled_in_app_notification_model.ScheduledInAppNotification,
):
    data = data.dict()
    user_id = data["user_id"]
    verb = data["verb"].name
    notification_data = data["notification_data"]
    print("notification_data:", notification_data)
    notification_added_response = (
        await admin_panel_service.trigger_adding_notification_to_user_feed(
            user_id, verb, notification_data
        )
    )
    return notification_added_response


@router.post("/notifications/in-app/scheduler/user/multiple", status_code=201)
async def add_new_model_published_notification_to_following_user_feed(
    data: in_app_notifications_multiple_users.InAppNotificationMultipleUsers,
):
    data = data.dict()
    user_id_list = data["user_id_list"]
    notification_data = data["notification_data"]
    owner_user_name = data["owner_user_name"]
    verb = data["verb"].name
    notification_added_response = (
        await admin_panel_service.trigger_adding_notification_to_multiple_users_feed(
            owner_user_name, verb, notification_data, user_id_list
        )
    )
    return notification_added_response
