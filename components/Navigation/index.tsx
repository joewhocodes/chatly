import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import { StackNavigator } from './types';

import ChatListScreen from '../../screens/ChatList';
import ChatScreen from '../../screens/Chat';

const Stack = createStackNavigator<StackNavigator>();

const Navigation = () => {
	return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen name='ChatList' component={ChatListScreen} options={{headerShown: false}}/>
				<Stack.Screen name='Chat' component={ChatScreen} />
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default Navigation;
