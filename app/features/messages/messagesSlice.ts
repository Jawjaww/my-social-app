import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IMessage } from '../../types/sharedTypes';

interface MessagesState {
  messages: { [channelId: string]: IMessage[] };
}

const initialState: MessagesState = {
  messages: {},
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<IMessage>) => {
      const { channelId } = action.payload;
      if (!state.messages[channelId]) {
        state.messages[channelId] = [];
      }
      const messageWithTimestamp = {
        ...action.payload,
        createdAt: typeof action.payload.createdAt === 'number'
          ? action.payload.createdAt
          : new Date(action.payload.createdAt).getTime(),
      };
      state.messages[channelId].unshift(messageWithTimestamp);
    },
    setMessages: (state, action: PayloadAction<{ channelId: string; messages: IMessage[] }>) => {
      const { channelId, messages } = action.payload;
      state.messages[channelId] = messages.map(message => ({
        ...message,
        createdAt: typeof message.createdAt === 'number'
          ? message.createdAt
          : new Date(message.createdAt).getTime(),
      }));
    },
  },
});

export const { addMessage, setMessages } = messagesSlice.actions;
export default messagesSlice.reducer;
