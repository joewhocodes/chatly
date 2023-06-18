import React, { useLayoutEffect, useState, useRef } from 'react';
import { TouchableOpacity, Animated } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StackNavigator } from '../components/Navigation/Types';
import {
	VStack,
	Center,
	Heading,
	Button,
	Flex,
	Box,
	Text,
	Image,
	ScrollView,
} from 'native-base';

import {
	collection,
	deleteDoc,
	doc,
	onSnapshot,
	orderBy,
	query,
	setDoc,
	serverTimestamp,
	getDoc,
} from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';

import {
	uniqueNamesGenerator,
	adjectives,
	animals,
} from 'unique-names-generator';

import SwipeableItem from '../components/SwipeableItem';

type ChatListScreenProps = NativeStackScreenProps<StackNavigator, 'ChatList'>;

const ChatList = ({ navigation, route }: ChatListScreenProps) => {
	const [chats, setChats] = useState<{ chatId: string; chatName: string, messages: any[] }[]>([]);


	const handleCreateNewChat = async () => {
		const newChatName = uniqueNamesGenerator({
		  dictionaries: [adjectives, animals],
		  length: 2,
		  style: 'capital',
		  separator: ' ',
		});
	  
		const docRef = doc(collection(db, 'chats'));
		const newChat = {
		  name: newChatName,
		  createdAt: serverTimestamp(),
		};
	  
		try {
			navigation.navigate('Chat', {
			  chatId: docRef.id,
			  chatName: newChatName,
			});
		setDoc(docRef, newChat);
		} catch (error) {
		  console.log('Error creating new chat:', error);
		}
	  };
	  

	const handleDeleteChat = (chatId: string) => {
		const docRef = doc(db, 'chats', chatId);
		deleteDoc(docRef)
			.then(() => {
				console.log('Entire Document has been deleted successfully.');
			})
			.catch(error => {
				console.log(error);
			});
	};

	const handleItemPress = (chat: { chatId: any; chatName: any }) => {
		navigation.navigate('Chat', {
			chatId: chat.chatId,
			chatName: chat.chatName,
		});
	};

	useLayoutEffect(() => {
		const dbRef = collection(db, 'chats');
		const q = query(dbRef, orderBy('createdAt', 'desc'));
		const allChatDocuments = onSnapshot(q, docsSnap => {
			const chatArray: { chatId: string; chatName: string; messages: any[] }[] = [];
			docsSnap.forEach(doc => {
			  const chat = {
				chatId: doc.id,
				chatName: doc.data().name,
				messages: doc.data().messages, // Include messages property here
			  };
			  chatArray.push(chat);
			});
			setChats(chatArray);
		});
		return allChatDocuments;
	}, []);

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
						<TouchableOpacity>
							<Button
								mr={'20px'}
								alignSelf={'end'}
								backgroundColor={'teal.500'}
								onPress={handleCreateNewChat}>
								+
							</Button>
						</TouchableOpacity>
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
										onPress={() => handleItemPress(chat)}
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
