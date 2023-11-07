from index import app
from unittest import IsolatedAsyncioTestCase
from unittest.mock import patch
import pytest

from constants import email_content
from models.brevo_contact_list_model import EmailListName
from services.email_brevo_service import (
    handle_account_deletion_cool_off_period_email,
    handle_account_deletion_initialization_email,
    handle_adding_contacts_to_list,
    handle_campaign_ending_soon_email,
    handle_early_bird_tier_ending_soon_email,
    handle_marketplace_purchase_email,
    handle_milestone_reached_email_to_owner_and_backers,
    handle_model_deletion_cool_off_period_email,
    handle_model_deletion_email_to_backers,
    handle_new_backer_email,
    handle_new_campaign_approval_or_rejection_email,
    handle_new_model_approval_email,
    handle_new_model_rejection_email,
    handle_new_project_update_email,
    handle_new_signup_email,
    handle_object_lying_in_draft_email,
    handle_premarketing_signup_email,
    handle_removing_contacts_from_list
    )


#---------------------------------------------------------------------------------#
email_id = "akashchaubey443@gmail.com"
campaign_name = "Batman"
html_content = "Received some html content/str"
sender = {"email": email_content.sender_email}
replyTo = {"email": email_content.reply_to_email}
to = [{"email": email_id}]
send_success_message = {"message": "success", "api-response": "api_response"}

#---------------------------------------------------------------------------------#

class TestSendinblueService(IsolatedAsyncioTestCase):

    '''
    This code tests handle_new_backer_email
    Case 1: Return successful message
    '''

    # Case 1
    @patch("services.email_sendinblue_service.email_content.new_backer_html_content")
    @patch("services.email_sendinblue_service.email_sendinblue_actions.send_email_for_new_backer")
    def test_handle_new_backer_email_Successful(self, mock_send, mock_html):
        # given
        subscriber_name = "ikarus-akash"
        subscriber_email_id = email_id
        backer_name = "Akash"
        mock_html.return_value = html_content
        mock_send.return_value = send_success_message

        # when
        result = handle_new_backer_email(subscriber_name, subscriber_email_id,campaign_name,backer_name)

        # then
        assert result == send_success_message
        mock_html.assert_called_with(subscriber_name, backer_name, campaign_name)
        mock_send.assert_called_with(email_content.new_backer_subject, html_content, sender, replyTo, to)

    '''
    This code tests handle_new_project_update_email
    Case 1: If trigger_point = project_update, return successful message
    Case 2: If trigger_point = campaign_ended, return successful message
    Case 3: If trigger_point = campaign_failed, return successful message
    '''

    trigger_point_vals = {
        "project_update": "project_update",
        "campaign_ended": "campaign_ended",
        "campaign_failed": "campaign_failed"
    }

    # Case 1
    @patch("services.email_sendinblue_service.email_content.project_update_html_content")
    @patch("services.email_sendinblue_service.email_sendinblue_actions.send_emails_for_project_updates")
    def test_handle_new_project_update_email_project_update_Successful(self, mock_send, mock_html):
        # given
        subscriber_email_list = [email_id]
        trigger_point = self.trigger_point_vals["project_update"]
        sender = {"name": "Ikarus Nest", "email": email_content.sender_email}
        replyTo = {"name": "Ikarus Nest", "email": email_content.reply_to_email}        
        mock_html.return_value = html_content
        mock_send.return_value = send_success_message

        # when
        result = handle_new_project_update_email(subscriber_email_list, trigger_point, campaign_name)

        # then
        assert result == send_success_message
        mock_html.assert_called_with(campaign_name)
        mock_send.assert_called_with(email_content.project_update_subject, html_content, sender, replyTo, subscriber_email_list)

    # Case 2
    @patch("services.email_sendinblue_service.email_content.project_ended_html_content")
    @patch("services.email_sendinblue_service.email_sendinblue_actions.send_emails_for_project_updates")
    def test_handle_new_project_update_email_campaign_ended_Successful(self, mock_send, mock_html):
        # given
        subscriber_email_list = [email_id]
        trigger_point = self.trigger_point_vals["campaign_ended"]
        sender = {"name": "Ikarus Nest", "email": email_content.sender_email}
        replyTo = {"name": "Ikarus Nest", "email": email_content.reply_to_email}
        
        mock_html.return_value = html_content
        mock_send.return_value = send_success_message

        # when
        result = handle_new_project_update_email(subscriber_email_list, trigger_point, campaign_name)

        # then
        assert result == send_success_message
        mock_html.assert_called_with(campaign_name)
        mock_send.assert_called_with(email_content.campaign_ended_subject, html_content, sender, replyTo, subscriber_email_list)

    # Case 3
    @patch("services.email_sendinblue_service.email_content.campaign_failed_html_content")
    @patch("services.email_sendinblue_service.email_sendinblue_actions.send_emails_for_project_updates")
    def test_handle_new_project_update_email_campaign_ended_Successful(self, mock_send, mock_html):
        # given
        subscriber_email_list = [email_id]
        trigger_point = self.trigger_point_vals["campaign_failed"]
        sender = {"name": "Ikarus Nest", "email": email_content.sender_email}
        replyTo = {"name": "Ikarus Nest", "email": email_content.reply_to_email}
        
        mock_html.return_value = html_content
        mock_send.return_value = send_success_message

        # when
        result = handle_new_project_update_email(subscriber_email_list, trigger_point, campaign_name)

        # then
        assert result == send_success_message
        mock_html.assert_called_with(campaign_name)
        mock_send.assert_called_with(email_content.campaign_failure_subject, html_content, sender, replyTo, subscriber_email_list)

    '''
    This code tests handle_new_signup_email
    Case 1: Return successful message
    '''

    # Case 1
    @patch("services.email_sendinblue_service.email_content.new_signup_html_content")
    @patch("services.email_sendinblue_service.email_sendinblue_actions.send_email_for_signup")
    def test_handle_new_signup_email_Successful(self, mock_send, mock_html):
        # given
        user_name = "ikarus-akash"
        mock_html.return_value = html_content
        mock_send.return_value = send_success_message

        # when
        result = handle_new_signup_email(user_name, email_id)

        # then
        assert result == send_success_message
        mock_html.assert_called_with(user_name)
        mock_send.assert_called_with(html_content, email_content.new_signup_subject, to, replyTo, sender)

    '''
    This code tests handle_new_model_approval_email
    Case 1: Return successful message
    '''

    # Case 1
    @patch("services.email_sendinblue_service.email_content.new_model_approval")
    @patch("services.email_sendinblue_service.email_sendinblue_actions.handle_email_for_new_model_approval")
    def test_handle_new_model_approval_email_Successful(self, mock_send, mock_html):
        # given
        model_name = "model_name"
        mock_html.return_value = html_content
        mock_send.return_value = send_success_message

        # when
        result = handle_new_model_approval_email(email_id, model_name)

        # then
        assert result == send_success_message
        mock_html.assert_called_with(model_name)
        mock_send.assert_called_with(html_content, email_content.new_model_approval_subject, to, replyTo, sender)

    '''
    This code tests handle_new_model_rejection_email
    Case 1: Return successful message
    '''

    # Case 1
    @patch("services.email_sendinblue_service.email_content.new_model_rejected_html_content")
    @patch("services.email_sendinblue_service.email_sendinblue_actions.handle_email_for_new_model_rejection")
    def test_handle_new_model_rejection_email_Successful(self, mock_send, mock_html):
        # given
        model_name = "model_name"
        mock_html.return_value = html_content
        mock_send.return_value = send_success_message

        # when
        result = handle_new_model_rejection_email(email_id, model_name)

        # then
        assert result == send_success_message
        mock_html.assert_called_with(model_name)
        mock_send.assert_called_with(html_content, email_content.new_model_rejected_subject, to, replyTo, sender)

    '''
    This code tests handle_new_campaign_approval_or_rejection_email
    Case 1: If action = approved, return successful message
    Case 2: If action = rejected, return successful message
    '''

    # Case 1
    @patch("services.email_sendinblue_service.email_content.new_campaign_approval")
    @patch("services.email_sendinblue_service.email_sendinblue_actions.handle_email_for_new_campaign_approval_or_rejection")
    def test_handle_new_campaign_approval_or_rejection_email_approved_Successful(self, mock_send, mock_html):
        # given
        mock_html.return_value = html_content
        mock_send.return_value = send_success_message

        # when
        result = handle_new_campaign_approval_or_rejection_email(email_id, campaign_name, "approved")

        # then
        assert result == send_success_message
        mock_html.assert_called_with(campaign_name)
        mock_send.assert_called_with(html_content, email_content.new_campaign_approval_subject, to, replyTo, sender)

    # Case 2
    @patch("services.email_sendinblue_service.email_content.new_campaign_rejected_html_content")
    @patch("services.email_sendinblue_service.email_sendinblue_actions.handle_email_for_new_campaign_approval_or_rejection")
    def test_handle_new_campaign_approval_or_rejection_email_rejected_Successful(self, mock_send, mock_html):
        # given
        mock_html.return_value = html_content
        mock_send.return_value = send_success_message

        # when
        result = handle_new_campaign_approval_or_rejection_email(email_id, campaign_name, "rejected")

        # then
        assert result == send_success_message
        mock_html.assert_called_with(campaign_name)
        mock_send.assert_called_with(html_content, email_content.new_campaign_rejected_subject, to, replyTo, sender)

    '''
    This code tests handle_premarketing_signup_email
    Case 1: Return successful message
    '''

    # Case 1
    @patch("services.email_sendinblue_service.email_content.premarketing_signup_html_content")
    @patch("services.email_sendinblue_service.email_sendinblue_actions.handle_email_for_premarketing_signup")
    def test_handle_premarketing_signup_email_Successful(self, mock_send, mock_html):
        # given
        backer_name = "Akash"
        mock_html.return_value = html_content
        mock_send.return_value = send_success_message

        # when
        result = handle_premarketing_signup_email(backer_name, campaign_name, email_id)

        # then
        assert result == send_success_message
        mock_html.assert_called_with(backer_name, campaign_name)
        mock_send.assert_called_with(html_content, email_content.premarketing_signup_subject, to, replyTo, sender)

    '''
    This code tests handle_marketplace_purchase_email
    Case 1: Return successful message
    '''

    # Case 1
    @patch("services.email_sendinblue_service.email_content.marketplace_purchase_html_content")
    @patch("services.email_sendinblue_service.email_sendinblue_actions.handle_email_for_marketplace_purchase")
    def test_handle_marketplace_purchase_email_Successful(self, mock_send, mock_html):
        # given
        buyer_user_name = "ikarus-akash"
        model_name = "model_name"
        model_owner_mail_id = email_id
        mock_html.return_value = html_content
        mock_send.return_value = send_success_message

        # when
        result = handle_marketplace_purchase_email(buyer_user_name, model_name, model_owner_mail_id)

        # then
        assert result == send_success_message
        mock_html.assert_called_with(buyer_user_name, model_name)
        mock_send.assert_called_with(html_content, email_content.marketplace_purchase_subject, to, replyTo, sender)

    '''
    This code tests handle_milestone_reached_email_to_owner_and_backers
    Case 1: Return successful message
    '''

    # Case 1
    @patch("services.email_sendinblue_service.email_content.milestone_reached_html_content_backers")
    @patch("services.email_sendinblue_service.email_content.milestone_reached_html_content_owner")
    @patch("services.email_sendinblue_service.email_sendinblue_actions.handle_email_for_milestone_reached_to_backers")
    @patch("services.email_sendinblue_service.email_sendinblue_actions.handle_email_for_milestone_reached_to_owner")
    def test_handle_milestone_reached_email_to_owner_and_backers_Successful(self, mock_send2, mock_send1, mock_html2, mock_html1):
        # given
        user_name = "ikarus-akash"
        owner_email = email_id
        milestone_name = "milestone_name"
        backers_email_list = to
        mock_html1.return_value = html_content
        mock_html2.return_value = html_content
        mock_send1.return_value = send_success_message
        mock_send2.return_value = send_success_message

        # when
        result = handle_milestone_reached_email_to_owner_and_backers(user_name, owner_email, milestone_name, backers_email_list, campaign_name)

        # then
        assert result == {
            "sending_to_backers: ": send_success_message,
            "sending_to_owner: ": send_success_message,
        }
        mock_html1.assert_called_with(campaign_name, milestone_name)
        mock_html2.assert_called_with(user_name, milestone_name)
        mock_send1.assert_called_with(html_content, email_content.milestone_reached_subject_backers, backers_email_list, replyTo, sender)
        mock_send2.assert_called_with(html_content, email_content.milestone_reached_subject_owner, owner_email, replyTo, sender)

    '''
    This code tests handle_early_bird_tier_ending_soon_email
    Case 1: Return successful message
    '''

    # Case 1
    @patch("services.email_sendinblue_service.email_content.early_bird_tier_ending_soon_html_content")
    @patch("services.email_sendinblue_service.email_sendinblue_actions.send_emails_for_early_bird_tier_ending_soon")
    def test_handle_early_bird_tier_ending_soon_email_Successful(self, mock_send, mock_html):
        # given
        signee_email_list = [email_id]
        time_left = "5 hours"
        sender = {"name": "Ikarus Nest", "email": email_content.sender_email}
        replyTo = {"name": "Ikarus Nest", "email": email_content.reply_to_email}
        mock_html.return_value = html_content
        mock_send.return_value = send_success_message

        # when
        result = handle_early_bird_tier_ending_soon_email(signee_email_list, campaign_name, time_left)

        # then
        assert result == send_success_message
        mock_html.assert_called_with(campaign_name, time_left)
        mock_send.assert_called_with(html_content, email_content.early_bird_tier_ending_soon_subject, sender, replyTo, signee_email_list)

    '''
    This code tests handle_campaign_ending_soon_email
    Case 1: Return successful message
    '''

    # Case 1
    @patch("services.email_sendinblue_service.email_content.campaign_ending_soon_html_content")
    @patch("services.email_sendinblue_service.email_sendinblue_actions.send_emails_for_campaign_ending_soon")
    def test_handle_campaign_ending_soon_email_Successful(self, mock_send, mock_html):
        # given
        signee_email_list = [email_id]
        time_left = "5 hours"
        sender = {"name": "Ikarus Nest", "email": email_content.sender_email}
        replyTo = {"name": "Ikarus Nest", "email": email_content.reply_to_email}
        mock_html.return_value = html_content
        mock_send.return_value = send_success_message

        # when
        result = handle_campaign_ending_soon_email(signee_email_list, campaign_name, time_left)

        # then
        assert result == send_success_message
        mock_html.assert_called_with(campaign_name, time_left)
        mock_send.assert_called_with(html_content, email_content.campaign_ending_soon_subject, sender, replyTo, signee_email_list)

    '''
    This code tests handle_model_deletion_email_to_backers
    Case 1: Return successful message
    '''

    # Case 1
    @patch("services.email_sendinblue_service.email_content.model_deletion_html_content")
    @patch("services.email_sendinblue_service.email_sendinblue_actions.send_emails_for_model_deletion")
    def test_handle_model_deletion_email_to_backers_Successful(self, mock_send, mock_html):
        # given
        model_name = "model_name"
        buyers_email_list = [email_id]
        sender = {"name": "Ikarus Nest", "email": email_content.sender_email}
        replyTo = {"name": "Ikarus Nest", "email": email_content.reply_to_email}
        mock_html.return_value = html_content
        mock_send.return_value = send_success_message

        # when
        result = handle_model_deletion_email_to_backers(model_name, buyers_email_list)

        # then
        assert result == send_success_message
        mock_html.assert_called_with(model_name)
        mock_send.assert_called_with(html_content, email_content.model_deletion_subject, sender, replyTo, buyers_email_list)

    '''
    This code tests handle_account_deletion_initialization_email
    Case 1: Return successful message
    '''

    # Case 1
    @patch("services.email_sendinblue_service.email_content.account_deletion_initiated_html_content")
    @patch("services.email_sendinblue_service.email_sendinblue_actions.send_email_account_deletion_initiated")
    def test_handle_account_deletion_initialization_email_Successful(self, mock_send, mock_html):
        # given
        user_name = "ikarus-akash"
        user_email = email_id
        sender = {"name": "Ikarus Nest", "email": email_content.sender_email}
        replyTo = {"name": "Ikarus Nest", "email": email_content.reply_to_email}
        mock_html.return_value = html_content
        mock_send.return_value = send_success_message

        # when
        result = handle_account_deletion_initialization_email(user_name, user_email)

        # then
        assert result == send_success_message
        mock_html.assert_called_with(user_name)
        mock_send.assert_called_with(html_content, email_content.account_deletion_initiated_subject, sender, replyTo, to)

    '''
    This code tests handle_model_deletion_cool_off_period_email
    Case 1: Return successful message
    '''

    # Case 1
    @patch("services.email_sendinblue_service.email_content.model_deletion_cool_off_period_ending_html_content")
    @patch("services.email_sendinblue_service.email_sendinblue_actions.send_email_model_deletion_cool_off_period_ending")
    def test_handle_model_deletion_cool_off_period_email_Successful(self, mock_send, mock_html):
        # given
        user_name = "ikarus-akash"
        user_email = email_id
        model_name = "model_name"
        sender = {"name": "Ikarus Nest", "email": email_content.sender_email}
        replyTo = {"name": "Ikarus Nest", "email": email_content.reply_to_email}
        mock_html.return_value = html_content
        mock_send.return_value = send_success_message

        # when
        result = handle_model_deletion_cool_off_period_email(user_name, user_email, model_name)

        # then
        assert result == send_success_message
        mock_html.assert_called_with(user_name, model_name)
        mock_send.assert_called_with(html_content, email_content.model_deletion_cool_off_period_ending_subject, sender, replyTo, to)

    '''
    This code tests handle_object_lying_in_draft_email
    Case 1: Return successful message
    '''

    # Case 1
    @patch("services.email_sendinblue_service.email_content.object_lying_in_draft_html_content")
    @patch("services.email_sendinblue_service.email_sendinblue_actions.send_email_object_lying_in_draft")
    def test_handle_object_lying_in_draft_email_Successful(self, mock_send, mock_html):
        # given
        user_name = "ikarus-akash"
        user_email = email_id
        sender = {"name": "Ikarus Nest", "email": email_content.sender_email}
        replyTo = {"name": "Ikarus Nest", "email": email_content.reply_to_email}
        mock_html.return_value = html_content
        mock_send.return_value = send_success_message

        # when
        result = handle_object_lying_in_draft_email(user_name, user_email, campaign_name)

        # then
        assert result == send_success_message
        mock_html.assert_called_with(user_name, campaign_name)
        mock_send.assert_called_with(html_content, email_content.object_lying_in_draft_subject, sender, replyTo, to)

    '''
    This code tests handle_account_deletion_cool_off_period_email
    Case 1: Return successful message
    '''

    # Case 1
    @patch("services.email_sendinblue_service.email_content.account_deletion_cool_off_period_ending_html_content")
    @patch("services.email_sendinblue_service.email_sendinblue_actions.send_email_account_deletion_cool_off_period_ending")
    def test_handle_account_deletion_cool_off_period_email_Successful(self, mock_send, mock_html):
        # given
        user_name = "ikarus-akash"
        user_email = email_id
        sender = {"name": "Ikarus Nest", "email": email_content.sender_email}
        replyTo = {"name": "Ikarus Nest", "email": email_content.reply_to_email}
        mock_html.return_value = html_content
        mock_send.return_value = send_success_message

        # when
        result = handle_account_deletion_cool_off_period_email(user_name, user_email)

        # then
        assert result == send_success_message
        mock_html.assert_called_with(user_name)
        mock_send.assert_called_with(html_content, email_content.account_deletion_cool_off_period_ending_subject, sender, replyTo, to)

    '''
    This code tests handle_adding_contacts_to_list
    Case 1: Return successful message
    '''

    # Case 1
    @patch("services.email_sendinblue_service.email_sendinblue_actions.add_contact_to_mailing_list")
    def test_handle_adding_contacts_to_list_Successful(self, mock_add_contact):
        # given
        success = {
                "Contact created successfully: ": "Success",
                "api_response": "api_response.id",
            }
        mock_add_contact.return_value = success

        # Test case 1: Add contact to the "promotional" and "offers" lists
        list_names = [EmailListName.promotional.value, EmailListName.offers.value]
        result = handle_adding_contacts_to_list(email_id, list_names)
        assert result == success
        mock_add_contact.assert_called_once_with(email_id, [7, 8])

        # Test case 2: Add contact to the "new_features" list
        list_names = [EmailListName.new_features.value]
        result = handle_adding_contacts_to_list(email_id, list_names)
        assert result == success
        mock_add_contact.assert_called_with(email_id, [9])

    '''
    This code tests handle_removing_contacts_from_list
    Case 1: Return successful message
    '''

    # Case 1
    @patch("services.email_sendinblue_service.email_sendinblue_actions.remove_contact_from_mailing_list")
    def test_handle_removing_contacts_from_list_Successful(self, mock_remove_contact):
        # given
        success = {
                    "message": f"Email removed from List ID $list_id successfully",
                    "api_response": "api_response",
                }
        mock_remove_contact.return_value = success

        # Test case 1: Remove contact from the "promotional" and "offers" lists
        list_names = [EmailListName.promotional.value, EmailListName.offers.value]
        result = handle_removing_contacts_from_list(email_id, list_names)
        assert result == success
        mock_remove_contact.assert_called_once_with(email_id, [7, 8])

        # Test case 2: Remove contact from the "new_features" list
        list_names = [EmailListName.new_features.value]
        result = handle_removing_contacts_from_list(email_id, list_names)
        assert result == success
        mock_remove_contact.assert_called_with(email_id, [9])
