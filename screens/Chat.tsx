import React, { useState, useLayoutEffect, useCallback, useEffect } from 'react';
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
	updateDoc,
} from 'firebase/firestore';
import { StackNavigator } from '../components/Navigation/Types';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';

type ChatScreenProps = NativeStackScreenProps<StackNavigator, 'Chat'>;

const Chat = ({ navigation, route }: ChatScreenProps) => {
	const [messages, setMessages] = useState<IMessage[]>([]);
	const [currentUser, setCurrentUser] = useState(auth.currentUser!);

	const currentUserName: string | undefined = currentUser?.displayName || 'Unknown User';
	const currentAvatar: string | undefined = currentUser?.photoURL || 'Unknown photo';
	
	useLayoutEffect(() => {
		// const docSnap = await getDoc(docRef);
		
		// const q = query(collectionRef, orderBy('createdAt', 'desc'));
		
		const docRef = doc(db, 'chats', route.params.chatName);
		// console.log(`docRef: ${docRef}`)
		const chatLog = onSnapshot(docRef, docsSnap => {
			// const doc = getDoc(docRef)
			// console.log(docsSnap.data)
			const messagesArray: { chatName: string }[] = [];
			// docsSnap.forEach(doc => {
			// 	const chat = {
			// 		chatName: doc.id,
			// 	};
			// 	messagesArray.push(chat);
			// });
			// setChats(messagesArray);

			
			// setMessages(
			// 	querySnapshot.docs.map(doc => ({
			// 		_id: doc.data()._id,
			// 		createdAt: doc.data().createdAt.toDate(),
			// 		text: doc.data().text,
			// 		user: doc.data().user,
			// 	}))
			// );
		});
		return chatLog;
	}, []);

	useLayoutEffect(() => {
		const collectionRef = collection(db, `chats/${route.params.chatName}/messages`);
		const q = query(collectionRef, orderBy('createdAt', 'desc'));
		
		const unsubscribe = onSnapshot(q, querySnapshot => {
			setMessages(
				querySnapshot.docs.map(doc => ({
					_id: doc.data()._id,
					createdAt: doc.data().createdAt.toDate(),
					text: doc.data().text,
					user: doc.data().user,
				}))
			);
			
		});
		return unsubscribe;
	}, []);

	useLayoutEffect(() => {
		handleGetData()
	})

	const handleGetData = async () => {
		try {
			const docRef = doc(db, 'chats', route.params.chatName);
			const docSnap = await getDoc(docRef);
			console.log(docSnap.data());
		} catch(error) {
			console.log(error)
		}
	};
	
	const onSend = useCallback((messages: IMessage[]) => {
		setMessages(previousMessages =>
			GiftedChat.append(previousMessages, messages)
		);
		const { _id, createdAt, text, user } = messages[0];
		addDoc(collection(db, `chats/${route.params.chatName}/messages`), {
			_id,
			createdAt,
			text,
			user,
		});
	}, []);

	return (
		<>
			<Text style={{ fontWeight: 'bold', fontSize: 18 }}>{route.params.chatName}</Text>
			{auth.currentUser && <Text>{auth.currentUser.displayName}</Text>}
			<TouchableOpacity onPress={() => navigation.navigate('ChatList')}>
				<Text>Go to ChatList</Text>
			</TouchableOpacity>
			<GiftedChat
				messages={messages}
				showAvatarForEveryMessage={false}
				showUserAvatar={true}
				onSend={messages => onSend(messages)}
				messagesContainerStyle={{
					backgroundColor: '#fff',
				}}
				user={{
					_id: currentUserName,
					avatar: 'https://i.pravatar.cc/300',
				  }}
			/>
		</>
	);
};

export default Chat;
