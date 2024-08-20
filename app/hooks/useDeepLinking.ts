import { useCallback } from "react";
import { useDispatch } from "react-redux";
import {
  useVerifyNewEmailMutation,
  useVerifyEmailMutation,
  useResetPasswordMutation,
  useSendVerificationEmailMutation,
  useUpdateEmailMutation,
} from "../services/api";
import {
  setUser,
  setIsAwaitingEmailVerification,
} from "../features/authentication/authSlice";
import { addToast } from "../features/toast/toastSlice";
import { useTranslation } from "react-i18next";
import { applyActionCode, } from "firebase/auth";


export const useDeepLinking = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [verifyNewEmail] = useVerifyNewEmailMutation();
  const [verifyEmail] = useVerifyEmailMutation();
  const [resetPassword] = useResetPasswordMutation();
  const [sendVerificationEmail] = useSendVerificationEmailMutation();
  const [updateEmail] = useUpdateEmailMutation();

  // const handleSendVerificationEmail = useCallback(
  //   async (newEmail: string, password: string) => {
  //     try {
  //       const result = await sendVerificationEmail({
  //         newEmail,
  //         password,
  //       }).unwrap();
  //       if (result.success) {
  //         dispatch(setIsAwaitingEmailVerification(true));
  //         return true;
  //       } else {
  //         throw new Error("Failed to send verification email");
  //       }
  //     } catch (error) {
  //       console.error("Error in handleSendVerificationEmail:", error);
  //       dispatch(
  //         addToast({
  //           message: t("editEmail.error.update"),
  //           type: "error",
  //         })
  //       );
  //       return false;
  //     }
  //   },
  //   [dispatch, t, sendVerificationEmail]
  // );

  const handleVerifyEmail = useCallback(
    async (oobCode: string) => {
      console.log("Début de handleVerifyEmail avec oobCode:", oobCode);
      try {
        const result = await verifyEmail( oobCode ).unwrap();
        console.log("Résultat de verifyEmail:", result);
  
        if (result.success && result.user) {
          console.log("Mise à jour de l'utilisateur dans le store");
          dispatch(setUser(result.user));
          dispatch(
            addToast({
              message: t("verifyEmail.success"),
              type: "success",
            })
          );
          return true;
        } else {
          throw new Error("Échec de la vérification de l'e-mail");
        }
      } catch (error) {
        console.error("Erreur dans handleVerifyEmail:", error);
        dispatch(
          addToast({
            message: t("verifyEmail.error"),
            type: "error",
          })
        );
        return false;
      }
    },
    [dispatch, t, verifyEmail]
  );

  const handleVerifyNewEmail = useCallback(
    async (oobCode: string) => {
      console.log("Début de handleVerifyNewEmail avec oobCode:", oobCode);
      try {
        const result = await verifyNewEmail({ oobCode }).unwrap();
        console.log("Résultat de verifyNewEmail:", result);

        if (result.success && result.user) {
          console.log("Mise à jour de l'utilisateur dans le store");
          dispatch(setUser(result.user));
          dispatch(
            addToast({
              message: t("editEmail.success"),
              type: "success",
            })
          );
          return true;
        } else {
          throw new Error("Échec de la vérification de l'e-mail");
        }
      } catch (error) {
        console.error("Erreur dans handleVerifyNewEmail:", error);
        dispatch(
          addToast({
            message: t("editEmail.error.update"),
            type: "error",
          })
        );
        return false;
      }
    },
    [dispatch, t, verifyNewEmail]
  );

  const handleResetPassword = useCallback(
    async (oobCode: string, newPassword: string) => {
      console.log("handleResetPassword called with oobCode:", oobCode);
      try {
        const result = await resetPassword({ oobCode, newPassword }).unwrap();
        if (result.success) {
          dispatch(
            addToast({
              message: t("resetPassword.success"),
              type: "success",
            })
          );
          return true;
        } else {
          throw new Error("Password reset failed");
        }
      } catch (error) {
        console.error("Error resetting password:", error);
        dispatch(
          addToast({
            message: t("resetPassword.error"),
            type: "error",
          })
        );
        return false;
      }
    },
    [dispatch, t, resetPassword]
  );

  // const handleResendVerificationEmail = useCallback(
  //   async (email: string) => {
  //     try {
  //       await sendVerificationEmail({ newEmail: email, password: "" }).unwrap();
  //       dispatch(
  //         addToast({
  //           message: t("editEmail.verificationResent"),
  //           type: "success",
  //         })
  //       );
  //     } catch (error) {
  //       console.error("Error resending verification email:", error);
  //       dispatch(
  //         addToast({
  //           message: t("editEmail.error.resendVerification"),
  //           type: "error",
  //         })
  //       );
  //     }
  //   },
  //   [dispatch, t, sendVerificationEmail]
  // );

  return {
    // handleSendVerificationEmail,
    handleVerifyNewEmail,
    handleResetPassword,
    // handleResendVerificationEmail,
    handleVerifyEmail,
  };
};
