import Image from "next/image";
import { useSelector } from "react-redux";

const AccountMenu = ({ changePage }) => {
  const user = useSelector((state) => state.user);

  const menuSections = [
    {
      sectionTitle: "My Profile",
      pageLink: "my-profile",
      items: [
        {
          itemTitle: "Account Information",
          id: "accountInformation",
        },
        {
          itemTitle: "Display Information",
          id: "displayInformation",
        },
        {
          itemTitle: "Social Connections",
          id: "socialConnections",
        },
      ],
    },
    {
      sectionTitle: "Security Login",
      pageLink: "security-and-login",
      items: [
        {
          itemTitle: "Change Password",
          id: "changePassword",
        },
        {
          itemTitle: "Login Activity",
          id: "loginActivity",
        },
        {
          itemTitle: "Multi-factor Authentication",
          id: "multiFactorAuthentication",
        },
      ],
    },
    {
      sectionTitle: "Payment",
      pageLink: "payments-and-payouts",
      items: [
        {
          itemTitle: "Paypal",
          id: "paypal",
        },
      ],
    },
    {
      sectionTitle: "Notification",
      pageLink: "notifications",
      items: [
        {
          itemTitle: "Email Notifications",
          id: "emailNotifications",
        },
        {
          itemTitle: "Created Campaigns",
          id: "createdCampaigns",
        },
        {
          itemTitle: "Others",
          id: "others",
        },
      ],
    },
  ];

  return (
    <div className="grid justify-items-center gap-10">
      <div className="w-40 h-40 border-[1px] border-borderGray rounded-full mx-auto bg-accent1 relative">
        {user?.displayInformation?.profilePicture?.croppedPictureUrl && (
          <Image
            src={user.displayInformation.profilePicture.croppedPictureUrl}
            alt="User's Profile Picture"
            fill
            className="rounded-full"
          />
        )}
      </div>
      <div className="grid gap-8">
        {menuSections.map((section, sectionIndex) => (
          <div
            key={sectionIndex}
            className="grid gap-5 pb-8 border-b-[1px] last:border-b-0 border-black"
          >
            <div
              onClick={() => changePage(section.pageLink)}
              className="font-medium cursor-pointer"
            >
              {section.sectionTitle}
            </div>
            <div className="grid gap-4 ml-5 text-[14px]">
              {section.items.map((item, itemIndex) => (
                <div
                  onClick={() => changePage(section.pageLink, item.id)}
                  scroll="false"
                  key={`${sectionIndex}-${itemIndex}`}
                  className="cursor-pointer"
                >
                  <span>{item.itemTitle}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountMenu;
