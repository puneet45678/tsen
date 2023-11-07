from fastapi import APIRouter,Request
from controllers import cart_controllers
from logger.logging import get_logger
from db.models.Cart import Cart, ItemRequest,ItemRequestWithoutQuantity
from services.claim_validators import check_role_claim_and_throw_error_if_not_present, check_permission_claim_and_throw_error_if_not_present
from services import cart_services
from typing import List

logger = get_logger(__name__)
router = APIRouter(tags=['Cart'], prefix="/api/v1")


@router.get("/sessionCheck")
async def session_check(request:Request):
    session = request.state.session
    await check_permission_claim_and_throw_error_if_not_present(session, "ReadCampaigns")
    return (dir(session))


@router.get("/cart",response_model=Cart)
async def get_cart(request:Request,page_size:int=10,page_number:int=1):
    await check_permission_claim_and_throw_error_if_not_present(request.state.session,"ReadCampaigns")
    response = await cart_controllers.get_cart_details(request,page_size,page_number)
    return response
    
@router.post("/cart")
async def post_cart(item:ItemRequestWithoutQuantity, request:Request):
    response = await cart_controllers.add_to_cart(item,request)
    return response

@router.put("/cart")
async def put_item_in_cart(item:ItemRequest,request:Request):
    response = await cart_controllers.put_item_in_cart(request,item)
    return response

@router.delete("/cart/{item_id}")
async def delete_single_item_from_cart(item_id:str,request:Request):
    response = await cart_controllers.delete_single_item_from_cart(item_id,request)
    return response

@router.delete("/cart/all/{item_id}")
async def delete_all_items_from_cart(item_id: str, request: Request):
    response = await cart_controllers.delete_all_items_from_cart(item_id,request)
    return response

@router.delete("/cart")
async def delete_the_cart(request:Request):
    response = await cart_controllers.delete_the_cart(request)
    return response

@router.post("/send-abandoned-cart-email")
def send_abandoned_cart_email(request:Request):
    user_id = request.state.user_id
    abondend_carts = cart_controllers.send_abandoned_cart_email()  
    return abondend_carts







#TODO: User deleted then cart , campaigns, comments, slicer containers and the data in EFS and S3 automatically deleted  # Composition
#TODO: User deleted then  # Dependency Constraint
