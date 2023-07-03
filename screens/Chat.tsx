import React, { useState, useLayoutEffect, useCallback } from 'react';
import { TextInputChangeEventData, NativeSyntheticEvent, Alert } from 'react-native';
import { Box, Button, FormControl, Input, Modal, Text, Slide } from 'native-base';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
type ChatScreenProps = NativeStackScreenProps<StackNavigator, 'Chat'>;

import { StackNavigator } from '../components/Navigation/types';
import { Bubble, GiftedChat, IMessage, InputToolbar, InputToolbarProps } from 'react-native-gifted-chat';

import { chatsState } from '../atoms/atoms';
import { useRecoilState } from 'recoil';
import ChatHeader from '../components/ChatHeader';

const Chat = ({ navigation, route }: ChatScreenProps) => {
	const [chatData, setChatData] = useRecoilState(chatsState);
	const [messages, setMessages] = useState<IMessage[]>([]);
	const [showModal, setShowModal] = useState<boolean>(false);
	const [showBlock, setShowBlock] = useState<boolean>(false);
	const [chatName, setChatName] = useState<string>(route.params.name);
	const [blockCheck, setBlockCheck] = useState<boolean>(false);

	const thisChat = chatData.find((chat: { name: string }) => chat.name === route.params.name);
	
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
	}, []);

	const onSend = useCallback(
		(messages: IMessage[]) => {
			const updatedChatData = chatData.map(
				(chat: { name: string; messages: any; id: string }) => {
					if (chat.name === route.params.name) {
						const updatedMessages = [
							...chat.messages,
							...messages.map(message => ({
								id: message._id.toString(),
								createdAt: message.createdAt.toString(),
								text: message.text,
								user: {
									id_: message.user._id.toString(),
									avatar: '',
								},
							})),
						];
						return { ...chat, messages: updatedMessages };
					}
					return chat;
				}
			);

			setChatData(updatedChatData);
			setMessages(previousMessages =>
				GiftedChat.append(previousMessages, messages)
			);
		},
		[chatData, route.params.name, setChatData]
	);

	const handleUpdateName = (oldName: string, newName: string) => {
		let newChatData = chatData.map(
			(chat: { name: string; id: string; messages: any[] }) => {
				if (chat.name === oldName) {
					return {
						...chat,
						name: newName,
					};
				}
				return chat;
			}
		);
		setChatData(newChatData);
		setShowModal(false);
	};

	const handleOnChange = (
		e: NativeSyntheticEvent<TextInputChangeEventData>
	): void => {
		setChatName(e.nativeEvent.text);
	};

	const cancelBlock = () => {
		setShowBlock(false);
		setTimeout(() => {
			setBlockCheck(false);
		}, 200);
	};

	const handleBlockUser = () => {
		setShowBlock(false);
		handleDeleteChat(thisChat.id);
		navigation.navigate('ChatList');
		Alert.alert('User has been blocked, thanks for reporting!');
	};

	const handleDeleteChat = (id: string) => {
		const filteredChats = chatData.filter(
			(chat: { id: string }) => chat.id !== id
		);
		setChatData(filteredChats);
	};

	const renderBubble = (props: any) => {
		return (
			<Bubble
				{...props}
				textStyle={{
					right: {},
				}}
				wrapperStyle={{
					left: {
						paddingBottom: 2,
						paddingTop: 2,
					},
					right: {
						paddingBottom: 2,
						paddingTop: 2,
						backgroundColor: '#5b3afe',
					},
				}}
			/>
		);
	};

	const customtInputToolbar = (props: InputToolbarProps<IMessage>) => {
		return (
			<InputToolbar
				{...props}
				containerStyle={{
					backgroundColor: '#ececec',
					marginLeft: 20,
					marginRight: 20,
					borderRadius: 20,
					borderTopColor: '#E8E8E8',
					paddingTop: 3,
					paddingBottom: 2,
					paddingLeft: 8,
				}}
			/>
		);
	};

	return (
		<Box h='100%' backgroundColor='white'>
			<ChatHeader
				navigation={navigation}
				chatName={chatName}
				setShowModal={setShowModal}
				setShowBlock={setShowBlock}
			/>
			<Slide in={showBlock} placement='bottom'>
				{!blockCheck ? (
					<Box
						marginBottom={0}
						marginTop={'auto'}
						backgroundColor={'#5b3afe'}
						borderRadius={1}
					>
						<Button
							onPress={() => setBlockCheck(true)}
							mt={12}
							ml={8}
							mr={8}
							mb={4}
							borderRadius={15}
							backgroundColor={'white'}
							color='black'
						>
							<Text fontWeight='bold'>Report Contact</Text>
						</Button>
						<Button
							onPress={() => setBlockCheck(true)}
							ml={8}
							mr={8}
							mb={12}
							borderRadius={15}
							backgroundColor={'white'}
							color='black'
						>
							<Text fontWeight='bold'>Block Contact</Text>
						</Button>
					</Box>
				) : (
					<Box
						marginBottom={0}
						marginTop={'auto'}
						backgroundColor={'#5b3afe'}
						borderRadius={1}
					>
						<Text
							ml={8}
							mr={8}
							pt={7}
							pb={4}
							fontWeight='medium'
							textAlign='center'
							color='white'
							fontSize={18}
						>
							Are you sure you want to block this user?
						</Text>
						<Button
							onPress={() => handleBlockUser()}
							ml={8}
							mr={8}
							mb={1}
							borderRadius={15}
							backgroundColor={'white'}
							color='black'
						>
							<Text fontWeight='bold'>Block User</Text>
						</Button>
						<Button
							onPress={() => cancelBlock()}
							ml={8}
							mr={8}
							mb={2}
							borderRadius={15}
							backgroundColor={'#5b3afe'}
						>
							<Text fontWeight='bold' color='white'>
								Cancel
							</Text>
						</Button>
					</Box>
				)}
			</Slide>

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
									setChatName(chatName);
									setShowModal(false);
								}}
							>
								Cancel
							</Button>
							<Button
								backgroundColor={'#5b3afe'}
								onPress={() => {
									handleUpdateName(
										route.params.name,
										chatName
									);
								}}
							>
								Save
							</Button>
						</Button.Group>
					</Modal.Footer>
				</Modal.Content>
			</Modal>
			<GiftedChat
				messages={messages}
				showAvatarForEveryMessage={false}
				placeholder='Message...'
				showUserAvatar={false}
				onSend={messages => onSend(messages)}
				renderBubble={renderBubble}
				renderInputToolbar={props => customtInputToolbar(props)}
				renderTime={() => null}
				messagesContainerStyle={{
					backgroundColor: '#fff',
				}}
				user={{
					_id: 'cat_lord',
					avatar: '',
				}}
			/>
		</Box>
	);
};

export default Chat;
