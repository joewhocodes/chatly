export type SwipeableItemProps = {
    item: {
      chatName: string;
      chatId: string;
      messages: any[];
    };
    onDelete: (id: string) => void;
    onPress: () => void;
};