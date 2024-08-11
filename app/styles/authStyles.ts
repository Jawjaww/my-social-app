import styled from '@emotion/native';
import { Theme } from '@emotion/react';
import { Container, Input, Button, ButtonText, LinkText } from '../components/StyledComponents';

export const AuthContainer = styled(Container)`
  justify-content: center;
  padding: ${(props: { theme: Theme }) => props.theme.spacing.lg}px;
`;

export const AuthInput = styled(Input)`
  margin-bottom: ${(props: { theme: Theme }) => props.theme.spacing.md}px;
  height: ${(props: { theme: Theme }) => props.theme.inputHeight}px;
  border-radius: ${(props: { theme: Theme }) => props.theme.borderRadius.medium}px;
  border-color: ${(props: { theme: Theme }) => props.theme.colors.border};
  padding-horizontal: ${(props: { theme: Theme }) => props.theme.spacing.md}px;
`;

export const AuthButton = styled(Button)`
  margin-top: ${(props: { theme: Theme }) => props.theme.spacing.md}px;
  background-color: ${(props: { theme: Theme }) => props.theme.colors.buttonBackground};
  height: ${(props: { theme: Theme }) => props.theme.inputHeight}px;
  border-radius: ${(props: { theme: Theme }) => props.theme.borderRadius.medium}px;
`;

export const AuthButtonText = styled(ButtonText)`
  font-size: ${(props: { theme: Theme }) => props.theme.fontSizes.medium}px;
  color: ${(props: { theme: Theme }) => props.theme.colors.buttonText};
`;

export const AuthLinkText = styled(LinkText)`
  margin-top: ${(props: { theme: Theme }) => props.theme.spacing.md}px;
  text-align: center;
  color: ${(props: { theme: Theme }) => props.theme.colors.link};
  font-size: ${(props: { theme: Theme }) => props.theme.fontSizes.link}px;
`;

export const ErrorText = styled.Text`
  color: ${(props: { theme: Theme }) => props.theme.colors.error};
  font-size: ${(props: { theme: Theme }) => props.theme.fontSizes.small}px;
  margin-bottom: ${(props: { theme: Theme }) => props.theme.spacing.sm}px;
`;