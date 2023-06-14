import React, { useState } from 'react';

import {
	StyleSheet,
	Text,
	View,
	TextInput,
	Image,
	SafeAreaView,
	TouchableOpacity,
	StatusBar,
} from 'react-native';
import { auth } from '../firebase/firebase';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	updateProfile,
    getAuth,
    signInAnonymously,
    onAuthStateChanged
} from 'firebase/auth';

import { uniqueNamesGenerator, adjectives, animals } from 'unique-names-generator';
import { faker } from '@faker-js/faker';
import { StackNavigator } from '../components/Navigation/Types';
import { Button } from 'native-base';

type ChatListScreenProps = NativeStackScreenProps<StackNavigator, 'ChatList'>;

const ChatList = ({ navigation }: ChatListScreenProps) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState(faker.internet.email());
    const [password, setPassword] = useState(faker.internet.password());
    const [avatar, setAvatar] = useState('');


    const shortName = uniqueNamesGenerator({
        dictionaries: [adjectives, animals],
        length: 2
    })
    
    const auth = getAuth();

    
    const handleSignInGuest = () => {
        signInAnonymously(auth)
            .then(() => {
                console.log('user created');
                onAuthStateChanged(auth, user => {
                    if (user) {
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
    }



	const handleSignup = () => {
        setName(shortName);
		createUserWithEmailAndPassword(auth, email, password)
			.then(userCredential => {
				// Registered
				const user = userCredential.user;
				updateProfile(user, {
					displayName: shortName,
					photoURL: avatar
						? avatar
						: 'https://gravatar.com/avatar/94d45dbdba988afacf30d916e7aaad69?s=200&d=mp&r=x',
				})
					.then(() => {
						signInWithEmailAndPassword(auth, email, password)
							// .then(userCredential => {
							// 	navigation.navigate('');
							// })
							.catch(error => {
								const errorCode = error.code;
								const errorMessage = error.message;
								alert(errorMessage);
							});
					})
					.catch(error => {
						alert(error.message);
					});
			})
			.catch(error => {
				const errorCode = error.code;
				const errorMessage = error.message;
				alert(errorMessage);
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
    )
};

export default ChatList;
