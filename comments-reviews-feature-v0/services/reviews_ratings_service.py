from fastapi import HTTPException, status
from commentReviewsDb import reviews_ratings_actions
from utils import utils
from datetime import datetime
from fastapi.encoders import jsonable_encoder
from models import reviews
from services import uploads,m2m_calls

from logger.logging import getLogger

logger = getLogger(__name__)

async def post_review(userId):
    try:
        return reviews_ratings_actions.posting_review(userId)
    except Exception as e:
        logger.error("Error in post_review service")
        raise e

async def post_rating(user_id , rating):
    try:
        return reviews_ratings_actions.posting_rating(user_id , rating)
    except Exception as e:
        logger.error("Error in post_rating service")
        raise e

async def submit_review(userId , review , reviewId):
        reviews_ratings_actions.submitting_review(userId, review , reviewId)
    
async def delete_model_review(reviewId,modelId, userId,background_tasks,request):
    try:
        if reviews_ratings_actions.get_user_from_review_id(reviewId) != userId:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="you are not authorized to delete this review"
            )
        
        review = reviews_ratings_actions.get_review_from_reviewId(reviewId)
        await m2m_calls.deleting_review_from_model_db(request,reviewId,modelId)
        reviews_ratings_actions.deleting_review(reviewId)
        uuids = [image["imageUUID"] for image in review["reviewImages"]]
        background_tasks.add_task(uploads.delete_pictures_from_uploadcare, uuids)
        
    except HTTPException as e:
        logger.error(e)
        raise e
    except Exception as e:
        logger.error("Error in delete_review")
        raise e

async def delete_campaign_review(reviewId,campaignId,tierId ,userId,background_tasks,request):
    try:
        if reviews_ratings_actions.get_user_from_review_id(reviewId) != userId:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="you are not authorized to delete this review"
            )
        
        review = reviews_ratings_actions.get_review_from_reviewId(reviewId)
        await m2m_calls.deleting_review_from_campaign_db(request,reviewId,campaignId,tierId)
        reviews_ratings_actions.deleting_review(reviewId)
        uuids = [image["imageUUID"] for image in review["reviewImages"]]
        background_tasks.add_task(uploads.delete_pictures_from_uploadcare, uuids)
        
    except HTTPException as e:
        logger.error(e)
        raise e
    except Exception as e:
        logger.error("Error in delete_review")
        raise e

async def delete_review_image(reviewId, userId, imgaeUuid,background_tasks):
    try:
        background_tasks.add_task(uploads.delete_pictures_from_uploadcare, [imgaeUuid])
        reviews_ratings_actions.deleting_review_image(reviewId, userId, imgaeUuid)
        
    except Exception as e:
        logger.error("Error in delete_review_images")
        raise e

async def get_reviews_by_ids_my_orders(reviewIds):
    try:
        response = {}
        reviews_data = reviews_ratings_actions.getting_reviews_by_ids(reviewIds)
        for reviewId , review_data in zip(reviewIds , reviews_data):
            response[reviewId] = review_data
        return response
    except Exception as e:
        logger.error("Error in get_reviews_by_ids")
        raise e
    
async def get_reviews_by_ids_paginated(reviewIds,page,pageSize):
    return reviews_ratings_actions.getting_reviews_by_ids_paginated(reviewIds,page,pageSize)

async def get_reviews_data_by_ids(request,reviews_data):
    user_ids = [review["reviewerId"] for review in reviews_data]
    users_data = await m2m_calls.get_users_data(request,user_ids)
    for user_data , review_data in zip(users_data , reviews_data):
        review_data["reviewerName"] = user_data["username"]
        review_data["reviewerImage"] = user_data["displayInformation"]["profilePicture"]["pictureUrl"]
        review_data["reviewerImageCropped"] = user_data["displayInformation"]["profilePicture"]["croppedPictureUrl"]
    return reviews_data


async def report_review(reviewId, userId , comment):
    try:
        reviews_ratings_actions.reporting_review(reviewId, userId , comment)
    except Exception as e:
        logger.error("Error in report_review service")
        raise e

async def get_reported_reviews(page, pageSize):
    try:
        return reviews_ratings_actions.getting_reported_reviews(page, pageSize)
    except Exception as e:
        logger.error("Error in getting reported reviews service")
        raise e

async def delete_review_by_admin(request,reviewId,userId,background_tasks):
    try:
        review = reviews_ratings_actions.get_review_from_reviewId(reviewId)
        uuids = [image["imageUUID"] for image in review["reviewImages"]]
        background_tasks.add_task(uploads.delete_pictures_from_uploadcare, uuids)
        await m2m_calls.deleting_review_from_campaign_db_by_admin(request , reviewId)
        reviews_ratings_actions.deleting_review_by_admin(reviewId,userId)
    except Exception as e:
        logger.error("Error in deleting review by admin service")
        raise e

async def helpful_review(reviewId , user_id):
    try:
        reviews_ratings_actions.helpful_review(reviewId , user_id)
    except Exception as e:
        logger.error("Error in helpful review service")
        raise e
async def add_review_images(user_id , reviewId , imageUrl,imageUUID):
    try:
        reviews_ratings_actions.adding_review_images(user_id , reviewId , imageUrl,imageUUID)
    except Exception as e:
        logger.error("Error in update_review_images service")
        raise e

async def get_review(reviewId):
    try:
        return reviews_ratings_actions.getting_review(reviewId)
    except Exception as e:
        logger.error("Error in get_review service")
        raise e
