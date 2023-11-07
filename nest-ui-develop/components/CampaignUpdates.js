// TODO only backers can comment
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { BiSend } from "react-icons/bi";
import Commento from "./Commento";

const CampaignUpdates = (props) => {
  const [updates, setUpdates] = useState([]);
  const [title, setTitle] = useState();
  const [newUpdate, setNewUpdate] = useState();
  const [shownComments, setShownComments] = useState({});
  const user = useSelector((state) => state.user);
  // TODO delete this data after writing axios call
  const updatesData = [
    {
      title: "Title 1",
      date: new Date(),
      update:
        "update update update update update update update update update update update update update update update update update update update update",
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
      title: "Title 2",
      date: new Date(),
      update:
        "update update update update update update update update update update update update update update update update update update update update",
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
      title: "Title 3",
      date: new Date(),
      update:
        "update update update update update update update update update update update update update update update update update update update update",
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
      title: "Title 4",
      date: new Date(),
      update:
        "update update update update update update update update update update update update update update update update update update update update",
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
      title: "Title 5",
      date: new Date(),
      update:
        "update update update update update update update update update update update update update update update update update update update update",
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
      title: "Title 6",
      date: new Date(),
      update:
        "update update update update update update update update update update update update update update update update update update update update",
    },
  ];

  // TODO add axios call
  const handlePostUpdate = () => {
    setUpdates([{ title, date: new Date(), update: newUpdate }, ...updates]);
    setTitle("");
    setNewUpdate("");
  };

  // TODO add axios call
  const handleComment = (index) => {
    const value = document.getElementById(`comment-input-${index}`).value;
    let update = updates[index];
    if (update?.comments && update.comments.length > 0)
      update = {
        ...update,
        comments: [
          { username: user.username, date: new Date(), comment: value },
          ...update.comments,
        ],
      };
    else
      update = {
        ...update,
        comments: [
          { username: user.username, date: new Date(), comment: value },
        ],
      };
    setUpdates([
      ...updates.slice(0, index),
      update,
      ...updates.slice(index + 1),
    ]);
    document.getElementById(`comment-input-${index}`).value = "";
  };

  useEffect(() => {
    setUpdates(updatesData);
  }, []);

  return (
    <div className="bg-white w-full rounded-sm px-14 py-5">
      <Commento
        id="about-the-campaign-updates"
        url="/about-the-campaign/1/updates"
      />
      {/* {console.log("values", user.username, props.campaignCreator)}
      {user.username === props.campaignCreator ? (
        <div className="w-max m-auto flex flex-col p-4 font-medium rounded-sm mb-10 border-[1px] shadow-md">
          <span className="text-[18px]">Enter your update</span>
          <input
            type="text"
            placeholder="Title"
            className="w-full bg-white border-[1px] border-accent1 p-2 rounded-sm text-[15px] text-secondary-text-icons-button-text min-w-[600px] focus:outline-none my-2"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <textarea
            type="text"
            placeholder="Update"
            className="w-full bg-white border-[1px] border-accent1 p-2 rounded-sm text-[15px] text-secondary-text-icons-button-text min-w-[600px] min-h-[100px] focus:outline-none my-2"
            value={newUpdate}
            onChange={(event) => setNewUpdate(event.target.value)}
          />
          <div
            className="bg-primary-brand text-white px-5 h-10 flex items-center justify-center rounded-sm cursor-pointer my-2"
            onClick={handlePostUpdate}
          >
            POST
          </div>
        </div>
      ) : (
        <></>
      )}
      {updates.map((update, updateIndex) => {
        return (
          <div
            key={`${updateIndex}-${update.title}-${update.date}`}
            className="flex justify-center gap-2"
          >
            <div className="relative flex flex-col m-5 rounded-sm w-[55%] border-[1px] shadow-lg">
              <div className="bg-secondary rounded-t-sm flex flex-col gap-2 px-5 py-5">
                <div className="flex items-end gap-3">
                  <span className="font-semibold text-primary-brand text-[20px]">
                    {update.title}
                  </span>
                  <span className="text-[14px] mb-[3px]">
                    {update.date.toDateString()}
                  </span>
                </div>
                <span className="font-medium">{update.update}</span>
              </div>
              <div className="bg-white rounded-b-sm px-14 py-5">
                <ul className="relative flex flex-col gap-2 list-disc pb-3">
                  {update?.comments && shownComments?.updateIndex
                     &&
                    update.comments
                      .slice(0, shownComments[updateIndex])
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
                      update?.comments
                       && 
                      (!shownComments?.updateIndex ||
                        shownComments[updateIndex] < update.comments.length)
                        ? "block"
                        : "hidden"
                    } absolute bottom-0 right-0 font-medium text-[12px] text-primary-brand cursor-pointer`}
                    onClick={() =>
                      setShownComments((current) => {
                        return {
                          ...current,
                          [updateIndex]: shownComments[updateIndex]
                            ? shownComments[updateIndex] + 5
                            : 5,
                        };
                      })
                    }
                  >
                    {update?.comments &&
                    !shownComments?.updateIndex
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
                      id={`comment-input-${updateIndex}`}
                    />
                    <BiSend
                      className="text-[20px] text-secondary-text-icons-button-text"
                      onClick={() => handleComment(updateIndex)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })} */}
    </div>
  );
};

export default CampaignUpdates;
