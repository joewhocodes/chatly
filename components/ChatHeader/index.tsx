import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Box, Center, Heading, Text, Flex, Image } from 'native-base';

import { ChatHeaderProps } from './types';

const ChatHeader = ({ navigation, chatName, setShowModal }: ChatHeaderProps) => {
	const handleBackPress = () => {
		navigation.navigate('ChatList');
	};

	const handleChangeName = () => {
		setShowModal(true);
	};

	return (
		<Box backgroundColor={'primary.500'}>
			<Box mt={'20px'}>
				<Flex direction='row' justifyContent={'space-between'}>
					<Box>
						<TouchableOpacity onPress={handleBackPress}>
							<Image
								source={require('../../assets/back-arrow.png')}
								alt={'back arrow'}
								mt='7px'
							/>
						</TouchableOpacity>
					</Box>
					<Image
						source={require('../../assets/logo.png')}
						alt={'logo'}
						mr={'45px'}
					/>
					<Text></Text>
				</Flex>
				<Center>
					<Heading color={'white'} fontFamily={'Jua-Regular'}>
						{chatName}
					</Heading>
					<TouchableOpacity onPress={handleChangeName}>
						<Text color='white' fontFamily={'Jua-Regular'}>
							Tap to change name
						</Text>
					</TouchableOpacity>
				</Center>
			</Box>
		</Box>
	);
};

export default ChatHeader;
