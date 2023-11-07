import requests
from fastapi import HTTPException, status
from utils import utils
from datetime import datetime
from config import read_yaml
from logger.logging import getLogger
from services import campaign_new_service
from models import notification_verbs
from services import m2m_calls
from campaign_db import model_actions,campaign_actions
from datetime import timedelta,datetime
logger = getLogger(__name__)


#----------------------------------------- NOTIFICATIONS FOR MODELS --------------------------------------------
async def get_mark_models_deletion_and_send_notifications(request):
    try:
        models_to_notify = model_actions.get_models_marked_for_deletion_three_days_ago()
        for model in models_to_notify:
            user_id = model["userId"]
            buyer_user_id = model["buyers"]
            model_name = model["modelName"]
            deletion_request_date = model["updatedAt"]
            final_deletion_date = deletion_request_date + timedelta(days=35)

            await m2m_calls.send_email_notification_for_model_deletion_to_backers(request,
                                                                        buyer_user_id,
                                                                        model_name,
                                                                        str(model["_id"]),
                                                                        str(deletion_request_date),
                                                                        str(final_deletion_date))
            
            await m2m_calls.send_email_notification_for_model_deletion_to_owners(request,
                                                                        user_id,
                                                                        model_name,
                                                                        str(model["_id"]),
                                                                        str(deletion_request_date),
                                                                        str(final_deletion_date))
            
        logger.debug( f"{len(models_to_notify)} notifications sent.")

    except HTTPException as e:
        logger.error(e.detail)
        raise e
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    
    
async def notify_send_email_admin_approve_model(request,modelId):
    logger.info("Sending model approved by admin email")
    try:
        model = model_actions.get_model(modelId)
        user_id = model["userId"]
        model_name = model["modelName"]
        await m2m_calls.send_email_admin_approve_model(request,user_id,model_name)
        logger.debug({"model approved by admin email send"})
    
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


async def notify_send_email_admin_reject_model(request,modelId):
    try:
        model = model_actions.get_model(modelId)
        user_id = model["userId"]
        model_name = model["modelName"]
        await m2m_calls.send_email_admin_reject_model(request,user_id,model_name)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    

async def in_app_model_live(request,modelId):
    try:
        model = model_actions.get_model(modelId)
        user_id = model["userId"]
        response_type = "list"
        user_data = await m2m_calls.get_user_data(request,user_id)
        owner_user_name = user_data["username"]
        follower_list = await m2m_calls.get_user_follower_list(request,user_id,response_type)
        notification_data = f"{owner_user_name} posted a new Model"
        verb = notification_verbs.VerbEnum.artist_you_follow_published_model.value
        if follower_list:
            await m2m_calls.send_in_app_model_live(request,follower_list,notification_data,owner_user_name,verb)
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


async def in_app_model_comment(request,modelId):
    try:
        model = model_actions.get_model(modelId)
        user_id = model["userId"]
        verb = notification_verbs.VerbEnum.commented_on_your_model.value
        await m2m_calls.send_in_app_model_comment(request,user_id,verb)

    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    

async def in_app_model_like(request,modelId):
    try:
        model = model_actions.get_model(modelId)
        modelname = model["modelName"]
        user_data = await m2m_calls.get_user_data(request,request.state.user_id)
        notification_data = {
            "model_name": modelname,
            "user_data" : user_data
        }
        user_id = model["userId"]
        verb = notification_verbs.VerbEnum.liked_your_model.value
        await m2m_calls.send_in_app_model_like(request,user_id,verb,notification_data)

    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="unable to send in app notification for model like")
    
async def in_app_model_purchase(request,modelId):
    try:
        model = model_actions.get_model(modelId)
        user_id = model["userId"]
        verb = notification_verbs.VerbEnum.bought_your_model.value
        await m2m_calls.send_in_app_model_purchase(request,user_id,verb)

    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    

#----------------------------------------- NOTIFICATIONS FOR CAMPAIGNS --------------------------------------------
async def notify_about_campaign_endings(request):
    try:
        logger.info("Checking for campaigns to send notifications...")
        campaigns_to_notify = campaign_actions.get_campaigns_ending_in_three_days()

        for campaign in campaigns_to_notify:
            userId = campaign["userId"]
            time_left = str(campaign["basics"]["endingOn"]-datetime.utcnow())
            campaign_name = campaign["basics"]["campaignTitle"]
            pre_marketing_signees = campaign["premarketing"]["premarketingSignees"]
            wishlisted_user_ids = campaign["wishlistedBy"]
            await m2m_calls.send_campaign_ending_notification(request,userId,campaign_name,time_left,pre_marketing_signees,wishlisted_user_ids)

        logger.debug(f"{len(campaigns_to_notify)} notifications sent.")

    except Exception as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


async def notify_draft_state_campaigns(request):
    try:
        logger.info("Checking for campaigns to send notifications...")
        campaigns_to_notify = campaign_actions.get_draft_state_campaigns()

        for campaign in campaigns_to_notify:
            userId = campaign["userId"]
            campaign_name = campaign["basics"]["campaignTitle"]
            await m2m_calls.send_campaign_draft_state_notification(request,userId, campaign_name)

        logger.debug(f"{len(campaigns_to_notify)} notifications sent.")

    except Exception as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

async def notify_about_earlybird_endings(request):
    try:
        logger.info("Checking for EarlyBird tiers to send notifications...")

        ending_earlybird_tiers = campaign_actions.get_earlybird_tiers_ending_in_three_days()

        for userId, campaign_id, time_left in ending_earlybird_tiers:
            await m2m_calls.send_earlybird_ending_notification(request,userId, campaign_id, time_left)

        return f"{len(ending_earlybird_tiers)} notifications sent."

    except Exception as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

async def update_campaigns_status_pre_launched_to_live(request):
    try:
        logger.info("Checking for prelaunced campaign to send notifications...")

        campaigns_to_notify = campaign_actions.update_pre_launched_to_live()
        for campaign in campaigns_to_notify:
            userId = campaign["userId"]
            camapign_name = campaign["basics"]["campaignTitle"]
            pre_marketing_signees = campaign["premarketing"]["premarketingSignees"]
            campaign_description = campaign["basics"]["shortDescription"]

            await m2m_calls.send_campaign_live_notification(request,userId, camapign_name,pre_marketing_signees,campaign_description)

        logger.debug( f"{len(campaigns_to_notify)} notifications sent.")

    except Exception as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

async def notify_send_email_admin_approve_campaign(request,comment,campaignId):
    try:
        campaign,user_id = campaign_actions.get_campaign_from_db(campaignId)
        campaign_name = campaign["basics"]["campaignTitle"]
        action = "approve"
        await m2m_calls.send_email_admin_action_campaign(request,user_id,campaign_name,action,comment)
        return {"approved by admin  email send"}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

async def notify_send_email_admin_reject_campaign(request,comment,campaignId):
    try:
        campaign,user_id = campaign_actions.get_campaign_from_db(campaignId)
        campaign_name = campaign["basics"]["campaignTitle"]
        action = "reject"
        await m2m_calls.send_email_admin_action_campaign(request,user_id,campaign_name,action,comment)
        return {"rejected by admin email send"}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

async def in_app_campaign_comment(request,campaignId):
    tuple = campaign_actions.get_campaign_from_db(campaignId)
    user_id_campaign_owner = tuple[1]
    verb = notification_verbs.VerbEnum.commented_on_your_campaign.value
    response = await m2m_calls.send_in_app_campaign_comment_notification(request,user_id_campaign_owner,verb)
    return response

async def in_app_campaign_like(request,campignId):
    tuple = campaign_actions.get_campaign_from_db(campignId)
    user_id_campaign_owner = tuple[1]
    verb = notification_verbs.VerbEnum.liked_your_campaign.value
    response = await m2m_calls.send_in_app_campaign_like_notification(request,user_id_campaign_owner,verb)
    return response