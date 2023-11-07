from index import app
from unittest import IsolatedAsyncioTestCase, mock
from unittest.mock import patch
import pytest
from fastapi.testclient import TestClient
from tests.test_dependencies.MockedMiddleware import MockedSessionMiddleware

from models.web_push_content_model import WebPushContentModel

#---------------------------------------------------------------------------------#
# Setting up the testCLient

test_client = TestClient(app)
app.user_middleware.clear()
app.add_middleware(MockedSessionMiddleware)
mongoId = '647f0bacb301c331cc2d415e'

#---------------------------------------------------------------------------------#

class TestFcmWebNotificationApi(IsolatedAsyncioTestCase):

    '''
    This code tests send_notification_to_single_device endpoint
    Case 1: Return successful 200 status code
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
        response = test_client.post(
            "/web_push_notification/api/v1/device",
            json = data.dict()
        )

        # then
        assert response.status_code == 200 
        assert response.json() == {"message_id": "response"}
        mock_trigger.assert_called_with(data.title, data.body, data.tokens)
    
    '''
    This code tests send_notification_to_multiple_devices endpoint
    Case 1: Return successful 200 status code
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
        response = test_client.post(
            "/web_push_notification/api/v1/multiple-devices",
            json = data.dict()
        )

        # then
        assert response.status_code == 200
        assert response.json() == {"message_id": "response"}
        mock_trigger.assert_called_with(data.title, data.body, data.tokens)
