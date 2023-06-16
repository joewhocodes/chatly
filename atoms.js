import { atom } from 'recoil';
import chatData from './data/chats';

export const chatsState = atom({
	key: 'chats',
	default: [...chatData], // Create a copy of the chatData array
});