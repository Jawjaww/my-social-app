import styled from "@emotion/native";

export const Container = styled.View`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.xl}px;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const Header = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.large}px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

export const Input = styled.TextInput`
  background-color: white;
  padding: ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.borderRadius.medium}px;
  font-size: ${({ theme }) => theme.fontSizes.medium}px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
`;

export const Button = styled.TouchableOpacity<{
  variant?: "primary" | "secondary";
}>`
  background-color: ${({ theme, variant }) =>
    variant === "secondary"
      ? theme.colors.secondary
      : theme.colors.primary};
  padding: ${({ theme }) => theme.spacing.md}px;
  border-radius: ${({ theme }) => theme.borderRadius.medium}px;
  align-items: center;
  justify-content: center;
  margin-vertical: ${({ theme }) => theme.spacing.sm}px;
  elevation: 3;
`;

export const ButtonText = styled.Text`
  color: white;
  font-size: ${({ theme }) => theme.fontSizes.medium}px;
  font-weight: bold;
`;

export const ErrorText = styled.Text`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.fontSizes.small}px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

export const LinkText = styled.Text`
  color: ${({ theme }) => theme.colors.link};
  font-size: ${({ theme }) => theme.fontSizes.medium}px;
  text-decoration: underline;
  margin-vertical: ${({ theme }) => theme.spacing.sm}px;
`;

export const Spacing = styled.View<{ size?: "sm" | "md" | "lg" }>`
  margin-vertical: ${({ theme, size }) => theme.spacing[size || "md"]}px;
`;

export const ToastWrapper = styled.View`
  position: absolute;
  bottom: 50px;
  left: 20px;
  right: 20px;
  z-index: 9999;
`;

export const ToastContainer = styled.View<{ type: "success" | "error" }>`
  background-color: ${({ type }) =>
    type === "success"
      ? "rgba(201, 201, 201, 0.95)"
      : "rgba(201, 201, 201, 0.95)"};
  padding: 17px;
  border-radius: 24px;
`;

export const ToastText = styled.Text`
  color: white;
  font-size: ${({ theme }) => theme.fontSizes.small}px;
`;