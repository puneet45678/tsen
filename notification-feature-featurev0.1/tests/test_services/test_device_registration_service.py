from index import app
from unittest import IsolatedAsyncioTestCase
from unittest.mock import patch
from datetime import datetime
import secrets
import pytest

from services.device_registration_service import (
    trigger_delete_registration,
    trigger_get_device_registration_token,
    trigger_registring_device,
    trigger_registring_device_with_userId,
    trigger_update_registration_token
    )

#---------------------------------------------------------------------------------#
device_id = "PAAC-91225"
registration_token = secrets.token_hex(16)

#---------------------------------------------------------------------------------#

class TestDeviceRegistrationService(IsolatedAsyncioTestCase):

    '''
    This code tests trigger_get_device_registration_token
    Case 1: Return successful message
    '''

    # Case 1    
    @patch("services.device_registration_service.device_registration_actions.get_registration_token")
    def test_trigger_get_device_registration_token_Successful(self, mock_get):
        # given
        mock_get.return_value = "registered_device_registration_token"

        # when
        result = trigger_get_device_registration_token(device_id)
        
        # then
        assert result == "registered_device_registration_token"
        mock_get.assert_called_with(device_id)

    '''
    This code tests trigger_registring_device
    Case 1: Return successful message
    '''

    # Case 1  
    @patch("services.device_registration_service.device_registration_actions.register_device")
    def test_trigger_registring_device_Successful(self, mock_register):
        # given
        device_registration_action = {
                "Message": "Device registred successfully",
                "Device_id": device_id,
                "Registration_token": registration_token,
            }
        mock_register.return_value = device_registration_action

        # when
        result = trigger_registring_device(device_id, registration_token)
        
        # then
        assert result == device_registration_action
        mock_register.assert_called_with(device_id, registration_token)

    '''
    This code tests trigger_registring_device_with_userId
    Case 1: Return successful message
    '''

    # Case 1  
    @patch("services.device_registration_service.device_registration_actions.register_device_with_userId")
    def test_trigger_registring_device_with_userId_Successful(self, mock_register):
        # given
        device_registration_action = {
                "Message": "Device registred successfully",
                "Device_id": device_id,
                "Registration_token": registration_token,
            }
        mock_register.return_value = device_registration_action

        # when
        result = trigger_registring_device_with_userId(device_id, registration_token)
        
        # then
        assert result == device_registration_action
        mock_register.assert_called_with(device_id, registration_token)

    '''
    This code tests trigger_update_registration_token
    Case 1: Return successful message
    '''

    # Case 1  
    @patch("services.device_registration_service.device_registration_actions.update_device_registration_token")
    def test_trigger_update_registration_token_Successful(self, mock_update):
        # given
        current_timestamp = datetime.now().timestamp()
        device_registration_action = {
                "Message": "Registration Token updated Successfully",
                "Device_id": device_id,
                "New Registration_token": registration_token,
            }
        mock_update.return_value = device_registration_action

        # when
        result = trigger_update_registration_token(device_id, registration_token, current_timestamp)
        
        # then
        assert result == device_registration_action
        mock_update.assert_called_with(device_id, registration_token, current_timestamp)

    '''
    This code tests trigger_delete_registration
    Case 1: Return successful message
    '''

    # Case 1  
    @patch("services.device_registration_service.device_registration_actions.delete_device_registration")
    def test_trigger_delete_registration_Successful(self, mock_delete):
        # given
        triggered_device_deletion_status = f"Device with ID: {device_id} has been unregistered"
        mock_delete.return_value = triggered_device_deletion_status

        # when
        result = trigger_delete_registration(device_id)
        
        # then
        assert result == triggered_device_deletion_status
        mock_delete.assert_called_with(device_id)
