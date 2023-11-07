from unittest import mock
from actions.admin_panel_actions import get_user_following_activity
from index import app
from unittest import IsolatedAsyncioTestCase
from unittest.mock import patch, MagicMock
import pytest
from starlette.datastructures import UploadFile

from services.admin_panel_service import (
    trigger_action_follow_or_unfollow_user,
    trigger_adding_activity_to_user_feed,
    trigger_get_user_following_activities,
    trigger_get_user_notification_activities,
    trigger_updating_user_activities, 
    trigger_upload_image_to_uploadCare
    )


#---------------------------------------------------------------------------------#
user_id = '64ae49145f9b012320fa592d'

#---------------------------------------------------------------------------------#

class TestAdminPanelServices(IsolatedAsyncioTestCase):

    '''
    This code tests trigger_upload_image_to_uploadCare
    Case 1: Return image url if successfully sent
    '''

    # Case 1
    def mock_upload_image(self, picture: UploadFile, filename: str):
        return f"https://ucarecdn.com/{filename}/"
    
    @patch("services.admin_panel_service.admin_panel_actions.upload_image")
    def test_trigger_upload_image_to_uploadCare_Successful(self, mock_upload):
        # given
        picture = MagicMock(UploadFile)
        filename = "test.jpg"
        mock_upload.side_effect = self.mock_upload_image

        # when
        result = trigger_upload_image_to_uploadCare(picture, filename)

        # then
        assert result == "https://ucarecdn.com/test.jpg/"
        mock_upload.assert_called_with(picture, filename)

    '''
    This code tests trigger_adding_activity_to_user_feed
    Case 1: Return json if successfully sent
    '''

    # Case 1
    @pytest.mark.asyncio
    @patch("services.admin_panel_service.admin_panel_actions.add_activity_to_user_feeds")
    async def test_trigger_adding_activity_to_user_feed_Successful(self, mock_activity):
        # given
        user_id = "2"
        verb = "marketing"
        notification_data = "Marketing Notification"
        activity_add_response = {
            "actor": "{\"data\":{\"name\":\"Ikarus-Nest\"},\"id\":\"1\"}", "duration": "8.65ms",
            "foreign_id": "", "id": "1d96baa6-1c25-11ee-8080-80012c4043a8", "object": user_id,
            "origin": None, "target": "", "text": notification_data,
            "time": "2023-07-06T17:47:03.084919+00:00",
            "to": ["notification:2", "notification:4"],
            "verb": verb
            }
        mock_activity.return_value = activity_add_response

        # when
        result = await trigger_adding_activity_to_user_feed(user_id, verb, notification_data)

        # then
        assert result == activity_add_response
        mock_activity.assert_called_with(user_id, verb, notification_data)

    '''
    This code tests trigger_get_user_notification_activities
    Case 1: Return json if successfully sent
    '''

    # Case 1
    @pytest.mark.asyncio
    @patch("services.admin_panel_service.admin_panel_actions.get_user_activities_getstream")
    async def test_trigger_get_user_notification_activities_Successful(self, mock_activity):
        # given
        activity_add_response = {'activities': [{}, {}]}
        mock_activity.return_value = activity_add_response

        # when
        result = await trigger_get_user_notification_activities(user_id)

        # then
        assert result == activity_add_response
        mock_activity.assert_called_with(user_id)

    '''
    This code tests trigger_get_user_following_activities
    Case 1: Return json if successfully sent
    '''

    # Case 1
    @pytest.mark.asyncio
    @patch("services.admin_panel_service.admin_panel_actions.get_user_following_activity")
    async def test_trigger_get_user_following_activities_Successful(self, mock_activity):
        # given
        follow_list = {'followers': {'results': [], 'duration': '1.47ms'},
                       'following': {'results': [{'feed_id': 'timeline:64ae49145f9b012320fa592d',
                                                  'target_id': 'user:64a7f1b0f145386b0e0e9bdb',
                                                  'created_at': '2023-07-19T07:12:33.768619535Z',
                                                  'updated_at': '2023-07-19T07:12:33.768619535Z'}],
                                    'duration': '2.41ms'}}
        mock_activity.return_value = follow_list

        # when
        result = await trigger_get_user_following_activities(user_id)

        # then
        assert result == follow_list
        mock_activity.assert_called_with(user_id)
    
    '''
    This code tests trigger_updating_user_activities
    Case 1: Return json if successfully sent
    '''

    # Case 1
    @pytest.mark.asyncio
    @patch("services.admin_panel_service.admin_panel_actions.update_user_data_field")
    async def test_trigger_updating_user_activities_Successful(self, mock_activity):
        # given
        updation_response = {'results': [{}]}
        mock_activity.return_value = updation_response

        # when
        result = await trigger_updating_user_activities(user_id)

        # then
        assert result == updation_response
        mock_activity.assert_called_with(user_id)
    
    '''
    This code tests trigger_action_follow_or_unfollow_user
    Case 1: Return json if successfully sent
    '''

    # Case 1
    @pytest.mark.asyncio
    @patch("services.admin_panel_service.admin_panel_actions.take_action_follow_or_unfollow")
    async def test_trigger_action_follow_or_unfollow_user_Successful(self, mock_activity):
        # given
        current_user_id = user_id
        reciever_user_id = '123'
        # action_taken = 'follow'
        action_response = {'duration': '9.03ms'}
        mock_activity.return_value = action_response

        # when
        result1 = await trigger_action_follow_or_unfollow_user(current_user_id, reciever_user_id, 'follow') 
        result2 = await trigger_action_follow_or_unfollow_user(current_user_id, reciever_user_id, 'unfollow') 

        # then
        assert result1 == action_response
        assert result2 == action_response
        mock_activity.assert_has_calls([mock.call(current_user_id, reciever_user_id, 'follow'), 
                                        mock.call(current_user_id, reciever_user_id, 'unfollow')])