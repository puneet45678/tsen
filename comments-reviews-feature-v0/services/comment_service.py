from fastapi import HTTPException, status
from commentReviewsDb import database_actions
from utils import utils
from datetime import datetime
from models.comments import (
    commentReviewsDb,
    ReplyDB,
    CommentFor
)
from services import (
    uploads,
    m2m_calls
)

from logger.logging import getLogger
logger = getLogger(__name__)

async def posting_comment(request,userId, comment, id,commentFor, imageUrl):
    try:
        data = commentReviewsDb(
            comment=comment,
            commentImage=imageUrl,
            pin=False,
            commentBy=userId,
            creationDate=datetime.utcnow(),
            likedBy=[],
            replies=[],
            lastEdited=datetime.utcnow(),
            reported=False,
            reportData=[],
        )
        data = data.dict()
        commentId = database_actions.posting_comment(data)
        if commentFor in [CommentFor.CAMPAIGN.value,CommentFor.MODEL.value,CommentFor.UPDATE.value]:
            await m2m_calls.posting_comment_ids_in_campaign_service(request,commentFor,id,commentId)
        
        else:
            await m2m_calls.posting_comment_ids_in_user_service_for_portfolio(request,commentFor,id,commentId)
        return commentId
    except Exception as e:
        database_actions.delete_comment(commentId)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

async def pin_comment(commentId):
    return database_actions.pin_comment(commentId)
    
async def update_comment(commentId, comment, imageUrl,user_id):
    database_actions.updating_comment(commentId, comment, imageUrl,user_id)


async def deleting_comment(commentId,id,background_tasks,commenFor,request):
    try:
        comment = database_actions.find_comment_from_commentId(commentId)
        if commenFor in [CommentFor.CAMPAIGN.value,CommentFor.MODEL.value,CommentFor.UPDATE.value]:
            await m2m_calls.deleting_comments_from_campaign_service(commentId,id,commenFor,request)
        
        else:
            await m2m_calls.deleting_comments_from_user_service_for_portfolio(commentId,id,commenFor,request)
        database_actions.delete_comment(commentId)
        if comment["commentImage"]:
            background_tasks.add_task(uploads.delete_pictures_from_uploadcare,
                                        [utils.get_uuid_from_image_url_uploadcare(comment["commentImage"])])
        reply_ids = comment["replies"]
        upload_care_uuids = []
        for reply_id in reply_ids:
            reply = database_actions.deleting_reply(reply_id)
            if reply["replyImage"]:
                upload_care_uuids.append(utils.get_uuid_from_image_url_uploadcare(reply["replyImage"]))
        
        if upload_care_uuids:
            background_tasks.add_task(uploads.delete_pictures_from_uploadcare, upload_care_uuids)

    except HTTPException as e:
        logger.error(e.detail)
        raise e
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

async def toggle_like(request,commentId, userId, likeState,background_tasks):
    try:
        if likeState not in [-1, 1]:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="like_state must be 1 or -1",
                )
        if likeState == 1:
            background_tasks.add_task(m2m_calls.in_app_comment_like, request,commentId)
        database_actions.toggle_like(commentId, userId, likeState)
    except Exception as e:
        logger.error("error in toggling like")
        raise e
############################################### Reply #####################################################


async def posting_reply(request,userId, commentId, reply, imageUrl,mention,background_tasks):
    reply_data = ReplyDB(
        replyComment=reply,
        replyImage=imageUrl,
        lastEdited=datetime.utcnow(),
        creationDate=datetime.utcnow(),
        replyBy=userId,
        likedBy=[],
        replyTo=mention,
        reported=False,
        reportData=[],
    )
    reply_data = reply_data.dict()
    
    replyId = database_actions.posting_reply(reply_data, commentId)
    # await m2m_calls.in_app_comment_reply(request,commentId)
    background_tasks.add_task(m2m_calls.in_app_comment_reply, request,commentId)

    return replyId


async def getting_all_replies(page, pageSize, commentId):
    replies = database_actions.get_all_replies(page, pageSize, commentId)
    return replies


async def getting_reply(replyId):
    return database_actions.get_reply(replyId)


async def deleting_reply(replyId,background_tasks):
    database_actions.delete_reply(replyId)
    reply = database_actions.find_reply_from_replyId(replyId)
    if reply["replyImage"]:
        background_tasks.add_task(uploads.delete_pictures_from_uploadcare,
                                 [utils.get_uuid_from_image_url_uploadcare(reply["replyImage"])])
    
async def toggle_like_reply(replyId, userId, likeState):
    database_actions.toggle_like_reply(replyId, userId, likeState)

async def update_reply(replyId , reply , imageUrl):
    database_actions.updating_reply(replyId , reply , imageUrl)

async def report_comment(commentId , userId , text):
    database_actions.reporting_comment(commentId , userId , text)

async def get_reported_comments(page , pageSize):
    comments = database_actions.get_reported_comments(page , pageSize)
    return comments

async def get_all_comments_paginated(commentIds,page,pageSize):
        comments = database_actions.getting_all_comments(commentIds,page,pageSize)
        return comments
    
async def fetching_comments_data(request,comments):
    user_ids_list = []
    for comment in comments:
        user_ids_list.append(comment["commentBy"])
    
    users_data = await m2m_calls.get_users_data(request,user_ids_list)
    for user_data, comment in zip(users_data, comments):
        comment["commenterName"] = user_data["username"]
        comment["commenterImage"] = user_data["displayInformation"]["profilePicture"]["pictureUrl"]
        comment["commenterImageCropped"] = user_data["displayInformation"]["profilePicture"]["croppedPictureUrl"]
    return comments

async def get_all_replies_paginated(reply_ids, page, pageSize):
    skip = (page - 1) * pageSize
    replies = []
    try:
        for replyId in reply_ids[skip:skip + pageSize]:
            reply_data = database_actions.find_reply_from_replyId(replyId)
            reply_data["_id"] = str(reply_data["_id"])
            replies.append(reply_data)
        return replies
    except IndexError:
        return []
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

async def fetching_replies_data(request,replies):
    user_ids_list = []
    for reply in replies:
        user_ids_list.append(reply["replyBy"])
    
    users_data = await m2m_calls.get_users_data(request,user_ids_list)

    for user_data, reply in zip(users_data, replies):
        reply["replierName"] = user_data["username"]
        reply["replierImage"] = user_data["displayInformation"]["profilePicture"]["pictureUrl"]
        reply["replierImageCropped"] = user_data["displayInformation"]["profilePicture"]["croppedPictureUrl"]
    return replies