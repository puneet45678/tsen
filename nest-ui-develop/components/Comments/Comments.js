import React, { useState, useEffect } from "react";
import CommentInput from "./CommentInput";
import Heart from "../../icons/Heart";
import HeartFilled from "../../icons/HeartFilled";
import ReplyIcon from "../../icons/ReplyIcon";
import ChevronDown from "../../icons/ChevronDown";
import axios from "axios";
import Image from "next/image";
import DotSvg from "../../icons/DotSvg";
import ThreeDotsVertical from "../../icons/ThreeDotsVertical";
import ReactModal from "../Modals/Modal";
import ModelReportModal from "../ModelReportModal";
import { useSelector } from "react-redux";
import ShareModal from "../ProfilePage/ShareModal";
import TimeAgo from "../TimeAgo";

const EachCommet = {
  _id: "64f081d5ffdf123f3aa3f5c6",
  data: {
    text: "aalo khalo",
    imageUrl: "",
  },
  pin: false,
  campaignId: "100",
  uniqueCommentId: "1693483477318304",
  likes: 0,
  likedBy: [],
  path: "1693483477318304",
  lastEdited: "2023-08-31T12:04:37.318000",
  sentiment: "to be added",
  commentBy: "652ccca74b52844880f69945",
  creationDate: "2023-08-31T12:04:37.318000",
  reported: true,
  reportData: [
    {
      reportedBy: "64d9b19d82ad7a6545ba2972",
      reportReason: "i amm reporting this comment",
      reportedOn: "2023-08-31T12:08:04.400000",
    },
  ],
  commenterName: "test1",
  commenterImage: null,
  commenterImageCropped: null,
};

const defaultComments = [
  {
    _id: "65311729d0bc3a8c2f3bd332",
    comment: "Iam posting as a test",
    commentImage: null,
    pin: true,
    commentBy: "652ccb7a3010089c9753b1c1",
    replies: ["65326444e6464439b05e9f82", "6532646d33a571f00f74c6e4"],
    likedBy: [],
    lastEdited: "2023-10-19T11:46:49.245000",
    creationDate: "2023-10-19T11:46:49.245000",
    reported: false,
    reportData: [],
    commenterName: "Jastagar",
    commenterImage: "https://source.unsplash.com/random",
    commenterImageCropped:
      "https://imgs.search.brave.com/fL2ympGnFQZv3t2lxmFLfoF1Dorf89wgmz8lIwobE6M/rs:fit:500:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAyLzE3LzM0LzY3/LzM2MF9GXzIxNzM0/Njc4Ml83WHBDVHQ4/YkxOSnF2VkFhRFpK/d3Zaam0wZXBRbWo2/ai5qcGc",
  },
  {
    _id: "65311fee75674134dc927ab9",
    comment: "this is a comment",
    commentImage: null,
    pin: false,
    commentBy: "652ccb7a3010089c9753b1c1",
    replies: [],
    likedBy: [],
    lastEdited: "2023-10-19T12:24:14.178000",
    creationDate: "2023-10-19T12:24:14.178000",
    reported: false,
    reportData: [],
    commenterName: "Jastagar",
    commenterImage: "https://source.unsplash.com/random",
    commenterImageCropped:
      "https://imgs.search.brave.com/fL2ympGnFQZv3t2lxmFLfoF1Dorf89wgmz8lIwobE6M/rs:fit:500:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAyLzE3LzM0LzY3/LzM2MF9GXzIxNzM0/Njc4Ml83WHBDVHQ4/YkxOSnF2VkFhRFpK/d3Zaam0wZXBRbWo2/ai5qcGc",
  },
  {
    _id: "6531204275674134dc927aba",
    comment: "this is comment no 2",
    commentImage: null,
    pin: false,
    commentBy: "652ccb7a3010089c9753b1c1",
    replies: [],
    likedBy: [],
    lastEdited: "2023-10-19T12:25:38.939000",
    creationDate: "2023-10-19T12:25:38.939000",
    reported: false,
    reportData: [],
    commenterName: "Jastagar",
    commenterImage: "https://source.unsplash.com/random",
    commenterImageCropped:
      "https://imgs.search.brave.com/fL2ympGnFQZv3t2lxmFLfoF1Dorf89wgmz8lIwobE6M/rs:fit:500:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAyLzE3LzM0LzY3/LzM2MF9GXzIxNzM0/Njc4Ml83WHBDVHQ4/YkxOSnF2VkFhRFpK/d3Zaam0wZXBRbWo2/ai5qcGc",
  },
  {
    _id: "65312a30ccaa9b8bdca1d5e0",
    comment: "comment is 1",
    commentImage: null,
    pin: false,
    commentBy: "652ccb7a3010089c9753b1c1",
    replies: [],
    likedBy: [],
    lastEdited: "2023-10-19T13:08:00.763000",
    creationDate: "2023-10-19T13:08:00.763000",
    reported: false,
    reportData: [],
    commenterName: "Jastagar",
    commenterImage: "https://source.unsplash.com/random",
    commenterImageCropped:
      "https://imgs.search.brave.com/fL2ympGnFQZv3t2lxmFLfoF1Dorf89wgmz8lIwobE6M/rs:fit:500:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAyLzE3LzM0LzY3/LzM2MF9GXzIxNzM0/Njc4Ml83WHBDVHQ4/YkxOSnF2VkFhRFpK/d3Zaam0wZXBRbWo2/ai5qcGc",
  },
  {
    _id: "65312bc506d4f38042806d1a",
    comment: "helllooo",
    commentImage: null,
    pin: false,
    commentBy: "652ccb7a3010089c9753b1c1",
    replies: [],
    likedBy: [],
    lastEdited: "2023-10-19T13:14:45.267000",
    creationDate: "2023-10-19T13:14:45.267000",
    reported: false,
    reportData: [],
    commenterName: "Jastagar",
    commenterImage: "https://source.unsplash.com/random",
    commenterImageCropped:
      "https://imgs.search.brave.com/fL2ympGnFQZv3t2lxmFLfoF1Dorf89wgmz8lIwobE6M/rs:fit:500:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAyLzE3LzM0LzY3/LzM2MF9GXzIxNzM0/Njc4Ml83WHBDVHQ4/YkxOSnF2VkFhRFpK/d3Zaam0wZXBRbWo2/ai5qcGc",
  },
];

async function getComments(payload,pageSize , pageNumber) {
  const res = await axios.post(
    process.env.NEXT_PUBLIC_COMMENT_REVIEWS_SERVICE +
      `/api/v1/comments?page=${pageNumber}&pageSize=${pageSize}`,
    payload,
    { withCredentials: true }
  );
  return res.data;
}
async function getReplies(payload,repliesPageSize , repliesPage) {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_COMMENT_REVIEWS_SERVICE}/api/v1/replies?page=${repliesPage}&pageSize=${repliesPageSize}`,
    payload,
    { withCredentials: true }
  );
  return res.data;
}

// This is the Entire Component
const Comments = (props) => {
  const [comments, setComments] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  const [loading, setLoading] = useState(false);

  const payload = { commentIds: props.comments }; // comment IDS

  const pageSize = props.pageSize || process.env.NEXT_PUBLIC_COMMENTS_PAGE_SIZE || 5;

  const COMMENTS_FOR_SERVICE = props.service || undefined;
  const COMMENT_FOR_ID = props.serviceInstanceId || undefined;

  useEffect(() => {
    // if (comments.length > 0) return;
    // if (!props?.user.username) return;
    setLoading(true);
    getComments(payload,pageSize,pageNumber)
      .then((e) => {
        setComments(e);
        console.log("Comments", e);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  }, []);

  function showMoreComments(e) {
    setLoadingMore(true);
    getComments(payload, pageSize, pageNumber + 1)
      .then((e) => {
        setComments((prev) => [...prev, ...e]);
        setLoadingMore(false);
        setPageNumber(pageNumber + 1);
      })
      .catch((e) => {
        setLoadingMore(false);
        console.error(e);
      });
  }

  return !loading ? (
    <div className={`mx-auto w-full pb-8 ${props?.classNames?.container}`}>
      <div className={`${props?.classNames?.input}`}>
        <CommentInput
          addNewlyPosted={async (e) => {
            // setLoading(true)
            const res = await getComments(
              { commentIds: [e.commentId, ...props.comments] },
              pageSize,
              pageNumber
            );
            setComments(res);
            console.log("Comments", res);
            setLoading(false);
          }}
          isFocusedOnRender={false}
          commentsFor={COMMENTS_FOR_SERVICE} // kis service k liye comments use ho rahe hain
          commentsForId={COMMENT_FOR_ID} // kis id wale model/portfolio/campaign k liye comment ho raha hai
          setIsCommenting={() => {}}
        />
      </div>
      <div className={`flex flex-col gap-6 mt-5 ${props?.classNames?.commentsContainer}`}>
        {comments.map((comment, commentIndex) => (
          <Comment
            pageSize={props.repliesPageSize}
            key={"commentKeyForSOMEPUROGJSLUHGSLDJFHILEU"+comment._id}
            comment={comment}
          />
        ))}
      </div>

      {comments.length > 0 &&
        comments.length < props.comments.length &&
        (loadingMore ? (
          <i>Loading More.....</i>
        ) : (
          <div
            onClick={showMoreComments}
            className="flex gap-[6px] button-sm text-primary-purple-500 w-auto my-8 hover:cursor-pointer"
          >
            <div>Show all comments</div>
            <div className="h-5 w-5">
              <ChevronDown />
            </div>
          </div>
        ))}
    </div>
  ) : (
    <>Loading Comments.....</>
  );
};

// From here is each comment element

//This one is the wrapper of a comment input mainly handling the Replies things
const Comment = ({ comment, repliesPageSize }) => {
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState([]);
  const [loadingMoreReplies, setLoadingMoreReplies] = useState(false);
  const [repliesPage, setRepliesPage] = useState(1);
  const [isCommenting, setIsCommenting] = useState(false);

  const repliesPageSizeForCall = repliesPageSize || process.env.NEXT_PUBLIC_COMMENT_REPLIES_PAGE_SIZE || 5;

  const hasMoreReplies = replies?.length < comment.replies.length; 

  function showMoreReplies() {
    setLoadingMoreReplies(true);
    getReplies({ replyIds: comment.replies }, repliesPageSizeForCall,repliesPage + 1)
      .then((e) => {
        setReplies((prev) => [...prev, ...e]);
        setLoadingMoreReplies(false);
        setRepliesPage(repliesPage + 1);
      })
      .catch((e) => {
        setLoadingMoreReplies(false);
        console.error(e);
      });
  }

  async function replyUpdateAfterPosting(e){
    const repliesPayload = { replyIds: [e.replyId, ...comment.replies] };
    setLoadingMoreReplies(true);
    const res = await getReplies(repliesPayload, repliesPageSizeForCall , repliesPage);
    console.log("Replies", res);
    comment.replies=[e.replyId, ...comment.replies]
    setReplies(res);
    setLoadingMoreReplies(false);
    return res;
  }

  useEffect(() => {
    if (
      replies?.length > 0 ||
      !comment.replies.length ||
      comment.replies.length === 0
    ) {
      return;
    }
    // if(!props?.user.username) return
    const repliesPayload = { replyIds: comment.replies };
    setLoadingMoreReplies(true);
    getReplies(repliesPayload, repliesPageSizeForCall, repliesPage)
      .then((e) => {
        console.log("Replies", e);
        setReplies(e);
        setLoadingMoreReplies(false);
      })
      .catch((e) => {
        console.error(e);
        setLoadingMoreReplies(false);
      });
  }, []);

  return (
    <>
      <CommentLayout
        addNewlyPosted={replyUpdateAfterPosting}
        comment={comment}
        uniqueCommentId={comment._id}
      >
        {isCommenting && (
          <CommentInput
            addNewlyPosted={replyUpdateAfterPosting}
            uniqueCommentId={comment._id}
            mention={comment.commenterName || comment.replierName}
            mentionId={comment.commentBy || comment.replyBy}
            isReply={true}
            setIsCommenting={setIsCommenting}
            isFocusedOnRender={true}
          />
        )}

        <div className=" ml-14">
          <div
            className="flex items-center gap-1 text-primary-brand cursor-pointer font-medium text-[14px] mt-2"
            onClick={() => {
              setShowReplies(!showReplies);
            }}
          >
            {replies?.length >= 1 && (
              <div className="flex text-primary-purple-500 gap-1">
                {comment?.replie?.length === 1
                  ? `${comment?.replies?.length} Reply`
                  : `${comment?.replies?.length} Replies`}
                <div
                  className={`h-5 w-5 transition-all ${
                    showReplies && " rotate-180"
                  }`}
                >
                  <ChevronDown />
                </div>
              </div>
            )}
          </div>

          {/* REPLIES THINGS */}

          {showReplies && replies && replies?.length > 0 && (
            <div className="flex flex-col gap-2 py-4 pl-[6px]">
              {replies.map((reply, replyIndex) => (
                <div key={"EachReply"+reply._id}>
                  <CommentLayout
                    comment={reply}
                    addNewlyPosted={replyUpdateAfterPosting}
                    // mention={reply.replierName}
                    // mentionId={reply.replierId}
                    uniqueCommentId={`${comment._id}`}
                  />
                </div>
              ))}
              {hasMoreReplies &&
                (loadingMoreReplies ? (
                  <i>Loading more replies...</i>
                ) : (
                  <div
                    onClick={showMoreReplies}
                    className="flex gap-[6px] button-sm text-primary-purple-500 w-auto my-2 hover:cursor-pointer"
                  >
                    <div>Show more replies</div>
                    <div className="h-5 w-5">
                      <ChevronDown />
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </CommentLayout>
    </>
  );
};

// This one is the component that shows the data of Each comment
const CommentLayout = ({
  comment,
  uniqueCommentId,
  children,
  addNewlyPosted,
}) => {
  const currentUser = useSelector((state) => state.user);

  const [isCommenting, setIsCommenting] = useState(false);
  const [reportModal, setReportModal] = useState(false);
  const [liked, setLiked] = useState(comment.likedBy.indexOf(currentUser._id) !== -1);
  const [liking, setLiking] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [likedNumber, setLikedNumber] = useState(comment.likedBy?.length || 0);
  const [shareModal, setShareModal] = useState(false);
  const [moreOptions, setMoreoptions] = useState(false);
  const [mention,setMention] = useState(null)


  function handleDropDownReportAndShare() {
    setMoreoptions(!moreOptions);
  }

  function getRepliedToUserData(){
    if(!comment.replyTo) return
    axios.get(process.env.NEXT_PUBLIC_USER_SERVICE_URL + `/api/v1/user?userid=${comment.replyTo}`,{
      withCredentials:true
    }).then(e=>{
      console.log("setting mention")
      setMention(e.data)
    })
  }
  useEffect(()=>{
    getRepliedToUserData()
  },[])

  async function handleLike() {
    setLiking(true);
    axios
      .post(
        process.env.NEXT_PUBLIC_COMMENT_REVIEWS_SERVICE +
          `/api/v1/comment/${uniqueCommentId}/like?likeState=${
            liked ? "-1" : "1"
          }`,
        {},
        {
          withCredentials: true,
        }
      )
      .then((e) => {
        console.log("comment like->", comment);
        setLiked(!liked);
        setLiking(false);
        if (e.data.message.indexOf("-1") !== -1) {
          setLikedNumber((prev) => prev - 1);
        } else {
          setLikedNumber((prev) => prev + 1);
        }
      })
      .catch((e) => {
        console.log(e);
        setLiking(false);
      });
  }

  return (
    <>
      {/* Report Modal */}
      <ReactModal
        classNames={{
          modalContainer: "flex justify-center items-center",
        }}
        showCloseIcon={false}
        open={reportModal}
        onClose={() => setReportModal(false)}
      >
        <ModelReportModal
          contentId={uniqueCommentId}
          reportFor={"comment"}
          closeModal={() => setReportModal(false)}
        />
      </ReactModal>

      {/* Share Modal */}
      <ReactModal
        classNames={{
          modalContainer: "flex justify-center items-center",
        }}
        showCloseIcon={false}
        open={shareModal}
        onClose={() => setShareModal(false)}
      >
        <ShareModal
          commentId={uniqueCommentId}
          closeModal={() => setShareModal(false)}
        />
      </ReactModal>

      <div
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => {
          setMoreoptions(false);
          setHovering(false);
        }}
        className="flex flex-col gap-2 w-full"
      >
        <div className="flex flex-col">
          {/* comment meta and content */}
          <div className="flex justify-between">
            <div className="flex gap-3 items-center grow">
              <Image
                className="h-10 w-10 rounded-full"
                width={40}
                height={40}
                alt="CommentByProfilePic"
                src={
                  comment?.commenterImageCropped ||
                  comment?.commenterImage ||
                  comment.replierImage ||
                  comment.replierCroppedImage ||
                  "/images/profile.jpg"
                }
              />
              <div className="flex gap-1 items-center">
                <div className="font-medium">
                  {comment?.commenterName || comment.replierName}
                </div>
                <div className="h-[5px] w-[5px]">
                  <DotSvg />
                </div>
                <div className="text-secondary-text-paragraph-text text-[14px]">
                  <TimeAgo timestamp={comment.creationDate} />
                </div>
              </div>
            </div>
            {hovering && (
              <div className="relative  mr-[10px]">
                <div
                  onClick={handleDropDownReportAndShare}
                  className="h-6 w-6 rotate-90 hover:cursor-pointer"
                >
                  <ThreeDotsVertical />
                </div>
                {/* OnClick DropDown */}
                {hovering && moreOptions && (
                  <div className="absolute text-start py-1 rounded-[5px] top-[100%] right-0 border border-light-neutral-600 shadow-lg">
                    <div
                      onClick={() => setReportModal(true)}
                      className="button-md-1 whitespace-nowrap hover:cursor-pointer"
                    >
                      Report this comment
                    </div>

                    <div
                      onClick={() => setShareModal(true)}
                      className="button-md-1 whitespace-nowrap hover:cursor-pointer"
                    >
                      Share this comment
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          {/* Main comment */}

          <div className="flex flex-col gap-2 ml-14 text-dark-neutral-200 text-base font-normal tracking-[-0.15px]">
            
            
            {<a href=""></a>} {comment?.comment || comment.replyComment || ""}
            
            
            {/* Reply and like */}
            <div className="flex items-center gap-3">
              {!liking ? (
                <div className="flex gap-1" onClick={handleLike}>
                  <div className="h-5 w-5 cursor-pointer">
                    {liked ? <HeartFilled color="red" /> : <Heart />}
                  </div>
                  {likedNumber > "0" ? `${likedNumber} likes` : "likes"}
                </div>
              ) : (
                <div className="flex gap-1 opacity-60">
                  <div className="h-5 w-5">
                    {liked ? <HeartFilled color="red" /> : <Heart />}
                  </div>
                  {likedNumber > "0" ? `${likedNumber} likes` : "likes"}
                </div>
              )}

              <div
                className="flex items-center justify-center gap-1 text-[14px] cursor-pointer"
                onClick={() => {
                  setIsCommenting(!isCommenting);
                }}
              >
                <div className="h-5 w-5">
                  <ReplyIcon />
                </div>
                {!isCommenting ? "Reply" : "Close"}
              </div>
            </div>
            {isCommenting && (
              <CommentInput
                addNewlyPosted={addNewlyPosted}
                isReply={true}
                uniqueCommentId={uniqueCommentId}
                mention={comment.commenterName || comment.replierName || ""}
                mentionId={comment.commentBy || comment.replyBy || ""}
                isFocusedOnRender={true}
                setIsCommenting={setIsCommenting}
              />
            )}
          </div>
          {children}
        </div>
      </div>
    </>
  );
};

export default Comments;
