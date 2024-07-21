import { useState } from 'react';

const useNotifications = () => {
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const clearNotifications = () => {
    setSuccess(null);
    setError(null);
  };

  return { success, setSuccess, error, setError, clearNotifications };
};

export default useNotifications;