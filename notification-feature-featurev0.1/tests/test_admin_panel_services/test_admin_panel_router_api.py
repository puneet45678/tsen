from index import app
from unittest import IsolatedAsyncioTestCase
from unittest.mock import patch
import pytest
import os
from fastapi.testclient import TestClient
from tests.test_dependencies.MockedMiddleware import MockedSessionMiddleware


#---------------------------------------------------------------------------------#
# Setting up the testCLient

test_client = TestClient(app)
app.user_middleware.clear()
app.add_middleware(MockedSessionMiddleware)
mongoId = '647f0bacb301c331cc2d415e'
file_loc = os.path.join(os.getcwd(), 'tests\\test.jpg')

#---------------------------------------------------------------------------------#
class TestSendNotification(IsolatedAsyncioTestCase):
    
    '''
    This code tests recieve_web_push_notification_data endpoint
    Case 1: Send 200 status code
    '''
        
    # Case 1
    @pytest.mark.asyncio
    @patch("admin_panel_services.admin_panel_router.admin_panel_service.trigger_upload_image_to_uploadCare")
    @patch("admin_panel_services.admin_panel_router.send_web_push_notification")
    async def test_recieve_web_push_notification_data_Successful(self, mock_send, mock_trigger):
        # given
        picture = open(file_loc, "wb+")
        files = {"picture": picture}
        data = {
            "title": "Test Title",
            "content": "Test content",
        }
        mock_trigger.return_value = "https://ucarecdn.com/0162b5df-c204-470e-9609-caf2a77dd217/"
        mock_send.return_value = {"message_id": "projects/ikarus-nest-demo/messages/1309960243060045487"}
        
        # when
        response = test_client.post(
            "/admin_panel/api/v1/recieve_and_send_web-push_notification_data",
            data = data, 
            files = files
        )
        
        # then
        assert response.status_code == 200
        assert response.json() == {"message_id": "projects/ikarus-nest-demo/messages/1309960243060045487"}
        mock_trigger.assert_called_once()
        mock_send.assert_called_once()

    '''
    This code tests recieve_in_app_notification_data endpoint
    Case 1: Send 200 status code
    '''
        
    # Case 1
    @pytest.mark.asyncio
    @patch("admin_panel_services.admin_panel_router.admin_panel_service.trigger_adding_activity_to_user_feed")
    async def test_recieve_in_app_notification_data_Successful(self, mock_trigger):
        # given
        data = {
            "title": "Test Title",
            "notificationData": "Marketing Notification"
        }
        mock_trigger.return_value = { "data" : "mock"}
        
        # when
        response = test_client.post(
            "/admin_panel/api/v1/recieve_and_send_in-app_notification", 
            data = data
        )

        # then
        assert response.status_code == 200
        assert response.json() == {'data': 'mock'}
        mock_trigger.assert_called_once()


    '''
    This code tests get_notification_activities endpoint
    Case 1: Send 200 status code
    '''
        
    # Case 1
    @pytest.mark.asyncio
    @patch("admin_panel_services.admin_panel_router.admin_panel_service.trigger_get_user_notification_activities")
    async def test_get_notification_activities_Successfull(self, mock_trigger):
        # given
        mock_trigger.return_value = 'mock-result'
        
        # when
        response = test_client.get(
            '/admin_panel/api/v1/notification_activities'
        )

        # then
        assert response.status_code == 200
        assert response.json() == 'mock-result'
        mock_trigger.assert_called_with(mongoId)

    '''
    This code tests get_user_followers_and_followings endpoint
    Case 1: Send 200 status code
    '''
        
    # Case 1
    @pytest.mark.asyncio
    @patch("admin_panel_services.admin_panel_router.admin_panel_service.trigger_get_user_following_activities")
    async def test_get_user_followers_and_followings_Successfull(self, mock_trigger):
        # given
        mock_trigger.return_value = 'mock-follow_list'
        
        # when
        response = test_client.get(
            f'/admin_panel/api/v1/user/followers_and_followings?profiler_user_id={mongoId}'
        )

        # then
        assert response.status_code == 200
        assert response.json() == 'mock-follow_list'
        mock_trigger.assert_called_with(mongoId)

    '''
    This code tests follow_or_unfollow_user endpoint
    Case 1: Send 200 status code
    '''
        
    # Case 1
    @pytest.mark.asyncio
    @patch("admin_panel_services.admin_panel_router.admin_panel_service.trigger_action_follow_or_unfollow_user")
    async def test_follow_or_unfollow_user_Successfull(self, mock_trigger):
        # given
        cuurent_user_id = mongoId
        action_taken = 'action_taken'
        visited_profile_user_id = '64ae49145f9b012320fa592d'
        mock_trigger.return_value = 'mock-action_response'
        
        # when
        response = test_client.post(f'/admin_panel/api/v1/follow_or_unfollow/user?action_taken={action_taken}&visited_profile_user_id={visited_profile_user_id}'
        )

        # then
        assert response.status_code == 200
        assert response.json() == 'mock-action_response'
        mock_trigger.assert_called_with(cuurent_user_id, visited_profile_user_id, action_taken)

    '''
    This code tests update_user_activity endpoint
    Case 1: Send 200 status code
    '''
        
    # Case 1
    @pytest.mark.asyncio
    @patch("admin_panel_services.admin_panel_router.admin_panel_service.trigger_updating_user_activities")
    async def test_update_user_activity_Successfull(self, mock_trigger):
        # given
        mock_trigger.return_value = 'mock-updation_response'
        
        # when
        response = test_client.post(
            '/admin_panel/api/v1/user_activity/is_seen'
        )

        # then
        assert response.status_code == 200
        assert response.json() == 'mock-updation_response'
        mock_trigger.assert_called_with(mongoId)