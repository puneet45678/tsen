import React, { useEffect, useId, useState } from "react";
import axios from "axios";
import BreadCrumbs from "../components/Layouts/BreadCrumbs";
import Image from "next/image";
import { useSelector } from "react-redux";
import Select from "react-select";
import { singleSelect } from "../styles/ReactSelectStyles";

const Cart = () => {
  let subTotal = 0;
  const user = useSelector((state) => state.user);
  const [cartItems, setCartItems] = useState([]);
  const [saveForLaterItems, setSaveForLaterItems] = useState([]);
  const [showCheckoutPage, setShowCheckoutPage] = useState(false);
  const [itemsData, setItemsData] = useState({});
  const [userData, setUserData] = useState([]);

  const breadcrumbItems = [
    {
      title: "Home",
      to: "/home",
    },
    {
      title: "My Cart",
    },
  ];

  const breadcrumbItemsOnCheckoutPage = [
    {
      title: "Home",
      to: "/home",
    },
    {
      title: "My Cart",
      onClick: () => setShowCheckoutPage(false),
    },
    {
      title: "Checkout",
    },
  ];

  const handleSaveForLaterClick = (itemId, item) => {
    axios
      .put(
        `${process.env.NEXT_PUBLIC_CART_AND_ORDER_SERVICE_URL}/api/v1/cart/save-for-later/${itemId}`,
        {},
        { withCredentials: true }
      )
      .then((res) => {
        console.log("res", res);
        setCartItems((current) =>
          current.filter((item) => item.itemId !== itemId)
        );
        setSaveForLaterItems((current) => {
          return [...current, item];
        });
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const handleDeleteFromCartClick = (itemId) => {
    axios
      .delete(
        `${process.env.NEXT_PUBLIC_CART_AND_ORDER_SERVICE_URL}/api/v1/cart/${itemId}`,
        { withCredentials: true }
      )
      .then((res) => {
        console.log("res", res);
        setCartItems((current) =>
          current.filter((item) => item.itemId !== itemId)
        );
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const handleMoveToCartClick = (itemId, item) => {
    axios
      .post(
        `${process.env.NEXT_PUBLIC_CART_AND_ORDER_SERVICE_URL}/api/v1/cart/move-to-cart/${itemId}`,
        {},
        { withCredentials: true }
      )
      .then((res) => {
        console.log("res", res);
        setSaveForLaterItems((current) =>
          current.filter((item) => item.itemId !== itemId)
        );
        setCartItems((current) => {
          return [...current, item];
        });
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const handleDeleteFromSavedForLaterClick = (itemId) => {
    axios
      .delete(
        `${process.env.NEXT_PUBLIC_CART_AND_ORDER_SERVICE_URL}/api/v1/cart/save-for-later/${itemId}`,
        { withCredentials: true }
      )
      .then((res) => {
        console.log("res", res);
        setSaveForLaterItems((current) =>
          current.filter((item) => item.itemId !== itemId)
        );
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_CART_AND_ORDER_SERVICE_URL}/api/v1/cart?page_size=8&page_number=1`,
        { withCredentials: true }
      )
      .then((res) => {
        console.log("res", res);
        setCartItems(res.data.items);
        for (let item of res.data.items) {
          if (item.itemType === "MODEL" && !itemsData?.[item.itemId]) {
            axios
              .get(
                `${process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE}/api/v1/model/${item.itemId}`,
                { withCredentials: true }
              )
              .then((res) => {
                console.log("res", res);
                setItemsData((current) => {
                  return { ...current, [item.itemId]: res.data };
                });
                if (!userData?.[res.data.userId]) {
                  axios
                    .get(
                      `${process.env.NEXT_PUBLIC_USER_SERVICE_URL}/api/v1/user?userid=${res.data.userId}`
                    )
                    .then((res) => {
                      console.log("res", res);
                      setUserData((current) => {
                        return {
                          ...current,
                          [res.data.userId]: {
                            fullName: res.data?.accountInformation?.fullName,
                            username: res.data.username,
                            profilePicture:
                              res.data?.displayInformation?.profilePicture,
                          },
                        };
                      });
                    })
                    .catch((err) => {
                      console.log("err", err);
                    });
                }
              })
              .catch((err) => {
                console.log("err", err);
              });
          }
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  }, []);

  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_CART_AND_ORDER_SERVICE_URL}/api/v1/cart/save-for-later?page_size=8&page_number=1`,
        { withCredentials: true }
      )
      .then((res) => {
        console.log("res", res);
        setSaveForLaterItems(res.data.items);
        for (let item of res.data.items) {
          if (item.itemType === "MODEL" && !itemsData?.[item.itemId]) {
            axios
              .get(
                `${process.env.NEXT_PUBLIC_CAMPAIGN_SERVICE}/api/v1/model/${item.itemId}`,
                { withCredentials: true }
              )
              .then((res) => {
                console.log("res", res);
                setItemsData((current) => {
                  return { ...current, [item.itemId]: res.data };
                });
                if (!userData?.[res.data.userId]) {
                  axios
                    .get(
                      `${process.env.NEXT_PUBLIC_USER_SERVICE_URL}/api/v1/user?userid=${res.data.userId}`
                    )
                    .then((res) => {
                      console.log("res", res);
                      setUserData((current) => {
                        return {
                          ...current,
                          [res.data.userId]: {
                            fullName: res.data?.accountInformation?.fullName,
                            username: res.data.username,
                            profilePicture:
                              res.data?.displayInformation?.profilePicture,
                          },
                        };
                      });
                    })
                    .catch((err) => {
                      console.log("err", err);
                    });
                }
              })
              .catch((err) => {
                console.log("err", err);
              });
          }
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  }, []);

  return (
    <div className="w-full h-full bg-light-neutral-50 py-8">
      <div className="pb-6 border-b-[1px] border-light-neutral-500 mx-[60px]">
        {showCheckoutPage ? (
          <BreadCrumbs items={breadcrumbItemsOnCheckoutPage} />
        ) : (
          <BreadCrumbs items={breadcrumbItems} />
        )}
      </div>
      <div className="flex gap-6 mx-[212px] py-12">
        <div className="flex flex-col gap-16 grow">
          {showCheckoutPage ? (
            <div className="flex flex-col gap-8">
              <h1 className="text-headline-md font-semibold">Checkout</h1>
              <div className="flex flex-col w-full bg-white">
                <div className="grid grid-cols-[40%_15%_15%_15%_15%] items-center py-4 px-6 w-full border-x-[1px] border-t-[1px] border-light-neutral-600 rounded-t-[10px]">
                  <div className="">Name</div>
                  <div className="text-center">Type</div>
                  <div className="text-center">Price</div>
                </div>
                <div className="border-x-[1px] border-b-[1px] border-light-neutral-600 rounded-b-[10px]">
                  {cartItems &&
                    cartItems.map((item, index) => (
                      <div
                        key={`cart-${index}`}
                        className="grid grid-cols-[40%_15%_15%_15%_15%] items-center p-6 border-t-[1px] border-light-neutral-600"
                      >
                        <div className="grid grid-cols-[100px_1fr] gap-4 overflow-hidden">
                          <div className="h-[100px] w-[100px] aspect-square rounded-[5px] overflow-hidden relative">
                            {itemsData?.[item.itemId]?.coverImage && (
                              <Image
                                src={itemsData[item.itemId].coverImage}
                                alt=""
                                className="object-cover object-center"
                                fill
                              />
                            )}
                          </div>
                          <div className="flex flex-col justify-between items-start w-full max-w-full">
                            <div className="text-dark-neutral-700 text-xl font-semibold line-clamp-2 truncate whitespace-normal">
                              {itemsData?.[item.itemId]?.modelName}
                            </div>
                            <div className="flex items-center justify-start gap-3">
                              <div className="w-8 h-8 aspect-square rounded-full relative">
                                {userData?.[item.userId]?.profilePicture
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
                                )}
                              </div>
                              <span className="text-dark-neutral-700 text-sm">
                                by {userData?.[item.userId]?.username}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-center text-lg font-medium text-dark-neutral-200">
                          {item.itemType}
                        </div>
                        <div className="text-center text-lg font-medium text-dark-neutral-200">
                          ${itemsData?.[item.itemId]?.price}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-8">
                <h1 className="text-headline-md font-semibold">My Cart</h1>
                <div className="flex flex-col w-full bg-white">
                  <div className="grid grid-cols-[40%_15%_15%_15%_15%] items-center py-4 px-6 w-full border-x-[1px] border-t-[1px] border-light-neutral-600 rounded-t-[10px]">
                    <div className="">Name</div>
                    <div className="text-center">Type</div>
                    <div className="text-center">Price</div>
                  </div>
                  <div className="border-x-[1px] border-b-[1px] border-light-neutral-600 rounded-b-[10px]">
                    {cartItems &&
                      cartItems.map((item, index) => (
                        <div
                          key={`cart-${index}-${item.itemId}`}
                          className="grid grid-cols-[40%_15%_15%_15%_15%] items-center p-6 border-t-[1px] border-light-neutral-600"
                        >
                          <div className="grid grid-cols-[100px_1fr] gap-4 overflow-hidden">
                            <div className="h-[100px] w-[100px] aspect-square rounded-[5px] overflow-hidden relative">
                              {itemsData?.[item.itemId]?.coverImage && (
                                <Image
                                  src={itemsData[item.itemId].coverImage}
                                  alt=""
                                  className="object-cover object-center"
                                  fill
                                />
                              )}
                            </div>
                            <div className="flex flex-col justify-between items-start w-full max-w-full">
                              <div className="text-dark-neutral-700 text-xl font-semibold line-clamp-2 truncate whitespace-normal">
                                {itemsData?.[item.itemId]?.modelName}
                              </div>
                              <div className="flex items-center justify-start gap-3">
                                <div className="w-8 h-8 aspect-square rounded-full relative">
                                  {userData?.[item.userId]?.profilePicture
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
                                  )}
                                </div>
                                <span className="text-dark-neutral-700 text-sm">
                                  by {userData?.[item.userId]?.username}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-center text-lg font-medium text-dark-neutral-200">
                            {item.itemType}
                          </div>
                          <div className="text-center text-lg font-medium text-dark-neutral-200">
                            ${itemsData?.[item.itemId]?.price}
                          </div>
                          <div
                            className="text-center text-lg font-semibold text-primary-purple-500"
                            onClick={() =>
                              handleSaveForLaterClick(item.itemId, item)
                            }
                          >
                            Save for later
                          </div>
                          <div
                            className="flex items-center justify-center"
                            onClick={() =>
                              handleDeleteFromCartClick(item.itemId)
                            }
                          >
                            <div className="flex items-center justify-center w-[42px] h-[42px] border-[1px] border-light-neutral-600 rounded-[5px] shadow-xs">
                              <Image
                                src="/SVG/Trash_Alt.svg"
                                alt="Trash Icon"
                                height={20}
                                width={20}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-8">
                <h1 className="text-headline-md font-semibold">
                  Save for later items (
                  {saveForLaterItems ? saveForLaterItems.length : 0})
                </h1>
                <div className="flex flex-col w-full bg-white">
                  <div className="grid grid-cols-[40%_15%_15%_15%_15%] items-center py-4 px-6 w-full border-x-[1px] border-t-[1px] border-light-neutral-600 rounded-t-[10px]">
                    <div className="">Name</div>
                    <div className="text-center">Type</div>
                    <div className="text-center">Price</div>
                  </div>
                  <div className="border-x-[1px] border-b-[1px] border-light-neutral-600 rounded-b-[10px]">
                    {saveForLaterItems &&
                      saveForLaterItems.map((item, index) => (
                        <div
                          key={`cart-${index}-${item.itemId}`}
                          className="grid grid-cols-[40%_15%_15%_15%_15%] items-center p-6 border-t-[1px] border-light-neutral-600"
                        >
                          <div className="grid grid-cols-[100px_1fr] gap-4 overflow-hidden">
                            <div className="h-[100px] w-[100px] aspect-square rounded-[5px] overflow-hidden relative">
                              {itemsData?.[item.itemId]?.coverImage && (
                                <Image
                                  src={itemsData[item.itemId].coverImage}
                                  alt=""
                                  className="object-cover object-center"
                                  fill
                                />
                              )}
                            </div>
                            <div className="flex flex-col justify-between items-start w-full max-w-full">
                              <div className="text-dark-neutral-700 text-xl font-semibold line-clamp-2 truncate whitespace-normal">
                                {itemsData?.[item.itemId]?.modelName}
                              </div>
                              <div className="flex items-center justify-start gap-3">
                                <div className="w-8 h-8 aspect-square rounded-full relative">
                                  {userData?.[item.userId]?.profilePicture
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
                                  )}
                                </div>
                                <span className="text-dark-neutral-700 text-sm">
                                  by {userData?.[item.userId]?.username}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-center text-lg font-medium text-dark-neutral-200">
                            {item.itemType}
                          </div>
                          <div className="text-center text-lg font-medium text-dark-neutral-200">
                            ${itemsData?.[item.itemId]?.price}
                          </div>
                          <div
                            className="text-center text-lg font-semibold text-primary-purple-500"
                            onClick={() =>
                              handleMoveToCartClick(item.itemId, item)
                            }
                          >
                            Move to cart
                          </div>
                          <div
                            className="flex items-center justify-center"
                            onClick={() =>
                              handleDeleteFromSavedForLaterClick(item.itemId)
                            }
                          >
                            <div className="flex items-center justify-center w-[42px] h-[42px] border-[1px] border-light-neutral-600 rounded-[5px] shadow-xs">
                              <Image
                                src="/SVG/Trash_Alt.svg"
                                alt="Trash Icon"
                                height={20}
                                width={20}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        <div className="flex flex-col bg-white h-fit">
          <div className="text-headline-xs font-semibold p-6 border-x-[1px] border-t-[1px] border-light-neutral-600 rounded-t-[5px]">
            {showCheckoutPage ? "Pay with" : "Cart total"}
          </div>
          <div className="flex flex-col gap-12 border-[1px] border-light-neutral-600 rounded-b-[5px] p-6">
            <div className="flex flex-col gap-6">
              {showCheckoutPage && (
                <>
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-[6px]">
                      <span className="text-sm font-medium text-dark-neutral-700">
                        Email Id
                      </span>
                      <input
                        type="text"
                        value={user.email}
                        className="flex items-center justify-start border-[1px] border-light-neutral-700 bg-light-neutral-50 shadow-xs rounded-[5px] text-sm font-medium text-light-neutral-900 h-12 px-4"
                        disabled
                      />
                    </div>
                    <div className="flex flex-col gap-[6px]">
                      <span className="text-sm font-medium text-dark-neutral-700">
                        Country
                      </span>
                      <Select
                        value={user?.accountInformation?.country}
                        styles={singleSelect}
                        isDisabled={true}
                        placeholder="Country"
                      />
                    </div>
                  </div>
                  <div className="h-0 border-[1px] border-light-neutral-600"></div>
                </>
              )}

              <div className="flex flex-col gap-4">
                <div className="flex justify-between">
                  <span className="text-dark-neutral-50 text-lg font-semibold">
                    Original price
                  </span>
                  <span className="text-dark-neutral-700 text-lg font-semibold">
                    $
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-neutral-50 text-lg font-semibold">
                    Discount
                  </span>
                  <span className="text-error-600 text-lg font-semibold">
                    -
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-neutral-50 text-lg font-semibold">
                    Taxes
                  </span>
                  <span className="text-blue-secondary-600 text-lg font-semibold">
                    +
                  </span>
                </div>
                <div className="flex justify-between text-dark-neutral-700">
                  <span className="text-xl font-semibold">Total</span>
                  <span className="text-xl font-semibold">$</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {showCheckoutPage ? (
                <>
                  <div className="flex items-center justify-center h-11 border-[1px] border-light-neutral-600 shadow-xs text-button-text-md font-semibold text-dark-neutral-700 rounded-[5px] w-[385px]">
                    <span>Pay with</span>
                    <div></div>
                  </div>
                  <div className="flex items-center justify-center h-11 border-[1px] border-light-neutral-600 shadow-xs text-button-text-md font-semibold text-dark-neutral-700 rounded-[5px] w-[385px]">
                    <span>Pay with debit/ credit card</span>
                    <div></div>
                  </div>
                </>
              ) : (
                <button
                  className="flex items-center justify-center h-11 bg-primary-purple-500 shadow-xs text-button-text-md font-semibold text-white rounded-[5px] w-[385px]"
                  onClick={() => setShowCheckoutPage(true)}
                >
                  Proceed to checkout
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
