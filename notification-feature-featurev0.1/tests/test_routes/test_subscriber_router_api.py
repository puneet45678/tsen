from index import app
from unittest import IsolatedAsyncioTestCase
from unittest.mock import patch
import pytest
from fastapi.testclient import TestClient
from tests.test_dependencies.MockedMiddleware import MockedSessionMiddleware

from models.project_updates_model import Project_Updates
from models.user_model import User
from models.user_notification_status_model import User_Notification_Status

#---------------------------------------------------------------------------------#
# Setting up the testCLient

test_client = TestClient(app)
app.user_middleware.clear()
app.add_middleware(MockedSessionMiddleware)
user_id = mongoId = '647f0bacb301c331cc2d415e'

#---------------------------------------------------------------------------------#

class TestSubscriberApi(IsolatedAsyncioTestCase):

    '''
    This code tests get_available_data_regarding_notifications_subscribed_to endpoint
    Case 1: Return successful 200 status code
    '''

    # Case 1
    @pytest.mark.asyncio
    @patch("routes.subscriber_router.db_service.trigger_get_notifications_data")
    async def test_get_available_data_regarding_notifications_subscribed_to_Successful(self, mock_trigger):
        # given
        mock_trigger.return_value = "user_notifications_data"

        # when
        response = test_client.get(
            f'/notifications/api/v1/user/{user_id}/user_notification_settings'
        )

        # then
        assert response.status_code == 200
        assert response.json() == "user_notifications_data"
        mock_trigger.assert_called_with(mongoId)

    '''
    This code tests update_notificaion_data endpoint
    Case 1: Return successful 200 status code
    '''

    # Case 1
    @pytest.mark.asyncio
    @patch("routes.subscriber_router.db_service.trigger_handle_notification_data")
    async def test_update_notificaion_data_Successful(self, mock_trigger):
        # given
        data = User_Notification_Status(
            someone_backs_your_campaign = False,
            new_update_on_backed_campaign = False
        )
        mock_trigger.return_value = f"Successfully updated notification data for user {user_id}"

        # when
        response = test_client.put(
            f'/notifications/api/v1/user/{user_id}/user_notification_settings',
            json = data.dict()
        )
        
        # then
        assert response.status_code == 200
        assert response.json() == f"Successfully updated notification data for user {user_id}"
        mock_trigger.assert_called_with(user_id, data.someone_backs_your_campaign, data.new_update_on_backed_campaign)
        
    '''
    This code tests user_notification_settings endpoint
    Case 1: Return successful 200 status code
    '''

    # Case 1
    @pytest.mark.asyncio
    @patch("routes.subscriber_router.get_info_service.get_user_data")
    @patch("routes.subscriber_router.db_service.trigger_create_notification_data")
    async def test_user_notification_settings_Successful(self, mock_trigger, mock_get):
        # given
        data = User(
            someone_backs_your_campaign_bool = False,
            new_update_on_backed_campaign_bool = False
        )
        user_name = "ikarus-akash"
        user_mail_id = "akashchaubey443@gmail.com"
        mock_get.return_value = {"user_name": user_name,"user_email": user_mail_id}
        mock_trigger.return_value = f"Successfully created notification data for user: {user_id}"

        # when
        response = test_client.post(
            '/notifications/api/v1/user/user_notification_settings',
            json = data.dict()
        )
        
        # then
        assert response.status_code == 200
        assert response.json() == f"Successfully created notification data for user: {user_id}"
        mock_get.assert_called_with(user_id)
        mock_trigger.assert_called_with(user_id, data.someone_backs_your_campaign_bool, data.new_update_on_backed_campaign_bool, user_mail_id)
        
    '''
    This code tests delete_notification_settings endpoint
    Case 1: Return successful 200 status code
    '''

    # Case 1
    @pytest.mark.asyncio
    @patch("routes.subscriber_router.db_service.trigger_handle_delete_notification_settings")
    async def test_delete_notification_settings_Successful(self, mock_trigger):
        # given
        mock_trigger.return_value = f"Successfully deleted notification data for user: {user_id}"

        # when
        response = test_client.delete(
            f'/notifications/api/v1user/{user_id}/user_notification_settings'
        )
        
        # then
        assert response.status_code == 200
        assert response.json() == f"Successfully deleted notification data for user: {user_id}"
        mock_trigger.assert_called_with(user_id)
        
    '''
    This code tests add_email_to_subscribers_list_for_topic_project_updates endpoint
    Case 1: Return successful 200 status code
    '''

    # Case 1
    @pytest.mark.asyncio
    @patch("routes.subscriber_router.db_service.trigger_handle_adding_email_to_subscribers_list_topic_project_update")
    async def test_add_email_to_subscribers_list_for_topic_project_updates_Successful(self, mock_trigger):
        # given
        data = Project_Updates(
            user_id = mongoId,
            backer_email_id = "akashchaubey443@gmail.com",
            campaign_id = "6493cb1ba1d03599e920c897"
        )
        mock_trigger.return_value = f"The email: {data.backer_email_id} has been added to the subscription"

        # when
        response = test_client.post(
            f'/notifications/api/v1/user/{user_id}/notification_subscribers/topic_project_updates',
            json = data.dict()
        )
        
        # then
        assert response.status_code == 200
        assert response.json() == f"The email: {data.backer_email_id} has been added to the subscription"
        mock_trigger.assert_called_with(data.user_id, data.backer_email_id, data.campaign_id)
        
    '''
    This code tests remove_email_to_subscribers_list_for_topic_project_updates endpoint
    Case 1: Return successful 200 status code
    '''
    # CustomTestClient was created because TestClient does not support delete when request is passed as payload
    class CustomTestClient(TestClient):
        def delete_with_payload(self,  **kwargs):
            return self.request(method="DELETE", **kwargs)

    # Case 1
    @pytest.mark.asyncio
    @patch("routes.subscriber_router.db_service.trigger_handle_removing_email_from_subscribers_list_topic_project_update")
    async def test_remove_email_to_subscribers_list_for_topic_project_updates_Successful(self, mock_trigger):
        # given
        test_client = self.CustomTestClient(app)
        data = Project_Updates(
            user_id = mongoId,
            backer_email_id = "akashchaubey443@gmail.com",
            campaign_id = "6493cb1ba1d03599e920c897"
        )
        mock_trigger.return_value = f"The email: {data.backer_email_id} has been removed from the subscription"

        # when
        response = test_client.delete_with_payload(
            url = f'/notifications/api/v1/user/{user_id}/notification_subscribers/topic_project_updates',
            json = data.dict()
        )
        
        # then
        assert response.status_code == 200
        assert response.json() == f"The email: {data.backer_email_id} has been removed from the subscription"
        mock_trigger.assert_called_with(data.user_id, data.backer_email_id, data.campaign_id)
