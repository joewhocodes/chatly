import React, {
	useState,
	useLayoutEffect,
	useCallback,
} from 'react';
import {
	TouchableOpacity,
	TextInputChangeEventData,
	NativeSyntheticEvent,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
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

import {chatsState} from '../atoms';
import { useRecoilState } from 'recoil';

type ChatScreenProps = NativeStackScreenProps<StackNavigator, 'Chat'>;

const Chat = ({ navigation, route }: ChatScreenProps) => {
	const [chatData, setChatData] = useRecoilState(chatsState);
	const [messages, setMessages] = useState<IMessage[]>([]);
	const [showModal, setShowModal] = useState<boolean>(false);
	const [chatName, setChatName] = useState<string>(route.params.name);

	let thisChat = chatData.find(chat => chat.name === route.params.name);
	
	useLayoutEffect(() => {
		if (thisChat) {
			const messages: IMessage[] = thisChat.messages.map(doc => ({
				_id: doc.id,
				text: doc.text,
				user: { _id: doc.user.id_, avatar: doc.user.avatar },
				createdAt: new Date(doc.createdAt),
			}));
			setMessages(messages.reverse());
		}
		// setChatName
	}, []);

	const onSend = useCallback((messages: IMessage[]) => {
		setMessages(previousMessages =>
			GiftedChat.append(previousMessages, messages)
		);

		const { _id, createdAt, text, user } = messages[0];
		const newMessage: IMessage = {
			_id,
			createdAt,
			text,
			user,
		};
		// Update the logic to add the new message
		console.log('New message:', newMessage);
	}, []);

	const handleUpdateName = (oldName: string, newName: string) => {
		let newChatData = chatData.map((chat) => {
			if (chat.name === oldName) {
			  return {
				...chat,
				name: newName,
			  };
			}
			return chat;
		  })
		console.log(newChatData)
		setChatData(newChatData)
		setShowModal(false);
	  };


	

	const onChange = (e: NativeSyntheticEvent<TextInputChangeEventData>): void => {
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
							{chatName}
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
									setChatName(chatName);
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
					_id: 'cat_lord',
					avatar: 'https://loremflickr.com/cache/resized/65535_52422330809_c86d4f09f3_320_240_nofilter.jpg',
				}}
			/>
		</Box>
	);
};

export default Chat;
