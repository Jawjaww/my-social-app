import React, { ReactNode } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Toast from '../components/Toast';
import { removeToast } from '../features/toast/toastSlice';
import { RootState } from '../store';

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const dispatch = useDispatch();
  const toasts = useSelector((state: RootState) => state.toast.toasts);

  React.useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        dispatch(removeToast(toasts[0].id));
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [toasts, dispatch]);

  return (
    <>
      {children}
      <Toast />
    </>
  );
};