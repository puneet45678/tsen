from fastapi import APIRouter,Request
from controllers import cart_controllers
from logger.logging import get_logger
from db.models.Cart import WishlistItemRequest , Wishlist, WishlistItemRequest
from services.claim_validators import check_role_claim_and_throw_error_if_not_present, check_permission_claim_and_throw_error_if_not_present
from services import cart_services
from typing import List, Union

logger = get_logger(__name__)
router = APIRouter(tags=['Wishlist'], prefix="/api/v1")

@router.post("/wishlist")
async def post_item_to_wishlist(item:WishlistItemRequest,request:Request):
    response = await cart_controllers.add_to_wishlist(item,request)
    return response


@router.get("/wishlist",response_model=Wishlist)
async def get_wishlist(request:Request,page_size:int=10,page_number:int=1):
    response = await cart_controllers.get_wishlist(request,page_size,page_number)
    return response

@router.delete("/wishlist/{item_id}")
async def delete_item_from_wishlist(item_id:str,request:Request):
    response = cart_controllers.delete_item_from_wishlist(item_id,request)
    return response

@router.delete("/wishlist")
async def delete_the_wishlist(request:Request):
    response = cart_controllers.delete_the_wishlist(request)
    return response

# @router.put("/wishlist/move-to-cart/{item_id}")
# async def move_wishlist_item_to_cart(item_id:str, request: Request):
#     response = cart_controllers.move_wishlist_item_to_cart(item_id,request)
#     return response