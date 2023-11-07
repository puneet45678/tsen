import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import parse from "html-react-parser";
import { useRouter } from "next/router";
import Image from "next/image";
import InformationDropdownContainer from "../../components/InformationDropdownContainer";
import Heart from "../../icons/Heart";
import Comments from "../../components/Comments/Comments";
import ChevronLeft from "../../icons/ChevronLeft";
import ChevronRight from "../../icons/ChevronRight";
import Cart from "../../icons/Cart";
import ArrowTopRightRectangle from "../../icons/ArrowTopRightRectangle";
import ThumbsUp from "../../icons/ThumbsUp";
import ThumbsUpFilled from "../../icons/ThumbsUpFilled";
import ArrowTopRectangle from "../../icons/ArrowTopRectangle";
import ModalCenter from "../../components/ModalCenter";
import ModelReportModal from "../../components/ModelReportModal";
import RecommendedModelCard from "../../components/ModelMarketplace/RecommendedModelCard";
import ModelsRatingSection from "../../components/ModelsRatingSection";
import Plus from "../../icons/Plus";
import UploadIcon from "../../icons/UploadIcon";
import LikeIcon from "../../icons/LikeIcon";
import ReactModal from "../../components/Modals/Modal";
import ReportFlag from "../../icons/ReportFlag";
import MatureContentPlaceholder from '../../components/ModelMarketplace/MatureContentPlaceholder'

const DESCRIPTION_TEST_DATA = `
<h1>sajdioqwh</h1><p>as'das;ld </p><p>asd aqs;dm a; zxcXZczx</p><p>zxczx</p><h3>c</h3><h1>asdadsas</h1><p>asdasda</p>
`;
const dummyModel = {
  _id: "652f7a6d043c08db8d32c2e6",
  userId: "65277e2dccd85309a90adde1",
  modelName: "Dummy Model",
  adminModified: false,
  uploadDatetime: "2023-10-18T06:25:49.977000",
  updatedAt: "2023-10-18T06:33:37.189000",
  coverImage: null,
  categoryId: [],
  shortDescription: "this is sparta",
  description: DESCRIPTION_TEST_DATA,
  modelFileUrl: {
    stl: "string",
    glb: "string",
  },
  modelFiles: {
    stlFiles: [],
    glbFiles: [],
  },
  NSFW: false,
  price: "59.99",
  currency: "USD",
  printDetails: null,
  supportNeeded: false,
  dimensions: {
    modelHeight: null,
    modelWidth: null,
    modelLength: null,
  },
  scale: {
    minScale: 0,
    maxScale: 0,
  },
  timetoPrint: {
    hours: 0,
    minutes: 0,
  },
  deprecated: false,
  approvalStatus: "Submitted",
  visibility: "private",
  printMaterial: "Plastic",
  materialQuantity: 0,
  licenseId: null,
  modelImages: [],
  remixes: [],
  tagIds: [],
  campaigns: [],
  commentIds: [
    "6532145459faa88e8e7d0007",
    "65323cb48c3b4fde96e4d65d",
    "653637b08546ee07ff0024ea",
    "6536391a8546ee07ff0024eb",
  ],
  reviewData: [
    {
      reviewId: "652f7da3ac6565a5b8da6fc2",
      reviewerId: "65277e2dccd85309a90adde1",
    },
    {
      reviewId: "652f81453ef83f3c18d9c07e",
      reviewerId: "65277e2dccd85309a90adde1",
    },
    {
      reviewId: "6530b0f7bbc6fdd062cbd0dc",
      reviewerId: "65277e2dccd85309a90adde1",
    },
  ],
  buyers: [],
  likedBy: [],
  reported: false,
  reportData: [],
  userData: {
    _id: "65277e2dccd85309a90adde1",
    username: "ikarus-anshuman",
    email: "anshuman.thakur@ikarus3d.com",
    accountInformation: {
      fullName: "Anshuman Thakur",
      country: "India",
      accountType: "3DP",
      gender: "male",
      dateOfBirth: null,
      showMatureContent: true,
    },
    displayInformation: {
      profilePicture: {
        pictureUrl: "https://source.unsplash.com/random",
        croppedPictureUrl:
          "https://imgs.search.brave.com/fL2ympGnFQZv3t2lxmFLfoF1Dorf89wgmz8lIwobE6M/rs:fit:500:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAyLzE3LzM0LzY3/LzM2MF9GXzIxNzM0/Njc4Ml83WHBDVHQ4/YkxOSnF2VkFhRFpK/d3Zaam0wZXBRbWo2/ai5qcGc",
      },
      coverPicture: {
        pictureUrl: null,
        croppedPictureUrl: null,
      },
      introductoryVideoUrl: null,
      description: null,
      skills: null,
      website: null,
    },
    socialMediaLinks: [],
    createdAt: "2023-10-16T05:27:50.232000",
    followersCount: 0,
    followingsCount: 0,
    isFollowing: false,
  },
  is_liked_by_user: false,
};

const Model = () => {
  const router = useRouter();
  const carouselContainer = useRef();
  const carouselRef = useRef();
  const { modelId } = router.query;
  const [model, setModel] = useState(dummyModel);
  const [user, setUser] = useState(dummyModel?.userData);
  const [recommendedModels, setRecommendedModels] = useState([]);
  const [liked, setLiked] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);


  //hover report
  // const [hoverReport,set]
  //-----


  console.log("Modal Data===>", modelId);
  console.log("Modal Data===>", model);

  const scrollLeft = () => {
    const carousel = carouselRef.current;
    const offsetWidth = carousel.offsetWidth;
    if (carousel.scrollLeft === 0) {
      return;
    }
    carousel.scrollBy({
      left: -offsetWidth,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    const carousel = carouselRef.current;
    const offsetWidth = carousel.offsetWidth;
    const maxScroll = carousel.scrollWidth - offsetWidth;

    if (carousel.scrollLeft >= maxScroll) {
      return;
    }
    carousel.scrollBy({
      left: offsetWidth,
      behavior: "smooth",
    });
  };

  const handleLike = () => {
    console.log("in like");
    axios
      .post(
        `${process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE}/api/v1/model/${modelId}/like?likeState=1`,
        {},
        { withCredentials: true }
      )
      .then((res) => {
        console.log("res", res);
        setModel((current) => {
          return { ...current, likes: current.likes + 1 };
        });
        setLiked(true);
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const handleDislike = () => {
    console.log("in dislike");
    axios
      .post(
        `${process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE}/api/v1/model/${modelId}/like?likeState=-1`,
        {},
        { withCredentials: true }
      )
      .then((res) => {
        console.log("res", res);
        setModel((current) => {
          return { ...current, likes: current.likes - 1 };
        });
        setLiked(false);
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const handleAddToCart = () => {
    axios
      .put(
        `${process.env.NEXT_PUBLIC_CART_AND_ORDER_SERVICE_URL}/api/v1/cart`,
        {
          itemId: modelId,
          itemType: "MODEL",
          quantity: 1,
        },
        { withCredentials: true }
      )
      .then((res) => {
        console.log("res", res);
      })
      .catch((err) => {
        console.log("err", err);
        if (err.response.status === 404) {
          axios
            .post(
              `${process.env.NEXT_PUBLIC_CART_AND_ORDER_SERVICE_URL}/api/v1/cart`,
              {
                itemId: modelId,
                itemType: "MODEL",
              },
              { withCredentials: true }
            )
            .then((res) => {
              console.log("res", res);
            })
            .catch((err) => {
              console.log("err", err);
            });
        }
      });
  };

  // useEffect(() => {
  //   if (modelId) {
  //     axios
  //       .get(
  //         `${process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE}/api/v1/model/${modelId}`,
  //         { withCredentials: true }
  //       )
  //       .then((res) => {
  //         setModel(res.data);
  //         setLiked(res?.data?.is_liked_by_user ? true : false);
  //         axios
  //           .get(
  //             `${process.env.NEXT_PUBLIC_USER_SERVICE_URL}/api/v1/user?userid=${res.data.userId}`
  //           )
  //           .then((res) => {
  //             console.log("res", res);
  //             setUser({
  //               fullName: res.data?.accountInformation?.fullName,
  //               username: res.data.username,
  //               profilePicture: res.data?.displayInformation?.profilePicture,
  //             });
  //           })
  //           .catch((err) => {
  //             console.log("err", err);
  //           });
  //       })
  //       .catch((err) => {
  //         console.log("err", err);
  //       });
  //     axios
  //       .get(`${process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE}/api/v1/all-models`, {
  //         withCredentials: true,
  //       })
  //       .then((res) => {
  //         console.log("res 111", res);
  //         setRecommendedModels(res.data);
  //       })
  //       .catch((err) => {
  //         console.log("err 111", err);
  //       });
  //   }
  //   const recMod = [
  //     {
  //       _id: "1",
  //       modelImage:
  //         "https://ucarecdn.com/ffd1a7fa-bb9d-4324-8d4b-91dee41ab4e3/",
  //       modelName: "name",
  //       username: "username",
  //       price: "10.00",
  //       NSFW: false,
  //     },
  //     {
  //       _id: "2",
  //       modelImage:
  //         "https://ucarecdn.com/ffd1a7fa-bb9d-4324-8d4b-91dee41ab4e3/",
  //       modelName: "name",
  //       username: "username",
  //       price: "10.00",
  //       NSFW: false,
  //     },
  //     {
  //       _id: "3",
  //       modelImage:
  //         "https://ucarecdn.com/ffd1a7fa-bb9d-4324-8d4b-91dee41ab4e3/",
  //       modelName: "name",
  //       username: "username",
  //       price: "10.00",
  //       NSFW: false,
  //     },
  //     {
  //       _id: "4",
  //       modelImage:
  //         "https://ucarecdn.com/ffd1a7fa-bb9d-4324-8d4b-91dee41ab4e3/",
  //       modelName: "name",
  //       username: "username",
  //       price: "10.00",
  //       NSFW: false,
  //     },
  //     {
  //       _id: "5",
  //       modelImage:
  //         "https://ucarecdn.com/ffd1a7fa-bb9d-4324-8d4b-91dee41ab4e3/",
  //       modelName: "name",
  //       username: "username",
  //       price: "10.00",
  //       NSFW: false,
  //     },
  //   ];
  //   // setRecommendedModels(recMod);
  // }, [modelId]);

  return (
    <>
      <ReactModal
        classNames={{
          modalContainer: "flex justify-center items-center",
        }}
        showCloseIcon={false}
        open={showReportModal}
        onClose={() => {
          console.log("close");
          setShowReportModal(false);
        }}
      >
        <ModelReportModal
          contentId={dummyModel._id}
          reportFor={"model"}
          closeModal={() => setShowReportModal(false)}
        />
      </ReactModal>
      {/*MasterParent*/}
      <div className="grid p-10 px-[60px] py-12 bg-white">
        <div className="grid grid-cols-[55%_1fr] gap-x-12 gap-y-6">
          {/*Left Sections*/}
          <div className="flex flex-col gap-16 justify-between w-full">
            {/*Image Display*/}
            <div className=" overflow-hidden rounded-[5px]">
              <div className="relative w-full aspect-[5/3] bg-gray-300">
                {!model.NSFW
                ?<Image
                  src={model?.coverImage ?? "/images/image20.webp"}
                  alt="Model Cover Image"
                  fill
                  className="object-cover object-center "
                />
                :<MatureContentPlaceholder />
                }
              </div>

              {model?.modelImages.length !== 0 && (
                <div className="grid grid-cols-[max-content_1fr_max-content] gap-2 w-full h-max">
                  <div
                    className="flex items-center justify-center cursor-pointer h-full w-full"
                    onClick={() => scrollLeft()}
                  >
                    <div
                      className={`bg-primary-purple-500 h-9 w-9 text-white shadow-xs rounded-full p-2`}
                    >
                      <div className="h-[18px] w-[18px] aspect-square">
                        <ChevronLeft />
                      </div>
                    </div>
                  </div>
                  <div className="grow overflow-hidden" ref={carouselContainer}>
                    <div
                      className="flex gap-2 grow overflow-x-scroll snap-x no-scrollbar"
                      ref={carouselRef}
                    >
                      {model?.modelImages &&
                        model?.modelImages.map((image) => (
                          <div
                            key={image.imageId}
                            style={{
                              width: carouselContainer.current
                                ? `calc(${
                                    (carouselContainer.current.offsetWidth -
                                      24) /
                                    4
                                  }px)`
                                : `0px`,
                            }}
                            className={`relative rounded-[5px] overflow-hidden min-w-fit aspect-[5/3] shrink-0 grow-0 snap-start`}
                          >
                            <Image
                              src={
                                image.croppedUrl
                                  ? image.croppedUrl
                                  : image.imageUrl
                              }
                              alt="Model Images"
                              fill
                              className="object-cover object-center rounded-[5px]"
                            />
                          </div>
                        ))}
                    </div>
                  </div>
                  <div
                    className="flex items-center justify-center cursor-pointer h-full w-full"
                    onClick={() => scrollRight()}
                  >
                    <div
                      className={`bg-primary-purple-500 h-9 w-9 text-white shadow-xs rounded-full p-2`}
                    >
                      <div className="h-[18px] w-[18px] aspect-square">
                        <ChevronRight />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/*Help,Comments,Reviews and Buyers area*/}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-[48px]">
                {/* <div className="flex flex-col"> */}
                <h4 className="text-[28px] leading-[38px] tracking-[-0.28px] font-semibold">
                  Comments
                </h4>
                <Comments
                  classNames={{
                    commentsContainer: "px-6 pt-[15px]",
                  }}
                  service="model"
                  pageSize={3}
                  repliesPageSize={3}
                  comments={model?.commentIds}
                  serviceInstanceId={model._id}
                />
                {/* </div> */}

                <ModelsRatingSection reviewData={model?.reviewData} />
              </div>
            </div>
          </div>

          {/*Right Section*/}
          <div className="flex flex-col gap-4 w-full">
            {/*Makers Details and Model Metadata*/}
            <div className="flex flex-col gap-12">
              {/*Model MetaData*/}
              <div className="flex flex-col gap-3">
                <div className="flex gap-2">
                  <span className="text-sm font-medium text-dark-neutral-700">
                    Category:
                  </span>
                  <span className="text-lg font-semibold text-blue-secondary-600">
                    {model?.categoryId.map((e) => {
                      <span
                        key={"Catagory_Key" + e.id}
                        className="text-blue-secondary-600 text-lg font-semibold"
                      >
                        {e.name}
                      </span>;
                    })}
                  </span>
                </div>
                <h1 className="text-headline-md font-bold text-dark-neutral-700">
                  {model?.modelName}
                </h1>
              </div>

              {/*Artist Details*/}
              <div className="flex items-center justify-start gap-11">
                <div className="flex items-center justify-center gap-5">
                  <div className="relative h-16 w-16 aspect-square rounded-full bg-gray-300">
                    <Image
                      src={
                        user?.displayInformation?.profilePicture
                          .croppedPictureUrl ||
                        user?.displayInformation?.profilePicture?.pictureUrl ||
                        user?.displayInformation?.profilePicture.pictureUrl ||
                        "/images/profile.jpg"
                      }
                      alt="User Profile Picture"
                      className="rounded-full object-cover object-center"
                      fill
                    />
                  </div>
                  <div className="flex flex-col items-start justify-center h-full">
                    <span className="text-xl font-semibold text-dark-neutral-700">
                      {user?.accountInformation?.fullName}
                    </span>
                    <span className="text-lg font-medium text-dark-neutral-50">
                      @{user?.username}
                    </span>
                  </div>
                </div>
                <div className="button-sm py-[6px] button-primary-border w-auto hover:cursor-pointer">
                  Follow
                  <span className="h-4 w-4 ml-[6px]">
                    <Plus />
                  </span>
                </div>
              </div>

              {/*Like, Share and Report Here*/}
              <div className="flex flex-col gap-6 justify-center">
                <hr className=" relative border-light-neutral-500" />
                <div className="flex items-center justify-between">
                  <div className="flex gap-3">
                    {/*Like Button*/}
                    <div className="gap-[6px] button-default w-auto button-md-1 hover:cursor-pointer">
                      <div className="h-[18px] w-[18px]">
                        <LikeIcon />
                      </div>
                      <div className="text-sm font-semibold">Likes</div>
                      <div className="text-sm text-dark-neutral-50 font-semibold">
                        {model?.likes}
                      </div>
                    </div>
                    {/* Share button */}
                    <div
                      className="gap-[6px] button-default w-auto button-md-1 hover:cursor-pointer"
                      onClick={() => setShowShareModal(true)}
                    >
                      <div className="h-[18px] w-[18px]">
                        <UploadIcon />
                      </div>
                      <div className="text-sm font-semibold">Share</div>
                    </div>
                  </div>

                  <div data-tooltip-html={<>Report this model</>} onClick={() => setShowReportModal(true)} className="button-default w-auto p-2 flex-center rounded hover:cursor-pointer">
                    <div className="h-4 w-4">
                      <ReportFlag />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-6 border-[1px] border-light-neutral-600 shadow-xs p-6 rounded-[5px]">
                <div className="flex items-center justify-start gap-6">
                  <span className="text-headline-sm font-bold text-dark-neutral-700">
                    ${model?.price}
                  </span>
                  <div className="bg-light-neutral-600 w-[1px] h-10"></div>
                  <span></span>
                </div>
                {/*Artist prefs*/}
                <div className="px-12 py-4 rounded-[5px] h-[60px] bg-light-neutral-50"></div>
                {/*Buyers Interests*/}
                <div className="grid grid-cols-2 gap-4 h-12 text-button-text-md font-semibold">
                  <div
                    onClick={handleAddToCart}
                    className="button-primary button-md-2 py-3 hover:cursor-pointer"
                  >
                    Add to Cart
                  </div>
                  <div className="button-default button-md-2 py-3 hover:cursor-pointer">
                    <span className="h-5 w-5 mr-[6px]">
                      <Heart />
                    </span>
                    Add to favourite
                  </div>
                </div>
              </div>
            </div>

            {/*DropDowns Section*/}
            <div className="flex flex-col gap-6">
              <div>
                <InformationDropdownContainer
                  droppable={true}
                  heading="Description"
                  icon="/SVG/Document_3.svg"
                  openDefault={true}
                >
                  <div
                    className="prose text-md prose-headings:m-0 space-x-0 space-y-0 whitespace-pre-wrap model_Description_DropDown_Inner_Rich_Text_Styling"
                    style={{ maxWidth: "100%" }}
                  >
                    {parse(DESCRIPTION_TEST_DATA)}
                    {/* {parse(model?.description ? model.description : "")} */}
                  </div>
                </InformationDropdownContainer>
              </div>
              <div>
                <InformationDropdownContainer
                  droppable={true}
                  heading="Advance Information"
                  icon="/SVG/Document_Star.svg"
                >
                  <div className="grid gap-8 text-[0.875rem]">
                    <div className="grid gap-4">
                      <div className="font-semibold">Printing Details</div>
                      <div className="prose prose-headings:m-0 space-x-0 space-y-0 whitespace-pre-wrap">
                        {parse(model?.printDetails ? model.printDetails : "")}
                      </div>
                    </div>
                    <div className="grid grid-cols-[max-content_1fr] gap-x-20 gap-y-4">
                      <div className="text-textGray">Material Type</div>
                      <div>
                        {model?.printMaterial ? model.printMaterial : "-"}
                      </div>
                      <div className="text-textGray">Material Quantity</div>
                      <div>
                        {model?.materialQuantity ? model.materialQuantity : "-"}
                      </div>
                      <div className="text-textGray">Model Dimension</div>
                      <div>
                        {model?.dimensions?.modelLength ||
                        model?.dimensions?.modelWidth ||
                        model?.dimensions?.modelHeight
                          ? `${
                              model?.dimensions?.modelLength
                                ? model.dimensions.modelLength
                                : 0
                            }(length) X ${
                              model?.dimensions?.modelWidth
                                ? model.dimensions.modelWidth
                                : 0
                            }(width) X ${
                              model?.dimensions?.modelHeight
                                ? model.dimensions.modelHeight
                                : 0
                            }(height)`
                          : "-"}
                      </div>
                      <div className="text-textGray">Maximum Scale</div>
                      <div>
                        {model?.scale?.maxScale ? model.scale.maxScale : "-"}
                      </div>
                      <div className="text-textGray">Minimum Scale</div>
                      <div>
                        {model?.scale?.minScale ? model.scale.minScale : "-"}
                      </div>
                      <div className="text-textGray">Time to print</div>
                      <div>
                        {model?.timetoPrint?.hours ||
                        model?.timetoPrint?.minutes
                          ? `${
                              model?.timetoPrint?.hours
                                ? model.timetoPrint.hours
                                : 0
                            } hr ${
                              model?.timetoPrint?.minutes
                                ? model.timetoPrint.minutes
                                : 0
                            } min`
                          : "-"}
                      </div>
                      <div className="text-textGray">Support Required</div>
                      <div>{model?.supportNeeded ? "yes" : "no"}</div>
                    </div>
                  </div>
                </InformationDropdownContainer>
              </div>
              <div>
                <InformationDropdownContainer
                  droppable={true}
                  heading="Files Includes"
                  icon="/SVG/Document_Star.svg"
                >
                  <div></div>
                </InformationDropdownContainer>
              </div>
              <div>
                <InformationDropdownContainer
                  droppable={true}
                  heading="Remixes"
                  icon="/SVG/Repeat.svg"
                >
                  <div className="grid grid-cols-3 gap-6">
                    {model?.remixes &&
                      model?.remixes.map((remix, index) => (
                        <div
                          key={index}
                          className="relative group aspect-square w-full rounded-[5px] overflow-hidden"
                        >
                          <Image
                            src={remix.imageUrl}
                            alt="Remix Image"
                            className="object-cover object-center rounded-[5px]"
                            fill
                          />
                          <a
                            target="_blank"
                            href={remix.siteUrl}
                            rel="noopener noreferrer"
                            className="absolute hidden group-hover:block top-2 right-2 bg-white h-8 w-8 p-2 rounded-[5px]"
                          >
                            <ArrowTopRightRectangle />
                          </a>
                        </div>
                      ))}
                  </div>
                </InformationDropdownContainer>
              </div>
            </div>
          </div>
        </div>
        {/*Footer Sections */}
        <div>

        </div>
      </div>
    </>
  );
};

export default Model;

/*
STUFF TO REFORM COMPLETELY


//----------------More optional Information here------------

<div className="flex flex-col rounded-[5px] border-[1px] border-light-neutral-600 overflow-hidden h-fit">
<div className="flex items-center justify-between gap-3 py-5 px-8">
  <div className="grow">
    <h6 className="text-headline-2xs font-semibold">
      Recommended Models
    </h6>
  </div>
  <span className="text-md font-medium text-primary-purple-500">
    view all
  </span>
</div>
<div
  className={`${
    recommendedModels && recommendedModels.length > 0
      ? "grid-rows-[1fr] py-6 px-8"
      : "grid-rows-[0fr]"
  } grid bg-light-neutral-50`}
>
  <div className="flex flex-col gap-6 overflow-hidden">
    {recommendedModels.map((recommendedModel) => (
      <div key={recommendedModel._id}>
        <RecommendedModelCard
          modelImage={recommendedModel.coverImage}
          modelName={recommendedModel.modelName}
          userImage={null}
          username={recommendedModel.username}
          price={recommendedModel.price}
          NSFW={recommendedModel.NSFW}
        />
      </div>
    ))}
  </div>
</div>
</div>

//----------------Tags fot Project------------

    <div className="flex flex-col items-start justify-center gap-6">
      <h2 className="text-headline-xs font-semibold text-dark-neutral-700">
        Tags for this project
      </h2>
      <div className="flex gap-3">
        {model?.tags &&
          model.tags.map((tag) => (
            <div
              key={tag._id}
              className="border-[1px] border-light-neutral-600 rounded-[100px] text-sm font-medium px-4 py-[0.625rem]"
            >
              {tag.label}
            </div>
          ))}
      </div>
    </div>

*/
