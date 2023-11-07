import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { setCart } from '../store/cartSlice';
import { useDispatch, useSelector } from "react-redux";


const rewardData = [
  {
    rewards: [
      {
        item: "item1",
        quantity: "quantity1",
      },
    ]
  },
  {
    rewards: [
      {
        item: "itemffwrf1",
        quantity: "quantity1",
      },
      {
        item: "item2",
        quantity: "quantity2",
      },

    ],
  },
  {
    rewards: [
      {
        item: "item1",
        quantity: "quantity1",
      },

    ]
  }
];

const tiersData = [
  {
    level: 1,
    tierTitle: "tier tierTitle",
    currency: "USD",
    amount: 100,
    backers: 62,
    description:
      "desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc",
    rewards: [
      {
        item: "item1",
        quantity: "quantity1",
      },
      {
        item: "item2",
        quantity: "quantity2",
      },
      {
        item: "item3",
        quantity: "quantity3",
      },
    ],
  },
  {
    level: 2,
    tierTitle: "tier tierTitle",
    currency: "USD",
    amount: 100,
    backers: 62,
    description:
      "desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc",
    rewards: [
      {
        item: "item1",
        quantity: "quantity1",
      },
      {
        item: "item2",
        quantity: "quantity2",
      },
      {
        item: "item3",
        quantity: "quantity3",
      },
    ],
  },
  {
    level: 2,
    tierTitle: "tier tierTitle",
    currency: "USD",
    amount: 100,
    backers: 62,
    description:
      "desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc",
    rewards: [
      {
        item: "item1",
        quantity: "quantity1",
      },
      {
        item: "item2",
        quantity: "quantity2",
      },
      {
        item: "item3",
        quantity: "quantity3",
      },
    ],
  },
  {
    level: 2,
    tierTitle: "tier tierTitle",
    currency: "USD",
    amount: 100,
    backers: 62,
    description:
      "desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc",
    rewards: [
      {
        item: "item1",
        quantity: "quantity1",
      },
      {
        item: "item2",
        quantity: "quantity2",
      },
      {
        item: "item3",
        quantity: "quantity3",
      },
    ],
  },
  {
    level: 2,
    tierTitle: "tier tierTitle",
    currency: "USD",
    amount: 100,
    backers: 62,
    description:
      "desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc",
    rewards: [
      {
        item: "item1",
        quantity: "quantity1",
      },
      {
        item: "item2",
        quantity: "quantity2",
      },
      {
        item: "item3",
        quantity: "quantity3",
      },
    ],
  },
  {
    level: 2,
    tierTitle: "tier tierTitle",
    currency: "USD",
    amount: 100,
    backers: 62,
    description:
      "desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc",
    rewards: [
      {
        item: "item1item1item1item1item1item1item1item1item1item1item1item1item1item1item1item1item1item1item1item1item1item1item1item1item1item1item1item1",
        quantity: "quantity1",
      },
      {
        item: "item2",
        quantity: "quantity2",
      },
      {
        item: "item3",
        quantity: "quantity3",
      },
    ],
  },
  {
    level: 2,
    tierTitle: "tier tierTitle",
    currency: "USD",
    amount: 100,
    backers: 62,
    description:
      "desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc desc",
    rewards: [
      {
        item: "item1",
        quantity: "quantity1",
      },
      {
        item: "item2",
        quantity: "quantity2",
      },
      {
        item: "item3",
        quantity: "quantity3",
      },
    ],
  },
];

const CampaignTiers = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [tiers, setTiers] = useState(props.tiersData);
  const cartDetails = useSelector((state) => state.cart.cart);
  const [bonusInputValues, setBonusInputValues] = useState({});
  const getCartSize = async () => {
    // const cookies = req.headers.cookie;
    const config = {
      withCredentials: true,
    };
    const responseCart = await axios.get(
      `${process.env.NEXT_PUBLIC_CART_SERVICE}/cart`, config
    );
    const sizeOfCart = responseCart.data.items.length
    props.setTierCartData(sizeOfCart);
    console.log(dispatch(setCart(...cartDetails, responseCart.data.items)));
  }


  console.log("sizeofCart", props.tierCartData);
  const handleCart = (tierId, index) => {
    console.log("tierId", tierId);
    axios.post(`${process.env.NEXT_PUBLIC_CART_SERVICE}/cart/${tierId}`, "",
      {
        withCredentials: true,
      }
    )
      .then(response => {
        // setUploadedImagesOnServer(response.data.campaignAssets.campaignImages);
        console.log("result in metadata page", response.data);
        document.getElementById("addCart" + index).classList.add("hidden");
        document.getElementById("addedCart" + index).classList.remove("hidden");
        getCartSize();
        console.log("tierDatacart", props.tierCartData);
        // router.push("/cart");
      })
      .catch(err => {
        // Handle errors
        console.error(err);
      });


  }

  console.log("bonusInputValues", props.tiersData[0]);
  console.log("rEWARDSdATA", rewardData)



  return (
    <div className="bg-white w-full rounded-sm px-14 py-10 grid grid-cols-3 auto-rows-fr gap-x-2 gap-y-14">
      {props.tiersData.map((tier, tierIndex) => {
        return (
          <div
            key={`tier-${tier.tierId}`}
            className="m-auto w-full h-full max-w-[350px] font-medium"
          >
            <div className="mb-2 w-max text-primary-brand text-[24px]">
              {tier.tierData.tierTitle}
            </div>
            <div className="flex flex-col w-full border-[1px] border-accent1 bg-accent2 rounded-sm">
              <div className="flex justify-between items-center px-4 py-3 bg-white font-medium">
                <div className="flex flex-col text-secondary-text-icons-button-text">
                  <p className="text-[20px]">Pledge amount</p>
                  <p className="text-[14px]">
                    <span className="text-black">{tier.tierData.numberOfBackers}</span>
                    &nbsp;backers
                  </p>
                </div>
                <div className="text-primary-brand text-[14px]">
                  {tier.tierData.currency}
                  &nbsp;{tier.tierData.amount}
                </div>
              </div>
              <div className=" bg-accent1">
                <img className="object-cover w-full h-[200px]" src={tier.tierData.tierAsset.location} alt="" />
              </div>

              <div className="px-4">
                <div className=" w-max rounded-[30px] px-5 font-medium bg-accent1 text-secondary-text-icons-button-text my-3 text-[12px]">
                  Rewards
                </div>
                <div className="flex flex-col">
                  {/* {rewardData.map((rewardList, rewardIndex) =>
                    rewardList.rewards.map((reward, rewardIndex) =>
                      <p
                        key={`${tierIndex}-reward-${rewardIndex}`}
                        className="flex justify-between"
                      >
                        <span className="max-w-[70%] break-words">
                          {reward.item}
                        </span>
                        <span className="max-w-[25%] text-ellipsis overflow-hidden">
                          X {reward.quantity}
                        </span>
                      </p>)
                  )} */}
                  {/* {rewardData.rewards.map((reward, rewardIndex) => (
                    <p
                      key={`${tierIndex}-reward-${rewardIndex}`}
                      className="flex justify-between"
                    >
                      <span className="max-w-[70%] break-words">
                        {reward.item}
                      </span>
                      <span className="max-w-[25%] text-ellipsis overflow-hidden">
                        X {reward.quantity}
                      </span>
                    </p>
                  ))} */}
                </div>
              </div>
              <div className="px-4">
                <div className=" w-max rounded-[30px] px-5 font-medium bg-accent1 text-secondary-text-icons-button-text my-3 text-[12px]">
                  Description
                </div>
                <div>{tier.tierData.description}</div>
              </div>
              <div className="px-4">
                <div className=" w-max rounded-[30px] px-5 font-medium bg-accent1 text-secondary-text-icons-button-text my-3 text-[12px]">
                  Bonus Support (optional)
                </div>
                <div className="flex justify-between items-center">
                  {/* TODO add dropdown for currency */}
                  <input
                    type="number"
                    placeholder="Support this Campaign"
                    id={`tier-${tierIndex}-bonusInput`}
                    className="w-full h-[2rem] mr-2 rounded-sm border-[1.5px] px-2 py-1 focus:ring-1 focus:ring-primary-brand outline-none"
                    onChange={(event) =>
                      setBonusInputValues({
                        ...bonusInputValues,
                        [tierIndex]: parseInt(event.target.value),
                      })
                    }
                  />
                  <span className="font-medium text-[14px] text-primary-brand">
                    {tier.tierData.currency}&nbsp;
                    {bonusInputValues?.[tierIndex] &&
                      bonusInputValues[`${tierIndex}`] !== "" &&
                      !isNaN(bonusInputValues[`${tierIndex}`])
                      ? bonusInputValues[`${tierIndex}`]
                      : 0}
                  </span>
                </div>
              </div>
              <div className="px-4 py-3 w-full">
                <div className="flex gap-4">
                  <button className="font-medium text-sm bg-primary-brand text-white w-full h-[2rem] rounded-sm" onClick={() => handleCart(tier.tierId, tierIndex)}>
                    <span id={"addCart" + tierIndex} className="">
                      Add to cart
                    </span>
                    <span id={"addedCart" + tierIndex} className="hidden">
                      Added To Cart
                    </span>
                  </button>
                  <button className="font-medium text-sm bg-primary-brand text-white w-full h-[2rem] rounded-sm">
                    Buy Now
                  </button>
                </div>

              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CampaignTiers;
