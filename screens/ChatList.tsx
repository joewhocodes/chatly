import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { auth, db } from '../firebase/firebase';

import {
	collection,
	doc,
	addDoc,
	getDoc,
	orderBy,
	query,
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

const ChatList = ({ navigation }: ChatListScreenProps) => {

	const handleCreateNewChat = () => {
		const newChatName = uniqueNamesGenerator({
			dictionaries: [adjectives, animals],
			length: 2,
		});
		setDoc(doc(db, 'newChats', newChatName), {});
		console.log('new chat created');
	};

	// console.log(db.collection('chats'))
	  
	return (
		<>
			<Text style={{ fontWeight: 'bold', fontSize: 18 }}>New User</Text>
			{auth.currentUser && <Text>{auth.currentUser.displayName}</Text>}
			<TouchableOpacity onPress={() => navigation.navigate('Chat', {
              itemId: 86,
              otherParam: 'anything you want here',
            })}>
				<Text>Go to Chat</Text>
			</TouchableOpacity>
			<TouchableOpacity onPress={handleCreateNewChat}>
				<Text>Create new chat</Text>
			</TouchableOpacity>
		</>
	);
};

export default ChatList;
