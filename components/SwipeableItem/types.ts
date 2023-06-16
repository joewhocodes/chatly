export type SwipeableItemProps = {
    item: {
      name: string;
      id: string;
      messages: any[];
    };
    onDelete: (id: string) => void;
    onPress: () => void;
};