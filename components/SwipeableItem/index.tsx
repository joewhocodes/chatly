// SwipeableItem.tsx
import React, { useRef, useState } from 'react';
import { TouchableOpacity, Animated } from 'react-native';
import { Text } from 'native-base';
import { Swipeable } from 'react-native-gesture-handler';

import { SwipeableItemProps } from './types';

const SwipeableItem = ({ item, onDelete, onPress }: SwipeableItemProps) => {
	const swipeableRef = useRef<Swipeable>(null);
	const [isSwiping, setIsSwiping] = useState(false);

	const handleSwipeStart = () => {
		setIsSwiping(true);
	};

	const handleSwipeRelease = () => {
		setIsSwiping(false);
	};

	const handlePress = () => {
		if (!isSwiping) {
			onPress();
		}
	};

	const renderLeftActions = (
		progress: Animated.AnimatedInterpolation<number>,
		dragX: Animated.AnimatedInterpolation<number>
	) => {
		const onDeletePress = () => {
			onDelete(item.chatId);
			setIsSwiping(false);
		};

		const trans = dragX.interpolate({
			inputRange: [0, 100],
			outputRange: [0, 1],
			extrapolate: 'clamp',
		});

		return (
			<TouchableOpacity onPress={onDeletePress}>
				<Animated.View
					style={{
						backgroundColor: 'red',
						justifyContent: 'center',
						alignItems: 'flex-end',
						padding: 20,
						opacity: trans,
					}}>
					<Text style={{ color: 'white' }}>Delete</Text>
				</Animated.View>
			</TouchableOpacity>
		);
	};

	return (
		<Swipeable
			ref={swipeableRef}
            
			renderLeftActions={renderLeftActions}
			onSwipeableWillOpen={handleSwipeStart}
			onSwipeableWillClose={handleSwipeRelease}>
			<TouchableOpacity
				activeOpacity={1}
				onPress={handlePress}
				style={{ backgroundColor: 'white', padding: 20 }}>
				<Text fontFamily={'Jua-Regular'} textAlign={'center'}>
					{item.chatName}
				</Text>
			</TouchableOpacity>
		</Swipeable>
	);
};

export default SwipeableItem;
