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
        createdAt: action.payload.createdAt instanceof Date 
          ? action.payload.createdAt.getTime() 
          : action.payload.createdAt,
      };
      state.messages[channelId].unshift(messageWithTimestamp);
    },
    setMessages: (state, action: PayloadAction<{ channelId: string; messages: IMessage[] }>) => {
      const { channelId, messages } = action.payload;
      state.messages[channelId] = messages.map(message => ({
        ...message,
        createdAt: message.createdAt instanceof Date 
          ? message.createdAt.getTime() 
          : message.createdAt,
      }));
    },
  },
});

export const { addMessage, setMessages } = messagesSlice.actions;
export default messagesSlice.reducer;
