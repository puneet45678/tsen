import { useState, useEffect} from "react";
import { useSelector } from "react-redux";
import MyProfileAccountInformation from "./MyProfileAccountInformation";
import MyProfileDisplayInformation from "./MyProfileDisplayInformation";
import MyProfileSocialMediaLinks from "./MyProfileSocialMediaLinks";
import { useRouter } from "next/router";

const MyProfile = ({ setCurrentSection, data, setData,accountInfoRef,displayInfoRef,socialInfoRef }) => {
  const router = useRouter();
  const user = useSelector((state) => state.user);


  const [accountInformationChanges, setAccountInformationChanges] =
    useState(false);
  const [displayInformationChanges, setDisplayInformationChanges] =
    useState(false);
  const [socialMediaChanges, setSocialMediaChanges] = useState(false);

  useEffect(() => {
    const currentData = {
      fullName: user?.accountInformation?.fullName
        ? user.accountInformation.fullName
        : "",
      country: user?.accountInformation?.country
        ? user.accountInformation.country
        : null,
      email: user.email,
      accountType: user?.accountInformation?.accountType
        ? user.accountInformation.accountType
        : null,
      username: user?.username ? user.username : "",
      gender: user?.accountInformation?.gender
        ? user.accountInformation.gender
        : "",
      dateOfBirth: user?.accountInformation?.dateOfBirth
        ? new Date(user.accountInformation.dateOfBirth)
        : null,
      showMatureContent: user?.accountInformation?.showMatureContent
        ? user.accountInformation.showMatureContent
        : false,
      coverPicture: user?.displayInformation?.coverPicture?.pictureUrl
        ? user.displayInformation.coverPicture.pictureUrl
        : "",
      croppedCoverPicture: user?.displayInformation?.coverPicture
        ?.croppedPictureUrl
        ? user.displayInformation.coverPicture.croppedPictureUrl
        : "",
      profilePicture: user?.displayInformation?.profilePicture?.pictureUrl
        ? user.displayInformation.profilePicture.pictureUrl
        : "",
      croppedProfilePicture: user?.displayInformation?.profilePicture
        ?.croppedPictureUrl
        ? user.displayInformation.profilePicture.croppedPictureUrl
        : "",
      introductoryVideoUrl: user?.displayInformation?.introductoryVideoUrl
        ? user.displayInformation.introductoryVideoUrl
        : "",
      description: user?.displayInformation?.description
        ? user.displayInformation.description
        : "",
      skills: user?.displayInformation?.skills
        ? user.displayInformation.skills
        : null,
      website: user?.displayInformation?.website
        ? user.displayInformation.website
        : "",
      socialMediaLinks: user?.socialMediaLinks ? user.socialMediaLinks : [],
    };
    setData(currentData);
  }, [user]);

  // useEffect(() => {
  //   if (accountInformationInView) {
  //     setCurrentSection("accountInformation");
  //   } else if (displayInformationInView) {
  //     setCurrentSection("displayInformation");
  //   } else {
  //     setCurrentSection("socialConnections");
  //   }
  //   console.log(
  //     "intersection account -> ",
  //     // accountInformationRef,
  //     accountInformationInView,
  //     accountInformationEntry
  //   );
  //   console.log(
  //     "intersection display -> ",
  //     displayInformationInView,
  //     displayInformationEntry
  //   );
  //   console.log(
  //     "intersection social -> ",
  //     socialMediaLinksInView,
  //     socialMediaLinksEntry
  //   );
  // }, [
  //   accountInformationInView,
  //   displayInformationInView,
  //   socialMediaLinksInView,
  //   accountInformationEntry,
  //   displayInformationEntry,
  //   socialMediaLinksEntry,
  // ]);

  useEffect(() => {
    const handleBeforeRouteChange = (url) => {
      if (
        accountInformationChanges ||
        displayInformationChanges ||
        socialMediaChanges
      ) {
        if (!url.startsWith(`/settings/my-profile`)) {
          const shouldPreventRouteChange = window.confirm(
            "Are you sure you want to leave this page? Changes you made may not be saved."
          );
          if (!shouldPreventRouteChange) {
            throw "Route change aborted";
          }
        }
      }
    };
    router.events.on("beforeHistoryChange", handleBeforeRouteChange);
    return () => {
      router.events.off("beforeHistoryChange", handleBeforeRouteChange);
    };
  }, [
    accountInformationChanges,
    displayInformationChanges,
    socialMediaChanges,
    router.events,
  ]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };
    if (
      accountInformationChanges ||
      displayInformationChanges ||
      socialMediaChanges
    ) {
      window.addEventListener("beforeunload", handleBeforeUnload);
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [
    accountInformationChanges,
    displayInformationChanges,
    socialMediaChanges,
  ]);


  return (
    <>
    
      <div className="grid gap-[24px] w-full">
        <div ref={accountInfoRef}>
          <MyProfileAccountInformation
            data={data}
            setData={setData}
            changes={accountInformationChanges}
            setChanges={setAccountInformationChanges}
          />
        </div>
        <div ref={displayInfoRef}>
          <MyProfileDisplayInformation
            data={data}
            setData={setData}
            changes={displayInformationChanges}
            setChanges={setDisplayInformationChanges}
          />
        </div>
        <div ref={socialInfoRef}>
          <MyProfileSocialMediaLinks
            data={data}
            setData={setData}
            changes={socialMediaChanges}
            setChanges={setSocialMediaChanges}
          />
        </div>
      </div>
    </>
  );
};

export default MyProfile;
