from services import cart_db_services
import datetime
from db.models.Cart import Item_type
from datetime import  timedelta
from config import read_yaml
from services import m2m_calls
from typing import List
from db.models.Cart import PurchasedCampaign
import sib_api_v3_sdk
from sib_api_v3_sdk.rest import ApiException
from jinja2 import Environment, FileSystemLoader
import os
from fastapi import HTTPException,status
from logger.logging import get_logger
logger = get_logger(__name__)

def get_details_of_item(item_id,item_type):

    if item_type==Item_type.MODEL:
        try:
            return cart_db_services.get_model_details(item_id)
        except Exception as e:
            raise Exception("Invalid item_type")
        
    elif item_type==Item_type.TIER:
        try:
            return get_tier(item_id)
        except Exception as e:
            raise Exception("Invalid item_type")
    else:
        raise Exception("Invalid item_type")


def check_item_type_and_return_details(item_id):
    # First check if item is a model
    model_details = cart_db_services.get_model_details(item_id)
    if model_details:
        return Item_type.MODEL, model_details
    else:
        # Then check if item is a tier
        try:
            tier_details = get_tier(item_id)
        except Exception as e:
            raise Exception(e)
        
        if tier_details:
            return Item_type.TIER, tier_details
        else:
            # If item is neither a model nor a tier, raise an exception
            raise Exception("Invalid item_id")



def create_item(item_id,item_type,details,quantity=1):

    if item_type==Item_type.MODEL:
        price = details['price']
        currency = details['currency']
    else:   
        price = details['tierAmount']
        currency = details['tierCurrency']


    item = {
        "itemId": item_id,
        "itemType": item_type.value,
        "price": float(price),
        "currency": currency,
        "quantity": quantity,
        "addedOn": datetime.datetime.utcnow(),
        "lastUpdated": datetime.datetime.utcnow()
    }
    return item


def get_document_from_cart(user_id):
    return cart_db_services.get_cart_from_user_id(user_id)

def get_document_from_wishlist(user_id):
    return cart_db_services.get_wishlist_from_userid(user_id)

def get_documemt_from_processed_carts(user_id,page_size:int=1,page_number:int=1):
    return cart_db_services.get_processed_carts_from_user_id(user_id,page_size,page_number)

def aggregation_pipline(item_id,cart_id):
    return cart_db_services.get_pipleine_result_for_cart(item_id,cart_id)

def aggregation_pipline_for_save_later(item_id):
    return cart_db_services.get_pipleine_result_for_save_later(item_id)

def aggregation_pipline_for_wishlist(item_id):
    return cart_db_services.get_pipleine_result_for_wishlist(item_id)


def get_tier(tier_id):
    result = cart_db_services.get_campaign_from_tier(tier_id)
    if result and 'rewardAndTier' in result:
        return result['rewardAndTier'][0]
    else:
        raise Exception("Invalid Tier Id")
    

def get_cart(cart_id):
    cart = cart_db_services.get_cart_from_cart_id(cart_id)
    if not cart:
        raise Exception("Invalid cart_id")
    return cart


def get_temp_cart(cart_id):
    cart = cart_db_services.get_temp_cart_from_cart_id(cart_id)
    if not cart:
        raise Exception("Invalid cart_id")
    return cart


def create_cart_and_add_item(user_id,item_id,item_type,details,quantity=1):
    try:
        item = create_item(item_id,item_type,details,quantity)
    except Exception as e:
        raise Exception(e)
    document = {
        "userId":user_id,
        "createdAt":datetime.datetime.utcnow(),
        "lastUpdated":datetime.datetime.utcnow(),
        "items":[item]
    }
    return str(cart_db_services.insert_new_document(document).inserted_id)


def create_wishlist_and_add_item(user_id,item_id,item_type):
    item = {"itemId":item_id,"itemType":item_type,"addedOn":datetime.datetime.utcnow(),"lastUpdated":datetime.datetime.utcnow()}
    document = {
        "userId":user_id,
        "createdAt":datetime.datetime.utcnow(),
        "lastUpdated":datetime.datetime.utcnow(),
        "items":[item]
    }
    return str(cart_db_services.insert_new_document_into_wishlist(document).inserted_id)


def create_temp_cart_and_add_item(user_id,item_id,item_type,details,quantity):
    try:
        item = create_item(item_id,item_type,details,quantity)
    except Exception as e:
        raise Exception(e)
    document = {
        "userId":user_id,
        "createdAt":datetime.datetime.utcnow(),
        "lastUpdated":datetime.datetime.utcnow(),
        "items":[item]
    }
    return str(cart_db_services.insert_new_document_into_temp_cart(document).inserted_id)


def cart_present(user_id):
    res = cart_db_services.get_cart_from_user_id(user_id)
    if res:
        return str(res["_id"])
    return False

def wishlist_present(user_id):
    res = cart_db_services.get_wishlist_from_userid(user_id)
    if res:
        return str(res["_id"])
    return False

def add_to_existing_cart_id_cart(cart_id,item_id,item_type,details,quantity=1):
    item = create_item(item_id,item_type,details,quantity)
    try:
        return cart_db_services.push_item_to_cart(item,cart_id)
    except Exception as e:
        logger.error(e)
        raise Exception(e)
    
    
def add_to_existing_wishlist(existing_wishlist_id,item_id,item_type):
    try:
        return cart_db_services.push_item_to_wishlist(item_id,item_type,existing_wishlist_id)
    except Exception as e:
        raise Exception(e)


def is_already_present_item(cart_id,item_id):
    result = list(cart_db_services.get_cart_from_item_id(cart_id,item_id))
    if len(result): return True
    else: return False

def is_already_present_item_in_wishlist(existing_wishlist_id,item_id):
    result = list(cart_db_services.get_wishlist_from_item_id(existing_wishlist_id,item_id))
    if len(result): return True
    else: return False

def increase_items(cart_id,item_id,quantity):
    # price = aggregation_pipline(item_id, cart_id)[0]['price']
    update_result = cart_db_services.update_item_in_cart(quantity,cart_id,item_id)
    return update_result


def delete_item(cart_id,item_id):
    quantity = aggregation_pipline(item_id,cart_id)[0]['quantity']
    # price = aggregation_pipline(item_id,cart_id)[0]['price']
    print(quantity)
    if quantity==1:
        update_result=cart_db_services.pull_and_decrement_from_cart(item_id,cart_id)
    else:
        update_result=cart_db_services.decrement_item_from_cart(item_id,cart_id)
    if update_result.modified_count==0:
        raise Exception("No deletion action performed")
    
    return update_result.modified_count

def delete_all_items(cart_id,item_id):
    # quantity = aggregation_pipline(item_id,cart_id)[0]['quantity']
    # price = aggregation_pipline(item_id,cart_id)[0]['price']

    update_result = cart_db_services.pull_and_decrement_from_cart(item_id, cart_id)
    if update_result.modified_count == 0:
        raise Exception("No deletion action performed")
    return update_result.modified_count

def delete_entire_cart(cart_id):
    cart_db_services.delete_document_from_cart(cart_id)

def delete_entire_wishlist(existing_wishlist_id):
    cart_db_services.delete_document_from_wishlist(existing_wishlist_id)

def get_document_from_save_later(user_id):
    return cart_db_services.get_save_for_later(user_id)

def already_present_in_save_later(user_id,item_id):
    result = list(cart_db_services.get_save_later_using_item_id(user_id,item_id))
    if len(result):return True
    else:return False

def add_to_save_for_later(user_id,item_id,item_type,quantity):
    res = cart_db_services.get_save_later_using_user_id(user_id)
    
    if not res:
        document = {"userId":user_id, "createdAt":datetime.datetime.utcnow(),"lastUpdated":datetime.datetime.utcnow(),"items":[]}

        cart_db_services.insert_into_save_later(document)

    if not already_present_in_save_later(user_id,item_id):
        item = {"itemId":item_id,
                "itemType":item_type,
                "quantity":quantity,
                "addedOn":datetime.datetime.utcnow(),
                "lastUpdated":datetime.datetime.utcnow()}
        
        cart_db_services.push_item_into_save_for_later(user_id,item)
    else:
        raise Exception("Already present in Save For Later")


def delete_item_from_save_later(user_id, item_id):
    cart_db_services.pull_item_from_save_for_later(user_id,item_id)
    items = cart_db_services.get_save_for_later(user_id)['items']
    if not items: cart_db_services.delete_from_save_for_later(user_id)

def delete_item_from_wishlist(user_id, item_id):
    cart_db_services.pull_item_from_wishlist(user_id,item_id)
    items = cart_db_services.get_wishlist_from_userid(user_id)['items']
    if not items: cart_db_services.delete_from_wishlist(user_id)

def check_if_item_in_save_for_later(user_id,item_id):
    stl = cart_db_services.get_save_for_later(user_id)
    if not stl: raise Exception("No save for later Present")
    res = already_present_in_save_later(user_id,item_id)
    return res

def check_if_item_in_wishlist(user_id,item_id):
    wishlist = cart_db_services.get_wishlist_from_userid(user_id)
    if not wishlist: raise Exception("No wishlist Present")
    res = is_already_present_item_in_wishlist(str(wishlist['_id']),item_id)
    return res

# def create_cart_and_add_from_save_later(user_id,tier_id,tier_data,quantity):
#     price = tier_data['tierAmount']
#     currency = tier_data['tierCurrency']
#     id = add_to_cart(user_id, price, currency, tier_id,quantity)
#     return id


def add_to_existing_cart_from_save_later(cart_id, tier_id, tier_data, quantity):
    price = tier_data['tierAmount']
    currency = tier_data['tierCurrency']
    modified_count = add_to_existing_cart_id_cart(cart_id, price, currency,tier_id,quantity)
    return modified_count

def set_processed_flag_in_cart(cart_id):
    cart_db_services.update_flag_in_cart(cart_id)


def proces_order_for_buy_now(quantity,tier_id,tier_data):
    order_value = tier_data['tierAmount']*quantity
    cart_id=None
    campaign_id = str(cart_db_services.get_campaign_from_tier(tier_id)["_id"])
    items = [{"tierId":tier_id,"campaignId":campaign_id,"quantity":quantity}]
    document = {
        "orderValue":order_value,
        "cartId":cart_id,
        "timeOfOrder":datetime.datetime.utcnow(),
        "items":items
    }
    id = cart_db_services.insert_into_orders(document)
    return id

def get_order_value_from_cart(cart_data):
    order_value = 0
    for item in cart_data['items']:
        order_value += item['price']*item['quantity']
    return order_value


def proces_order_for_cart(cart_data):
    order_value = get_order_value_from_cart(cart_data)
    cart_id=str(cart_data['_id'])
    items_list = []

    for item in cart_data['items']:
        id = item["itemId"]
        itemType = item["itemType"]
        price = item["price"]
        items_list.append({"itemId":id,"itemType":itemType,"quantity":item["quantity"],"price":price})
    
    document = {
        "orderValue":order_value,
        "cartId":cart_id,
        "timeOfOrder":datetime.datetime.utcnow(),
        "items":items_list,
    }
    id = cart_db_services.insert_into_orders(document)
    cart_data['TimeOfOrder'] = datetime.datetime.utcnow()
    cart_db_services.insert_into_processed_carts(cart_data)
    cart_db_services.delete_document_from_cart(cart_id)
    return id


def proces_order_for_temp_cart(cart_data):
    order_value = get_order_value_from_cart(cart_data)
    cart_id=str(cart_data['_id'])
    items_list = []

    for item in cart_data['items']:
        id = item["itemId"]
        itemType = item["itemType"]
        price = item["price"]
        items_list.append({"itemId":id,"itemType":itemType,"quantity":item["quantity"],"price":price})
    
    document = {
        "orderValue":order_value,
        "cartId":cart_id,
        "timeOfOrder":datetime.datetime.utcnow(),
        "items":items_list
    }
    id = cart_db_services.insert_into_orders(document)
    cart_data['TimeOfOrder'] = datetime.datetime.utcnow()
    cart_db_services.insert_into_processed_carts(cart_data)
    cart_db_services.delete_document_from_temp_cart(cart_id)
    return id


def map_user_id_and_order_id(user_id,order_id):
    if cart_db_services.get_order_id_from_map(user_id):
        cart_db_services.push_into_map(user_id,order_id)
    else:
        cart_db_services.insert_into_map(user_id,order_id)


def get_user_id_from_map(order_id):
    return cart_db_services.get_user_id_from_map(order_id)


def get_orders_from_map(user_id, page_size, page_number):
    orders = cart_db_services.get_orders(user_id)
    skips = page_size * (page_number - 1)
    orders =  orders[skips:skips + page_size]
    order_list = []
    for order in orders:
        order_list.append(str(order['orderId']))
    return order_list

def get_orders_from_map_unpaginated(user_id):
    try:
        orders = cart_db_services.get_orders(user_id)
    except Exception as e:
        if str(e)=="No orders present":
            return []
        else:
            raise e
    order_list = []
    for order in orders:
        order_list.append(str(order['orderId']))
    return order_list


def get_items_from_order_ids(order_ids):
    items_res = {}
    for order_id in order_ids:
        order = cart_db_services.get_orders_from_order_coll(order_id)
        items = order['items']
        for item in items:
            if item["itemType"] not in items_res:
                items_res[item["itemType"]] = set()
            items_res[item["itemType"]].add(item["itemId"])
    return items_res


def get_models_from_order_ids(order_ids):
    models_list = []
    m_l = []
    for order_id in order_ids:
        order = cart_db_services.get_orders_from_order_coll(order_id)
        items = order['items']
        for item in items:
            if item["itemType"] == Item_type.MODEL.value:
                m_l.append(item["itemId"])
                models_list.append({"modelId":item["itemId"],"quantity":item["quantity"],"timeOfPurchase":order["timeOfOrder"]})

    return models_list,m_l  


def get_tiers_from_order_ids(order_ids):
    tiers_list = []
    tier_details = []
    for order_id in order_ids:
        order = cart_db_services.get_orders_from_order_coll(order_id)
        items = order['items']
        for item in items:
            if item["itemType"] == Item_type.TIER.value:
                tiers_list.append(item["itemId"])
                tier_details.append({"tierId":item["itemId"],"quantity":item["quantity"],"timeOfPurchase":order["timeOfOrder"]})
    return tiers_list,tier_details


def get_orders_from_order_coll(id):
    return cart_db_services.get_orders_from_order_coll(id)

def cancel_order(order_id):
    cart_db_services.delete_order_from_map(order_id)
    cart_db_services.delete_order_from_order_coll(order_id)


def get_processed_carts_from_user_id(user_id):
    carts = cart_db_services.get_processed_carts_from_user_id(user_id)
    res = []
    for cart in carts:
        response = {"cart_id": str(cart['_id']),
                    "user_id": str(cart['userId']),
                    "cart_amount": cart['cartAmount'],
                    "currency": cart['currency'],
                    "TimeOfOrder":cart['TimeOfOrder'],
                    "number_of_items": cart['numberOfItems'],
                    "items": cart["items"]
                    }
        res.append(response)
    return res


async def get_model_details(model_details,model_id):
    for model in model_details:
        if model['itemId']==model_id:
            return model
            # response = model
            # break
    
    # try:
    #     res_dic =  {
    # "itemName" : response['modelName'],
    # "itemDp" : response['coverImage'],
    # "itemCurrency": response["currency"],
    # "itemPrice": response['price'],
    # "artistName" : response['userData']['username'],
    # "artistDp" : response['userData']['displayInformation']['profilePicture']['croppedPictureUrl'],
    # "reviewId": response["modelReviewData"]["reviewId"],
    # "rating": response["modelReviewData"]["rating"]
    # }
    # except Exception as e:
    #     raise Exception(e)

    # return res_dic


async def get_tier_details(tier_details,tier_id):
    for tier in tier_details:
        if tier['itemId']==tier_id:
            return tier
    #         response = tier
    #         break

    # try:
    #     res_dic =  {
    # "itemName" : response['tierTitle'],
    # "itemDp" : response['tierDp'],
    # "artistName" : response['userData']['username'],
    # "artistDp" : response['userData']['displayInformation']['profilePicture']['croppedPictureUrl'],
    # "campaignId": response["campaignId"],
    # "reviewId": response["tierReviewData"]["reviewId"],
    # }
    # except Exception as e:
    #     logger.error(e)
    #     raise Exception(e)
    # return res_dic

async def get_campaign_details(camapaign_details,camapaign_id):
    for camapaign in camapaign_details:
        if camapaign['campaignId']==camapaign_id:
            response = camapaign
            break

    try:
        res_dic =  {
    "itemName" : response["basics"]['campaignTitle'],
    "itemDp" : response["basics"]['coverImage'],
    "statusOfCampaign" : response['statusOfCampaign'],
    "amountRaised": response['raisedTotal'],
    "endDate": response['endedOn'],
    "noOfrewardTiers": len(response['rewardAndTier']),
    "noOfBackers": len(response['backers']),
    "artistName" : response['userData']['username'],
    "artistDp" : response['userData']['displayInformation']['profilePicture']['croppedPictureUrl']
    }
    except Exception as e:
        logger.error(e)
        raise Exception(e)
    return res_dic
    
async def get_model_details_from_model_service(item_list,request_id,user_id):
    payload = {"modelIds": item_list}
    url = f"{read_yaml.campaign_service_url}/api/v1/models"
    try:
        response =  await m2m_calls.m2m_request("POST","campaign",url,request_id,payload,user_id=user_id)
    except Exception as e:
        raise Exception(e)
    return response


async def add_wishlisted_campaign_to_campaign_db(campaign_id:str,user_id:str,request):
    request_id = request.state.x_request_id
    url = f"{read_yaml.campaign_service_url}/api/v1/campaign/{campaign_id}/wishlist/user/{user_id}"
    try:
        response = await m2m_calls.m2m_request("POST","campaign",url,request_id,user_id=user_id)
    except Exception as e:
        raise Exception(e)
    return response


async def get_tier_details_from_campaign_service(item_list:list,request_id:str,user_id:str):
    payload = {"tierIds": item_list}
    url = f"{read_yaml.campaign_service_url}/api/v1/campaigns/tiers"
    try:
        response =  await m2m_calls.m2m_request("POST","campaign",url,request_id,payload,user_id=user_id)
    except Exception as e:
        raise Exception(e)
    return response


async def get_campaign_details_from_campaign_service(item_list:list,request_id:str,user_id:str):
    payload = {"campaignIds": item_list}
    url = f"{read_yaml.campaign_service_url}/api/v1/campaigns"
    try:
        response =  await m2m_calls.m2m_request("POST","campaign",url,request_id,payload,user_id =user_id)
    except Exception as e:
        raise Exception(e)
    return response

def get_abandoned_cart_list(abandoned_time_in_minutes = 60):
    print('Checking for abandoned carts...')
    now = datetime.datetime.utcnow()
    threshold = now - timedelta(minutes=abandoned_time_in_minutes)
    carts = cart_db_services.get_all_carts()
    abandoned_carts=[]
    for cart in carts:
        createdAt = cart['createdAt']
        lastUpdated = cart['lastUpdated']
        abandonedSince = now - lastUpdated
        if createdAt < threshold and lastUpdated < threshold:
            abandoned_cart_info = {
                'userId': cart['userId'],
                'cartId': str(cart['_id']),
                'abandonedSince': abandonedSince.total_seconds() / 60 
            }
            abandoned_carts.append(abandoned_cart_info)
    
    return abandoned_carts

#TODO: this part is handled via an api call to notification service

def get_abandoned_cart_template():
    templates_dir = os.path.join(os.getcwd(), 'templates')
    env = Environment(loader=FileSystemLoader(templates_dir))
    template = env.get_template('abandoned_cart_template.html')
    return template


def send_abandon_cart_emails(abandoned_carts):
    logger.debug(f"Sending abandoned cart emails...")
    print(abandoned_carts)
    for abandoned_cart in abandoned_carts:
        user_id = abandoned_cart['userId']
        cart_id = abandoned_cart['cartId']
        abandoned_since = abandoned_cart['abandonedSince']
        item_details = cart_db_services.get_cart_from_cart_id(cart_id)['items']
        last_updated_date = cart_db_services.get_cart_from_cart_id(cart_id)['lastUpdated']
        logger.debug(f"Sending email to user {user_id} for abandoned cart {cart_id} since {abandoned_since} minutes")

        #Call Parth after this
        #Parth wants userId m lasrUpdatedDate and itemDetails

        to_email = cart_db_services.get_email_from_user_id(user_id)
        username = cart_db_services.get_username_from_user_id(user_id)
        template = get_abandoned_cart_template()
        email_body = template.render(username=username,cart_id=cart_id,last_updated_date=last_updated_date, abandoned_since=abandoned_since, item_details=item_details)
        subject = "Your cart is waiting for you!"
        send_email_using_brevo(to_email, subject, email_body)


def send_email_using_brevo(to_email,subject,email_body):
    configuration = sib_api_v3_sdk.Configuration()
    configuration.api_key["api-key"] = read_yaml.sendin_blue_api_key
    trxnl_email_api_client = sib_api_v3_sdk.TransactionalEmailsApi(
    sib_api_v3_sdk.ApiClient(configuration)
)
    send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(
        to=[{"email":to_email}],
        reply_to={"email":read_yaml.sendin_blue_sender},
        html_content=email_body,
        sender={"email":read_yaml.sendin_blue_sender},
        subject=subject
    )
    try:
        api_response = trxnl_email_api_client.send_transac_email(send_smtp_email)
        logger.debug(f"sending email to mail_id: {to_email}")
        logger.info(f"Abandoned Cart Email sent successfullt to {to_email}")
        return {"message": "success", "api-response": api_response}
    except ApiException as e:
        logger.error(str(e))
        print("sender",read_yaml.sendin_blue_sender )
        print("type",type(read_yaml.sendin_blue_sender) )
        return "Can't send the email"
    
def is_already_ordered_item(userid,item_id):
    orderids = get_orders_from_map_unpaginated(userid)
    for order_id in orderids:
        order = get_orders_from_order_coll(order_id)
        for item in order['items']:
            if item['itemId']==item_id:
                return True
    return False

def transform_to_purchased_campaign(data: List[dict]) -> List[dict]:
    campaign_map = {}

    for item in data:
        user_id = item['userId']
        campaign_id = item['campaignId']
        campaign_name = item['CampaignBasics']['campaignTitle']
        campaign_dp = item['CampaignBasics']['coverImage']
        artist_name = item['userData']['username']
        artist_dp = item['userData']['displayInformation']['profilePicture']['pictureUrl']

        if campaign_id in campaign_map:
            campaign_map[campaign_id]['tiersCount'] += 1
        else:
            campaign_map[campaign_id] = {
                "userId": user_id,
                "campaignId": campaign_id,
                "campaignName": campaign_name,
                "campaignDp": campaign_dp,
                "artistName": artist_name,
                "artistDp": artist_dp,
                "tiersCount": 1
            }
             
    return campaign_map

