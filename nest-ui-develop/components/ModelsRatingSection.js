import React, { useState, useEffect } from "react";
import axios from "axios";
import Rating from "./ratings-and-reviews/Rating";
import StarsIconComponent from "./ratings-and-reviews/StarsIconComponent";
import Image from "next/image";
import ReportFlag from "../icons/ReportFlag";
import TimeAgo from "./TimeAgo";

export default function ModelsRatingSection(props) {
  const [ModelReviewData, setModelReviewData] = useState();
  const [averageRating, setAverageRating] = useState(0);
  const [reviewImagesNumber, setReviewImagesNumber] = useState(0);
  const [buyerReviewsNumber, setBuyerReviewsNumber] = useState(0);
  const [buyerReviewImages, setBuyerReviewImages] = useState([]);

  const [starRating1, setStarRating1] = useState(0);
  const [starRating2, setStarRating2] = useState(0);
  const [starRating3, setStarRating3] = useState(0);
  const [starRating4, setStarRating4] = useState(0);
  const [starRating5, setStarRating5] = useState(0);

  const handleAddingReviewHelpful = (review_id) => {
    axios
      .post(
        `${process.env.NEXT_PUBLIC_REVIEW_SERVICE_URL}/api/v1/review/${review_id}/helpful`,
        {},
        { withCredentials: true }
      )
      .then((response) => {
        console.log("Successfully added review helpful: ", response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  console.log("reviewData: ", props?.reviewData);
  useEffect(() => {
    let review_ids_list = [];
    if (
      props.reviewData !== undefined &&
      props.reviewData.length > 0 &&
      props.reviewData !== null
    ) {
      props?.reviewData?.map((review_data, index) => {
        review_ids_list.push(review_data?.reviewId);
      });
      axios
        .post(
          `${process.env.NEXT_PUBLIC_REVIEW_SERVICE_URL}/api/v1/reviews`,
          { reviewIds: review_ids_list },
          { withCredentials: true }
        )
        .then((response) => {
          setModelReviewData(response.data);

          let total_rating = 0;
          let reviewImagesNumberVar = 0;
          let starRating1Var = 0;
          let starRating2Var = 0;
          let starRating3Var = 0;
          let starRating4Var = 0;
          let starRating5Var = 0;

          response?.data?.map((model_review_data, index) => {
            total_rating = total_rating + model_review_data?.rating;
            setAverageRating(parseFloat(total_rating / (index + 1)));
            reviewImagesNumberVar =
              reviewImagesNumberVar + model_review_data?.reviewImages.length;
            setReviewImagesNumber(reviewImagesNumberVar);
            if (model_review_data?.rating === 1) {
              starRating1Var = starRating1Var + 1;
              setStarRating1(starRating1Var);
            } else if (model_review_data?.rating === 2) {
              starRating2Var = starRating2Var + 1;
              setStarRating2(starRating2Var);
            } else if (model_review_data?.rating === 3) {
              starRating3Var = starRating3Var + 1;
              setStarRating3(starRating3Var);
            } else if (model_review_data?.rating === 4) {
              starRating4Var = starRating4Var + 1;
              setStarRating4(starRating4Var);
            } else if (model_review_data?.rating === 5) {
              starRating5Var = starRating5Var + 1;
              setStarRating5(starRating5Var);
            }
          });
          setBuyerReviewsNumber(response?.data?.length);
        })
        .catch((error) => {
          console.error("Error in fetching review data", error);
        });
    }
  }, [props?.reviewData]);

  useEffect(() => {
    console.log("averageRating: ", averageRating);
    console.log("reviewImagesNumber: ", reviewImagesNumber);
    console.log("ModelReviewDataEffect: ", ModelReviewData);
  }, [averageRating, ModelReviewData]);

  const starFillerStyles = {
    width: "118px",
    height: "10px",
    borderRadius: "2px",
    position: "relative",

    ":after": {
      content: "A",
      position: "absolute",
      background: "black",
      top: 0,
      bottom: 0,
      left: 0,
      width: "70%",
      WebkitAnimation: "filler 2s ease-in-out",
      MozAnimation: "filler 2s ease-in-out",
      animation: "filler 2s ease-in-out",
    },
  };

  return (
    <div className="flex flex-col gap-[24px]">
      <div className="text-headline-sm font-[600] text-dark-neutral-700">
        Reviews
      </div>
      <div className="flex flex-col gap-[32px]">
        <div className="flex justify-between">
          <div className="flex flex-col gap-[8px]">
            <div className="text-headline-sm font-[600] text-dark-neutral-700">
              {averageRating}
            </div>
            <div>
              <Rating
                iconSize={"l"}
                showOutOf={true}
                enableUserInteraction={false}
                ratingInPercent={(averageRating * 100) / 5}
                item_type={"MODEL"}
                cursor_type={"cursor-not-allowed"}
              />
            </div>
            <div className="text-lg font-[500] text-dark-neutral-200">
              Based on {ModelReviewData?.length}{" "}
              {ModelReviewData?.length === 1 ? "review" : "reviews"}
            </div>
          </div>
          <div className="flex flex-col gap-[]">
            {[...new Array(5)].map((value, index) => (
              <div className="flex flex-col gap-[]">
                <div className="flex gap-[5px]">
                  <div>{5 - index}</div>
                  <div>
                    <StarsIconComponent
                      type={"ratingDefault"}
                      width={20}
                      height={20}
                    />
                  </div>
                  {/* {console.log("`starRating${5-index}`: ",starRating+`${5-index}`)} */}
                  <div
                    className={`rating-filler after:${
                      5 - index === 1
                        ? `w-[${starRating1 / ModelReviewData?.length}]`
                        : 5 - index === 2
                        ? `w-[${starRating2 / ModelReviewData?.length}]`
                        : 5 - index === 3
                        ? `w-[${starRating3 / ModelReviewData?.length}]`
                        : 5 - index === 4
                        ? `w-[${starRating3 / ModelReviewData?.length}]`
                        : 5 - index === 5
                        ? `w-[${starRating3 / ModelReviewData?.length}]`
                        : ""
                    }`}
                    style={starFillerStyles}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="border-[1px] border-light-neutral-600"></div>
        <div className="flex flex-col gap-[24px]">
          <div className="text-headline-2xs text-dark-neutral-700 font-medium">
            What our buyers said
          </div>
          <div className="grid grid-cols-3 gap-auto "></div>
        </div>
      </div>
      <div className="border-[1px] border-light-neutral-600"></div>
      <div className="flex flex-col gap-[24px]">
        <div className="text-headline-2xs text-dark-neutral-700 font-medium">
          Buyers Photos(
          {reviewImagesNumber !== undefined &&
          reviewImagesNumber !== null &&
          reviewImagesNumber !== NaN
            ? reviewImagesNumber
            : 0}
          )
        </div>
        <div className="grid grid-cols-[1fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr] gap-[16px]">
          {ModelReviewData?.length > 0 &&
            ModelReviewData?.map((model_review_data, index) => (
              <>
                {model_review_data?.reviewImages.length > 0 &&
                  model_review_data?.reviewImages.map((review_image, index) => (
                    <>
                      <div
                        key={review_image.id}
                        className="w-[140px] h-[100px] aspect-square relative"
                      >
                        <Image
                          className="object-cover object-center rounded-[5px]"
                          src={review_image}
                          fill
                        />
                      </div>
                    </>
                  ))}
              </>
            ))}
        </div>
      </div>
      <div className="border-[1px] border-light-neutral-600"></div>
      <div className="flex flex-col gap-[24px]">
        <div className="text-headline-2xs text-dark-neutral-700 font-medium">
          Buyers Reviews({buyerReviewsNumber})
        </div>
        <div className="p-[32px] bg-light-neutral-50 rounded-[5px]">
          {ModelReviewData !== undefined &&
          ModelReviewData !== null &&
          ModelReviewData.length > 0 ? (
            <div className="flex flex-col gap-[24px]">
              {ModelReviewData?.map((review_data, index) => (
                <div className="flex flex-col gap-[12px]">
                  <div className="flex gap-[12px]">
                    <div className="w-[40px] h-[40px] aspect-square relative flex items-start">
                      <Image
                        className="object-cover object-center rounded-full"
                        src={review_data?.reviewerImage}
                        fill
                      />
                    </div>
                    <div className="my-auto"> {review_data?.reviewerName} </div>
                  </div>
                  <div
                    className="flex flex-col gap-[15px] ml-[52px]"
                    key={review_data.id}
                  >
                    <div className="flex gap-[8px]">
                      <div className="flex items-center">
                        <Rating
                          iconSize={"s"}
                          showOutOf={true}
                          enableUserInteraction={false}
                          ratingInPercent={(review_data?.rating * 100) / 5}
                          item_type={"MODEL"}
                          cursor_type={"cursor-not-allowed"}
                        />
                      </div>
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="5"
                          height="6"
                          viewBox="0 0 5 6"
                          fill="none"
                        >
                          <circle cx="2.5" cy="3" r="2.5" fill="#525D6A" />
                        </svg>
                      </div>
                      <div className="text-sm">
                        <TimeAgo timestamp={review_data?.updateTime} />
                      </div>
                    </div>
                    <div className="text-lg text-dark-neutral-200 font-normal">
                      {review_data?.text}
                    </div>
                    <div className="flex gap-[16px]">
                      {review_data?.reviewImages.length > 0 &&
                        review_data?.reviewImages?.map(
                          (review_image, index) => (
                            <div className="flex flex-col gap-[24px]">
                              <div className="w-[140px] h-[100px] aspect-square relative">
                                <Image
                                  className="object-cover object-center rounded-[5px]"
                                  src={review_image}
                                  fill
                                />
                              </div>
                              <div className="flex flex-col gap-[12px]">
                                <div
                                  className={`${
                                    review_data?.foundHelpful.length > 0
                                      ? "flex"
                                      : "hidden"
                                  } text-sm font-normal text-dark-neutral-50`}
                                >
                                  {review_data?.foundHelpful.length} people
                                  found this helpful
                                </div>
                                <div className="flex gap-[24px]">
                                  <button
                                    onClick={() => {
                                      handleAddingReviewHelpful(
                                        review_data?._id
                                      );
                                    }}
                                    className="border-[1px] text-sm font-semibold text-dark-neutral-700 border-light-neutral-600 rounded-[4px] px-[12px] py-[6px] bg-white"
                                  >
                                    Helpful
                                  </button>
                                  <div className="flex gap-[6px] items-center text-sm font-semibold text-dark-neutral-700">
                                    <ReportFlag />
                                    Report
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}
