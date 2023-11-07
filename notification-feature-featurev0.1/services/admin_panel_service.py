from fastapi import UploadFile
from actions import admin_panel_actions


def trigger_upload_image_to_uploadCare(picture: UploadFile, filename: str):
    image_upload_result = admin_panel_actions.upload_image(picture, filename)
    return image_upload_result


async def trigger_adding_marketing_activity_to_user_feed(user_ids:list,verb:str,notification_data:str):
    activity_added_response = await admin_panel_actions.add_marketing_notification_to_user_feeds(user_ids, verb, notification_data)
    return activity_added_response

async def trigger_adding_notification_to_user_feed(user_id:str,verb:str,notification_data):
    notification_added_response = await admin_panel_actions.add_notification_to_user_feeds(user_id,verb,notification_data)
    return notification_added_response

async def trigger_adding_notification_to_multiple_users_feed(owner_user_name:str,verb:str,notification_data:str,user_id_list:list):
    notification_added_response = await admin_panel_actions.add_notification_to_multiple_user_feeds(user_id_list,verb,notification_data,owner_user_name)
    return notification_added_response


async def trigger_get_user_notification_activities(user_id:str):
    result = await admin_panel_actions.get_user_activities_getstream(user_id)
    return result



async def trigger_get_user_following_activities(user_id:str):
    follow_list = await admin_panel_actions.get_user_following_activity(user_id)
    return follow_list

async def trigger_updating_user_activities(user_id:str):
    updation_response = await admin_panel_actions.update_user_data_field(user_id)
    return updation_response

async def trigger_action_follow_user(current_user_id:str,reciever_user_id:str):
    action_response = await admin_panel_actions.take_action_follow_user(current_user_id,reciever_user_id)
    return action_response

async def trigger_action_unfollow_user(current_user_id:str,reciever_user_id:str):
    action_response = await admin_panel_actions.take_action_unfollow_user(current_user_id,reciever_user_id)
    return action_response