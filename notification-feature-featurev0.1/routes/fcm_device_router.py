from fastapi import APIRouter, Request, HTTPException, status
from services import device_registration_service
from logger.logging import get_db_action_Logger
from supertokens_python.recipe.session.asyncio import get_session
from models import (
    fcm_device_registration_model,
)

base_api_path = "/device_registration/api/v1"

router = APIRouter(tags=["Device Registration Service"], prefix=base_api_path)

logger = get_db_action_Logger(__name__)


@router.post("/register_device", status_code=201)
async def register_device(data: fcm_device_registration_model.RegisterDevice):
    device_registration_status = None

    data = data.dict()
    device_id = data["device_id"]
    registration_token = data["registration_token"]
    logger.info(f"Registring Device with ID: {device_id}")

    try:
        logger.info(
            f"The session is present, storing user_id with registration token: {registration_token}"
        )
        device_registration_status = (
            device_registration_service.trigger_registring_device(
                device_id, registration_token
            )
        )
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to register the device",
        )

    return device_registration_status
