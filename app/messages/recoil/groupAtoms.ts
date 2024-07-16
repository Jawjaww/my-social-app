import { atom, selector } from 'recoil';

export interface Group {
  id: string;
  name: string;
  description: string;
  image: string;
  members: string[];
  messages: { id: string; text: string; createdAt: Date; user: { _id: string; name: string; avatar: string; } }[];
}

export const groupsState = atom<Group[]>({
  key: 'groupsState',
  default: [],
});

export const newGroupNameState = atom({
  key: 'newGroupNameState',
  default: '',
});

export const newGroupDescriptionState = atom({
  key: 'newGroupDescriptionState',
  default: '',
});

export const newGroupImageState = atom({
  key: 'newGroupImageState',
  default: '',
});

export const groupsSelector = selector({
  key: 'groupsSelector',
  get: ({ get }) => {
    const groups = get(groupsState);
    return groups;
  },
});
