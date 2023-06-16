import React, { useState, useLayoutEffect, useCallback } from 'react';
import { TextInputChangeEventData, NativeSyntheticEvent } from 'react-native';
import { Box, Button, FormControl, Input, Modal } from 'native-base';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
type ChatScreenProps = NativeStackScreenProps<StackNavigator, 'Chat'>;

import { StackNavigator } from '../components/Navigation/types';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';

import { chatsState } from '../atoms/atoms';
import { useRecoilState } from 'recoil';
import ChatHeader from '../components/ChatHeader';


const Chat = ({ navigation, route }: ChatScreenProps) => {
	const [chatData, setChatData] = useRecoilState(chatsState);
	const [messages, setMessages] = useState<IMessage[]>([]);
	const [showModal, setShowModal] = useState<boolean>(false);
	const [chatName, setChatName] = useState<string>(route.params.name);

	const thisChat = chatData.find(chat => chat.name === route.params.name);
	
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
			const updatedChatData = chatData.map(chat => {
				if (chat.name === route.params.name) {
					const updatedMessages = [
						...chat.messages,
						...messages.map(message => ({
							id: message._id.toString(),
							createdAt: message.createdAt.toString(),
							text: message.text,
							user: {
								id_: message.user._id.toString(),
								avatar: 'https://loremflickr.com/cache/resized/65535_52422330809_c86d4f09f3_320_240_nofilter.jpg',
							},
						})),
					];
					return { ...chat, messages: updatedMessages };
				}
				return chat;
			});

			setChatData(updatedChatData);
			setMessages(previousMessages =>
				GiftedChat.append(previousMessages, messages)
			);
		},
		[chatData, route.params.name, setChatData]
	);

	const handleUpdateName = (oldName: string, newName: string) => {
		let newChatData = chatData.map(chat => {
			if (chat.name === oldName) {
				return {
					...chat,
					name: newName,
				};
			}
			return chat;
		});
		setChatData(newChatData);
		setShowModal(false);
	};

	const handleOnChange = (e: NativeSyntheticEvent<TextInputChangeEventData>): void => {
		setChatName(e.nativeEvent.text);
	};

	return (
		<Box h='100%' backgroundColor='white'>
		 <ChatHeader
			navigation={navigation}
			chatName={chatName}
			setShowModal={setShowModal}
      	/>

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
