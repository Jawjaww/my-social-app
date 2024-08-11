import styled from '@emotion/native';
import { Theme } from '@emotion/react';

// Container component with full screen height and default background and padding
export const Container = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.colors.background};
  padding: ${(props) => props.theme.spacing.lg}px;
`;

// Header text with large font size and bold weight
export const Header = styled.Text`
  font-size: ${(props) => props.theme.fontSizes.large}px;
  font-weight: bold;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: ${(props) => props.theme.spacing.md}px;
`;

// Input field styling with white background, border, and padding
export const Input = styled.TextInput`
  background-color: white;
  padding: ${(props) => props.theme.spacing.md}px;
  border-radius: ${(props) => props.theme.borderRadius.medium}px;
  font-size: ${(props) => props.theme.fontSizes.medium}px;
  margin-bottom: ${(props) => props.theme.spacing.md}px;
  border-width: 1px;
  border-color: ${(props) => props.theme.colors.border};
`;

// Button component with variant support (primary/secondary)
export const Button = styled.TouchableOpacity<{ variant?: 'primary' | 'secondary' }>`
  background-color: ${(props) => 
    props.variant === 'secondary' 
      ? props.theme.colors.secondary 
      : props.theme.colors.primary};
  padding: ${(props) => props.theme.spacing.md}px;
  border-radius: ${(props) => props.theme.borderRadius.medium}px;
  align-items: center;
  justify-content: center;
  margin-vertical: ${(props) => props.theme.spacing.sm}px;
  elevation: 3;
`;

// Text inside buttons with bold weight and white color
export const ButtonText = styled.Text`
  color: white;
  font-size: ${(props) => props.theme.fontSizes.medium}px;
  font-weight: bold;
`;

// Error message text in red
export const ErrorText = styled.Text`
  color: ${(props) => props.theme.colors.error};
  font-size: ${(props) => props.theme.fontSizes.small}px;
  margin-bottom: ${(props) => props.theme.spacing.sm}px;
`;

// Link text with underline decoration and blue color
export const LinkText = styled.Text`
  color: ${(props) => props.theme.colors.link};
  font-size: ${(props) => props.theme.fontSizes.medium}px;
  text-decoration: underline;
  margin-vertical: ${(props) => props.theme.spacing.sm}px;
`;

// Spacing component for vertical space between elements
export const Spacing = styled.View<{ size?: 'sm' | 'md' | 'lg' }>`
  margin-vertical: ${(props) => props.theme.spacing[props.size || 'md']}px;
`;

// Wrapper for toast messages with absolute positioning
export const ToastWrapper = styled.View`
  position: absolute;
  top: 50px;
  left: 20px;
  right: 20px;
  z-index: 9999;
`;

// Container for toast messages with dynamic background color based on type
export const ToastContainer = styled.View<{ type: 'success' | 'error' }>`
  background-color: ${props => 
    props.type === 'success' 
      ? 'rgba(76, 175, 80, 0.9)' // Semi-transparent green
      : 'rgba(244, 67, 54, 0.9)' // Semi-transparent red
  };
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
`;

// Text inside toast messages with small font size and white color
export const ToastText = styled.Text`
  color: white;
  font-size: ${props => props.theme.fontSizes.small}px;
`;
