import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Friend {
  id: string;
  name: string;
  avatar?: string;
}

interface FriendsState {
  list: Friend[];
}

const initialState: FriendsState = {
  list: [],
};

const friendsSlice = createSlice({
  name: 'friends',
  initialState,
  reducers: {
    setFriends: (state, action: PayloadAction<Friend[]>) => {
      state.list = action.payload;
    },
    addFriend: (state, action: PayloadAction<Friend>) => {
      state.list.push(action.payload);
    },
    removeFriend: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter(friend => friend.id !== action.payload);
    },
  },
});

export const { setFriends, addFriend, removeFriend } = friendsSlice.actions;
export default friendsSlice.reducer;