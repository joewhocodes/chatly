import React from 'react';
import { TouchableOpacity } from 'react-native';
import renderer from 'react-test-renderer';
import { NativeBaseProvider, Heading, Text } from 'native-base';

import ChatHeader from './index';

describe('ChatHeader', () => {
  it('renders ChatHeader correctly', () => {
    const chatName = 'Test Chat';
    const setShowModal = jest.fn();

    const tree = renderer
      .create(
        <NativeBaseProvider>
          <ChatHeader chatName={chatName} setShowModal={setShowModal} navigation={undefined} />
        </NativeBaseProvider>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('calls handleBackPress when back arrow is pressed', () => {
    const chatName = 'Test Chat';
    const setShowModal = jest.fn();
    const navigation = {
      navigate: jest.fn(),
    };

    const component = renderer.create(
      <NativeBaseProvider>
        <ChatHeader chatName={chatName} setShowModal={setShowModal} navigation={navigation} />
      </NativeBaseProvider>
    );

    const backArrow = component.root.findByProps({ testID: 'back-arrow' });
    backArrow.props.onPress();

    expect(navigation.navigate).toHaveBeenCalledWith('ChatList');
  });

  it('calls handleChangeName when "Tap to change name" text is pressed', () => {
    const chatName = 'Test Chat';
    const setShowModal = jest.fn();
    const navigation = undefined;

    const component = renderer.create(
      <NativeBaseProvider>
        <ChatHeader chatName={chatName} setShowModal={setShowModal} navigation={navigation} />
      </NativeBaseProvider>
    );

    const changeNameText = component.root.findByProps({ testID: 'change-name-text' });
    changeNameText.props.onPress();

    expect(setShowModal).toHaveBeenCalledWith(true);
  });

  it('displays the chat name correctly', () => {
    const chatName = 'Test Chat';
    const setShowModal = jest.fn();
    const navigation = undefined;

    const component = renderer.create(
      <NativeBaseProvider>
        <ChatHeader chatName={chatName} setShowModal={setShowModal} navigation={navigation} />
      </NativeBaseProvider>
    );

    const heading = component.root.findByProps({ testID: 'chat-name-heading' });
    const renderedText = heading.props.children;

    expect(renderedText).toBe(chatName);
  });
});
