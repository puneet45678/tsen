from index import app
from unittest import IsolatedAsyncioTestCase
from unittest.mock import patch
import pytest

from services.db_service import (
    trigger_create_notification_data,
    trigger_get_notifications_data,
    trigger_handle_adding_email_to_subscribers_list_topic_project_update,
    trigger_handle_adding_to_premarket_signup_list,
    trigger_handle_delete_notification_settings,
    trigger_handle_notification_data,
    trigger_handle_removing_email_from_subscribers_list_topic_project_update,
    trigger_return_premarket_signee_list_topic_project_update,
    trigger_return_subscriber_list_topic_project_update
    )


#---------------------------------------------------------------------------------#
user_id = mongoId = '647f0bacb301c331cc2d415e'
campaign_id = '6493cb1ba1d03599e920c897'
user_email = "akashchaubey443@gmail.com"
update_notification_success = f"Successfully updated notification data for user {user_id}"
#---------------------------------------------------------------------------------#

class TestDbService(IsolatedAsyncioTestCase):

    '''
    This code tests trigger_get_notifications_data
    Case 1: Return successful message
    '''

    # Case 1
    @patch("services.db_service.db_actions.get_notifications_data")
    def test_trigger_get_notifications_data_Successful(self, mock_get):
        # given
        mock_get.return_value = "notifications_data"

        # when
        result = trigger_get_notifications_data(user_id)
        
        # then
        assert result == "notifications_data"
        mock_get.assert_called_with(user_id)

    '''
    This code tests trigger_handle_notification_data
    Case 1: Return successful message
    '''

    # Case 1
    @patch("services.db_service.db_actions.handle_update_notification_data")
    def test_trigger_handle_notification_data_Successful(self, mock_handle):
        # given
        someone_backs_your_campaign = "Y"
        new_update_on_backed_campaign = "N"
        mock_handle.return_value = update_notification_success

        # when
        result = trigger_handle_notification_data(user_id, someone_backs_your_campaign, new_update_on_backed_campaign)
        
        # then
        assert result == update_notification_success
        mock_handle.assert_called_with(user_id, someone_backs_your_campaign, new_update_on_backed_campaign)

    '''
    This code tests trigger_create_notification_data
    Case 1: Return successful message
    '''

    # Case 1
    @patch("services.db_service.db_actions.handle_create_notification_settings")
    def test_trigger_create_notification_data_Successful(self, mock_handle):
        # given
        someone_backs_your_campaign_bool = "Y"
        new_update_on_backed_campaign_bool = "N"
        mock_handle.return_value = update_notification_success

        # when
        result = trigger_create_notification_data(user_id, someone_backs_your_campaign_bool, new_update_on_backed_campaign_bool, user_email)
        
        # then
        assert result == update_notification_success
        mock_handle.assert_called_with(user_id, someone_backs_your_campaign_bool, new_update_on_backed_campaign_bool, user_email)

    '''
    This code tests trigger_handle_delete_notification_settings
    Case 1: Return successful message
    '''

    # Case 1
    @patch("services.db_service.db_actions.handle_delete_notification_settings")
    def test_trigger_handle_delete_notification_settings_Successful(self, mock_handle):
        # given
        mock_handle.return_value = update_notification_success

        # when
        result = trigger_handle_delete_notification_settings(user_id)
        
        # then
        assert result == update_notification_success
        mock_handle.assert_called_with(user_id)

    '''
    This code tests trigger_return_subscriber_list_topic_project_update
    Case 1: Return successful message
    '''

    # Case 1
    @patch("services.db_service.db_actions.return_subscriber_list_topic_project_update")
    def test_trigger_return_subscriber_list_topic_project_update_Successful(self, mock_handle):
        # given
        mock_handle.return_value = "campaign_options_backers"

        # when
        result = trigger_return_subscriber_list_topic_project_update(user_id, campaign_id)
        
        # then
        assert result == "campaign_options_backers"
        mock_handle.assert_called_with(user_id, campaign_id)
    
    '''
    This code tests trigger_return_premarket_signee_list_topic_project_update
    Case 1: Return successful message
    '''

    # Case 1
    @patch("services.db_service.db_actions.return_premarket_signee_list_project_update")
    def test_trigger_return_premarket_signee_list_topic_project_update_Successful(self, mock_handle):
        # given
        mock_handle.return_value = "campaign_options_premarketing_signup"

        # when
        result = trigger_return_premarket_signee_list_topic_project_update(user_id, campaign_id)
        
        # then
        assert result == "campaign_options_premarketing_signup"
        mock_handle.assert_called_with(user_id, campaign_id)
    
    '''
    This code tests trigger_handle_adding_email_to_subscribers_list_topic_project_update
    Case 1: Return successful message
    '''

    # Case 1
    @patch("services.db_service.db_actions.handle_adding_subscribers_to_list_topic_project_update")
    def test_trigger_handle_adding_email_to_subscribers_list_topic_project_update_Successful(self, mock_handle):
        # given
        backer_email_id = user_email
        adding_list_msg = f"The email: {backer_email_id} has been added to the subscription"
        mock_handle.return_value = adding_list_msg

        # when
        result = trigger_handle_adding_email_to_subscribers_list_topic_project_update(user_id, backer_email_id, campaign_id)
        
        # then
        assert result == adding_list_msg
        mock_handle.assert_called_with(user_id, backer_email_id, campaign_id)
    
    '''
    This code tests trigger_handle_removing_email_from_subscribers_list_topic_project_update
    Case 1: Return successful message
    '''

    # Case 1
    @patch("services.db_service.db_actions.handle_removing_subscribers_from_list_topic_project_update")
    def test_trigger_handle_removing_email_from_subscribers_list_topic_project_update_Successful(self, mock_handle):
        # given
        backer_email_id = user_email
        adding_list_msg = f"The email: {backer_email_id} has been removed from the subscription"
        mock_handle.return_value = adding_list_msg

        # when
        result = trigger_handle_removing_email_from_subscribers_list_topic_project_update(user_id, backer_email_id, campaign_id)
        
        # then
        assert result == adding_list_msg
        mock_handle.assert_called_with(user_id, backer_email_id, campaign_id)
    
    '''
    This code tests trigger_handle_adding_to_premarket_signup_list
    Case 1: Return successful message
    '''

    # Case 1
    @patch("services.db_service.db_actions.handle_adding_premarket_signees_to_list_topic_project_update")
    def test_trigger_handle_adding_to_premarket_signup_list_Successful(self, mock_handle):
        # given
        backer_email_id = user_email
        adding_list_msg = f"The email: {backer_email_id} has been added to premarketing signup list for campaign_id: {campaign_id}"
        mock_handle.return_value = adding_list_msg

        # when
        result = trigger_handle_adding_to_premarket_signup_list(user_id, backer_email_id, campaign_id)
        
        # then
        assert result == adding_list_msg
        mock_handle.assert_called_with(user_id, backer_email_id, campaign_id)
