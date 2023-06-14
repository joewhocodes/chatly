import React, { useState } from 'react';

import {
	Text,
	TouchableOpacity,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
	updateProfile,
	signInAnonymously,
	onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../firebase/firebase'
import {
	uniqueNamesGenerator,
	adjectives,
	animals,
} from 'unique-names-generator';
import { faker } from '@faker-js/faker';
import { StackNavigator } from '../components/Navigation/Types';

type ChatListScreenProps = NativeStackScreenProps<StackNavigator, 'ChatList'>;

const ChatList = ({ navigation }: ChatListScreenProps) => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState(faker.internet.email());
	const [password, setPassword] = useState(faker.internet.password());
	const [avatar, setAvatar] = useState('');

	const shortName = uniqueNamesGenerator({
		dictionaries: [adjectives, animals],
		length: 2,
	});



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
							photoURL: avatar
								? avatar
								: 'https://gravatar.com/avatar/94d45dbdba988afacf30d916e7aaad69?s=200&d=mp&r=x',
						});
						console.log(user);
						// User is signed in, see docs for a list of available properties
						// https://firebase.google.com/docs/reference/js/auth.user
						const uid = user.uid;
						// ...
					} else {
						// User is signed out
						// ...
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
