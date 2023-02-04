import React from "react";
import CreateCommunityModal from "../../Modal/CreateCommunity";
import { Flex, Icon, MenuItem } from "@chakra-ui/react";
import { GrAdd } from "react-icons/gr";

type CommunitiesProps = {};

const Communities: React.FC<CommunitiesProps> = () => {
  return (
    <>
      <CreateCommunityModal />
      <MenuItem>
        <Flex>
          <Icon as={GrAdd} />
          Create Community
        </Flex>
      </MenuItem>
    </>
  );
};
export default Communities;
