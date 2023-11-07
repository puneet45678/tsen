import React, { useState, useRef, useEffect } from "react";
import { Splide, SplideSlide, SplideTrack } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import axios from "axios";
import Image from "next/image";

export default function ReviewQuestions(props) {
  const [showBack, setShowBack] = useState(0);
  const [questionValue_1, setQuestionValue_1] = useState(0);
  const [questionValue_2, setQuestionValue_2] = useState(0);
  const [questionValue_3, setQuestionValue_3] = useState(0);
  const [questionValue_4, setQuestionValue_4] = useState(0);
  const [questionValue_5, setQuestionValue_5] = useState(0);
  const [reviewModalData, setReviewModalData] = useState();
  const [feedbackText, setFeedbackText] = useState();
  const [questionNumber, setQuestionNumber] = useState();
  const [feedbackValueSelected, setFeedbackValueSelected] = useState();
 

  const feedbackTextRef = useRef();
  const imageUploadRef = useRef();

  let reviewQuestions = [
    {
      question:
        "On a scale of not creative to extremely creative, how innovative and visually appealing do you find the art style of the model? ",
      backButtonHidden: true,
      feedbackValue: 0,
      askQuestion: false,
    },
    {
      question:
        "On a scale of not accurate at all to perfectly accurate, how closely does the actual model match the description provided?",
      backButtonHidden: false,
      feedbackValue: 0,
      askQuestion: false,
    },
    {
      question:
        "On a scale from poor to excellent, how satisfied are you with the mesh quality of the model",
      backButtonHidden: false,
      feedbackValue: 0,
      askQuestion: false,
    },
    {
      askQuestion: true,
    },
  ];

  const handleShowBackButton = () => {
    setShowBack(showBack + 1);
    console.log("Show back button", showBack);
  };

  const handleHideBackButton = () => {
    setShowBack(showBack - 1);
  };

  const [isSelected, setIsSelected] = useState(0);
  const [uploadImage, setUploadImage] = useState();
  const [reviewImages, setReviewImages] = useState([]);

  const handleSettingFeedbackValue_display = (
    question_number,
    feedback_value
  ) => {
    if (question_number === 1) {
      setQuestionValue_1(feedback_value);
      console.log("isSelected_ques:", isSelected);
      return 1;
    } else if (question_number === 2) {
      setQuestionValue_2(feedback_value);
      return 2;
    } else if (question_number === 3) {
      setQuestionValue_3(feedback_value);
      return 3;
    } else if (question_number === 4) {
      setQuestionValue_4(feedback_value);
      return 4;
    } else {
      setQuestionValue_5(feedback_value);
      return 5;
    }
  };

  const handleAddingReview = () => {
    let review_data;
    console.log("reviewFeedback_text: ",feedbackText)
    if (props.item_type === "MODEL") {
      review_data = {
        text: feedbackText,
        feedback: {
          feedbackQuestion1: questionValue_1,
          feedbackQuestion2: questionValue_2,
          feedbackQuestion3: questionValue_3,
        },
      };
    } else if (props.item_type === "TIER") {
      review_data = {
        text: feedbackText,
      };
    }

    axios
      .put(
        `${process.env.NEXT_PUBLIC_REVIEW_SERVICE_URL}/api/v1/review/${props.reviewId}`,
        { ...review_data },
        { withCredentials: true }
      )
      .then((res) => {
        props.setShowRatingModal(false);
        console.log("submitted_review: ", res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleImageUpload = (e)=>{
    setUploadImage((e.target.files[0]))
    // if(uploadImage!==null && uploadImage!==undefined) {
      setReviewImages([...reviewImages,e.target.files[0]])
    // }
  }

  const handleClickImageUpload = ()=>{
    imageUploadRef.current.click();
  }

  useEffect(()=>{
    
  },[uploadImage])

  useEffect(() => {
    handleSettingFeedbackValue_display(questionNumber, feedbackValueSelected);
  }, [questionNumber, feedbackValueSelected]);

  useEffect(() => {
    if (props?.reviewId !== null && props.reviewId !== undefined) {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_REVIEW_SERVICE_URL}/api/v1/review/${props?.reviewId}`,
          { withCredentials: true }
        )
        .then((response) => {
          setReviewModalData(response.data);
          setFeedbackText(response?.data?.text)
          console.log("ReviewModalData: ", response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);

  return (
    <div className="flex items-center w-full h-full">
      <Splide
        options={{
          perPage: 1,
          padding: "24px",
          gap: "38px",
          pagination: false,
        }}
        hasTrack={false}
      >
        <div className="flex flex-col gap-[6px] w-full h-full">
          <div
            className={`${
              props.item_type === "TIER" || showBack === 3 ? "flex" : "hidden"
            } text-sm font-[500]`}
          >
            Write Product Review
          </div>

          <div className="w-full h-full">
            <div className="rounded-[5px] bg-light-neutral-50 w-[576px] h-full pt-[24px] pb-[32px]">
              <SplideTrack>
                {reviewQuestions.map((questionnaire, question_index) => (
                  <>
                    <SplideSlide>
                      {!questionnaire.askQuestion &&
                      props.item_type === "MODEL" ? (
                        <div className="flex flex-col gap-[16px]">
                          <div className="text-sm text-dark-neutral-50 font-[500]">
                            Question {question_index + 1}/
                            {reviewQuestions.length - 1}
                          </div>
                          {/* {handleShowBackButton(index)} */}
                          <div className="flex flex-col gap-[24px]">
                            <div className="text-lg text-dark-neutral-600 font-medium">
                              {questionnaire.question}
                            </div>
                            <div
                              key={question_index}
                              className="grid grid-cols-5 gap-[16px]"
                            >
                              {[...new Array(5)].map((value, index) => (
                                <>
                                
                                  <div
                                    key={index}
                                    className="flex flex-col gap-[12px]"
                                  >
                                    <button
                                      onClick={() => {
                                        questionnaire.feedbackValue = index + 1;
                                        setFeedbackValueSelected(index + 1);
                                        setQuestionNumber(question_index + 1);
                                        setIsSelected(true);
                                        console.log(
                                          "Selected_val: ",
                                          isSelected
                                        );
                                      }}
                                      className={`px-[18px] ${
                                        ((reviewModalData?.feedback?.[`feedbackQuestion${question_index+1}`] === index+1 || (questionNumber === question_index + 1 &&
                                        feedbackValueSelected === index + 1)))
                                          ? "bg-primary-purple-500 text-white"
                                          : "bg-white text-black"
                                      } py-[11px] hover:bg-light-neutral-200 hover:text-black rounded-[6px] border-[1px] border-light-neutral-600 text-center text-md font-[600]`}
                                    >
                                      {index + 1}
                                    </button>
                                    <div
                                      className={`text-dark-neutral-50 text-xs font-[500] ${
                                        index === 0 ? "text-left" : "text-right"
                                      }`}
                                    >
                                      {index === 0
                                        ? "Poor"
                                        : index === 4
                                        ? "Really good"
                                        : ""}
                                    </div>
                                  </div>
                                </>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-full flex flex-col gap-[6px]">
                          <textarea
                            ref={feedbackTextRef}
                            className="w-full bg-light-neutral-50 outline-none h-[105px]"
                            placeholder="Please write the product review here"
                            onChange={(ev) => {
                              setFeedbackText(ev.target?.value);
                            }}
                            value={feedbackText}
                          ></textarea>
                        </div>
                      )}
                    </SplideSlide>
                  </>
                ))}
              </SplideTrack>

              {/* </div> */}
            </div>
            
           <div
           className={`grid grid-cols-[1fr,1fr,1fr,1fr,1fr] ${showBack === 3 || props.item_type === "TIER"?"flex":"hidden"}`}
           >
           <div
           onClick={handleClickImageUpload}
           className={`cursor-pointer mt-[24px] border-dashed border-[0.75px] border-primary-purple-500 h-[75px] w-[105px] rounded-[4.5px] `}>
           <input
            type="file"
            onChange={handleImageUpload}
            className="hidden"
            ref={imageUploadRef}
            >

            </input>
           </div>
           {console.log("reviewImages: ",reviewImages)}
           <>
           {reviewImages?.map((image,index)=>(
            <div className="mt-[24px]">
           <Image
           width={100}
           height={75}
           className="object-contain"
           key={image.id}
           src={URL.createObjectURL(image)}
           /> 
            </div>
           ))}
           </>
           </div>

            <div className="flex flex-col gap-[32px] mt-[48px]">
              <div className="">
                By submitting review you give us consent to publish and process
                personal information in accordance with{" "}
                <span className="cursor-pointer text-primary-purple-600">
                  Terms of use
                </span>{" "}
                and{" "}
                <span className="cursor-pointer text-primary-purple-600">
                  Privacy Policy
                </span>
              </div>

              <div
                className={`flex ${
                  showBack !== 0 ? "justify-between" : "justify-end"
                } splide__arrows relative`}
              >
                {console.log("Show_back: ", showBack)}
                <button
                  onClick={() => handleHideBackButton()}
                  className={`splide__arrow--prev rotate-180 ${
                    showBack !== 0 ? "flex" : "hidden"
                  }`}
                  style={{
                    color: "#323539",
                    fontSize: "15px",
                    // display: "flex",
                    gap: "6px",
                    alignItems: "center",
                    // display:`${showBack!==0?"flex":"hidden"}`
                  }}
                >
                  <div className="rotate-180">Back</div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M12.6666 8H3.9999M7.33323 4L3.80464 7.5286C3.54429 7.78894 3.54429 8.21106 3.80464 8.4714L7.33323 12"
                      stroke="#282828"
                      stroke-width="1.5"
                      stroke-linecap="round"
                    />
                  </svg>
                </button>

                <button
                  onClick={() => handleShowBackButton()}
                  className={`bg-primary-purple-500 px-[18px] py-[11px] rounded-[6px] ${
                    showBack === 3 || props.item_type === "TIER"
                      ? "hidden"
                      : "flex"
                  } gap-[6px] items-center cursor-pointer splide__arrow--next`}
                >
                  <div className="text-white">Next</div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M4.16675 10H15.0001M10.8334 5L15.2442 9.41074C15.5696 9.73618 15.5696 10.2638 15.2442 10.5893L10.8334 15"
                      stroke="white"
                      stroke-width="1.5"
                      stroke-linecap="round"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    handleAddingReview();
                  }}
                  className={`bg-primary-purple-500 px-[18px] py-[11px] text-white rounded-[6px] ${
                    showBack === 3 && props.item_type === "MODEL"
                      ? "flex"
                      : "hidden"
                  } gap-[6px] items-center cursor-pointer`}
                >
                  Submit
                </button>
                <button
                  onClick={() => {
                    handleAddingReview();
                  }}
                  className={`bg-primary-purple-500 px-[18px] py-[11px] text-white rounded-[6px] ${
                    props.item_type === "TIER" ? "flex" : "hidden"
                  } gap-[6px] items-center cursor-pointer`}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* </div> */}
      </Splide>
    </div>
  );
}
