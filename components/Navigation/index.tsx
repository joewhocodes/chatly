import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { StackNavigator } from './types';

import ChatListScreen from '../../screens/ChatList';
import ChatScreen from '../../screens/Chat';

const Stack = createStackNavigator<StackNavigator>();

const Navigation = () => {
	return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen
					name='ChatList'
					component={ChatListScreen}
					options={{ headerShown: false }}
				/>
				<Stack.Screen
					name='Chat'
					component={ChatScreen}
					options={{ headerShown: false }}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default Navigation;
