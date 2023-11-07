import { useEffect, useState } from "react";
import { useStreamContext } from "react-activity-feed";
import { RxAvatar } from "react-icons/rx";
import { getUserId } from "supertokens-auth-react/recipe/session";
import axios from "axios";
import { useRouter } from "next/router";

export default function ProfileContent(props) {
  const { client } = useStreamContext();
  const router = useRouter();
  console.log("client out of effect: ", client);
  const [getStreamUser, setUser] = useState(null);
  const [userId, setUserId] = useState("");
  const [followData, setFollowData] = useState();
  const { username, section } = router.query;
  // const [visitProfileUserId, setVisitProfileUserId] = useState("");

  // useEffect(() => {
  

  //   axios
  //     .get(
  //       `${process.env.NEXT_PUBLIC_USER_SERVICE_URL}/api/v1/user?username=${username}`,
  //       {
  //         withCredentials: true,
  //       }
  //     )
  //     .then((response) => {
  //       setVisitProfileUserId(response.data.supertokens_user_id);
  //       console.log("VisitProfileUserID: ", response.data);
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //     });
  // }, [username]);

  useEffect(()=>{
    console.log("profileContext_vis_id: ",props.visitProfileUserId)
      axios
      .get(
        `${process.env.NEXT_PUBLIC_NOTIFICATION_SERVICE}/admin_panel/api/v1/user/followers_and_followings?profiler_user_id=${props.visitProfileUserId}`,
        {
          withCredentials:true,
        }
      )
      .then((response) => {
        console.log(
          "followData: ",response.data
        )
        setFollowData(response.data);
      })
      .catch((e) => console.error(e));
  },[props.visitProfileUserId])

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
  }, [userId]);

  // if (!client) return <>{null}</>;

  return (
    // <ProfileContext.Provider value={{ getStreamUser }}>
    //  <FollowingContent/>
    // {/* </ProfileContext.Provider> */}
    <>
      {/* {getStreamUser !== undefined && getStreamUser !== null ? ( */}
      <>
        <div className="flex flex-col items-center bg-white py-5 px-3 rounded-md">
          <RxAvatar className="text-[20px] font-medium mb-2" />
          <span>{followData?.following?.results?.length || 0}</span>
          <span>Followers</span>
        </div>
        <div className="flex flex-col items-center bg-white py-5 px-3 rounded-md">
          <RxAvatar className="text-[20px] font-medium mb-2" />
          <span>{followData?.followers?.results?.length || 0}</span>
          <span>Following</span>
        </div>
      </>
      {/* ) : null} */}
    </>
  );
}
