from transitions import Machine, MachineError
from services import modelService,uploads,notification_calls
from campaign_db import model_actions
from fastapi import (
    HTTPException,
    APIRouter,
    Request,
    BackgroundTasks,
    HTTPException,
    APIRouter,

)
from models.model import (
    TriggerType,
    StateFor,
    Visibility
)
import datetime
router = APIRouter(tags=["model States"], prefix="/api/v1")

from services.roles_permissions_services import (
    check_is_owner_model,
    check_permission_claim
)

from logger.logging import getLogger
logger = getLogger(__name__)
class Model(object):
    def __init__(self, state="Draft", modelId=None):
        self.state = state
        self.modelId = modelId
        self.deletion_marked_date = None
        self.part_of_live_campaign = False
        self.has_backers = False
        self.machine = Machine(
            model=self, states=states, transitions=transitions, initial=self.state
        )

    def on_cancel_error(self):
        return "Transition error: Campaign is either in 'Approved' or 'Live' state and cannot be cancelled."

    def set_deletion_marked_date(self):
        last_updated_date = model_actions.get_updated_time(self.modelId)
        logger.debug(f"Last updated date for model {self.modelId} is {last_updated_date}")
        self.deletion_marked_date = last_updated_date
        if last_updated_date:
            return True
        else:
            return False

    def within_five_days(self):
        return (datetime.datetime.utcnow() - self.deletion_marked_date).days <= 5

    def after_thirty_days(self):
        return (datetime.datetime.utcnow() - self.deletion_marked_date).days > 30

    def deleting(self,state):
        self.part_of_live_campaign = model_actions.is_part_of_live_campaign(self.modelId)
        self.has_backers = (
            False if not self.modelId else bool(model_actions.has_buyers(self.modelId))
        )

        if self.part_of_live_campaign:
            raise Exception("Cannot delete model. It is part of a live campaign.")
        elif not self.has_backers:
            try:
                self.trigger(f"delete_{state}")
                return {"message": "Model is deleted succesfully"}

            except MachineError:
                raise Exception("Transition to 'delete' failed.")
        else:
            try:
                self.trigger(f"mark_for_deletion_{state}")

                return {
                    "message": "We notified the buyers!!!!!!! this will be deleted in 30 days !!!!! changed your mind revert it with in 5 days your time starts now !!!!"
                }

            except MachineError:
                raise Exception("Transition to 'marked_for_deletion' failed.")


states = [
    "Draft",
    "Submitted",
    "In_Review",
    "Approved",
    "Live",
    "Discarded",
    "Marked_For_Deletion",
    "Deleted",
    "Ready_For_Deletion",
    "Rejected",
]

transitions = [
    {"trigger": "submit", "source": "Draft", "dest": "Submitted"},
    {"trigger": "in_review", "source": "Submitted", "dest": "In_Review"},
    {"trigger": "discard", "source": "Draft", "dest": "Discarded"},
    {"trigger": "reject", "source": "In_Review", "dest": "Rejected"},
    {"trigger": "edit", "source": "Rejected", "dest": "Draft"},
    {"trigger": "approve", "source": "In_Review", "dest": "Approved"},
    {"trigger": "publish", "source": "In_Review", "dest": "Live"},
    {"trigger": "delete_Approved", "source": "Approved", "dest": "Deleted"},
    {"trigger": "delete_Live", "source": "Live", "dest": "Deleted"},
    {
        "trigger": "mark_for_deletion_Approved",
        "source": "Approved",
        "dest": "Marked_For_Deletion",
        "after": "set_deletion_marked_date",
    },
    {
        "trigger": "mark_for_deletion_Live",
        "source": "Live",
        "dest": "Marked_For_Deletion",
        "after": "set_deletion_marked_date",
    },
    {
        "trigger": "ready_for_deletion",
        "source": "Marked_For_Deletion",
        "dest": "Ready_for_deletion",
    },

    {
        "trigger": "revert_to_Approved",
        "source": "Marked_For_Deletion",
        "dest": "Approved",
        "conditions": ["set_deletion_marked_date","within_five_days"],

    },
    {
        "trigger": "revert_to_Live",
        "source": "Marked_For_Deletion",
        "dest": "Live",
        "conditions": ["set_deletion_marked_date","within_five_days"],
    },
    {"trigger": "admin_delete", "source": "*", "dest": "Deleted"},
]


def get_state_machine(initial_state, modelId):
    model = Model(state=initial_state, modelId=modelId)
    machine = Machine(
        model=model, states=states, transitions=transitions, initial=model.state
    )
    return model

@router.post("/model/{modelId}/discard")
async def discard_model(request: Request, modelId: str, comment: str):
    userId = request.state.user_id
    await check_is_owner_model(userId , modelId)
    state = model_actions.get_approval_status(modelId)
    model = get_state_machine(state, modelId)
    state_for = StateFor.MODEL.value
    trigger_type = TriggerType.APPROVAL.value
    try:
        model.discard()
        model_actions.add_state_change_to_db(
            modelId,state, model.state, userId, comment, state_for, trigger_type,
        )
        model_actions.update_approval_status(modelId, model.state)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    return {"status": "model is discarded"}


@router.post("/admin/model/{modelId}/reject")
async def admin_reject_model(request: Request, modelId: str, comment: str,background_tasks: BackgroundTasks):
    session = request.state.session
    await check_permission_claim(session,"Admin_ApproveOrRejectSubmittedModel")
    state = model_actions.get_approval_status(modelId)
    userId = request.state.user_id
    model = get_state_machine(state, modelId)
    state_for = StateFor.MODEL.value
    trigger_type = TriggerType.APPROVAL.value
    try:
        model.reject()
        model_actions.add_state_change_to_db(
            modelId,state, model.state, userId, comment, state_for, trigger_type,
        )
        model_actions.update_approval_status(modelId, model.state)
        # await notification_calls.notify_send_email_admin_reject_model(request,modelId)
        background_tasks.add_task(notification_calls.notify_send_email_admin_reject_model,request,modelId)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    
    return {"status": f"modelrejected by admin - {userId}"}

@router.post("/model/{modelId}/edit")
async def edit_model(request: Request, modelId: str, comment: str):
    userId = request.state.user_id
    await check_is_owner_model(userId , modelId)
    state = model_actions.get_approval_status(modelId)
    model = get_state_machine(state, modelId)
    state_for = StateFor.MODEL.value
    trigger_type = TriggerType.APPROVAL.value
    try:
        model.edit()
        model_actions.add_state_change_to_db(
            modelId,state, model.state, userId, comment, state_for, trigger_type,
        )
        model_actions.update_approval_status(modelId, model.state)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    return {"status": "model is again in draft state"}

# TODO: check if the launch date is today make it live
@router.post("/admin/model/{modelId}/approve")
async def approve_model(request: Request, modelId: str, comment: str, background_tasks: BackgroundTasks):
    session = request.state.session
    # await check_permission_claim(session,"Admin_ApproveOrRejectSubmittedModel")
    state = model_actions.get_approval_status(modelId)
    userId = request.state.user_id
    model = get_state_machine(state, modelId)
    state_for = StateFor.MODEL.value
    trigger_type = TriggerType.APPROVAL.value
    model_visibility = await modelService.get_model_visiblity(modelId)
    try:
        if model_visibility == Visibility.PRIVATE.value:
            model.approve()
        else:
            model.publish()
            background_tasks.add_task(notification_calls.in_app_model_live,request,modelId)
        model_actions.add_state_change_to_db(
            modelId,state, model.state, userId, comment, state_for, trigger_type,
        )
        model_actions.update_approval_status(modelId, model.state)
        background_tasks.add_task(notification_calls.notify_send_email_admin_approve_model,request,modelId)
        # await notification_calls.notify_send_email_admin_approve_model(request,modelId)
        #for unzipping model files on s3
        background_tasks.add_task(uploads.unzipping_file_on_s3,modelId)
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=400, detail=str(e))
    logger.debug(f"model approved by admin - {userId}")
    return {"status": f"model approved by admin - {userId}"}


# TODO: here change the visiblity according to the user input
@router.post("/model/{modelId}/private")
async def make_model_private(request: Request, modelId: str, comment: str):
    userId = request.state.user_id
    await check_is_owner_model(userId , modelId)
    state = model_actions.get_approval_status(modelId)
    model = get_state_machine(state, modelId)
    state_for = StateFor.MODEL.value
    trigger_type = TriggerType.VISIBILITY.value
    try:
        model_actions.set_model_visibility(modelId,Visibility.PRIVATE)
        model_actions.add_state_change_to_db(
            modelId,state, model.state, userId, comment, state_for, trigger_type,
        )
        model_actions.update_approval_status(modelId, model.state)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    return {"status": "modelmade private"}


@router.post("/model/{modelId}/delete")
async def delete_model(request: Request, modelId: str, comment: str):
    userId = request.state.user_id
    await check_is_owner_model(userId , modelId)
    state = model_actions.get_approval_status(modelId)
    model = get_state_machine(state, modelId)
    state_for = StateFor.MODEL.value
    trigger_type = TriggerType.DELETION.value
    try:
        response = model.deleting(state)
        model_actions.add_state_change_to_db(
            modelId,state, model.state, userId, comment, state_for, trigger_type,
        )
        model_actions.update_approval_status(modelId, model.state)
        return response
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/model/{modelId}/revert")
async def revert_model(request: Request, modelId: str, comment: str):
    userId = request.state.user_id
    await check_is_owner_model(userId , modelId)
    if modelService.is_admin_modified(modelId):
        return {f"{modelId} is deleted by the admin you cannot revert"}
    state = model_actions.get_approval_status(modelId)
    model = get_state_machine(state, modelId)
    state_for = StateFor.MODEL.value
    trigger_type = TriggerType.DELETION.value
    model_visibility = await modelService.get_model_visiblity(modelId)
    try:
        if model_visibility == Visibility.PRIVATE.value:
            model.revert_to_Approved()
        else:
            model.revert_to_Live()
        model_actions.add_state_change_to_db(
            modelId,state, model.state, userId, comment, state_for, trigger_type,
        )
        print(f"model state is {model.state}")
        model_actions.update_approval_status(modelId, model.state)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    return {"status": "modelreverted"}


@router.post("/admin/model/{modelId}/delete")
async def admin_delete_model(
    request: Request,
    modelId: str,
    comment: str,
):
    session = request.state.session
    await check_permission_claim(session,"Admin_ApproveOrRejectSubmittedModel")
    state = model_actions.get_approval_status(modelId)
    userId = request.state.user_id
    model = get_state_machine(state, modelId)
    state_for = StateFor.MODEL.value
    trigger_type = TriggerType.DELETION.value
    try:
        model.deleting(state)
        model_actions.add_state_change_to_db(
            modelId,state, model.state, userId, comment, state_for, trigger_type,
        )
        model_actions.update_approval_status(modelId, model.state)
        model_actions.set_admin_modified(modelId,True)

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    return {"status": "model deleted by admin"}



@router.post("/admin/model/{modelId}/visibility")
async def admin_change_model_visibility(request: Request, modelId: str, comment: str,visibility: str):
    session = request.state.session
    await check_permission_claim(session,"Admin_ChangeModelVisibility")
    state =  model_actions.get_approval_status(modelId)
    userId = request.state.user_id
    model = get_state_machine(state, modelId)
    state_for = StateFor.MODEL.value
    trigger_type = TriggerType.VISIBILITY.value
    try:
        model_actions.set_model_visibility(modelId,visibility)
        model_actions.set_admin_modified(modelId,True)
        model_actions.add_state_change_to_db(
            modelId,state, model.state, userId, comment, state_for, trigger_type,
        )
        model_actions.update_approval_status(modelId, model.state)
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=400, detail=str(e))
    logger.debug(f"model visiblity changed by admin - {userId}")
    return {"status": " model visiblity changed by admin"}

@router.post("/admin/model/{modelId}/review")
async def admin_to_review(request: Request, modelId: str, comment: str):
    session = request.state.session
    await check_permission_claim(session,"Admin_ApproveOrRejectSubmittedModel")
    state = model_actions.get_approval_status(modelId)
    userId = request.state.user_id
    model = get_state_machine(state, modelId)
    state_for = StateFor.MODEL.value
    trigger_type = TriggerType.APPROVAL.value
    try:
        model.in_review()
        model_actions.add_state_change_to_db(
            modelId,state, model.state, userId, comment, state_for, trigger_type,
        )
        model_actions.update_approval_status(modelId, model.state)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    return {"status": "model is taken In-review by admin"}
    
