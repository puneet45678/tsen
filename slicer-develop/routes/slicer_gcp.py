from fastapi import APIRouter, Depends, Request,Query,Response,HTTPException
from supertokens_python.recipe.session.framework.fastapi import verify_session
from supertokens_python.recipe.session import SessionContainer
from controllers import slicer_gcp_controller
from enum import Enum
from typing import List,Optional

router = APIRouter(tags=['GCP_Slicer'], prefix="/gcp")

class Slicer(str, Enum):
    superslicer = "superslicer"
    anotherslicer = "anotherslicer"

class UrlType(str,Enum):
    cloud_run = "cloud_run"
    random = "random"


@router.get("/current-user")
async def current_user(request: Request):
    return slicer_gcp_controller.current_user(request)

    
@router.get("/start-container")
async def start_container(
    request: Request,
    slicer: Slicer = Query(Slicer.superslicer, description="The slicer to use"),
    campId: Optional[str] = Query(None, description="The camp ID"),
    tierId: Optional[str] = Query(None, description="The tier ID"),
    modelId: str = Query("64e48189c45915c712a4ee6b", description="The model ID"),
    force: bool = False,
    gcp_initial_cpu: str = "1000m",
    gcp_max_cpu: str = "2000m",
    gcp_initial_memory: str = "2Gi",
    gcp_max_memory: str = "4Gi",
    idle_time:str="120",
    time_quantumm:str="5",
):
    
    if campId is not None and tierId is None:
        raise HTTPException(status_code=400, detail="tierId is required when campId is provided")
    elif campId is None and tierId is not None:
        raise HTTPException(status_code=400, detail="campId is required when tierId is provided")
    

    return await slicer_gcp_controller.start_container(
        request,
        force=force,
        gcp_initial_cpu=gcp_initial_cpu,
        gcp_max_cpu=gcp_max_cpu,
        gcp_initial_memory=gcp_initial_memory,
        gcp_max_memory=gcp_max_memory,
        slicer_type=slicer.value,
        idle_time=idle_time,
        time_quantumm=time_quantumm,
        campId=campId,
        tierId=tierId,
        modelId=modelId,
    )


@router.delete("/delete-container")
async def delete_container(request: Request):
    return await slicer_gcp_controller.delete_container(request)

@router.get("/cloud-run-url")
async def get_ip_and_port(request: Request,response:Response,subdomain:str = ""):
    res = await slicer_gcp_controller.get_cloud_run_url(request,response,subdomain)
    return res

@router.get("/my-sessions")
def get_all_active_user_sessions(request:Request):
    return slicer_gcp_controller.get_running_services(request)


@router.get("/all-sessions")
def get_all_sessions(request:Request):
    return slicer_gcp_controller.get_all_sessions(request)

@router.get("/url")
async def get_url_from_user_and_session(request:Request,url_type:UrlType= Query(UrlType.cloud_run)):
    return await slicer_gcp_controller.get_url_from_user_and_session(request,url_type)

# @router.get("/ip-port")
# async def get_ip_and_port(request: Request,response:Response,subdomain:str = ""):
#     return await slicer_gcp_controller.get_ip_and_port(request,response,subdomain)


