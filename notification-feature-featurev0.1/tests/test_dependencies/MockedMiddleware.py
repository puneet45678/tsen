from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware


from typing import Dict, Any
mongoId = '647f0bacb301c331cc2d415e'

class SessionInformationResult:
    def __init__(
        self,
        session_handle: Dict[str, Any],
        user_id: str,
        session_data: Dict[str, Any],
        expiry: int,
        access_token_payload: Dict[str, Any],
        time_created: int,
    ):
        self.session_handle: str = session_handle
        self.user_id: str = user_id
        self.session_data: Dict[str, Any] = session_data
        self.expiry: int = expiry
        self.access_token_payload: Dict[str, Any] = access_token_payload
        self.time_created: int = time_created
    
    class SessionHandle:
        def __init__(self, access_token_payload: Dict[str, Any]):
            self.access_token_payload = access_token_payload


class MockedSessionMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        userId = mongoId
        mock_session_info = SessionInformationResult(
        session_handle=SessionInformationResult.SessionHandle({'username_bool': True}),
        user_id=mongoId,
        session_data={},
        expiry=81,
        access_token_payload={"username_bool": True},
        time_created=637,
    )
        # print("-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_MOCKED_-_MIDDLEWARE_-_TRIGGERED-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_")
        # if not hasattr(request, "state"):
        #     print("Request does not have state. Something is wrong with your tests.")
            
        request.state.session = mock_session_info
        request.state.user_id = userId
        response = await call_next(request)
        return response
