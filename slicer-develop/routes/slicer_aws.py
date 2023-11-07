from fastapi import BackgroundTasks, APIRouter, Depends, Request,Query,Response
from supertokens_python.recipe.session.framework.fastapi import verify_session
from supertokens_python.recipe.session import SessionContainer
from controllers import slicer_aws_controller
from typing import List

router = APIRouter(tags=['AWS_Slicer'], prefix="/aws")


@router.get("/current-user")
async def current_user(request: Request,session: SessionContainer = Depends(verify_session())):
    return slicer_aws_controller.current_user(request,session)
    
@router.get("/test")
async def test(request: Request):
    return await slicer_aws_controller.test_route(request)

@router.get("/start-container")
async def start_container(request: Request,session: SessionContainer = Depends(verify_session()),campId: str = "123",tierId: str = "456",assets: List[str] = Query([]),force: bool = False):
    return await slicer_aws_controller.start_container(request,session,campId,tierId,assets,force)


@router.delete("/stop-container")
async def stop_container(request: Request):
    return await slicer_aws_controller.stop_container(request)


@router.delete("/task-defination")
async def delete_task_defination(session: SessionContainer = Depends(verify_session())):
    return await slicer_aws_controller.delete_task_defination(session)


@router.get("/running-sessions")
def get_all_active_sessions(session: SessionContainer = Depends(verify_session())):
    return slicer_aws_controller.get_running_tasks(session)

@router.get("/my-sessions")
def get_current_user_sessions(session: SessionContainer = Depends(verify_session())):
    return slicer_aws_controller.get_current_user_sessions(session)

@router.get("/all-sessions")
def get_all_sessions(session: SessionContainer = Depends(verify_session())):
    return slicer_aws_controller.get_all_users(session)

@router.get("/ip-port")
async def get_ip_and_port(request: Request,response:Response,subdomain:str = ""):
    return await slicer_aws_controller.get_ip_and_port(request,response,subdomain)


