import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { auth } from '../firebase/firebase';
import { StackNavigator } from '../components/Navigation/Types';

type ChatListScreenProps = NativeStackScreenProps<StackNavigator, 'ChatList'>;

const ChatList = ({ navigation }: ChatListScreenProps) => {
	return (
		<>
			<Text style={{ fontWeight: 'bold', fontSize: 18 }}>New User</Text>
			{auth.currentUser && <Text>{auth.currentUser.displayName}</Text>}
			<TouchableOpacity onPress={() => navigation.navigate('Chat')}>
				<Text>Go to Chat</Text>
			</TouchableOpacity>
		</>
	);
};

export default ChatList;
