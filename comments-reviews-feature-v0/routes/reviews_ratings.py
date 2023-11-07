from fastapi import APIRouter , Body , HTTPException ,status , Depends , FastAPI , BackgroundTasks
from typing import List
from bson import ObjectId
from fastapi import UploadFile , File , Form
from commentReviewsDb import database_actions,reviews_ratings_actions
from fastapi.encoders import jsonable_encoder
from services import comment_service, reviews_ratings_service , uploads
from fastapi.requests import Request
from starlette.responses import Response, JSONResponse
from supertokens_python.recipe.userroles import UserRoleClaim,PermissionClaim
from supertokens_python.recipe.session.exceptions import raise_invalid_claims_exception, ClaimValidationError
from models import comments,reviews
from utils import utils
from logger.logging import getLogger
from slowapi import Limiter
from slowapi.util import get_remote_address
from fastapi import APIRouter, HTTPException, Depends
from slowapi.errors import RateLimitExceeded
from services import m2m_calls
from typing import Optional
from services.roles_permissions_services import check_role_claim, check_permission_claim
logger = getLogger(__name__)


router = APIRouter(tags=["Reviews"], prefix=f"/api/v1") 
prefix="/api/v1"

@router.post("/review/campaign/{campaignId}", status_code=status.HTTP_201_CREATED)
async def post_review(request:Request , campaignId : str, tierId:str , background_tasks : BackgroundTasks):
    user_id = request.state.user_id
    reviewId = await reviews_ratings_service.post_review(user_id)
    try:
        await m2m_calls.adding_review_in_campaign_db(request,reviewId,campaignId,tierId)
    except HTTPException as e:
        reviews_ratings_actions.deleting_review(reviewId)
        logger.error(e.detail)
        raise e
    except Exception as e:
        reviews_ratings_actions.deleting_review(reviewId)
        logger.debug("review deleted from campaign db for rollback from campaign service")
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR , detail= "error in adding review in campaign db")
    return {"reviewId":reviewId}


@router.post("/rating/model/{modelId}", status_code=status.HTTP_201_CREATED)
async def post_rating(request:Request , modelId : str, rating: int , background_tasks: BackgroundTasks):
    user_id = request.state.user_id
    reviewId = await reviews_ratings_service.post_rating(user_id , rating)
    try:
        await m2m_calls.adding_review_in_models_db(request,reviewId,modelId)
        # background_tasks.add_task(m2m_calls.adding_review_in_models_db, request,reviewId,modelId)
    except HTTPException as e:
        reviews_ratings_actions.deleting_review(reviewId)
        logger.error(e.detail)
        raise e
    except Exception as e:
        reviews_ratings_actions.deleting_review(reviewId)
        logger.debug("review deleted from models db for rollback from campaign service")
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR , detail= "error in adding review in models db")
    return {"message":"rating posted successfully with ",
            "reviewId" : reviewId}

@router.put("/review/{reviewId}", status_code=status.HTTP_200_OK)
async def submit_review(request : Request , review : reviews.ReviewUpdate ,reviewId:str):
    user_id = request.state.user_id
    review = review.dict()
    await reviews_ratings_service.submit_review(user_id , review , reviewId)
    return {"message":"review posted successfully"}


@router.get("/review/{reviewId}", status_code=status.HTTP_200_OK)
async def get_review(reviewId:str):
    review = await reviews_ratings_service.get_review(reviewId)
    return review


@router.put("/review/{reviewId}/images", status_code=status.HTTP_200_OK)
async def add_review_images(request : Request , reviewId:str , file : UploadFile , background_tasks: BackgroundTasks):
    user_id = request.state.user_id
    contents = file.file.read() 
    imageName = file.filename   
    imageUrl , imageUUID = await uploads.upload_picture_to_uploadcare(contents , imageName)     
    await reviews_ratings_service.add_review_images(user_id , reviewId , imageUrl,imageUUID)
    return {"message":"review images uploaded successfully",
            "imageUUID":imageUUID}

@router.delete("/review/{reviewId}/images", status_code=status.HTTP_200_OK)
async def delete_review_image(reviewId:str , request:Request , imageUuid:str , background_tasks: BackgroundTasks):
    user_id = request.state.user_id
    await reviews_ratings_service.delete_review_image(reviewId , user_id , imageUuid , background_tasks)
    return {"message":"review images deleted successfully"}

@router.delete("/review/{reviewId}/model/{modelId}", status_code=status.HTTP_200_OK)
async def delete_model_review(reviewId:str ,modelId : str , request:Request , background_tasks: BackgroundTasks):
    user_id = request.state.user_id
    await reviews_ratings_service.delete_model_review(reviewId ,modelId, user_id , background_tasks,request)
    return {"message":"review deleted successfully"}

@router.delete("/review/{reviewId}/campaign/{campaignId}")
async def delete_campaign_review(reviewId:str , campaignId : str , tierId : str, request: Request , background_tasks: BackgroundTasks):
    user_id = request.state.user_id
    await reviews_ratings_service.delete_campaign_review(reviewId , campaignId , tierId , user_id , background_tasks,request)
    return {"message":"review deleted successfully"}

@router.post("/reviews/orders", status_code=status.HTTP_200_OK)
async def get_reviews_by_ids_for_my_orders_page(reviewIds:reviews.ReviewIds):
    reviewIds = reviewIds.reviewIds
    Response = await reviews_ratings_service.get_reviews_by_ids_my_orders(reviewIds)
    return Response

@router.post("/reviews" , status_code=status.HTTP_200_OK)
async def get_reviews_by_ids(request:Request,reviewIds:reviews.ReviewIds,page:int = 1 , pageSize:int = 10):
    reviewIds = reviewIds.reviewIds
    skipped_reviews = await reviews_ratings_service.get_reviews_by_ids_paginated(reviewIds,page,pageSize)
    reviews_data = await reviews_ratings_service.get_reviews_data_by_ids(request,skipped_reviews)
    return reviews_data

@router.post("/review/{reviewId}/report")
async def report_review(reviewId:str , request:Request , comment : str = Form()):
    user_id = request.state.user_id
    await reviews_ratings_service.report_review(reviewId , user_id , comment)
    return {"message":"review reported successfully"}


@router.get("/admin/reviews/reported", status_code=status.HTTP_200_OK)
async def get_reported_reviews_for_admin(request:Request,page:int = 1 , pageSize:int = 10):
    session = request.state.session
    await check_permission_claim(session, "Admin_ViewUserReviews")
    reviews = await reviews_ratings_service.get_reported_reviews(page , pageSize)
    return reviews

@router.delete("/admin/review/{reviewId}", status_code=status.HTTP_200_OK)
async def delete_review_by_admin(reviewId:str , request:Request , background_tasks: BackgroundTasks ):
    session = request.state.session
    userId = request.state.user_id
    await check_permission_claim(session, "Admin_DeleteUserReviews")
    await reviews_ratings_service.delete_review_by_admin(request,reviewId,userId,background_tasks)
    return {"message":"review deleted successfully"}

@router.post("/review/{reviewId}/helpful")
async def helpful_review(reviewId:str , request:Request):
    user_id = request.state.user_id
    await reviews_ratings_service.helpful_review(reviewId , user_id)
    return {"message":"review marked as helpful"}