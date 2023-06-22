import React from 'react';
import { NativeBaseProvider, extendTheme } from 'native-base';

import { config } from './theme';
import Navigation from './components/Navigation/index';
import signIn from './components/SignIn/Index';

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

	signIn();

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
