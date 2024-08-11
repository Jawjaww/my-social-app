import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { ToastWrapper, ToastContainer, ToastText } from './StyledComponents';

const Toast: React.FC = () => {
  const toasts = useSelector((state: RootState) => state.toast.toasts);

  if (toasts.length === 0) return null;

  return (
    <ToastWrapper>
      {toasts.map((toast) => (
        <ToastContainer key={toast.id} type={toast.type}>
          <ToastText>{toast.message}</ToastText>
        </ToastContainer>
      ))}
    </ToastWrapper>
  );
};

export default Toast;