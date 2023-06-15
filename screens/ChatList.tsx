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
import {
	VStack,
	Center,
	Heading,
	Button,
	Flex,
	Box,
	Text,
	Image,
	Divider,
	ScrollView,
} from 'native-base';
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

	console.log(auth.currentUser)

	return (
		<Box h='100%' backgroundColor='secondary.500'>
			<Box backgroundColor={'primary.500'}>
				<Center mt={'20px'}>
					<Image source={require('../assets/logo.png')} alt={'logo'}/>
				</Center>
				{auth.currentUser && (
					<>
						<Image
							source={
								auth.currentUser.photoURL
									? { uri: auth.currentUser.photoURL }
									: require('../assets/favicon.png')
							}
							alt={'user avatar'}
						/>
						<Heading
							color={'white'}
							ml={'20px'}
							fontFamily={'Jua-Regular'}>
							Hey {auth.currentUser.displayName}!!
						</Heading>
					</>
				)}
				<Center mt={'20px'} pb={'20px'}>
					<Image source={require('../assets/dots.png')} alt={'dots'}/>
				</Center>
			</Box>
			<ScrollView>
				<Box>
					<Flex
						flexDirection={'row'}
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
						<Image source={require('../assets/dots-white.png')} alt={'dots'}/>
					</Center>
					<VStack space={5} alignItems='center'>
						{!!chats.length &&
							chats.map(chat => (
								<Center
									w='90%'
									h='20'
									bg='white'
									rounded='md'
									shadow={7}
									key={chat.chatId}>
									<TouchableOpacity
										onPress={() => {
											navigation.navigate('Chat', {
												chatId: chat.chatId,
												chatName: chat.chatName,
											});
										}}>
										<Text>{chat.chatName}</Text>
									</TouchableOpacity>
								</Center>
							))}
					</VStack>
				</Box>
			</ScrollView>
		</Box>
	);
};

export default ChatList;
