import React, { useState } from 'react';
import { TouchableOpacity, Alert } from 'react-native';
import { Box, Button, Slide, Text } from 'native-base';
import { Entypo } from '@expo/vector-icons';

import { db } from '../../firebase/firebase';
import { deleteDoc, doc } from 'firebase/firestore';

import { SlideComponentProps } from './types';

const SlideComponent = ({ navigation, id, showBlock, setShowBlock }: SlideComponentProps) => {
	const [blockCheck, setBlockCheck] = useState<boolean>(false);

	const cancelBlock = () => {
		setShowBlock(false);
		setTimeout(() => {
			setBlockCheck(false);
		}, 200);
	};

	const handleBlockUser = () => {
		setShowBlock(false);
		navigation.navigate('ChatList');
		Alert.alert('User has been blocked, thanks for reporting!');
		const docRef = doc(db, 'chats', id);
		deleteDoc(docRef);
	};

	return (
		<Slide in={showBlock} placement='bottom'>
			{!blockCheck ? (
				<Box
					marginBottom={0}
					marginTop={'auto'}
					backgroundColor={'#5b3afe'}
					borderTopRadius={25}
					borderBottomRadius={0}
				>
					<TouchableOpacity onPress={() => cancelBlock()}>
						<Text
							textAlign='right'
							color='lightgrey'
							fontSize={18}
							marginRight={5}
						>
							<Entypo name='cross' size={24} color='lightgrey' />
						</Text>
					</TouchableOpacity>

					<Button
						onPress={() => setBlockCheck(true)}
						mt={8}
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
					borderTopRadius={25}
					borderBottomRadius={0}
				>
					<TouchableOpacity onPress={() => cancelBlock()}>
						<Text
							textAlign='right'
							color='lightgrey'
							fontSize={18}
							marginRight={5}
						>
							<Entypo name='cross' size={24} color='lightgrey' />
						</Text>
					</TouchableOpacity>
					<Text
						ml={8}
						mr={8}
						pt={'14px'}
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
	);
};

export default SlideComponent;
