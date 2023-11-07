from index import app
from unittest import IsolatedAsyncioTestCase
from unittest.mock import patch
import secrets
import pytest

from services.getstream_token_service import trigger_create_token_for_user


#---------------------------------------------------------------------------------#

class TestGetstreamTokenService(IsolatedAsyncioTestCase):

    '''
    This code tests trigger_create_token_for_user
    Case 1: Return successful message
    '''

    # Case 1
    @patch("services.getstream_token_service.getstream_token_actions.generate_user_token")
    def test_trigger_create_token_for_user_Successful(self, mock_generate):
        # given
        user_token = secrets.token_hex(16)
        user_id = "6493cb1ba1d03599e920c897"
        message = {"message": f"user token generated", "token": user_token}
        mock_generate.return_value = message

        # when
        result = trigger_create_token_for_user(user_id)

        # then
        assert result == message
        mock_generate.assert_called_with(user_id)
