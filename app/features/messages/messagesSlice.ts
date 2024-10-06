import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { IMessage } from 'react-native-gifted-chat';
interface MessagesState {
  conversations: { [userId: string]: IMessage[] };
  onlineUsers: string[];
  typingUsers: { [userId: string]: boolean };
}

const initialState: MessagesState = {
  conversations: {},
  onlineUsers: [],
  typingUsers: {},
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
    setOnlineUsers: (state, action: PayloadAction<string[]>) => {
      state.onlineUsers = action.payload;
    },
    setTypingStatus: (state, action: PayloadAction<{ userId: string; isTyping: boolean }>) => {
      const { userId, isTyping } = action.payload;
      state.typingUsers[userId] = isTyping;
    },
  },
});

export const { addMessage, setConversation, setOnlineUsers, setTypingStatus } = messagesSlice.actions;
export default messagesSlice.reducer;