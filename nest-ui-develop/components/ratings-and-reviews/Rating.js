import React, { useEffect, useRef, useState } from "react";
import StarsIconComponent from "./StarsIconComponent";
import { string, number, func, bool } from "prop-types";
import ModalCenter from "../ModalCenter";
import Image from "next/image";
import ReviewQuestions from "./ReviewQuestions";
import axios from "axios";

const SIZES = {
  SMALL: {
    key: "s",
    size: 16,
  },
  MEDIUM: {
    key: "m",
    size: 20,
  },
  LARGE: {
    key: "l",
    size: 24,
  },
};

const OUT_OF_VALUE = 5;

export default function Rating(props) {
  const splideRef = useRef();
  const [showRatingModal, setShowRatingModal] = useState(false);

  const [writeReviewTierClicked, setWriteReviewTierClicked] = useState("");

  const {
    iconSize,
    ratingInPercent,
    showOutOf,
    enableUserInteraction,
    onClick,
    item_dp,
    item_name,
    artist_dp,
    artist_name,
    item_id,
    item_type,
    rating,
    campaign_id,
    review_id,
    cursor_type,
  } = props;
  const [ratingValue, setRatingValue] = useState(rating);
  const [activeStar, setActiveStar] = useState(rating - 1);
  const [showWriteReview, setShowWriteReview] = useState(false);
  const decimal = ratingInPercent / 20;
  const nonFraction = Math.trunc(decimal);
  const fraction = Number((decimal - nonFraction).toFixed(2));
  const [reviewId, setReviewId] = useState(review_id);
  const fractionPercent = fraction * 100;
  const [ratingValueChanged, setRatingValueChanged] = useState(false);

  //   const classes = defaultClasses;

  const numberOfStar = OUT_OF_VALUE;
  const size =
    iconSize === SIZES.SMALL.key
      ? SIZES.SMALL.size
      : iconSize === SIZES.MEDIUM.key
      ? SIZES.MEDIUM.size
      : SIZES.LARGE.size;

  const RatingHighlighted = (
    <StarsIconComponent type={"ratingHighlighted"} width={size} height={size} />
  );
  const RatingDefault = (
    <StarsIconComponent type={"ratingDefault"} width={size} height={size} />
  );

  useEffect(() => {
    if (
      ratingValue !== undefined &&
      ratingValue !== null &&
      ratingValue !== 0 &&
      ratingValueChanged !== false
    ) {
      AddRating(ratingValue);
    }
  }, [ratingValue, ratingValueChanged]);

  const handleClick = (index) => {
    setRatingValue(index + 1);
    setActiveStar(index);
    if (reviewId === null || reviewId === undefined) {
      setShowWriteReview(true);
    }
    setRatingValueChanged(true);
  };

  const showDefaultStar = (index) => {
    return RatingDefault;
  };

  let isShow = true;
  const getStar = (index) => {
    if (index <= nonFraction - 1) {
      isShow = true;
      return "100%";
    } else if (fractionPercent > 0 && isShow) {
      isShow = false;
      return `${fractionPercent}%`;
    } else {
      return "0%";
    }
  };

  const isShowOutOfStar = (index) => {
    if (showOutOf) {
      return showOutOf;
    }

    const isLoopThrough = (fraction === 0 ? nonFraction : nonFraction + 1) - 1;
    return index <= isLoopThrough;
  };

  const withoutUserInteraction = (index) => {
    return isShowOutOfStar(index) ? (
      <div style={{ position: "relative" }} key={index}>
        <div
          style={{
            width: getStar(index),
            overflow: "hidden",
            position: "absolute",
            cursor: "not-allowed"
          }}
        >
          {RatingHighlighted}
        </div>
        {showDefaultStar(
          showOutOf
            ? nonFraction === 0
              ? index < nonFraction
              : index <= nonFraction
            : index <= numberOfStar
        )}
      </div>
    ) : null;
  };

  const withUserInteraction = (index) => {
    return (
      <div
        style={{ position: "relative" }}
        onClick={() => handleClick(index)}
        key={index}
      >
        <div
          style={{
            width: index <= activeStar ? "100%" : "0%",
            overflow: "hidden",
            position: "absolute",
          }}
        >
          {RatingHighlighted}
        </div>
        {showDefaultStar()}
      </div>
    );
  };

  const AddRating = (rating) => {
    console.log("ReviewID: ", reviewId);
    if (reviewId === null || reviewId === undefined) {
      axios
        .post(
          `${process.env.NEXT_PUBLIC_REVIEW_SERVICE_URL}/api/v1/rating/model/${item_id}?rating=${rating}`,
          {},
          { withCredentials: true }
        )
        .then((res) => {
          console.log("review_id_created: ", res.data);
          setReviewId(res.data.reviewId);
        });
    } else {
      let updated_rating_data = { rating: rating };
      axios
        .put(
          `${process.env.NEXT_PUBLIC_REVIEW_SERVICE_URL}/api/v1/review/${reviewId}`,
          updated_rating_data,
          { withCredentials: true }
        )
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const createCampaignReviewId = () => {
    {
      console.log("Review_id_tier: ", reviewId);
    }
    if (reviewId === null || reviewId === undefined) {
      axios
        .post(
          `${process.env.NEXT_PUBLIC_REVIEW_SERVICE_URL}/api/v1/review/campaign/${campaign_id}?tierId=${item_id}`,
          {},
          { withCredentials: true }
        )
        .then((res) => {
          setReviewId(res.data.reviewId);
          setShowRatingModal(true);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const handleDeleteModelReview = () => {
    axios
      .delete(
        `${process.env.NEXT_PUBLIC_REVIEW_SERVICE_URL}/api/v1/review/${reviewId}/model/${item_id}`,
        { withCredentials: true }
      )
      .then((res) => {
        console.log("Review_Deletion_response: ", res.data);
      })
      .catch((err) => {
        console.error("Review_Deletion_error: ", err);
      });
  };

  const handleDeleteCampaignReview = () => {
    axios
      .delete(
        `${process.env.NEXT_PUBLIC_REVIEW_SERVICE_URL}/api/v1/review/${reviewId}/campaign/${campaign_id}?tierId=${item_id}`,
        { withCredentials: true }
      )
      .then((response) => {
        console.log("Campaign_deletion_success: ", response.data);
      })
      .catch((error) => {
        console.log("Campaign_deletion_error: ", error);
      });
  };

  return (
    <div
      className={`h-fit flex flex-col gap-[12px] ${
        showWriteReview ? "mt-[36px]" : ""
      }`}
    >
      {/* {Review Modal Code starts} */}

      {showRatingModal && (
        <ModalCenter>
          <div className="relative bg-dark-primary-2 flex flex-col p-6 rounded-sm bg-white w-[624px] mx-auto">
            <div className="flex flex-col gap-[24px]">
              <div
                onClick={() => setShowRatingModal(false)}
                className=" w-full top-[24px] right-[24px] flex justify-end cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M18 6L6 18M18 18L6 6.00001"
                    stroke="#858C95"
                    stroke-width="1.5"
                    stroke-linecap="round"
                  />
                </svg>
              </div>
              <div className="flex flex-col gap-[24px]">
                <div className="flex justify-center text-headline-xs font-[600] text-dark-neutral-700">
                  Tell us more about it
                </div>

                <div className="flex flex-col gap-[48px]">
                  <div
                    className={`h-full w-full gap-[16px] justify-center ${
                      item_type === "MODEL" ? "flex" : "hidden"
                    }`}
                  >
                    <div className="text-left text-dark-neutral-700 text-lg font-[500]">
                      Your Ratings
                    </div>
                    <div className={`flex gap-[8px] text-left justify-start`}>
                      <div
                        className={`items-end text-dark-neutral-50 font-[500] text-lg ${
                          ratingValue === 0 ? "hidden" : "flex"
                        }`}
                      >
                        {ratingValue}
                      </div>
                      <div className="flex relative cursor-pointer gap-[2px] justify-center">
                        {[...new Array(numberOfStar)].map((arr, index) =>
                          enableUserInteraction
                            ? withUserInteraction(index)
                            : withoutUserInteraction(index)
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-[24px]">
                    <div className="flex gap-[12px]">
                      <div className="h-[75px] w-[100px] aspect-square rounded-[5px] overflow-hidden relative">
                        {item_dp && (
                          <Image
                            src={item_dp}
                            alt=""
                            className="object-cover"
                            fill
                          />
                        )}
                      </div>
                      <div className="flex flex-col gap-[15px]">
                        <div className="text-lg text-dark-neutral-700 font-[500]">
                          {item_name}
                        </div>
                        {/* <div> */}
                        <div className="flex items-center justify-start gap-3">
                          <div className="w-8 h-8 aspect-square rounded-full relative">
                            {/* {userData?.[item.userId]?.profilePicture
                                 ?.croppedPictureUrl && (
                                 <Image
                                   src={
                                     userData[item.userId].profilePicture
                                       .croppedPictureUrl
                                   }
                                   alt=""
                                   className="object-cover object-center rounded-full"
                                   fill
                                 />
                               )} */}
                            <Image
                              src={artist_dp}
                              alt=""
                              className="object-cover object-center rounded-full"
                              fill
                            />
                          </div>
                          <span className="text-dark-neutral-700 text-sm">
                            by {artist_name}
                            {/* {userData?.[item.userId]?.username} */}
                          </span>
                        </div>
                      </div>
                      {/* </div> */}
                    </div>
                    <div className="border-[1px] border-light-neutral-600"></div>
                  </div>
                </div>

                <div className="flex flex-col gap-[48px]">
                  <div id="review-question-box" className="">
                    <ReviewQuestions
                      splideRef={splideRef}
                      reviewId={reviewId}
                      item_id={item_id}
                      setShowRatingModal={setShowRatingModal}
                      item_type={item_type}
                    />
                  </div>
                  <div className="flex flex-col gap-[32px]"></div>
                </div>
              </div>
            </div>
          </div>
        </ModalCenter>
      )}

      {/* {Review Modal code ends} */}

      {/* {Stars Component code} */}
      <div className="flex gap-[8px] text-left justify-start">
        {item_type === "MODEL" ? (
          <>
            <div
              className={`items-end text-dark-neutral-50 font-[500] text-lg ${
                ratingValue === 0 ? "hidden" : "flex"
              }`}
            >
              {ratingValue}
            </div>
            <div className={`flex relative ${cursor_type} gap-[2px] justify-center`}>
              {[...new Array(numberOfStar)].map((arr, index) =>
                enableUserInteraction
                  ? withUserInteraction(index)
                  : withoutUserInteraction(index)
              )}
            </div>
          </>
        ) : (
          <>
            <div
              onClick={() => {
                createCampaignReviewId();
              }}
              className={`text-primary-purple-500 font-[600] text-md ${
                (reviewId !== null && reviewId !== undefined )? "hidden" : "flex"
              } cursor-pointer`}
            >
              Write a review
            </div>

            <div
              className={`${
                reviewId === null || reviewId === undefined ? "hidden" : "flex"
              } gap-[18px]`}
            >
              <div
                onClick={() => {
                  setShowRatingModal(true);
                }}
                className={`text-primary-purple-500 font-[600] text-md flex cursor-pointer`}
              >
                Edit Review
              </div>
              <div
                onClick={() => {
                  handleDeleteCampaignReview();
                }}
                className="text-error-600 text-md font-[600] cursor-pointer"
              >
                Delete
              </div>
            </div>
          </>
        )}
      </div>
      <div
        onClick={() => setShowRatingModal(true)}
        className={`text-primary-purple-500 font-[600] text-md cursor-pointer ${
          showWriteReview ? "block cursor-pointer" : "hidden"
        }`}
      >
        Write a review
      </div>
      <div
        className={`${
          item_type === "TIER" || review_id === null || review_id === undefined
            ? "hidden"
            : "flex"
        } gap-[18px]`}
      >
        <div
          onClick={() => {
            setShowRatingModal(true);
          }}
          className="text-primary-purple-600 text-md font-[600] cursor-pointer"
        >
          Edit Review
        </div>
        <div
          onClick={() => {
            handleDeleteModelReview();
          }}
          className="text-error-600 text-md font-[600] cursor-pointer"
        >
          Delete
        </div>
      </div>
    </div>
  );
}

Rating.propTypes = {
  ratingInPercent: number.isRequired,
  iconSize: string,
  showOutOf: bool.isRequired,
  enableUserInteraction: bool.isRequired,
  onClick: func,
  item_dp: string,
  item_name: string,
  artist_dp: string,
  artist_name: string,
  item_id: string,
  item_type: string,
  rating: number,
  campaign_id: string,
  review_id: string,
  cursor_type:string,
};

Rating.defaultProps = {
  ratingInPercent: 50,
  iconSize: SIZES.LARGE.key,
  onClick: () => null,
  showOutOf: false,
  enableUserInteraction: false,
  item_dp: "",
  item_name: "",
  artist_dp: "",
  artist_name: "",
  item_id: "",
  item_type: "",
  campaign_id: "",
  reviewId: "",
  rating: 0,
  cursor_type:""
};
