import React from 'react';
import { TouchableOpacity } from 'react-native';
import { VStack, Center, Heading, Button, Flex, Box, Image, ScrollView } from 'native-base';
import { uniqueNamesGenerator, adjectives, animals } from 'unique-names-generator';
import { useRecoilState } from 'recoil';
import { chatsState } from '../atoms/atoms';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StackNavigator } from '../components/Navigation/types';

import SwipeableItem from '../components/SwipeableItem';

type ChatListScreenProps = NativeStackScreenProps<StackNavigator, 'ChatList'>;

const ChatList = ({ navigation }: ChatListScreenProps) => {
	const [chatData, setChatData] = useRecoilState(chatsState);

	const handleCreateNewChat = async () => {
		const newChatName = uniqueNamesGenerator({
			dictionaries: [adjectives, animals],
			length: 2,
			style: 'capital',
			separator: ' ',
		});

		const newChatId = uniqueNamesGenerator({
			dictionaries: [adjectives, animals],
			length: 2,
		});

		const newChat = {
			name: newChatName,
			id: newChatId,
			messages: [],
		};

		setChatData((currentState: any) => [...currentState, newChat]);

		try {
			navigation.navigate('Chat', {
				id: newChat.id,
				name: newChat.name,
			});
		} catch (error) {
			console.log(error);
		}
	};

	const handleDeleteChat = (id: string) => {
		const filteredChats = chatData.filter((chat: { id: string; }) => chat.id !== id);
		setChatData(filteredChats);
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
						{chatData.map((chat: { name: string; id: string; messages: any[]; }) => (
							<Box
								w='90%'
								bg='white'
								rounded='md'
								shadow={7}
								key={chat.name}>
								<SwipeableItem
									item={chat}
									onDelete={() => handleDeleteChat(chat.id)}
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
