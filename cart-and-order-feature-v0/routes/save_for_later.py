from fastapi import APIRouter,Request
from controllers import cart_controllers
from logger.logging import get_logger
from db.models.Cart import Cart, SaveLater, ItemRequest, Order,ItemRequestWithoutQuantity
from services.claim_validators import check_role_claim_and_throw_error_if_not_present, check_permission_claim_and_throw_error_if_not_present
from services import cart_services
from typing import List

logger = get_logger(__name__)
router = APIRouter(tags=['Save For Later'], prefix="/api/v1")

@router.get("/cart/save-for-later",response_model=SaveLater)
async def get_save_for_later(request:Request,page_size:int=10,page_number:int=1):
    response = await cart_controllers.get_save_for_later(request,page_size,page_number)
    return response


@router.put("/cart/save-for-later/{item_id}")
async def save_for_later(item:ItemRequestWithoutQuantity,request:Request):
    response = await cart_controllers.save_for_later(item,request)
    return response


@router.post("/cart/move-to-cart/{item_id}")
async def move_save_later_item_to_cart(item_id:str, request: Request):
    response = await cart_controllers.move_to_cart(item_id,request)
    return response


@router.delete("/cart/save-for-later/{item_id}")
def delete_from_save_from_later(item_id:str,request:Request):
    response = cart_controllers.delete_from_save_from_later(item_id,request)
    return response
