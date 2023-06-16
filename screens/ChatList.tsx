import React, { useState, useRef } from 'react';
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

import { Swipeable } from 'react-native-gesture-handler';

import {
	uniqueNamesGenerator,
	adjectives,
	animals,
} from 'unique-names-generator';

import myChatData from '../data/chats';

type ChatListScreenProps = NativeStackScreenProps<StackNavigator, 'ChatList'>;

const ChatList = ({ navigation, route }: ChatListScreenProps) => {
	const [chatData, setChatData] = useState(myChatData)
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
					<Text>{item.name}</Text>
				</TouchableOpacity>
			</Swipeable>
		);
	};

	const handleCreateNewChat = async () => {
		const newChatName = uniqueNamesGenerator({
		  dictionaries: [adjectives, animals],
		  length: 2,
		  style: 'capital',
		  separator: ' ',
		});
	  
		const newChat = {
		  name: newChatName,
		  id: 'wefwvsa',
		};

		chatData.push(newChat)
	    
		try {
			navigation.navigate('Chat', {
			  id: newChat.id,
			  name: newChat.name,
			});
		} catch (error) {
		  console.log('Error creating new chat:', error);
		}
	  };
	  

	const handleDeleteChat = (id: string) => {
	};

	const handleItemPress = (chat: { id: string; name: string }) => {
		navigation.navigate('Chat', {
			id: chat.id,
			name: chat.name,
		});
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
						{myChatData.map(chat => (
								<Box
									w='90%'
									bg='white'
									rounded='md'
									shadow={7}
									key={chat.name}>
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
