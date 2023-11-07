from pymongo import MongoClient
from config import read_yaml
from bson import ObjectId
from typing import Optional
from logger.logging import get_logger
logger = get_logger(__name__)


client = MongoClient(read_yaml.mongmongodb_uri)
db = client[read_yaml.mongo_user_name]
slicer_sessions = db.slicer_sessions

def is_port_exists(port):
    '''
    These functions check if the provided port already exists in the MongoDB database.
    '''  
    query = {"sessions.port": port}
    result = list(slicer_sessions.find(query))
    return True if result else False

def is_domain_exists(domain):

    '''
    These functions check if the provided domain already exists in the MongoDB database.
    '''

    query = {"sessions.subDomain": domain}
    result = list(slicer_sessions.find(query))
    return True if result else False

def set_slicer_session_data(userid:str ,sessionid:str ,port:str ,sub_domain:str ,campId:str ,tierId:str, cloud_run_url:str, uuid_str:str):
    
    random_url= f"https://{sub_domain}.{read_yaml.host_slicer}"

    user = slicer_sessions.find_one({"userId":userid})
    session = {"sessionHandle":sessionid,"port":port,"subDomain":sub_domain,"url":random_url,"cloudRunUrl":cloud_run_url,"serviceId":uuid_str,"campaignId":campId,"tierId":tierId}
    if not user:
        id = slicer_sessions.insert_one({"userId":userid,"sessions":[session]}).inserted_id
    else:
        res = slicer_sessions.update_one({"userId":userid},{"$push": {"sessions": session}}).modified_count
        id = user["_id"]
    
    return id,random_url


def get_existing_url(userid,sessionid):
    user = slicer_sessions.find_one({"userId":userid})
    if user:
        for session in user["sessions"]:
            if session["sessionHandle"] == sessionid:
                return session["url"]
    return None

def check_if_session_present(userid,sessionid):
    result = slicer_sessions.find_one({
        "_id": ObjectId(userid), 
        "sessions": {"$elemMatch": {"sessionHandle": sessionid}}
    })
    return True if result else False


def delete_session_from_db(userid, sessionid):
    filter_ = {"userId": userid}
    update = {"$pull": {"sessions": {"sessionHandle": sessionid}}}
    result = slicer_sessions.update_one(filter_, update)

    if result.matched_count > 0 and result.modified_count > 0:
        # find the document and check if the sessions list is empty
        doc = slicer_sessions.find_one({"userId": userid})
        if doc and not doc.get('sessions'):
            # if sessions list is empty, remove the document
            slicer_sessions.delete_one({"userId": userid})
            logger.debug("Deleted the entire document as sessions list is empty")
        else:
            logger.debug(f"Deleted session: {sessionid} from user: {userid}")
    else:
        raise Exception("No session found to delete")

def get_running_services(userid):
    user_sessions = slicer_sessions.find_one({'userId': userid})
    if user_sessions:
        return user_sessions['sessions']
    else:
        return []

def get_all_sessions():
    sessions = list(slicer_sessions.find({}))
    if sessions:
        return sessions
    else:
        return []