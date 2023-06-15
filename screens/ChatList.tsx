import React, { useLayoutEffect, useState } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { auth, db } from '../firebase/firebase';

import {
	collection,
	deleteDoc,
	doc,
	onSnapshot,
	orderBy,
	query,
	setDoc,
	serverTimestamp,
} from 'firebase/firestore';
import { StackNavigator } from '../components/Navigation/Types';
import {
	uniqueNamesGenerator,
	adjectives,
	animals,
} from 'unique-names-generator';

type ChatListScreenProps = NativeStackScreenProps<StackNavigator, 'ChatList'>;

const ChatList = ({ navigation, route }: ChatListScreenProps) => {
	const [chats, setChats] = useState<{ chatId: string; chatName: string }[]>(
		[]
	);

	const handleCreateNewChat = () => {
		const newChatName = uniqueNamesGenerator({
			dictionaries: [adjectives, animals],
			length: 2,
			style: 'capital',
			separator: ' ',
		});
		const dbRef = doc(collection(db, 'chats'));
		setDoc(dbRef, { name: newChatName, createdAt: serverTimestamp() });
	};

	const handleDeleteChat = (chatId: string) => {
		console.log(chatId);
		const docRef = doc(db, 'chats', chatId); // Update the document reference path
		deleteDoc(docRef)
			.then(() => {
				console.log('Entire Document has been deleted successfully.');
			})
			.catch(error => {
				console.log(error);
			});
		console.log('test');
	};

	useLayoutEffect(() => {
		const dbRef = collection(db, 'chats');
		const q = query(dbRef, orderBy('createdAt'));
		const allChatDocuments = onSnapshot(q, docsSnap => {
			const chatArray: { chatId: string; chatName: string }[] = [];
			docsSnap.forEach(doc => {
				const chat = {
					chatId: doc.id,
					chatName: doc.data().name,
				};
				chatArray.push(chat);
			});
			setChats(chatArray);
		});
		return allChatDocuments;
	}, []);

	return (
		<>
			{auth.currentUser && (
				<Text>Welcome {auth.currentUser.displayName}!</Text>
			)}
			{!!chats.length &&
				chats.map(chat => (
					<TouchableOpacity
						onPress={() => {
							navigation.navigate('Chat', {
								chatId: chat.chatId,
								chatName: chat.chatName,
							});
						}}
						key={chat.chatId}>
						<Text>
							{chat.chatName}
							<TouchableOpacity
								onPress={() => handleDeleteChat(chat.chatId)}>
								<Text>X</Text>
							</TouchableOpacity>
						</Text>
					</TouchableOpacity>
				))}
			<TouchableOpacity onPress={handleCreateNewChat}>
				<Text style={{ fontWeight: 'bold', fontSize: 18 }}>
					Create new chat
				</Text>
			</TouchableOpacity>
		</>
	);
};

export default ChatList;
