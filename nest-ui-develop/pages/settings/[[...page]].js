import { useState, useEffect, useRef } from "react";
import MyProfile from "../../components/MyAccount/MyProfile";
import SecurityLogin from "../../components/MyAccount/SecurityLogin";
import Notifications from "../../components/MyAccount/Notifications";
import Payments from "../../components/MyAccount/Payments";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import BreadCrumbs from "../../components/Layouts/BreadCrumbs";
import { useInView } from "react-intersection-observer";

import Avatar from "../../components/Avatar";

const breadCrumbItems = [
  {
    title: "Home",
    to: "/home",
  },
  {
    title: "Account setting",
  },
];

const defaultMyProfileData = {
  fullName: "",
  country: "",
  email: "",
  accountType: "",
  username: "",
  gender: "",
  dateOfBirth: "",
  showMatureContent: false,
  coverPicture: null,
  profilePicture: null,
  introductoryVideoUrl: "",
  description: "",
  areaOfExpertise: "",
  website: "",
  socialMediaLinks: [],
};

const MyAccount = () => {
  const customViewportRef = useRef(null);
  // Intersection Observers for My Profile Section
  const { ref: accountInfoRef, inView: accountInfoInView } = useInView({
    threshold: 0.5,
  });
  const { ref: displayInfoRef, inView: displayInfoInView } = useInView({
    threshold: 0.5,
  });
  const { ref: socialInfoRef, inView: socialInfoInView } = useInView({
    threshold: 0.5,
  });

  // Intersection Observers for Security Login Section
  const { ref: changePasswordRef, inView: changePasswordInView } = useInView({
    threshold: 0.9,
  });
  const { ref: changeEmailRef, inView: changeEmailInView } = useInView({
    threshold: 0.5,
  });
  const { ref: loginActivityRef, inView: loginActivityInView } = useInView({
    threshold: 1,
  });
  const { ref: deleteAccountRef, inView: deleteAccountInView } = useInView({
    threshold: 1,
  });

  // Intersection Observer for Payment
  const { ref: paymentRef, inView: paymentInView } = useInView({
    threshold: 1,
  });

  //Intersection Observers for Notifications settings
  const { ref: generalNotificationsRef, inView: generalNotificationsInView } =
    useInView({ threshold: 1 });
  const {
    ref: marketplaceNotificationsRef,
    inView: marketplaceNotificationsInView,
  } = useInView({ threshold: 1 });
  const {
    ref: campaignsNotificationsRef,
    inView: campaignsNotificationsInView,
  } = useInView({ threshold: 1 });
  const {
    ref: ikarusNestNotificationsRef,
    inView: ikarusNestNotificationsInView,
  } = useInView({ threshold: 1 });

  const distRef = useRef(null);
  const [distanceFromTop, setDistanceFromTop] = useState(0);

  const handleScroll = () => {
    if (distRef.current) {
      const distance = distRef.current.getBoundingClientRect().top;
      setDistanceFromTop(distance);
    }
  };
  useEffect(() => {
    window.addEventListener("wheel", handleScroll);

    return () => {
      window.removeEventListener("wheel", handleScroll);
    };
  }, []);

  useEffect(() => {
    console.log("distanceFromTop: ", distanceFromTop);
  }, [distanceFromTop]);

  // Base
  const router = useRouter();
  const user = useSelector((state) => state.user);
  const [page, setPage] = useState(router.query?.page?.[0]);
  const [changesToThePage, setChangesToThePage] = useState(false);
  const [currentSection, setCurrentSection] = useState("");
  const [showPasswordChangeAlert, setShowPasswordChangeAlert] = useState(false);

  const menuData = [
    {
      title: "My Profile",
      value: "my-profile",

      items: [
        {
          title: "Account Information",
          value: "accountInformation",
          inView: accountInfoInView,
        },
        {
          title: "Display Information",
          value: "displayInformation",
          inView: displayInfoInView,
        },
        {
          title: "Social Connections",
          value: "socialConnections",
          inView: socialInfoInView,
        },
      ],
    },
    {
      title: "Security Login",
      value: "security-login",

      items: [
        {
          title: "Change Password",
          value: "changePassword",
          inView: changePasswordInView,
        },
        {
          title: "Change Email",
          value: "changeEmail",
          inView: changeEmailInView,
        },
        {
          title: "Login Activity",
          value: "loginActivity",
          inView: loginActivityInView,
        },
        {
          title: "Delete Account",
          value: "deleteAccount",
          inView: deleteAccountInView,
        },
      ],
    },
    {
      title: "Payment Options",
      value: "payments",
      items: [
        {
          title: "Paypal",
          value: "paypal",
          inView: paymentInView,
        },
      ],
    },
    {
      title: "Notification",
      value: "notifications",
      items: [
        {
          title: "General",
          value: "general",
          inView: generalNotificationsInView,
        },
        {
          title: "Marketplace",
          value: "marketplace",
          inView: marketplaceNotificationsInView,
        },
        {
          title: "Campaigns",
          value: "campaigns",
          inView: campaignsNotificationsInView,
        },
        {
          title: "Ikarus Nest",
          value: "ikarusNest",
          inView: ikarusNestNotificationsInView,
        },
      ],
    },
  ];

  useEffect(() => {
    setPage(router.query?.page?.[0]);
    console.log("page_query: ", router.query?.page?.[0]);
  }, [router.query.page]);

  // My Profile
  const [myProfileData, setMyProfileData] = useState(defaultMyProfileData);

  // useEffect(() => {
  //   const section = window.location.hash.substring(1);
  //   console.log("router", router);
  //   if (section) {
  //     setCurrentSection(section);
  //   } else {
  //     if (page === "my-profile") {
  //       setCurrentSection("accountInformation");
  //     } else if (page === "security-login") {
  //       setCurrentSection("changePassword");
  //     } else if (page === "payment") {
  //       setCurrentSection("paypal");
  //     } else if (page === "notification") {
  //       setCurrentSection("general");
  //     }
  //   }
  // }, [page]);

  return (
    <div className="flex flex-col w-full h-[calc(100vh_-_72px)] bg-accent2 relative overflow-hidden">
      <div className="pb-6 border-b-[1px] px-[60px] pt-8 border-light-neutral-500">
        <BreadCrumbs items={breadCrumbItems} />
      </div>

      <div className="grid grid-cols-[30%_1fr] overflow-hidden">
        <div className="w-full h-full overflow-y-scroll pr-[176px] no-scrollbar">
          <div className="flex justify-end">
            <div className="flex flex-col gap-6 w-[280px] mt-14 mb-8">
              <div
                className="flex-center flex-col gap-4"
                ref={customViewportRef}
              >
                <Avatar
                  size="xl"
                  imageSrc={
                    user?.displayInformation?.profilePicture?.croppedPictureUrl
                  }
                />
                <div className="flex-center flex-col gap-1">
                  <span className="mx-auto text-headline-xs font-semibold text-dark-neutral-700">
                    {user?.username}
                  </span>
                  <span className="mx-auto text-dark-neutral-50 text-lg">
                    {user?.email}
                  </span>
                </div>
              </div>
              <div
                className="h-[1px] grow bg-light-neutral-600"
                style={{ height: "1px" }}
              ></div>
              {menuData.map((item, index) => {
                if (index < menuData.length - 1) {
                  return (
                    <div
                      key={`${index}-${item.title}`}
                      className="flex flex-col gap-6"
                    >
                      <div className="flex flex-col gap-4">
                        <span className="text-xl font-semibold text-dark-neutral-700">
                          {item.title}
                        </span>
                        {item.items.map((section, sectionIndex) => (
                          <div
                            key={`${index}-${item.title}-${sectionIndex}-${section.title}`}
                            onClick={() => {
                              router.push(
                                `/settings/${item.value}#${section.value}`
                              );
                              setCurrentSection(section.value);
                            }}
                            className={`text-md font-semibold px-4 py-[10px] w-fit cursor-pointer ${
                              section.inView && item.value === page
                                ? "bg-primary-purple-50 rounded-[5px] text-primary-purple-500"
                                : "text-dark-neutral-200"
                            }`}
                          >
                            {section.title}
                          </div>
                        ))}
                      </div>
                      <div className="h-[1px] bg-light-neutral-600"></div>
                    </div>
                  );
                } else {
                  return (
                    <div
                      key={`${index}-${item.title}`}
                      className="flex flex-col gap-4"
                    >
                      <span className="text-xl font-semibold text-dark-neutral-700">
                        {item.title}
                      </span>
                      {item.items.map((section, sectionIndex) => (
                        <div
                          key={`${index}-${item.title}-${sectionIndex}-${section.title}`}
                          onClick={() => {
                            router.push(
                              `/settings/${item.value}#${section.value}`
                            );
                            setCurrentSection(section.value);
                          }}
                          className={`text-md font-semibold px-4 py-[10px] w-fit cursor-pointer ${
                            section.inView && item.value === page
                              ? "bg-primary-purple-50 rounded-[5px] text-primary-purple-500"
                              : "text-dark-neutral-200"
                          }`}
                        >
                          {section.title}
                        </div>
                      ))}
                    </div>
                  );
                }
              })}
            </div>
          </div>
        </div>
        <div className="overflow-y-scroll h-full w-full no-scrollbar">
          <div className="flex justify-start">
            <div className="flex w-[1040px] mt-14 mb-8">
              {page === "my-profile" ? (
                <MyProfile
                  data={myProfileData}
                  setData={setMyProfileData}
                  setCurrentSection={setCurrentSection}
                  accountInfoRef={accountInfoRef}
                  displayInfoRef={displayInfoRef}
                  socialInfoRef={socialInfoRef}
                ></MyProfile>
              ) : page === "security-login" ? (
                <SecurityLogin
                  changesToThePage={changesToThePage}
                  setChangesToThePage={setChangesToThePage}
                  setCurrentSection={setCurrentSection}
                  changePasswordRef={changePasswordRef}
                  changeEmailRef={changeEmailRef}
                  loginActivityRef={loginActivityRef}
                  deleteAccountRef={deleteAccountRef}
                  accountInfoInView={accountInfoInView}
                  distRef={distRef}
                ></SecurityLogin>
              ) : page === "payments" ? (
                <Payments
                  changesToThePage={changesToThePage}
                  setChangesToThePage={setChangesToThePage}
                  setCurrentSection={setCurrentSection}
                  paymentRef={paymentRef}
                ></Payments>
              ) : page === "notifications" ? (
                <Notifications
                  changesToThePage={changesToThePage}
                  setChangesToThePage={setChangesToThePage}
                  setCurrentSection={setCurrentSection}
                  generalNotificationsRef={generalNotificationsRef}
                  marketplaceNotificationsRef={marketplaceNotificationsRef}
                  campaignsNotificationsRef={campaignsNotificationsRef}
                  ikarusNestNotificationsRef={ikarusNestNotificationsRef}
                ></Notifications>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  if (
    !context.req.cookies["sFrontToken"] ||
    context.req.cookies["sFrontToken"] === "" ||
    !context.req.cookies["sAccessToken"] ||
    context.req.cookies["sAccessToken"] === ""
  ) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
      props: {},
    };
  } else {
    const page = context.query?.page?.[0];
    if (page === undefined) {
      return {
        redirect: {
          permanent: false,
          destination: "/settings/my-profile",
        },
        props: {},
      };
    } else if (
      page !== "my-profile" &&
      page !== "security-login" &&
      page !== "payments" &&
      page !== "notifications"
    ) {
      return {
        notFound: true,
      };
    }

    return {
      props: {},
    };
  }
}

export default MyAccount;
