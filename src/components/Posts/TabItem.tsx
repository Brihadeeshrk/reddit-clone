import React from "react";
import { TabItem } from "./NewPostForm";
import { Flex, Icon, Text } from "@chakra-ui/react";

type TabItemProps = {
  item: TabItem;
  selected: boolean;
  setSelected: (value: string) => void;
  key: number;
};

const TabItem1: React.FC<TabItemProps> = ({
  item,
  selected,
  setSelected,
  key,
}) => {
  return (
    <Flex
      key={key}
      justify="center"
      align="center"
      flexGrow={1}
      p="14px 0px"
      cursor="pointer"
      _hover={{
        bg: "gray.50",
      }}
      fontWeight={700}
      color={selected ? "blue.500" : "gray.500"}
      borderWidth={selected ? "0px 1px 2px 0px" : "0px 1px 1px 0px"}
      borderBottomColor={selected ? "blue.500" : "gray.500"}
      borderRightColor="gray.200"
      onClick={() => setSelected(item.title)}
    >
      <Flex align="center" height="20px" mr={2}>
        <Icon as={item.icon} />
      </Flex>
      <Text fontSize="10pt">{item.title}</Text>
    </Flex>
  );
};
export default TabItem1;
