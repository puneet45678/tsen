from fastapi import FastAPI, HTTPException, status , BackgroundTasks
from fastapi_amis_admin.admin.settings import Settings
from fastapi_amis_admin.admin.site import AdminSite
from fastapi_scheduler import SchedulerAdmin
from typing import Any
from pydantic import BaseModel
from starlette.requests import Request
from starlette.datastructures import URL, Headers
from fastapi_amis_admin.amis.components import Form
from fastapi_amis_admin.admin import admin
from fastapi_amis_admin.crud.schema import BaseApiOut
from fastapi_amis_admin.models.fields import Field
from campaign_db import campaign_actions, model_actions
from datetime import date
from pytz import utc
import uuid

from services import modelService, campaign_new_service,notification_calls

# Create AdminSite instance
from logger.logging import getLogger

logger = getLogger(__name__)
site = AdminSite(
    settings=Settings(database_url_async="sqlite+aiosqlite:///amisadmin.db")
)

@site.register_admin
class UserLoginFormAdmin(admin.FormAdmin):
    page_schema = "UserLoginForm"
    form = Form(title="This is a test login form", submitText="login")

    class schema(BaseModel):
        username: str = Field(..., title="username", min_length=3, max_length=30)
        password: str = Field(..., title="password")

    async def handle(
        self, request: Request, data: BaseModel, **kwargs
    ) -> BaseApiOut[Any]:
        if data.username == "amisadmin" and data.password == "amisadmin":
            return BaseApiOut(msg="Login successfully!", data={"token": "xxxxxx"})
        return BaseApiOut(status=-1, msg="Incorrect username or password!")

class State:
    def __init__(self):
        self.user_id = None
        self.session = None
        self.auth_call = None
        self.x_request_id = None


# For creating dummy request object 

def create_dummy_request():
    url = URL("http://testserver/")
    headers = Headers({"host": "testserver"})
    scope = {
        "type": "http",
        "method": "GET",
        "headers": headers.raw,
        "path": url.path,
        "root_path": "",
        "scheme": "http",
        "query_string": b"",
        "server": ("127.0.0.1", 80),
        "client": ("127.0.0.1", 50532),
    }

    request = Request(scope)
    if not hasattr(request, "state"):
        request.state = State()
    random_id = str(uuid.uuid4())
    request.state.x_request_id = f"campaign-{random_id}"
    request.state.user_id = f"campaign-scheduler-{random_id}"

    return request

scheduler = SchedulerAdmin.bind(site)

@scheduler.scheduled_job("cron", hour=0, minute=0, timezone=utc)
async def make_approved_to_pre_launched():
    try:
        await campaign_new_service.update_campaigns_approved_to_pre_launch()
    except HTTPException as e:
        logger.error(e.detail)
        raise e
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="unable to update campaigns approved to pre launched")
    

@scheduler.scheduled_job("cron", hour=0, minute=0, timezone=utc)
async def make_pre_launched_campaigns_live():
    #creating dummy request object as schedulers have no paramters as request and for performing m2m calls x_request_id is requried
    request = create_dummy_request()
    try:
        await notification_calls.update_campaigns_status_pre_launched_to_live(request)
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="unable to update campaigns pre launched to live")


@scheduler.scheduled_job("cron", hour=0, minute=0, timezone=utc)
async def five_days_ready_for_deletion():
    try:
        await model_actions.mark_models_for_ready_for_deletion()
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="unable to mark models for ready for deletion")


@scheduler.scheduled_job("cron", hour=0, minute=0, timezone=utc)
async def final_deletion_after_60_days():
    try:
        await model_actions.mark_models_for_deletion()
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="unable to mark models for deletion")


@scheduler.scheduled_job("cron", hour=0, minute=0, timezone=utc)
async def make_live_to_end():
    try:
        campaign_actions.update_ending_campaigns_status()
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="unable to update ending campaigns status")


@scheduler.scheduled_job("cron", hour=0, minute = 0 , timezone = utc)
async def three_days_before_ready_for_deletion():
    try:
        
        request = create_dummy_request()
        await notification_calls.get_mark_models_deletion_and_send_notifications(request)
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="unable to semd notifications for models ready for deletion")


@scheduler.scheduled_job("cron", hour=0, minute=0, timezone=utc)
async def three_days_notify_owner_campaign_ending():
    try:
        request = create_dummy_request()
        await notification_calls.notify_about_campaign_endings(request)
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="unable to notify about campaign endings")


@scheduler.scheduled_job("cron", hour=0, minute=0, timezone=utc)
async def three_days_notify_owner_earlybird_ending():
    try:
        request = create_dummy_request()
        await notification_calls.notify_about_earlybird_endings(request)
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="unable to notify about earlybird endings")


@scheduler.scheduled_job("cron", hour=0, minute=0, timezone=utc)
async def update_earlybird_tiers_scheduler():
    try:
        modified_count = await campaign_actions.update_earlybird_tiers()
        logger.debug(f"Updated {modified_count} early bird tiers.")
        return {'modified_count': modified_count}
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="unable to update earlybird tiers")


@scheduler.scheduled_job("cron", hour=0, minute=0, timezone=utc)
async def draft_state_notify():
    try:
        request = create_dummy_request()
        return await notification_calls.notify_draft_state_campaigns(request)
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="unable to notify draft state campaigns")

