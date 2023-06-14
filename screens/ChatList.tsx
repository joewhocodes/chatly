import React, { useEffect } from 'react';
import { Text } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
	updateProfile,
	signInAnonymously,
	onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../firebase/firebase';
import {
	uniqueNamesGenerator,
	adjectives,
	animals,
} from 'unique-names-generator';
import { StackNavigator } from '../components/Navigation/Types';

type ChatListScreenProps = NativeStackScreenProps<StackNavigator, 'ChatList'>;

const ChatList = ({ navigation }: ChatListScreenProps) => {
	useEffect(() => {
		signInAnonymously(auth)
			.then(() => {
				console.log('user created');
				onAuthStateChanged(auth, user => {
					if (user) {
						updateProfile(user, {
							displayName: uniqueNamesGenerator({
								dictionaries: [adjectives, animals],
								length: 2,
							}),
							photoURL:
								'https://gravatar.com/avatar/94d45dbdba988afacf30d916e7aaad69?s=200&d=mp&r=x',
						});
					}
				});
			})
			.catch(error => {
				const errorCode = error.code;
				const errorMessage = error.message;
				// ...
			});
	}, []);

	return (
		<>
			<Text style={{ fontWeight: 'bold', fontSize: 18 }}>New User</Text>
			{auth.currentUser && <Text>{auth.currentUser.displayName}</Text>}
		</>
	);
};

export default ChatList;
