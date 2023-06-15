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
	View,
} from 'native-base';

import { Swipeable } from 'react-native-gesture-handler';

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
import { auth, db } from '../firebase/firebase';

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
	const [isSwiping, setIsSwiping] = useState(false);

	const SwipeableItem = ({ item, onDelete, onPress }) => {
		const swipeableRef = useRef(null);

		const handleSwipeStart = () => {
			setIsSwiping(true); 
		};

		const handleSwipeRelease = () => {
			setIsSwiping(false);
		};

		const handlePress = () => {
			if (!isSwiping) {
				onPress();
			}
		};

		const renderLeftActions = (progress, dragX) => {
			const onDeletePress = () => {
				onDelete(item.chatId);
			};

			const trans = dragX.interpolate({
				inputRange: [0, 100],
				outputRange: [0, 1],
				extrapolate: 'clamp',
			  });

			return (
				<TouchableOpacity onPress={onDeletePress}>
					<Animated.View
						style={{
							backgroundColor: 'red',
							justifyContent: 'center',
							alignItems: 'flex-end',
							padding: 20,
							opacity: trans,
						}}>
						<Text style={{ color: 'white' }}>Delete</Text>
					</Animated.View>
				</TouchableOpacity>
			);
		};

		return (
			<Swipeable
				ref={swipeableRef}
				renderLeftActions={renderLeftActions}
				onSwipeableWillOpen={handleSwipeStart}
				onSwipeableWillClose={handleSwipeRelease}
				onSwipeableWillTransition={handleSwipeRelease} // Add this event handler
			>
				<TouchableOpacity
					activeOpacity={1}
					onPress={handlePress}
					style={{ backgroundColor: 'white', padding: 20 }}>
					<Text>{item.chatName}</Text>
				</TouchableOpacity>
			</Swipeable>
		);
	};

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
				<Box>
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
