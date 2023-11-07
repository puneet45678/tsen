from fastapi import HTTPException, status
from index import app
from unittest import IsolatedAsyncioTestCase, TestCase, mock
from unittest.mock import patch
import pytest
from fastapi.testclient import TestClient
from tests.test_dependencies.MockedMiddleware import MockedSessionMiddleware

from models.account_deletion_initiated_model import AccountDeletionInitializerModel
from models.backed_notification_model import Backed_Notification
from models.brevo_contact_list_model import ContactList
from models.campaign_ending_soon_model import CampaignEndingSoon
from models.campaign_published_model import CampaignPublished
from models.early_bird_tier_ending_soon_model import EarlyBirdTierEndingSoon
from models.marketplace_purchase_model import MarketplacePurchase
from models.milestone_reached_model import MilestoneReached
from models.model_deletion_model import ModelDeletion
from models.new_campaign_approval import CampaignApprovalModel
from models.new_model_approval import ModelApproval
from models.new_model_rejection import ModelRejection
from models.premarketing_signup_model import PremarketingSignupModel
from models.project_update_notification_model import Project_Update_Notification


#---------------------------------------------------------------------------------#
# Setting up the testCLient

test_client = TestClient(app)
app.user_middleware.clear()
app.add_middleware(MockedSessionMiddleware)
mongoId = '647f0bacb301c331cc2d415e'

campaign_id = '6493cb1ba1d03599e920c897'
user_name = "ikarus-akash"
user_email = "akashchaubey443@gmail.com"
campaign_name = "Batman"
model_name = 'Hengstland Scouts foot and mounted'
invalid_user_email = "invalid-email.com"
get_user_data = {
    "user_name": user_name,
    "user_email": user_email
    }
success_response = {"message": "success", "api-response": "api_response"}

#---------------------------------------------------------------------------------#

class TestSendNotificationBrevoApi(IsolatedAsyncioTestCase):

    '''
    This code tests send_email_notification_someone_backed_your_campaign endpoint
    Case 1: Return successful 200 status code
    Case 2: Raise 400 HTTPException in case of invalid email id
    '''

    # Case 1
    @pytest.mark.asyncio
    @patch("mail_service.brevo.get_info_service.get_user_data")
    @patch("mail_service.brevo.get_info_service.get_campaign_name")
    @patch("mail_service.brevo.email_sendinblue_service.handle_new_backer_email")
    async def test_send_email_notification_someone_backed_your_campaign_Successful(self, mock_handle, mock_get_campaign, mock_get):
        # given
        data = Backed_Notification(
            subscriber_user_id = mongoId,
            campaign_id = campaign_id,
            backer_user_id = mongoId
        )
        subscriber_user_data = get_user_data
        backer_user_data = get_user_data
        mock_get.return_value = subscriber_user_data
        mock_get_campaign.return_value = campaign_name
        mock_handle.return_value = success_response

        # when
        response = test_client.post(
            "/email/api/v1/notification/topic/someone_backed_your_campaign",
            json = data.dict()
        )
        
        # then
        assert response.status_code == 200
        assert response.json() == success_response
        mock_get.assert_has_calls([mock.call(data.subscriber_user_id), mock.call(data.backer_user_id)])
        mock_get_campaign.assert_called_with(data.campaign_id)
        mock_handle.assert_called_with(user_name, user_email, campaign_name, user_name)
    
    # Case 2
    @pytest.mark.asyncio
    @patch("mail_service.brevo.get_info_service.get_user_data")
    @patch("mail_service.brevo.get_info_service.get_campaign_name")
    @patch("mail_service.brevo.email_sendinblue_service.handle_new_backer_email")
    async def test_send_email_notification_someone_backed_your_campaign_Exception(self, mock_handle, mock_get_campaign, mock_get):
        # given
        data = Backed_Notification(
            subscriber_user_id = mongoId,
            campaign_id = campaign_id,
            backer_user_id = mongoId
        )
        subscriber_user_data = {"user_name": user_name, "user_email": invalid_user_email}

        # when
        response = test_client.post(
            "/email/api/v1/notification/topic/someone_backed_your_campaign",
            json = data.dict()
        )

        # then
        assert response.status_code == 400
        mock_get.assert_has_calls([mock.call(data.subscriber_user_id)])

    '''
    This code tests send_email_notification_new_update_on_backed_campaign endpoint
    Case 1: Return successful 200 status code
    '''

    # Case 1
    @pytest.mark.asyncio
    @patch("mail_service.brevo.db_service.trigger_return_subscriber_list_topic_project_update")
    @patch("mail_service.brevo.get_info_service.get_campaign_name")
    @patch("mail_service.brevo.email_sendinblue_service.handle_new_project_update_email")
    @patch("mail_service.brevo.admin_panel_service.trigger_adding_activity_to_user_feed")
    async def test_send_email_notification_new_update_on_backed_campaign_Successful(self, mock_add, mock_handle, mock_get_campaign, mock_trigger):
        # given
        data = Project_Update_Notification(
            campaign_owner_id = mongoId,
            trigger_point = "project_update",
            campaign_id = campaign_id
        )
        subscriber_list = {"a1@g.com", "a2@g.com"}
        notification_data = "Project has an Update"
        verb = "update_on_campaigns"
        activity_add_response = {
            "actor": "{\"data\":{\"name\":\"Ikarus-Nest\"},\"id\":\"1\"}", "duration": "8.65ms",
            "foreign_id": "", "id": "1d96baa6-1c25-11ee-8080-80012c4043a8", "object": mongoId,
            "origin": None, "target": "", "text": notification_data,
            "time": "2023-07-06T17:47:03.084919+00:00",
            "to": ["notification:2", "notification:4"],
            "verb": verb
            }
        mock_trigger.return_value = subscriber_list
        mock_get_campaign.return_value = campaign_name
        mock_handle.return_value = success_response
        mock_add.return_value = activity_add_response

        # when
        response = test_client.post(
            "/email/api/v1/notification/topic/new_update_on_backed_campaign",
            json = data.dict()
        )

        # then
        assert response.status_code == 200
        assert response.json() == {
            "email_response: ": success_response,
            "getstream_activity_response": activity_add_response,
            }
        mock_add.assert_called_with(data.campaign_owner_id, "update_on_campaigns", "Project has an Update")
        mock_handle.assert_called_with(subscriber_list, data.trigger_point, campaign_name)
        mock_get_campaign.assert_called_with(data.campaign_id)
        mock_trigger.assert_called_with(data.campaign_owner_id, data.campaign_id)

    '''
    This code tests send_email_you_signed_up endpoint
    Case 1: Return successful 200 status code
    '''

    # Case 1
    @pytest.mark.asyncio
    @patch("mail_service.brevo.get_info_service.get_user_data")
    @patch("mail_service.brevo.email_sendinblue_service.handle_new_signup_email")
    async def test_send_email_you_signed_up_Successful(self, mock_handle, mock_get):
        # given
        mock_get.return_value = get_user_data
        mock_handle.return_value = success_response

        # when
        response = test_client.post(
            f"/email/api/v1/notification/sign-up?user_id={mongoId}"
        )

        # then
        assert response.status_code == 200
        assert response.json() == success_response
        mock_get.assert_called_with(mongoId)
        mock_handle.assert_called_with(user_name, user_email)
    
    '''
    This code tests send_email_model_approval endpoint
    Case 1: Return successful 200 status code
    Case 2: Raise 400 HTTPException in case of invalid email id
    '''

    # Case 1
    @pytest.mark.asyncio
    @patch("mail_service.brevo.email_sendinblue_service.handle_new_model_approval_email")
    async def test_send_email_model_approval_Successful(self, mock_handle):
        # given
        data = ModelApproval(
            user_email = user_email,
            model_name = model_name
            )
        mock_handle.return_value = success_response

        # when
        response = test_client.post(
            "/email/api/v1/notification/model-approval", 
            json = data.dict()
        )

        # then
        assert response.status_code == 200
        assert response.json() == success_response
        mock_handle.assert_called_with(user_email, model_name)
    
    # Case 2
    @pytest.mark.asyncio
    @patch("mail_service.brevo.email_sendinblue_service.handle_new_model_approval_email")
    async def test_send_email_model_approval_Exception(self, mock_handle):
        # given
        data = ModelApproval(
            user_email = user_email,
            model_name = model_name
            )
        data.user_email = invalid_user_email
        
        # when
        response = test_client.post(
            "/email/api/v1/notification/model-approval", 
            json = data.dict()
        )

        # then
        assert response.status_code == 400
    
    '''
    This code tests send_email_model_rejection endpoint
    Case 1: Return successful 200 status code
    '''

    # Case 1
    @pytest.mark.asyncio
    @patch("mail_service.brevo.email_sendinblue_service.handle_new_model_rejection_email")
    async def test_send_email_model_rejection_Successful(self, mock_handle):
        # given
        data = ModelRejection(
            user_email = user_email,
            model_name = model_name,
            user_name = user_name
            )
        mock_handle.return_value = success_response

        # when
        response = test_client.post(
            "/email/api/v1/notification/model-rejection", 
            json = data.dict()
        )

        # then
        assert response.status_code == 200
        assert response.json() == success_response
        mock_handle.assert_called_with(user_email, model_name)
    
    '''
    This code tests send_email_campaign_approval endpoint
    Case 1: Action - 'approved' successful message
    Case 2: Action - 'rejected' successful message
    '''

    # Case 1
    @pytest.mark.asyncio
    @patch("mail_service.brevo.email_sendinblue_service.handle_new_campaign_approval_or_rejection_email")
    async def test_send_email_campaign_approval_ApproveSuccessful(self, mock_handle):
        # given
        data = CampaignApprovalModel(
            user_email = user_email,
            user_name = user_name,
            campaign_name = campaign_name
            )
        action = "approved"
        mock_handle.return_value = success_response

        # when
        response = test_client.post(
            f"/email/api/v1/notification/admin/campaign-action?action={action}", 
            json = data.dict()
        )

        # then
        assert response.status_code == 200
        assert response.json() == success_response
        mock_handle.assert_called_with(user_email, campaign_name, action)

    # Case 2
    @pytest.mark.asyncio
    @patch("mail_service.brevo.email_sendinblue_service.handle_new_campaign_approval_or_rejection_email")
    async def test_send_email_campaign_approval_RejectedSuccessful(self, mock_handle):
        # given
        data = CampaignApprovalModel(
            user_email = user_email,
            user_name = user_name,
            campaign_name = campaign_name
            )
        action = "rejected"
        mock_handle.return_value = success_response

        # when
        response = test_client.post(
            f"/email/api/v1/notification/admin/campaign-action?action={action}", 
            json = data.dict()
        )

        # then
        assert response.status_code == 200
        assert response.json() == success_response
        mock_handle.assert_called_with(user_email, campaign_name, action)
    
    '''
    This code tests send_email_campaign_published endpoint
    Case 1: Return successful 200 status code
    '''

    # Case 1
    @pytest.mark.asyncio
    @patch("mail_service.brevo.get_info_service.get_user_data")
    @patch("mail_service.brevo.email_sendinblue_service.handle_campaign_published_email")
    async def test_send_email_campaign_published_Successful(self, mock_handle, mock_get):
        # given
        data = CampaignPublished(
            user_id = mongoId,
            campaign_name = campaign_name
            ) 
        mock_get.return_value = get_user_data
        mock_handle.return_value = success_response

        # when
        response = test_client.post(
            "/email/api/v1/notification/campaign-published", 
            json = data.dict()
        )

        # then
        assert response.status_code == 200
        assert response.json() == success_response
        mock_get.assert_called_with(data.user_id)
        mock_handle.assert_called_with(data.campaign_name, user_email)
  
    '''
    This code tests send_email_premarketing_signup endpoint
    Case 1: Return successful 200 status code
    '''

    # Case 1
    @pytest.mark.asyncio
    @patch("mail_service.brevo.get_info_service.get_user_data")
    @patch("mail_service.brevo.get_info_service.get_campaign_name")
    @patch("mail_service.brevo.email_sendinblue_service.handle_premarketing_signup_email")
    @patch("mail_service.brevo.db_service.trigger_handle_adding_to_premarket_signup_list")
    async def test_send_email_premarketing_signup_Successful(self, mock_trigger, mock_handle, mock_get_campaign, mock_get):
        # given
        data = PremarketingSignupModel(
            campaign_id = campaign_id,
            campaing_owner_user_id = mongoId
            ) 
        mock_get.return_value = get_user_data
        mock_get_campaign.return_value = campaign_name
        mock_handle.return_value = success_response
        mock_trigger.return_value = f"The email: {user_email} has been added to premarketing signup list for campaign_id: {campaign_id}"
        
        # when
        response = test_client.post(
            "/email/api/v1/notification/pre-marketing-signup", 
            json = data.dict()
        )

        # then
        assert response.status_code == 200
        assert response.json() == success_response
        mock_get.assert_has_calls([mock.call(mongoId), mock.call(data.campaing_owner_user_id)])
        mock_get_campaign.assert_called_with(data.campaign_id)
        mock_handle.assert_called_with(user_name, campaign_name, user_email)
        mock_trigger.assert_called_with(data.campaing_owner_user_id, user_email, data.campaign_id)
    
    '''
    This code tests send_email_marketplace_purchase endpoint
    Case 1: Return successful 200 status code
    '''

    # Case 1
    @pytest.mark.asyncio
    @patch("mail_service.brevo.get_info_service.get_user_data")
    @patch("mail_service.brevo.email_sendinblue_service.handle_marketplace_purchase_email")
    async def test_send_email_marketplace_purchase_Successful(self, mock_handle, mock_get):
        # given
        data = MarketplacePurchase(
            model_id = "123",
            model_owner_user_id = mongoId,
            model_name = model_name
            ) 
        mock_get.return_value = get_user_data
        mock_handle.return_value = success_response
        
        # when
        response = test_client.post(
            "/email/api/v1/notification/marketplace-purchase", 
            json = data.dict()
        )

        # then
        assert response.status_code == 200
        assert response.json() == success_response
        mock_get.assert_has_calls([mock.call(data.model_owner_user_id), mock.call(mongoId)])
        mock_handle.assert_called_with(user_name, data.model_name, user_email)
    
    '''
    This code tests send_email_milestone_reached endpoint
    Case 1: Return successful 200 status code
    '''

    # Case 1
    @pytest.mark.asyncio
    @patch("mail_service.brevo.get_info_service.get_user_data")
    @patch("mail_service.brevo.get_info_service.get_campaign_name")
    @patch("mail_service.brevo.db_service.trigger_return_subscriber_list_topic_project_update")
    @patch("mail_service.brevo.email_sendinblue_service.handle_milestone_reached_email_to_owner_and_backers")
    @patch("mail_service.brevo.admin_panel_service.trigger_adding_activity_to_user_feed")
    async def test_send_email_milestone_reached_Successful(self, mock_feed, mock_handle, mock_trigger, mock_get_campaign, mock_get):
        # given
        data = MilestoneReached(
            user_id = mongoId,
            campaign_id = campaign_id,
            milestone_name = "milestone_name"
            )
        subscriber_list = {"a1@g.com", "a2@g.com"}
        notification_data = "Ahoy! Your backed campaign has reached a milestone"
        verb = "milestone_reached"
        email_response = {
            "sending_to_backers: ": success_response,
            "sending_to_owner: ": success_response,
            }
        activity_add_response = {
            "actor": "{\"data\":{\"name\":\"Ikarus-Nest\"},\"id\":\"1\"}", "duration": "8.65ms",
            "foreign_id": "", "id": "1d96baa6-1c25-11ee-8080-80012c4043a8", "object": mongoId,
            "origin": None, "target": "", "text": notification_data,
            "time": "2023-07-06T17:47:03.084919+00:00",
            "to": ["notification:2", "notification:4"],
            "verb": verb
            }
        mock_get.return_value = get_user_data
        mock_get_campaign.return_value = campaign_name
        mock_trigger.return_value = subscriber_list
        mock_handle.return_value = email_response
        mock_feed.return_value = activity_add_response
            
        # when
        response = test_client.post(
            "/email/api/v1/notification/milestone-reached", 
            json = data.dict()
        )

        # then
        assert response.status_code == 200
        assert response.json() == {
            "email_response: ": email_response,
            "getstream_activity_response: ": activity_add_response,
            }
        mock_get.assert_called_with(data.user_id)
        mock_get_campaign.assert_called_with(data.campaign_id)
        mock_trigger.assert_called_with(data.user_id, data.campaign_id)
        mock_handle.assert_called_with(user_name, user_email, data.milestone_name, subscriber_list, campaign_name)
        mock_feed.assert_called_with(data.user_id, verb, notification_data)
    
    '''
    This code tests send_email_early_bird_tier_ending_soon endpoint
    Case 1: Return successful 200 status code
    '''

    # Case 1
    @pytest.mark.asyncio
    @patch("mail_service.brevo.get_info_service.get_campaign_name")
    @patch("mail_service.brevo.db_service.trigger_return_premarket_signee_list_topic_project_update")
    @patch("mail_service.brevo.email_sendinblue_service.handle_early_bird_tier_ending_soon_email")
    @patch("mail_service.brevo.admin_panel_service.trigger_adding_activity_to_user_feed")
    async def test_send_email_early_bird_tier_ending_soon_Successful(self, mock_feed, mock_handle, mock_trigger, mock_get_campaign):
        # given
        data = EarlyBirdTierEndingSoon(
            time_left = "5",
            campaign_owner_id = mongoId,
            campaign_id = campaign_id
            )
        subscriber_list = {"a1@g.com", "a2@g.com"}
        notification_data = "The early Bird tier ending soon"
        verb = "early_bird_tier"
        activity_add_response = {
            "actor": "{\"data\":{\"name\":\"Ikarus-Nest\"},\"id\":\"1\"}", "duration": "8.65ms",
            "foreign_id": "", "id": "1d96baa6-1c25-11ee-8080-80012c4043a8", "object": "3",
            "origin": None, "target": "", "text": notification_data,
            "time": "2023-07-06T17:47:03.084919+00:00",
            "to": ["notification:2", "notification:4"],
            "verb": verb
            }
        mock_get_campaign.return_value = campaign_name
        mock_trigger.return_value = subscriber_list
        mock_handle.return_value = success_response
        mock_feed.return_value = activity_add_response
            
        # when
        response = test_client.post(
            "/email/api/v1/notification/early-bird-tier-ending-soon", 
            json = data.dict()
        )

        # then
        assert response.status_code == 200
        assert response.json() == {
            "email_response: ": success_response,
            "getstream_activity_response: ": activity_add_response,
            }
        mock_get_campaign.assert_called_with(data.campaign_id)
        mock_trigger.assert_called_with(data.campaign_owner_id, data.campaign_id)
        mock_handle.assert_called_with(subscriber_list, campaign_name, data.time_left)
        mock_feed.assert_called_with("3", verb, notification_data)
    
    '''
    This code tests send_email_campaign_ending_soon endpoint
    Case 1: Return successful 200 status code
    '''

    # Case 1
    @pytest.mark.asyncio
    @patch("mail_service.brevo.get_info_service.get_campaign_name")
    @patch("mail_service.brevo.db_service.trigger_return_premarket_signee_list_topic_project_update")
    @patch("mail_service.brevo.email_sendinblue_service.handle_campaign_ending_soon_email")
    async def test_send_email_campaign_ending_soon_Successful(self, mock_handle, mock_trigger, mock_get_campaign):
        # given
        data = CampaignEndingSoon(
            time_left = "5",
            campaign_owner_id = mongoId,
            campaign_id = campaign_id
            )
        subscriber_list = {"a1@g.com", "a2@g.com"}
        mock_get_campaign.return_value = campaign_name
        mock_trigger.return_value = subscriber_list
        mock_handle.return_value = success_response

        # when
        response = test_client.post(
            "/email/api/v1/notification/campaign-ending-soon", 
            json = data.dict()
        )

        # then
        assert response.status_code == 200
        assert response.json() == success_response
        mock_get_campaign.assert_called_with(campaign_id)
        mock_trigger.assert_called_with(data.campaign_owner_id, data.campaign_id)
        mock_handle.assert_called_with(subscriber_list, campaign_name, data.time_left)

    '''
    This code tests send_email_object_lying_in_draft endpoint
    Case 1: Return successful 200 status code
    '''

    # Case 1
    @pytest.mark.asyncio
    @patch("mail_service.brevo.get_info_service.get_user_data")
    @patch("mail_service.brevo.email_sendinblue_service.handle_object_lying_in_draft_email")
    async def test_send_email_object_lying_in_draft_Successful(self, mock_handle, mock_get):
        # given
        mock_get.return_value = get_user_data
        mock_handle.return_value = success_response
        
        # when
        response = test_client.post(
            f"/email/api/v1/notification/object-in-draft?user_id={mongoId}&campaign_name={campaign_name}"
        )

        # then
        assert response.status_code == 200
        assert response.json() == success_response
        mock_get.assert_called_with(mongoId)
        mock_handle.assert_called_with(user_name, user_email, campaign_name)
    
    '''
    This code tests send_email_model_deletion_to_backers endpoint
    Case 1: Return successful 200 status code
    '''

    # Case 1
    @pytest.mark.asyncio
    @patch("mail_service.brevo.email_sendinblue_service.handle_model_deletion_email_to_backers")
    async def test_send_email_model_deletion_to_backers_Successful(self, mock_handle):
        # given
        data = ModelDeletion(
            model_id = "123",
            model_name = model_name,
            buyers_email_list = [
                "buyer1@example.com",
                "buyer2@example.com",
                "buyer3@example.com"
                ]
            )
        mock_handle.return_value = success_response
        
        # when
        response = test_client.post(
            "/email/api/v1/notification/backers/model-deletion", 
            json = data.dict()
        )

        # then
        assert response.status_code == 200
        assert response.json() == success_response
        mock_handle.assert_called_with(data.model_name, data.buyers_email_list)
    
    '''
    This code tests send_email_account_deletion_initiated endpoint
    Case 1: Return successful 200 status code
    '''

    # Case 1
    @pytest.mark.asyncio
    @patch("mail_service.brevo.get_info_service.get_user_data")
    @patch("mail_service.brevo.email_sendinblue_service.handle_account_deletion_initialization_email")
    async def test_send_email_account_deletion_initiated_Successful(self, mock_handle, mock_get):
        # given
        data = AccountDeletionInitializerModel(
            user_id = mongoId,
            )
        mock_get.return_value = get_user_data
        mock_handle.return_value = success_response
        
        # when
        response = test_client.post(
            "/email/api/v1/notification/account-deletion-initiated", 
            json = data.dict()
        )

        # then
        assert response.status_code == 200
        assert response.json() == success_response
        mock_get.assert_called_with(data.user_id)
        mock_handle.assert_called_with(user_name, user_email)
    
    '''
    This code tests send_email_model_deletion_owner endpoint
    Case 1: Return successful 200 status code
    '''

    # Case 1
    @pytest.mark.asyncio
    @patch("mail_service.brevo.get_info_service.get_user_data")
    @patch("mail_service.brevo.email_sendinblue_service.handle_model_deletion_cool_off_period_email")
    async def test_send_email_model_deletion_owner_Successful(self, mock_handle, mock_get):
        # given
        model_id = '123'
        mock_get.return_value = get_user_data
        mock_handle.return_value = success_response
        
        # when
        response = test_client.post(
            f"/email/api/v1/notification/owner/model-deletion?user_id={mongoId}&model_id={model_id}&model_name={model_name}"
        )

        # then
        assert response.status_code == 200
        assert response.json() == success_response
        mock_get.assert_called_with(mongoId)
        mock_handle.assert_called_with(user_name, user_email, model_name)
    
    '''
    This code tests send_account_deletion_cool_off_period_email endpoint
    Case 1: Return successful 200 status code
    '''

    # Case 1
    ###TODO: Control not being returned after testing -- use: async
    # @patch("mail_service.brevo.email_sendinblue_service.handle_account_deletion_cool_off_period_email")
    # def test_send_account_deletion_cool_off_period_email_Successful(self, mock_handle):
    #     # given
    #     mock_handle.return_value = success_response
        
    #     # when
    #     response = test_client.post(
    #         f"/email/api/v1/notification/account-deletion-cool-off-period?user_id={mongoId}&user_email={user_email}&user_name={user_name}"
    #     )

    #     # then
    #     assert response.status_code == 200
    #     assert response.json() == success_response
    #     mock_handle.assert_called_with(user_name, user_email)


class TestAddDeleteToList(IsolatedAsyncioTestCase):
    
    '''
    This code tests add_contact_to_list endpoint
    Case 1: Return successful 200 status code
    '''

    # Case 1
    @pytest.mark.asyncio
    @patch("mail_service.brevo.email_sendinblue_service.handle_adding_contacts_to_list")
    async def test_add_contact_to_list_Successful(self, mock_handle):
        # given
        data = ContactList(
            email_id = user_email,
            list_names = ["List 1", "List 2", "List 3"]
            )
        mock_handle.return_value = success_response
        
        # when
        response = test_client.post(
            "/email/api/v1/contact", 
            json = data.dict()
        )

        # then
        assert response.status_code == 200
        assert response.json() == success_response
        mock_handle.assert_called_with(data.email_id, data.list_names)
    
    '''
    This code tests remove_contact_from_list endpoint
    Case 1: Return successful 200 status code
    '''
    # CustomTestClient was created because TestClient does not support delete when request is passed as payload
    class CustomTestClient(TestClient):
        def delete_with_payload(self,  **kwargs):
            return self.request(method="DELETE", **kwargs)

    # Case 1
    @pytest.mark.asyncio
    @patch("mail_service.brevo.email_sendinblue_service.handle_removing_contacts_from_list")
    async def test_remove_contact_from_list_Successful(self, mock_handle):
        # given
        test_client = self.CustomTestClient(app)
        data = ContactList(
            email_id = user_email,
            list_names = ["List 1", "List 2", "List 3"]
            )
        mock_handle.return_value = success_response
        
        # when
        response = test_client.delete_with_payload(
            url="/email/api/v1/delete-contact", 
            json = data.dict()
        )

        # then
        assert response.status_code == 200
        assert response.json() == success_response
        mock_handle.assert_called_with(data.email_id, data.list_names)
