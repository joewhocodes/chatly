import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { auth } from '../firebase/firebase';
import { StackNavigator } from '../components/Navigation/Types';

type ChatScreenProps = NativeStackScreenProps<StackNavigator, 'Chat'>;

const Chat = ({ navigation }: ChatScreenProps) => {
	return (
		<>
			<Text style={{ fontWeight: 'bold', fontSize: 18 }}>New User</Text>
			{auth.currentUser && <Text>{auth.currentUser.displayName}</Text>}
			<TouchableOpacity onPress={() => navigation.navigate('ChatList')}>
				<Text>Go to ChatList</Text>
			</TouchableOpacity>
		</>
	);
};

export default Chat;
