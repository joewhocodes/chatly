import React, { useLayoutEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
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
import { VStack, Center, Heading, Button, Flex, Box, Text, Image, Divider, ScrollView } from 'native-base';
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
		const q = query(dbRef, orderBy('createdAt', 'desc'));
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
		<Box h='100%' backgroundColor='secondary.500'>
			<Box backgroundColor={'primary.500'}>
				<Center mt={'20px'}>
					<Image source={require('../assets/logo.png')} />
				</Center>
				{auth.currentUser && (
					<Heading color={'white'} ml={'20px'} fontFamily={'Jua-Regular'}>
						Hey {auth.currentUser.displayName}!
					</Heading>
				)}
				<Center mt={'20px'} pb={'20px'}>
					<Image source={require('../assets/dots.png')} />
				</Center>
			</Box>
			<ScrollView>
				<Box>
					<Flex flexDirection={'row'} justifyContent={'space-between'} mt={'15px'} mb={'15px'}>
						<Heading  color={'white'} ml={'30px'} fontFamily={'Jua-Regular'}>
							Chatrooms
						</Heading>
						<TouchableOpacity>
							<Button mr={'20px'} alignSelf={'end'} backgroundColor={'teal.500'} onPress={handleCreateNewChat}>
								+
							</Button>
						</TouchableOpacity>
					</Flex>
					<Center pb={'20px'}>
						<Image source={require('../assets/dots-white.png')} />
					</Center>
					{!!chats.length &&
						chats.map(chat => (
							<VStack space={5} alignItems='center' key={chat.chatId}>
								<Center
									w='90%'
									h='20'
									mt='3'
									bg='white'
									rounded='md'
									shadow={7}>
									<TouchableOpacity
										onPress={() => {
											navigation.navigate('Chat', {
												chatId: chat.chatId,
												chatName: chat.chatName,
											});
										}}>
										<Text>
											{chat.chatName}
											<TouchableOpacity
												onPress={() =>
													handleDeleteChat(chat.chatId)
												}>
												<Text>X</Text>
											</TouchableOpacity>
										</Text>
									</TouchableOpacity>
								</Center>
							</VStack>
						))}
				</Box>
			</ScrollView>
		</Box>
	);
};

export default ChatList;
