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
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	updateProfile,
} from 'firebase/auth';

const Chat = () => {
    const handleSignup = () => {
        const [name, setName] = useState('');
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [avatar, setAvatar] = useState('');
        
		createUserWithEmailAndPassword(auth, email, password)
			.then(userCredential => {
				// Registered
				const user = userCredential.user;
				updateProfile(user, {
					displayName: name,
					photoURL: avatar
						? avatar
						: 'https://gravatar.com/avatar/94d45dbdba988afacf30d916e7aaad69?s=200&d=mp&r=x',
				})
					.then(() => {
						signInWithEmailAndPassword(auth, email, password)
							.then(userCredential => {
								navigation.navigate('Chat');
							})
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
        
     );
}
 
export default Chat;