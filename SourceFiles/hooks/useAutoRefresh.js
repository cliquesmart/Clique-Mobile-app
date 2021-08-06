import React from 'react';

const useAutoRefresh = (duration) => {
  const [refresh, setRefresh] = React.useState(false);
  React.useEffect(() => {
    const interval = setInterval(() => {
      setRefresh((r) => !r);
    }, duration);

    return () => clearInterval(interval);
  }, [duration]);

  return [refresh];
};

export default useAutoRefresh;
