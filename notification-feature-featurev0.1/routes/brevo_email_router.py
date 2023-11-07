from fastapi import APIRouter, HTTPException, Request, status, Query
from config.read_yaml import *
from models import (
    backed_notification_model,
    project_update_notification_model,
    new_model_approval,
    campaign_published_model,
    premarketing_signup_model,
    marketplace_purchase_model,
    milestone_reached_model,
    early_bird_tier_ending_soon_model,
    campaign_ending_soon_model,
    brevo_contact_list_model,
    new_campaign_approval,
    account_deletion_initiated_model,
    model_deletion_model,
    new_model_rejection,
    admin_notificaiton,
    new_user_email_verification_model,
    email_change_verification_model,
    unkown_device_login_model,
    abondoned_cart_model,
    object_lying_draft_model,
    account_deletion_cool_off_period_model,
    your_campaign_ended_model,
    buyer_purchase_complete,
    forgot_password_model,
    forgot_password_changed_model,
    password_changed_user_request_model,
    user_requests_3da_model,
    confirm_your_signup_model,
    new_email_change_success
)
from services import email_brevo_service, get_info_service
from logger.logging import get_db_action_Logger
from email_validator import validate_email
from services import admin_panel_service
from constants import getstream_verb
from fastapi.requests import Request
from config.read_yaml import config_yaml
import asyncio
import concurrent.futures
from constants.in_app_content import (
    return_notification_data_milestone_reached,
    return_early_bird_tier_ending_soon_time_period,
    return_early_bird_tier_ending_soon_seats_left,
    return_campaign_ending_soon,
    return_model_approved,
    return_model_rejected,
    return_marketplace_purchase,
    return_your_signed_up_pre_marketing_campaign_has_published,
    return_your_campaign_published,
    return_artist_you_follow_published_campaign,
    return_someone_backed_your_campaign,
    return_your_campaign_got_premarket_signee,
    return_your_campaign_ended,
    return_your_purchase_completed,
    return_your_campaign_approved_or_rejected,
)
from config import read_yaml
base_api_path = "/email/api/v1"

router = APIRouter(tags=["Email Notification Service"], prefix=base_api_path)

logger = get_db_action_Logger(__name__)


@router.post("/notification/topic/new_update_on_backed_campaign", status_code=201)
async def send_email_notification_new_update_on_backed_campaign(
    data: project_update_notification_model.Project_Update_Notification,
    request: Request,
):
    request_id = request.state.x_request_id
    data = data.dict()
    user_id = request.state.user_id
    campaign_owner_data = await get_info_service.get_user_data(user_id, request_id)
    campaign_owner_name = campaign_owner_data["user_name"]
    campaign_id = data["campaign_id"]
    user_ids_list = data["user_ids_list"]
    subscriber_email_list = await get_info_service.get_user_emails_list(
        user_ids_list, request_id
    )
    trigger_point = data["trigger_point"]
    campaign_id = data["campaign_id"]
    campaign_name = await get_info_service.get_campaign_name(campaign_id, request_id)
    logger.info(f"Sending emails to all the campaign backers")

    async def send_email_task():
        await email_brevo_service.handle_campaign_emails(
            subscriber_email_list, trigger_point, campaign_name
        )

    verb = getstream_verb.getstream_campaign_updates_verb
    notification_data = "Project has an Update"

    async def add_notification_task():
        await admin_panel_service.trigger_adding_notification_to_multiple_users_feed(
            campaign_owner_name, verb, notification_data, user_ids_list
        )

    with concurrent.futures.ThreadPoolExecutor() as executor:
        email_future = asyncio.get_event_loop().run_in_executor(
            executor, send_email_task
        )
        notification_future = asyncio.get_event_loop().run_in_executor(
            executor, add_notification_task
        )

    email_sent_response, adding_activity_response = await asyncio.gather(
        email_future, notification_future
    )
    return {
        "email_response: ": email_sent_response,
        "getstream_activity_response: ": adding_activity_response,
    }

@router.post("/notification/confirmation/sign-up", status_code=201)
async def send_email_confirm_your_signup(data:confirm_your_signup_model.ConfirmYourSignup):
    data = data.dict()
    verification_link=data["verification_link"]
    user_email=data["user_email"]
    user_id=data["user_id"]
    logger.info(f"Sending email with verification link to the new signed up user with user_id:{user_id}")
    sent_response = await email_brevo_service.handle_new_email_signup_verification(user_email, verification_link)
    return sent_response


@router.post("/notification/welcome/sign-up", status_code=201)
async def send_email_you_signed_up(request: Request):
    user_id = request.state.user_id
    request_id = request.state.x_request_id
    user_data = await get_info_service.get_user_data(user_id, request_id)
    user_name = user_data["user_name"]
    mail_address = user_data["user_email"]
    logger.info(f"Sending email to the new signee of Nest")
    sent_response = await email_brevo_service.handle_new_signup_email(
        user_name, mail_address
    )
    return sent_response



@router.post("/notification/campaign-backed", status_code=201)
async def send_notification_someone_backed_your_campaign(
    request: Request, data: backed_notification_model.Backed_Notification
):
    backer_user_id = request.state.user_id
    request_id = request.state.x_request_id
    backer_user_data = await get_info_service.get_user_data(backer_user_id, request_id)
    backer_user_name = backer_user_data["user_name"]
    data = data.dict()
    campaign_owner_user_id = data["campaign_owner_user_id"]
    campaign_name = data["campaign_name"]
    first_backer = data["first_backer"]
    backer_number = data["backer_number"]
    funds_raised_amount = data["funds_raised_amount"]
    campaign_owner_user_data = await get_info_service.get_user_data(
        campaign_owner_user_id,request_id
    )
    campaign_owner_name = campaign_owner_user_data["user_name"]
    campaign_owner_email_id = campaign_owner_user_data["user_email"]

    email_task = asyncio.create_task(
        email_brevo_service.handle_new_backer_email(
            campaign_owner_name,
            campaign_owner_email_id,
            campaign_name,
            backer_number,
            funds_raised_amount,
        )
    )

    verb = getstream_verb.getstream_your_campaign_backed_verb

    notification_data = return_someone_backed_your_campaign(
        campaign_name, first_backer, backer_user_name
    )

    notification_task = asyncio.create_task(
        admin_panel_service.trigger_adding_notification_to_user_feed(
            campaign_owner_user_id, verb, notification_data
        )
    )

    email_response, notification_response = await asyncio.gather(
        email_task, notification_task
    )
    return {
        "email_response": email_response,
        "getstream_notification_response": notification_response,
    }


##TODO: Ask @himanshu to get the data needed
# @router.post("notification/abondoned-wishlist")


@router.post("/notification/model-approval", status_code=201)
async def send_email_model_approval(
    data: new_model_approval.ModelApproval, request: Request
):
    data = data.dict()
    user_id = data["user_id"]
    request_id = request.state.x_request_id
    user_data = await get_info_service.get_user_data(user_id, request_id)
    user_name = user_data["user_name"]
    user_email = user_data["user_email"]
    try:
        validate_email(user_email)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid email address",
        )
    model_name = data["model_name"]
    logger.info(f"Sending email to the campaign owner about new Model approved")

    email_task = asyncio.create_task(
        email_brevo_service.handle_new_model_approval_email(user_email, model_name)
    )
    verb = getstream_verb.getstream_model_is_approved_verb

    notification_data = return_model_approved(model_name)

    notification_task = asyncio.create_task(
        admin_panel_service.trigger_adding_notification_to_user_feed(
            user_id, verb, notification_data
        )
    )

    email_sent_response, adding_activity_response = await asyncio.gather(
        email_task, notification_task, return_exceptions=True
    )
    return {
        "email_response: ": email_sent_response,
        "getstream_activity_response: ": adding_activity_response,
    }


@router.post("/notification/model-rejection", status_code=201)
async def send_email_model_rejection(
    data: new_model_rejection.ModelRejection, request: Request
):
    request_id = request.state.x_request_id
    data = data.dict()
    model_name = data["model_name"]
    user_id = data["user_id"]
    admin_rejection_comments = data["admin_rejection_comments"]
    user_data = await get_info_service.get_user_data(user_id, request_id)
    user_name = user_data["user_name"]
    user_email = user_data["user_email"]

    verb = getstream_verb.getstream_model_is_rejected_verb

    notification_data = return_model_rejected(model_name)

    email_task = asyncio.create_task(
        email_brevo_service.handle_new_model_rejection_email(
            user_name, user_email, model_name, admin_rejection_comments
        )
    )
    notification_task = asyncio.create_task(
        admin_panel_service.trigger_adding_notification_to_user_feed(
            user_id, verb, notification_data
        )
    )

    email_sent_response, adding_activity_response = await asyncio.gather(
        email_task, notification_task, return_exceptions=True
    )
    return {
        "email_response: ": email_sent_response,
        "getstream_activity_response: ": adding_activity_response,
    }


@router.post("/notification/admin/campaign-action", status_code=201)
async def send_email_campaign_approval(
    data: new_campaign_approval.CampaignApprovalModel, request: Request
):
    request_id = request.state.x_request_id
    data = data.dict()
    campaign_name = data["campaign_name"]
    campaign_user_id = data["campaign_user_id"]
    campaign_rejection_comments = data["campaign_comments"]
    user_data = await get_info_service.get_user_data(campaign_user_id, request_id)
    user_name = user_data["user_name"]
    user_email = user_data["user_email"]
    action = data["action"]
    logger.info(f"Sending email to the campaign owner about new Campaign approved")

    email_task = asyncio.create_task(
        email_brevo_service.handle_new_campaign_approval_or_rejection_email(
            user_name, user_email, campaign_name, action, campaign_rejection_comments
        )
    )

    if action == "approve":
        verb = getstream_verb.getstream_your_campaign_approved_verb

    else:
        verb = getstream_verb.getstream_your_campaign_rejected_verb
    notification_data = return_your_campaign_approved_or_rejected(campaign_name, action)

    notification_task = asyncio.create_task(
        admin_panel_service.trigger_adding_notification_to_user_feed(
            campaign_user_id, verb, notification_data
        )
    )

    email_task_response, notification_task_response = await asyncio.gather(
        email_task, notification_task
    )

    return {
        "email_sending_response": email_task_response,
        "in-app_notification_response": notification_task_response,
    }


@router.post("/test-send-multiple-emails-msgVrsion")
async def test_campaign_published( email_id_list:list[str] = Query(),user_name_list:list[str] = Query()):
    batch_email_response = await email_brevo_service.handle_test_multiple_emails_msg_version(email_id_list,user_name_list)
    return batch_email_response

@router.get("/test-users-followers-data")
async def test_get_users_followers_data(request:Request,user_id_list:list[str]=Query()):
    request_id = request.state.x_request_id
    followers_data = await get_info_service.get_list_users_data(user_id_list, request_id)
    return followers_data




## This endpoint is for sending the notifications to: 
#                                                          -Campaign Owner
#                                                          -Followers of the artist who launched the campaign
##                                                         -Pre-marketing signees of the campaign


@router.post("/notification/campaign-published", status_code=201)
async def send_email_campaign_published(
    data: campaign_published_model.CampaignPublished, request: Request
):
    request_id = request.state.x_request_id
    data = data.dict()
    campaign_owner_user_id = data["campaign_owner_user_id"]
    campaign_description = data["campaign_description"]
    user_data = await get_info_service.get_user_data(campaign_owner_user_id, request_id)
    campaign_owner_user_name = user_data["user_name"]
    campaign_owner_email_id = user_data["user_email"]
    early_bird_description = data["early_bird_description"]
    campaign_name = data["campaign_name"]
    pre_marketing_signees_user_id_list = list(
        data["pre_marketing_signees_user_id_list"]
    )
    user_followers_data = await get_info_service.get_users_followers_data(
        campaign_owner_user_id, request_id
    )

    users_followers_email_list = []
    followers_userIDs_list = []
    users_followers_user_name_list=[]

    for follower_data in user_followers_data:
        users_followers_email_list.append(follower_data["email"])
        followers_userIDs_list.append(follower_data["_id"])
        users_followers_user_name_list.append(follower_data["username"])

    
    
    premarketing_signees_data = await get_info_service.get_list_users_data(pre_marketing_signees_user_id_list, request_id)
    premarketing_signees_email_list=[]
    premarketing_signees_user_name_list=[]

    for premarket_signee_data in premarketing_signees_data:
         premarketing_signees_email_list.append(premarket_signee_data["email"])
         premarketing_signees_user_name_list.append(premarket_signee_data["username"])

    logger.info(f"Sending email to the campaign owner about new Campaign Published")

    campaign_owner_email_task = asyncio.create_task(
        email_brevo_service.handle_campaign_published_campaign_owner(
            campaign_owner_user_name,campaign_name,campaign_owner_email_id
        )
    )

    followers_email_task = asyncio.create_task(
        email_brevo_service.handle_campaign_published_email_followers(
            campaign_name,
            users_followers_email_list,
            campaign_description,
            early_bird_description,
            campaign_owner_user_name,
            users_followers_user_name_list,
        )
    )

    premarket_signees_email_task = asyncio.create_task(
        email_brevo_service.handle_campaign_published_email_premarket_signees(
            campaign_name,
            premarketing_signees_email_list,
            campaign_description,
            early_bird_description,
            campaign_owner_user_name,
            premarketing_signees_user_name_list
        )
    )

    pre_marketing_signees_verb = (
        getstream_verb.getstream_campaign_you_signed_up_for_published_verb
    )
    notification_data_pre_marketing_signees = (
        return_your_signed_up_pre_marketing_campaign_has_published(
            campaign_name, campaign_owner_user_name
        )
    )

    signees_notification_task = asyncio.create_task(
        admin_panel_service.trigger_adding_notification_to_multiple_users_feed(
            campaign_owner_user_name,
            pre_marketing_signees_verb,
            notification_data_pre_marketing_signees,
            pre_marketing_signees_user_id_list,
        )
    )

    followers_verb = getstream_verb.getstream_artist_you_follow_published_campaign_verb
    notification_data_followers = return_artist_you_follow_published_campaign(
        campaign_name, campaign_owner_user_name
    )

    artist_followers_notification_task = asyncio.create_task(
        admin_panel_service.trigger_adding_notification_to_multiple_users_feed(
            campaign_owner_user_name, followers_verb, notification_data_followers, followers_userIDs_list
        )
    )

    ##TODO: Add or Remove this owner notification task based on the Product team's indication
    campaign_owner_notification_verb = (
        getstream_verb.getstream_owner_campaign_is_published_verb
    )
    notification_data_owner = return_your_campaign_published(campaign_name, campaign_owner_user_name)

    campaign_owner_notification_task = asyncio.create_task(
        admin_panel_service.trigger_adding_notification_to_user_feed(
            campaign_owner_user_id,
            campaign_owner_notification_verb,
            notification_data_owner
        )
    )

    (
        campaign_owner_email_sent_response,
        followers_email_sent_response,
        premarket_signees_email_sent_response,
        pre_marketing_signees_notification_response,
        followers_notification_response,
        campaign_owner_notification_response,
    ) = await asyncio.gather(
        campaign_owner_email_task,
        followers_email_task,
        premarket_signees_email_task,
        signees_notification_task,
        artist_followers_notification_task,
        campaign_owner_notification_task,
        return_exceptions=True,
    )

    return {
        "campaign_owner_email_response":campaign_owner_email_sent_response,
        "followers_email_response": followers_email_sent_response,
        "premarket_signee_email_response": premarket_signees_email_sent_response,
        "pre_marketing_signees_in_app_response": pre_marketing_signees_notification_response,
        "followers_in_app_response": followers_notification_response,
        "campaign_owner_notification_response":campaign_owner_notification_response
    }


@router.post("/notification/pre-marketing-signup", status_code=201)
async def send_email_premarketing_signup(
    data: premarketing_signup_model.PremarketingSignupModel, request: Request
):
    signee_user_id = request.state.user_id
    request_id = request.state.x_request_id
    signee_user_data = await get_info_service.get_user_data(signee_user_id, request_id)
    signee_user_name = signee_user_data["user_name"]
    data = data.dict()
    campaign_owner_user_id = data["campaing_owner_user_id"]
    campaign_owner_user_data = await get_info_service.get_user_data(
        campaign_owner_user_id, request_id
    )
    campaign_owner_user_name = campaign_owner_user_data["user_name"]
    campaign_owner_email_id = campaign_owner_user_data["user_email"]
    campaign_name = data["campaign_name"]

    logger.info(
        f"Sending email to the campaign owner about new user signing up for premarketing"
    )

    email_task = asyncio.create_task(
        email_brevo_service.handle_premarketing_signup_email(
            signee_user_name,
            campaign_name,
            campaign_owner_email_id,
            campaign_owner_user_name,
        )
    )
    verb = getstream_verb.getstream_your_campaign_got_premarket_signee_verb
    notification_data = return_your_campaign_got_premarket_signee(
        campaign_name, signee_user_name
    )

    notification_task = asyncio.create_task(
        admin_panel_service.trigger_adding_notification_to_user_feed(
            campaign_owner_user_id, verb, notification_data
        )
    )

    (
        email_sent_response,
        pre_marketing_signees_notification_response,
    ) = await asyncio.gather(
        email_task,
        notification_task,
        return_exceptions=True,
    )

    return {
        "email_response": email_sent_response,
        "pre_marketing_signees_in_app_response": pre_marketing_signees_notification_response,
    }


@router.post("/notificaition/buyer/purchase-successful", status_code=201)
async def send_notificaiton_purchase_successful(
    request: Request, data: buyer_purchase_complete.BuyerPurchaseCompleted
):
    data = data.dict()
    product_bought_name = data["product_bought_name"]
    order_details = data["order_details"]
    buyer_user_id = request.state.user_id
    request_id = request.state.x_request_id
    buyer_data = await get_info_service.get_user_data(buyer_user_id, request_id)
    buyer_user_name = buyer_data["user_name"]
    buyer_email = buyer_data["user_email"]

    email_task = asyncio.create_task(
        email_brevo_service.handle_email_to_buyer_purchase_successful(
            buyer_user_name, buyer_email, product_bought_name, order_details
        )
    )

    verb = getstream_verb.getstream_your_purchase_completed_verb
    notification_data = return_your_purchase_completed()

    notification_task = asyncio.create_task(
        admin_panel_service.trigger_adding_notification_to_user_feed(
            buyer_user_id, verb, notification_data
        )
    )

    (
        email_sent_response,
        adding_activity_response_for_buyer,
    ) = await asyncio.gather(email_task, notification_task, return_exceptions=True)

    return {
        "email_response: ": email_sent_response,
        "getstream_activity_response_owner: ": adding_activity_response_for_buyer,
    }


@router.post("/notification/owner/marketplace-purchase", status_code=201)
async def send_email_marketplace_purchase(
    data: marketplace_purchase_model.MarketplacePurchase, request: Request
):
    request_id = request.state.x_request_id
    data = data.dict()
    model_id = data["model_id"]
    model_name = data["model_name"]
    buyer_number = data["buyer_number"]
    model_owner_user_id = data["model_owner_user_id"]
    model_owner_user_data = await get_info_service.get_user_data(
        model_owner_user_id, request_id
    )
    model_owner_user_name = model_owner_user_data["user_name"]
    model_owner_email_id = model_owner_user_data["user_email"]
    buyer_user_id = request.state.user_id
    buyer_user_data = await get_info_service.get_user_data(buyer_user_id, request_id)
    buyer_user_name = buyer_user_data["user_name"]
    logger.info(f"Sending email to the model owner about new purchase of their model")

    email_task = asyncio.create_task(
        email_brevo_service.handle_marketplace_purchase_email(
            model_owner_user_name,
            buyer_user_name,
            model_name,
            model_owner_email_id,
            buyer_number,
        )
    )

    verb = getstream_verb.getstream_you_model_bought_verb
    notification_data = return_marketplace_purchase(buyer_user_name, model_name)

    notification_task = asyncio.create_task(
        await admin_panel_service.trigger_adding_notification_to_user_feed(
            model_owner_user_id, verb, notification_data
        )
    )

    (
        email_sent_response,
        adding_activity_response_for_owner,
    ) = await asyncio.gather(email_task, notification_task, return_exceptions=True)

    return {
        "email_response: ": email_sent_response,
        "getstream_activity_response_owner: ": adding_activity_response_for_owner,
    }


@router.post("/notification/milestone-reached", status_code=201)
async def send_email_milestone_reached(
    data: milestone_reached_model.MilestoneReached, request: Request
):
    request_id = request.state.x_request_id
    data = data.dict()
    Milestone_reached_date=data["Milestone_reached_date"]
    campaign_owner_user_id = data["campaign_owner_user_id"]
    user_data = await get_info_service.get_user_data(campaign_owner_user_id, request_id)
    campaign_owner_user_name = user_data["user_name"]
    user_email = user_data["user_email"]
    milestone_name = data["milestone_name"]
    campaign_name = data["campaign_name"]
    milestone_rewards = data["milestone_rewards"]
    backers_user_ids_list = data["backers_user_ids_list"]
    backers_data = await get_info_service.get_list_users_data(
        backers_user_ids_list, request_id
    )
    backers_email_list=[]
    backers_user_name_list=[]
    for backer_data in backers_data:
        backers_email_list.append(backer_data["email"])
        backers_user_name_list.append(backer_data["username"])

    logger.info(
        f"Sending email to the campaign owner about new milestone being reached"
    )

    owner_verb = getstream_verb.getstream_milestone_reached_verb_for_owner

    backers_verb = getstream_verb.getstream_milestone_reached_verb_for_backers

    (
        notification_data_owner,
        notification_data_users,
    ) = return_notification_data_milestone_reached(campaign_name)

    email_task = asyncio.create_task(
        email_brevo_service.handle_milestone_reached_email_to_owner_and_backers(
            campaign_owner_user_name,
            user_email,
            milestone_name,
            backers_email_list,
            campaign_name,
            Milestone_reached_date,
            milestone_rewards,
            backers_user_name_list
        )
    )
    owner_notification_task = asyncio.create_task(
        admin_panel_service.trigger_adding_notification_to_user_feed(
            campaign_owner_user_id, owner_verb, notification_data_owner
        )
    )

    users_notification_task = asyncio.create_task(
        admin_panel_service.trigger_adding_notification_to_multiple_users_feed(
            campaign_owner_user_name, backers_verb, notification_data_users, backers_user_ids_list
        )
    )

    (
        email_sent_response,
        adding_activity_response_for_owner,
        adding_activity_response_backers,
    ) = await asyncio.gather(
        email_task,
        owner_notification_task,
        users_notification_task,
        return_exceptions=True,
    )

    return {
        "email_response: ": email_sent_response,
        "getstream_activity_response_owner: ": adding_activity_response_for_owner,
        "getstream_activity_response_backers: ": adding_activity_response_backers,
    }


@router.post("/notification/early-bird-tier-ending-soon", status_code=201)
async def send_email_early_bird_tier_ending_soon(
    data: early_bird_tier_ending_soon_model.EarlyBirdTierEndingSoon, request: Request
):
    data = data.dict()
    request_id = request.state.x_request_id
    campaign_owner_id = data["campaign_owner_id"]
    campaign_name = data["campaign_name"]
    time_left = data["time_left"]
    user_ids_list = data["user_ids_list"]
    seats_left = data["seats_left"]
    user_data = await get_info_service.get_user_data(campaign_owner_id, request_id)
    campaign_owner_user_name = user_data["user_name"]
    list_users_data = await get_info_service.get_list_users_data(
        user_ids_list, request_id
    )

    users_email_list=[]
    users_name_list=[]
    for user_data in list_users_data:
        users_email_list.append(user_data["email"])
        users_name_list.append(user_data["username"])

    logger.info(f"Sending in-app notification for early bird tier ending soon")

    verb = getstream_verb.getstream_early_bird_tier_verb

    if seats_left is None:
        notification_data = return_early_bird_tier_ending_soon_time_period(
            campaign_name, time_left
        )
    else:
        notification_data = return_early_bird_tier_ending_soon_seats_left(
            campaign_name, seats_left
        )

    logger.info(f"Sending email to the premarket signee about early tier ending soon")
    email_task = asyncio.create_task(
        email_brevo_service.handle_early_bird_tier_ending_soon_email(
            users_email_list, campaign_name, time_left,users_name_list
        )
    )

    notification_task = asyncio.create_task(
        admin_panel_service.trigger_adding_notification_to_multiple_users_feed(
            campaign_owner_user_name, verb, notification_data, user_ids_list
        )
    )

    email_sent_response, adding_activity_response = await asyncio.gather(
        email_task, notification_task, return_exceptions=True
    )
    return {
        "email_response: ": email_sent_response,
        "getstream_activity_response: ": adding_activity_response,
    }


@router.post("/notification/campaign-ending-soon", status_code=201)
async def send_email_campaign_ending_soon(
    data: campaign_ending_soon_model.CampaignEndingSoon, request: Request
):
    request_id = request.state.x_request_id
    data = data.dict()
    time_left = data["time_left"]
    campaign_owner_id = data["campaign_owner_id"]
    user_data = await get_info_service.get_user_data(campaign_owner_id, request_id)
    user_name = user_data["user_name"]
    campaign_name = data["campaign_name"]
    wishlisted_user_ids_list = data["wishlisted_user_ids_list"]
    pre_marketing_signees_user_ids_list = data["wishlisted_user_ids_list"]
    user_followers_user_id_list = await get_info_service.get_users_followers(
        campaign_owner_id, request_id
    )

    user_id_list = []
    user_id_list.extend(wishlisted_user_ids_list)
    user_id_list.extend(pre_marketing_signees_user_ids_list)
    user_id_list.extend(user_followers_user_id_list)

    wishlisted_users_data_list = await get_info_service.get_list_users_data(
        wishlisted_user_ids_list, request_id
    )
    pre_marketing_signees_data_list = await get_info_service.get_list_users_data(
        pre_marketing_signees_user_ids_list, request_id
    )
    follwers_data_list = await get_info_service.get_list_users_data(
        user_followers_user_id_list, request_id
    )

    verb = getstream_verb.getstream_campaign_ending_soon_verb
    notification_data = return_campaign_ending_soon(campaign_name, time_left)

    email_task = asyncio.create_task(
        email_brevo_service.handle_campaign_ending_soon_email(
            wishlisted_users_data_list,
            pre_marketing_signees_data_list,
            follwers_data_list,
            campaign_name,
            time_left,
            user_name,
        )
    )

    notification_task = asyncio.create_task(
        admin_panel_service.trigger_adding_notification_to_multiple_users_feed(
            user_name, verb, notification_data, user_id_list
        )
    )

    email_sent_response, adding_activity_response = await asyncio.gather(
        email_task, notification_task, return_exceptions=True
    )

    return {
        "email_response: ": email_sent_response,
        "getstream_activity_response: ": adding_activity_response,
    }


@router.post("/notification/object-in-draft", status_code=201)
async def send_email_object_lying_in_draft(
    data: object_lying_draft_model.ObjectLyingInDraft, request: Request
):
    request_id = request.state.x_request_id
    data = data.dict()
    user_id = data["user_id"]
    draft_product_item_name = data["draft_product_item_name"]
    draft_product_item_type = data["draft_product_item_type"]
    user_data = await get_info_service.get_user_data(user_id, request_id)
    user_name = user_data["user_name"]
    user_email = user_data["user_email"]
    sent_response = await email_brevo_service.handle_object_lying_in_draft_email(
        user_name, user_email, draft_product_item_name, draft_product_item_type
    )
    return sent_response


@router.post("/notification/backers/model-deletion", status_code=201)
async def send_email_model_deletion_to_backers(
    data: model_deletion_model.ModelDeletion, request: Request
):
    request_id = request.state.x_request_id
    data = data.dict()
    model_name = data["model_name"]
    buyers_user_id_list = data["buyers_user_id_list"]
    buyers_data_list = await get_info_service.get_list_users_data(
        buyers_user_id_list, request_id
    )

    buyers_email_list=[]
    buyers_username_list=[]
    for buyer_data in buyers_data_list:
        buyers_email_list.append(buyer_data["email"])
        buyers_username_list.append(buyer_data["username"])

    logger.info(
        f"Sending email notification for Model being deleted for model: {model_name}"
    )
    sent_response = (
        await email_brevo_service.handle_model_deletion_email_to_backers(
            model_name, buyers_email_list,buyers_username_list
        )
    )
    return sent_response


##TODO: Take the user_admin email id as well
@router.post("/notification/account-deletion-initiated", status_code=201)
async def send_email_account_deletion_initiated(
    data: account_deletion_initiated_model.AccountDeletionInitializerModel,
):
    data = data.dict()
    user_email = data["user_email"]
    user_name = data["user_name"]
    account_deletion_link = data["account_deletion_link"]
    logger.info(
        f"Sending Email to user: {user_email} for account deletion initialization"
    )
    sent_response = (
        await email_brevo_service.handle_account_deletion_initialization_email(
            user_email, user_name, account_deletion_link
        )
    )
    return sent_response


@router.post("/notify-admin", response_model=None, status_code=201)
async def send_email_to_admin(
    data: admin_notificaiton.AdminNotification, request: Request
):
    request_id = request.state.x_request_id
    data = data.dict()
    user_id = data["user_id"]
    admin_email = data["admin_email"]
    user_data = await get_info_service.get_user_data(user_id, request_id)
    user_name = user_data["user_name"]
    # user_email = user_data["user_email"]
    notification_type = data["notification_type"]
    notification_response = email_brevo_service.handle_notifying_admins(
        user_name, admin_email, notification_type
    )
    return notification_response


@router.post("/notification/owner/model-deletion", status_code=201)
async def send_email_model_deletion_owner(
    data: model_deletion_model.ModelDeletionOwner, request: Request
):
    request_id = request.state.x_request_id
    data = data.dict()
    user_id = data["owner_user_id"]
    model_name = data["model_name"]
    deletion_request_date = data["deletion_request_date"]
    final_deletion_date = data["final_deletion_date"]
    user_data = await get_info_service.get_user_data(user_id, request_id)
    user_name = user_data["user_name"]
    user_email = user_data["user_email"]
    logger.info(
        f"Send email to model owner: {user_id} for model-deletion-cool-off ending for model: {model_name}"
    )
    sent_response = (
        await email_brevo_service.handle_model_deletion_cool_off_period_email(
            user_name,
            user_email,
            model_name,
            deletion_request_date,
            final_deletion_date,
        )
    )
    return sent_response


@router.post("/notification/account-deletion-cool-off-period", status_code=201)
async def send_account_deletion_cool_off_period_email(
    data: account_deletion_cool_off_period_model.AccountDeletionCoolOffPeriod,
):
    user_name = data["user_name"]
    user_email = data["user_email"]
    deletion_request_date = data["deletion_request_date"]
    final_deletion_date = data["final_deletion_date"]
    logger.info(f"send_account_deletion_cool_off_period_email to user: {user_name}")
    sent_response = (
        await email_brevo_service.handle_account_deletion_cool_off_period_email(
            user_name, user_email, deletion_request_date, final_deletion_date
        )
    )
    return sent_response


# @router.post("/notification/email_verification", status_code=201)
# async def send_email_for_user_email_verification(
#     request: Request, data: new_user_email_verification_model.NewUserEmailVerification
# ):
#     request_id = request.state.x_request_id
#     data = data.dict()
#     user_id = data["user_id"]
#     user_email = data["user_email"]
#     token = data["token"]
#     await email_brevo_service.authenticate_request(
#         request, expected_caller="auth-service", expected_user_id=user_id
#     )
#     verificationLink = data["verificationLink"]
#     verificationText = data["verificationText"]
#     user_data = await get_info_service.get_user_data(user_id, request_id)
#     user_name = user_data["user_name"]
#     email_sent_response = (
#         email_brevo_service.handle_email_for_user_signup_email_verification(
#             user_name, user_email, token, verificationLink, verificationText
#         )
#     )
#     return email_sent_response


@router.post("/notification/change-email/verification/new-email", status_code=201)
async def send_email_for_email_change_verification_to_new_email(
    request: Request, data: email_change_verification_model.NewEmailVerification
):
    request_id = request.state.x_request_id
    data = data.dict()
    user_id = data["user_id"]
    user_email = data["user_email"]
    token = data["token"]
    api_domain = config_yaml.auth["api_domain"]
    new_email_verification_api_link = (
        f"{api_domain}/verify-email/{user_id}?token={token}"
    )
    user_data = await get_info_service.get_user_data(user_id, request_id)
    user_name = user_data["user_name"]
    sent_response = (
        await email_brevo_service.handle_email_for_email_change_verification(
            user_name, user_email, new_email_verification_api_link
        )
    )
    return sent_response

@router.post("/notification/change-email/acknowledgement",status_code=201)
async def send_email_new_email_change_success(data:new_email_change_success.NewEmailChangeSuccess, request:Request):
    data = data.dict()
    old_email=data["old_email"]
    new_email=data["new_email"]
    user_id=data["user_id"]
    request_id = request.state.x_request_id 
    user_data = await get_info_service.get_user_data(user_id, request_id)
    user_name = user_data["user_name"]
    sent_response = await email_brevo_service.handle_email_change_acknowledgement(user_name, new_email,old_email)
    return sent_response


@router.post("/notification/user/new-device-login", status_code=201)
async def send_email_for_unkown_device_login(
    data: unkown_device_login_model.UnkownDeviceLogin, request: Request
):
    request_id = request.state.x_request_id
    data = data.dict()
    user_id = data["user_id"]
    device_fingerprint_cookie = data["device_fingerprint_cookie"]
    email_info = data["email_info"]
    user_data = await get_info_service.get_user_data(user_id, request_id)
    user_name = user_data["user_name"]
    api_domain = config_yaml.auth["api_domain"]
    add_to_known_device_api_link = (
        f"{api_domain}/add-to-known-device-list/{user_id}?device={device_fingerprint_cookie}"
    )
    email_repsonse = await email_brevo_service.handle_unkown_device_login_email(
        user_name, email_info, add_to_known_device_api_link
    )
    return email_repsonse


@router.post("/notificaton/user/abondoned_cart", status_code=201)
async def send_email_to_user_for_their_abondoned_cart(
    data: abondoned_cart_model.AbononedCart, request: Request
):
    request_id = request.state.x_request_id
    data = data.dict()
    user_id = data["user_id"]
    user_data = await get_info_service.get_user_data(user_id, request_id)
    user_name = user_data["user_name"]
    user_email = user_data["user_email"]
    item_details = data["item_details"]
    last_updated_date = data["last_updated_date"]
    email_sent_response = await email_brevo_service.handle_email_abondoned_cart(
        user_name, user_email, item_details, last_updated_date
    )
    return email_sent_response


@router.post("/notification/user/campaign-ended", status_code=201)
async def send_notification_your_campaign_ended(
    data: your_campaign_ended_model.YourCampaignEnded, request: Request
):
    request_id = request.state.x_request_id
    data = data.dict()
    campaign_owner_id = data["campaign_owner_id"]
    campaign_name = data["campaign_name"]
    user_data = await get_info_service.get_user_data(campaign_owner_id, request_id)
    user_name = user_data["user_name"]
    user_email = user_data["user_email"]
    backer_numbers = data["backer_numbers"]
    funds_raised_amount = data["funds_raised_amount"]
    email_task = asyncio.create_task(
        email_brevo_service.handle_email_your_campaign_ended(
            user_email, user_name, backer_numbers, funds_raised_amount
        )
    )

    verb = getstream_verb.getstream_your_campaign_ended_verb
    notification_data = return_your_campaign_ended(campaign_name)

    notification_task = asyncio.create_task(
        admin_panel_service.trigger_adding_notification_to_user_feed(
            campaign_owner_id, verb, notification_data
        )
    )
    email_sent_response, adding_activity_response = await asyncio.gather(
        email_task, notification_task, return_exceptions=True
    )

    return {
        "email_response: ": email_sent_response,
        "getstream_activity_response: ": adding_activity_response,
    }


@router.post("/notification/reset-password", status_code=201)
async def send_email_forgot_password(data: forgot_password_model.ForgotPasswordModel, request:Request):
    request_id = request.state.x_request_id
    data = data.dict()
    user_email = data["user_email"]
    user_id = data["user_id"]
    user_data = await get_info_service.get_user_data(user_id,request_id)
    user_name = user_data["user_name"]
    token = data["token"]
    api_domain = config_yaml.auth["api_domain"]
    website_domain = read_yaml.WEBSITE_DOMAIN
    password_reset_link = f"{website_domain}/reset-password?userId={user_id}&token={token}"
    email_sent_response = await email_brevo_service.handle_email_forgot_pasword(
        user_email, user_name, password_reset_link
    )
    return email_sent_response


@router.post("/notification/reset-password/acknowledgement", status_code=201)
async def send_email_forgot_password_cahanged(
    data: forgot_password_changed_model.ForgotPasswordCahngedModel,request:Request
):
    request_id = request.state.x_request_id
    data = data.dict()
    user_id = data["user_id"]
    user_data = await get_info_service.get_user_data(user_id,request_id)
    user_name = user_data["user_name"]
    user_email = user_data["user_email"]
    email_sent_response = (
        await email_brevo_service.handle_email_forgot_password_changed(
            user_email, user_name
        )
    )
    return email_sent_response


@router.post("/notification/change-password/acknowledgement", status_code=201)
async def send_email_password_changed_after_user_request(
    data: password_changed_user_request_model.PasswordChangedUSerRequest,request:Request
):
    data = data.dict()
    request_id = request.state.x_request_id
    user_id = data["user_id"]
    user_data = await get_info_service.get_user_data(user_id,request_id)
    user_email = user_data["user_email"]
    user_name = user_data["user_name"]
    email_sent_response = (
        await email_brevo_service.handle_email_password_changed_user_request(
            user_email, user_name
        )
    )
    return email_sent_response


@router.post("/notification/user/3DA-request", status_code=201)
async def send_email_user_requests_3DA(data: user_requests_3da_model.UserRequests3DA):
    data = data.dict()
    user_name = data["user_name"]
    user_email = data["user_email"]
    email_sent_response = (
        await email_brevo_service.handle_email_user_requested_3da_role(
            user_name, user_email
        )
    )
    return email_sent_response


@router.post("/notification/user/3DA-role-granted", status_code=201)
async def send_email_user_granted_3da_role(
    data: user_requests_3da_model.UserRequests3DA,
):
    data = data.dict()
    user_name = data["user_name"]
    user_email = data["user_email"]
    email_sent_response = (
        await email_brevo_service.handle_email_user_granted_3da_role(
            user_name, user_email
        )
    )
    return email_sent_response


@router.post("/notification/user/3DA-role-declined", status_code=201)
async def send_email_user_granted_3da_role(
    data: user_requests_3da_model.UserRequests3DA,
):
    data = data.dict()
    user_name = data["user_name"]
    user_email = data["user_email"]
    email_sent_response = (
        await email_brevo_service.handle_email_user_granted_3da_role(
            user_name, user_email
        )
    )
    return email_sent_response


@router.post("/contact", status_code=201)
async def add_contact_to_list(
    request: Request, data: brevo_contact_list_model.ContactList
):
    data = data.dict()
    email_id = data["email_id"]
    list_names = data["list_names"]
    logger.info(f"Adding new email: {email_id} to lists: {list_names}")
    contact_update_list = await email_brevo_service.handle_adding_contacts_to_list(
        email_id, list_names
    )
    return contact_update_list


@router.delete("/delete-contact")
async def remove_contact_from_list(data: brevo_contact_list_model.ContactList):
    data = data.dict()
    email_id = data["email_id"]
    list_names = data["list_names"]
    logger.info(f"Removing email: {email_id} from lists: {list_names}")
    contact_list_update = (
        await email_brevo_service.handle_removing_contacts_from_list(
            email_id, list_names
        )
    )
    return contact_list_update
