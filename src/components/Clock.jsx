import React, { useState, useEffect } from 'react';

const Clock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  const options = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  const formattedTime = currentTime.toLocaleString(undefined, options);

  return (
    <div style={{fontSize: "16px", color: "grey"}}>
      <p>{formattedTime} IST</p>
    </div>
  );
};

export default Clock;
