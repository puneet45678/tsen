from constants import email_content
from actions import email_sendinblue_actions
from logger.logging import get_db_action_Logger
from models import (
    project_update_notification_model,
    brevo_contact_list_model,
    admin_notificaiton,
)
from pydantic import EmailStr
from typing import Optional
from fastapi import HTTPException
from config.read_yaml import config_yaml

logger = get_db_action_Logger(__name__)


async def handle_test_multiple_emails_msg_version(email_list:list,user_name_list:list):
    sender = {"email": email_content.sender_email}
    replyTo = {"email": email_content.reply_to_email}
    message_version=[
        {
            "to":[
                {
                    "email":email_list[0]
                }
            ],
            "template_id":1,
            "params":{"user_name":user_name_list[0]}
        },
         {
            "to":[
                {
                    "email":email_list[1]
                }
            ],
            "template_id":1,
            "params":{"user_name":user_name_list[1]}
        },
        {
            "to":[
                {
                    "email":email_list[2]
                }
            ],
            "template_id":1,
            "params":{"user_name":user_name_list[2]}
        },

    ]
    subject= "Batch bros"
    _template_id=1

    batch_email_response = await email_sendinblue_actions.test_send_batch_emails(subject,sender,replyTo,_template_id,message_version)
    return batch_email_response


async def handle_new_backer_email(
    subscriber_name,
    subscriber_email_id,
    campaign_name,
    backer_number,
    funds_raised_amount
):
    new_backer_Subject = email_content.new_backer_subject
    

    _template_id = 6
    _params = {"first_name":subscriber_name,"campaign_name":campaign_name,"backer_number":backer_number,"funds_number":funds_raised_amount,"campaign_owner_email_id":subscriber_email_id}
    sender = {"email": email_content.sender_email}
    replyTo = {"email": email_content.reply_to_email}
    to = [{"email": subscriber_email_id}]

    sent_response = await email_sendinblue_actions.send_single_user_transactional_email(
        new_backer_Subject, sender, replyTo, to,_template_id, _params
    )
    return sent_response

async def handle_new_email_signup_verification(
    user_email_id,
    verification_link
):
    new_backer_Subject = email_content.new_signup_verification_subject
    

    _template_id = 45
    _params = {"verification_link":verification_link,"signee_email_id":user_email_id}
    sender = {"email": email_content.sender_email}
    replyTo = {"email": email_content.reply_to_email}
    to = [{"email": user_email_id}]

    sent_response = await email_sendinblue_actions.send_single_user_transactional_email(
        new_backer_Subject, sender, replyTo, to,_template_id, _params
    )
    return sent_response




async def handle_campaign_emails(
    subscriber_email_list, trigger_point, campaign_name
):
    TRIGGER_POINT_ENUM = project_update_notification_model.Trigger_Point
    project_update_subject = {}
    project_update_html_content = {}
    sender = {"name": "Ikarus Nest", "email": email_content.sender_email}
    replyTo = {"name": "Ikarus Nest", "email": email_content.reply_to_email}
    if trigger_point == TRIGGER_POINT_ENUM.project_update.name:
        logger.debug("Project Update trigger point has been hit")
        project_update_subject["subject"] = email_content.project_update_subject
        project_update_html_content["html"] = email_content.project_update_html_content(
            campaign_name
        )
    elif trigger_point == TRIGGER_POINT_ENUM.campaign_ended.name:
        logger.debug("Campaign Ended trigger point has been hit")
        project_update_subject["subject"] = email_content.campaign_ended_subject
        project_update_html_content["html"] = email_content.project_ended_html_content(
            campaign_name
        )
    elif trigger_point == TRIGGER_POINT_ENUM.campaign_failed.name:
        logger.debug("Campaign Failure trigger point has been hit")
        project_update_subject["subject"] = email_content.campaign_failure_subject
        project_update_html_content[
            "html"
        ] = email_content.campaign_failed_html_content(campaign_name)

    sent_response = await email_sendinblue_actions.send_emails_to_multiple_users(
        project_update_subject["subject"],
        project_update_html_content["html"],
        subscriber_email_list,
        replyTo,
        sender
    )
    return sent_response


async def handle_new_signup_email(user_name, email_id):
    sender = {"email": email_content.sender_email}
    replyTo = {"email": email_content.reply_to_email}
    to = [{"email": email_id}]
    template_id = 1
    new_signup_html_content = email_content.get_new_signup_email_template(user_name,email_id)
    new_signup_subject = email_content.new_signup_subject
    params = {"user_name":user_name}
    sent_response = await email_sendinblue_actions.send_single_user_transactional_email(
        new_signup_html_content, new_signup_subject, sender, replyTo, to,template_id,params
    )
    return sent_response


async def handle_new_model_approval_email(email_id, model_name):
    sender = {"email": email_content.sender_email}
    replyTo = {"email": email_content.reply_to_email}
    to = [{"email": email_id}]
    new_model_approval_html_content = email_content.new_model_approval(model_name)
    new_model_approval_subject = email_content.new_model_approval_subject
    sent_response = await email_sendinblue_actions.send_single_user_transactional_email(
        new_model_approval_html_content, new_model_approval_subject, sender, replyTo, to
    )
    return sent_response


async def handle_new_model_rejection_email(user_name,email_id, model_name,admin_rejection_comments):
    sender = {"email": email_content.sender_email}
    replyTo = {"email": email_content.reply_to_email}
    to = [{"email": email_id}]
    new_model_rejected_html_content = email_content.new_model_rejected_html_content(
        user_name,model_name,admin_rejection_comments,email_id
    )
    new_model_rejected_subject = email_content.new_model_rejected_subject
    sent_response = await email_sendinblue_actions.send_single_user_transactional_email(
        new_model_rejected_html_content, new_model_rejected_subject,sender , replyTo, to
    )
    return sent_response


async def handle_new_campaign_approval_or_rejection_email(user_name,email_id, campaign_name, action,campaign_rejection_comments):
    sender = {"email": email_content.sender_email}
    replyTo = {"email": email_content.reply_to_email}
    to = [{"email": email_id}]
    if action == "approved":
        new_campaign_approval_html_content = email_content.new_campaign_approval(
            user_name,email_id,campaign_name
        )
        new_campaign_approval_subject = email_content.new_campaign_approval_subject
        sent_response = await email_sendinblue_actions.send_single_user_transactional_email(
            new_campaign_approval_html_content,
            new_campaign_approval_subject,
            sender,
            
            replyTo,
            to,
        )
        return sent_response
    elif action == "rejected":
        new_campaign_rejected_html_content = (
            email_content.new_campaign_rejected_html_content(user_name,campaign_name,email_id,campaign_rejection_comments)
        )
        new_campaign_rejected_subject = email_content.new_campaign_rejected_subject
        sent_response = await email_sendinblue_actions.send_single_user_transactional_email(
            new_campaign_rejected_html_content,
            new_campaign_rejected_subject,
           sender,
            
            replyTo,
            to,
        )
        return sent_response

async def handle_campaign_published_campaign_owner(campaign_owner_name:str, campaign_name:str, campaign_owner_email:str):
    sender = {"email": email_content.sender_email}
    replyTo = {"email": email_content.reply_to_email}
    email_subject = email_content.campaign_published_subject
    _template_id = 3

    _params = {"firstname":campaign_owner_name,"campaign_name":campaign_name,"user_email_id":campaign_owner_email}

    sent_response = await email_sendinblue_actions.send_single_user_transactional_email(email_subject,sender,replyTo,campaign_owner_email,_template_id,_params)
    return sent_response


async def handle_campaign_published_email_followers(campaign_name: str, email_id_list: list,campaign_description:str,early_bird_description:str,campaign_owner_name:str,users_followers_user_name_list:list):
    sender = {"email": email_content.sender_email}
    replyTo = {"email": email_content.reply_to_email}
    email_subject = email_content.campaign_published_subject
    _template_id = 21

    message_version_data = []
    for email_index in range(len(email_id_list)):
        message_version_data.append({
            "to":[{"email":email_id_list[email_index]}],
            "template_id":_template_id,
            "params":{"firstname":users_followers_user_name_list[email_index],"campaign_name":campaign_name,"campaign_owner_name":campaign_owner_name,"campaign_description":campaign_description,"early_bird_description":early_bird_description,"signee_email_id":email_id_list[email_index]}
        })

    _message_version=message_version_data

    sent_response = await email_sendinblue_actions.send_emails_to_multiple_users(
        email_subject, sender, replyTo,_template_id,_message_version
    )
    return sent_response

async def handle_campaign_published_email_premarket_signees(campaign_name: str, email_id_list: list,campaign_description:str,early_bird_description:str,campaign_owner_name:str,premarketing_signees_user_name_list:list):
    sender = {"email": email_content.sender_email}
    replyTo = {"email": email_content.reply_to_email}
    email_subject = email_content.campaign_published_subject
    _template_id = 22
    message_version_data = []
    for email_index in range(len(email_id_list)):
        message_version_data.append({
            "to":[{"email":email_id_list[email_index]}],
            "template_id":_template_id,
            "params":{"firstname":premarketing_signees_user_name_list[email_index],"campaign_name":campaign_name,"campaign_owner_name":campaign_owner_name,"campaign_description":campaign_description,"early_bird_description":early_bird_description,"signee_email_id":email_id_list[email_index]}
        })

    _message_version=message_version_data

    sent_response = await email_sendinblue_actions.send_emails_to_multiple_users(
         email_subject, sender, replyTo,_template_id,_message_version
    )
    return sent_response


async def handle_premarketing_signup_email(backer_name:str, campaign_name:str, email_id:str,campaign_owner_user_name:str,premarket_signee_numbers:int):
    sender = {"email": email_content.sender_email}
    replyTo = {"email": email_content.reply_to_email}
    to = [{"email": email_id}]

    _template_id = 5
    _params = {"firstname":campaign_owner_user_name,"premarket_signee_numbers":premarket_signee_numbers,"campaign_owner_email_id":email_id}
    premarketing_signup_subject = email_content.premarketing_signup_subject
    sent_response = await email_sendinblue_actions.send_single_user_transactional_email(
        premarketing_signup_subject,
        to,
        replyTo,
        sender,
        _template_id,
        _params
    )
    return sent_response

##TODO: Ask Product and Marketing team as what does order_details look like
async def handle_email_to_buyer_purchase_successful(buyer_user_name,buyer_email,product_bought_name,order_details):
    sender = {"email": email_content.sender_email}
    replyTo = {"email": email_content.reply_to_email}
    to = [{"email": buyer_email}]
    _template_id = 14
    params = {"product_name":product_bought_name,"firstname":buyer_user_name,"order_details":order_details,"signee_email_id":buyer_email}
   
    marketplace_purchase_subject = email_content.marketplace_purchase_subject
    sent_response = await email_sendinblue_actions.send_single_user_transactional_email(
        
        marketplace_purchase_subject,
        sender,
        replyTo,
        to,
        _template_id = _template_id,
        _params = params
    )
    return sent_response   


async def handle_marketplace_purchase_email(model_owner_user_name:str,buyer_user_name:str, model_name:str, model_owner_mail_id:str,buyer_number):
    sender = {"email": email_content.sender_email}
    replyTo = {"email": email_content.reply_to_email}
    to = [{"email": model_owner_mail_id}]
    # marketplace_purchase_html_content = email_content.marketplace_purchase_html_content(
    #     model_owner_user_name,buyer_user_name, model_name,model_owner_mail_id,buyer_number
    # )

    _template_id = 4
    _params={"firstname":model_owner_user_name,"buyer_name":buyer_user_name,"model_name":model_name,"buyer_mumber":buyer_number,"owner_email":model_owner_mail_id}
    marketplace_purchase_subject = email_content.new_model_buyer_email_subject(buyer_number)
    sent_response = await email_sendinblue_actions.send_single_user_transactional_email(
        marketplace_purchase_subject,
        sender,
        replyTo,
        to,
        _template_id,
        _params
    )
    return sent_response


async def handle_milestone_reached_email_to_owner_and_backers(
    campaign_owner_user_name, owner_email, milestone_name, backers_email_list: list, campaign_name:str,milestone_reached_date,milestone_rewards,backers_user_name_list:list
):
    sender = {"email": email_content.sender_email}
    replyTo = {"email": email_content.reply_to_email}

##TODO: Complete the html_content by adding user_email IDs and each backer name
    
    milestone_reached_html_content_owner = (
        email_content.milestone_reached_html_content_owner(campaign_owner_user_name, milestone_name,milestone_reached_date,owner_email,milestone_rewards)
    )
    milestone_reached_subject_owner = email_content.milestone_reached_subject_owner
    milestone_reached_subject_backers = email_content.milestone_reached_subject_backers


    message_version_data = []
    for email_index in range(len(backers_email_list)):
        message_version_data.append({
            "to":[{"email":backers_email_list[email_index]}],
            "html_content":email_content.milestone_reached_html_content_backers(
            firstname=backers_user_name_list[email_index],campaign_name=campaign_name,campaign_owner_name=campaign_owner_user_name,milestone_reached_date=milestone_reached_date,milestone_rewards=milestone_rewards, reciever_email_id=backers_email_list[email_index]
        ),
            
        })

    _message_version = message_version_data

    sent_response_backers = (
        await email_sendinblue_actions.send_emails_to_multiple_users(
            milestone_reached_subject_backers,
            sender=sender,
            replyTo=replyTo,
            _message_version=_message_version,
        )
    )

    sent_response_owner = (
        await email_sendinblue_actions.send_single_user_email_html(
            milestone_reached_html_content_owner,
            milestone_reached_subject_owner,
            owner_email,
            sender,
            replyTo,
           
        )
    )

    return {
        "sending_to_backers: ": sent_response_backers,
        "sending_to_owner: ": sent_response_owner,
    }


def handle_early_bird_tier_ending_soon_email(
    signee_email_list:list, campaign_name, time_left,users_name_list:list
):
    sender = {"name": "Ikarus Nest", "email": email_content.sender_email}
    replyTo = {"name": "Ikarus Nest", "email": email_content.reply_to_email}

    early_bird_tier_ending_soon_subject = (
        email_content.early_bird_tier_ending_soon_subject
    )

    _template_id=10
    message_version_data=[]
    for email_index in range(len(signee_email_list)):
        message_version_data.append({
            "to":[{"email":signee_email_list[email_index]}],
            "template_id":_template_id,
            "params":{"firstname":users_name_list[email_index],"campaign_name":campaign_name,"reciever_email_id":signee_email_list[email_index]}
        })

    _message_version = message_version_data

    sent_response = email_sendinblue_actions.send_emails_to_multiple_users(
        early_bird_tier_ending_soon_subject,
        sender,
        replyTo,
        _template_id,
        _message_version
    )
    return sent_response


async def handle_campaign_ending_soon_email(
    wishlisted_users_data_list,pre_marketing_signees_data_list,follwers_data_list, campaign_name, time_left,campaign_owner_name
):
    sender = {"name": "Ikarus Nest", "email": email_content.sender_email}
    replyTo = {"name": "Ikarus Nest", "email": email_content.reply_to_email}
    
    email_subject = email_content.campaign_ending_soon_subject
    _template_id_wishlisht = 13

    wishlist_users_email_id_list=[]
    wishlist_usernames_list=[]
    for wishlist_user in wishlisted_users_data_list:
        wishlist_users_email_id_list.append(wishlist_user["email"])
        wishlist_usernames_list.append(wishlist_user["username"])

    message_version_data_wishlists = []
    for email_index in range(len(wishlist_users_email_id_list)):
        message_version_data_wishlists.append({
            "to":[{"email":wishlist_users_email_id_list[email_index]}],
            "template_id":_template_id_wishlisht,
            "params":{"firstname":wishlist_usernames_list[email_index],"campaign_name":campaign_name,"campaign_owner_name":campaign_owner_name,"time_left":time_left}
        })    

    _message_version_wishlist = message_version_data_wishlists

    sent_response_wishlisted_users = await email_sendinblue_actions.send_emails_to_multiple_users(
       
        email_subject,
        sender,
        replyTo,
        _template_id_followers,
       _message_version_wishlist
    )

    _template_id_premarket_signees = 12

    signee_users_email_id_list=[]
    signee_usernames_list=[]
    for signee_user in pre_marketing_signees_data_list:
        signee_users_email_id_list.append(signee_user["email"])
        signee_usernames_list.append(signee_user["username"])

    message_version_data_signees = []
    for email_index in range(len(signee_users_email_id_list)):
        message_version_data_signees.append({
            "to":[{"email":signee_users_email_id_list[email_index]}],
            "template_id":_template_id_premarket_signees,
            "params":{"firstname":signee_usernames_list[email_index],"campaign_name":campaign_name,"campaign_owner_name":campaign_owner_name,"time_left":time_left}
        })    

    _message_version_signees = message_version_data_signees

    sent_response_premarket_signees = await email_sendinblue_actions.send_emails_to_multiple_users(
        
        email_subject,
         sender,
        replyTo,
        _template_id_premarket_signees,
        _message_version_signees
    )

    _template_id_followers = 11    

    followers_email_id_list=[]
    followers_usernames_list=[]
    for follower_data in follwers_data_list:
        followers_email_id_list.append(follower_data["email"])
        followers_usernames_list.append(follower_data["username"])

    message_version_data_followers = []
    for email_index in range(len(signee_users_email_id_list)):
        message_version_data_followers.append({
            "to":[{"email":followers_email_id_list[email_index]}],
            "template_id":_template_id_followers,
            "params":{"firstname":followers_usernames_list[email_index],"campaign_name":campaign_name,"campaign_owner_name":campaign_owner_name,"time_left":time_left}
        })    

    _message_version_followers = message_version_data_followers
    
    sent_response_followers = await email_sendinblue_actions.send_emails_to_multiple_users(
     
        email_subject,
        sender,
        replyTo,
        _template_id_wishlisht,
        _message_version_followers
    )
    return {
        "email_sent_to_followers":sent_response_followers,
        "email_sent_to_premarketing_signees":sent_response_premarket_signees,
        "email_sent_to_wishlisted_users":sent_response_wishlisted_users
    }


async def handle_model_deletion_email_to_backers(model_name:str, buyers_email_list:list,buyers_username_list:list):
    sender = {"name": "Ikarus Nest", "email": email_content.sender_email}
    replyTo = {"name": "Ikarus Nest", "email": email_content.reply_to_email}
    model_deletion_subject = email_content.model_deletion_subject
    _template_id = 27
    message_version_data = []
    for email_index in range(len(buyers_email_list)):
        message_version_data.append({
            "to":[{"email":buyers_email_list[email_index]}],
            "template_id":_template_id,
            "params":{"firstname":buyers_username_list[email_index],"model_name": model_name,"reciever_email_id":buyers_email_list[email_index]}
        })  

    _message_version = message_version_data
    
    sent_response = await email_sendinblue_actions.send_emails_to_multiple_users(
        model_deletion_subject,
        sender,
        replyTo,
        _template_id,
        _message_version
    )
    return sent_response


## TODO: change the html content and subject for user_admin
async def handle_account_deletion_initialization_email(user_email,user_name,account_deletion_link):
    sender = {"name": "Ikarus Nest", "email": email_content.sender_email}
    replyTo = {"name": "Ikarus Nest", "email": email_content.reply_to_email}
    to = [{"email": user_email}]
    # account_deletion_initialization_html_content = (
    #     email_content.account_deletion_initiated_html_content(user_email)
    # )
    account_deletion_initialization_subject = (
        email_content.account_deletion_initiated_subject
    )
    _template_id = 28
    _params = {"firstname":user_name,"account_deletion_link":account_deletion_link}
    sent_response = await email_sendinblue_actions.send_single_user_transactional_email(
        account_deletion_initialization_subject,
        sender,
        replyTo,
        to,
        _template_id,
        _params
    )
    return sent_response


async def handle_model_deletion_cool_off_period_email(
    user_name, user_email, model_name,deletion_request_date,final_deletion_date
):
    sender = {"name": "Ikarus Nest", "email": email_content.sender_email}
    replyTo = {"name": "Ikarus Nest", "email": email_content.reply_to_email}
    to = [{"email": user_email}]
    # model_deletion_cool_off_period_ending_html_content = (
    #     email_content.model_deletion_cool_off_period_ending_html_content(
    #         user_name, model_name
    #     )
    # )
    model_deletion_cool_off_period_ending_subject = (
        email_content.model_deletion_cool_off_period_ending_subject
    )

    _params = {"firstname":user_name,"model_name":model_name,"deletion_request_date":deletion_request_date,"final_deletion_date":final_deletion_date}
    template_id = 26

    sent_response = await email_sendinblue_actions.send_single_user_transactional_email(
        model_deletion_cool_off_period_ending_subject,
        sender,
        replyTo,
        to,
        template_id,
        _params
    )
    return sent_response


async def handle_object_lying_in_draft_email(user_name, user_email,draft_product_item_name,draft_product_item_type):
    sender = {"name": "Ikarus Nest", "email": email_content.sender_email}
    replyTo = {"name": "Ikarus Nest", "email": email_content.reply_to_email}
    to = [{"email": user_email}]
    # object_lying_in_draft_html_content = (
    #     email_content.object_lying_in_draft_html_content(user_name, campaign_name)
    # )
    _template_id = 25
    params = {"firstname":user_name,"draft_product_item_name":draft_product_item_name,"draft_product_item_type":draft_product_item_type}
    object_lying_in_draft_subject = email_content.object_lying_in_draft_subject
    sent_response = await email_sendinblue_actions.send_single_user_transactional_email(
        # object_lying_in_draft_html_content,
        object_lying_in_draft_subject,
        sender,
        replyTo,
        to,
        _template_id,
        params
    )
    return sent_response


async def handle_account_deletion_cool_off_period_email(user_name, user_email,deletion_request_date,final_deletion_date):
    sender = {"name": "Ikarus Nest", "email": email_content.sender_email}
    replyTo = {"name": "Ikarus Nest", "email": email_content.reply_to_email}
    to = [{"email": user_email}]
    # account_deletion_cool_off_period_ending_html_content = (
    #     email_content.account_deletion_cool_off_period_ending_html_content(user_name)
    # )
    account_deletion_cool_off_period_ending_subject = (
        email_content.account_deletion_cool_off_period_ending_subject
    )
    _template_id = 29
    _params = {"firstname":user_name,"deletion_request_date":deletion_request_date,"final_deletion_date":final_deletion_date}
    sent_response = await email_sendinblue_actions.send_single_user_transactional_email(
        # account_deletion_cool_off_period_ending_html_content,
        account_deletion_cool_off_period_ending_subject,
        sender,
        replyTo,
        to,
        _template_id,
        _params

    )
    return sent_response


def handle_notifying_admins(user_name, admin_email, notification_type):
    sender = {"name": "Ikarus Nest", "email": email_content.sender_email}
    replyTo = {"name": "Ikarus Nest", "email": email_content.reply_to_email}
    to = [{"email": admin_email}]
    email_notification_type = admin_notificaiton.notification_type
    html_content = None
    admin_subject = None
    if notification_type == email_notification_type.user_asked_account_deletion.name:
        html_content = email_content.account_deletion_raised_to_admin_html_content(
            user_name
        )
        admin_subject = email_content.account_deletion_raised_to_admin_subject
    elif notification_type == email_notification_type.user_is_reported.name:
        html_content = email_content.user_reported_raised_to_admin_html_content(
            user_name
        )
        admin_subject = email_content.user_reported_raised_to_admin_subject

    sent_response = email_sendinblue_actions.send_single_user_transactional_email(
        html_content,
        admin_subject,
        sender,
        replyTo,
        to,
    )
    return sent_response

async def handle_email_change_acknowledgement(user_name:str, new_email:str, old_email:str):
    sender = {"name": "Ikarus Nest", "email": email_content.sender_email}
    replyTo = {"name": "Ikarus Nest", "email": email_content.reply_to_email}   
    email_subject = email_content.email_changed_success_subject
    message_version_data=[
        {
            "to":[
                {
                    "email":new_email
                }
            ],
            "template_id":37,
            "params":{"firstname":user_name,"signee_email_id":new_email}
        },
         {
            "to":[
                {
                    "email":old_email
                }
            ],
            "template_id":37,
            "params":{"firstname":user_name,"signee_email_id":old_email}
        },
    ]
    _message_version = message_version_data
    _template_id=37
    sent_response = await email_sendinblue_actions.send_emails_to_multiple_users(email_subject,sender,replyTo,_template_id,_message_version)
    return sent_response


async def handle_email_for_user_signup_email_verification(
    user_name: str,
    user_email: EmailStr,
    token: str,
    verificationLink: str,
    verificationText: str,
):
    sender = {"name": "Ikarus Nest", "email": email_content.sender_email}
    replyTo = {"name": "Ikarus Nest", "email": email_content.reply_to_email}
    to = [{"email": user_email}]
    html_content = email_content.get_email_verification_email_template(
        verificationLink, verificationText, user_name
    )
    email_subject = email_content.new_user_email_verification_subject
    sent_response = await email_sendinblue_actions.send_single_user_transactional_email(
        html_content,
        email_subject,
        sender,
        replyTo,
        to,
    )
    return sent_response


async def handle_email_for_email_change_verification(
    user_name: str, user_email: EmailStr, new_email_verification_api_link: str
):
    sender = {"name": "Ikarus Nest", "email": email_content.sender_email}
    replyTo = {"name": "Ikarus Nest", "email": email_content.reply_to_email}
    to = [{"email": user_email}]
    html_content = email_content.get_email_change_verification_email_template(
        new_email_verification_api_link, user_name
    )
    
    email_subject = email_content.email_change_verification_subject
    sent_response = await email_sendinblue_actions.send_single_user_email_html(
        html_content,
        email_subject,
        to,
        sender,
        replyTo,
        
    )
    return sent_response


async def handle_unkown_device_login_email(
    user_name: str, email_info: dict, add_to_known_device_api_link: str
):
    sender = {"name": "Ikarus Nest", "email": email_content.sender_email}
    replyTo = {"name": "Ikarus Nest", "email": email_content.reply_to_email}
    user_email = email_info["email"]
    to = [{"email": user_email}]
    html_content = email_content.get_unkown_device_login_email_template(
        email_info, user_name, add_to_known_device_api_link
    )
    email_subject = email_content.unkown_device_login_verification_subject
    sent_response = await email_sendinblue_actions.send_single_user_email_html(
        html_content,
        email_subject,
        to,
        sender,
        replyTo,
        
    )
    return sent_response

async def handle_email_user_requested_3da_role(user_name:str,user_email:EmailStr):
    sender = {"name": "Ikarus Nest", "email": email_content.sender_email}
    replyTo = {"name": "Ikarus Nest", "email": email_content.reply_to_email}
    to = [{"email": user_email}]    

    _template_id = 38,
    _params = {"firstname":user_name,"signee_email_id":user_email}
    email_subject = email_content.user_requested_3da_role_subject
    sent_response = await email_sendinblue_actions.send_single_user_transactional_email(
        email_subject,
        sender,
        replyTo,
        to,
        _template_id,
        _params
    )
    return sent_response

async def handle_email_user_granted_3da_role(user_name:str,user_email:EmailStr):
    sender = {"name": "Ikarus Nest", "email": email_content.sender_email}
    replyTo = {"name": "Ikarus Nest", "email": email_content.reply_to_email}
    to = [{"email": user_email}]    

    _template_id = 39,
    _params = {"firstname":user_name,"signee_email_id":user_email}
    email_subject = email_content.user_granted_3da_role_subject
    sent_response = await email_sendinblue_actions.send_single_user_transactional_email(
        email_subject,
        sender,
        replyTo,
        to,
        _template_id,
        _params
    )
    return sent_response

async def handle_email_user_declined_3da_role(user_name:str,user_email:EmailStr):
    sender = {"name": "Ikarus Nest", "email": email_content.sender_email}
    replyTo = {"name": "Ikarus Nest", "email": email_content.reply_to_email}
    to = [{"email": user_email}]    

    _template_id = 40,
    _params = {"firstname":user_name,"signee_email_id":user_email}
    email_subject = email_content.user_declined_3da_role_subject
    sent_response = await email_sendinblue_actions.send_single_user_transactional_email(
        email_subject,
        sender,
        replyTo,
        to,
        _template_id,
        _params
    )
    return sent_response


async def handle_email_abondoned_cart(
    user_name: str, user_email: EmailStr, item_details: dict, last_updated_date: str
):
    sender = {"name": "Ikarus Nest", "email": email_content.sender_email}
    replyTo = {"name": "Ikarus Nest", "email": email_content.reply_to_email}
    to = [{"email": user_email}]
    html_content = email_content.get_abondoned_cart_email_template(
        user_name, last_updated_date, item_details
    )
    email_subject = email_content.abondoned_cart_subject
    sent_response = await email_sendinblue_actions.send_single_user_transactional_email(
        html_content,
        email_subject,
        sender,
        replyTo,
        to,
    )
    return sent_response


async def handle_email_your_campaign_ended(user_email:str,user_name:str,backer_numbers:int,funds_raised_amount:int):
    sender = {"name": "Ikarus Nest", "email": email_content.sender_email}
    replyTo = {"name": "Ikarus Nest", "email": email_content.reply_to_email}   
    to = [{"email": user_email}]

    _template_id = 30
    _params = {"firstname":user_name,"backer_numbers":backer_numbers,"funds_raised_amount":funds_raised_amount,"campaign_owner_email_id":user_email}
    email_subject = email_content.abondoned_cart_subject
    sent_response = await email_sendinblue_actions.send_single_user_transactional_email(
        email_subject,
        sender,
        replyTo,
        to,
        _template_id,
        _params
    )
    return sent_response   


async def handle_email_forgot_pasword(user_email,user_name,password_reset_link):
    sender = {"name": "Ikarus Nest", "email": email_content.sender_email}
    replyTo = {"name": "Ikarus Nest", "email": email_content.reply_to_email}   
    to = [{"email": user_email}]
    email_subject = email_content.forgot_pasword_subject
    _template_id = 32
    _params = {"firstname":user_name,"password_reset_link":password_reset_link,"user_email_id":user_email}    
    sent_response = await email_sendinblue_actions.send_single_user_transactional_email(
        email_subject,
        sender,
        replyTo,
        to,
        _template_id,
        _params
    )
    return sent_response  

async def handle_email_forgot_password_changed(user_email,user_name):
    sender = {"name": "Ikarus Nest", "email": email_content.sender_email}
    replyTo = {"name": "Ikarus Nest", "email": email_content.reply_to_email}   
    to = [{"email": user_email}]

    _template_id = 33
    _params = {"firstname":user_name,"signee_email_id":user_email}    
    email_subject = email_content.forgot_password_changed_subject
    sent_response = await email_sendinblue_actions.send_single_user_transactional_email(
        email_subject,
        sender,
        replyTo,
        to,
        _template_id,
        _params
    )
    return sent_response      

async def handle_email_password_changed_user_request(user_email,user_name):
    sender = {"name": "Ikarus Nest", "email": email_content.sender_email}
    replyTo = {"name": "Ikarus Nest", "email": email_content.reply_to_email}   
    to = [{"email": user_email}]

    _template_id = 34
    _params = {"firstname":user_name,"signee_email_id":user_email}    
    email_subject = email_content.forgot_password_changed_subject
    sent_response = await email_sendinblue_actions.send_single_user_transactional_email(
        email_subject,
        sender,
        replyTo,
        to,
        _template_id,
        _params
    )
    return sent_response  


async def handle_adding_contacts_to_list(email_id, list_names):
    email_list_name = brevo_contact_list_model.EmailListName
    list_ids = []
    for list_name in list_names:
        if list_name == email_list_name.promotional.name:
            list_ids.append(config_yaml.brevo_contact_lists_config["promotional_list_id"])
        if list_name == email_list_name.offers.name:
            list_ids.append(config_yaml.brevo_contact_lists_config["offers_list_id"])
        if list_name == email_list_name.new_features.name:
            list_ids.append(config_yaml.brevo_contact_lists_config["new_features_list_id"])
    contact_update_respoonse = await email_sendinblue_actions.add_contact_to_mailing_list(
        email_id, list_ids
    )
    return contact_update_respoonse


async def handle_removing_contacts_from_list(email_id, list_names):
    email_list_name = brevo_contact_list_model.EmailListName
    list_ids = []
    for list_name in list_names:
        if list_name == email_list_name.promotional.name:
            list_ids.append(config_yaml.brevo_contact_lists_config["promotional_list_id"])
        if list_name == email_list_name.offers.name:
            list_ids.append(config_yaml.brevo_contact_lists_config["offers_list_id"])
        if list_name == email_list_name.new_features.name:
            list_ids.append(config_yaml.brevo_contact_lists_config["new_features_list_id"])
    contact_update_respoonse = (
       await email_sendinblue_actions.remove_contact_from_mailing_list(email_id, list_ids)
    )
   
    return contact_update_respoonse
