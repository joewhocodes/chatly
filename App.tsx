import React from 'react';
import { NativeBaseProvider, extendTheme } from 'native-base';
import { RecoilRoot } from 'recoil';
import Navigation from './components/Navigation/index';
import { SSRProvider } from '@react-aria/ssr';

import { config } from './theme';

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

	async function getImg() {
		const response = await fetch('https://loremflickr.com/json/320/240');
		const jsonData = await response.json();
		return jsonData.file;
	}

	if (!fontsLoaded) {
		return null;
	}

	return (
		<SSRProvider>
			<RecoilRoot>
				<NativeBaseProvider theme={theme}>
					<Navigation />
				</NativeBaseProvider>
			</RecoilRoot>
		</SSRProvider>
	);
}
