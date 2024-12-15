import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/authentication/authSelectors';
import { useGetContactsQuery } from '../services/api';

export const useRehydrateContacts = () => {
  const user = useSelector(selectUser);
  const { refetch } = useGetContactsQuery(user?.uid ?? '', { skip: !user });

  useEffect(() => {
    if (user) {
      refetch();
    }
  }, [user, refetch]);
};