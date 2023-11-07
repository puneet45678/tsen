from index import app
from unittest import IsolatedAsyncioTestCase
from unittest.mock import patch, MagicMock
import pytest
from starlette.datastructures import UploadFile
from routes.admin_panel_router import (
    follow_or_unfollow_user,
    get_notification_activities,
    get_user_followers_and_followings,
    recieve_web_push_notification_data,
    recieve_in_app_notification_data,
    send_web_push_notification,
    update_user_activity
    )

#---------------------------------------------------------------------------------#
class TestSendNotification(IsolatedAsyncioTestCase):

    '''
    This code tests send_web_push_notification
    Case 1: Return an id if Web Push notification is successfully sent
    '''

    # Case 1
    @pytest.mark.asyncio
    @patch("admin_panel_services.admin_panel_router.web_push_service.trigger_send_webPush_notification_to_multiple_devices")
    async def test_send_web_push_notification_Successful(self, mock_trigger):
        # given
        payload = {
            "title": "title",
            "body": "content",
            "image": "https://ucarecdn.com/test.jpg/",
        }
        mock_trigger.return_value = "2044264999206186430"

        # when
        result = await send_web_push_notification(payload)

        # then
        assert result == "2044264999206186430"
        mock_trigger.assert_called_with(payload["title"], payload["body"], payload["image"])
   
    '''
    This code tests recieve_web_push_notification_data
    Case 1: Return message_id when successfully sent
    '''
    def mock_trigger_uploadCare(self, picture: UploadFile, filename: str):
        return f"https://ucarecdn.com/{filename}/"
        
    # Case 1
    @pytest.mark.asyncio
    @patch("admin_panel_services.admin_panel_router.admin_panel_service.trigger_upload_image_to_uploadCare")
    @patch("admin_panel_services.admin_panel_router.send_web_push_notification")
    async def test_recieve_web_push_notification_data_Successful(self, mock_send, mock_trigger):
        # given
        title = "Test Title"
        content = "Test content"
        picture = MagicMock(UploadFile)
        picture.filename = "test.jpg"
        payload = {
            "title": title,
            "body": content,
            "image": "https://ucarecdn.com/test.jpg/",
        }
        mock_trigger.side_effect = self.mock_trigger_uploadCare
        mock_send.return_value = {'message_id': 'projects/ikarus-nest-demo/messages/2044264999206186430'}    

        # when
        result = await recieve_web_push_notification_data(title, content, picture)

        # then
        assert result == {'message_id': 'projects/ikarus-nest-demo/messages/2044264999206186430'}
        mock_trigger.assert_called_with(picture, 'test.jpg')
        mock_send.assert_called_with(payload)

    '''
    This code tests recieve_in_app_notification_data
    Case 1: Return a json response if successfully sent
    '''
        
    # Case 1
    @pytest.mark.asyncio
    @patch("admin_panel_services.admin_panel_router.admin_panel_service.trigger_adding_activity_to_user_feed")
    async def test_recieve_in_app_notification_data_Successfull(self, mock_trigger):
        # given
        # session = MagicMock()
        title = "Test Title"
        notification_data = "Marketing Notification"
        user_id = "64ae49145f9b012320fa592d"
        verb = "marketing"
        trigger_feed_res = {
            "actor": "{\"data\":{\"name\":\"Ikarus-Nest\"},\"id\":\"1\"}", "duration": "8.65ms",
            "foreign_id": "", "id": "1d96baa6-1c25-11ee-8080-80012c4043a8", "object": user_id,
            "origin": None, "target": "", "text": notification_data,
            "time": "2023-07-06T17:47:03.084919+00:00",
            "to": ["notification:2", "notification:4"],
            "verb": verb
            }
        mock_trigger.return_value = trigger_feed_res
        
        # when
        result = await recieve_in_app_notification_data(title, notification_data)
        # result = await recieve_in_app_notification_data(session, title, notification_data)

        # then
        assert result == trigger_feed_res
        mock_trigger.assert_called_with(user_id, verb, notification_data)

    '''
    This code tests get_notification_activities
    Case 1: Return a json response if successfully sent
    '''
        
    # Case 1
    @pytest.mark.asyncio
    @patch("admin_panel_services.admin_panel_router.admin_panel_service.trigger_get_user_notification_activities")
    async def test_get_notification_activities_Successfull(self, mock_trigger):
        # given
        request = MagicMock()
        request.state.user_id = '64ae49145f9b012320fa592d'
        mock_trigger.return_value = 'mock-result'
        
        # when
        result = await get_notification_activities(request)

        # then
        assert result == 'mock-result'
        mock_trigger.assert_called_with(request.state.user_id)

    '''
    This code tests get_user_followers_and_followings
    Case 1: Return a json response if successfully sent
    '''
        
    # Case 1
    @pytest.mark.asyncio
    @patch("admin_panel_services.admin_panel_router.admin_panel_service.trigger_get_user_following_activities")
    async def test_get_user_followers_and_followings_Successfull(self, mock_trigger):
        # given
        profiler_user_id = '64ae49145f9b012320fa592d'
        mock_trigger.return_value = 'mock-follow_list'
        
        # when
        result = await get_user_followers_and_followings(profiler_user_id)

        # then
        assert result == 'mock-follow_list'
        mock_trigger.assert_called_with(profiler_user_id)

    '''
    This code tests follow_or_unfollow_user
    Case 1: Return a json response if successfully sent
    '''
        
    # Case 1
    @pytest.mark.asyncio
    @patch("admin_panel_services.admin_panel_router.admin_panel_service.trigger_action_follow_or_unfollow_user")
    async def test_follow_or_unfollow_user_Successfull(self, mock_trigger):
        # given
        request = MagicMock()
        request.state.user_id = '64ae49145f9b012320fa592d'
        cuurent_user_id = request.state.user_id
        action_taken = 'action_taken'
        visited_profile_user_id = '64ae49145f9b012320fa592d'
        mock_trigger.return_value = 'mock-action_response'
        
        # when
        result = await follow_or_unfollow_user(action_taken, visited_profile_user_id, request)

        # then
        assert result == 'mock-action_response'
        mock_trigger.assert_called_with(cuurent_user_id, visited_profile_user_id, action_taken)

    '''
    This code tests update_user_activity
    Case 1: Return a json response if successfully sent
    '''
        
    # Case 1
    @pytest.mark.asyncio
    @patch("admin_panel_services.admin_panel_router.admin_panel_service.trigger_updating_user_activities")
    async def test_update_user_activity_Successfull(self, mock_trigger):
        # given
        request = MagicMock()
        request.satae.user_id = '64ae49145f9b012320fa592d'
        mock_trigger.return_value = 'mock-updation_response'
        
        # when
        result = await update_user_activity(request)

        # then
        assert result == 'mock-updation_response'
        mock_trigger.assert_called_with(request.state.user_id)