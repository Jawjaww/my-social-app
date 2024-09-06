import React from 'react';
import { ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { useReauthenticateAndUpdateEmailMutation } from '../../../services/api';
import { addToast } from '../../toast/toastSlice';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '@emotion/react';
import { ProfileStackParamList } from '../../../types/sharedTypes';
import {
  CenteredContainer,
  Container,
  Input,
  Button,
  ButtonText,
  ErrorText,
  Card,
  CardText
} from '../../../components/StyledComponents';
import { Ionicons } from '@expo/vector-icons';

type ChangeEmailScreenNavigationProp = NativeStackNavigationProp<
  ProfileStackParamList,
  'ChangeEmail'
>;

const schema = yup.object().shape({
  newEmail: yup
    .string()
    .email('invalidEmail')
    .required('required'),
  password: yup.string().required('required'),
});

const ChangeEmailScreen: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigation = useNavigation<ChangeEmailScreenNavigationProp>();
  const dispatch = useDispatch();
  const [reauthenticateAndUpdateEmail, { isLoading }] = useReauthenticateAndUpdateEmailMutation();
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: { newEmail: string; password: string }) => {
    try {
      const result = await reauthenticateAndUpdateEmail(data).unwrap();
      if (result.success && result.emailSent) {
        navigation.navigate('ProfileHome');
        dispatch(
          addToast({
            message: t('changeEmail.emailVerificationSent'),
            type: 'success',
          })
        );
      } else {
        throw new Error('emailNotSent');
      }
    } catch (err: any) {
      const errorMessage = err.error || t('changeEmail.genericError');
      dispatch(
        addToast({ message: t(errorMessage), type: 'error' })
      );
    }
  };

  return (
    <CenteredContainer>
      <Container>
        <Controller
          control={control}
          name="newEmail"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder={t('changeEmail.newEmail')}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          )}
        />
        {errors.newEmail && (
          <ErrorText>{t(errors.newEmail.message || '')}</ErrorText>
        )}

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder={t('changeEmail.currentPassword')}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry
            />
          )}
        />
        {errors.password && (
          <ErrorText>{t(errors.password.message || '')}</ErrorText>
        )}

        <Button onPress={handleSubmit(onSubmit)} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator size="small" color={theme.colors.buttonText} />
          ) : (
            <ButtonText>{t('changeEmail.updateButton')}</ButtonText>
          )}
        </Button>

        <Card onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.primary} />
          <CardText>{t('common.buttons.back')}</CardText>
        </Card>
      </Container>
    </CenteredContainer>
  );
};

export default ChangeEmailScreen;