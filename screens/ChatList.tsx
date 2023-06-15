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
	const [chats, setChats] = useState<{ chatId: string, chatName: string }[]>([]);

	const handleCreateNewChat = () => {
		const newChatName = uniqueNamesGenerator({
			dictionaries: [adjectives, animals],
			length: 2,
		});

		const dbRef = doc(collection(db, 'chats'));
		setDoc(dbRef, { name: newChatName });
		console.log('new chat created');
	};

	useLayoutEffect(() => {
		const dbRef = collection(db, 'chats');
		const allChatDocuments = onSnapshot(dbRef, docsSnap => {

			const chatArray: { chatId: string, chatName: string }[] = [];
			docsSnap.forEach(doc => {
				const data = doc.data()
				const chat = {
					chatId: doc.id,
					chatName: doc.data().name
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
			{!!chats.length &&
				chats.map(chat => (
					<TouchableOpacity
						onPress={() => {
							navigation.navigate('Chat', {
								chatId: chat.chatId,
								chatName: chat.chatName,
							});
						}}
						key={chat.chatId}
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
