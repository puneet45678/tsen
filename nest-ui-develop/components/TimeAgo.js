import moment from "moment";
function TimeAgo({ timestamp }) {
  const calculateTimeAgo = () => {
    const currentTime = moment(new Date());
    const userOffset = new Date().getTimezoneOffset()*60*1000;
    const activityTime = moment(Date.parse(timestamp));
    moment(activityTime).add(userOffset, 'miliseconds');
    // console.log("currentTime", currentTime, "timestamp: ",timestamp,"ActivityTime: ",activityTime);
    const timeDifference = currentTime.diff(activityTime,"seconds");
    // console.log("timeDifference",timeDifference)
    const minutes = Math.floor(timeDifference / 60);
    const hours = Math.floor(timeDifference / 3600);
    const days = Math.floor(timeDifference / 86400);
    const years = Math.floor(timeDifference / 31536000);

    if (timeDifference < 60) {
      return `${Math.floor(timeDifference)} second${Math.floor(timeDifference) === 1 ? '' : 's'} ago`;
    } else if (minutes < 60) {
      return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    } else if (hours < 24) {
      return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    } else if (days < 365) {
      return `${days} day${days === 1 ? '' : 's'} ago`;
    } else {
      return `${years} year${years === 1 ? '' : 's'} ago`;
    }
  };

  return <span className={`text-md text-dark-neutral-300 font-medium`}>{calculateTimeAgo()}</span>;
}

export default TimeAgo;
