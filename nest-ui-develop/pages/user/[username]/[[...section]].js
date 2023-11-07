import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";
// import useFollow from "../../../hooks/useFollow";
import ReactModal from "../../../components/Modals/Modal";
import FollowerFollowingModalContainer from "../../../components/ProfilePage/FollowerFollowingModalContainer";
import NavSections from "../../../components/ProfilePage/NavSections";
import ProfileNavs from "../../../components/ProfilePage/ProfileNavs";
import UserProfileBoard from "../../../components/ProfilePage/UserProfileBoard";
import CloseCross from "../../../icons/CloseCross";
import ShareModal from "../../../components/ProfilePage/ShareModal";

const ProfileContent = dynamic(
  () => import("../../../components/ProfileContext"),
  { ssr: false }
);

const dummyUser = {
  _id: {
    oid: "65268dcc1b54adb95f5fa465",
  },
  supertokensUserId: "efdb2fc2-141a-48e5-bc9f-47e2b9a11644",
  username: "JaneDoe123",
  email: "jane.doe@example.com",
  accountInformation: {
    fullName: "Jane Doe",
    country: "United States",
    accountType: "3DP",
    gender: "Female",
    dateOfBirth: "1995-07-20",
    showMatureContent: true,
  },
  displayInformation: {
    profilePicture: {
      pictureUrl: "https://source.unsplash.com/random",
      croppedPictureUrl: "https://source.unsplash.com/random",
    },
    coverPicture: {
      pictureUrl: "https://source.unsplash.com/random",
      croppedPictureUrl: "https://source.unsplash.com/random",
    },
    introductoryVideoUrl:
      "https://assets.mixkit.co/videos/preview/mixkit-introduction-of-business-seminar-motivational-speaker-12983-large.mp4",
    description:
      "So Medium is not the only place for educators to create … probably isn’t even the best place if we are being honest with ourselves.   But I am convinced it is one of the best places to get started.   After writing on Medium for several years now, I am committed to helping other educators get started here as well.   As a rhetoric and writing professor, I’ve always preached the benefits of blogging to my students. Blogging helps writers find their voice, build an audience, and strengthen their writing through practice.   (In fact, I’ve started having students write on Medium as well. You can see some of their writing here.)   For that reason, Medium is one of the best places to get started as a creator. The prospect of making money draws many people in … which is a possibility. But if that is the only reason you are here, you’ll give up quickly, because it takes persistence to get the paid partner program to work for you.",
    skills: ["3D Modeling", "3D Printing", "CAD"],
    website: "https://janedoe3d.com",
  },
  followings: [
    {
      username: "Something",
    },
    {
      username: "Something2",
    },
    {
      username: "Something3",
    },
  ],
  followers: [
    {
      username: "Something4",
    },
    {
      username: "Something5",
    },
    {
      username: "Something6",
    },
  ],
  socialMediaLinks: [
    {
      platform: "instagram", //platform name in lower case, Not even camelCase
      url: "https://twitter.com/JaneDoe3D",
    },
    {
      platform: "linkedin",
      url: "https://linkedin.com/in/jane-doe",
    },
  ],
  expertise: [
    {
      skill: "3d rendering",
    },
    {
      skill: "Modeling",
    },
    {
      skill: "Scan CleanUps",
    },
    {
      skill: "3d printing",
    },
  ],
  createdAt: {
    date: "2023-10-11T11:55:24.116Z",
  },
  slicerSettings: "Default",
  notifications: {
    generalNotifications: {
      GENERAL_FOLLOW: {
        label: "Someone starts following you",
        subscribed: true,
      },
      GENERAL_PROJECT_LIKE: {
        label: "Someone likes a project on you portfolio",
        subscribed: true,
      },
      GENERAL_COMMENT_LIKE: {
        label: "Someone likes your comment",
        subscribed: true,
      },
      GENERAL_COMMENT_REPLY: {
        label: "Someone replies to your comment",
        subscribed: true,
      },
    },
    marketplaceNotifications: {
      MARKETPLACE_FOLLOWING_MODEL_PUBLISH: {
        label: "An artist you follow publishes a new model on marketplace",
        subscribed: true,
      },
      MARKETPLACE_MODEL_BOUGHT: {
        label: "Someone buys your model on the marketplace",
        subscribed: true,
      },
      MARKETPLACE_MODEL_LIKE: {
        label: "Someone likes your model on marketplace",
        subscribed: true,
      },
      MARKETPLACE_MODEL_COMMENT: {
        label: "Someone comments on your model on marketplace",
        subscribed: true,
      },
    },
    backedCampaignNotifications: {
      BACKED_CAMPAIGN_FOLLOWING_CAMPAIGN_PUBLISH: {
        label: "An artist you follow launches a new campaign",
        subscribed: true,
      },
      BACKED_CAMPAIGN_FOLLOWING_CAMPAIGN_END: {
        label: "Campaign by an artist you follow is about to end",
        subscribed: true,
      },
      BACKED_CAMPAIGN_MILESTONE: {
        label: "Your backed campaign reaches a milestone",
        subscribed: true,
      },
      BACKED_CAMPAIGN_UPDATE: {
        label: "Your backed campaign has new updates",
        subscribed: true,
      },
      BACKED_CAMPAIGN_EARLY_BIRD_ADDED: {
        label: "Early bird offer on campaigns added to your wishlist",
        subscribed: true,
      },
    },
    createdCampaignNotifications: {
      CREATED_CAMPAIGN_NEW_LIKE: {
        label: "Someone likes your created campaign",
        subscribed: true,
      },
      CREATED_CAMPAIGN_NEW_COMMENT: {
        label: "Someone comments on your created campaign",
        subscribed: true,
      },
      CREATED_CAMPAIGN_NEW_BACKER: {
        label: "Someone backs your created campaign",
        subscribed: true,
      },
      CREATED_CAMPAIGN_PRE_LAUNCH_SIGNUP: {
        label: "Someone signs up to your created campaign during pre-launch",
        subscribed: true,
      },
      CREATED_CAMPAIGN_MILESTONE_REACHED: {
        label: "Your created campaign reaches a milestone",
        subscribed: true,
      },
      CREATED_CAMPAIGN_ENDED: {
        label: "Your created campaign has ended. Review your performance.",
        subscribed: true,
      },
    },
    ikarusNestNotifications: {
      IKARUS_NEST_OFFERS_AND_DISCOUNT: {
        label: "Offers and Discounts",
        subscribed: true,
      },
      IKARUS_NEST_NEW_FEATURES_ANNOUNCEMENT: {
        label: "New features announcements",
        subscribed: true,
      },
      IKARUS_NEST_PROMOTIONS: {
        label: "Promotions",
        subscribed: true,
      },
    },
  },
  notification_token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjUyNjhkY2MxYjU0YWRiOTVmNWZhNDY1In0.12tnASgyc0DPGXZWnzBSipUhvykhQOuzDlYYtYxbcdk",
};

const UserProfile = () => {
  const router = useRouter();
  const currentUser = useSelector((state) => state.user);
  const { username, section } = router.query;
  const [currentSection, setCurrentSection] = useState("about");
  const [user, setUser] = useState(null);
  const [error, setError] = useState();
  const [showErrorPage, setShowErrorPage] = useState(false);
  const [isFollowClicked, setIsFollowClicked] = useState(false);
  const [visitProfileUserId, setVisitProfileUserId] = useState("");
  const [FFModalActiveTab, setFFModalActiveTab] = useState("following");
  // const { isFollowing, toggleFollow } = useFollow();
  const [showFollowerFollowingModal, setShowFollowerFollowingModal] =
    useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_USER_SERVICE_URL}/api/v1/user?username=${username}`,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        setVisitProfileUserId(response.data._id);
        setUser(response.data);
        console.log("VisitProfileUserID: ", response.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [username]);

  // useEffect(() => {
  //   console.log("2username", username);
  //   if (username) {
  //     axios
  //       .get(
  //         `${process.env.NEXT_PUBLIC_USER_SERVICE_URL}/api/v1/user?username=${username}`,
  //         {
  //           withCredentials: true,
  //         }
  //       )
  //       .then((res) => {
  //         console.log("res", res);
  //         setUser(res.data);
  //       })
  //       .catch((err) => {
  //         console.log("err", err);
  //         setShowErrorPage(true);
  //         setError({
  //           code: err?.response?.status,
  //           message: err?.response?.data?.detail,
  //         });
  //         setUser(null);
  //       });
  //   }
  // }, [username]);

  if (showErrorPage) {
    return (
      <div className="w-full bg-accent2 py-10 px-20">
        <h1>{error?.code}</h1>
        <p>{error?.message}</p>
      </div>
    );
  } else {
    return (
      <>
        <ReactModal
          styles={{
            modal: {
              padding: "0px",
              margin: "0px",
              borderRadius: "10px",
              width: "508px",
            },
          }}
          open={showShareModal}
          closeIcon={
            <div className="h-6 w-6">
              <CloseCross />
            </div>
          }
          onClose={() => setShowShareModal(false)}
          center
        >
          <ShareModal />
        </ReactModal>
        <ReactModal
          styles={{
            modal: {
              padding: "0px",
              margin: "0px",
              borderRadius: "8px",
              maxWidth: "1000px",
              width: "1000px",
            },
          }}
          open={showFollowerFollowingModal}
          closeIcon={
            <div className="h-6 w-6">
              <CloseCross />
            </div>
          }
          onClose={() => setShowFollowerFollowingModal(false)}
          center
        >
          <FollowerFollowingModalContainer
            selectedTab={FFModalActiveTab}
            username={user?.username}
          />
        </ReactModal>
        <div className="w-full bg-white">
          <div className="sticky top-[72px] z-10">
            {/* Cover Image */}
            <div className="w-full aspect-[48/7] relative">
              {user?.displayInformation?.coverPicture?.croppedPictureUrl ? (
                <Image
                  src={user.displayInformation.coverPicture.croppedPictureUrl}
                  alt={`${username} cover`}
                  fill
                />
              ) : (
                <div className="bg-light-neutral-700 w-full h-full" />
              )}
            </div>
            <div className="px-52 bg-white">
              {user ? (
                <UserProfileBoard
                  selectModalActiveTab={setFFModalActiveTab}
                  shareModal={setShowShareModal}
                  FFModal={setShowFollowerFollowingModal}
                  user={user}
                />
              ) : (
                <div>Fetching user details...</div>
              )}
              <hr className="border border-light-neutral-500" />
              <ProfileNavs {...router.query} user={dummyUser} />
            </div>
          </div>

          <main className="px-52 pb-52 m-1">
            <div className="mt-9">
              <NavSections user={user} section={section} />
            </div>
          </main>
        </div>
      </>
    );
  }
};

export const getServerSideProps = async (context) => {
  const { username, section } = context.query;
  console.log("username", username, "section", section);
  if (section?.[0] === undefined) {
    return {
      redirect: {
        permanent: false,
        destination: `/user/${username}/about`,
      },
      props: {},
    };
  } else if (
    section?.[0] !== "about" &&
    section?.[0] !== "portfolio" &&
    section?.[0] !== "models" &&
    section?.[0] !== "campaigns"
  ) {
    console.log("2: username", username, "section", section);
    return {
      notFound: true,
    };
  }
  return {
    props: {},
  };
};

export default UserProfile;
