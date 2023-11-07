from index import app
from unittest import IsolatedAsyncioTestCase
from unittest.mock import patch
import pytest

from models.web_push_content_model import WebPushContentModel
from routes.fcm_web_push_router import send_notification_to_multiple_devices, send_notification_to_single_device



#---------------------------------------------------------------------------------#

class TestFcmWebNotification(IsolatedAsyncioTestCase):

    '''
    This code tests send_notification_to_single_device
    Case 1: Return successful message
    '''

    # Case 1
    @pytest.mark.asyncio
    @patch("web_push_service.fcm_web_notifications.web_push_service.trigger_send_webPush_notification_to_single_device")
    async def test_send_notification_to_single_device_Successful(self, mock_trigger):
        # given
        data = WebPushContentModel(
            title = 'Dummy title',
            body = 'Dummy body',
            tokens = ['dummy-token']
        )
        mock_trigger.return_value = {"message_id": "response"}

        # when
        result = await send_notification_to_single_device(data)
        
        # then
        assert result == {"message_id": "response"}
        mock_trigger.assert_called_with(data.title, data.body, data.tokens)
    
    '''
    This code tests send_notification_to_multiple_devices
    Case 1: Return successful message
    '''

    # Case 1
    @pytest.mark.asyncio
    @patch("web_push_service.fcm_web_notifications.web_push_service.trigger_send_webPush_notification_to_multiple_devices")
    async def test_send_notification_to_multiple_devices_Successful(self, mock_trigger):
        # given
        data = WebPushContentModel(
            title = 'Dummy title',
            body = 'Dummy body',
            tokens = ['dummy-token']
        )
        mock_trigger.return_value = {"message_id": "response"}

        # when
        result = await send_notification_to_multiple_devices(data)
        
        # then
        assert result == {"message_id": "response"}
        mock_trigger.assert_called_with(data.title, data.body, data.tokens)
