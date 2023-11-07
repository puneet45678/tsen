from pymongo import MongoClient
from bson import ObjectId
import datetime
from config import read_yaml


client = MongoClient(read_yaml.mongmongodb_uri)

cart_db = client[read_yaml.mongo_user_name]
cart_coll = cart_db.carts
save_later_coll = cart_db.save_later
campaign_collection = cart_db.campaigns
model_collection = cart_db.models
order_coll = cart_db.orders
user_coll = cart_db.user
map = cart_db.user_order_map
processed_carts_coll = cart_db.processed_carts
temp_cart_coll = cart_db.temporary_carts
wishlist_coll = cart_db.wishlists

def get_all_carts():
    return list(cart_coll.find({}))

def get_model_details(item_id):
    model = model_collection.find_one({"_id": ObjectId(item_id)})
    return model


def get_pipleine_result_for_cart(item_id,cart_id):
    pipeline = [
        # Match documents with a matching object in the list
        {'$match': {'_id': ObjectId(cart_id), 'items': {'$elemMatch': {'itemId': item_id}}}},

        # Filter the my_list array to only include matching objects
        {'$project': {
            'matching_objects': {
                '$filter': {
                    'input': '$items',
                    'as': 'obj',
                    'cond': {'$eq': ['$$obj.itemId', item_id]}
                }
            }
        }},

        # Flatten the matching_objects array
        {'$unwind': '$matching_objects'},

        # Return only the matching_objects fields
        {'$project': {
            '_id': 0,
            'itemId': '$matching_objects.itemId',
            'itemType': '$matching_objects.itemType',
            'price': '$matching_objects.price',
            'quantity': '$matching_objects.quantity',
            'currency': '$matching_objects.currency'

        }}
    ]

    # Execute the aggregation pipeline
    matching_objects = list(cart_coll.aggregate(pipeline))
    return matching_objects

def get_pipleine_result_for_save_later(item_id):
    pipeline = [
        # Match documents with a matching object in the list
        {'$match': {'items': {'$elemMatch': {'itemId': item_id}}}},

        # Filter the my_list array to only include matching objects
        {'$project': {
            'matching_objects': {
                '$filter': {
                    'input': '$items',
                    'as': 'obj',
                    'cond': {'$eq': ['$$obj.itemId', item_id]}
                }
            }
        }},

        # Flatten the matching_objects array
        {'$unwind': '$matching_objects'},

        # Return only the matching_objects fields
        {'$project': {
            '_id': 0,
            'itemId': '$matching_objects.itemId',
            'itemType': '$matching_objects.itemType',
            'quantity': '$matching_objects.quantity',
            'addedOn': '$matching_objects.addedOn',
            'lastUpdated': '$matching_objects.lastUpdated'
        }}
    ]

    # Execute the aggregation pipeline
    matching_objects = list(save_later_coll.aggregate(pipeline))
    return matching_objects

def get_pipleine_result_for_wishlist(item_id):
    pipeline = [
        # Match documents with a matching object in the list
        {'$match': {'items': {'$elemMatch': {'itemId': item_id}}}},

        # Filter the my_list array to only include matching objects
        {'$project': {
            'matching_objects': {
                '$filter': {
                    'input': '$items',
                    'as': 'obj',
                    'cond': {'$eq': ['$$obj.itemId', item_id]}
                }
            }
        }},

        # Flatten the matching_objects array
        {'$unwind': '$matching_objects'},

        # Return only the matching_objects fields
        {'$project': {
            '_id': 0,
            'itemId': '$matching_objects.itemId',
            'itemType': '$matching_objects.itemType',
            'addedOn': '$matching_objects.addedOn',
            'lastUpdated': '$matching_objects.lastUpdated'
        }}
    ]

    # Execute the aggregation pipeline
    matching_objects = list(wishlist_coll.aggregate(pipeline))
    return matching_objects


def get_campaign_from_tier(tier):
    return campaign_collection.find_one({"rewardAndTier": {"$elemMatch": {"tierId": str(tier)}}})
    #TODO: This function must return its data from api_calls

def insert_new_document(document):
    return cart_coll.insert_one(document)

def insert_new_document_into_wishlist(document):
    return wishlist_coll.insert_one(document)

def insert_new_document_into_temp_cart(document):
    return temp_cart_coll.insert_one(document)


def get_cart_from_user_id(user_id):
    return cart_coll.find_one({"userId": user_id})

def get_wishlist_from_userid(user_id):
    return wishlist_coll.find_one({"userId": user_id})


def get_processed_carts_from_user_id(user_id,page_size,page_number):
    skips = page_size * (page_number - 1)
    return processed_carts_coll.find({'userId':user_id}).skip(skips).limit(page_size)


def get_cart_from_cart_id(cart_id):
    return cart_coll.find_one({"_id": ObjectId(cart_id)})

def get_temp_cart_from_cart_id(cart_id):
    return temp_cart_coll.find_one({"_id": ObjectId(cart_id)})

def push_item_to_cart(item,cart_id):
    new_value = {"$set":{"lastUpdated":datetime.datetime.utcnow()}, "$push": {"items": item}}
    update_result = cart_coll.update_one({"_id": ObjectId(cart_id)}, new_value)
    return update_result.modified_count

def push_item_to_wishlist(item_id,item_type,existing_wishlist_id):
    new_value = {"$set":{"lastUpdated":datetime.datetime.utcnow()}, "$push": {"items": {"itemId": item_id,"itemType":item_type,"addedOn":datetime.datetime.utcnow(),"lastUpdated":datetime.datetime.utcnow()}}}
    update_result = wishlist_coll.update_one({"_id": ObjectId(existing_wishlist_id)}, new_value)
    return update_result.modified_count

def get_cart_from_item_id(cart_id,item_id):
    query = {"_id": ObjectId(cart_id), "items": {"$elemMatch": {"itemId": str(item_id)}}}
    result = cart_coll.find(query)
    return result

def get_wishlist_from_item_id(existing_wishlist_id,item_id):
    query = {"_id": ObjectId(existing_wishlist_id), "items": {"$elemMatch": {"itemId": str(item_id)}}}
    result = wishlist_coll.find(query)
    return result

def update_item_in_cart(quantity,cart_id,item_id):
    # query = {"$inc": {"cartAmount": quantity * int(price), "numberOfItems": quantity,"items.$.quantity": quantity},"$set":{"items.$.lastUpdated":datetime.datetime.utcnow()}}
    query = {"$inc": {"items.$.quantity": quantity},"$set":{"items.$.lastUpdated":datetime.datetime.utcnow()}}
    update_result = cart_coll.update_one({"_id": ObjectId(cart_id), "items.itemId": item_id}, query)
    return update_result

def pull_and_decrement_from_cart(item_id,cart_id):
    query1 = {"$pull":{"items":{"itemId":item_id}}}
    update_result = cart_coll.update_one({"_id": ObjectId(cart_id)}, query1)
    return update_result

def decrement_item_from_cart(item_id,cart_id):
    query2 = {"$inc": {"items.$.quantity":-1 },"$set":{"items.$.lastUpdated":datetime.datetime.utcnow()}}
    update_result = cart_coll.update_one({"_id": ObjectId(cart_id), "items.itemId": item_id}, query2)
    return update_result

def delete_document_from_cart(cart_id):
    cart_coll.delete_one({"_id": ObjectId(cart_id)})
    

def delete_document_from_temp_cart(cart_id):
    temp_cart_coll.delete_one({"_id": ObjectId(cart_id)})

def delete_document_from_wishlist(existing_wishlist_id):
    wishlist_coll.delete_one({"_id": ObjectId(existing_wishlist_id)})


def get_save_later_using_item_id(user_id,item_id):
    result = save_later_coll.find({"userId": user_id, "items": {"$elemMatch": {"itemId": item_id}}})
    return result

def get_save_later_using_user_id(user_id):
    return save_later_coll.find_one({"userId":user_id})

def insert_into_save_later(document):
    save_later_coll.insert_one(document)

def push_item_into_save_for_later(user_id,item):
    res = save_later_coll.update_one({"userId": user_id}, {"$push": {"items": item}}).modified_count
    return res

def pull_item_from_save_for_later(user_id,item_id):
    save_later_coll.update_one({"userId": user_id}, {"$pull": {"items": {"itemId": item_id}}})

def pull_item_from_wishlist(user_id,item_id):
    wishlist_coll.update_one({"userId": user_id}, {"$pull": {"items": {"itemId": item_id}}})


def get_save_for_later(user_id):
    return save_later_coll.find_one({"userId": user_id})

def delete_from_save_for_later(user_id):
    save_later_coll.delete_one({"userId": user_id})

def delete_from_wishlist(user_id):
    wishlist_coll.delete_one({"userId": user_id})


def get_orders(user_id):
    user_order_map = map.find_one({'userId': user_id})
    if user_order_map:
        return user_order_map['orders']
    else:
        raise Exception("No orders present")

def get_orders_from_order_coll(id):
    return order_coll.find_one({'_id':ObjectId(id)})

def delete_order_from_map(order_id):
    map.update_one({'orders': {'$elemMatch': {'orderId': order_id}}}, {'$pull': {'orders': {'orderId': order_id}}})

def delete_order_from_order_coll(order_id):
    order_coll.delete_one({'_id':ObjectId(order_id)})

def update_flag_in_cart(cart_id):
    cart_coll.update_one({"_id": ObjectId(cart_id)}, {"$set": {"processed": True}})

def insert_into_orders(document):
    return order_coll.insert_one(document).inserted_id

def get_order_id_from_map(user_id):
    return map.find_one({'userId':user_id})

def get_user_id_from_map(order_id):
    return map.find_one({'orders': {'$elemMatch': {'orderId': order_id}}})['userId']

def push_into_map(user_id,order_id):
    map.update_one({'userId': user_id}, {'$push': {"orders": {'orderId': order_id}}})

def insert_into_map(user_id,order_id):
    map.insert_one({'userId': user_id, 'orders': [{'orderId': order_id}]})

def insert_into_processed_carts(cart_data):
    return processed_carts_coll.insert_one(cart_data).inserted_id



#TODO: This function must return its data from api_calls to user
def get_email_from_user_id(user_id):
    return user_coll.find_one({'_id':ObjectId(user_id)})['email']

def get_username_from_user_id(user_id):
    return user_coll.find_one({'_id':ObjectId(user_id)})['username']


