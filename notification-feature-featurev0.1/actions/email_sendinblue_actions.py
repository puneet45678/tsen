import sib_api_v3_sdk
from sib_api_v3_sdk.rest import ApiException
from config.read_yaml import config_yaml
from logger.logging import get_db_action_Logger
from sib_api_v3_sdk.api.lists_api import ListsApi
from fastapi import HTTPException, status

logger = get_db_action_Logger(__name__)


def setUpBrevoClients():
    configuration = sib_api_v3_sdk.Configuration()
    configuration.api_key["api-key"] = config_yaml.sendinblue["sendin_blue_api_key"]

    try:
        trxnl_email_api_client = sib_api_v3_sdk.TransactionalEmailsApi(
            sib_api_v3_sdk.ApiClient(configuration)
        )
    except Exception as e:
        logger.error(str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create transactional email client",
        )

    try:
        contacts_api_client = sib_api_v3_sdk.ContactsApi(
            sib_api_v3_sdk.ApiClient(configuration)
        )
    except Exception as e:
        logger.error(str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create the Contacts API client",
        )

    try:
        List_api_client = ListsApi(sib_api_v3_sdk.ApiClient(configuration))
    except Exception as e:
        logger.error(str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create the Lists API client",
        )

    return (trxnl_email_api_client, contacts_api_client, List_api_client)


trxnl_email_api_client, contacts_api_client, List_api_client = setUpBrevoClients()    

async def send_single_user_transactional_email(
    email_subject, sender, replyTo, user_email, _template_id, _params
):
    send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(
        to=user_email,
        reply_to=replyTo,
        sender=sender,
        subject=email_subject,
        template_id=_template_id,
        params=_params,
    )

    try:
        try:
            api_response = trxnl_email_api_client.send_transac_email(send_smtp_email)
            logger.debug(f"sending email to mail_id: {user_email}")
            return {"message": "success", "api-response": api_response}
        except ApiException as e:
            logger.error(str(e))
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to send the email to email_id: {user_email}",
            )
    except Exception as e:
        logger.error(str(e))
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Failed to send the email to email_id: {user_email}")
    
    
async def send_single_user_email_html(html_content, email_subject,email_id,sender,replyTo):
    send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(
    to=email_id,
    reply_to=replyTo,
    html_content=html_content,
    sender=sender,
    subject=email_subject,
)

    try:
        try:
            api_response = trxnl_email_api_client.send_transac_email(send_smtp_email)
            logger.debug(f"sending email to mail_id: {email_id}")
            return {"message": "success", "api-response": api_response}
        except ApiException as e:
            logger.error(str(e))
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to send the email to email_id: {email_id}",
            )
    except Exception as e:
        logger.error(str(e))
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Failed to send the email to email_id: {email_id}")    


async def send_emails_to_multiple_users(
    email_subject, sender, replyTo, _template_id:int | None, _message_version
):
   

    send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(
        reply_to=replyTo,
        sender=sender,
        subject=email_subject,
        template_id=_template_id,
        message_versions=_message_version,
    )

    try:
        try:
            api_response = trxnl_email_api_client.send_transac_email(send_smtp_email)
            logger.debug(f"Sending email to multiple email_ids")
            return {"message": "success", "api-response": api_response}
        except ApiException as e:
            logger.error(str(e))
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to send email to multiple recipients",
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to send emails to multiple recipients"
        )
    

async def send_emails_to_multiple_users_with_html(
    email_subject, subscriber_email_list, replyTo, sender, _template_id, _params
):
    to = []
    for email in subscriber_email_list:
        to.append({"email": email})

    send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(
        to=to,
        reply_to=replyTo,
        sender=sender,
        subject=email_subject,
        template_id=_template_id,
        params=_params,
    )

    try:
        try:
            api_response = trxnl_email_api_client.send_transac_email(send_smtp_email)
            logger.debug(f"Sending email to mail_ids: {to}")
            return {"message": "success", "api-response": api_response}
        except ApiException as e:
            logger.error(str(e))
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to send email to multiple recipients",
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to send emails to multiple recipients"
        )

async def add_contact_to_mailing_list(email_id, list_ids):
    new_contact = sib_api_v3_sdk.CreateContact(email=email_id, list_ids=list_ids)

    try:
        api_response = contacts_api_client.create_contact(new_contact)
        return {
            "message: ": "Success: contact created successfully",
            "api_response": api_response,
        }
    except Exception as e:
        logger.error(str(e))
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unable to add the user(s) to the list",
        )


async def remove_contact_from_mailing_list(email_id: list, list_ids):
    emailList = []
    emailList.append(email_id)

    contact_emails = sib_api_v3_sdk.RemoveContactFromList(emails=emailList, all=False)

    for list_id in list_ids:
        try:
            api_response = contacts_api_client.remove_contact_from_list(
                list_id=list_id, contact_emails=contact_emails
            )
            return {
                "message": f"Emails removed from List ID {list_id} successfully",
                "api_response": api_response,
            }
        except Exception as e:
            logger.error(str(e))
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Unable to remove contact from the list",
            )
