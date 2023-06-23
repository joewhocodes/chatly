import React from 'react';
import renderer from 'react-test-renderer';
import { NativeBaseProvider } from 'native-base';

import ChatHeader from './index';

describe('ChatHeader', () => {
  it('renders ChatHeader correctly', () => {
    const chatName = 'Test Chat';
    const setShowModal = jest.fn();

    const tree = renderer.create(
      <NativeBaseProvider>
        <ChatHeader chatName={chatName} setShowModal={setShowModal} navigation={undefined} />
      </NativeBaseProvider>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});