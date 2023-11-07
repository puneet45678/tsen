from fastapi import APIRouter, Request, HTTPException
from services import cart_services
from db.models.Cart import (
    Cart,
    Item,
    SaveLater,
    SaveLaterItem,
    WishlistItemRequest,
    ItemRequest,
    Item_type,
    Wishlist_Item,
    Order,
    OrderItem,
    Wishlist,
    WishlistItemModel,
    WishlistItemCampaign,
    ProcessedItem,
    ProcessedCart,
    ItemRequestWithoutQuantity,
    PurchasedModel,
    PurchaseCart,
    PurchasedCampaign,
    PurchasedTier,
)
from logger.logging import get_logger

logger = get_logger(__name__)
router = APIRouter(tags=["Cart"], prefix="/api/v1")
prefix = "/api/v1"
from datetime import datetime
from utils import utils
from typing import List, Union


async def get_cart_details(request: Request, page_size: int, page_number: int) -> Cart:
    request_id = request.state.x_request_id
    user_id = request.state.user_id
    logger.info(
        f"{prefix}/cart Api called for getting cart details for userId:{user_id}"
    )

    try:
        cart = cart_services.get_document_from_cart(user_id)
    except Exception as e:
        logger.error(str(e))
        raise HTTPException(status_code=500, detail="Internal Server Error")

    if not cart:
        logger.error(f"No cart Present for userId:{user_id}")
        raise HTTPException(detail="No cart Present", status_code=404)

    item_respnse = []
    items = cart["items"]
    skip = page_size * (page_number - 1)
    items = items[skip : skip + page_size]

    item_lists = utils.create_item_lists_object(items)
    print(item_lists)

    for item_type, item_list in item_lists.items():
        if item_type == Item_type.MODEL.value:
            try:
                item_details_models = (
                    await cart_services.get_model_details_from_model_service(
                        item_list, request_id, user_id
                    )
                )
            except Exception as e:
                raise HTTPException(detail=str(e), status_code=500)

        elif item_type == Item_type.TIER.value:
            try:
                item_details_tier = (
                    await cart_services.get_tier_details_from_campaign_service(
                        item_list, request_id, user_id
                    )
                )
            except Exception as e:
                raise HTTPException(detail=str(e), status_code=500)
        else:
            logger.error(f"Invalid item type {item_type}")
            raise HTTPException(
                detail=f"Invalid item type {item_type}", status_code=404
            )

    for item in items:
        try:
            if item["itemType"] == Item_type.MODEL.value:
                item_owner_details = await cart_services.get_model_details(
                    item_details_models, item["itemId"]
                )
            elif item["itemType"] == Item_type.TIER.value:
                item_owner_details = await cart_services.get_tier_details(
                    item_details_tier, item["itemId"]
                )

        except Exception as e:
            logger.error(str(e))
            raise HTTPException(detail="Internal server Error", status_code=500)

        item_respnse.append(
            Item(
                itemId=item["itemId"],
                itemType=item["itemType"],
                itemName=item_owner_details["itemName"],
                itemDp=item_owner_details["itemDp"],
                artistName=item_owner_details["artistName"],
                artistDp=item_owner_details["artistDp"],
                alreadyOdered=cart_services.is_already_ordered_item(
                    user_id, item["itemId"]
                ),
                price=item["price"],
                currency=item["currency"],
                quantity=item["quantity"],
                addedOn=item["addedOn"],
                lastUpdated=item["lastUpdated"],
            )
        )

    # Create an instance of the Cart model
    response = Cart(
        cartId=str(cart["_id"]),
        userId=str(cart["userId"]),
        items=item_respnse,
        createdAt=cart["createdAt"],
        updatedAt=cart["lastUpdated"],
    )

    logger.debug(f"Cart details received successfully for userId:{user_id}")
    logger.info(f"{prefix}/cart Api called Executed for userId:{user_id}")
    return response


async def my_orders(request: Request, page_size: int, page_number: int) -> List[Order]:
    user_id = request.state.user_id
    request_id = request.state.x_request_id
    logger.info(
        f"{prefix}/my-orders Api called to get the order details for userId:{user_id}"
    )

    try:
        order_ids = cart_services.get_orders_from_map(user_id, page_size, page_number)
    except Exception as e:
        logger.error(str(e))
        raise HTTPException(detail=str(e), status_code=500)

    print(order_ids)

    item_lists = cart_services.get_items_from_order_ids(order_ids)
    print(item_lists)

    for item_type, item_list in item_lists.items():
        if item_type == Item_type.MODEL.value:
            try:
                item_details_models = (
                    await cart_services.get_model_details_from_model_service(
                        list(item_list), request_id, user_id
                    )
                )
            except Exception as e:
                raise HTTPException(detail=str(e), status_code=500)

        elif item_type == Item_type.TIER.value:
            try:
                item_details_tier = (
                    await cart_services.get_tier_details_from_campaign_service(
                        list(item_list), request_id, user_id
                    )
                )
            except Exception as e:
                raise HTTPException(detail=str(e), status_code=500)
        else:
            logger.error(f"Invalid item type {item_type}")
            raise HTTPException(
                detail=f"Invalid item type {item_type}", status_code=404
            )

    response = []
    for orderId in order_ids:
        order_details = cart_services.get_orders_from_order_coll(orderId)
        orderItems = []
        for item in order_details["items"]:
            try:
                if item["itemType"] == Item_type.MODEL.value:
                    item_details = await cart_services.get_model_details(item_details_models, item["itemId"])
                    orderItems.append(
                        OrderItem(
                            itemId=item["itemId"],
                            itemType=item["itemType"],
                            itemName=item_details["itemName"],
                            itemDp=item_details["itemDp"],
                            artistName=item_details["artistName"],
                            artistDp=item_details["artistDp"],
                            price=item["price"],
                            quantity=item["quantity"],
                            reviewId=item_details["reviewId"],
                            rating=item_details["rating"],
                        )
            )
                elif item["itemType"] == Item_type.TIER.value:
                    item_details = await cart_services.get_tier_details(item_details_tier, item["itemId"])
                    orderItems.append(
                        OrderItem(
                            itemId=item["itemId"],
                            itemType=item["itemType"],
                            itemName=item_details["itemName"],
                            itemDp=item_details["itemDp"],
                            artistName=item_details["artistName"],
                            artistDp=item_details["artistDp"],
                            price=item["price"],
                            quantity=item["quantity"],
                            campaignId=item_details["campaignId"],
                            reviewId=item_details["reviewId"]

                        )
            )

            except Exception as e:
                logger.error(str(e))
                raise HTTPException(detail="Internal server Error", status_code=500)
 

        order = Order(
            orderId=orderId,
            orderValue=order_details["orderValue"],
            timeOfOrder=order_details["timeOfOrder"],
            items=orderItems,
        )

        response.append(order)

    logger.debug(f"Order details recieved succesfully")
    logger.info(
        f"{prefix}/my-orders Api Executed to get the order details for userId:{user_id}"
    )
    if not response:
        logger.error(f"Page number Exeeded:{user_id}")
        raise HTTPException(detail="Page number Exeeded", status_code=404)
    return response


async def get_wishlist(request: Request, page_size: int, page_number: int) -> Wishlist:
    request_id = request.state.x_request_id
    user_id = request.state.user_id
    logger.info(
        f"{prefix}/wishlist Api called for getting wishlist details for userId:{user_id}"
    )

    try:
        wishlist = cart_services.get_document_from_wishlist(user_id)
    except Exception as e:
        logger.error(str(e))
        raise HTTPException(status_code=500, detail="Internal Server Error")

    if not wishlist:
        logger.error(f"No wishlist Present for userId:{user_id}")
        raise HTTPException(detail="No wishlist Present", status_code=404)

    item_respnse = []
    items = wishlist["items"]

    skips = page_size * (page_number - 1)
    items = items[skips : page_size + skips]

    item_lists = utils.create_item_lists_object(items)
    print(item_lists)

    for item_type, item_list in item_lists.items():
        if item_type == Wishlist_Item.MODEL.value:
            try:
                item_details_models = (
                    await cart_services.get_model_details_from_model_service(
                        item_list, request_id, user_id
                    )
                )
            except Exception as e:
                raise HTTPException(detail=str(e), status_code=500)

        elif item_type == Wishlist_Item.CAMPAIGN.value:
            try:
                item_details_campaign = (
                    await cart_services.get_campaign_details_from_campaign_service(
                        item_list, request_id, user_id
                    )
                )
            except Exception as e:
                raise HTTPException(detail=str(e), status_code=500)
        else:
            logger.error(f"Invalid item type {item_type}")
            raise HTTPException(
                detail=f"Invalid item type {item_type}", status_code=404
            )

    for item in items:
        try:
            if item["itemType"] == Wishlist_Item.MODEL.value:
                item_owner_details = await cart_services.get_model_details(
                    item_details_models, item["itemId"]
                )
                item_respnse.append(
                    WishlistItemModel(
                        itemId=item["itemId"],
                        itemType=item["itemType"],
                        itemName=item_owner_details["itemName"],
                        itemCurrency=item_owner_details["itemCurrency"],
                        itemPrice=item_owner_details["itemPrice"],
                        itemDp=item_owner_details["itemDp"],
                        artistName=item_owner_details["artistName"],
                        artistDp=item_owner_details["artistDp"],
                        addedOn=item["addedOn"],
                        lastUpdated=item["lastUpdated"],
                    )
                )

            elif item["itemType"] == Wishlist_Item.CAMPAIGN.value:
                item_owner_details = await cart_services.get_campaign_details(
                    item_details_campaign, item["itemId"]
                )
                item_respnse.append(
                    WishlistItemCampaign(
                        itemId=item["itemId"],
                        itemType=item["itemType"],
                        statusOfCampaign=item_owner_details["statusOfCampaign"],
                        amountRaised=item_owner_details["amountRaised"],
                        endDate=item_owner_details["endDate"],
                        noOfBackers=item_owner_details["noOfBackers"],
                        noOfRewardTiers=item_owner_details["noOfrewardTiers"],
                        itemName=item_owner_details["itemName"],
                        itemDp=item_owner_details["itemDp"],
                        artistName=item_owner_details["artistName"],
                        artistDp=item_owner_details["artistDp"],
                        addedOn=item["addedOn"],
                        lastUpdated=item["lastUpdated"],
                    )
                )

        except Exception as e:
            logger.error(str(e))
            raise HTTPException(detail="Internal server Error", status_code=500)

    # Create an instance of the Wishlist
    response = Wishlist(
        wishlistId=str(wishlist["_id"]),
        userId=str(wishlist["userId"]),
        createdAt=wishlist["createdAt"],
        updatedAt=wishlist["lastUpdated"],
        items=item_respnse,
    )

    logger.debug(f"Wishlist details received successfully for userId:{user_id}")
    logger.info(f"{prefix}/wishlist Api called Executed for userId:{user_id}")
    return response


async def get_save_for_later(
    request: Request, page_size: int, page_number: int
) -> SaveLater:
    user_id = request.state.user_id
    request_id = request.state.x_request_id
    logger.info(f"{prefix}/cart/save-for-later Api called  for userId:{user_id}")
    stl = cart_services.get_document_from_save_later(user_id)
    logger.debug(f"Save Later data recieved succesfully for userId :{user_id}")

    if not stl:
        logger.error(f"No save for later Present for userId:{user_id}")
        raise HTTPException(detail="No save for later Present", status_code=404)

    items = stl["items"]
    skip = page_size * (page_number - 1)
    items = items[skip : skip + page_size]

    item_lists = utils.create_item_lists_object(items)
    for item_type, item_list in item_lists.items():
        if item_type == Item_type.MODEL.value:
            try:
                item_details_models = (
                    await cart_services.get_model_details_from_model_service(
                        item_list, request_id, user_id
                    )
                )
            except Exception as e:
                raise HTTPException(detail=str(e), status_code=500)

        elif item_type == Item_type.TIER.value:
            try:
                item_details_tier = (
                    await cart_services.get_tier_details_from_campaign_service(
                        item_list, request_id, user_id
                    )
                )
            except Exception as e:
                raise HTTPException(detail=str(e), status_code=500)
        else:
            logger.error(f"Invalid item type {item_type}")
            raise HTTPException(
                detail=f"Invalid item type {item_type}", status_code=404
            )

    item_respnse = []
    for item in items:
        try:
            if item["itemType"] == Item_type.MODEL.value:
                item_owner_details = await cart_services.get_model_details(
                    item_details_models, item["itemId"]
                )
            elif item["itemType"] == Item_type.TIER.value:
                item_owner_details = await cart_services.get_tier_details(
                    item_details_tier, item["itemId"]
                )

        except Exception as e:
            logger.error(str(e))
            raise HTTPException(detail="Internal server Error", status_code=500)

        item_respnse.append(
            SaveLaterItem(
                itemId=item["itemId"],
                itemType=item["itemType"],
                itemName=item_owner_details["itemName"],
                itemDp=item_owner_details["itemDp"],
                artistName=item_owner_details["artistName"],
                quantity=item["quantity"],
                artistDp=item_owner_details["artistDp"],
                addedOn=item["addedOn"],
                lastUpdated=item["lastUpdated"],
            )
        )

    response = SaveLater(
        userId=str(stl["userId"]),
        createdAt=stl["createdAt"],
        lastUpdated=stl["lastUpdated"],
        items=item_respnse,
    )

    logger.debug(f"Save Later data recieved succesfully for userId :{user_id}")
    logger.info(f"{prefix}/cart/save-for-later Api Executed for userId:{user_id}")
    return response


async def get_purchased_models(
    request: Request, page_size: int, page_number: int
) -> List[PurchasedModel]:
    user_id = request.state.user_id
    request_id = request.state.x_request_id
    try:
        order_ids = cart_services.get_orders_from_map_unpaginated(user_id)
    except Exception as e:
        logger.error(str(e))
        raise HTTPException(detail=str(e), status_code=500)

    models_details, models_list = cart_services.get_models_from_order_ids(order_ids)

    models_details = models_details[
        page_size * (page_number - 1) : page_size * page_number
    ]
    models_list = models_list[page_size * (page_number - 1) : page_size * page_number]

    try:
        models_details_from_models_service = (
            await cart_services.get_model_details_from_model_service(
                models_list, request_id, user_id
            )
        )
    except Exception as e:
        raise HTTPException(detail=str(e), status_code=500)

    model_response = []

    for model in models_details:
        try:
            model_owner_details = await cart_services.get_model_details(
                models_details_from_models_service, model["modelId"]
            )
        except Exception as e:
            logger.error(str(e))
            raise HTTPException(detail="Internal server Error", status_code=500)

        model_response.append(
            PurchasedModel(
                userId=user_id,
                modelId=model["modelId"],
                quantity=model["quantity"],
                modelName=model_owner_details["itemName"],
                modelDp=model_owner_details["itemDp"],
                artistName=model_owner_details["artistName"],
                artistDp=model_owner_details["artistDp"],
                timeOfPurchase=model["timeOfPurchase"],
            )
        )

    logger.debug(f"Processed Models data recieved succesfully for userId :{user_id}")
    return model_response


async def get_purchased_campaigns(
    request: Request, page_size: int, page_number: int
) -> List[PurchasedCampaign]:
    user_id = request.state.user_id
    request_id = request.state.x_request_id
    try:
        order_ids = cart_services.get_orders_from_map_unpaginated(user_id)
    except Exception as e:
        logger.error(str(e))
        raise HTTPException(detail=str(e), status_code=500)

    tiers_list, tier_details = cart_services.get_tiers_from_order_ids(order_ids)
    print(tiers_list, tier_details)

    try:
        tier_details_from_campaign_service = (
            await cart_services.get_tier_details_from_campaign_service(
                tiers_list, request_id, user_id
            )
        )
    except Exception as e:
        raise HTTPException(detail=str(e), status_code=500)

    try:
        campaign_map = cart_services.transform_to_purchased_campaign(
            tier_details_from_campaign_service
        )
    except Exception as e:
        raise HTTPException(detail=str(e), status_code=500)

    result = [PurchasedCampaign(**value) for value in campaign_map.values()]

    start_idx = (page_number - 1) * page_size
    end_idx = start_idx + page_size

    return result[start_idx:end_idx]


async def get_purchased_tier_by_campaign_id(
    request: Request, campaign_id: str, pagesize: int, pagenumber: int
) -> List[PurchasedTier]:
    user_id = request.state.user_id
    request_id = request.state.x_request_id
    try:
        order_ids = cart_services.get_orders_from_map_unpaginated(user_id)
    except Exception as e:
        logger.error(str(e))
        raise HTTPException(detail=str(e), status_code=500)

    tiers_list, tier_details = cart_services.get_tiers_from_order_ids(order_ids)
    print(tiers_list, tier_details)

    try:
        tier_details_from_campaign_service = (
            await cart_services.get_tier_details_from_campaign_service(
                tiers_list, request_id, user_id
            )
        )
    except Exception as e:
        raise HTTPException(detail=str(e), status_code=500)

    purchased_tiers = []

    filtered_tiers = [
        tier
        for tier in tier_details_from_campaign_service
        if tier["campaignId"] == campaign_id
    ]

    start_idx = (pagenumber - 1) * pagesize
    end_idx = start_idx + pagesize
    paginated_tiers = filtered_tiers[start_idx:end_idx]

    if not paginated_tiers:
        logger.error(f"No tier present for campaignId:{campaign_id}")
        raise HTTPException(
            detail=f"No tier present for campaignId:{campaign_id}", status_code=404
        )

    for tier_data in paginated_tiers:
        purchased_tier = PurchasedTier(
            userId=tier_data["userId"],
            tierId=tier_data["tierId"],
            tierName=tier_data["tierTitle"],
            tierDp=tier_data["tierDp"],
            artistName=tier_data["userData"]["username"],
            artistDp=tier_data["userData"]["displayInformation"]["profilePicture"][
                "pictureUrl"
            ],
            modelsCount=len(tier_data["modelIds"]),
        )

        purchased_tiers.append(purchased_tier)

    return purchased_tiers


async def add_to_cart(item: ItemRequestWithoutQuantity, request: Request) -> dict:
    user_id = request.state.user_id
    item_id = item.itemId
    item_type = item.itemType

    # Getting the details of the item using item id
    try:
        details = cart_services.get_details_of_item(item_id, item_type)
    except Exception as e:
        logger.error(str(e))
        raise HTTPException(detail=str(e), status_code=404)

    logger.debug(f"Given Item is of type {item_type} ")
    existing_cart_id = cart_services.cart_present(user_id)

    # If cart is present then we have to check if the item is already present in the cart
    if existing_cart_id:
        is_present = cart_services.is_already_present_item(existing_cart_id, item_id)
        if is_present:
            logger.debug(
                f"Item already present in cart for itemId:{item_id} , cart_id:{existing_cart_id}"
            )
            return {
                "detail": "Item already present in cart",
                "item_id": item_id,
                "cart_id": existing_cart_id,
            }

        # If item is not present then we have to add the item to the cart

        try:
            updated_result = cart_services.add_to_existing_cart_id_cart(
                existing_cart_id, item_id, item_type, details
            )
        except Exception as e:
            logger.error(str(e))
            raise HTTPException(detail=str(e), status_code=404)

        logger.debug(
            f"Item added to cart for cart_id {existing_cart_id} , itemId:{item_id}"
        )
        return {"detail": "Item added to cart", "cart_id": existing_cart_id}

    # If cart is not present then we have to create a new cart and add the item to it
    try:
        id = cart_services.create_cart_and_add_item(
            user_id, item_id, item_type, details
        )
    except Exception as e:
        logger.error(str(e))
        raise HTTPException(detail=str(e), status_code=404)

    logger.debug(f"Cart created with cartId:{id} , for itemId:{item_id}")
    logger.info(f"{prefix}/{item_id} Api Executed for userId:{user_id}")

    return {"detail": "Cart created Successfully", "cart_id": id}


async def put_item_in_cart(request: Request, item: ItemRequest) -> dict:
    user_id = request.state.user_id
    item_id = item.itemId
    item_type = item.itemType
    quantity = item.quantity

    logger.info(
        f"{prefix}/cart Api called for updating tier of userId:{user_id} and itemId:{item_id}"
    )

    # Getting the details of the item using item id
    try:
        details = cart_services.get_details_of_item(item_id, item_type)
    except Exception as e:
        logger.error(str(e))
        raise HTTPException(detail=str(e), status_code=404)

    existing_cart_id = cart_services.cart_present(user_id)
    logger.debug(
        f"cartId => {existing_cart_id} recieved succesfully for usedId:{user_id}"
    )

    if not existing_cart_id:
        logger.error("Cart not Activated")
        raise HTTPException(detail="Cart not Activated", status_code=404)

    is_present = cart_services.is_already_present_item(existing_cart_id, item_id)

    if is_present:
        logger.debug(
            f"Item already present in cart for itemId:{item_id} , cart_id:{existing_cart_id}"
        )
        raise HTTPException(detail="Item already present in cart", status_code=409)

        # modified_count = cart_services.increase_items(existing_cart_id,item_id,quantity)
        # logger.debug(f"Incremented Item Count successfully for item_id:{item_id}")
        # return {"detail":"Incremented Item Count successfully"}
    try:
        cart_services.add_to_existing_cart_id_cart(existing_cart_id, item_id, item_type, details,quantity)
    except Exception as e:
        raise HTTPException(detail = "Internal Server Error", status_code=500)
    
    logger.debug(f"New Item Added to cart for itemId:{item_id}")
    logger.info(
        f"{prefix}/cart/{item_id} Api Executed userId:{user_id} and item_id:{item_id}"
    )
    return {"detail": "New Item Added to cart"}


async def delete_single_item_from_cart(item_id: str, request: Request) -> dict:
    user_id = request.state.user_id
    logger.info(
        f"{prefix}/cart/{item_id} Api called for deleting tier of userId:{user_id} and tierId:{item_id}"
    )

    try:
        existing_cart_id = cart_services.cart_present(user_id)
    except Exception as e:
        raise HTTPException(detail=str(e), status_code=500)

    logger.debug(
        f"cartId => {existing_cart_id} recieved succesfully for usedId:{user_id}"
    )

    if not existing_cart_id:
        logger.debug(
            f"Cart Empty, No items present for item_id:{item_id} , cart_id:{existing_cart_id}"
        )
        raise HTTPException(detail="Cart Empty, No items present", status_code=404)

    is_present = cart_services.is_already_present_item(existing_cart_id, item_id)

    if is_present:
        try:
            modified_count = cart_services.delete_item(existing_cart_id, item_id)
        except Exception as e:
            logger.error(str(e))
            raise HTTPException(detail=str(e), status_code=500)

        logger.debug(
            f"Tier removed succesfully from cartId:{existing_cart_id} of tierId:{item_id}"
        )
        logger.info(f"{prefix}/{item_id} Api Executed for userId:{user_id}")
        return {"detail": "Deleted Successfully"}
    else:
        logger.error(f"No item with id {item_id} present")
        raise HTTPException(
            detail=f"No item with id {item_id} present", status_code=404
        )


async def delete_all_items_from_cart(item_id: str, request: Request) -> dict:
    user_id = request.state.user_id
    logger.info(
        f"{prefix}/cart/all/{item_id} Api called for deleting all items from tier of userId:{user_id} and item_id:{item_id}"
    )

    try:
        existing_cart_id = cart_services.cart_present(user_id)
    except Exception as e:
        raise HTTPException(detail=str(e), status_code=500)

    logger.debug(
        f"cartId => {existing_cart_id} recieved succesfully for usedId:{user_id}"
    )

    if not existing_cart_id:
        logger.debug(f"Cart Empty, No items present for tierId:{item_id}")
        raise HTTPException(detail="Cart Empty, No items present", status_code=404)

    is_present = cart_services.is_already_present_item(existing_cart_id, item_id)

    if is_present:
        try:
            modified_count = cart_services.delete_all_items(existing_cart_id, item_id)
        except Exception as e:
            logger.error(str(e))
            raise HTTPException(detail=str(e), status_code=500)

        logger.info(f"{prefix}/{item_id} Api Executed for userId:{user_id}")
        return {"detail": f"Deleted all items with item_id {item_id}"}
    else:
        logger.error(
            f"{prefix}/cart/all/{item_id} Api  Executed for  userId:{user_id} and item_id:{item_id}"
        )
        raise HTTPException(
            detail=f"No item with id {item_id} present", status_code=404
        )


async def save_for_later(item: ItemRequestWithoutQuantity, request: Request) -> dict:
    user_id = request.state.user_id
    item_id = item.itemId
    item_type = item.itemType.value

    logger.info(
        f"{prefix}/cart/save-for-later/{item_id} Api called for updating item of  userId:{user_id} and item_id:{item_id}"
    )

    existing_cart_id = cart_services.cart_present(user_id)
    logger.debug(
        f"cartId => {existing_cart_id} recieved succesfully for usedId:{user_id}"
    )
    quantity = 1

    if existing_cart_id:
        is_present = cart_services.is_already_present_item(existing_cart_id, item_id)

        if is_present:
            quantity = cart_services.aggregation_pipline(item_id, existing_cart_id)[0][
                "quantity"
            ]
            item_type = cart_services.aggregation_pipline(item_id, existing_cart_id)[0][
                "itemType"
            ]
            print(quantity, item_type)
            res = cart_services.delete_all_items(existing_cart_id, item_id)
        else:
            logger.error(f"Item with id {item_id} not present in cart")
            raise HTTPException(
                detail=f"Item with id {item_id} not present in cart", status_code=404
            )

    try:
        cart_services.add_to_save_for_later(user_id, item_id, item_type, quantity)
        logger.debug(f"item_id:{item_id}Added to save for later for userId:{user_id} ")

    except Exception as e:
        logger.error(str(e))
        raise HTTPException(detail=str(e), status_code=404)

    logger.info(
        f"{prefix}/cart/save-for-later/{item_id} Api Executed for userId:{user_id} and tierId:{item_id}"
    )

    return {"detail": "Item added to save later successfully"}


async def move_to_cart(item_id: str, request: Request) -> dict:
    user_id = request.state.user_id
    logger.info(
        f"{prefix}/cart/move-to-cart/{item_id} Api called for adding item of userId:{user_id} and item_id:{item_id}"
    )

    try:
        check = cart_services.check_if_item_in_save_for_later(user_id, item_id)

    except Exception as e:
        logger.error(str(e))
        raise HTTPException(detail=str(e), status_code=500)

    if not check:
        logger.error(f"Item not present in Save-For-Later for item_id:{item_id}")
        raise HTTPException(
            detail="Item not present in Save-For-Later", status_code=404
        )

    quantity = cart_services.aggregation_pipline_for_save_later(item_id)[0]["quantity"]
    item_type = cart_services.aggregation_pipline_for_save_later(item_id)[0]["itemType"]
    item_type = Item_type(item_type)

    try:
        details = cart_services.get_details_of_item(item_id, item_type)
    except Exception as e:
        logger.error(str(e))
        raise HTTPException(detail=str(e), status_code=404)

    existing_cart_id = cart_services.cart_present(user_id)

    logger.debug(
        f"cartId => {existing_cart_id} recieved succesfully for usedId:{user_id}"
    )

    if not existing_cart_id:
        # Getting the details of the item using item id

        # id = cart_services.create_cart_and_add_from_save_later(user_id, item_id, item_type, quantity)
        id = cart_services.create_cart_and_add_item(
            user_id, item_id, item_type, details, quantity
        )

        logger.debug(
            f"Cart Created And added to save for later for item_type:{item_type}"
        )
    else:
        try:
            modified_count = cart_services.add_to_existing_cart_id_cart(
                existing_cart_id, item_id, item_type, details, quantity
            )
        except Exception as e:
            logger.error(str(e))
            raise HTTPException(detail=str(e), status_code=404)

        logger.debug(f"Card updated And add to save for later for tier:{item_id}")

    cart_services.delete_item_from_save_later(user_id, item_id)

    logger.debug(
        f"Item with Id {item_id} and quantity {quantity} moved to cart successfully"
    )
    logger.info(
        f"{prefix}/cart/move-to-cart/{item_id} Api Executed for userId:{user_id} and item_id:{item_id}"
    )
    return {
        "detail": f"Item with Id {item_id} and quantity {quantity} moved to cart successfully"
    }


def delete_from_save_from_later(item_id: str, request: Request) -> dict:
    user_id = request.state.user_id
    logger.info(
        f"{prefix}/cart/save-for-later/{item_id} Api called to delete save for later for  item_id:{item_id}  , userId:{user_id}"
    )
    try:
        check = cart_services.check_if_item_in_save_for_later(user_id, item_id)
    except Exception as e:
        raise HTTPException(detail=str(e), status_code=404)
    if not check:
        logger.error(str(e))
        raise HTTPException(
            detail="Item not present in Save-For-Later", status_code=404
        )
    cart_services.delete_item_from_save_later(user_id, item_id)
    logger.info(
        f"{prefix}/cart/move-to-cart/{item_id} Api Executed for  userId:{user_id} and item_id:{item_id}"
    )
    return {
        "detail": f"Item with id {item_id} deleted from save-for-later successfully"
    }


async def delete_the_cart(request: Request) -> dict:
    user_id = request.state.user_id
    logger.info(f"{prefix}/cart Api called to delete the cart for userId:{user_id}")
    existing_cart_id = cart_services.cart_present(user_id)
    logger.debug(
        f"cartId => {existing_cart_id} recieved succesfully for userId:{user_id}"
    )
    if existing_cart_id:
        cart_services.delete_entire_cart(existing_cart_id)
        logger.debug(f"Cart with Id {existing_cart_id} deleted")
        return {"detail": f"Cart with Id {existing_cart_id} deleted"}
    logger.info(f"{prefix}/cart Api Executed for  userId:{user_id}")
    return {"detail": "No cart present"}


def buy_now(request: Request, item: ItemRequest) -> dict:
    user_id = request.state.user_id
    item_id = item.itemId
    item_type = item.itemType
    quantity = item.quantity

    # Getting the details of the item using item id
    try:
        details = cart_services.get_details_of_item(item_id, item_type)
    except Exception as e:
        logger.error(str(e))
        raise HTTPException(status_code=404, detail="Item not found")

    try:
        tempCartId = cart_services.create_temp_cart_and_add_item(
            user_id, item_id, item_type, details, quantity
        )
    except Exception as e:
        logger.error(str(e))
        raise HTTPException(status_code=500, detail="Internal Server Error")

    # Now we have to add the same item to our permanent/regular cart

    # First check wheather the user has a cart or not
    existing_cart_id = cart_services.cart_present(user_id)

    # If cart is present then we have to check if the item is already present in the cart
    if existing_cart_id:
        is_present = cart_services.is_already_present_item(existing_cart_id, item_id)

        # If item is already present in the permanent cart then we are not again adding it. This was decided by the team, and it can be changed later on. We can also increment the quantity of the item in the cart

        if is_present:
            logger.debug(
                f"Item already present in cart for itemId:{item_id} , cart_id:{existing_cart_id}"
            )
        else:
            # If item is not present then we have to add the item to the cart
            try:
                updated_result = cart_services.add_to_existing_cart_id_cart(
                    existing_cart_id, item_id, item_type, details, quantity
                )
            except Exception as e:
                logger.error(str(e))
                raise HTTPException(detail="Internal Server error", status_code=500)

            logger.debug(
                f"Item added to cart for cart_id {existing_cart_id} , itemId:{item_id}"
            )

    else:
        # If cart is not present then we have to create a new cart and add the item to it
        try:
            new_cart_id = cart_services.create_cart_and_add_item(
                user_id, item_id, item_type, details, quantity
            )
        except Exception as e:
            logger.error(str(e))
            raise HTTPException(status_code=500, detail="Internal Server Error")

    # TODO: We have to process the purchase and as of now payment service is not available so we are not doing it now. Payment service will gives the order confirmation id which we will store in the order collection and also in the map collection

    # Processing the order

    # get temp cart details from temp cart id
    try:
        tempCart = cart_services.get_temp_cart(tempCartId)
        logger.debug(f"cart details recieved succesfully for temp cartId:{tempCart}")
    except Exception as e:
        logger.error(str(e))
        raise HTTPException(status_code=500, detail="Internal Server Error")

    # Process the temp cart, delete the temp cart add it to processed cart create order object and return the order id
    try:
        order_id = str(cart_services.proces_order_for_temp_cart(tempCart))
    except Exception as e:
        logger.error(str(e))
        raise HTTPException(status_code=500, detail="Internal Server Error")

    # map the order id and user id
    try:
        cart_services.map_user_id_and_order_id(user_id, order_id)
    except Exception as e:
        logger.error(str(e))
        raise HTTPException(status_code=500, detail="Internal Server Error")

    # pull the item from regular/permanent cart if it is present
    if existing_cart_id:
        try:
            cart_services.delete_item(existing_cart_id, item_id)
        except Exception as e:
            logger.error(str(e))
            raise HTTPException(status_code=500, detail="Internal Server Error")
    else:
        try:
            cart_services.delete_item(new_cart_id, item_id)
        except Exception as e:
            logger.error(str(e))
            raise HTTPException(status_code=500, detail="Internal Server Error")

    return {"detail": "Direct Order Successfull", "orderId": f"{order_id}"}


def buy_cart(cart: PurchaseCart, request: Request) -> dict:
    cart = cart.cartId
    user_id = request.state.user_id
    logger.info(f"{prefix}/{cart}/order Api called for:{user_id} , cart:{cart}")
    try:
        cart = cart_services.get_cart(cart)
        logger.debug(f"cart details recieved succesfully for cartId:{cart}")
    except Exception as e:
        logger.error(str(e))
        raise HTTPException(detail=str(e), status_code=404)
    id = str(cart_services.proces_order_for_cart(cart))
    cart_services.map_user_id_and_order_id(user_id, id)
    logger.debug(f"Cart ordered succcesfully with orderId:{id}")
    logger.info(f"{prefix}/{cart}/order Api Executed for:{user_id} , cart:{cart}")
    return {"detail": "Cart Order Successfull", "orderId": f"{id}"}


def get_orders(request: Request):
    user_id = request.state.user_id
    logger.info(f"{prefix}/orders/campaign/  Api called for:{user_id}")
    order_ids = cart_services.get_orders_from_map(user_id)
    logger.debug(f"Order Ids recieced succesfully for userId:{user_id}")
    response = set()
    for order in order_ids:
        id = order["orderId"]
        order_details = cart_services.get_orders_from_order_coll(id)
        items = order_details["items"]
        for item in items:
            response.add(item["campaignId"])

    logger.info(f"{prefix}/orders/campaign/  Api Executed for:{user_id}")
    return list(response)


def get_processed_carts(
    request: Request, page_size: int, page_number: int
) -> List[ProcessedCart]:
    user_id = request.state.user_id
    logger.info(
        f"{prefix}/cart Api called for getting cart details for userId:{user_id}"
    )
    carts = list(
        cart_services.get_documemt_from_processed_carts(user_id, page_size, page_number)
    )

    if not carts:
        logger.error(
            f"No processed cart found for page_number:{page_number} and page_size:{page_size} for userId:{user_id}"
        )
        raise HTTPException(status_code=404, detail="No processed cart found")

    response = []
    for cart in carts:
        item_respnse = []
        items = cart["items"]

        for item in items:
            item_respnse.append(
                ProcessedItem(
                    itemId=item["itemId"],
                    itemType=item["itemType"],
                    price=item["price"],
                    currency=item["currency"],
                    quantity=item["quantity"],
                    addedOn=item["addedOn"],
                    lastUpdated=item["lastUpdated"],
                )
            )

        # Create an instance of the Cart model
        res = ProcessedCart(
            cartId=str(cart["_id"]),
            userId=str(cart["userId"]),
            items=item_respnse,
            createdAt=cart["createdAt"],
            updatedAt=cart["lastUpdated"],
        )
        response.append(res)

    logger.debug(f"Cart details received successfully for userId:{user_id}")
    logger.info(f"{prefix}/cart Api called Executed for userId:{user_id}")
    return response


def send_abandoned_cart_email():
    abandoned_carts = cart_services.get_abandoned_cart_list()
    cart_services.send_abandon_cart_emails(abandoned_carts)
    return abandoned_carts


def delete_order(order_id: str, request: Request) -> dict:
    user_id = request.state.user_id
    logger.info(
        f"{prefix}/orders/{order_id} Api called for cancelling order for userId:{user_id} and orderId:{order_id}"
    )
    try:
        user_id_from_map = cart_services.get_user_id_from_map(order_id)
    except Exception as e:
        logger.error(str(e))
        raise HTTPException(detail="Internal server error", status_code=500)

    if user_id_from_map != user_id:
        logger.error(
            f"User Id:{user_id} not authorized to cancel order with orderId:{order_id}"
        )
        raise HTTPException(
            detail="User not authorized to cancel order", status_code=401
        )

    try:
        cart_services.cancel_order(order_id)
    except Exception as e:
        logger.error(str(e))
        raise HTTPException(detail=str(e), status_code=404)
    logger.debug(f"Order with orderId:{order_id} cancelled successfully")
    logger.info(
        f"{prefix}/orders/{order_id} Api Executed for cancelling order for userId:{user_id} and orderId:{order_id}"
    )
    return {"detail": f"Order with orderId:{order_id} cancelled successfully"}


async def add_to_wishlist(item:WishlistItemRequest,
                    request:Request)-> dict:
    
    user_id = request.state.user_id
    item_id = item.itemId
    item_type = item.itemType.value

    logger.info(
        f"{prefix}/wishlist/{item_id} Api called for adding item to wishlist for userId:{user_id} and itemId:{item_id}"
    )
    # Check wheather the wishlist for current user is present

    existing_wishlist_id = cart_services.wishlist_present(user_id)
    # If wishlist is present then we have to check if the item is already present in the wishlist

    if existing_wishlist_id:
        is_present = cart_services.is_already_present_item_in_wishlist(
            existing_wishlist_id, item_id
        )
        print(is_present)
        if is_present:
            logger.debug(
                f"Item already present in wishlist for itemId:{item_id} , wishlist_id:{existing_wishlist_id}"
            )
            return {
                "detail": "Item already present in wishlist",
                "item_id": item_id,
                "wishlist_id": existing_wishlist_id,
            }

        # If item is not present then we have to add the item to the wishlist
        try:
            updated_result = cart_services.add_to_existing_wishlist(
                existing_wishlist_id, item_id, item_type
            )
        except Exception as e:
            logger.error(str(e))
            raise HTTPException(detail=str(e), status_code=500)

        logger.debug(
            f"Item added to wishlist for wishlist_id {existing_wishlist_id} , itemId:{item_id}"
        )
        return {"detail": "Item added to wishlist", "wishlist_id": existing_wishlist_id}

    # If wishlist is not present then we have to create a new wishlist and add the item to it
    try:
        id = cart_services.create_wishlist_and_add_item(user_id, item_id, item_type)
    except Exception as e:
        logger.error(str(e))
        raise HTTPException(detail=str(e),status_code=500)
    
    # If item is campaign then adding it to the campaign Db usin interAPI call

    if item_type=="CAMPAIGN":
        try:
            await cart_services.add_wishlisted_campaign_to_campaign_db(item_id,user_id,request)
        except Exception as e:
            raise HTTPException(detail=str(e),status_code=500)
    
    logger.debug(f"Wishlist created with wishlistId:{id} , for itemId:{item_id}")
    logger.info(
        f"{prefix}/wishlist/{item_id} Api Executed for userId:{user_id} and itemId:{item_id}"
    )
    return {
        "detail": f"Wishlist with id {id} created Successfully and item with id {item_id} also added "
    }


def delete_from_save_from_later(item_id: str, request: Request) -> dict:
    user_id = request.state.user_id
    logger.info(
        f"{prefix}/cart/save-for-later/{item_id} Api called to delete save for later for  item_id:{item_id}  , userId:{user_id}"
    )
    try:
        check = cart_services.check_if_item_in_save_for_later(user_id, item_id)
    except Exception as e:
        raise HTTPException(detail=str(e), status_code=404)
    if not check:
        logger.error(str(e))
        raise HTTPException(
            detail="Item not present in Save-For-Later", status_code=404
        )
    cart_services.delete_item_from_save_later(user_id, item_id)
    logger.info(
        f"{prefix}/cart/move-to-cart/{item_id} Api Executed for  userId:{user_id} and item_id:{item_id}"
    )
    return {
        "detail": f"Item with id {item_id} deleted from save-for-later successfully"
    }


def delete_item_from_wishlist(item_id: str, request: Request) -> dict:
    user_id = request.state.user_id
    logger.info(
        f"{prefix}/wishlist/{item_id} Api called to delete item from wishlist for  item_id:{item_id}  , userId:{user_id}"
    )
    try:
        check = cart_services.check_if_item_in_wishlist(user_id, item_id)
    except Exception as e:
        raise HTTPException(detail=str(e), status_code=404)

    if not check:
        logger.error(str(e))
        raise HTTPException(detail="Item not present in wishlist", status_code=404)

    cart_services.delete_item_from_wishlist(user_id, item_id)
    logger.info(
        f"{prefix}/wishlist/{item_id} Api Executed for  userId:{user_id} and item_id:{item_id}"
    )
    return {"detail": f"Item with id {item_id} deleted from wishlist successfully"}


async def delete_the_cart(request: Request) -> dict:
    user_id = request.state.user_id
    logger.info(f"{prefix}/cart Api called to delete the cart for userId:{user_id}")
    existing_cart_id = cart_services.cart_present(user_id)
    logger.debug(
        f"cartId => {existing_cart_id} recieved succesfully for userId:{user_id}"
    )
    if existing_cart_id:
        cart_services.delete_entire_cart(existing_cart_id)
        logger.debug(f"Cart with Id {existing_cart_id} deleted")
        return {"detail": f"Cart with Id {existing_cart_id} deleted"}
    logger.info(f"{prefix}/cart Api Executed for  userId:{user_id}")
    return {"detail": "No cart present"}


def delete_the_wishlist(request: str) -> dict:
    user_id = request.state.user_id
    logger.info(
        f"{prefix}/wishlist Api called to delete the wishlist for userId:{user_id}"
    )
    existing_wishlist_id = cart_services.wishlist_present(user_id)
    logger.debug(
        f"cartId => {existing_wishlist_id} recieved succesfully for userId:{user_id}"
    )
    if existing_wishlist_id:
        cart_services.delete_entire_wishlist(existing_wishlist_id)
        logger.debug(f"Wishlist with Id {existing_wishlist_id} deleted")
        return {"detail": f"Wishlist with Id {existing_wishlist_id} deleted"}
    logger.info(f"{prefix}/wishlist Api Executed for  userId:{user_id}")
    return {"detail": "No wishlist present"}


def move_wishlist_item_to_cart(item_id: str, request: Request) -> dict:
    user_id = request.state.user_id
    logger.info(
        f"{prefix}/wishlist/move-to-cart/{item_id} Api called for adding item of userId:{user_id} and item_id:{item_id}"
    )

    try:
        check = cart_services.check_if_item_in_wishlist(user_id, item_id)
    except Exception as e:
        logger.error(str(e))
        raise HTTPException(detail="Internal server Error", status_code=404)

    if not check:
        logger.error(str(e))
        raise HTTPException(detail="Item not present in wishlist", status_code=404)

    item_type = cart_services.aggregation_pipline_for_wishlist(item_id)[0]["itemType"]
    item_type = Item_type(item_type)
    quantity = 1

    try:
        details = cart_services.get_details_of_item(item_id, item_type)
    except Exception as e:
        logger.error(str(e))
        raise HTTPException(detail=str(e), status_code=404)

    existing_cart_id = cart_services.cart_present(user_id)

    logger.debug(
        f"cartId => {existing_cart_id} recieved succesfully for usedId:{user_id}"
    )

    if not existing_cart_id:
        # Getting the details of the item using item id

        # id = cart_services.create_cart_and_add_from_save_later(user_id, item_id, item_type, quantity)
        id = cart_services.create_cart_and_add_item(
            user_id, item_id, item_type, details, quantity
        )
        logger.debug(
            f"Cart Created And added to save for later for item_type:{item_type}"
        )

    else:
        try:
            check = cart_services.is_already_present_item(existing_cart_id, item_id)
        except Exception as e:
            logger.error(str(e))
            raise HTTPException(detail=str(e), status_code=500)

        if check:
            logger.error(
                f"Item already present in cart for itemId:{item_id} , cart_id:{existing_cart_id}"
            )
            raise HTTPException(detail="Item already present in cart", status_code=409)

        try:
            modified_count = cart_services.add_to_existing_cart_id_cart(
                existing_cart_id, item_id, item_type, details, quantity
            )
        except Exception as e:
            logger.error(str(e))
            raise HTTPException(detail=str(e), status_code=404)

        logger.debug(f"Cart updated And add to save for later for tier:{item_id}")

    logger.debug(
        f"Item with Id {item_id} and quantity {quantity} moved to cart successfully"
    )
    logger.info(
        f"{prefix}/wishlist/move-to-cart/{item_id} Api Executed for userId:{user_id} and item_id:{item_id}"
    )
    return {
        "detail": f"Item with Id {item_id} and quantity {quantity} moved to cart successfully"
    }



