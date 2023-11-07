from fastapi import HTTPException, status
from index import app
from unittest import IsolatedAsyncioTestCase
from unittest.mock import patch, MagicMock
import pytest

from config import read_yaml
from services.get_info_service import (
    get_campaign_name, 
    get_user_data
    )


#---------------------------------------------------------------------------------#

class TestGetInfoService(IsolatedAsyncioTestCase):

    '''
    This code tests get_campaign_name
    Case 1: Return successful message
    Case 2: Throw 500 error if campaign_name cannot be fetched
    '''

    # Case 1
    @pytest.mark.asyncio
    @patch('services.get_info_service.requests.get')
    async def test_get_campaign_name_Successful(self, mock_requests):
        # given
        campaign_id = '6493cb1ba1d03599e920c897'
        mock_requests.return_value = "Batman"

        # when
        result = await get_campaign_name(campaign_id)
        
        # then
        assert result == "Batman"
        mock_requests.assert_called_with(f"{read_yaml.CAMPAIGN_DOMAIN}/campaigns/{campaign_id}/campaignTitle")
    
    # Case 2
    @pytest.mark.asyncio
    @patch('services.get_info_service.requests.get')
    async def test_get_campaign_name_Exception(self, mock_requests):
        # given
        campaign_id = '6493cb1ba1d03599e920c897'
        mock_requests.side_effect = HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                                                  detail="User service error")

        # when
        with pytest.raises(HTTPException) as exc_info:
            await get_campaign_name(campaign_id)
        
        # then
        assert exc_info.value.status_code == 500
        assert exc_info.value.detail == "User service error"
        mock_requests.assert_called_with(f"{read_yaml.CAMPAIGN_DOMAIN}/campaigns/{campaign_id}/campaignTitle")

    '''
    This code tests get_user_data
    Case 1: Return successful message
    Case 2: Throw 500 error if user cannot be fetched
    '''

    # Case 1
    @pytest.mark.asyncio
    @patch('services.get_info_service.requests.get')
    async def test_get_user_data_Successful(self, mock_get):
        # given
        user = {
            "user_id": "6493cb1ba1d03599e920c897",
            "username": "ikarus-akash",
            "email": "akashchaubey443@gmail.com"
        }
        mock_response = mock_get.return_value
        mock_response.json.return_value = user

        # when
        result = await get_user_data(user["user_id"])

        # then
        assert result == {"user_name": "ikarus-akash", "user_email": "akashchaubey443@gmail.com"}
        mock_get.assert_called_with(f"{read_yaml.USER_DOMAIN}/user/userid/6493cb1ba1d03599e920c897")

    # Case 2
    @pytest.mark.asyncio
    @patch('services.get_info_service.requests.get')
    async def test_get_user_data_Exception(self, mock_get):
        # given
        user = {
            "user_id": "6493cb1ba1d03599e920c897",
            "username": "ikarus-akash",
            "email": "akashchaubey443@gmail.com"
        }        
        mock_response = MagicMock()
        mock_response.json.side_effect = HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                                                  detail="User service error")
        mock_get.return_value = mock_response

        # when
        with pytest.raises(HTTPException) as exc_info:
            await get_user_data(user["user_id"])

        # then
        assert exc_info.value.status_code == 500
        assert exc_info.value.detail == "User service error"
        mock_get.assert_called_with(f"{read_yaml.USER_DOMAIN}/user/userid/6493cb1ba1d03599e920c897")
