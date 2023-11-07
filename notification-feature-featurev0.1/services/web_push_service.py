from actions import web_push_actions


async def trigger_send_webPush_notification_to_single_device(title, body, token):
    triggered_message_id = (
        await web_push_actions.send_webPush_notification_to_single_device(
            title, body, token
        )
    )
    return triggered_message_id


async def trigger_send_webPush_notification_to_multiple_devices(
    title, body, image
):
    triggered_messages_id = (
        await web_push_actions.send_webPush_notification_to_multiple_devices(
            title, body, image
        )
    )
    return triggered_messages_id
