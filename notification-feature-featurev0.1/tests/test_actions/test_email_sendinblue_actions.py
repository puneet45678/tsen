from fastapi import HTTPException
from index import app
from unittest import IsolatedAsyncioTestCase
from unittest.mock import patch, MagicMock
import pytest
from actions.email_sendinblue_actions import (
    handle_email_for_campaign_published,
    handle_email_for_marketplace_purchase,
    handle_email_for_milestone_reached_to_backers,
    handle_email_for_milestone_reached_to_owner,
    handle_email_for_new_campaign_approval_or_rejection,
    handle_email_for_new_model_approval,
    handle_email_for_new_model_rejection,
    handle_email_for_premarketing_signup,
    send_email_account_deletion_cool_off_period_ending,
    send_email_account_deletion_initiated,
    send_email_for_new_backer,
    send_email_for_signup,
    send_email_model_deletion_cool_off_period_ending,
    send_email_object_lying_in_draft,
    send_emails_for_campaign_ending_soon,
    send_emails_for_early_bird_tier_ending_soon,
    send_emails_for_model_deletion,
    send_emails_for_project_updates,
    add_contact_to_mailing_list,
    remove_contact_from_mailing_list)
from constants import email_content
from sib_api_v3_sdk.rest import ApiException


#---------------------------------------------------------------------------------#
email_id = "akashchaubey443@gmail.com"
invalid_email_id = "akashchaubey44mailcom"
sender = {"email": email_content.sender_email}
replyTo = {"email": email_content.reply_to_email}
to = [{"email": email_id}]
to_invalid = [{"email": invalid_email_id}]
html_content = 'html_content'
subject = 'subject'
send_smtp_email = "send_smtp_email"

api_response = {
    'message': 'success', 
    'api-response': {
        'message_id': '<202307190552.15658664443@smtp-relay.mailin.fr>', 
        'message_ids': None
    }
}

success_response = {"message": "success", "api-response": api_response}
failure_response = {"message": "error", "api-response": "api_response"}

#---------------------------------------------------------------------------------#

class TestSendEmails(IsolatedAsyncioTestCase):
    
    '''
    This code tests send_email_for_new_backer
    Case 1: Email to new backer is successfully send and we get an api response
    Case 2: Throws ApiException(400)
    '''

    # Case 1
    @patch('actions.email_sendinblue_actions.sib_api_v3_sdk.SendSmtpEmail')
    @patch('actions.email_sendinblue_actions.trxnl_email_api_client.send_transac_email')
    def test_send_email_for_new_backer_Successful(self, mock_transac, mock_send):
        # given
        mock_send.return_value = send_smtp_email
        mock_transac.return_value = api_response

        # when
        result = send_email_for_new_backer(subject, html_content, sender, replyTo, to)

        # then
        assert result == success_response
        mock_send.assert_called_with(to=to,
                                     reply_to=replyTo,
                                     html_content=html_content,
                                     sender=sender,
                                     subject=subject)
        mock_transac.assert_called_with('send_smtp_email')
    
    # Case 2
    @patch('actions.email_sendinblue_actions.sib_api_v3_sdk.SendSmtpEmail')
    @patch('actions.email_sendinblue_actions.trxnl_email_api_client.send_transac_email')
    def test_send_email_for_new_backer_Exception(self, mock_transac, mock_send):
        # given
        mock_send.return_value = send_smtp_email
        mock_transac.side_effect = ApiException()

        # when
        with pytest.raises(HTTPException) as exc_info:
            send_email_for_new_backer(subject, html_content, sender, replyTo, to_invalid)

        # then
        assert exc_info.value.status_code == 400
        mock_send.assert_called_with(to=to_invalid,
                                     reply_to=replyTo,
                                     html_content=html_content,
                                     sender=sender,
                                     subject=subject)
        mock_transac.assert_called_with('send_smtp_email')

    '''
    This code tests send_emails_for_project_updates
    Case 1: Email for project updates successfully send and we get an api response
    Case 2: Throws ApiException(400)
    '''

    # Case 1
    @patch('actions.email_sendinblue_actions.sib_api_v3_sdk.SendSmtpEmail')
    @patch('actions.email_sendinblue_actions.trxnl_email_api_client.send_transac_email')
    def test_send_emails_for_project_updates_Successful(self, mock_transac, mock_send):
        # given
        to = [{"email": "emails1@gmail.com"}, {"email": "emails2@gmail.com"}]
        mock_send.return_value = send_smtp_email
        mock_transac.return_value = api_response

        # when
        result = send_emails_for_project_updates(subject, html_content, sender, replyTo, to)
        kwargs_send = mock_send.call_args.kwargs
        args_transac = mock_transac.call_args.args

        # then
        assert result == success_response
        mock_send.assert_called_with(to=[{'email': {'email': 'emails1@gmail.com'}}, {'email': {'email': 'emails2@gmail.com'}}],
                                     reply_to=replyTo,
                                     html_content=html_content,
                                     sender=sender,
                                     subject=subject)
        mock_transac.assert_called_with('send_smtp_email')

    # Case 2
    @patch('actions.email_sendinblue_actions.sib_api_v3_sdk.SendSmtpEmail')
    @patch('actions.email_sendinblue_actions.trxnl_email_api_client.send_transac_email')
    def test_send_emails_for_project_updates_Exception(self, mock_transac, mock_send):
        # given
        to_invalid = [{"email": "emails1gmail.com"}, {"email": "emails2com"}]
        mock_send.return_value = send_smtp_email
        mock_transac.side_effect = ApiException()

        # when
        with pytest.raises(HTTPException) as exc_info:
            send_emails_for_project_updates(subject, html_content, sender, replyTo, to_invalid)
        kwargs_send = mock_send.call_args.kwargs
        args_transac = mock_transac.call_args.args
        
        # then
        assert exc_info.value.status_code == 400
        mock_send.assert_called_with(to=[{'email': {'email': 'emails1gmail.com'}}, {'email': {'email': 'emails2com'}}],
                                     reply_to=replyTo,
                                     html_content=html_content,
                                     sender=sender,
                                     subject=subject)
        mock_transac.assert_called_with('send_smtp_email')

    '''
    This code tests send_email_for_signup
    Case 1: Email for signup successfully send and we get an api response
    Case 2: Throws ApiException(400)
    '''

    # Case 1
    @patch('actions.email_sendinblue_actions.sib_api_v3_sdk.SendSmtpEmail')
    @patch('actions.email_sendinblue_actions.trxnl_email_api_client.send_transac_email')
    def test_send_email_for_signup_Successful(self, mock_transac, mock_send):
        # given
        mock_send.return_value = send_smtp_email
        mock_transac.return_value = api_response

        # when
        result = send_email_for_signup(html_content, subject, to, replyTo, sender)
        kwargs_send = mock_send.call_args.kwargs
        args_transac = mock_transac.call_args.args

        # then
        assert result == success_response
        mock_send.assert_called_with(to=to,
                                     reply_to=replyTo,
                                     html_content=html_content,
                                     sender=sender,
                                     subject=subject)
        mock_transac.assert_called_with('send_smtp_email')

    # Case 2
    @patch('actions.email_sendinblue_actions.sib_api_v3_sdk.SendSmtpEmail')
    @patch('actions.email_sendinblue_actions.trxnl_email_api_client.send_transac_email')
    def test_send_email_for_signup_Exceptions(self, mock_transac, mock_send):
        # given
        mock_send.return_value = send_smtp_email
        mock_transac.side_effect = ApiException()

        # when
        with pytest.raises(HTTPException) as exc_info:
            send_email_for_signup(html_content, subject, to_invalid, replyTo, sender)
        kwargs_send = mock_send.call_args.kwargs
        args_transac = mock_transac.call_args.args
        
        # then
        assert exc_info.value.status_code == 400
        mock_send.assert_called_with(to=to_invalid,
                                     reply_to=replyTo,
                                     html_content=html_content,
                                     sender=sender,
                                     subject=subject)
        mock_transac.assert_called_with('send_smtp_email')

    '''
    This code tests handle_email_for_new_model_approval
    Case 1: Email for new model approval successfully send and we get an api response
    Case 2: Throws ApiException(400)
    '''

    # Case 1
    @patch('actions.email_sendinblue_actions.sib_api_v3_sdk.SendSmtpEmail')
    @patch('actions.email_sendinblue_actions.trxnl_email_api_client.send_transac_email')
    def test_handle_email_for_new_model_approval_Successful(self, mock_transac, mock_send):
        # given
        mock_send.return_value = send_smtp_email
        mock_transac.return_value = api_response

        # when
        result = handle_email_for_new_model_approval(html_content, subject, to, replyTo, sender)
        kwargs_send = mock_send.call_args.kwargs
        args_transac = mock_transac.call_args.args

        # then
        assert result == success_response
        mock_send.assert_called_with(to=to,
                                     reply_to=replyTo,
                                     html_content=html_content,
                                     sender=sender,
                                     subject=subject)
        mock_transac.assert_called_with('send_smtp_email')

    # Case 2
    @patch('actions.email_sendinblue_actions.sib_api_v3_sdk.SendSmtpEmail')
    @patch('actions.email_sendinblue_actions.trxnl_email_api_client.send_transac_email')
    def test_handle_email_for_new_model_approval_Exceptions(self, mock_transac, mock_send):
        # given
        mock_send.return_value = send_smtp_email
        mock_transac.side_effect = ApiException()

        # when
        with pytest.raises(HTTPException) as exc_info:
            handle_email_for_new_model_approval(html_content, subject, to_invalid, replyTo, sender)
        kwargs_send = mock_send.call_args.kwargs
        args_transac = mock_transac.call_args.args
        
        # then
        assert exc_info.value.status_code == 400
        mock_send.assert_called_with(to=to_invalid,
                                     reply_to=replyTo,
                                     html_content=html_content,
                                     sender=sender,
                                     subject=subject)
        mock_transac.assert_called_with('send_smtp_email')

    '''
    This code tests handle_email_for_new_model_rejection
    Case 1: Email for new model rejection successfully send and we get an api response
    Case 2: Throws ApiException(400)
    '''

    # Case 1
    @patch('actions.email_sendinblue_actions.sib_api_v3_sdk.SendSmtpEmail')
    @patch('actions.email_sendinblue_actions.trxnl_email_api_client.send_transac_email')
    def test_handle_email_for_new_model_rejection_Successful(self, mock_transac, mock_send):
        # given
        mock_send.return_value = send_smtp_email
        mock_transac.return_value = api_response

        # when
        result = handle_email_for_new_model_rejection(html_content, subject, to, replyTo, sender)
        kwargs_send = mock_send.call_args.kwargs
        args_transac = mock_transac.call_args.args

        # then
        assert result == success_response
        mock_send.assert_called_with(to=to,
                                     reply_to=replyTo,
                                     html_content=html_content,
                                     sender=sender,
                                     subject=subject)
        mock_transac.assert_called_with('send_smtp_email')

    # Case 2
    @patch('actions.email_sendinblue_actions.sib_api_v3_sdk.SendSmtpEmail')
    @patch('actions.email_sendinblue_actions.trxnl_email_api_client.send_transac_email')
    def test_handle_email_for_new_model_rejection_Exceptions(self, mock_transac, mock_send):
        # given
        mock_send.return_value = send_smtp_email
        mock_transac.side_effect = ApiException()

        # when
        with pytest.raises(HTTPException) as exc_info:
            handle_email_for_new_model_rejection(html_content, subject, to_invalid, replyTo, sender)
        kwargs_send = mock_send.call_args.kwargs
        args_transac = mock_transac.call_args.args
        
        # then
        assert exc_info.value.status_code == 400
        mock_send.assert_called_with(to=to_invalid,
                                     reply_to=replyTo,
                                     html_content=html_content,
                                     sender=sender,
                                     subject=subject)
        mock_transac.assert_called_with('send_smtp_email')

    '''
    This code tests handle_email_for_new_campaign_approval_or_rejection
    Case 1: Email for new campaign aprroval or rejection successfully send and we get an api response
    Case 2: Throws ApiException(400)
    '''

    # Case 1
    @patch('actions.email_sendinblue_actions.sib_api_v3_sdk.SendSmtpEmail')
    @patch('actions.email_sendinblue_actions.trxnl_email_api_client.send_transac_email')
    def test_handle_email_for_new_campaign_approval_or_rejection_Successful(self, mock_transac, mock_send):
        # given
        mock_send.return_value = send_smtp_email
        mock_transac.return_value = api_response

        # when
        result = handle_email_for_new_campaign_approval_or_rejection(html_content, subject, to, replyTo, sender)
        kwargs_send = mock_send.call_args.kwargs
        args_transac = mock_transac.call_args.args

        # then
        assert result == success_response
        mock_send.assert_called_with(to=to,
                                     reply_to=replyTo,
                                     html_content=html_content,
                                     sender=sender,
                                     subject=subject)
        mock_transac.assert_called_with('send_smtp_email')

    # Case 2
    @patch('actions.email_sendinblue_actions.sib_api_v3_sdk.SendSmtpEmail')
    @patch('actions.email_sendinblue_actions.trxnl_email_api_client.send_transac_email')
    def test_handle_email_for_new_campaign_approval_or_rejection_Exceptions(self, mock_transac, mock_send):
        # given
        mock_send.return_value = send_smtp_email
        mock_transac.side_effect = ApiException()

        # when
        with pytest.raises(HTTPException) as exc_info:
            handle_email_for_new_campaign_approval_or_rejection(html_content, subject, to_invalid, replyTo, sender)
        kwargs_send = mock_send.call_args.kwargs
        args_transac = mock_transac.call_args.args
        
        # then
        assert exc_info.value.status_code == 400
        mock_send.assert_called_with(to=to_invalid,
                                     reply_to=replyTo,
                                     html_content=html_content,
                                     sender=sender,
                                     subject=subject)
        mock_transac.assert_called_with('send_smtp_email')

    '''
    This code tests handle_email_for_campaign_published
    Case 1: Email for campaign published successfully send and we get an api response
    Case 2: Throws ApiException(400)
    '''

    # Case 1
    @patch('actions.email_sendinblue_actions.sib_api_v3_sdk.SendSmtpEmail')
    @patch('actions.email_sendinblue_actions.trxnl_email_api_client.send_transac_email')
    def test_handle_email_for_campaign_published_Successful(self, mock_transac, mock_send):
        # given
        mock_send.return_value = send_smtp_email
        mock_transac.return_value = api_response

        # when
        result = handle_email_for_campaign_published(html_content, subject, to, replyTo, sender)
        kwargs_send = mock_send.call_args.kwargs
        args_transac = mock_transac.call_args.args

        # then
        assert result == success_response
        mock_send.assert_called_with(to=to,
                                     reply_to=replyTo,
                                     html_content=html_content,
                                     sender=sender,
                                     subject=subject)
        mock_transac.assert_called_with('send_smtp_email')

    # Case 2
    @patch('actions.email_sendinblue_actions.sib_api_v3_sdk.SendSmtpEmail')
    @patch('actions.email_sendinblue_actions.trxnl_email_api_client.send_transac_email')
    def test_handle_email_for_campaign_published_Exceptions(self, mock_transac, mock_send):
        # given
        mock_send.return_value = send_smtp_email
        mock_transac.side_effect = ApiException()

        # when
        with pytest.raises(HTTPException) as exc_info:
            handle_email_for_campaign_published(html_content, subject, to_invalid, replyTo, sender)
        kwargs_send = mock_send.call_args.kwargs
        args_transac = mock_transac.call_args.args
        
        # then
        assert exc_info.value.status_code == 400
        mock_send.assert_called_with(to=to_invalid,
                                     reply_to=replyTo,
                                     html_content=html_content,
                                     sender=sender,
                                     subject=subject)
        mock_transac.assert_called_with('send_smtp_email')

    '''
    This code tests handle_email_for_premarketing_signup
    Case 1: Email for premarketing signup successfully send and we get an api response
    Case 2: Throws ApiException(400) - Check for api error only since email_id cannot be invalid
    '''

    # Case 1
    @patch('actions.email_sendinblue_actions.sib_api_v3_sdk.SendSmtpEmail')
    @patch('actions.email_sendinblue_actions.trxnl_email_api_client.send_transac_email')
    def test_handle_email_for_premarketing_signup_Successful(self, mock_transac, mock_send):
        # given
        mock_send.return_value = send_smtp_email
        mock_transac.return_value = api_response

        # when
        result = handle_email_for_premarketing_signup(html_content, subject, to, replyTo, sender)
        kwargs_send = mock_send.call_args.kwargs
        args_transac = mock_transac.call_args.args

        # then
        assert result == success_response
        mock_send.assert_called_with(to=to,
                                     reply_to=replyTo,
                                     html_content=html_content,
                                     sender=sender,
                                     subject=subject)
        mock_transac.assert_called_with('send_smtp_email')

    # Case 2
    @patch('actions.email_sendinblue_actions.sib_api_v3_sdk.SendSmtpEmail')
    @patch('actions.email_sendinblue_actions.trxnl_email_api_client.send_transac_email')
    def test_handle_email_for_premarketing_signup_Exceptions(self, mock_transac, mock_send):
        # given
        mock_send.return_value = send_smtp_email
        mock_transac.side_effect = ApiException()

        # when
        with pytest.raises(HTTPException) as exc_info:
            handle_email_for_premarketing_signup(html_content, subject, to_invalid, replyTo, sender)
        kwargs_send = mock_send.call_args.kwargs
        args_transac = mock_transac.call_args.args
        
        # then
        assert exc_info.value.status_code == 400
        mock_send.assert_called_with(to=to_invalid,
                                     reply_to=replyTo,
                                     html_content=html_content,
                                     sender=sender,
                                     subject=subject)
        mock_transac.assert_called_with('send_smtp_email')

    '''
    This code tests handle_email_for_marketplace_purchase
    Case 1: Email for marketplace purchase successfully send and we get an api response
    Case 2: Throws ApiException(400)
    '''

    # Case 1
    @patch('actions.email_sendinblue_actions.sib_api_v3_sdk.SendSmtpEmail')
    @patch('actions.email_sendinblue_actions.trxnl_email_api_client.send_transac_email')
    def test_handle_email_for_marketplace_purchase_Successful(self, mock_transac, mock_send):
        # given
        mock_send.return_value = send_smtp_email
        mock_transac.return_value = api_response

        # when
        result = handle_email_for_marketplace_purchase(html_content, subject, to, replyTo, sender)
        kwargs_send = mock_send.call_args.kwargs
        args_transac = mock_transac.call_args.args

        # then
        assert result == success_response
        mock_send.assert_called_with(to=to,
                                     reply_to=replyTo,
                                     html_content=html_content,
                                     sender=sender,
                                     subject=subject)
        mock_transac.assert_called_with('send_smtp_email')

    # Case 2
    @patch('actions.email_sendinblue_actions.sib_api_v3_sdk.SendSmtpEmail')
    @patch('actions.email_sendinblue_actions.trxnl_email_api_client.send_transac_email')
    def test_handle_email_for_marketplace_purchase_Exceptions(self, mock_transac, mock_send):
        # given
        mock_send.return_value = send_smtp_email
        mock_transac.side_effect = ApiException()

        # when
        with pytest.raises(HTTPException) as exc_info:
            handle_email_for_marketplace_purchase(html_content, subject, to_invalid, replyTo, sender)
        kwargs_send = mock_send.call_args.kwargs
        args_transac = mock_transac.call_args.args
        
        # then
        assert exc_info.value.status_code == 400
        mock_send.assert_called_with(to=to_invalid,
                                     reply_to=replyTo,
                                     html_content=html_content,
                                     sender=sender,
                                     subject=subject)
        mock_transac.assert_called_with('send_smtp_email')

    '''
    This code tests handle_email_for_milestone_reached_to_backers
    Case 1: Email for milestones to backers successfully send and we get an api response
    Case 2: Throws ApiException(400)
    '''

    # Case 1
    @patch('actions.email_sendinblue_actions.sib_api_v3_sdk.SendSmtpEmail')
    @patch('actions.email_sendinblue_actions.trxnl_email_api_client.send_transac_email')
    def test_handle_email_for_milestone_reached_to_backers_Successful(self, mock_transac, mock_send):
        # given
        mock_send.return_value = send_smtp_email
        mock_transac.return_value = api_response

        # when
        result = handle_email_for_milestone_reached_to_backers(html_content, subject, to, replyTo, sender)
        kwargs_send = mock_send.call_args.kwargs
        args_transac = mock_transac.call_args.args

        # then
        assert result == success_response
        mock_send.assert_called_with(to=[{'email': {'email': 'akashchaubey443@gmail.com'}}],
                                     reply_to=replyTo,
                                     html_content=html_content,
                                     sender=sender,
                                     subject=subject)
        mock_transac.assert_called_with('send_smtp_email')

    # Case 2
    @patch('actions.email_sendinblue_actions.sib_api_v3_sdk.SendSmtpEmail')
    @patch('actions.email_sendinblue_actions.trxnl_email_api_client.send_transac_email')
    def test_handle_email_for_milestone_reached_to_backers_Exceptions(self, mock_transac, mock_send):
        # given
        mock_send.return_value = send_smtp_email
        mock_transac.side_effect = ApiException()

        # when
        with pytest.raises(HTTPException) as exc_info:
            handle_email_for_milestone_reached_to_backers(html_content, subject, to_invalid, replyTo, sender)
        kwargs_send = mock_send.call_args.kwargs
        args_transac = mock_transac.call_args.args
        
        # then
        assert exc_info.value.status_code == 400
        mock_send.assert_called_with(to=[{'email': {'email': 'akashchaubey44mailcom'}}],
                                     reply_to=replyTo,
                                     html_content=html_content,
                                     sender=sender,
                                     subject=subject)
        mock_transac.assert_called_with('send_smtp_email')

    '''
    This code tests handle_email_for_milestone_reached_to_owner
    Case 1: Email for milestone to owner successfully send and we get an api response
    Case 2: Throws ApiException(400)
    '''

    # Case 1
    @patch('actions.email_sendinblue_actions.sib_api_v3_sdk.SendSmtpEmail')
    @patch('actions.email_sendinblue_actions.trxnl_email_api_client.send_transac_email')
    def test_handle_email_for_milestone_reached_to_owner_Successful(self, mock_transac, mock_send):
        # given
        mock_send.return_value = send_smtp_email
        mock_transac.return_value = api_response

        # when
        result = handle_email_for_milestone_reached_to_owner(html_content, subject, to, replyTo, sender)
        kwargs_send = mock_send.call_args.kwargs
        args_transac = mock_transac.call_args.args

        # then
        assert result == success_response
        mock_send.assert_called_with(to=[{'email': to}],
                                     reply_to=replyTo,
                                     html_content=html_content,
                                     sender=sender,
                                     subject=subject)
        mock_transac.assert_called_with('send_smtp_email')

    # Case 2
    @patch('actions.email_sendinblue_actions.sib_api_v3_sdk.SendSmtpEmail')
    @patch('actions.email_sendinblue_actions.trxnl_email_api_client.send_transac_email')
    def test_handle_email_for_milestone_reached_to_owner_Exceptions(self, mock_transac, mock_send):
        # given
        mock_send.return_value = send_smtp_email
        mock_transac.side_effect = ApiException()

        # when
        with pytest.raises(HTTPException) as exc_info:
            handle_email_for_milestone_reached_to_owner(html_content, subject, to_invalid, replyTo, sender)
        kwargs_send = mock_send.call_args.kwargs
        args_transac = mock_transac.call_args.args
        
        # then
        assert exc_info.value.status_code == 400
        mock_send.assert_called_with(to=[{'email': to_invalid}],
                                     reply_to=replyTo,
                                     html_content=html_content,
                                     sender=sender,
                                     subject=subject)
        mock_transac.assert_called_with('send_smtp_email')

    '''
    This code tests send_emails_for_early_bird_tier_ending_soon
    Case 1: Email for early bird tier ending soon successfully send and we get an api response
    Case 2: Throws ApiException(400)
    '''

    # Case 1
    @patch('actions.email_sendinblue_actions.sib_api_v3_sdk.SendSmtpEmail')
    @patch('actions.email_sendinblue_actions.trxnl_email_api_client.send_transac_email')
    def test_send_emails_for_early_bird_tier_ending_soon_Successful(self, mock_transac, mock_send):
        # given
        to = [{"email": "emails1@gmail.com"}, {"email": "emails2@gmail.com"}]
        mock_send.return_value = send_smtp_email
        mock_transac.return_value = api_response

        # when
        result = send_emails_for_early_bird_tier_ending_soon(html_content, subject, sender, replyTo, to)
        kwargs_send = mock_send.call_args.kwargs
        args_transac = mock_transac.call_args.args

        # then
        assert result == success_response
        mock_send.assert_called_with(to=[{'email': {'email': 'emails1@gmail.com'}}, {'email': {'email': 'emails2@gmail.com'}}],
                                     reply_to=replyTo,
                                     html_content=html_content,
                                     sender=sender,
                                     subject=subject)
        mock_transac.assert_called_with('send_smtp_email')

    # Case 2
    @patch('actions.email_sendinblue_actions.sib_api_v3_sdk.SendSmtpEmail')
    @patch('actions.email_sendinblue_actions.trxnl_email_api_client.send_transac_email')
    def test_send_emails_for_early_bird_tier_ending_soon_Exceptions(self, mock_transac, mock_send):
        # given
        to_invalid = [{"email": "emails1gmail.com"}, {"email": "emails2com"}]
        mock_send.return_value = send_smtp_email
        mock_transac.side_effect = ApiException()

        # when
        with pytest.raises(HTTPException) as exc_info:
            send_emails_for_early_bird_tier_ending_soon(html_content, subject, sender, replyTo, to_invalid)
        kwargs_send = mock_send.call_args.kwargs
        args_transac = mock_transac.call_args.args
        
        # then
        assert exc_info.value.status_code == 400
        mock_send.assert_called_with(to=[{'email': {'email': 'emails1gmail.com'}}, {'email': {'email': 'emails2com'}}],
                                     reply_to=replyTo,
                                     html_content=html_content,
                                     sender=sender,
                                     subject=subject)
        mock_transac.assert_called_with('send_smtp_email')

    '''
    This code tests send_emails_for_campaign_ending_soon
    Case 1: Email for campaign ending soon successfully send and we get an api response
    Case 2: Throws ApiException(400)
    '''

    # Case 1
    @patch('actions.email_sendinblue_actions.sib_api_v3_sdk.SendSmtpEmail')
    @patch('actions.email_sendinblue_actions.trxnl_email_api_client.send_transac_email')
    def test_send_emails_for_campaign_ending_soon_Successful(self, mock_transac, mock_send):
        # given
        to = [{"email": "emails1@gmail.com"}, {"email": "emails2@gmail.com"}]
        mock_send.return_value = send_smtp_email
        mock_transac.return_value = api_response

        # when
        result = send_emails_for_campaign_ending_soon(html_content, subject, sender, replyTo, to)
        kwargs_send = mock_send.call_args.kwargs
        args_transac = mock_transac.call_args.args

        # then
        assert result == success_response
        mock_send.assert_called_with(to=[{'email': {'email': 'emails1@gmail.com'}}, {'email': {'email': 'emails2@gmail.com'}}],
                                     reply_to=replyTo,
                                     html_content=html_content,
                                     sender=sender,
                                     subject=subject)
        mock_transac.assert_called_with('send_smtp_email')

    # Case 2
    @patch('actions.email_sendinblue_actions.sib_api_v3_sdk.SendSmtpEmail')
    @patch('actions.email_sendinblue_actions.trxnl_email_api_client.send_transac_email')
    def test_send_emails_for_campaign_ending_soon_Exceptions(self, mock_transac, mock_send):
        # given
        to_invalid = [{"email": "emails1gmail.com"}, {"email": "emails2com"}]
        mock_send.return_value = send_smtp_email
        mock_transac.side_effect = ApiException()

        # when
        with pytest.raises(HTTPException) as exc_info:
            send_emails_for_campaign_ending_soon(html_content, subject, sender, replyTo, to_invalid)
        kwargs_send = mock_send.call_args.kwargs
        args_transac = mock_transac.call_args.args
        
        # then
        assert exc_info.value.status_code == 400
        mock_send.assert_called_with(to=[{'email': {'email': 'emails1gmail.com'}}, {'email': {'email': 'emails2com'}}],
                                     reply_to=replyTo,
                                     html_content=html_content,
                                     sender=sender,
                                     subject=subject)
        mock_transac.assert_called_with('send_smtp_email')

    '''
    This code tests send_emails_for_model_deletion
    Case 1: Email for model deletion successfully send and we get an api response
    Case 2: Throws ApiException(400)
    '''

    # Case 1
    @patch('actions.email_sendinblue_actions.sib_api_v3_sdk.SendSmtpEmail')
    @patch('actions.email_sendinblue_actions.trxnl_email_api_client.send_transac_email')
    def test_send_emails_for_model_deletion_Successful(self, mock_transac, mock_send):
        # given
        to = [{"email": "emails1@gmail.com"}, {"email": "emails2@gmail.com"}]
        mock_send.return_value = send_smtp_email
        mock_transac.return_value = api_response

        # when
        result = send_emails_for_model_deletion(html_content, subject, sender, replyTo, to)
        kwargs_send = mock_send.call_args.kwargs
        args_transac = mock_transac.call_args.args

        # then
        assert result == success_response
        mock_send.assert_called_with(to=[{'email': {'email': 'emails1@gmail.com'}}, {'email': {'email': 'emails2@gmail.com'}}],
                                     reply_to=replyTo,
                                     html_content=html_content,
                                     sender=sender,
                                     subject=subject)
        mock_transac.assert_called_with('send_smtp_email')

    # Case 2
    @patch('actions.email_sendinblue_actions.sib_api_v3_sdk.SendSmtpEmail')
    @patch('actions.email_sendinblue_actions.trxnl_email_api_client.send_transac_email')
    def test_send_emails_for_model_deletion_Exceptions(self, mock_transac, mock_send):
        # given
        to_invalid = [{"email": "emails1gmail.com"}, {"email": "emails2com"}]
        mock_send.return_value = send_smtp_email
        mock_transac.side_effect = ApiException()

        # when
        with pytest.raises(HTTPException) as exc_info:
            send_emails_for_model_deletion(html_content, subject, sender, replyTo, to_invalid)
        kwargs_send = mock_send.call_args.kwargs
        args_transac = mock_transac.call_args.args
        
        # then
        assert exc_info.value.status_code == 400
        mock_send.assert_called_with(to=[{'email': {'email': 'emails1gmail.com'}}, {'email': {'email': 'emails2com'}}],
                                     reply_to=replyTo,
                                     html_content=html_content,
                                     sender=sender,
                                     subject=subject)
        mock_transac.assert_called_with('send_smtp_email')

    '''
    This code tests send_email_account_deletion_initiated
    Case 1: Email for account deletion initiated successfully send and we get an api response
    Case 2: Throws ApiException(400)
    '''

    # Case 1
    @patch('actions.email_sendinblue_actions.sib_api_v3_sdk.SendSmtpEmail')
    @patch('actions.email_sendinblue_actions.trxnl_email_api_client.send_transac_email')
    def test_send_email_account_deletion_initiated_Successful(self, mock_transac, mock_send):
        # given
        mock_send.return_value = send_smtp_email
        mock_transac.return_value = api_response

        # when
        result = send_email_account_deletion_initiated(html_content, subject, sender, replyTo, to)
        kwargs_send = mock_send.call_args.kwargs
        args_transac = mock_transac.call_args.args

        # then
        assert result == success_response
        mock_send.assert_called_with(to=to,
                                     reply_to=replyTo,
                                     html_content=html_content,
                                     sender=sender,
                                     subject=subject)
        mock_transac.assert_called_with('send_smtp_email')

    # Case 2
    @patch('actions.email_sendinblue_actions.sib_api_v3_sdk.SendSmtpEmail')
    @patch('actions.email_sendinblue_actions.trxnl_email_api_client.send_transac_email')
    def test_send_email_account_deletion_initiated_Exceptions(self, mock_transac, mock_send):
        # given
        mock_send.return_value = send_smtp_email
        mock_transac.side_effect = ApiException()

        # when
        with pytest.raises(HTTPException) as exc_info:
            send_email_account_deletion_initiated(html_content, subject, sender, replyTo, to_invalid)
        kwargs_send = mock_send.call_args.kwargs
        args_transac = mock_transac.call_args.args
        
        # then
        assert exc_info.value.status_code == 400
        mock_send.assert_called_with(to=to_invalid,
                                     reply_to=replyTo,
                                     html_content=html_content,
                                     sender=sender,
                                     subject=subject)
        mock_transac.assert_called_with('send_smtp_email')

    '''
    This code tests send_email_model_deletion_cool_off_period_ending
    Case 1: Email for model deletion cool off period ending successfully send and we get an api response
    Case 2: Throws ApiException(400)
    '''

    # Case 1
    @patch('actions.email_sendinblue_actions.sib_api_v3_sdk.SendSmtpEmail')
    @patch('actions.email_sendinblue_actions.trxnl_email_api_client.send_transac_email')
    def test_send_email_model_deletion_cool_off_period_ending_Successful(self, mock_transac, mock_send):
        # given
        mock_send.return_value = send_smtp_email
        mock_transac.return_value = api_response

        # when
        result = send_email_model_deletion_cool_off_period_ending(html_content, subject, sender, replyTo, to)
        kwargs_send = mock_send.call_args.kwargs
        args_transac = mock_transac.call_args.args

        # then
        assert result == success_response
        mock_send.assert_called_with(to=to,
                                     reply_to=replyTo,
                                     html_content=html_content,
                                     sender=sender,
                                     subject=subject)
        mock_transac.assert_called_with('send_smtp_email')

    # Case 2
    @patch('actions.email_sendinblue_actions.sib_api_v3_sdk.SendSmtpEmail')
    @patch('actions.email_sendinblue_actions.trxnl_email_api_client.send_transac_email')
    def test_send_email_model_deletion_cool_off_period_ending_Exceptions(self, mock_transac, mock_send):
        # given
        mock_send.return_value = send_smtp_email
        mock_transac.side_effect = ApiException()

        # when
        with pytest.raises(HTTPException) as exc_info:
            send_email_model_deletion_cool_off_period_ending(html_content, subject, sender, replyTo, to_invalid)
        kwargs_send = mock_send.call_args.kwargs
        args_transac = mock_transac.call_args.args
        
        # then
        assert exc_info.value.status_code == 400
        mock_send.assert_called_with(to=to_invalid,
                                     reply_to=replyTo,
                                     html_content=html_content,
                                     sender=sender,
                                     subject=subject)
        mock_transac.assert_called_with('send_smtp_email')

    '''
    This code tests send_email_object_lying_in_draft
    Case 1: Email for object lying in draft successfully send and we get an api response
    Case 2: Throws ApiException(400)
    '''

    # Case 1
    @patch('actions.email_sendinblue_actions.sib_api_v3_sdk.SendSmtpEmail')
    @patch('actions.email_sendinblue_actions.trxnl_email_api_client.send_transac_email')
    def test_send_email_object_lying_in_draft_Successful(self, mock_transac, mock_send):
        # given
        mock_send.return_value = send_smtp_email
        mock_transac.return_value = api_response

        # when
        result = send_email_object_lying_in_draft(html_content, subject, sender, replyTo, to)
        kwargs_send = mock_send.call_args.kwargs
        args_transac = mock_transac.call_args.args

        # then
        assert result == success_response
        mock_send.assert_called_with(to=to,
                                     reply_to=replyTo,
                                     html_content=html_content,
                                     sender=sender,
                                     subject=subject)
        mock_transac.assert_called_with('send_smtp_email')

    # Case 2
    @patch('actions.email_sendinblue_actions.sib_api_v3_sdk.SendSmtpEmail')
    @patch('actions.email_sendinblue_actions.trxnl_email_api_client.send_transac_email')
    def test_send_email_object_lying_in_draft_Exceptions(self, mock_transac, mock_send):
        # given
        mock_send.return_value = send_smtp_email
        mock_transac.side_effect = ApiException()

        # when
        with pytest.raises(HTTPException) as exc_info:
            send_email_object_lying_in_draft(html_content, subject, sender, replyTo, to_invalid)
        kwargs_send = mock_send.call_args.kwargs
        args_transac = mock_transac.call_args.args
        
        # then
        assert exc_info.value.status_code == 400
        mock_send.assert_called_with(to=to_invalid,
                                     reply_to=replyTo,
                                     html_content=html_content,
                                     sender=sender,
                                     subject=subject)
        mock_transac.assert_called_with('send_smtp_email')

    '''
    This code tests send_email_account_deletion_cool_off_period_ending
    Case 1: Email for account deletion cool off period ending successfully send and we get an api response
    Case 2: Throws ApiException(400)
    '''

    # Case 1
    @patch('actions.email_sendinblue_actions.sib_api_v3_sdk.SendSmtpEmail')
    @patch('actions.email_sendinblue_actions.trxnl_email_api_client.send_transac_email')
    def test_send_email_account_deletion_cool_off_period_ending_Successful(self, mock_transac, mock_send):
        # given
        mock_send.return_value = send_smtp_email
        mock_transac.return_value = api_response

        # when
        result = send_email_account_deletion_cool_off_period_ending(html_content, subject, sender, replyTo, to)
        kwargs_send = mock_send.call_args.kwargs
        args_transac = mock_transac.call_args.args

        # then
        assert result == success_response
        mock_send.assert_called_with(to=to,
                                     reply_to=replyTo,
                                     html_content=html_content,
                                     sender=sender,
                                     subject=subject)
        mock_transac.assert_called_with('send_smtp_email')

    # Case 2
    @patch('actions.email_sendinblue_actions.sib_api_v3_sdk.SendSmtpEmail')
    @patch('actions.email_sendinblue_actions.trxnl_email_api_client.send_transac_email')
    def test_send_email_account_deletion_cool_off_period_ending_Exceptions(self, mock_transac, mock_send):
        # given
        mock_send.return_value = send_smtp_email
        mock_transac.side_effect = ApiException()

        # when
        with pytest.raises(HTTPException) as exc_info:
            send_email_account_deletion_cool_off_period_ending(html_content, subject, sender, replyTo, to_invalid)
        kwargs_send = mock_send.call_args.kwargs
        args_transac = mock_transac.call_args.args
        
        # then
        assert exc_info.value.status_code == 400
        mock_send.assert_called_with(to=to_invalid,
                                     reply_to=replyTo,
                                     html_content=html_content,
                                     sender=sender,
                                     subject=subject)
        mock_transac.assert_called_with('send_smtp_email')


class TestMailingListOperations(IsolatedAsyncioTestCase):

    '''
    This code tests add_contact_to_mailing_list
    Case 1: Email for adding contact to mailing list successfully send and we get an api response
    Case 2: Throws ApiException(400)
    '''
    
    @patch('actions.email_sendinblue_actions.sib_api_v3_sdk.CreateContact')
    @patch('actions.email_sendinblue_actions.contacts_api_client.create_contact')
    def test_add_contact_to_mailing_list_Successful(self, mock_create, mock_sdk):
        # given
        new_contact = {'attributes': None,
                       'email': 'abcd@gmail.com',
                       'email_blacklisted': None,
                       'ext_id': None,
                       'list_ids': [1],
                       'sms_blacklisted': None,
                       'smtp_blacklist_sender': None,
                       'update_enabled': False}
        api_response = MagicMock()
        api_response.id = 27
        success_response = {'Contact created successfully: ': 'Success', 'api_response': api_response.id}
        mock_sdk.return_value = new_contact
        mock_create.return_value = api_response

        # when
        result = add_contact_to_mailing_list(new_contact['email'], new_contact['list_ids'])
        
        # then
        assert result == success_response
        mock_sdk.assert_called_with(email='abcd@gmail.com', list_ids=[1])
        mock_create.assert_called_with(new_contact)

    # Case 2
    @patch('actions.email_sendinblue_actions.sib_api_v3_sdk.CreateContact')
    @patch('actions.email_sendinblue_actions.contacts_api_client.create_contact')
    def test_add_contact_to_mailing_list_Exceptions(self, mock_create, mock_sdk):
        # given
        new_contact = {'attributes': None,
                       'email': 'abcdgmailcom',
                       'email_blacklisted': None,
                       'ext_id': None,
                       'list_ids': [1],
                       'sms_blacklisted': None,
                       'smtp_blacklist_sender': None,
                       'update_enabled': False}
        mock_sdk.return_value = new_contact
        mock_create.side_effect = Exception()

        # when
        with pytest.raises(HTTPException) as exc_info:
            result = add_contact_to_mailing_list(new_contact['email'], new_contact['list_ids'])
        
        # then
        assert exc_info.value.status_code == 400
        mock_sdk.assert_called_with(email='abcdgmailcom', list_ids=[1])
        mock_create.assert_called_with(new_contact)

    '''
    This code tests remove_contact_from_mailing_list
    Case 1: Email for removing contact from mailing list successfully send and we get an api response
    Case 2: Throws ApiException(400)
    '''

    # Case 1
    @patch('actions.email_sendinblue_actions.sib_api_v3_sdk.RemoveContactFromList')
    @patch('actions.email_sendinblue_actions.contacts_api_client.remove_contact_from_list')
    def test_remove_contact_from_mailing_list_Successful(self, mock_remove, mock_sdk):
        # given
        contact_emails = {'all': False,
                          'emails': [[{'abc@gmail.com'}, {'abcd@gmail.com'}]],
                          'ids': None}
        list_ids = [1]
        success_response = {"message": f"Email removed from List ID {list_ids[0]} successfully",
                            "api_response": 'api_response'}
        mock_sdk.return_value = contact_emails
        mock_remove.return_value = 'api_response'

        # when
        result = remove_contact_from_mailing_list(contact_emails['emails'], list_ids)
        
        # then
        assert result == success_response
        mock_sdk.assert_called_with(emails=[contact_emails['emails']], all=False)
        mock_remove.assert_called_with(list_id=1, contact_emails=contact_emails)
    
    # Case 2
    @patch('actions.email_sendinblue_actions.sib_api_v3_sdk.RemoveContactFromList')
    @patch('actions.email_sendinblue_actions.contacts_api_client.remove_contact_from_list')
    def test_remove_contact_from_mailing_list_Exceptions(self, mock_remove, mock_sdk):
        # given
        contact_emails = {'all': False,
                          'emails': [[{'invalidemailid'}, {'abcdgmail.com'}]],
                          'ids': None}
        list_ids = [1]
        mock_sdk.return_value = contact_emails
        mock_remove.side_effect = Exception()

        # when
        with pytest.raises(HTTPException) as exc_info:
            remove_contact_from_mailing_list(contact_emails['emails'], list_ids)
        
        # then
        assert exc_info.value.status_code == 400
        mock_sdk.assert_called_with(emails=[contact_emails['emails']], all=False)
        mock_remove.assert_called_with(list_id=1, contact_emails=contact_emails)
