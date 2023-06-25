import React from 'react';
import renderer from 'react-test-renderer';
import { NativeBaseProvider } from 'native-base';
import { render } from '@testing-library/react-native';

import SwipeableItem from './index';

jest.mock('react-native-gesture-handler', () => {
    return {
      Swipeable: jest.fn(),
    };
  });
  
describe('SwipeableItem', () => {
	it('renders SwipeableItem correctly', () => {
		const item = {
            chatName: 'Test Name',
            chatId: 'Test Id',
            messages: [],
        }
		const onDelete = jest.fn();
		const onPress = jest.fn();

		const tree = renderer
			.create(
				<NativeBaseProvider>
					<SwipeableItem
                        item={item}
                        onDelete={onDelete}
                        onPress={onPress}
					/>
				</NativeBaseProvider>
			)
			.toJSON();

		expect(tree).toMatchSnapshot();
	});
});
