import React, { useEffect, useState } from 'react';

function TimeAgoPortfolio({ timestamp }) {
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    const currentTime = new Date();
    const pastTime = new Date(timestamp);
    const timeDifference = (currentTime - pastTime) / 1000; // Convert to seconds

    if (timeDifference < 60) {
      setTimeAgo(`${Math.floor(timeDifference)} second${Math.floor(timeDifference) === 1 ? '' : 's'} ago`);
    } else if (timeDifference < 3600) {
      const minutes = Math.floor(timeDifference / 60);
      setTimeAgo(`${minutes} minute${minutes === 1 ? '' : 's'} ago`);
    } else if (timeDifference < 86400) {
      const hours = Math.floor(timeDifference / 3600);
      setTimeAgo(`${hours} hour${hours === 1 ? '' : 's'} ago`);
    } else if (timeDifference < 31536000) {
      const days = Math.floor(timeDifference / 86400);
      setTimeAgo(`${days} day${days === 1 ? '' : 's'} ago`);
    } else {
      const years = Math.floor(timeDifference / 31536000);
      setTimeAgo(`${years} year${years === 1 ? '' : 's'} ago`);
    }
  }, [timestamp]);

  return <div>{timeAgo}</div>;
}

export default TimeAgoPortfolio