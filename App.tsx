import React from 'react';
import {
	Text,
	HStack,
	Switch,
	useColorMode,
	NativeBaseProvider,
	extendTheme,
} from 'native-base';
import NativeBaseIcon from './components/NativeBaseIcon';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import ChatListScreen from './screens/ChatList';
import Navigation from './components/Navigation/index';

// Define the config
const config = {
	useSystemColorMode: false,
	initialColorMode: 'dark',
};

const Stack = createStackNavigator();

// extend the theme
export const theme = extendTheme({ config });
type MyThemeType = typeof theme;
declare module 'native-base' {
	interface ICustomTheme extends MyThemeType {}
}
export default function App() {
	return (
		<NativeBaseProvider>
			<Navigation />
		</NativeBaseProvider>
	);
}

// Color Switch Component
function ToggleDarkMode() {
	const { colorMode, toggleColorMode } = useColorMode();
	return (
		<HStack space={2} alignItems='center'>
			<Text>Dark</Text>
			<Switch
				isChecked={colorMode === 'light'}
				onToggle={toggleColorMode}
				aria-label={
					colorMode === 'light'
						? 'switch to dark mode'
						: 'switch to light mode'
				}
			/>
			<Text>Light</Text>
		</HStack>
	);
}
