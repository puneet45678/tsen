from fastapi import HTTPException, status
from index import app
from unittest import IsolatedAsyncioTestCase
from unittest.mock import patch, MagicMock
import pytest

from models.delete_registration_token import DeleteRegistrationToken
from models.fcm_device_registration_model import RegisterDevice
from models.fcm_registration_token_update_model import UpdateRegistrationToken
from routes.fcm_device_router import (
    # delete_device_registration, 
    # get_device_registration_token, 
    register_device, 
    # update_device_registration_token
    )


#---------------------------------------------------------------------------------#
mongoId = '647f0bacb301c331cc2d415e'
device_id = "PAAC-91225"
registration_token = "dummy-registration-token"

#---------------------------------------------------------------------------------#

class TestFcmRegistration(IsolatedAsyncioTestCase):

    '''
    This code tests register_device
    Case 1: If session is present, store user_id with registration token
    Case 2: If session is present, but user_id could not be registered
    Case 3: If session is not present, register device
    Case 4: If session is not present, but device could not be registered
    '''

    # Case 1
    @pytest.mark.asyncio
    @patch("routes.fcm_device_router.get_session")
    @patch("routes.fcm_device_router.device_registration_service.trigger_registring_device_with_userId")
    async def test_register_device_IfSessionPresentSuccessful(self, mock_trigger, mock_get):
        # given
        request = MagicMock()
        data = RegisterDevice(
            device_id = device_id,
            registration_token = registration_token
        )
        trigger_return = {
            "Message": "Device registred successfully",
            "Device_id": data.device_id,
            "Registration_token": data.registration_token,
        }
        mock_get.return_value = "session"
        mock_trigger.return_value = trigger_return

        # when
        result = await register_device(data, request)
        
        # then
        assert result == trigger_return
        mock_get.assert_called_with(request, session_required=False)
        mock_trigger.assert_called_with(data.device_id, data.registration_token)
    
    # Case 2
    @pytest.mark.asyncio
    @patch("routes.fcm_device_router.get_session")
    @patch("routes.fcm_device_router.device_registration_service.trigger_registring_device_with_userId")
    async def test_register_device_IfSessionPresentException(self, mock_trigger, mock_get):
        # given
        request = MagicMock()
        data = RegisterDevice(
            device_id = device_id,
            registration_token = registration_token
        )
        mock_get.return_value = "session"
        mock_trigger.side_effect = HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Unable to register device")

        # when
        with pytest.raises(HTTPException) as exc_info:
            await register_device(data, request)
        
        # then
        assert exc_info.value.status_code == 500
        assert exc_info.value.detail == "Unable to register device"
        mock_get.assert_called_with(request, session_required=False)
        mock_trigger.assert_called_with(data.device_id, data.registration_token)

    # Case 3
    @pytest.mark.asyncio
    @patch("routes.fcm_device_router.get_session")
    @patch("routes.fcm_device_router.device_registration_service.trigger_registring_device")
    async def test_register_device_IfSessionNotPresentSuccessful(self, mock_trigger, mock_get):
        # given
        request = MagicMock()
        data = RegisterDevice(
            device_id = device_id,
            registration_token = registration_token
        )
        trigger_return = {
            "Message": "Device registred successfully",
            "Device_id": data.device_id,
            "Registration_token": data.registration_token,
        }
        mock_get.return_value = None
        mock_trigger.return_value = trigger_return

        # when
        result = await register_device(data, request)
        
        # then
        assert result == trigger_return
        mock_get.assert_called_with(request, session_required=False)
        mock_trigger.assert_called_with(data.device_id, data.registration_token)

    # Case 4
    @pytest.mark.asyncio
    @patch("routes.fcm_device_router.get_session")
    @patch("routes.fcm_device_router.device_registration_service.trigger_registring_device")
    async def test_register_device_IfSessionNotPresentException(self, mock_trigger, mock_get):
        # given
        request = MagicMock()
        data = RegisterDevice(
            device_id = device_id,
            registration_token = registration_token
        )
        mock_get.return_value = None
        mock_trigger.side_effect = HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Unable to register device")

        # when
        with pytest.raises(HTTPException) as exc_info:
            await register_device(data, request)
        
        # then
        assert exc_info.value.status_code == 500
        assert exc_info.value.detail == "Unable to register device"
        mock_get.assert_called_with(request, session_required=False)
        mock_trigger.assert_called_with(data.device_id, data.registration_token)
