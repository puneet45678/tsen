from fastapi import FastAPI, HTTPException, status
from fastapi_amis_admin.admin.settings import Settings
from fastapi_amis_admin.admin.site import AdminSite
from fastapi_scheduler import SchedulerAdmin
from typing import Any
from pydantic import BaseModel
from starlette.requests import Request
from fastapi_amis_admin.amis.components import Form
from fastapi_amis_admin.admin import admin
from fastapi_amis_admin.crud.schema import BaseApiOut
from fastapi_amis_admin.models.fields import Field
from datetime import date
from pytz import utc

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

scheduler = SchedulerAdmin.bind(site)