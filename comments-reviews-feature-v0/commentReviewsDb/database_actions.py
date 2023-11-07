from datetime import datetime , timezone
from pymongo import UpdateOne 
from fastapi import HTTPException , status
from bson import ObjectId
from datetime import datetime , timezone
from uuid import uuid4
from pymongo.errors import ServerSelectionTimeoutError
from config.read_yaml import config
from .dbclient import client
import pymongo
from pymongo import MongoClient
from config.read_yaml import *
credentials_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"},
)
from models import comments

from logger.logging import getLogger

logger = getLogger(__name__)
try:
    db = client[config.mongodb["username"]]
except ServerSelectionTimeoutError as e:
    logger.error(f"Could not connect to MongoDB: {e}")
    
comment_collection = db["comments"]
replies_collection = db["replies"]
campaign_collection =db["campaigns"]

def posting_comment(data):
    try:
        comment_id =  comment_collection.insert_one(data).inserted_id
        return str(comment_id)
    except ServerSelectionTimeoutError as e:
        logger.error(e)        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database"
        ) 
    except Exception as e :
        logger.error(e) 
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,detail="error in posting comment"
        )

def getting_all_comments(commentIds,page,pageSize):
    skip = (page - 1) * pageSize
    comments = []
    try:
        for commentId in commentIds[skip:skip + pageSize]:
            comment_data = find_comment_from_commentId(commentId)
            comment_data["_id"] = str(comment_data["_id"])
            comments.append(comment_data)
        return comments
    except IndexError:
        return []
    except ServerSelectionTimeoutError as e:
        logger.error(e)        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database" 
        )
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

def pin_comment(commentId):
    comment = comment_collection.find_one({"_id": ObjectId(commentId)})

    # Check if the comment exists and is in the correct campaign
    try:
        if comment:
            if 'pin' in comment and comment['pin'] == True:
                # If the comment is already pinned, unpin it
                comment_collection.update_one({"_id": ObjectId(commentId)}, {"$set": {"pin": False}})
                return {"message": "Comment unpinned successfully"}
            else:
                # # Unpin any currently pinned comments in the same campaign
                # comment_collection.update_many({"pin": True, "campaignId": campaignId}, {"$set": {"pin": False}})
            
                # Pin the new comment
                comment_collection.update_one({"_id": ObjectId(commentId)}, {"$set": {"pin": True}})
                return {"message": "Comment pinned successfully"}
        else:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="comment not found")
    
    except HTTPException as e:
        logger.error(e.detail)
        raise e
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail=str(e))


def get_pinned_comments(campaignId ):
     try:
         pinned_comment = comment_collection.find_one({"campaignId": campaignId, "pin": True})
         return pinned_comment
     except ServerSelectionTimeoutError as e:
        logger.error(e)        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database"
        ) 
     except Exception as e :
        logger.error(str(e)) 
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )             

def get_unpinned_comments(campaignId , skip , comments_to_fetch):
    try:
        unpinned_comments=comment_collection.find({"campaignId": campaignId, "pin": {"$ne": True}}).skip(skip).limit(comments_to_fetch)
        return unpinned_comments
    except ServerSelectionTimeoutError as e:
        logger.error(e)        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database"
        ) 
    except Exception as e:
            logger.error(e) 
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
            )     
        
def find_comment_from_commentId(commentId):
    comment = comment_collection.find_one({"_id": ObjectId(commentId)})
    if comment is None:
        logger.error(f"commentId :{commentId} not exists") 
        raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,detail="commentId not exists"
        )
    return comment 
 

def updating_comment(commentId , comment_text , imageUrl, userId):
    try:
        comment = comment_collection.find_one({"_id": ObjectId(commentId)})
        if comment is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="comment not found"
            )
        
        if comment["commentBy"] != userId:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="you are not authorized to update this comment"
            )
        
        updated_comment = comment_collection.find_one_and_update({"_id" : ObjectId(commentId)} , {"$set" : {"comment" : comment_text,
                                                                                                            "commentImage" : imageUrl}})
    
    except HTTPException as e:
        logger.error(e.detail)
        raise e
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="not able to update comment"
        )
 
      
               
def delete_comment(commentId):   
    try:
        comment_collection.delete_one({"_id": ObjectId(commentId)})

    except ServerSelectionTimeoutError as e:
        logger.error(e)        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database"
        )
    except Exception as e:
            logger.error(e) 
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,detail="error in deleting comment"
            )             
        
       
        

def find_reply_from_replyId(replyId):
    reply = replies_collection.find_one({"_id": ObjectId(replyId)})
    return reply

def post_reply(reply):
    try:
        replyId=replies_collection.insert_one(reply).inserted_id
        return str(replyId)
    except ServerSelectionTimeoutError as e:
        logger.error(e)        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database"
        ) 
    
def get_all_replies(page, pageSize, commentId):
    skip = (page - 1) * pageSize
    replies = []
    try:
        for reply in replies_collection.find({"path": {"$regex": f"^{commentId}/"}}).skip(skip).limit(pageSize):
            reply['_id'] = str(reply['_id'])  # convert ObjectId to str for serialization
            replies.append(reply)
        return replies 
    except ServerSelectionTimeoutError as e:
        logger.error(e)        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database"
        ) 
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="not able to get replies"
        )   
        
                                 

def get_reply(replyId):
    try:
        reply = find_reply_from_replyId(replyId)
        if reply is not None:
            reply['_id'] = str(reply['_id'])  # convert ObjectId to str for serialization
            return reply
        
        else:
            logger.error(f"replyId :{replyId} not exists") 
            raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,detail="replyId not exists"
            )  
    except ServerSelectionTimeoutError as e:
        logger.error(e)        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database"
        )
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="not able to get reply"
        )
        
def delete_reply(replyId ):
    try:
        replies_collection.delete_one({"_id": ObjectId(replyId)})        
    except ServerSelectionTimeoutError as e:
        logger.error(e)        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database"
        )      

def toggle_like(commentId, userId, likeState):
    try:
        comment = comment_collection.find_one({"_id": ObjectId(commentId)})
        if likeState == -1 and userId not in comment["likedBy"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User did not like the comment",
            )
        if userId in comment["likedBy"] and likeState == 1:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User already liked the comment",
            )
        
        if comment is None:
            logger.error(f"commentId :{commentId} not exists") 
            raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,detail="commentId not exists"
            )
        if likeState == 1:
                comment_collection.update_one(
                    {"_id": ObjectId(commentId)},
                    {
                        "$push": {"likedBy": userId},
                        "$set": {"lastEdited": datetime.utcnow()},
                    },
                )
        else:
            comment_collection.update_one(
                {"_id": ObjectId(commentId)},
                {
                    "$pull": {"likedBy": userId},
                    "$set": {"lastEdited": datetime.utcnow()},
                },
            )
    except ServerSelectionTimeoutError as e:
        logger.error(e)        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database" 
        )
    except HTTPException as e:
        logger.error(e.detail)
        raise e
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="not able to toggle like"
        )

def toggle_like_reply(replyId, userId, likeState):
    try:
        reply = replies_collection.find_one({"_id": ObjectId(replyId)})
        if likeState == -1 and userId not in reply["likedBy"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User did not like the reply",
            )
        if userId in reply["likedBy"] and likeState == 1:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User already liked the reply",
            )
        if likeState not in [-1, 1]:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="like_state must be 1 or -1",
                )
        if reply is None:
            logger.error(f"replyId :{replyId} not exists") 
            raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,detail="replyId not exists"
            )
        if likeState == 1:
                replies_collection.update_one(
                    {"_id": ObjectId(replyId)},
                    {
                        "$push": {"likedBy": userId},
                        "$set": {"lastEdited": datetime.utcnow()},
                    },
                )
        else:
            replies_collection.update_one(
                {"_id": ObjectId(replyId)},
                {
                    "$pull": {"likedBy": userId},
                    "$set": {"lastEdited": datetime.utcnow()},
                },
            )
    except ServerSelectionTimeoutError as e:
        logger.error(e)        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database" 
        )
    except HTTPException as e:
        logger.error(e.detail)
        raise e
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="not able to toggle like"
        )
          
def updating_reply(replyId , reply , imageUrl):
    try: 
        replies_collection.update_one({"_id": ObjectId(replyId)},{"$set":{"replyComment":reply,
                                                                          "replyImage": imageUrl}})
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="not able to update reply"
        )
                            
                 
def reporting_comment(commentId , userId , text):
    try:
        comment = comment_collection.find_one({"_id": ObjectId(commentId)})
        if comment is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="comment not found"
            )
        if any(report_data["reportedBy"] == userId for report_data in comment["reportData"]):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="campaign already reported by this user"
            )
        report = comments.ReportData(
            reportedBy=userId,
            reportReason= text,
            reportedOn= datetime.utcnow()
        )
        report = report.dict()
        comment_collection.update_one({"_id": ObjectId(commentId)} , {"$addToSet":{"reportData":report},
                                                                    "$set":{"reported":True}})
    except HTTPException as e:
        logger.error(e.detail)
        raise e
    except Exception as e :
        logger.error(e) 
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="not able to report comment"
        )

def get_reported_comments(page , pageSize):
    try:
        comments = comment_collection.find({"reported":True}).skip((page-1)*pageSize).limit(pageSize)
        comments = list(comments)
        if not comments:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="comments not found"
            )
        for comment in comments:
            comment["_id"] = str(comment["_id"])
        return comments
    except ServerSelectionTimeoutError as e:
        logger.error(e)        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database" 
        )
    except HTTPException as e:
        logger.error(e.detail)
        raise e
    except Exception as e :
        logger.error(e) 
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="not able to get comments")

def posting_reply(reply_data, commentId):
    try:
        reply_id = replies_collection.insert_one(reply_data).inserted_id
        reply_id = str(reply_id)
        comment_collection.find_one_and_update({"_id" : ObjectId(commentId)} , {"$addToSet" : {"replies" : reply_id}})
        return reply_id
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

def deleting_reply(replyId):
    reply = replies_collection.find_one_and_delete({"_id": ObjectId(replyId)})
    if not reply:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="reply not found"
        )
    return reply
