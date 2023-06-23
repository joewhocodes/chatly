import React, { useEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { VStack, Center, Heading, Button, Flex, Box, Image, ScrollView } from 'native-base';
import { uniqueNamesGenerator, adjectives, animals } from 'unique-names-generator';

import { collection, deleteDoc, doc, onSnapshot, orderBy, query, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/firebase';

import { StackNavigator } from '../components/Navigation/Types';
import SwipeableItem from '../components/SwipeableItem';

type ChatListScreenProps = NativeStackScreenProps<StackNavigator, 'ChatList'>;

type Chat = {
	chatId: string;
	chatName: string;
	messages: any[];
};

const ChatList = ({ navigation }: ChatListScreenProps) => {
	const [chats, setChats] = useState<Chat[]>([]);

	useEffect(() => {
		const unsubscribe = onSnapshot(
			query(collection(db, 'chats'), orderBy('createdAt', 'desc')),
			docsSnap => {
				const chatArray: Chat[] = [];
				docsSnap.forEach(doc => {
					const chat: Chat = {
						chatId: doc.id,
						chatName: doc.data().name,
						messages: doc.data().messages,
					};
					chatArray.push(chat);
				});
				setChats(chatArray);
			}
		);

		return () => {
			unsubscribe();
		};
	}, []);

	const handleSelectChat = (chat: Chat) => {
		navigation.navigate('Chat', {
			chatId: chat.chatId,
			chatName: chat.chatName,
		});
	};

	const handleCreateNewChat = () => {
		const newChatName = uniqueNamesGenerator({
			dictionaries: [adjectives, animals],
			length: 2,
			style: 'capital',
			separator: ' ',
		});
		const newChat = {
			name: newChatName,
			createdAt: serverTimestamp(),
		};

		try {
			const docRef = doc(collection(db, 'chats'));
			setDoc(docRef, newChat);
			navigation.navigate('Chat', {
				chatId: docRef.id,
				chatName: newChatName,
			});
		} catch (error) {
			console.log('Error creating new chat:', error);
		}
	};

	const handleDeleteChat = (chatId: string) => {
		const docRef = doc(db, 'chats', chatId);
		deleteDoc(docRef);
	};

	return (
		<Box h='100%' backgroundColor='secondary.500'>
			<Box backgroundColor={'primary.500'} pb={'22px'}>
				<Center mt={'20px'}>
					<Image
						source={require('../assets/logo.png')}
						alt={'logo'}
					/>
				</Center>
				<Heading
					color={'white'}
					textAlign={'center'}
					mt={'5px'}
					fontFamily={'Jua-Regular'}>
					Welcome to Chatly!
				</Heading>
			</Box>
			<ScrollView>
				<Box mb={'20px'}>
					<Flex
						direction={'row'}
						justifyContent={'space-between'}
						mt={'15px'}
						mb={'15px'}>
						<Heading
							color={'white'}
							ml={'30px'}
							fontFamily={'Jua-Regular'}>
							Chatrooms
						</Heading>
						<Button
							mr={'20px'}
							backgroundColor={'teal.500'}
							onPress={handleCreateNewChat}>
							+
						</Button>
					</Flex>
					<Center pb={'20px'}>
						<Image
							source={require('../assets/dots-white.png')}
							alt={'dots'}
						/>
					</Center>
					<VStack space={5} alignItems='center'>
						{!!chats.length &&
							chats.map(chat => (
								<Box
									w='90%'
									bg='white'
									rounded='md'
									shadow={7}
									key={chat.chatId}>
									<SwipeableItem
										item={chat}
										onDelete={() =>
											handleDeleteChat(chat.chatId)
										}
										onPress={() => handleSelectChat(chat)}
									/>
								</Box>
							))}
					</VStack>
				</Box>
			</ScrollView>
		</Box>
	);
};

export default ChatList;
