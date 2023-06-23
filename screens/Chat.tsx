import React, { useState, useEffect, useCallback } from 'react';
import { TextInputChangeEventData, NativeSyntheticEvent } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Box, Button, FormControl, Input, Modal } from 'native-base';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';

import { addDoc, collection, doc, updateDoc, orderBy, query, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';

import { StackNavigator } from '../components/Navigation/Types';
import ChatHeader from '../components/ChatHeader';

type ChatScreenProps = NativeStackScreenProps<StackNavigator, 'Chat'>;

const Chat = ({ navigation, route }: ChatScreenProps) => {
	const [messages, setMessages] = useState<IMessage[]>([]);
	const [showModal, setShowModal] = useState(false);
	const [chatName, setChatName] = useState(route.params.chatName);
	const currentUser = auth.currentUser!;

	const currentUserName = currentUser?.displayName || 'Unknown User';
	const currentAvatar = currentUser?.photoURL || undefined;

	useEffect(() => {
		const unsubscribe = onSnapshot(
			query(
				collection(db, `chats/${route.params.chatId}/messages`),
				orderBy('createdAt', 'desc')
			),
			querySnapshot => {
				const fetchedMessages = querySnapshot.docs.map(doc => {
					const data = doc.data();
					return {
						_id: data._id,
						createdAt: data.createdAt.toDate(),
						text: data.text,
						user: data.user,
					};
				}) as IMessage[];
				setMessages(fetchedMessages);
			}
		);
		return unsubscribe;
	}, []);

	const handleOnSend = useCallback((newMessages: IMessage[]) => {
		setMessages(previousMessages =>
			GiftedChat.append(previousMessages, newMessages)
		);

		const { _id, createdAt, text, user } = newMessages[0];
		addDoc(collection(db, `chats/${route.params.chatId}/messages`), {
			_id,
			createdAt,
			text,
			user,
		});
	}, []);

	const handleUpdateName = async (newName: string) => {
		const chatDocRef = doc(db, 'chats', route.params.chatId);
		try {
			await updateDoc(chatDocRef, { name: newName });
			setShowModal(false);
			navigation.setParams({ chatName: newName });
		} catch (error) {
			console.error(error);
		}
	};

	const handleOnChange = (
		e: NativeSyntheticEvent<TextInputChangeEventData>
	): void => {
		setChatName(e.nativeEvent.text);
	};

	return (
		<Box h='100%' backgroundColor='white'>
			<ChatHeader
				navigation={navigation}
				chatName={route.params.chatName}
				setShowModal={setShowModal}
			/>

			<Modal isOpen={showModal} onClose={() => setShowModal(false)}>
				<Modal.Content maxWidth='400px'>
					<Modal.CloseButton />
					<Modal.Header>Change Chat Name</Modal.Header>
					<Modal.Body>
						<FormControl mb='3' mt='3'>
							<Input value={chatName} onChange={handleOnChange} />
						</FormControl>
					</Modal.Body>
					<Modal.Footer>
						<Button.Group space={2}>
							<Button
								variant='ghost'
								colorScheme='blueGray'
								onPress={() => {
									setChatName(route.params.chatName);
									setShowModal(false);
								}}>
								Cancel
							</Button>
							<Button onPress={() => handleUpdateName(chatName)}>
								Save
							</Button>
						</Button.Group>
					</Modal.Footer>
				</Modal.Content>
			</Modal>

			<GiftedChat
				messages={messages}
				showAvatarForEveryMessage={false}
				showUserAvatar={true}
				onSend={handleOnSend}
				messagesContainerStyle={{
					backgroundColor: '#fff',
				}}
				user={{
					_id: currentUserName,
					avatar: currentAvatar,
				}}
			/>
		</Box>
	);
};

export default Chat;
