import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store/store';

const selectContactProfilesState = (state: RootState) => state.contactProfiles;

export const selectContactProfile = (contactUid: string) => 
  createSelector(
    [selectContactProfilesState],
    (contactProfiles) => contactProfiles[contactUid]
  );

export const selectContactProfileLoadingStatus = (contactUid: string) =>
  createSelector(
    [selectContactProfilesState],
    (contactProfiles) => {
      const profile = contactProfiles[contactUid];
      return {
        isLoading: profile === 'loading',
        isError: profile === 'error',
        isLoaded: profile && profile !== 'loading' && profile !== 'error',
      };
    }
  );