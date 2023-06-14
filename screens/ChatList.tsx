import React from 'react';

import { Text, TouchableOpacity } from 'react-native';
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
	const handleSignInGuest = () => {
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
						console.log(user);
					} else {
						// User is signed out
					}
				});
			})
			.catch(error => {
				const errorCode = error.code;
				const errorMessage = error.message;
				// ...
			});
	};

	return (
		<>
			<Text>Hey</Text>
			<TouchableOpacity onPress={handleSignInGuest}>
				<Text
					style={{
						fontWeight: 'bold',
						fontSize: 18,
					}}>
					{' '}
					Sign Up
				</Text>
			</TouchableOpacity>
		</>
	);
};

export default ChatList;
