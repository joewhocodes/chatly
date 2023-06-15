import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { auth, db } from '../firebase/firebase';

import {
	collection,
	doc,
	getDoc,
	onSnapshot,
	setDoc,
} from 'firebase/firestore';
import { StackNavigator } from '../components/Navigation/Types';
import {
	uniqueNamesGenerator,
	adjectives,
	animals,
} from 'unique-names-generator';

type ChatListScreenProps = NativeStackScreenProps<StackNavigator, 'ChatList'>;

const ChatList = ({ navigation, route }: ChatListScreenProps) => {
	const [chats, setChats] = useState<{ chatName: string }[]>([]);

	const handleCreateNewChat = () => {
		const newChatName = uniqueNamesGenerator({
			dictionaries: [adjectives, animals],
			length: 2,
		});
		const data = {
			name: newChatName,
			// messages: [],
		};

		const dbRef = doc(collection(db, 'chats'));
		setDoc(dbRef, data);
		console.log('new chat created');
	};

	useLayoutEffect(() => {
		const dbRef = collection(db, 'chats');
		const allChatDocuments = onSnapshot(dbRef, docsSnap => {
			const chatArray: { chatName: string }[] = [];
			docsSnap.forEach(doc => {
				const chat = {
					chatName: doc.id,
				};
				chatArray.push(chat);
			});
			setChats(chatArray);
		});
		return allChatDocuments;
	}, []);

	return (
		<>
			<Text style={{ fontWeight: 'bold', fontSize: 18 }}>New User</Text>
			{auth.currentUser && <Text>{auth.currentUser.displayName}</Text>}
			<TouchableOpacity
				onPress={() =>
					navigation.navigate('Chat', {
						chatName: '',
					})
				}>
				<Text>Go to Chat</Text>
			</TouchableOpacity>
			{!!chats.length &&
				chats.map(chat => (
					<TouchableOpacity
						onPress={() => {
							navigation.navigate('Chat', {
								chatName: chat.chatName,
							});
						}}
						key={chat.chatName}
					>
						<Text>{chat.chatName}</Text>
					</TouchableOpacity>
				))}
			<TouchableOpacity onPress={handleCreateNewChat}>
				<Text>Create new chat</Text>
			</TouchableOpacity>
		</>
	);
};

export default ChatList;
