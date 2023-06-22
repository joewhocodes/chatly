import React, { useEffect } from 'react';
import { NativeBaseProvider, extendTheme } from 'native-base';

import { config } from './theme';
import Navigation from './components/Navigation/index';
import SignIn from './authentication/signIn';

import { SSRProvider } from '@react-aria/ssr';
import { useFonts } from 'expo-font';

const theme = extendTheme(config);

type MyThemeType = typeof theme;
declare module 'native-base' {
	interface ICustomTheme extends MyThemeType {}
}

export default function App() {
	const [fontsLoaded] = useFonts({
		'Jua-Regular': require('./assets/fonts/Jua-Regular.ttf'),
	});

	useEffect(() => {
		SignIn()
	}, []);

	if (!fontsLoaded) {
		return null;
	}

	return (
		<SSRProvider>
			<NativeBaseProvider theme={theme}>
				<Navigation />
			</NativeBaseProvider>
		</SSRProvider>
	);
}
