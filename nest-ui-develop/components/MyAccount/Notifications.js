import { useState, useEffect } from "react";
import axios from "axios";
import SectionLayout from "../Layouts/SectionLayout";
import NotificationBlock from "./NotificationBlock";

const Notifications = (props) => {
  const [notifications, setNotifications] = useState({});

  const handleNotificationChange = (type, key, value) => {
    axios
      .put(
        `${process.env.NEXT_PUBLIC_USER_SERVICE_URL}/api/v1/notification-data?type=${type}`,
        { key, value },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log("res", res);
      })
      .catch((err) => {
        // TODO: handle the case when error occurs
        console.log(err);
      });
  };

  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_USER_SERVICE_URL}/api/v1/notification-data`,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log("res", res);
        setNotifications(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="flex flex-col gap-[24px] w-full">
      <div className="scroll-mt-[120px]" id="generalNotifications" ref={props.generalNotificationsRef}>
        <SectionLayout
          heading="General"
          subHeading="Mark important notifications you want to receive"
        >
          <div className="flex flex-col items-start gap-6">
            {Object.entries(
              notifications?.generalNotifications
                ? notifications.generalNotifications
                : {}
            ).map(([key, value], index) => (
              <div key={`generalNotifications-${index}-${key}`}>
                <NotificationBlock
                  notificationLabel={value.label}
                  notificationValue={value.subscribed}
                  onChange={(notificationValue) => {
                    handleNotificationChange(
                      "generalNotifications",
                      key,
                      notificationValue
                    );
                  }}
                />
              </div>
            ))}
          </div>
        </SectionLayout>
      </div>
      <div className="scroll-mt-[120px]" id="marketplace" ref={props.marketplaceNotificationsRef}>
        <SectionLayout
          heading="Marketplace"
          subHeading="Mark the notifications you want to receive "
        >
          <div className="flex flex-col items-start gap-6">
            {Object.entries(
              notifications?.marketplaceNotifications
                ? notifications.marketplaceNotifications
                : {}
            ).map(([key, value], index) => (
              <div key={`marketplaceNotifications-${index}-${key}`}>
                <NotificationBlock
                  notificationLabel={value.label}
                  notificationValue={value.subscribed}
                  onChange={(notificationValue) => {
                    handleNotificationChange(
                      "marketplaceNotifications",
                      key,
                      notificationValue
                    );
                  }}
                />
              </div>
            ))}
          </div>
        </SectionLayout>
      </div>
      <div className="scroll-mt-[120px]" id="Campaigns" ref={props.campaignsNotificationsRef}>
        <SectionLayout
          heading="Campaigns"
          subHeading="Mark the notifications you want to receive about campaigns"
        >
          <div className="flex flex-col items-start gap-4">
            <p className="text-lg text-dark-neutral-700 font-semibold">
              Backed Campaign
            </p>
            <div className="flex flex-col items-start gap-6">
              {Object.entries(
                notifications?.backedCampaignNotifications
                  ? notifications.backedCampaignNotifications
                  : {}
              ).map(([key, value], index) => (
                <div key={`backedCampaignNotifications-${index}-${key}`}>
                  <NotificationBlock
                    notificationLabel={value.label}
                    notificationValue={value.subscribed}
                    onChange={(notificationValue) => {
                      handleNotificationChange(
                        "backedCampaignNotifications",
                        key,
                        notificationValue
                      );
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="h-[1px] w-full bg-light-neutral-600"></div>
          <div className="flex flex-col items-start gap-4">
            <p className="text-lg text-dark-neutral-700 font-semibold">
              Created Campaign
            </p>
            <div className="flex flex-col items-start gap-6">
              {Object.entries(
                notifications?.createdCampaignNotifications
                  ? notifications.createdCampaignNotifications
                  : {}
              ).map(([key, value], index) => (
                <div key={`createdCampaignNotifications-${index}-${key}`}>
                  <NotificationBlock
                    notificationLabel={value.label}
                    notificationValue={value.subscribed}
                    onChange={(notificationValue) => {
                      handleNotificationChange(
                        "createdCampaignNotifications",
                        key,
                        notificationValue
                      );
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </SectionLayout>
      </div>

      <div className="scroll-mt-[120px]" id="ikarus-nest" ref={props.ikarusNestNotificationsRef}>
        <SectionLayout
          heading="Ikarus Nest"
          subHeading="Mark the notifications you want to receive "
        >
          <div className="flex flex-col items-start gap-6">
            {Object.entries(
              notifications?.ikarusNestNotifications
                ? notifications.ikarusNestNotifications
                : {}
            ).map(([key, value], index) => (
              <div key={`ikarusNestNotifications-${index}-${key}`}>
                <NotificationBlock
                  notificationLabel={value.label}
                  notificationValue={value.subscribed}
                  onChange={(notificationValue) => {
                    handleNotificationChange(
                      "ikarusNestNotifications",
                      key,
                      notificationValue
                    );
                  }}
                />
              </div>
            ))}
          </div>
        </SectionLayout>
      </div>
    </div>
  );
};

export default Notifications;
