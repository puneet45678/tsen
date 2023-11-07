from fastapi import APIRouter , Body , HTTPException ,status , Depends , FastAPI , BackgroundTasks
from typing import List,Optional
from bson import ObjectId
from fastapi import UploadFile , File , Form
from commentReviewsDb import database_actions
from fastapi.encoders import jsonable_encoder
from services import comment_service , uploads
from fastapi.requests import Request
from starlette.responses import Response, JSONResponse
from supertokens_python.recipe.userroles import UserRoleClaim,PermissionClaim
from supertokens_python.recipe.session.exceptions import raise_invalid_claims_exception, ClaimValidationError
from models import comments
from utils import utils
from logger.logging import getLogger
from slowapi.util import get_remote_address
from fastapi import APIRouter, HTTPException, Depends
from slowapi.errors import RateLimitExceeded
from services.roles_permissions_services import check_permission_claim
logger = getLogger(__name__)


router = APIRouter(tags=["comments"], prefix=f"/api/v1") 
prefix="/api/v1"

# @router.put("/comment/{commentId}/pin")
# async def pin_comment(commentId:str):
#     response =  await comment_service.pin_comment(commentId) 
#     return response               
    

@router.post("/comment")
async def post_comment(request:Request,comment:str = Form(),Id:str = Form() , commentFor : comments.CommentFor = Form() , file : UploadFile  | None = None):
    userId = request.state.user_id
    imageUrl=None
    if file :                
        contents = file.file.read() 
        imageName = file.filename   
        imageUrl , imageUUID = await uploads.upload_picture_to_uploadcare(contents , imageName)                
    commentId = await comment_service.posting_comment(request,userId , comment , Id ,commentFor.value,imageUrl)            
    return {"message":f"comment is posted successfully",
            "commentId":commentId,
            "imageUrl":imageUrl,} 

@router.post("/comments")
async def get_all_comments(request: Request,commentIds : comments.CommentIds , page: int = 1, pageSize: int = 10):
    comment_ids = commentIds.commentIds
    comments = await comment_service.get_all_comments_paginated(comment_ids, page, pageSize)
    comments_data = await comment_service.fetching_comments_data(request,comments)
    return comments_data


@router.put("/comment/{commentId}" , status_code=status.HTTP_202_ACCEPTED)
async def update_comment(request:Request,commentId: str , comment : str = Form(), file : UploadFile  | None = None):
    imageUrl = None 
    userId = request.state.user_id
    if file :                
        contents = file.file.read() 
        imageName = file.filename   
        imageUrl , imageUUID =await uploads.upload_picture_to_uploadcare(contents , imageName) 
    await comment_service.update_comment(commentId , comment , imageUrl,userId)
    return {"message":" comment updated succesfully",
            "imageUrl":imageUrl,}
      
@router.delete("/comment/{commentId}")
async def delete_comment(request:Request,commentId: str , commentFor : comments.CommentFor = Form(),id : str = Form() , background_tasks : BackgroundTasks = Form()):
    await comment_service.deleting_comment(commentId,id,background_tasks,commentFor.value,request)
    return {"message":"deleted succesfully"}   

@router.post("/comment/{commentId}/like" , status_code=status.HTTP_201_CREATED) 
async def toggle_like_for_comment(request: Request, commentId: str, likeState: int,background_tasks : BackgroundTasks):
    userId = request.state.user_id
    await comment_service.toggle_like(request,commentId, userId, likeState,background_tasks)
    return {"message": f"comment Like state changed to {likeState}"}

@router.post("/comment/{commentId}/report")
async def report_comment(commentId:str , request:Request , text : str = Form()): 
    userId = request.state.user_id
    await comment_service.report_comment(commentId , userId , text)
    return {"message":"comment reported successfully"}

@router.get("/admin/comments/reported", status_code=status.HTTP_200_OK)
async def get_reported_comments_for_admin(request:Request,page:int = 1 , pageSize:int = 10):
    session = request.state.session
    await check_permission_claim(session, "Admin_ViewUserComments")
    comments = await comment_service.get_reported_comments(page , pageSize)
    return comments

# ####################################  Reply  ##############################################   

@router.post("/comment/{commentId}/reply")
async def post_reply(request:Request,commentId: str ,reply:str = Form(), background_tasks : BackgroundTasks = Form(),  file : UploadFile  | None = None , mention : Optional[str] = Form(None)):
    userId = request.state.user_id
    imageUrl=None
    if file :                
            contents = file.file.read() 
            imageName = file.filename   
            imageUrl , imageUUID =await uploads.upload_picture_to_uploadcare(contents , imageName) 

    replyId = await comment_service.posting_reply(request,userId , commentId , reply, imageUrl,mention,background_tasks)
            
    return {"message":f" Reply is posted succesfully" ,
            "replyId" : replyId,
            "imageUrl" : imageUrl,} 

@router.post("/replies")
async def get_all_replies(request:Request,replyIds : comments.ReplyIds, page: int = 1, pageSize: int = 10):
    reply_ids = replyIds.replyIds
    replies = await comment_service.get_all_replies_paginated(reply_ids, page, pageSize)
    replies_data = await comment_service.fetching_replies_data(request,replies)
    return replies_data     

@router.put("/reply/{replyId}")
async def update_reply(replyId: str , reply : str = Form() , file : UploadFile  | None = None):
    imageUrl=None
    if file :                
        contents = file.file.read() 
        imageName = file.filename   
        imageUrl , imageUUID =await uploads.upload_picture_to_uploadcare(contents , imageName) 
    await comment_service.update_reply(replyId , reply , imageUrl)
    return {"detail":f"reply updated succesfully",
            "imageUrl":imageUrl,}
       
@router.delete("/replies/{replyId}")
async def delete_reply(replyId: str , background_tasks : BackgroundTasks):
    await comment_service.deleting_reply(replyId,background_tasks)
    return {"detail":f"{replyId} deleting succesfully"}
       
@router.post("/reply/{replyId}/like")
async def toggle_like_for_reply(request: Request, replyId: str, likeState: int):
    userId = request.state.user_id
    await comment_service.toggle_like_reply(replyId, userId, likeState)
    logger.debug(f"like state is being changed by the user - {userId}")
    return {"message": f"reply Like state changed to {likeState}"}
       
        
        
        
        
        
        
    
        
   


              
            

            
              
        
        