import React, { useEffect } from 'react';
import { SSRProvider } from '@react-aria/ssr';

import Navigation from './components/Navigation/index';
import signIn from './authentication/signIn';

import { NativeBaseProvider, extendTheme } from 'native-base';
import { config } from './theme';
import { useFonts } from 'expo-font';

const theme = extendTheme(config);
type MyThemeType = typeof theme;
declare module 'native-base' {
	interface ICustomTheme extends MyThemeType {}
}

const App = () => {
	const [fontsLoaded] = useFonts({
		'Jua-Regular': require('./assets/fonts/Jua-Regular.ttf'),
	});

	useEffect(() => {
		signIn();
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
};

export default App;
