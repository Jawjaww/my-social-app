import { RootState } from '../../store/store';
import { IMessage } from '../../types/sharedTypes';

export const selectMessagesByContactUid = (state: RootState, contactUid: string): IMessage[] => {
  return state.messages.messages[contactUid] || [];
};