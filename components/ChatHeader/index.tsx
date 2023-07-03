import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Box, Center, Heading, Text, Flex, Image, Divider } from 'native-base';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons'; 
import { ChatHeaderProps } from './types';

const ChatHeader = ({
	navigation,
	chatName,
	setShowModal,
	setShowBlock,
}: ChatHeaderProps) => {
	const handleBackPress = () => {
		setShowBlock(false);
		navigation.navigate('ChatList');
	};

	const handleChangeName = () => {
		setShowModal(true);
	};

	const handleBlockUser = () => {
		setShowBlock(true);
	};

	return (
		<Box backgroundColor={'white'}>
			<Box>
				<Flex justifyContent='space-between'>
					<Flex direction='row' mt={9} mb={3}>
						<TouchableOpacity onPress={handleBackPress}>
							<Box ml={2}>
								<AntDesign name='left' size={24} color='black' />
							</Box>
						</TouchableOpacity>
						{/* <Image
							source={require('../../assets/logo.png')}
							alt={'logo'}
							mr={'45px'}
						/> */}
						<TouchableOpacity onPress={handleChangeName}>
							<Heading
								color={'black'}
								fontSize={16}
								mt={'1.8px'}
								// fontFamily={'Roboto'}
								fontWeight={'bold'}
								ml={1}
							>
								{chatName}
							</Heading>
						</TouchableOpacity>
						<TouchableOpacity onPress={handleBlockUser}>
							<Ionicons name="menu" size={24} marginLeft={180} color="black" />
						</TouchableOpacity>
					</Flex>
				</Flex>
			</Box>
			<Divider />
		</Box>
	);
};

export default ChatHeader;
