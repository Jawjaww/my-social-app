import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store/store';
import { IMessage } from '../../types/sharedTypes';

export const selectMessagesByContactUid = createSelector(
  [(state: RootState) => state.messages.messages, (state: RootState, contactUid: string) => contactUid],
  (messages, contactUid): IMessage[] => {
    const channelMessages = messages[contactUid] || [];
    return Array.isArray(channelMessages) ? channelMessages : [];
  }
);

export const selectMessagesByChannelId = createSelector(
  [(state: RootState) => state.messages.messages, (state: RootState, channelId: string) => channelId],
  (messages, channelId): IMessage[] => {
    const channelMessages = messages[channelId] || [];
    return Array.isArray(channelMessages) ? channelMessages : [];
  }
);