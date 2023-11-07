import React, { useState, useEffect, useRef } from "react";
import Picture from "../../icons/PictureIcon";
import {
  EmojiStyle,
  Emoji,
  // SkinTones,
  // Theme,
  // Categories,
  // EmojiClickData,
  // SuggestionMode,
  // SkinTonePickerLocation,
} from "emoji-picker-react";
import EmojiIcon from "../../icons/EmojiIcon";
import InstaReels from "../../icons/InstaReels";
import ReactDOMServer from "react-dom/server";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useSelector } from "react-redux";
import axios from "axios";
import Avatar from "../Avatar";
const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

const initialInputContent = `<span id="THISISSEEMINGLYIMPOSSIBLEIDFORANYONETOGIVE" className="border border-red-500 text-light-neutral-100">Write Your Message here...</span>`;
const initialMentionContent = (mention) => `
  <span><a href="/user/${mention}/about" contentEditable="false" className="text-primary-500">
    @${mention}
  </a></span>`;


async function postReply(commentId,data){
  const res = await axios.post(process.env.NEXT_PUBLIC_COMMENT_REVIEWS_SERVICE+`/api/v1/comment/${commentId}/reply`,data,{
    withCredentials:true
  })
  return res.data
}
async function postComment(data){
  const res = await axios.post(process.env.NEXT_PUBLIC_COMMENT_REVIEWS_SERVICE+`/api/v1/comment/`,data,{
    withCredentials:true
  })
  return res.data
}





const CommentInput = ({
  mention,
  isFocusedOnRender,
  setIsCommenting,
  isReply,
  mentionId,
  commentsFor,
  commentsForId,
  addNewlyPosted,
  uniqueCommentId
}) => {
  const user = useSelector((state) => state.user);
  const inputRef = useRef();
  const imageDivRef = useRef();
  const emojiDivRef = useRef();
  const emojiIconDivRef = useRef();
  const [commentHtmlContent, setCommentHtmlContent] = useState(isReply ? initialMentionContent(mention) : initialInputContent);
  const [posting, setPosting] = useState(false);
  const [isFocused, setIsFocused] = useState(isFocusedOnRender);
  const [imageUrl, setImageUrl] = useState(null);
  const [showEmojiMenu, setShowEmojiMenu] = useState(false);
  // inputRef?.current?.blur()
  // console.log("UCI",uniqueCommentId)
  // console.log(comment)

  const handleEmojiClick = (currentEmoji) => {
    const inputElement = inputRef.current;
    if (inputElement) {
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);
      console.log("selection", selection, "range", range);
      if (
        range.commonAncestorContainer === inputElement ||
        range.commonAncestorContainer.parentNode === inputElement
      ) {
        const imgTag = ReactDOMServer.renderToString(
          <img
            src={currentEmoji.getImageUrl("google")}
            alt={currentEmoji?.names ? currentEmoji.names[0] : "Emoji"}
            style={{ display: "inline-block", height: "22px", width: "22px" }}
          />
        );
        range.deleteContents();
        const fragment = range.createContextualFragment(imgTag);
        const imgNode = fragment.querySelector("img");
        range.insertNode(fragment);
        range.setStartAfter(imgNode);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
        inputElement.focus();
      }
    }
  };

  const handleImageInput = (event) => {
    if (!imageUrl) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const deleteImage = () => {
    setImageUrl(null);
  };

  const moveCursorToEnd = () => {
    const inputElement = inputRef.current;
    if (inputElement) {
      const range = document.createRange();
      range.selectNodeContents(inputElement);
      range.collapse(false);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  function postCommentFunction(event) {
    setPosting(true);
    if(isReply){
      const replyObject = new FormData()

      const [haveMention,...restContent] = commentHtmlContent.split(" ")
      let newRestContent = restContent.join(" ")
      console.log("Mention-->",haveMention)
      if(haveMention.startsWith("@")){
        // console.log("YAAAAY we have a mention",mentionId)
        replyObject.append("mention",mentionId)
      }else{
        // console.log("We dont have a mention")
        newRestContent += " "+haveMention
      }
      replyObject.append("reply",newRestContent)
      
      imageUrl && replyObject.append("file",imageUrl)

      postReply(uniqueCommentId,replyObject).then(e=>{
        addNewlyPosted(e).then(()=>{
          setPosting(false)
          setIsFocused(false)
          setIsCommenting(false)
          setCommentHtmlContent("")
        })
        console.log("addNewlyPosted",e)
      }).catch(err => {console.log(err);setPosting(false)})

    }else{
      console.log("POSTING A COMMENT")
      const postCommentData = new FormData()

      postCommentData.append("commentFor",commentsFor)
      postCommentData.append("Id",commentsForId)
      postCommentData.append("comment",commentHtmlContent)
      
      postComment(postCommentData).then((e) => {
        addNewlyPosted(e).then(()=>{
          setPosting(false);
          setIsFocused(false);
          setIsCommenting(false)
          setCommentHtmlContent("")
        })
        console.log("addNewlyPosted",e)
      }).catch(err => {console.error(err);setPosting(false)});
    }
  }

  function cancelComment() {
    setIsCommenting(false);
    setIsFocused(false);
    return;
  }

  // console.log("IsReply", isReply);

  useEffect(() => {
    if (inputRef.current && isFocusedOnRender) {
      const { current } = inputRef;
      current.focus();
      moveCursorToEnd();
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target) &&
        emojiIconDivRef.current &&
        !emojiIconDivRef.current.contains(event.target) &&
        emojiDivRef.current &&
        !emojiDivRef.current.contains(event.target)
      ) {
        setShowEmojiMenu(false);
      }
    };
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3  rounded-[5px] items-end w-full border py-[15px] ps-4 pe-6 shadow-xs bg-light-neutral-50 border-light-neutral-700">
        <div className="h-10 w-10">
          <Avatar
            src={
              user?.displayInformation?.profilePicture?.croppedPictureUrl ||
              user?.displayInformation?.profilePicture?.pictureUrl ||
              null
            }
            size="sm"
            alt="user Image"
          />
        </div>

        <div
          contentEditable="true"
          
          onFocus={() => {
            if (isReply) {
              // console.log("1112", commentHtmlContent);
              setIsFocused(true);
              setCommentHtmlContent(initialMentionContent(mention));
            }
            if (commentHtmlContent === initialInputContent) {
              setIsFocused(true);
              setCommentHtmlContent("");
              console.log("foc Yes i am here");
            }
          }}


          onBlur={(e) => {
            const content = e.target.innerText;
            if (content.trim().length === 0) {
              setCommentHtmlContent(initialInputContent);
              console.log("foc Blurred", content);
              return;
            }
            setCommentHtmlContent(content);
          }}
          ref={inputRef}
          className="rounded-sm focus:outline-none flex-1 text-base p-1"
          dangerouslySetInnerHTML={{ __html: commentHtmlContent }}
        >
        </div>

        {imageUrl && imageUrl !== "" && (
          <div ref={imageDivRef} className="flex gap-2 p-2">
            <div className="relative w-fit">
              <img src={imageUrl} className="w-40" />
            </div>
          </div>
        )}

        {/* Helper Buttons */}
        <div className="flex gap-3 justify-between relative px-2">
          {showEmojiMenu && isFocused && (
            <div
              className="absolute bottom-full right-0"
              onClick={(e) => {
                // console.log("e", e);
                if (
                  e.target.nodeName !== "BUTTON" &&
                  e.target.nodeName !== "IMG" &&
                  e.target.className !== "__EmojiPicker__ epr-emoji-img"
                ) {
                  inputRef.current.focus();
                  moveCursorToEnd();
                }
              }}
              ref={emojiDivRef}
            >
              <EmojiPicker
                emojiStyle={EmojiStyle.GOOGLE}
                onEmojiClick={handleEmojiClick}
                autoFocusSearch={false}
              />
            </div>
          )}

          {/* Image Upload Button */}
          <div className="p-2 border bg-white shadow-xs border-light-neutral-600 rounded cursor-pointer">
            <label htmlFor="picture" className=" cursor-pointer">
              <div className="h-5 w-5">
                <Picture />
              </div>
            </label>
          </div>
          <input
            type="file"
            id="picture"
            className="hidden"
            onChange={handleImageInput}
          />

          {/* Emoji Button */}
          <div
            className="p-2 border bg-white shadow-xs border-light-neutral-600 rounded cursor-pointer"
            onClick={() => {
              setShowEmojiMenu(!showEmojiMenu);
              inputRef.current.focus();
              moveCursorToEnd();
            }}
            ref={emojiIconDivRef}
          >
            <div className="h-5 w-5 cursor-pointer">
              <EmojiIcon />
            </div>
          </div>

          {/* InstaReels Button */}
          <div
            className="p-2 border bg-white shadow-xs border-light-neutral-600 rounded cursor-pointer"
            // onClick={() => {
            //   setShowEmojiMenu(!showEmojiMenu);
            //   inputRef.current.focus();
            //   moveCursorToEnd();
            // }}
            // ref={emojiIconDivRef}
          >
            <div className="h-5 w-5 cursor-pointer">
              <InstaReels />
            </div>
          </div>

          {/* Cancel reply buttons */}
          {/* <div className="flex justify-end gap-3 w-full text-[14px] font-medium">
            <button
              onClick={() => {
                setIsFocused(false);
                inputRef.current.blur();
                setIsCommenting(false);
              }}
            >
              Cancel
            </button>
            <button>Reply</button>
          </div> */}
        </div>
      </div>

      {(isFocused || posting) && (
        <div className="flex justify-end items-center gap-8">
          {/* <div className=""> */}
          <div
            onClick={cancelComment}
            className="hover:cursor-pointer hover:underline "
          >
            Cancel
          </div>
          {!posting ? (
            <div
              onClick={() => postCommentFunction(commentHtmlContent)}
              className="hover:cursor-pointer button-sm button-primary w-auto"
            >
              Post
            </div>
          ) : (
            <div className="hover:cursor-wait button-sm button-disabled w-auto">
              Posting
            </div>
          )}
          {/* </div> */}
        </div>
      )}
    </div>
  );
};

export default CommentInput;
