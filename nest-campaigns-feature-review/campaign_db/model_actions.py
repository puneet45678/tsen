from datetime import datetime,timedelta
from models import model
from models.model import Review,Approvalstatus,Visibility
from fastapi import HTTPException, status
from bson import ObjectId
from datetime import datetime
from schemas.tags import *
from uuid import uuid4
from pymongo.errors import ServerSelectionTimeoutError
from config.read_yaml import config
from config.read_yaml import *
from .db_client import client

credentials_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"},
)


from logger.logging import getLogger

logger = getLogger(__name__)
try:
    db = client[config.mongodb["username"]]
except ServerSelectionTimeoutError as e:
    logger.error(f"Could not connect to MongoDB: {e}")

userCollection = db["user"]
campaign_collection = db["campaigns"]
tags_collection = db["tags"]
categories_collection = db["categories"]
state_collection = db["stateDB"]
models = db["models"]
licenses_collection = db["licenses"]

def post_model(user_id):
    logger.info("creating model instance in database")
    new_model = model.Model(
        userId=user_id,
        adminModified=False,
        uploadDatetime=datetime.utcnow(),
        updatedAt=datetime.utcnow(),
        approvalStatus=model.Approvalstatus.DRAFT.value,
        visibility=model.Visibility.PRIVATE.value,
        NSFW=False,
        deprecated=False,
        commentIds=[],
        reviewData=[],
        likedBy=[],
        modelImages=[],
        campaigns=[],
        tagIds=[],
        reportData=[],
        buyers=[],
        reported=False,
        remixes=[],
        modelFiles = model.ModelFiles(
            stlFiles=[],
            glbFiles=[]
        ),
        currency=model.Currency.USD.value,

    )
    new_model = new_model.dict()
    try:
        result = models.insert_one(new_model)
        modelId = str(result.inserted_id)
        logger.debug(f"Model created with id {modelId}")
        return modelId
    except ServerSelectionTimeoutError as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database",
        )
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"error in creating model instance in database",
        )

def update_model(modelId, model_dict):
    try:
        logger.debug(f"Updating model in database with modeld {modelId}")
        model = models.find_one({"_id": ObjectId(modelId)})
        if model is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail=f"{modelId} not found"
            )
        model_dict["updatedAt"] = datetime.utcnow()
        result = models.update_one({"_id": ObjectId(modelId)}, {"$set": model_dict})
        if result.modified_count:
            logger.debug(f"{modelId} updated succesfully")
    except ServerSelectionTimeoutError as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="Failed to connect to the database")
    except HTTPException as e:
        logger.error(e)
        raise e
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="error in updating model")


def submitting_model_for_review(model_id, model_dict):
    try:
        result = models.update_one({"_id": ObjectId(model_id)}, {"$set": model_dict})
        logger.debug({"model-id": f"{model_id} submitted succesfully"})
    except ServerSelectionTimeoutError as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database",
        )
    except HTTPException as e:
        logger.error(e)
        raise e
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="error in submitting model for review",
        )

def get_model(modelId):
    try:
        logger.debug(f"Getting model from database with modeld {modelId}")
        model = models.find_one({"_id": ObjectId(modelId)})
        if model is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail=f"{modelId} not found"
            )

        if model["deprecated"] and model["deprecated"] == True:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail=f"{modelId} deleted"
            )

        model["_id"] = str(model["_id"])
        logger.info("Model received from database")
        return model
    except ServerSelectionTimeoutError as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database",
        )

    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,detail=f"{modelId} not found"
        )


def set_cover_image(modelId, url):
    try:
        models.update_one({"_id": ObjectId(modelId)}, {"$set": {"coverImage": url}})
    except ServerSelectionTimeoutError as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database",
        )
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="error in setting cover image")

def updating_model(state):
    if state["triggerType"] == "approval":
        update = {
            "$set": {
                "approvalStatus": state["stateValue"]["approval"]["approvalStatus"]
            }
        }
    elif state["triggerType"] == "visibility":
        update = {"$set": {"visibility": state["stateValue"]["visibility"]}}
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid trigger type."
        )

    try:
        response = models.update_one({"_id": ObjectId(state["modelId"])}, update)
        return response
    except ServerSelectionTimeoutError as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database",
        )
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="updating model failed",
        )


def delete_model(modelId):
    try:
        model = models.find_one({"_id": ObjectId(modelId)})

        if model is None:
            raise HTTPException(status_code=404, detail="Model not found.")

        campaign_ids = set(
            campaign.get("campaignId") for campaign in model.get("campaigns", [])
        )

        for campaign_id in campaign_ids:
            campaign_doc = campaign_collection.find_one({"_id": ObjectId(campaign_id)})

            if campaign_doc is None:
                raise HTTPException(status_code=404, detail="Campaign not found.")

            if campaign_doc.get("approvalStatus") == "Live":
                raise HTTPException(
                    status_code=403,
                    detail="Cannot delete model. It is associated with a live campaign.",
                )

        result = models.update_one(
            {"_id": ObjectId(modelId)}, {"$set": {"deprecated": True}}
        )
        if result.modified_count:
            return {"message": f"Model {modelId} has been deprecated."}
        else:
            raise HTTPException(status_code=404, detail="Model not found.")
    except ServerSelectionTimeoutError as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database",
        )
    except HTTPException as e:
        logger.error(e)
        raise e
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=404, detail="error in deleiting model")


def get_models(_status, visibility, userId, deprecated):
    filter = {"userId": userId, "deprecated": deprecated}

    if _status != "all":
        filter["approvalStatus"] = _status

    if visibility != "all":
        filter["visibility"] = visibility

    model_list = []
    try:
        for model in models.find(filter):
            model["_id"] = str(model["_id"])
            model_list.append(model)
        if not model_list:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="No model with request parameters found")

        return model_list
    except ServerSelectionTimeoutError as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database",
        )
    except HTTPException as e:
        logger.error(e)
        raise e
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="error in getting model")

def get_public_user_models(userId):
    try:
        filter = {"userId": userId, "visibility": Visibility.PUBLIC.value, "deprecated": False,"approvalStatus": Approvalstatus.LIVE.value}
        model_list = []
        for model in models.find(filter):
            model["_id"] = str(model["_id"])
            model_list.append(model)
        if not model_list:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="No model with request parameters found")

        return model_list
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="error in getting model")

def get_models_for_admin(_status, visibility, deprecated):
    
    logger.debug(f"Getting models for admin with status {_status}, visibility {visibility}, deprecated {deprecated}")
    filter = {
        "visibility": visibility,
        "deprecated": deprecated,
        "approvalStatus": _status,
    }
    model_list = []
    try:
        for model in models.find(filter):
            model["_id"] = str(model["_id"])
            model_list.append(model)
        logger.debug(f"{len(model_list)} Models for admin received from database")
        return model_list
    except ServerSelectionTimeoutError as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database",
        )
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="error in getting model for models admin",
        )


def push_images(model_images, modelId):
    try:
        models.update_one(
            {"_id": ObjectId(modelId)}, {"$push": {"modelImages": model_images}}
        )
    except ServerSelectionTimeoutError as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database",
        )
    except Exception as e:
        logger.error(e)
        raise e


def getting_states(modelId):
    try:

        cursor = state_collection.find({"id": modelId}).sort("stateDateTime", -1)
        models = []
        for model in cursor:
            model["_id"] = str(model["_id"])
            models.append(model)
        
        if not models:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"No model with id {modelId} found ")
        return models

    except ServerSelectionTimeoutError as e:
        logger.error(e)
        raise HTTPException(status_code=500, detail="Failed to connect to the database")
    
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=404, detail="error in getting states")


def delete_modelImage(modelId: str, image_id: str):
    logger.info(f"Deleting modelImage in database")
    try:
        model_doc = models.find_one({"_id": ObjectId(modelId)})

        if model_doc is None:
            logger.error("No model found")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="No model found"
            )

        # here next is used because without next it will return a generator
        deleted_image_url = next(
            (
                image["imageUrl"]
                for image in model_doc["modelImages"]
                if image["imageId"] == image_id
            ),
            None,
        )
        models.update_one(
            {"_id": ObjectId(modelId)},
            {
                "$pull": {"modelImages": {"imageId": image_id}},
                "$set": {"updatedAt": datetime.utcnow()},
            },
        )
        logger.debug(f"ModelImage with id {image_id} deleted succesfully")

        if model_doc["coverImage"] == deleted_image_url:
            new_cover_image = (
                model_doc["modelImages"][0]["imageUrl"]
                if model_doc["modelImages"]
                else []
            )
            models.update_one(
                {"_id": ObjectId(modelId)},
                {"$set": {"coverImage": new_cover_image}},
            )

    except ServerSelectionTimeoutError as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database",
        )

    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="error in deleting model image",
        )


def get_model_visibility(modelId):
    try:
        model = models.find_one({"_id": ObjectId(modelId)})
        if model == None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="No model found"
            )
        return model["visibility"]
    except ServerSelectionTimeoutError as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database",
        )


def get_approval_status(model_id):
    try:
        model_data = models.find_one({"_id": ObjectId(model_id)})

        if model_data is not None:
            return model_data.get("approvalStatus")
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="No such model exist"
            )
    except ServerSelectionTimeoutError as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database",
        )
    except HTTPException as e:
        logger.error(e.detail)
        raise e
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="Error in getting approval status")



def add_state_change_to_db(Id, oldState,newState, userID, comment, stateFor,triggerType):
    try:
        logger.debug("Adding state change to db")
        result = state_collection.insert_one(
            {
                
                "triggerType": triggerType,
                "stateFor": stateFor,
                "stateDateTime": datetime.utcnow(),
                "id": Id,
                "oldValue": oldState,
                "newValue": newState,
                "comment" : comment,
                "triggerdBy":userID,
            }
        )
    except ServerSelectionTimeoutError as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database",
        )
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="error in adding state change to db",
        )


def update_approval_status(model_id, new_state):
    try:
        query = {"_id": ObjectId(model_id)}
        new_values = {
            "$set": {"approvalStatus": new_state, "updatedAt": datetime.utcnow()}
        }

        models.update_one(query, new_values)
    except ServerSelectionTimeoutError as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database",
        )
    except Exception as e:
        logger.error(f"An error occurred while updating the model approval status: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="error in updaing approval status",
        )


def get_updated_time(model_id):
    model_data = models.find_one({"_id": ObjectId(model_id)})

    if model_data is not None:
        return model_data.get("updatedAt")
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No such model exist"
        )


def is_part_of_live_campaign(modelId):
    try:
        model = models.find_one({"_id": ObjectId(modelId)})
        if not model:
            raise Exception("Model not found")

        associated_campaigns = model["campaigns"]

        for campaign in associated_campaigns:
            campaign_obj = campaign_collection.find_one(
                {"_id": ObjectId(campaign["id"])}
            )
            if campaign_obj and campaign_obj["approvalStatus"] == "Live":
                return True

        return False
    except ServerSelectionTimeoutError as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database",
        )
    except Exception as e:
        logger.error(f"An error occurred while updating the model approval status: {e}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Model not found",
        )


def has_buyers(modelId):
    try:
        model = models.find_one({"_id": ObjectId(modelId)})
        if not model:
            raise Exception("Model not found")
        if model["buyers"]:
            return True
        return False
    except ServerSelectionTimeoutError as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database",
        )
    except Exception as e:
        logger.error(f"An error occurred while updating the model approval status: {e}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Model not found",
        )

#TODO add_state_change_to_db structure is changed 
async def mark_models_for_ready_for_deletion():
    try:
        now = datetime.utcnow()
        five_days_ago = now - timedelta(days=5)

        logger.debug("Checking for models to update...")
        update_query = {"$set": {"approvalStatus": "Ready_For_Deletion", "updatedAt": now}}
        models_to_update_query = {
            "approvalStatus": "Marked_For_Deletion",
            "updatedAt": {"$lte": five_days_ago},
        }
        models_to_update = list(models.find(models_to_update_query))
        count = 0
        for model in models_to_update:
            user_id = model["userId"]
            update_result = models.update_one({"_id": ObjectId(model["_id"])}, update_query)
            if update_result.modified_count > 0:
                add_state_change_to_db(
                    model["_id"],
                    "Marked_For_Deletion",
                    "Ready_For_Deletion",
                    user_id,
                    "Automatically marked for deletion after 5 days.",
                    "model",
                    "deletion"
                )
                count = count + 1

        logger.debug(f"{count} models updated.")
    except ServerSelectionTimeoutError as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database",
        )
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="error in marking models for ready for deletion")

#TODO add_state_change_to_db structure is changed 
async def mark_models_for_deletion():
    try:
        now = datetime.utcnow()
        sixty_days_ago = now - timedelta(days=60.0)
        logger.debug("Checking for models to update...")
        update_query = {"$set": {"approvalStatus": "Deleted", "updatedAt": now}}
        models_to_update_query = {
            "approvalStatus": "Ready_For_Deletion",
            "updatedAt": {"$lte": sixty_days_ago},
        }

        models_to_update = models.find(models_to_update_query)
        count = 0
        for model in models_to_update:
            user_id = model["userId"]
            update_result = models.update_one({"_id": ObjectId(model["_id"])}, update_query)
            if update_result.modified_count > 0:
                add_state_change_to_db(
                    model["_id"],
                    "Ready_For_Deletion",
                    "deleted",
                    user_id,
                    "Automatically marked for deletion after 5 days.",
                    "model",
                    "deletion"
                )
                count = count + 1
        logger.debug(f"{count} models updated.")
    except ServerSelectionTimeoutError as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database",
        )
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="error in marking models for deletion")

def get_models_marked_for_deletion_three_days_ago():
    now = datetime.utcnow()
    three_days_ago = now - timedelta(days=3)
    logger.info(f"three days ago {three_days_ago}")
    models_to_notify_query = {
        "approvalStatus": "Marked_For_Deletion",
        "updatedAt": {"$lte": three_days_ago},
    }
    models_to_notify = []
    logger.info("Checking for models to update and send notifications...")
    try:
        for x in list(models.find(models_to_notify_query)):
            x["_id"] = str(x["_id"])
            models_to_notify.append(x)
        return models_to_notify
    except ServerSelectionTimeoutError as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database",
        )
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="error in getting models marked for deletion")


def add_buyer_to_model(modelId, userId):
    try:
        model_doc = models.find_one({"_id": ObjectId(modelId)})
    except ServerSelectionTimeoutError as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database",
        )
    if model_doc is None:
        raise HTTPException(status_code=404, detail="Model document not found")
    try:
        updated_doc = models.update_one({"_id": ObjectId(modelId)}, {"$push": {"buyers": userId}})
        if updated_doc.matched_count == 0:
            raise HTTPException(status_code=404, detail="Model document not found")
    except Exception as e:
        logger.error(e)
        raise e

def remove_buyer_from_model(modelId, userId):
    try:
        model_doc = models.find_one({"_id": ObjectId(modelId)})

        if model_doc is None:
            logger.error("Model document not found")
            raise HTTPException(status_code=404, detail="Model document not found")

        updated_doc = models.update_one(
            {"_id": ObjectId(modelId)}, {"$pull": {"buyers": userId}}
        )

        if updated_doc.matched_count == 0:
            logger.error("Model document not found")
            raise HTTPException(status_code=404, detail="Model document not found")

        return {"detail": "Buyer removed successfully"}
    except ServerSelectionTimeoutError as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database",
        )
    except Exception as e:
        logger.error(e)
        raise e


def update_cropped_url(modelId: str, imageId: str, newUrl: str):
    try:
        
        model_doc = models.update_one(
            {"_id": ObjectId(modelId), "modelImages.imageId": imageId},
            {
                "$set": {"modelImages.$.croppedUrl": newUrl},
            },
        )

        if model_doc.matched_count == 0:
            raise HTTPException(status_code=404, detail="Model document not found")

        return {"detail": "Cropped url updated "}

    except ServerSelectionTimeoutError as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database",
        )
    except Exception as e:
        logger.error(e)
        raise e


def update_model_file_url(modelId, fileType, url):
    try:
        model = models.find_one({"_id": ObjectId(modelId)})
        modelFileUrl = {}
        if (
            "modelFileUrl" in model.keys()
            and model["modelFileUrl"] is not None
            and (
                "stl" in model["modelFileUrl"].keys()
                or "glb" in model["modelFileUrl"].keys()
            )
        ):
            modelFileUrl = model["modelFileUrl"]
        modelFileUrl[f"{fileType}"] = url
        models.update_one(
            {"_id": ObjectId(modelId)}, {"$set": {f"modelFileUrl": modelFileUrl}}
        )
    except ServerSelectionTimeoutError as e:
        logger.error(e)
        raise HTTPException(status_code=500, detail="Failed to connect to the database")
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=404, detail="error in updating model file url")


def set_admin_modified(modelId,modified):
    try:
        models.update_one(
            {"_id": ObjectId(modelId)}, {"$set": {"adminModified": modified}}
        )
        return {"message": f"adminModified field now become {modified}"}

    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="error in setting adminModified")


def get_adminModified_value(modelId):
    try:
        model = models.find_one({"_id": ObjectId(modelId)})
        return model["adminModified"]

    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="error in getting adminModified value")

def find_model_from_modelid(id: str):
    logger.info(f"Finding model with ID: {id}")
    try:
        model = models.find_one({"_id": ObjectId(id)})
    except ServerSelectionTimeoutError as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database",
        )

    if model is None:
        logger.error("Model not found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Model not found"
        )

    model["_id"] = str(model["_id"])
    logger.debug(f"Model found succesfully ")
    return model

def set_model_visibility(modelId:str , visibility:str):
    try:
        models.update_one(
            {"_id": ObjectId(modelId)}, {"$set": {"visibility": visibility}}
        )
        return {"message": f"visibility is changed to {visibility}"}

    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="error in setting visibility")

#TODO add this to userdb also
def toggle_like(modelId: str, userId: str, like_state: int):
    logger.info(
        f"toggling like on modelId=>{modelId} from userId=>{userId} with state=>{like_state}"
    )
    try:
        if like_state == 1:
            models.update_one(
                {"_id": ObjectId(modelId)},
                {
                    "$push": {"likedBy": userId},
                    "$set": {"updatedOn": datetime.utcnow()},
                },
            )
        elif like_state == -1:
            models.update_one(
                {"_id": ObjectId(modelId)},
                {
                    "$pull": {"likedBy": userId},
                    "$set": {"updatedOn": datetime.utcnow()},
                },
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="like_state must be either 1 (to add like) or -1 (to remove like)",
            )

        logger.debug(
            f"like state toggled by userId=>{userId} on modelId=>{modelId} to state=>{like_state}"
        )
    except ServerSelectionTimeoutError as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database",
        )
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"unable to udpate model with model ID {modelId}")

def getting_image_url_by_ids(modelId, imageId):
    try:
        query = {
            "_id": ObjectId(modelId),
            "modelImages.imageId": imageId
        }

        projection = {
            "_id": 0,
            "modelImages.$": 1
        }

        result = models.find_one(query, projection)

        if result:
            imageUrl = result["modelImages"][0]["imageUrl"]
            return imageUrl
        else:
            logger.error(f"model with model id {modelId} not found")
            return HTTPException(status_code=status.HTTP_404_NOT_FOUND , detail="model not found")
    except ServerSelectionTimeoutError as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database",
        )
    except Exception as e:
            logger.error(e)
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                detail=f"unable to udpate model with model ID {modelId}")
    
def getting_cover_image_url(modelId):
    try:
        model_doc = models.find_one({"_id" : ObjectId(modelId)})
        cover_image = model_doc.get("coverImage")

        if cover_image:
            return cover_image
        else:
            return None
    except ServerSelectionTimeoutError as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database",
        )
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="error in getting cover image url"
        )

def skipping_models(nsfw,page_size, page_num):
    skips = page_size * (page_num - 1)
    try:
        if nsfw == True:
            query = {"approvalStatus": model.Approvalstatus.LIVE.value}
        else:
            query = {"approvalStatus": model.Approvalstatus.LIVE.value, "NSFW": False}
        cursor = (
            models.find(query)
            .skip(skips)
            .limit(page_size)
        )
        return cursor
    except ServerSelectionTimeoutError as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database",
        )
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,detail="error in skipping models"
        )
    
def reporting_model(modelId , userId , comment):
    try:
        _model = models.find_one({"_id" : ObjectId(modelId)})
        if _model["approvalStatus"] != "Live":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="cannot report model which is not live"
            )
        if _model is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Model not found"
            )
        if any(report_data["reportedBy"] == userId for report_data in _model["reportData"]):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Model already reported by this user"
            )

        report = model.ReportData(
            reportedBy = userId,
            reportReason = comment,
            reportedOn= datetime.utcnow()
        )
        report_dict = report.dict()
        models.update_one({"_id" : ObjectId(modelId)} , {"$addToSet" : {"reportData" : report_dict},
                                                         "$set" : {"reported" : True} })
        return {"message" : "Model reported successfully"}
    except HTTPException as e:
        logger.error(e.detail)
        raise e
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="error in reporting model"
        )

def adding_comment(modelId , commentId):
    try:
        model = models.find_one_and_update({"_id" : ObjectId(modelId)} , {"$push" : {"commentIds" : commentId}})
        if model is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail=f"Model not found with modelId {modelId}"
            )
    except HTTPException as e:
        logger.error(e.detail)
        raise e
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="error in adding comment"
        )

def deleting_comment(modelId,commentId):
    try:
        model = models.find_one_and_update({"_id" : ObjectId(modelId)} , {"$pull" : {"commentIds" : commentId}})
        if model is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail=f"Model not found with modelId {modelId}"
            )
    except HTTPException as e:
        logger.error(e.detail)
        raise e
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="error in deleting comment"
        )


def adding_tags(tag_value , tag_label):
    tag = tags_collection.find_one({"value" : tag_value})
    try:
        if tag is None:
            tag = tags_collection.insert_one({"value" : tag_value , "label" : tag_label})
            tag_id = str(tag.inserted_id)
        else:
            tag_id = str(tag["_id"])
        return tag_id       

    except HTTPException as e:
        logger.error(e.detail)
        raise e
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="error in adding tags"
        )

def adding_category(url_encoded_value,label):
    try:
        category = categories_collection.find_one({"value" : url_encoded_value})
        if category is None:
            category = categories_collection.insert_one({"value" : url_encoded_value , "label" : label})
            category_id = str(category.inserted_id)
        else:
            category_id = str(category["_id"])
        return category_id

    except HTTPException as e:
        logger.error(e.detail)
        raise e
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="error in adding category"
        )

def getting_categories(page_size,nth_page):
    try:
        skips = page_size * (nth_page - 1)
        cursor = categories_collection.find().skip(skips).limit(page_size)
        categories_list = []
        for category in cursor:
            category["_id"] = str(category["_id"])
            categories_list.append(category)
        return categories_list

    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="error in getting categories"
        )

def getting_category(categoryId):
    try:
        category = categories_collection.find_one({"_id" : ObjectId(categoryId)})
        if category is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail=f"Category not found with categoryId {categoryId}"
            )
        category["_id"] = str(category["_id"])
        return category
    except HTTPException as e:
        logger.error(e.detail)
        raise e
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="error in getting category"
        )

def deleting_category(categoryId):
    try:
        category = categories_collection.find_one_and_delete({"_id" : ObjectId(categoryId)})
        if category is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Category not found with categoryId {categoryId}")
    except HTTPException as e:
        logger.error(e.detail)
        raise e
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="error in deleting category")

def adding_license(license):
    try:
        new_license = licenses_collection.insert_one(license)
        license_id = str(new_license.inserted_id)
        return license_id
    except HTTPException as e:
        logger.error(e.detail)
        raise e
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="error in adding license"
        )

def getting_licenses():
    try:
        licenses = licenses_collection.find()
        licenses_list = []
        for license in licenses:
            license["_id"] = str(license["_id"])
            licenses_list.append(license)
        return licenses_list
    except HTTPException as e:
        logger.error(e.detail)
        raise e
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="error in getting licenses"
        )
    
def getting_license(licenseId):
    try:
        license = licenses_collection.find_one({"_id" : ObjectId(licenseId)})
        if license is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail=f"License not found with licenseId {licenseId}"
            )
        license["_id"] = str(license["_id"])
        return license
    except HTTPException as e:
        logger.error(e.detail)
        raise e
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="error in getting license"
        )
    
def updating_license(licenseId,license):
    try:
        license = licenses_collection.find_one_and_update({"_id" : ObjectId(licenseId)} , {"$set" : license})
        if license is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail=f"License not found with licenseId {licenseId}"
            )
    except HTTPException as e:
        logger.error(e.detail)
        raise e
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="error in updating license"
        )

def deleting_license(licenseId):
    try:
        license = licenses_collection.find_one_and_delete({"_id" : ObjectId(licenseId)})
        if license is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail=f"License not found with licenseId {licenseId}"
            )
    except HTTPException as e:
        logger.error(e.detail)
        raise e
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="error in deleting license"
        )
    
def deleting_tag(tagId):
    try:
        tag = tags_collection.find_one_and_delete({"_id" : ObjectId(tagId)})
        if tag is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail=f"Tag not found with tagId {tagId}"
            )
    except HTTPException as e:
        logger.error(e.detail)
        raise e
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="error in deleting tag")

def getting_tags(pageSize, nthPage):
    try:
        skips = pageSize * (nthPage - 1)
        cursor = tags_collection.find().skip(skips).limit(pageSize)
        tags_list = []
        for tag in cursor:
            tag["_id"] = str(tag["_id"])
            tags_list.append(tag)
        return tags_list
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="error in getting tags")

def getting_tags_data_from_ids(tagIds):
    try:
        tags_data = []
        for tagId in tagIds:
            tag = tags_collection.find_one({"_id" : ObjectId(tagId)})
            tag["_id"] = str(tag["_id"])
            tags_data.append(tag)
        return tags_data
    except HTTPException as e:
        logger.error(e.detail)
        raise e
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail=str(e))

def adding_unzipped_files_to_models_db(stl_files,glb_files,model_id):
    try:
        logger.info("adding unzipped files to models db")
        if glb_files:
            for stl_file in stl_files:
                stl_file_data = model.FileData(
                    fileName=stl_file[0],
                    fileSize=stl_file[1],
                    filePath=stl_file[2],
                )
                stl_file_dict = stl_file_data.dict()
                # print(stl_file_dict)
                models.update_one(
                    {"_id": ObjectId(model_id)},
                    {
                        "$push": {
                            "modelFiles.stlFiles": stl_file_dict,
                        }
                    },
                )
            
            for glb_file in glb_files:
                glb_file_data = model.FileData(
                    fileName=glb_file[0],
                    fileSize=glb_file[1],
                    filePath=glb_file[2],
                )
                glb_file_dict = glb_file_data.dict()
                # print(glb_file_dict)
                models.update_one(
                    {"_id": ObjectId(model_id)},
                    {
                        "$push": {
                            "modelFiles.glbFiles": glb_file_dict,
                        }
                    },
                )
        else:
            for stl_file in stl_files:
                stl_file_data = model.FileData(
                    fileName=stl_file[0],
                    fileSize=stl_file[1],
                    filePath=stl_file[2],
                )
                stl_file_dict = stl_file_data.dict()
                models.update_one(
                    {"_id": ObjectId(model_id)},
                    {"$push": {"modelFiles.stlFiles": stl_file_dict}},
                )

       
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="unable to add unzipped files to models db",
        )
    

def deleting_model(modelId):
    try:
        model = models.find_one_and_delete({"_id" : ObjectId(modelId)})
        if model is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail=f"Model not found with modelId {modelId}"
            )
    except HTTPException as e:
        logger.error(e.detail)
        raise e
    except Exception as e:
        logger.error(e)
        raise e

def adding_review(modelId, reviewId , userId):
    try:
        model = models.find_one({"_id" : ObjectId(modelId)})
        if any(userId == review["reviewerId"] for review in model["reviewData"]):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"User {userId} already reviewed this model",
            )
        if model is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail=f"Model not found with modelId {modelId}"
            )
        review_data = Review(
            reviewId=reviewId,
            reviewerId=userId
        )
        review_dict = review_data.dict()
        model = models.update_one({"_id" : ObjectId(modelId)} , {"$addToSet" : {"reviewData" : review_dict}})
    except HTTPException as e:
        logger.error(e.detail)
        raise e
    except Exception as e:
        logger.error(e)
        raise e

def deleting_review_from_model_db(modelId,reviewId,userId):
    try:
        model = models.find_one_and_update({"_id" : ObjectId(modelId)} , {"$pull" : {"reviewData" : {"reviewId" : reviewId}}})
        if model is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail=f"Model not found with modelId {modelId}"
            )
    except HTTPException as e:
        logger.error(e.detail)
        raise e
    except Exception as e:
        logger.error(e)
        raise e

def deleting_review_by_admin(reviewId):
    try:
        campaign = campaign_collection.find_one_and_update({"rewardAndTier.reviewData.reviewId" : reviewId},{"$pull": {"rewardAndTier.$.ReviewData" : {"reviewId" : reviewId} }})
        print("campaign" , campaign)     
    except HTTPException as e:
        logger.error(e.detail)  
        raise e
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="error in deleting review"
        )
    