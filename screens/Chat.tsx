import React, { useState, useLayoutEffect, useCallback, useEffect } from 'react';
import {
	TouchableOpacity,
	TextInputChangeEventData,
	NativeSyntheticEvent,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { auth, db } from '../firebase/firebase';
import {
	collection,
	addDoc,
	doc,
	updateDoc,
	orderBy,
	query,
	onSnapshot,
} from 'firebase/firestore';
import { StackNavigator } from '../components/Navigation/Types';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import {
	Box,
	Button,
	Center,
	Image,
	FormControl,
	Heading,
	Input,
	Modal,
	Text,
	Flex,
} from 'native-base';

import myChatData from '../data/chats';

type ChatScreenProps = NativeStackScreenProps<StackNavigator, 'Chat'>;

const Chat = ({ navigation, route }: ChatScreenProps) => {
	const [messages, setMessages] = useState<IMessage[]>([]);
	const [showModal, setShowModal] = useState<boolean>(false);
	const [chatName, setChatName] = useState<string>('Expected Camel');
	const [currentUser, setCurrentUser] = useState(auth.currentUser!);
	const [newMessages, setNewMessages] = useState();

	const currentUserName: string | undefined =
		currentUser?.displayName || 'Unknown User';
		const currentAvatar: string | undefined =
		currentUser?.photoURL || undefined; // Assign undefined instead of 'Unknown photo'
	
		useLayoutEffect(() => {
			const findChat = myChatData.find(chat => chat.name === 'Expected Camel')?.messages;
			if (findChat) {
			  const messages: IMessage[] = findChat.map(doc => ({
				_id: doc.id,
				text: doc.text,
				user: { _id: doc.user.id_, avatar: doc.user.avatar },
				createdAt: new Date(doc.createdAt),
			  }));
			  setMessages(messages.reverse());
			}
		  }, []);

	const onSend = useCallback((messages: IMessage[]) => {
		setMessages(previousMessages =>
			GiftedChat.append(previousMessages, messages)
		);
		const { _id, createdAt, text, user } = messages[0];
		addDoc(collection(db, `chats/${route.params.id}/messages`), {
			_id,
			createdAt,
			text,
			user,
		});
	}, []);

	const handleUpdateName = (oldName: string, newName: string) => {
		const docRef = doc(db, 'chats', route.params.chatId);

		const unsubscribe = onSnapshot(docRef, docSnapshot => {
			if (docSnapshot.exists()) {
				updateDoc(docRef, { name: newName })
					.then(() => {
						console.log('Name updated successfully!');
						setShowModal(false);
						navigation.setParams({ chatName: newName }); // Update route.params.chatName
					})
					.catch(error => {
						console.error('Error updating name:', error);
					});
			}
		});

		return unsubscribe;
	};

	const onChange = (
		e: NativeSyntheticEvent<TextInputChangeEventData>
	): void => {
		setChatName(e.nativeEvent.text);
	};

	return (
		<Box h='100%' backgroundColor='white'>
			<Box backgroundColor={'primary.500'}>
				<Box mt={'20px'}>
					<Flex direction='row' justifyContent={'space-between'}>
						<Box>
							<TouchableOpacity
								onPress={() => navigation.navigate('ChatList')}>
							<Image 
								source={require('../assets/back-arrow.png')}
								alt={'back arrow'}
								mt='7px'
							/>
							</TouchableOpacity>
						</Box>
						<Image 
							source={require('../assets/logo.png')}
							alt={'logo'}
							mr={'45px'}
						/>
						<Text></Text>
					</Flex>
					<Center>
						<Heading color={'white'} fontFamily={'Jua-Regular'}>
							{route.params.name}
						</Heading>
						<TouchableOpacity onPress={() => setShowModal(true)}>
							<Text color='white' fontFamily={'Jua-Regular'}>
								Tap to change name
							</Text>
						</TouchableOpacity>
					</Center>
				</Box>
			</Box>

			<Modal isOpen={showModal} onClose={() => setShowModal(false)}>
				<Modal.Content maxWidth='400px'>
					<Modal.CloseButton />
					<Modal.Header>Change Chat Name</Modal.Header>
					<Modal.Body>
						<FormControl mb='3' mt='3'>
							<Input value={chatName} onChange={onChange} />
						</FormControl>
					</Modal.Body>
					<Modal.Footer>
						<Button.Group space={2}>
							<Button
								variant='ghost'
								colorScheme='blueGray'
								onPress={() => {
									setChatName(route.params.name);
									setShowModal(false);
								}}>
								Cancel
							</Button>
							<Button
								onPress={() => {
									handleUpdateName(
										route.params.name,
										chatName
									);
								}}>
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
				onSend={messages => onSend(messages)}
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
