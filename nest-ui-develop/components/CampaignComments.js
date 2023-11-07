import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { BiSend } from "react-icons/bi";
import Commento from "./Commento";

const CampaignComments = (props) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState();
  const [shownComments, setShownComments] = useState({});
  const user = useSelector((state) => state.user);
  // TODO delete this data after writing axios call
  const commentsData = [
    {
      id: 1,
      date: new Date(),
      by: "user1",
      userComment:
        "usercomment usercomment usercomment usercomment usercomment usercomment usercomment usercomment usercomment usercomment usercomment usercomment usercomment usercomment usercomment usercomment",
      comments: [
        {
          username: "user1",
          date: new Date(),
          comment:
            "comment comment comment comment comment comment comment comment comment comment comment comment comment comment comment",
        },
        {
          username: "user2",
          date: new Date(),
          comment:
            "comment comment comment comment comment comment comment comment comment comment comment comment comment comment comment",
        },
        {
          username: "user3",
          date: new Date(),
          comment:
            "comment comment comment comment comment comment comment comment comment comment comment comment comment comment comment",
        },
        {
          username: "user4",
          date: new Date(),
          comment:
            "comment comment comment comment comment comment comment comment comment comment comment comment comment comment comment",
        },
        {
          username: "user5",
          date: new Date(),
          comment:
            "comment comment comment comment comment comment comment comment comment comment comment comment comment comment comment",
        },
        {
          username: "user6",
          date: new Date(),
          comment:
            "comment comment comment comment comment comment comment comment comment comment comment comment comment comment comment",
        },
        {
          username: "user7",
          date: new Date(),
          comment:
            "comment comment comment comment comment comment comment comment comment comment comment comment comment comment comment",
        },
        {
          username: "user8",
          date: new Date(),
          comment:
            "comment comment comment comment comment comment comment comment comment comment comment comment comment comment comment",
        },
        {
          username: "user9",
          date: new Date(),
          comment:
            "comment comment comment comment comment comment comment comment comment comment comment comment comment comment comment",
        },
        {
          username: "user10",
          date: new Date(),
          comment:
            "comment comment comment comment comment comment comment comment comment comment comment comment comment comment comment",
        },
      ],
    },
    {
      id: 2,
      date: new Date(),
      by: "user2",
      userComment:
        "usercomment usercomment usercomment usercomment usercomment usercomment usercomment usercomment usercomment usercomment usercomment usercomment usercomment usercomment usercomment usercomment",
      comments: [
        {
          username: "user1",
          date: new Date(),
          comment:
            "comment comment comment comment comment comment comment comment comment comment comment comment comment comment comment",
        },
        {
          username: "user2",
          date: new Date(),
          comment:
            "comment comment comment comment comment comment comment comment comment comment comment comment comment comment comment",
        },
        {
          username: "user3",
          date: new Date(),
          comment:
            "comment comment comment comment comment comment comment comment comment comment comment comment comment comment comment",
        },
        {
          username: "user4",
          date: new Date(),
          comment:
            "comment comment comment comment comment comment comment comment comment comment comment comment comment comment comment",
        },
        {
          username: "user5",
          date: new Date(),
          comment:
            "comment comment comment comment comment comment comment comment comment comment comment comment comment comment comment",
        },
      ],
    },
    {
      id: 3,
      date: new Date(),
      by: "user3",
      userComment:
        "usercomment usercomment usercomment usercomment usercomment usercomment usercomment usercomment usercomment usercomment usercomment usercomment usercomment usercomment usercomment usercomment",
      comments: [
        {
          username: "user1",
          date: new Date(),
          comment:
            "comment comment comment comment comment comment comment comment comment comment comment comment comment comment comment",
        },
        {
          username: "user2",
          date: new Date(),
          comment:
            "comment comment comment comment comment comment comment comment comment comment comment comment comment comment comment",
        },
        {
          username: "user3",
          date: new Date(),
          comment:
            "comment comment comment comment comment comment comment comment comment comment comment comment comment comment comment",
        },
        {
          username: "user4",
          date: new Date(),
          comment:
            "comment comment comment comment comment comment comment comment comment comment comment comment comment comment comment",
        },
        {
          username: "user5",
          date: new Date(),
          comment:
            "comment comment comment comment comment comment comment comment comment comment comment comment comment comment comment",
        },
        {
          username: "user6",
          date: new Date(),
          comment:
            "comment comment comment comment comment comment comment comment comment comment comment comment comment comment comment",
        },
      ],
    },
    {
      id: 4,
      date: new Date(),
      by: "user4",
      userComment:
        "usercomment usercomment usercomment usercomment usercomment usercomment usercomment usercomment usercomment usercomment usercomment usercomment usercomment usercomment usercomment usercomment",
      comments: [
        {
          username: "user1",
          date: new Date(),
          comment:
            "comment comment comment comment comment comment comment comment comment comment comment comment comment comment comment",
        },
        {
          username: "user2",
          date: new Date(),
          comment:
            "comment comment comment comment comment comment comment comment comment comment comment comment comment comment comment",
        },
        {
          username: "user3",
          date: new Date(),
          comment:
            "comment comment comment comment comment comment comment comment comment comment comment comment comment comment comment",
        },
        {
          username: "user4",
          date: new Date(),
          comment:
            "comment comment comment comment comment comment comment comment comment comment comment comment comment comment comment",
        },
        {
          username: "user5",
          date: new Date(),
          comment:
            "comment comment comment comment comment comment comment comment comment comment comment comment comment comment comment",
        },
      ],
    },
    {
      id: 5,
      date: new Date(),
      by: "user5",
      userComment:
        "usercomment usercomment usercomment usercomment usercomment usercomment usercomment usercomment usercomment usercomment usercomment usercomment usercomment usercomment usercomment usercomment",
      comments: [
        {
          username: "user1",
          date: new Date(),
          comment:
            "comment comment comment comment comment comment comment comment comment comment comment comment comment comment comment",
        },
      ],
    },
    {
      id: 6,
      date: new Date(),
      by: "user6",
      userComment:
        "usercomment usercomment usercomment usercomment usercomment usercomment usercomment usercomment usercomment usercomment usercomment usercomment usercomment usercomment usercomment usercomment",
    },
  ];

  // TODO add axios call
  const handlePostComment = () => {
    setComments([
      {
        id: comments.length + 1,
        date: new Date(),
        by: user.username,
        userComment: newComment,
      },
      ...comments,
    ]);
    setNewComment("");
  };

  // TODO add axios call
  const handleComment = (index, id) => {
    const value = document.getElementById(`comment-input-${id}`).value;
    let comment = comments[index];
    if (comment?.comments && comment.comments.length > 0)
      comment = {
        ...comment,
        comments: [
          { username: user.username, date: new Date(), comment: value },
          ...comment.comments,
        ],
      };
    else
      comment = {
        ...comment,
        comments: [
          { username: user.username, date: new Date(), comment: value },
        ],
      };
    setComments([
      ...comments.slice(0, index),
      comment,
      ...comments.slice(index + 1),
    ]);
    document.getElementById(`comment-input-${id}`).value = "";
  };

  useEffect(() => {
    setComments(commentsData);
  }, []);

  return (
    <div className="bg-white w-full rounded-sm px-14 py-5">
      <Commento
        id={"about-the-campaign-comments"}
        url="/about-the-campaign/1/comments"
      />
      <div className="w-max m-auto flex flex-col p-4 font-medium rounded-sm mb-10 border-[1px] shadow-md">
        <span className="text-[18px]">Enter your comment</span>
        <textarea
          type="text"
          placeholder="Comment"
          className="w-full bg-white border-[1px] border-accent1 p-2 rounded-sm text-[15px] text-secondary-text-icons-button-text min-w-[600px] min-h-[100px] focus:outline-none my-2"
          value={newComment}
          onChange={(event) => setNewComment(event.target.value)}
        />
        <div
          className="bg-primary-brand text-white px-5 h-10 flex items-center justify-center rounded-sm cursor-pointer my-2"
          onClick={handlePostComment}
        >
          POST
        </div>
      </div>
      {comments.map((comment, mainCommentIndex) => {
        return (
          <div key={comment.id} className="flex justify-center gap-2">
            <div className="relative flex flex-col m-5 rounded-sm w-[55%] border-[1px] shadow-lg">
              <div className="bg-secondary rounded-t-sm flex flex-col gap-2 px-5 py-5">
                <div className="flex items-end gap-3">
                  <span className="font-semibold text-primary-brand text-[20px]">
                    {comment.by}
                  </span>
                  <span className="text-[14px] mb-[3px]">
                    {comment.date.toDateString()}
                  </span>
                </div>
                <span className="font-medium">{comment.userComment}</span>
              </div>
              <div className="bg-white rounded-b-sm px-14 py-5">
                <ul className="relative flex flex-col gap-2 list-disc pb-3">
                  {comment?.comments &&
                    shownComments?.[comment.id] &&
                    comment.comments
                      .slice(0, shownComments[comment.id])
                      .map((comment, indexComment) => {
                        return (
                          <li key={`comment-${indexComment}`}>
                            <div className="flex items-end gap-2 text-secondary-text-icons-button-text">
                              <span className="font-medium text-primary-brand">
                                {comment.username}
                              </span>
                              <span className="text-[12px] mb-[1px]">
                                {comment.date.toDateString()}
                              </span>
                            </div>
                            <div className="font-medium text-[14px]">
                              {comment.comment}
                            </div>
                          </li>
                        );
                      })}
                  <div
                    className={`${
                      comment?.comments &&
                      (!shownComments?.[comment.id] ||
                        shownComments[comment.id] < comment.comments.length)
                        ? "block"
                        : "hidden"
                    } absolute bottom-0 right-0 font-medium text-[12px] text-primary-brand cursor-pointer`}
                    onClick={() =>
                      setShownComments((current) => {
                        return {
                          ...current,
                          [comment.id]: shownComments[comment.id]
                            ? shownComments[comment.id] + 5
                            : 5,
                        };
                      })
                    }
                  >
                    {comment?.comments && !shownComments?.[comment.id]
                      ? "Show comments ..."
                      : "Show more comments ..."}
                  </div>
                </ul>
                <div className="px-5 py-4">
                  <div className="bg-white m-auto w-[75%] px-2 flex items-center border-[1px] rounded-[30px] shadow-md">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      className="px-3 py-2 text-[16px] flex-auto border-0 focus:outline-none bg-transparent"
                      id={`comment-input-${comment.id}`}
                    />
                    <BiSend
                      className="text-[20px] text-secondary-text-icons-button-text"
                      onClick={() =>
                        handleComment(mainCommentIndex, comment.id)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CampaignComments;
