from index import app
from unittest import IsolatedAsyncioTestCase, mock
from unittest.mock import patch, MagicMock
import pytest

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
from routes.brevo_email_router import (
    add_contact_to_list,
    get_current_user,
    remove_contact_from_list,
    send_account_deletion_cool_off_period_email,
    send_email_account_deletion_initiated,
    send_email_campaign_approval,
    send_email_campaign_ending_soon,
    send_email_campaign_published,
    send_email_early_bird_tier_ending_soon,
    send_email_marketplace_purchase,
    send_email_milestone_reached,
    send_email_model_approval,
    send_email_model_deletion_owner,
    send_email_model_deletion_to_backers,
    send_email_model_rejection,
    send_email_notification_new_update_on_backed_campaign,
    send_email_notification_someone_backed_your_campaign,
    send_email_object_lying_in_draft,
    send_email_premarketing_signup,
    send_email_you_signed_up
    )


#---------------------------------------------------------------------------------#
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

invalid_email_addresses = [
    '', 'plainaddress', '#@%^%#$@#$@#.com', '@example.com',
    'Joe Smith <email@example.com>', 'email.example.com',
    'email@example@example.com', '.email@example.com', 
    'email.@example.com', 'email..email@example.com',
    'あいうえお@example.com', 'email@example.com (Joe Smith)',
    'email@example', 'email@-example.com', 'email@example.web',
    'email@111.222.333.44444', 'email@example..com', 'Abc..123@example.com'
    ]
#---------------------------------------------------------------------------------#

class TestSendNotificationBrevo(IsolatedAsyncioTestCase):

    '''
    This code tests send_email_notification_someone_backed_your_campaign
    Case 1: Returns successful message
    Case 2: Raise 400 HTTPException in case of invalid email id.
            `e.detail` contains the reason, which is different for different
            errors in email_id
    '''

    # Case 1
    pytest.mark.asyncio
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
        result = await send_email_notification_someone_backed_your_campaign(data)

        # then
        assert result == success_response
        mock_get.assert_has_calls([mock.call(data.subscriber_user_id), mock.call(data.backer_user_id)])
        mock_get_campaign.assert_called_with(data.campaign_id)
        mock_handle.assert_called_with(user_name, user_email, campaign_name, user_name)
    
    # Case 2
    pytest.mark.asyncio
    @patch("mail_service.brevo.get_info_service.get_user_data")
    async def test_send_email_notification_someone_backed_your_campaign_Exception(self, mock_get):
        # given
        data = Backed_Notification(
            subscriber_user_id = mongoId,
            campaign_id = campaign_id,
            backer_user_id = mongoId
        )
        invalid_user_email = invalid_email_addresses[1]
        subscriber_user_data = {"user_name": user_name,"user_email": invalid_user_email}
        mock_get.return_value = subscriber_user_data

        # when
        try:
            await send_email_notification_someone_backed_your_campaign(data)
        except Exception as e:        
        # then
            assert e.status_code == 400
            
    '''
    This code tests send_email_notification_new_update_on_backed_campaign
    Case 1: Returns successful message
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
        result = await send_email_notification_new_update_on_backed_campaign(data)

        # then
        assert result == {
            "email_response: ": success_response,
            "getstream_activity_response": activity_add_response,
            }
        mock_add.assert_called_with(data.campaign_owner_id, verb, notification_data)
        mock_handle.assert_called_with(subscriber_list, data.trigger_point, campaign_name)
        mock_get_campaign.assert_called_with(data.campaign_id)
        mock_trigger.assert_called_with(data.campaign_owner_id, data.campaign_id)

    '''
    This code tests send_email_you_signed_up
    Case 1: Returns successful message
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
        result = await send_email_you_signed_up(mongoId)

        # then
        assert result == success_response
        mock_get.assert_called_with(mongoId)
        mock_handle.assert_called_with(user_name, user_email)
    
    '''
    This code tests send_email_model_approval
    Case 1: Returns successful message
    Case 2: Raise 400 HTTPException in case of invalid email id.
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
        result = await send_email_model_approval(data)

        # then
        assert result == success_response
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
        try:
            await send_email_model_approval(data)
        except Exception as e:
            print(e.detail)
        
        # then
            assert e.status_code == 400
    
    '''
    This code tests send_email_model_rejection
    Case 1: Returns successful message
    '''

    # Case 1
    @pytest.mark.asyncio
    @patch("mail_service.brevo.email_sendinblue_service.handle_new_model_rejection_email")
    async def test_send_email_model_rejection_Successful(self, mock_handle):
        # given
        data = ModelRejection(
            user_email = user_email,
            user_name = 'ikarus-akash',
            model_name = model_name
            )
        mock_handle.return_value = success_response

        # when
        result = await send_email_model_rejection(data)

        # then
        assert result == success_response
        mock_handle.assert_called_with(user_email, model_name)
    
    '''
    This code tests send_email_campaign_approval
    Case 1: Action - 'approved' successful message
    Case 2: Action - 'rejected' successful message
    '''

    # Case 1
    @pytest.mark.asyncio
    @patch("mail_service.brevo.email_sendinblue_service.handle_new_campaign_approval_or_rejection_email")
    async def test_send_email_campaign_approval_Approve_Successful(self, mock_handle):
        # given
        data = CampaignApprovalModel(
            user_email = user_email,
            user_name = user_name,
            campaign_name = campaign_name
            )
        action = "approved"
        mock_handle.return_value = success_response

        # when
        result = await send_email_campaign_approval(data, action)

        # then
        assert result == success_response
        mock_handle.assert_called_with(user_email, campaign_name, action)

    # Case 2
    @pytest.mark.asyncio
    @patch("mail_service.brevo.email_sendinblue_service.handle_new_campaign_approval_or_rejection_email")
    async def test_send_email_campaign_approval_Rejected_Successful(self, mock_handle):
        # given
        data = CampaignApprovalModel(
            user_email = user_email,
            user_name = user_name,
            campaign_name = campaign_name
            )
        action = "rejected"
        mock_handle.return_value = success_response

        # when
        result = await send_email_campaign_approval(data, action)

        # then
        assert result == success_response
        mock_handle.assert_called_with(user_email, campaign_name, action)
    
    '''
    This code tests send_email_campaign_published
    Case 1: Returns successful message
    '''

    # Case 1
    @pytest.mark.asyncio
    @patch("mail_service.brevo.get_info_service.get_user_data")
    @patch("mail_service.brevo.email_sendinblue_service.handle_campaign_published_email")
    async def test_send_email_campaign_published_Successful(self, mock_handle, mock_get):
        # given
        data = CampaignPublished(
            user_id = mongoId,
            campaign_name = campaign_name,
            ) 
        mock_get.return_value = get_user_data
        mock_handle.return_value = success_response

        # when
        result = await send_email_campaign_published(data)

        # then
        assert result == success_response
        mock_get.assert_called_with(mongoId)
        mock_handle.assert_called_with(campaign_name, user_email)
  
    '''
    This code tests send_email_premarketing_signup
    Case 1: Returns successful message
    '''

    # Case 1
    @pytest.mark.asyncio
    @patch("mail_service.brevo.get_info_service.get_user_data")
    @patch("mail_service.brevo.get_info_service.get_campaign_name")
    @patch("mail_service.brevo.email_sendinblue_service.handle_premarketing_signup_email")
    @patch("mail_service.brevo.db_service.trigger_handle_adding_to_premarket_signup_list")
    async def test_send_email_premarketing_signup_Successful(self, mock_trigger, mock_handle, mock_get_campaign, mock_get):
        # given
        request = MagicMock()
        request.state.user_id = mongoId
        data = PremarketingSignupModel(
            campaign_id = campaign_id,
            campaing_owner_user_id = mongoId
            ) 
        mock_get.return_value = get_user_data
        mock_get_campaign.return_value = campaign_name
        mock_handle.return_value = success_response
        mock_trigger.return_value = f"The email: {user_email} has been added to premarketing signup list for campaign_id: {campaign_id}"

        # when
        result = await send_email_premarketing_signup(data, request)

        # then
        assert result == success_response
        mock_get.assert_has_calls([mock.call(mongoId), mock.call(data.campaing_owner_user_id)])
        mock_get_campaign.assert_called_with(data.campaign_id)
        mock_handle.assert_called_with(user_name, campaign_name, user_email)
        mock_trigger.assert_called_with(data.campaing_owner_user_id, user_email, data.campaign_id)
    
    '''
    This code tests send_email_marketplace_purchase
    Case 1: Returns successful message
    '''

    # Case 1
    @pytest.mark.asyncio
    @patch("mail_service.brevo.get_info_service.get_user_data")
    @patch("mail_service.brevo.email_sendinblue_service.handle_marketplace_purchase_email")
    async def test_send_email_marketplace_purchase_Successful(self, mock_handle, mock_get):
        # given
        request = MagicMock()
        request.state.user_id = mongoId
        data = MarketplacePurchase(
            model_id = "123",
            model_owner_user_id = mongoId,
            model_name = model_name
            ) 
        mock_get.return_value = get_user_data
        mock_handle.return_value = success_response
        
        # when
        result = await send_email_marketplace_purchase(data, request)

        # then
        assert result == success_response
        mock_get.assert_has_calls([mock.call(data.model_owner_user_id), mock.call(mongoId)])
        mock_handle.assert_called_with(user_name, data.model_name, user_email)
    
    '''
    This code tests send_email_milestone_reached
    Case 1: Returns successful message
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
        result = await send_email_milestone_reached(data)

        # then
        assert result == {
            "email_response: ": email_response,
            "getstream_activity_response: ": activity_add_response,
            }
        mock_get.assert_called_with(data.user_id)
        mock_get_campaign.assert_called_with(data.campaign_id)
        mock_trigger.assert_called_with(data.user_id, data.campaign_id)
        mock_handle.assert_called_with(user_name, user_email, data.milestone_name, subscriber_list, campaign_name)
        mock_feed.assert_called_with(data.user_id, verb, notification_data)
    
    '''
    This code tests send_email_early_bird_tier_ending_soon
    Case 1: Returns successful message
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
        result = await send_email_early_bird_tier_ending_soon(data)

        # then
        assert result == {
            "email_response: ": success_response,
            "getstream_activity_response: ": activity_add_response,
            }
        mock_get_campaign.assert_called_with(data.campaign_id)
        mock_trigger.assert_called_with(data.campaign_owner_id, data.campaign_id)
        mock_handle.assert_called_with(subscriber_list, campaign_name, data.time_left)
        mock_feed.assert_called_with("3", verb, notification_data)
    
    '''
    This code tests send_email_campaign_ending_soon
    Case 1: Returns successful message
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
        result = await send_email_campaign_ending_soon(data)

        # then
        assert result == success_response
        mock_get_campaign.assert_called_with(campaign_id)
        mock_trigger.assert_called_with(data.campaign_owner_id, data.campaign_id)
        mock_handle.assert_called_with(subscriber_list, campaign_name, data.time_left)

    '''
    This code tests send_email_object_lying_in_draft
    Case 1: Returns successful message
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
        result = await send_email_object_lying_in_draft(mongoId, campaign_name)

        # then
        assert result == success_response
        mock_get.assert_called_with(mongoId)
        mock_handle.assert_called_with(user_name, user_email, campaign_name)
    
    '''
    This code tests send_email_model_deletion_to_backers
    Case 1: Returns successful message
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
        result = await send_email_model_deletion_to_backers(data)

        # then
        assert result == success_response
        mock_handle.assert_called_with(data.model_name, data.buyers_email_list)
    
    '''
    This code tests send_email_account_deletion_initiated
    Case 1: Returns successful message
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
        result = await send_email_account_deletion_initiated(data)

        # then
        assert result == success_response
        mock_get.assert_called_with(data.user_id)
        mock_handle.assert_called_with(user_name, user_email)
    
    '''
    This code tests send_email_model_deletion_owner
    Case 1: Returns successful message
    '''

    # Case 1
    @pytest.mark.asyncio
    @patch("mail_service.brevo.get_info_service.get_user_data")
    @patch("mail_service.brevo.email_sendinblue_service.handle_model_deletion_cool_off_period_email")
    async def test_send_email_model_deletion_owner_Successful(self, mock_handle, mock_get):
        # given
        mock_get.return_value = get_user_data
        mock_handle.return_value = success_response
        
        # when
        result = await send_email_model_deletion_owner(mongoId, '123', model_name)

        # then
        assert result == success_response
        mock_get.assert_called_with(mongoId)
        mock_handle.assert_called_with(user_name, user_email, model_name)
    
    '''
    This code tests send_account_deletion_cool_off_period_email
    Case 1: Returns successful message
    '''

    # Case 1
    @patch("mail_service.brevo.email_sendinblue_service.handle_account_deletion_cool_off_period_email")
    def test_send_account_deletion_cool_off_period_email_Successful(self, mock_handle):
        # given
        mock_handle.return_value = success_response
        
        # when
        result = send_account_deletion_cool_off_period_email(mongoId, user_email, user_name)

        # then
        assert result == success_response
        mock_handle.assert_called_with(user_name, user_email)


class TestAddDeleteToList(IsolatedAsyncioTestCase):
    
    '''
    This code tests add_contact_to_list
    Case 1: Returns successful message
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
        result = await add_contact_to_list(data)

        # then
        assert result == success_response
        mock_handle.assert_called_with(data.email_id, data.list_names)
    
    '''
    This code tests remove_contact_from_list
    Case 1: Returns successful message
    '''

    # Case 1
    @pytest.mark.asyncio
    @patch("mail_service.brevo.email_sendinblue_service.handle_removing_contacts_from_list")
    async def test_remove_contact_from_list_Successful(self, mock_handle):
        # given
        data = ContactList(
            email_id = user_email,
            list_names = ["List 1", "List 2", "List 3"]
            )
        mock_handle.return_value = success_response
        
        # when
        result = await remove_contact_from_list(data)

        # then
        assert result == success_response
        mock_handle.assert_called_with(data.email_id, data.list_names)

