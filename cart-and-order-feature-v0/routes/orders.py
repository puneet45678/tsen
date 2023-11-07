from fastapi import APIRouter,Request
from controllers import cart_controllers
from logger.logging import get_logger
from db.models.Cart import Cart, SaveLater, ItemRequest, Order, ProcessedCart, PurchasedModel, PurchasedCampaign, PurchaseCart, PurchasedTier
from services.claim_validators import check_role_claim_and_throw_error_if_not_present, check_permission_claim_and_throw_error_if_not_present
from services import cart_services
from typing import List

logger = get_logger(__name__)
router = APIRouter(tags=['Orders'], prefix="/api/v1")


@router.post("/items/buy")
def buy_now(request:Request,item:ItemRequest,):
    response = cart_controllers.buy_now(request,item)
    return response


@router.post("/orders")
def buy_cart(request:Request ,cart: PurchaseCart):
    response = cart_controllers.buy_cart(cart,request)
    return response


@router.get("/orders",response_model=List[Order])
async def my_orders(request:Request,page_size:int=10,page_number:int=1):
    response = await cart_controllers.my_orders(request,page_size,page_number)
    return response


@router.delete("/order/{order_id}")
def delete_order(order_id:str,request:Request):
    response = cart_controllers.delete_order(order_id,request)
    return response


@router.get("/cart/processed-carts",response_model=List[ProcessedCart])
def get_processed_carts(request:Request,page_size:int=10,page_number:int=1):
    response = cart_controllers.get_processed_carts(request,page_size,page_number)
    return response


@router.get("/purchases/models",response_model=List[PurchasedModel])
async def get_purchased_models(request:Request,page_size:int=10,page_number:int=1):
    response = await cart_controllers.get_purchased_models(request,page_size,page_number)
    return response


@router.get("/purchases/campaigns",response_model=List[PurchasedCampaign])
async def get_purchased_campaigns(request:Request,page_size:int=10,page_number:int=1):
    response = await cart_controllers.get_purchased_campaigns(request,page_size,page_number)
    return response

@router.get("/purchases/campaigns/{campaignId}",response_model=List[PurchasedTier])
async def get_purchased_tier(campaignId: str, request:Request,page_size:int=10,page_number:int=1):
    response = await cart_controllers.get_purchased_tier_by_campaign_id(request,campaignId,page_size,page_number)
    return response

