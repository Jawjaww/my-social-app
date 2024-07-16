import { useState } from "react";
import { getAuth, sendEmailVerification } from "firebase/auth";

export const useSendVerificationEmail = () => {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const sendVerificationEmail = async () => {
    setSending(true);
    setError(null);
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      try {
        await sendEmailVerification(user);
      } catch (err) {
        setError(err as Error);
      }
    }
    setSending(false);
  };

  return [sendVerificationEmail, sending, error] as const;
};
