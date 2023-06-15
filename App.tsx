import React, { useEffect } from 'react';
import {
	Text,
	HStack,
	Switch,
	useColorMode,
	NativeBaseProvider,
	extendTheme,
} from 'native-base';
import Navigation from './components/Navigation/index';
import {
	updateProfile,
	signInAnonymously,
	onAuthStateChanged,
} from 'firebase/auth';
import { auth } from './firebase/firebase';
import {
	uniqueNamesGenerator,
	adjectives,
	animals,
} from 'unique-names-generator';
import { AvatarGenerator } from 'random-avatar-generator';
import { SSRProvider } from '@react-aria/ssr';

import { config } from './theme'

// extend the theme
export const theme = extendTheme({ config });
type MyThemeType = typeof theme;
declare module 'native-base' {
	interface ICustomTheme extends MyThemeType {}
}

export default function App() {
	const generator = new AvatarGenerator();

	useEffect(() => {
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
							photoURL: generator.generateRandomAvatar(),
						});
					}
				});
			})
			.catch(error => {
				const errorCode = error.code;
				const errorMessage = error.message;
				// ...
			});
	}, []);

	return (
		<SSRProvider>
			<NativeBaseProvider theme={theme}>
				<Navigation />
			</NativeBaseProvider>
		</SSRProvider>
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
