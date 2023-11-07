import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setOrder, setTierDetails } from "../../store/orderSlice";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import EmptyCart from "../../components/EmptyCart";
import BreadCrumbs from "../../components/Layouts/BreadCrumbs";
import ChevronDown from "../../icons/ChevronDown";
import OrdersEmpty from "../../icons/OrdersEmpty";
import { useRouter } from "next/router";
import Select from "react-select";
import Rating from "../../components/ratings-and-reviews/Rating";

function TimestampDisplay({ _timestamp }) {
  const timestamp = _timestamp;
  const date = new Date(timestamp);
  const options = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = date.toLocaleDateString(undefined, options);

  return <div>{formattedDate}</div>;
}

const EmptyPage = () => {
  return (
    <div className="flex flex-col gap-[35px] w-full">
      <div className="relative w-[376.744px] h-[311px] grow items-center justify-center ">
        {/* <Image src="/temp/EmptyMyOrders.svg" alt="Empty Orders" fill /> */}
        
    <OrdersEmpty/>
      </div>
      <div className="flex flex-col gap-[32px]">
        <span className="font-[500] text-headline-sm text-center">
          Nothing here. Start exploring
        </span>
        <button className="bg-primary-purple-500 text-white rounded-[4px] px-[12px] py-[8px] shadow-xs w-fit mx-auto">
          Explore Campaigns
        </button>
      </div>
    </div>
  );
};

const Order = () => {
  const dispatch = useDispatch();
  const orderDetails = useSelector((state) => state.order);
  const orders = orderDetails.orders;
  const tierDetails = orderDetails.tierDetails;
  const router = useRouter();
  const [resOrders, setResOrders] = useState([]);
  const [ratingValue, setRatingValue] = useState();

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_CART_SERVICE_URL}/api/v1/orders`, {
        withCredentials: true,
      })
      .then((result) => {
        setResOrders(result.data);
        console.log("OrderResult: ", result.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const dropDownYears = [{ value: 2023, label: 2023 }];

  const breadcrumbItems = [
    {
      title: "Home",
      to: "/home",
    },
    {
      title: "My Orders",
    },
  ];

  return (
    <div className="w-full h-full py-8 bg-light-neutral-50">
      <div className="pb-6 border-b-[1px] border-light-neutral-500 mx-[60px]">
        <BreadCrumbs items={breadcrumbItems} />
      </div>
      <div className="flex flex-col py-[48px] mx-[212px]">
        <div className="flex flex-col gap-[32px]">
          <span className="text-dark-neutral-700 text-headline-md font-[600]">
            Order Details
          </span>
          <div className="flex flex-col gap-[48px]">
            <div className="h-[42px] w-[148px]">
              <Select options={dropDownYears} placeholder={"Year:"} />
            </div>
            <div className="flex flex-col gap-[48px]">
              {resOrders?.length < 1 ? (
                <div className="mx-auto">
                  <EmptyPage />
                </div>
              ) : (
                resOrders?.map((order, orderIndex) => (
                  <div key={orderIndex} className="flex flex-col gap-[48px]">
                    <div className="flex flex-col gap-[24px]">
                      <div className="flex justify-between">
                        <div className="flex flex-col gap-[24px]">
                          <span className="text-dark-neutral-700 text-xl font-[500]">
                            <TimestampDisplay _timestamp={order.timeOfOrder} />
                          </span>
                          <div className="flex gap-[13px]">
                            <span className="text-dark-neutral-200 text-md font-[400]">
                              Order ID{" "}
                              <span className="text-dark-neutral-700 font-[500] text-md">
                                #{order.orderId}
                              </span>
                            </span>
                            <span className="bg-success-50 text-success-800 font-[500] text-sm px-[10px] h-[20px]">
                              {order.statusOfOrder}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-[12px] py-[2]">
                          <span className="text-dark-neutral-200 text-md font-[600] mt-[8px]">
                            Total
                            <span className="text-primary-purple-600 text-headline-xs font-[700]">
                              {" "}
                              ${order.orderValue}
                            </span>
                          </span>
                          <span className="text-dark-neutral-200 text-md font-[500]">
                            Download Invoice
                          </span>
                        </div>
                      </div>

                      <div className="">
                        <div className="flex flex-col gap-8">
                          <div className="flex flex-col w-full bg-white">
                            <div className="grid grid-cols-[40%_15%_15%_15%_15%] items-center py-4 px-6 w-full border-x-[1px] border-t-[1px] border-light-neutral-600 rounded-t-[10px]">
                              <div className="text-left text-sm font-[500] text-dark-neutral-50">
                                Name
                              </div>
                              <div className="text-left text-sm font-[500] text-dark-neutral-50">
                                Type
                              </div>
                              <div className="text-left text-sm font-[500] text-dark-neutral-50">
                                Price
                              </div>
                              <div className="text-left text-sm font-[500] text-dark-neutral-50">
                                Actions
                              </div>
                              <div className="text-left text-sm font-[500] text-dark-neutral-50">
                                Ratings and reviews
                              </div>
                            </div>
                            <div className="border-x-[1px] border-b-[1px] border-light-neutral-600 rounded-b-[10px]">
                              {order?.items?.map((item, index) => (
                                <div
                                  key={`order-${index}`}
                                  className="grid grid-cols-[40%_15%_15%_15%_15%] items-center p-6 border-t-[1px] border-light-neutral-600"
                                >
                                  <div className="grid grid-cols-[140px_1fr] gap-4 overflow-hidden">
                                    <div className="h-[100px] w-[140px] aspect-square rounded-[5px] overflow-hidden relative">
                                      {item.itemDp && (
                                        <Image
                                          src={item?.itemDp}
                                          alt=""
                                          className="object-cover object-center"
                                          fill
                                        />
                                      )}
                                    </div>
                                    <div className="flex flex-col justify-between items-start w-full max-w-full">
                                      <div className="text-dark-neutral-700 text-xl font-semibold line-clamp-2 truncate whitespace-normal">
                                        {item?.itemName}
                                      </div>
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
                                            src={item?.artistDp}
                                            alt=""
                                            className="object-cover object-center rounded-full"
                                            fill
                                          />
                                        </div>
                                        <span className="text-dark-neutral-700 text-sm">
                                          by {item?.artistName}
                                          {/* {userData?.[item.userId]?.username} */}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-left text-lg font-medium text-dark-neutral-200">
                                    {item?.itemType}
                                  </div>
                                  <div className="text-left text-lg font-medium text-dark-neutral-200">
                                    {/* ${itemsData?.[item.itemId]?.price} */}${" "}
                                    {item?.price}
                                  </div>
                                  <div className="text-left">
                                    <button
                                      onClick={() => {
                                        item.product_type === "MODEL"
                                          ? router.push(
                                              "/my-nest/purchases/models"
                                            )
                                          : router.push(
                                              "/my-nest/purchases/campaigns"
                                            );
                                      }}
                                      className="px-[12px] py-[6px] border-[1px] border-primary-purple-600 rounded-[4px] text-primary-purple-600"
                                    >
                                      View files
                                    </button>
                                  </div>
                                  <div className="text-left flex gap-[8px] justify-start">
                                    <Rating
                                      iconSize="m"
                                      enableUserInteraction={true}
                                      showOutOf={true}
                                      item_dp={item?.itemDp}
                                      item_name={item?.itemName}
                                      artist_dp={item?.artistDp}
                                      artist_name={item?.artistName}
                                      item_id={item?.itemId}
                                      item_type={item?.itemType}
                                      rating={item?.rating}
                                      campaign_id={item?.campaignId}
                                      review_id={item?.reviewId}
                                      cursor_type={"cursor-pointer"}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="border-[1px] border-light-neutral-600"></div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Order;
