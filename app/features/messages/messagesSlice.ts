import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IMessage } from 'react-native-gifted-chat';

interface MessagesState {
  conversations: { [userId: string]: IMessage[] };
}

const initialState: MessagesState = {
  conversations: {},
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<{ userId: string; message: IMessage }>) => {
      const { userId, message } = action.payload;
      if (!state.conversations[userId]) {
        state.conversations[userId] = [];
      }
      state.conversations[userId].unshift(message);
    },
    setConversation: (state, action: PayloadAction<{ userId: string; messages: IMessage[] }>) => {
      const { userId, messages } = action.payload;
      state.conversations[userId] = messages;
    },
  },
});

export const { addMessage, setConversation } = messagesSlice.actions;
export default messagesSlice.reducer;