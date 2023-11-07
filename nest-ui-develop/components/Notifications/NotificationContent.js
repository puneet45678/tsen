import { useState, useRef, useEffect } from "react";
import { NotificationFeed } from "react-activity-feed";
import NotificationGroup from "./NotificationGroup";
import { useStreamContext, useFeedContext } from "react-activity-feed";
import Link from "next/link";
import LoadingIndicator from "../LoadingIndicator";
import Skeleton from "react-loading-skeleton";
import { InfiniteScrollPaginator } from "react-activity-feed";
import { getUserId } from "supertokens-auth-react/recipe/session";
import { StreamClient } from "getstream";
import axios from "axios";
import CommentNotification from "./CommentNotification";
import FollowNotification from "./FollowNotification";
import LikeNotification from "./LikeNotification";
import MarketingNotification from "./MarketingNotification";
import EmptyNotificationBell from "../../icons/EmptyNotificationBell";
import NotifyEmpty from "../../icons/NotifyEmpty.svg";
import Image from "next/image";
import FurtherContentRightArrow from "../../icons/FurtherContentRightArrow";
import LikedPortfolioProject from "./LikedPortfolioProject";
import YourCampaignPublished from "./YourCampaignPublished";
import YourModelApproved from "./YourModelApproved";
import LikedYourCampaign from "./LikedYourCampaign";
import LikedYourModel from "./LikedYourModel";
import PreMarketingSignup from "./PreMarketingSignup";
import YourCampaignEnded from "./YourCampaignEnded";
import YourModelRejected from "./YourModelRejected";
import YourCampaignApproved from "./YourCampaignApproved";

const APP_ID = "1250820";
const API_KEY = "6smvj34vkz4d";

function FeedPlaceholder(props) {
  return (
    <div className="flex min-h-[calc(100vh-210px)]">
      <div className="flex flex-col gap-4 m-auto">
        <Image
          src={NotifyEmpty}
          alt="No Notifications to display!"
          width={150}
          height={150}
        />
        <span className="mx-auto my-auto">No Notifications</span>
      </div>
    </div>
  );
}

function NotificationGroupFromBackend({
  activityGroup,
  notificationSectionClicked,
}) {
  // console.log("Inside NotificationGroup");
  const feed = useFeedContext();
  const [userId, setUserId] = useState("");
  const notificationContainerRef = useRef();
  const [client, setClient] = useState(null);
  const [getstreamUserToken, setGetstreamUserToken] = useState();
  const [userNotifications, setUserNotifications] = useState([]);

  const activities = activityGroup?.activities;
  // console.log("Groupactivities: ",activityGroup);

  // const { user, client } = useStreamContext();

  async function init() {
    if (getstreamUserToken !== undefined && getstreamUserToken !== null) {
      const client = new StreamClient(API_KEY, getstreamUserToken, APP_ID);
      setClient(client);
    }
  }

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await getUserId();
        setUserId(id);
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };

    fetchUserId();
    // stop event propagation on links
    if(userId !== undefined && userId !== null) {
      axios
      .get(`${process.env.NEXT_PUBLIC_USER_SERVICE_URL}/api/v1/notification/token`, {
        withCredentials: true,
      })
      .then((response) => {
        setGetstreamUserToken(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
    }
 

    if (!notificationContainerRef.current) return;

    const anchorTags = notificationContainerRef.current.querySelectorAll("a");

    anchorTags.forEach((element) => {
      element.addEventListener("click", (e) => e.stopPropagation());
    });
    init();
    return () =>
      anchorTags.forEach((element) => {
        element.addEventListener("click", (e) => e.stopPropagation());
      });
  }, [userId]);

  useEffect(() => {
    let notifFeed;
    
    if(getstreamUserToken !== undefined &&
      getstreamUserToken !== null &&
      userId !== undefined &&
      userId !== null &&
      getstreamUserToken !== ""){
         notifFeed = client?.feed("notification", userId);
        
      }
   

    // notifFeed?.subscribe((data) => {
    //   if (data.new.length) {
    //     feed.refresh();
    //   }
    // });
    return () => notifFeed?.unsubscribe();
    
  }, [userId]);

  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_NOTIFICATION_SERVICE}/admin_panel/api/v1/notifications/activities`,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log("USERnotifiActivities: ", response.data);
        setUserNotifications(response.data);
      })
      .catch((error) => {
        console.error("error:", error);
      });
  }, []);

  return (
    <>
      {/* {console.log("insideContetn")} */}
      <div ref={notificationContainerRef}>
        {/* {activityGroup.verb === "like" && (
        <LikeNotification likedActivities={activities} />
      )}
      {activityGroup.verb === "follow" && (
        <FollowNotification followActivities={activities} />
      )}
      {activityGroup.verb === "comment" && (
        <CommentNotification commentActivities={activities} />
      )}
      {activityGroup.verb === "marketing" && (
        <MarketingNotification marketingActivities={activities} />
      )} */}

        {notificationSectionClicked === "All" ? (
          <>
            {userNotifications.length > 0 &&
            userNotifications !== undefined &&
            userNotifications !== null ? (
              <>
                {userNotifications.map((userNotificationsData, index) => (
                  <div key={index}>
                    {console.log("DataNoti: ", userNotificationsData)}
                    {userNotificationsData?.activities.map(
                      (notifications, index) => (
                        <div key={index}>
                          {notifications.verb === "like" ? (
                            <LikeNotification likedActivities={notifications} />
                          ) : notifications.verb === "follow" ? (
                            <FollowNotification
                              followActivities={notifications}
                            />
                          ) : notifications.verb === "comment" ? (
                            <CommentNotification
                              commentActivities={notifications}
                            />
                          ) : notifications.verb === "marketing" ? (
                            <MarketingNotification
                              marketingActivities={notifications}
                            />
                          ) :notifications.verb==="liked_your_portfolio_project"?(
                            <LikedPortfolioProject
                            liked_portfolio_project_activities={notifications}
                            />
                          ) : notifications.verb==="your_campaign_published"?(
                            <YourCampaignPublished
                            your_campaign_published_activities={notifications}
                            />
                          ) : notifications.verb==="your_model_approved"?(
                            <YourModelApproved
                            your_model_approved_activities={notifications}
                            />
                          ) : notifications.verb==="liked_your_campaign"?(
                            <LikedYourCampaign
                            liked_campaign_activities={notifications}
                            />
                          ) : notifications.verb==="liked_your_model"?(
                            <LikedYourModel
                            liked_model_activities={notifications}
                            />
                          ) : notifications.verb==="premarket_signup_your_campaign"?(
                            <PreMarketingSignup
                            premarketing_signup_campaigns={notifications}
                            />
                          ) : notifications.verb==="your_campaign_ended"?(
                            <YourCampaignEnded
                            your_campaign_ended_activities={notifications}
                            />
                          ): notifications.verb==="your_model_rejected"?(
                            <YourModelRejected
                            your_model_rejected_activities={notifications}
                            />
                          ) : notifications.verb==="your_campaign_approved"?(
                            <YourCampaignApproved
                            your_campaign_approved_activities={notifications}
                            />
                          ) :null}
                        </div>
                      )
                    )}
                  </div>
                ))}
              </>
            ) : (
              <FeedPlaceholder />
            )}
          </>
        ) : notificationSectionClicked === "Inbox" ? (
          <>
         { userNotifications.length > 0 &&
            userNotifications !== undefined &&
            userNotifications !== null?(
            <>
             {userNotifications.map((userNotificationsData, index) => (
              <div key={index}>
                {console.log("DataNoti: ", userNotificationsData)}
                {userNotificationsData?.activities.map(
                  (notifications, index) => (
                    <div key={index}>
                      {notifications.verb === "like" ? (
                        <LikeNotification likedActivities={notifications} />
                      ) : <FeedPlaceholder />}
                    </div>
                  )
                )}
              </div>
            ))}
            </>):<FeedPlaceholder />}
          
           
          </>
        ) : (
          <>
          {userNotifications.length > 0 &&
            userNotifications !== undefined &&
            userNotifications !== null?(
            <>
             {userNotifications.map((userNotificationsData, index) => (
              <div key={index}>
                {console.log("DataNoti: ", userNotificationsData)}
                {userNotificationsData?.activities.map(
                  (notifications, index) => (
                    <div key={index}>
                      {notifications.verb === "marketing" ? (
                        <MarketingNotification
                          marketingActivities={notifications}
                        />
                      ) : <FeedPlaceholder />}
                    </div>
                  )
                )}
              </div>
            ))}
            </>):<FeedPlaceholder />}
           
          </>
        )}
      </div>
    </>
  );
}

export default function NotificationContent(props) {
  const [notificationSectionClicked, setNotificationSectionClicked] =
    useState("All");

  const [client, setClient] = useState(null);
  const [userId, setUserId] = useState("");
  const [getstreamUserToken, setGetstreamUserToken] = useState();

  console.log("Content_user: ", client);

  async function init() {
    if (getstreamUserToken !== undefined && getstreamUserToken !== null) {
      const client = new StreamClient(API_KEY, getstreamUserToken, APP_ID);
      setClient(client);
    }
  }

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await getUserId();
        setUserId(id);
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };

    fetchUserId();

    if(userId !== undefined && userId !== null){
      axios
      .get(`${process.env.NEXT_PUBLIC_USER_SERVICE_URL}/api/v1/notification/token`, {
        withCredentials: true,
      })
      .then((response) => {
        setGetstreamUserToken(response.data);
        console.log("inside_promise_res: ", response.data);
      })
      .catch((error) => {
        console.error(error);
      });
    }


    init();
  }, [userId]);

  return (
    <div className="flex flex-col bg-[#F8F9FC] min-h-full">
      <div className="flex flex-col mx-[60px] mt-[24px]">
        <div className="flex gap-2 ">
          <span className="text-dark-neutral-50 font-[500] text-md">Home</span>
          <span className="text-dark-neutral-700 text-md">
            <FurtherContentRightArrow />
          </span>
          <span className="text-primary-purple-600 font-[500] text-md">
            Notifications
          </span>
        </div>
        <div className="border-b-2 border-light-neutral-500 mt-[24px]"></div>
      </div>
      <div className="flex mt-[40px]">
        {/* {!client?(<Skeleton/>):(<> */}
        <div className="flex ml-[212px]">
          <div className="rounded-md h-[150px] mx-auto sticky top-[90px]">
            <div className="flex flex-col h-full w-full">
              <span className=" font-[600] text-headline-md">
                Notifications
              </span>
              <Link
                href={`/my-account/notifications`}
                className="button-text-md font-[600] text-primary-purple-600 hover:underline"
              >
                View Settings
              </Link>
            </div>
          </div>
        </div>
        <div className="w-[100%] mr-[211px] ml-[117px] bg-[#F8F9FC] mx-auto h-full">
          <div className="flex flex-col gap-[24px] bg-[#F8F9FC]">
            <div className="flex gap-[15px] rounded-md ">
              <button
                onClick={() => {
                  setNotificationSectionClicked("All");
                }}
                className={`text-dark-neutral-200 flex items-center justify-center text-sm font-[600] ${
                  notificationSectionClicked === "All"
                    ? "bg-primary-purple-50 text-primary-purple-500"
                    : "bg-[#F8F9FC]"
                } hover:bg-primary-purple-50 hover:text-primary-purple-500 rounded-md`}
              >
                <span className="relative px-[15px] py-[11px] after:absolute after:bottom-0 after:top-0 after:w-[100%]">
                  All
                </span>
              </button>

              <button
                onClick={() => {
                  setNotificationSectionClicked("Inbox");
                }}
                className={`text-dark-neutral-200 flex items-center justify-center text-sm font-[600] ${
                  notificationSectionClicked === "Inbox"
                    ? "bg-primary-purple-50 text-primary-purple-500"
                    : "bg-[#F8F9FC]"
                } hover:bg-primary-purple-50 hover:text-primary-purple-500 rounded-md`}
              >
                <span className="relative px-[15px] py-[11px] after:absolute after:bottom-0 after:top-0 after:w-[100%]">
                  Inbox
                </span>
              </button>

              <button
                onClick={() => {
                  setNotificationSectionClicked("Promotional");
                }}
                className={`text-dark-neutral-200 flex items-center justify-center text-sm font-[600] ${
                  notificationSectionClicked === "Promotional"
                    ? "bg-primary-purple-50 text-primary-purple-500"
                    : "bg-[#F8F9FC]"
                } hover:bg-primary-purple-50 hover:text-primary-purple-500 rounded-md`}
              >
                <span className="relative px-[15px] py-[11px] after:absolute after:bottom-0 after:top-0 after:w-[100%]">
                  Promotional
                </span>
              </button>
            </div>
            <div className="bg-white rounded-md min-h-[calc(100vh-290px)] ">
              { <NotificationGroupFromBackend
                notificationSectionClicked={notificationSectionClicked}
              />}
              {/* <NotificationFeed notify Group={NotificationGroup} LoadingIndicator={LoadingIndicator} Paginator={InfiniteScrollPaginator} Placeholder={FeedPlaceholder}/> */}
            </div>
          </div>
        </div>

        {/* </>)} */}
      </div>
    </div>
  );
}
