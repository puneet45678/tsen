from transitions import Machine
from fastapi import APIRouter, HTTPException, status
from campaign_db import model_actions, campaign_actions
from fastapi import Request
from models.model import (
    Visibility,
    StateFor,
    TriggerType
)
from services import campaign_new_service,notification_calls
from services.roles_permissions_services import (
    check_is_owner_campaign,
    check_permission_claim
)
class Campaign(object):
    def __init__(self, state="Draft", modelId=None):
        self.state = state
        self.modelId = modelId

    def on_error(self, exception, current_state, target_state):
        return f"Transition error: Cannot move from '{current_state.identifier}' to '{target_state.identifier}'."


states = [
    "Draft",
    "Discarded",
    "Submitted",
    "In_Review",
    "Approved",
    "Pre_Launched",
    "Pre_Maturely_Ended"
    "Live",
    "Ended",
    "Rejected",
]

transitions = [
    {"trigger": "submit", "source": "Draft", "dest": "Submitted"},
    {"trigger": "discard", "source": "Draft", "dest": "Discarded"},
    {"trigger": "reject", "source": "In_Review", "dest": "Rejected"},
    #TODO implement edit state 
    {"trigger": "edit", "source": "Rejected", "dest": "Draft"},
    {"trigger": "to_review", "source": "Submitted", "dest": "In_Review"},
    {"trigger": "approve", "source": "In_Review", "dest": "Approved"},
    # TODO: check for date
    #{"trigger": "direct_launch", "source": "Approved", "dest": "Live"},
    # {"trigger": "pre_launch", "source": "Approved", "dest": "Pre_Launched"},
    # {"trigger": "launch", "source": "Pre_Launched", "dest": "Live"},
    # TODO: check for end date before ending
    # {"trigger": "end", "source": "Live", "dest": "Ended"},
    # {"trigger": "save_as_draft", "source": "*", "dest": "Draft"},
    {"trigger": "admin_end", "source": "Live", "dest": "Pre_Maturely_Ended"},
    # {"trigger": "admin_reject", "source": "*", "dest": "Rejected"},
]


def get_state_machine(initial_state, modelId):
    campaign = Campaign(state=initial_state, modelId=modelId)
    machine = Machine(
        model=campaign, states=states, transitions=transitions, initial=campaign.state
    )
    return campaign


router = APIRouter(tags=["campaignStates"], prefix="/api/v1")


@router.post("/campaign/{campaignId}/submit")
async def submit_campaign(request: Request, campaignId: str):
    userId = request.state.user_id
    await check_is_owner_campaign(userId , campaignId)
    state = campaign_actions.get_approval_status(campaignId)
    campaign = get_state_machine(state, campaignId)
    state_for = StateFor.CAMPAIGN.value
    trigger_type = TriggerType.APPROVAL.value
    #TODO add this comment is constants 
    comment  = f"CAMPAIGN IS SUBMITTED BY THE USER"
    try:
        campaign.submit()
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    model_actions.add_state_change_to_db(
        campaignId,state, campaign.state, userId, comment, state_for, trigger_type,
    )
    campaign_actions.update_approval_status(campaignId, campaign.state)
    return {"state": campaign.state}


@router.post("/campaign/{campaignId}/edit")
async def edit_campaign(request: Request, campaignId: str):
    userId = request.state.user_id
    await check_is_owner_campaign(userId , campaignId)
    state = campaign_actions.get_approval_status(campaignId)
    campaign = get_state_machine(state, campaignId)
    state_for = StateFor.CAMPAIGN.value
    trigger_type = TriggerType.APPROVAL.value
    comment = "USER IS EDITING THE REJECTED CAMPAIGN"
    try:
        campaign.edit()
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    model_actions.add_state_change_to_db(
        campaignId,state, campaign.state, userId, comment, state_for, trigger_type,
    )
    campaign_actions.update_approval_status(campaignId, campaign.state)
    return {"state": campaign.state}


@router.post("/admin/campaign/{campaignId}/review")
async def admin_to_review(request: Request, campaignId: str, comment: str):
    session = request.state.session
    await check_permission_claim(session,"Admin_ApproveOrRejectCampaign")
    state = campaign_actions.get_approval_status(campaignId)
    userId = request.state.user_id
    campaign = get_state_machine(state, campaignId)
    state_for = StateFor.CAMPAIGN.value
    trigger_type = TriggerType.APPROVAL.value
    try:
        campaign.to_review()
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    model_actions.add_state_change_to_db(
        campaignId,state, campaign.state, userId, comment, state_for, trigger_type,
    )
    campaign_actions.update_approval_status(campaignId, campaign.state)
    return {"message": f"campaign taken In-Review succesfully by admin",
            "status": campaign.state}

@router.post("/campaign/{campaignId}/discard")
async def discard_campaign(request: Request, campaignId: str, comment: str):
    userId = request.state.user_id
    await check_is_owner_campaign(userId , campaignId)
    state = campaign_actions.get_approval_status(campaignId)
    campaign = get_state_machine(state, campaignId)
    state_for = StateFor.CAMPAIGN.value
    trigger_type = TriggerType.APPROVAL.value
    try:
        campaign.discard()
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    
    model_actions.add_state_change_to_db(
        campaignId,state, campaign.state, userId, comment, state_for, trigger_type,
    )
    campaign_actions.update_approval_status(campaignId, campaign.state)
    return {"message" : "campaign successfully discarded"}


@router.post("/admin/campaign/{campaignId}/reject")
async def admin_reject_campaign(request: Request, campaignId: str, comment: str):

    session = request.state.session
    await check_permission_claim(session , "Admin_ApproveOrRejectCampaign")
    state = campaign_actions.get_approval_status(campaignId)
    userId = request.state.user_id
    campaign = get_state_machine(state, campaignId)
    state_for = StateFor.CAMPAIGN.value
    trigger_type = TriggerType.APPROVAL.value
    try:
        campaign.reject()
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    model_actions.add_state_change_to_db(
        campaignId,state, campaign.state, userId, comment, state_for, trigger_type,
    )
    campaign_actions.update_approval_status(campaignId, campaign.state)
    await notification_calls.notify_send_email_admin_reject_campaign(request,comment,campaignId)
    return {"message": f"campaign rejected by admmin",
            "state" : campaign.state}


# , comment: str
@router.post("/admin/campaign/{campaignId}/approve")
async def admin_approve_campaign(request: Request, comment: str, campaignId: str):
    
    session = request.state.session
    await check_permission_claim(session , "Admin_ApproveOrRejectCampaign")
    state = campaign_actions.get_approval_status(campaignId)
    userId = request.state.user_id
    campaign = get_state_machine(state, campaignId)
    state_for = StateFor.CAMPAIGN.value
    trigger_type = TriggerType.APPROVAL.value
    try:
        campaign.approve()
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    model_actions.add_state_change_to_db(
        campaignId,state, campaign.state, userId, comment, state_for, trigger_type,
    )
    campaign_actions.update_approval_status(campaignId, campaign.state)
    await notification_calls.notify_send_email_admin_approve_campaign(request,comment,campaignId)
    return {"message": f"campaign approved by admin",
            "state": campaign.state}

@router.post("admin/campaign/{campaignId}/end")
async def admin_end_campaign(
    request: Request,
    campaignId: str,
    comment: str,
):
    session = request.state.session
    await check_permission_claim(session,"Admin_EndReportedCampaign")
    state = campaign_actions.get_approval_status(campaignId)
    userId = request.state.user_id
    campaign = get_state_machine(state, campaignId)
    state_for = StateFor.CAMPAIGN.value
    trigger_type = TriggerType.DELETION.value
    try:
        campaign.admin_end()
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    model_actions.add_state_change_to_db(
        campaignId,state, campaign.state, userId, comment, state_for, trigger_type,
    )
    campaign_actions.update_approval_status_and_ended_date(
        campaignId, campaign.state
    )
    campaign_actions.set_admin_modified(True, campaignId)
    return {f"status": f"campaign ended by admin-{userId}"}


