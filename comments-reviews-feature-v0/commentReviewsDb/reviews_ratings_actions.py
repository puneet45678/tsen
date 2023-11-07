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
from services import uploads
credentials_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"},
)
from models import reviews

from logger.logging import getLogger

logger = getLogger(__name__)
try:
    db = client[config.mongodb["username"]]
except ServerSelectionTimeoutError as e:
    logger.error(f"Could not connect to MongoDB: {e}")
    
comment_collection = db["comments"]
replies_collection = db["replies"]
reviews_collection = db["reviews"]
# campaign_collection =db["campaigns"]

def posting_review(userId):
    
    try:
        new_review = reviews.Review(
            reviewerId=userId,
            reviewImages=[],
            reportData=[],
            updateTime=datetime.utcnow(),
            foundHelpfulBy=[],
            reported=False,
            
        )
        new_review = new_review.dict()
        reviewId = reviews_collection.insert_one(new_review).inserted_id
        logger.debug(f"review posted with reviewId:{reviewId}")
        return str(reviewId)
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
            status_code=status.HTTP_404_NOT_FOUND,detail="unable to post review"
        )
    
def posting_rating(user_id , rating):
    try:
        if rating not in [1,2,3,4,5]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="rating should be between 1 to 5"
            )
        new_rating = reviews.Review(
            reviewerId=user_id,
            rating=rating,
            reviewImages=[],
            reportData=[],
            updateTime=datetime.utcnow(),
            foundHelpfulBy=[],
            reported=False,
        )
        new_rating = new_rating.dict()
        reviewId = reviews_collection.insert_one(new_rating).inserted_id
        logger.debug(f"rating posted with reviewId:{reviewId}")
        return str(reviewId)
    except Exception as e :
        logger.error(e) 
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,detail="unable to post rating"
        )

def get_user_from_review_id(reviewId):
    try:
        review = reviews_collection.find_one({"_id":ObjectId(reviewId)})
        if review is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="review not found"
            )
        return review["reviewerId"]
    except Exception as e:
        logger.error(e) 
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,detail="not able to get user from review id"
        )

def submitting_review(userId , review , reviewId):
    try:
        if get_user_from_review_id(reviewId)!= userId:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="you are not authorized to update this review"
            )
        review["updateTime"] = datetime.utcnow()
        review = {k: v for k, v in review.items() if v is not None}
        reviews_collection.update_one({"_id":ObjectId(reviewId)} , {"$set":review})
        logger.debug(f"review posted with reviewId:{reviewId}")
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
            status_code=status.HTTP_404_NOT_FOUND,detail="not able to update review"
        )

def deleting_review(reviewId):
    try:
        review = reviews_collection.find_one_and_delete({"_id":ObjectId(reviewId)})
        if review is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="review not found"
            )
        logger.debug(f"review deleted with reviewId:{reviewId}")
    except ServerSelectionTimeoutError as e:
        logger.error(e)        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to connect to the database"
        )
    except Exception as e :
        logger.error(e) 
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,detail="not able to delete review"
        )

def deleting_review_image(reviewId , userId , imageUuid):
    try:
        review = reviews_collection.find_one({"_id":ObjectId(reviewId)})
        if review is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="review not found"
            )
        if review["reviewerId"] != userId:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="you are not authorized to delete this review image"
            )
        reviews_collection.update_one({"_id":ObjectId(reviewId)} , {"$pull":{"reviewImages":{"imageUUID":imageUuid}}})
        logger.debug(f"review image -{imageUuid} deleted for reviewId:{reviewId}")
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
            status_code=status.HTTP_404_NOT_FOUND,detail="not able to delete review images"
        )

def getting_reviews_by_ids(reviewIds):
    try:
        reviews = reviews_collection.find({"_id":{"$in":[ObjectId(reviewId) for reviewId in reviewIds]}})
        reviews = list(reviews)
        if not reviews:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="reviews not found check you reviewIds"
            )
        for review in reviews:
            review["_id"] = str(review["_id"])
        return reviews
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
            status_code=status.HTTP_404_NOT_FOUND,detail="not able to get reviews"
        )

def reporting_review(reviewId , userId , comment):
    try:
        review = reviews_collection.find_one({"_id":ObjectId(reviewId)})
        if review is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"review not found with reviewId:{reviewId}"
            )
        if any(report_data["reportedBy"] == userId for report_data in review["reportData"]):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"review already reported by this user with userId:{userId}"
            )
        report = reviews.ReportData(
            reportedBy=userId,
            reportReason= comment,
            reportedOn= datetime.utcnow()
        )
        report = report.dict()
        reviews_collection.update_one({"_id":ObjectId(reviewId)} , {"$addToSet":{"reportData":report},
                                                                    "$set":{"reported":True}})
        logger.debug(f"review reported for reviewId:{reviewId} and by user with userId:{userId}")
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
            status_code=status.HTTP_404_NOT_FOUND,detail="not able to report review"
        )

def getting_reported_reviews(page , pageSize):
    try:
        reviews = reviews_collection.find({"reported":True}).skip((page-1)*pageSize).limit(pageSize)
        reviews = list(reviews)
        print("jfsadkjlkjasdfj;kl")
        if not reviews:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"reviews not found" 
            )
        for review in reviews:
            review["_id"] = str(review["_id"])
        return reviews
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
            status_code=status.HTTP_404_NOT_FOUND,detail="not able to get reviews")

def deleting_review_by_admin(reviewId,userId):
    try:
        review = reviews_collection.find_one_and_delete({"_id":ObjectId(reviewId)})
        if review is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"review not found with reviewId:{reviewId}"
            )
        logger.debug(f"review deleted by admin with reviewId:{reviewId} and by admin with userId:{userId}")
    except ServerSelectionTimeoutError as e:
        logger.error(e)        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="Failed to connect to the database"
        )
    except HTTPException as e:
        logger.error(e.detail)
        raise e
    except Exception as e :
        logger.error(e) 
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,detail="not able to delete review by admin")

def helpful_review(reviewId , user_id):
    try:
        review = reviews_collection.find_one({"_id":ObjectId(reviewId)})
        if review is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"review not found with reviewId:{reviewId}"
            )
        if (user_id in review["foundHelpfulBy"]):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"review already marked helpful by this user with userId:{user_id}"
            )
        reviews_collection.update_one({"_id":ObjectId(reviewId)} , {"$addToSet":{"foundHelpfulBy":user_id}})
        logger.debug(f"review marked helpful with reviewId:{reviewId} and by user with userId:{user_id}")
    except ServerSelectionTimeoutError as e:
        logger.error(e)        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="Failed to connect to the database"
        )
    except HTTPException as e:
        logger.error(e.detail)
        raise e
    except Exception as e :
        logger.error(e) 
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,detail="not able to mark review helpful")

def adding_review_images(user_id , reviewId , imageUrl,imageUUID):
    try:
        imageData = reviews.ImageData(
            imageUrl=imageUrl,
            imageUUID=imageUUID,
        )
        imageData = imageData.dict()
        review = reviews_collection.find_one({"_id":ObjectId(reviewId)})
        if review is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"review not found with reviewId:{reviewId}"
            )
        if review["reviewerId"]!= user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"you are not authorized to update this review image with reviewId:{reviewId}"
            )
        if len(review["reviewImages"])>8:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"you can't add more than 8 images to a review with reviewId:{reviewId}"
            )
        
        reviews_collection.update_one({"_id":ObjectId(reviewId)} , {"$push":{"reviewImages":imageData}})
        logger.debug(f"review image added with reviewId:{reviewId}")
    except ServerSelectionTimeoutError as e:
        logger.error(e)        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,detail="Failed to connect to the database"
        )
    except HTTPException as e:
        logger.error(e.detail)
        raise e
    except Exception as e :
        logger.error(e) 
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,detail="not able to update review image")

def get_review_from_reviewId(reviewId):
    try:
        review = reviews_collection.find_one({"_id":ObjectId(reviewId)})
        if review is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"review not found with reviewId:{reviewId}"
            )
        return review
    except Exception as e:
        logger.error(e) 
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,detail="not able to get review from reviewId"
        )

def getting_review(reviewId):
    try:
        review = reviews_collection.find_one({"_id":ObjectId(reviewId)})
        if review is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"review not found with reviewId:{reviewId}"
            )
        review["_id"] = str(review["_id"])
        return review
    except Exception as e:
        logger.error(e) 
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,detail="not able to get review from reviewId"
        )

def getting_reviews_by_ids_paginated(reviewIds,page,pageSize):
    try:
        skip = (page-1)*pageSize
        reviews = reviews_collection.find({"_id":{"$in":[ObjectId(reviewId) for reviewId in reviewIds]}}).skip(skip).limit(pageSize)
        reviews = list(reviews)
        if not reviews:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="reviews not found check you reviewIds"
            )
        for review in reviews:
            review["_id"] = str(review["_id"])
        return reviews
    except Exception as e:
        logger.error(e) 
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,detail="not able to get reviews"
        )