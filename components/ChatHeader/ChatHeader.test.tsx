import React from 'react';
import renderer from 'react-test-renderer';
import { NativeBaseProvider } from 'native-base';
import { render } from '@testing-library/react-native';
import ChatHeader from './index';

describe('ChatHeader', () => {
	it('renders ChatHeader correctly', () => {
		const chatName = 'Test Chat';
		const setShowModal = jest.fn();

		const tree = renderer
			.create(
				<NativeBaseProvider>
					<ChatHeader
						chatName={chatName}
						setShowModal={setShowModal}
						navigation={undefined}
					/>
				</NativeBaseProvider>
			)
			.toJSON();

		expect(tree).toMatchSnapshot();
	});
});

describe('ChatHeader', () => {
	it('renders ChatName', () => {
		const chatName = 'Test Chat';
		const setShowModal = jest.fn();

		render(
			<NativeBaseProvider>
				<ChatHeader
					chatName={chatName}
					setShowModal={setShowModal}
					navigation={undefined}
				/>
			</NativeBaseProvider>
		);

		expect(chatName).toBe('Test Chat');
	});
});

describe('ChatHeader', () => {
	it('opens modal', () => {
		const chatName = 'Test Chat';
		const setShowModal = jest.fn();

		render(
			<NativeBaseProvider>
				<ChatHeader
					chatName={chatName}
					setShowModal={setShowModal}
					navigation={undefined}
				/>
			</NativeBaseProvider>
		);
		
		setShowModal(true);
		expect(setShowModal).toBeCalledTimes(1);
	});
});
