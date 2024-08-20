import styled from "@emotion/native";
import {
  Container,
  Header,
  Input,
  Button,
  ButtonText,
  ErrorText,
  LinkText,
} from "../components/StyledComponents";

export const FormContainer = styled(Container)`
  padding: ${({ theme }) => theme.spacing.xl}px;
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const FormHeader = styled(Header)`
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
  padding: 5px;
  margin: 20px 25px 10px 25px;
  text-align: center;
`;

export const FormInput = styled(Input)`
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
  // padding: ${({ theme }) => theme.spacing.md}px;
  height: ${({ theme }) => theme.inputHeight}px;
  border-radius: ${({ theme }) => theme.borderRadius.medium}px;
  border-color: ${({ theme }) => theme.colors.border};
  border-radius: 3px;
  padding: 8px;
  margin: 8px 0px 8px 0px;
  width: 80%;
`;

export const FormButton = styled(Button)`
  margin-top: ${({ theme }) => theme.spacing.lg}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  height: ${({ theme }) => theme.inputHeight}px;
  border-radius: ${({ theme }) => theme.borderRadius.medium}px;
  border-radius: 3px;
  padding: 5px;
  margin: 15px 25px 8px 25px;
  width: 80%;
`;

export const FormButtonText = styled(ButtonText)`
  font-size: ${({ theme }) => theme.fontSizes.medium}px;
  border-radius: 3px;
  padding: 5px;
`;

export const FormErrorText = styled(ErrorText)`
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
  padding: 0px 0px 15px 0px;
  margin: 0px 15px 10px 15px;
`;

export const FormLinkText = styled(LinkText)`
  margin-top: ${({ theme }) => theme.spacing.md}px;
  font-size: ${({ theme }) => theme.fontSizes.medium}px;
  padding: 5px;
  margin: 8px 25px 12px 25px;
  text-align: center;
`;

export const FormMessage = styled.Text`
  font-size: 18px;
  text-align: center;
  margin-bottom: 20px;
`;


