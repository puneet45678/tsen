from index import app
from unittest import IsolatedAsyncioTestCase
from unittest.mock import patch
import pytest

from services.web_push_service import (
    trigger_send_webPush_notification_to_multiple_devices, 
    trigger_send_webPush_notification_to_single_device
    )


#---------------------------------------------------------------------------------#
title = "Dummy Title"
body = "This is a dummy body."
message = {"message_id": "response"}

#---------------------------------------------------------------------------------#

class TestWebPushService(IsolatedAsyncioTestCase):

    '''
    This code tests trigger_send_webPush_notification_to_single_device
    Case 1: Return successful message
    '''

    # Case 1
    @pytest.mark.asyncio
    @patch("services.web_push_service.web_push_actions.send_webPush_notification_to_single_device")
    async def test_trigger_send_webPush_notification_to_single_device_Successful(self, mock_send):
        # given
        token = "0123456789abcdefABCDEF"
        mock_send.return_value = message

        # when
        result = await trigger_send_webPush_notification_to_single_device(title, body, token)

        # then
        assert result == message
        mock_send.assert_called_with(title, body, token)

    '''
    This code tests trigger_send_webPush_notification_to_multiple_devices
    Case 1: Return successful message
    '''

    # Case 1
    @pytest.mark.asyncio
    @patch("services.web_push_service.web_push_actions.send_webPush_notification_to_multiple_devices")
    async def test_trigger_send_webPush_notification_to_multiple_devices_Successful(self, mock_send):
        # given
        image = "test.jpg"
        mock_send.return_value = message

        # when
        result = await trigger_send_webPush_notification_to_multiple_devices(title, body, image)

        # then
        assert result == message
        mock_send.assert_called_with(title, body, image)
