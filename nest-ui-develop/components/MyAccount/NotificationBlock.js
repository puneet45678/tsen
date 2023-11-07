import React, { useState, useEffect } from "react";
import ToggleSwitch from "../Layouts/ToggleSwitch";
const NotificationBlock = ({
  notificationLabel,
  notificationValue,
  onChange,
}) => {
  const [toggleValue, setToggleValue] = useState(
    notificationValue ? notificationValue : false
  );

  return (
    <div className="flex-center gap-4">
      <div className="w-[34px] h-5">
        <ToggleSwitch value={notificationValue} onChange={onChange} />
      </div>
      <span className="text-md text-dark-neutral-700">{notificationLabel}</span>
    </div>
  );
};

export default NotificationBlock;
