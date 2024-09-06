import styled from "@emotion/native";
import FastImage from "react-native-fast-image";

export const CenteredContainer = styled.View`
  flex: 1;
  justify-content: center;
  // align-items: center;
  padding: 32px;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const ScrollContainer = styled.ScrollView`
  flex: 1;
`;

export const ContentContainer = styled.View`
  padding: 32px;
  align-items: center;
`;

export const Container = styled.View`
  background-color: ${({ theme }) => theme.colors.background};
  align-items: center;
`;

export const Header = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 16px;
`;

export const Input = styled.TextInput`
  background-color: white;
  padding: 15px;
  border-radius: 8px;
  font-size: 16px;
  margin-bottom: 16px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  width: 100%;
`;

export const Button = styled.TouchableOpacity<{
  variant?: "primary" | "secondary";
}>`
  background-color: ${({ theme, variant }) =>
    variant === "secondary" ? theme.colors.secondary : theme.colors.primary};
  padding: 15px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  margin-vertical: 8px;
  width: 100%;
  ${({ theme }) => theme.shadows.small};
`;

export const ButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: bold;
`;

export const ErrorText = styled.Text`
  color: ${({ theme }) => theme.colors.error};
  font-size: 14px;
  margin-bottom: 8px;
`;

export const LinkText = styled.Text`
  color: ${({ theme }) => theme.colors.link};
  font-size: 16px;
  text-decoration: underline;
  margin-vertical: 8px;
`;

export const Spacing = styled.View<{ size?: "sm" | "md" | "lg" }>`
  margin-vertical: ${({ size }) =>
    size === "sm" ? "8px" : size === "lg" ? "24px" : "16px"};
`;

export const AvatarContainer = styled.View`
  width: 200px;
  height: 200px;
  border-radius: 100px;
  overflow: hidden;
  margin: 16px auto;
  ${({ theme }) => theme.shadows.medium};
`;

export const AvatarImage = styled(FastImage)`
  width: 100%;
  height: 100%;
`;

export const AvatarPlaceholder = styled.View`
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.primary};
  justify-content: center;
  align-items: center;
`;

export const AvatarText = styled.Text`
  font-size: 80px;
  color: ${({ theme }) => theme.colors.background};
  font-weight: bold;
`;

export const Card = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.card};
  border-radius: 8px;
  padding: 15px;
  margin: 8px 0;
  width: 100%;
  ${({ theme }) => theme.shadows.small};
`;

export const CardText = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
  margin-left: 16px;
`;

export const ToastWrapper = styled.View`
  position: absolute;
  bottom: 50px;
  left: 20px;
  right: 20px;
  z-index: 9999;
`;

export const ToastContainer = styled.View<{ type: "success" | "error" }>`
  background-color: ${({ theme, type }) =>
    type === "success" ? theme.colors.success : theme.colors.error};
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 10px;
`;

export const ToastText = styled.Text`
  color: white;
  font-size: 14px;
`;
