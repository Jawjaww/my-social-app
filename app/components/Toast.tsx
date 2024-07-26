import React from 'react';
import styled from '@emotion/native';

const ToastContainer = styled.View<{ type: 'success' | 'error' }>`
  padding: 10px;
  margin: 10px;
  border-radius: 5px;
  background-color: ${props => props.type === 'success' ? '#4CAF50' : '#F44336'};
`;

const ToastText = styled.Text`
  color: white;
`;

interface ToastProps {
  message: string;
  type: 'success' | 'error';
}

const Toast: React.FC<ToastProps> = ({ message, type }) => {
  return (
    <ToastContainer type={type}>
      <ToastText>{message}</ToastText>
    </ToastContainer>
  );
};

export default Toast;