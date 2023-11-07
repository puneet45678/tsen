from utils import utils
from db import mysql_auth_db_orm
from config import read_yaml
from services import routes_db_services
from logger.logging import get_logger
logger = get_logger(__name__)


async def delete_user_using_dashboard(request):
    
    url = utils.get_protocol_host(request.url)

    print("url",url)
    if url == read_yaml.dashboard_delete_uri and request.method == "DELETE":
        req_url = request.url
        try:
            userDbId = utils.get_external_id(str(req_url))
        except Exception as e:
            logger.error(f"Error while getting userDbId Error: {e}")
            raise Exception(e)
        

        if utils.is_valid_mongo_id(userDbId):
            print("Trying to delete user from mongo_db")
            try:
                api_response = await routes_db_services.remove_user_from_external_db(userDbId,request.state.x_request_id)
            
            except Exception as e:
                logger.error(f"Error while deleting user from mongo_db Error: {e}")
                raise Exception(e)
        
        logger.info("Deleted user from mongo_db also")

