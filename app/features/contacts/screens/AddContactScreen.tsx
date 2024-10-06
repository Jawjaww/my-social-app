import React, {useState} from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useGetUidByUsernameQuery, useAddContactMutation } from '../../../services/api';
import { selectUser } from '../../authentication/authSelectors';
import { useContacts } from '../../../hooks/useContacts';
import { addToast } from '../../toast/toastSlice';
import { ContactsStackParamList, Contact } from '../../../types/sharedTypes';
import {
  Input,
  Button,
  ButtonText,
  ErrorText,
} from '../../../components/StyledComponents';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { View, StyleSheet } from 'react-native';
import { Controller } from 'react-hook-form';

interface FormData {
  username: string;
}

const schema = yup.object().shape({
  username: yup
    .string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must not exceed 30 characters')
});

const AddContactScreen: React.FC = () => {
  const { control, handleSubmit, formState: { errors }, setError } = useForm<FormData>({
    resolver: yupResolver(schema)
  });
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<ContactsStackParamList>>();
  const user = useSelector(selectUser);
  const { contacts } = useContacts();
  const dispatch = useDispatch();
  const [addContact] = useAddContactMutation();
  const [searchUsername, setSearchUsername] = useState<string>('');

  const { data: uidData, error: uidError } = useGetUidByUsernameQuery(searchUsername, { skip: searchUsername.length === 0 });

  const onSubmit = async (data: FormData) => {
    if (!user) {
      dispatch(addToast({ type: 'error', message: 'You must be logged in to add contacts' }));
      return;
    }

    setSearchUsername(data.username);

    if (uidError) {
      dispatch(addToast({ type: 'error', message: 'Error searching for user. Please try again.' }));
      return;
    }

    if (!uidData || !uidData.exists || !uidData.uid) {
      setError('username', { type: 'manual', message: 'User not found' });
      return;
    }

    const contactAlreadyAdded = Object.values(contacts).some(
      (contact: Contact) => contact.contactUid === uidData.uid
    );

    if (contactAlreadyAdded) {
      setError('username', { type: 'manual', message: 'Contact already added' });
      return;
    }

    if (uidData.uid === user.uid) {
      setError('username', { type: 'manual', message: 'You cannot add yourself as a contact' });
      return;
    }

    try {
      await addContact({ uid: user.uid, contactUid: uidData.uid }).unwrap();
      dispatch(addToast({ type: 'success', message: 'Contact added successfully' }));
      navigation.navigate('ContactList');
    } catch (error) {
      console.error('Error adding contact:', error);
      dispatch(addToast({ type: 'error', message: 'Failed to add contact. Please try again.' }));
    }
  };

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            placeholder={t('contacts.usernamePlaceholder')}
            onBlur={onBlur}
            onChangeText={(text) => {
              onChange(text);
              setSearchUsername(text);
            }}
            value={value}
          />
        )}
        name="username"
        defaultValue=""
      />
      {errors.username && <ErrorText>{errors.username.message}</ErrorText>}
      
      <Button onPress={handleSubmit(onSubmit)}>
        <ButtonText>{t('contacts.addButton')}</ButtonText>
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
});

export default AddContactScreen;