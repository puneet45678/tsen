import React, { useState, useEffect } from "react";
import { getToken } from "../UtilityFunctions/firebase";
import axios from "axios";

const WebPushNotifications = (props) => {
  const [isTokenFound, setTokenFound] = useState(false);
  const config = {
    withCredentials: true,
};

  console.log("Token found", isTokenFound);
  useEffect(() => {
    let data;
    async function tokenFunc() {
      data = await getToken(setTokenFound);
      if (data) {
        const deviceData = {
          "device_id":"",
          "registration_token": data
        }
        axios.post(`${process.env.NEXT_PUBLIC_NOTIFICATION_SERVICE}/device_registration/api/v1/register_device`,deviceData,config).then((res)=>{console.log("Result: ",res)}).catch((err)=>{console.error(err)})
        console.log("Token is", data);
      }
      return data;
    }
    tokenFunc();

  }, [setTokenFound]);
  return <></>;
};
export default WebPushNotifications;
