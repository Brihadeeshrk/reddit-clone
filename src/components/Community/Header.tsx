import { Community } from "@/src/atoms/communitiesAtom";
import useCommunityData from "@/src/hooks/useCommunityData";
import {
  Box,
  Button,
  Flex,
  Icon,
  Image,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { FaReddit } from "react-icons/fa";

type HeaderProps = {
  communityData: Community;
};

const Header: React.FC<HeaderProps> = ({ communityData }) => {
  const { communityStateValue, onJoinOrLeaveCommunity, loading } =
    useCommunityData();
  const isJoined = !!communityStateValue.mySnippets.find(
    (item) => item.communityId === communityData.id
  );

  const [bannerIsOpen, setBannerIsOpen] = useState({ open: false });
  const handleClose = () => {
    setBannerIsOpen((prev) => ({
      ...prev,
      open: false,
    }));
  };

  return (
    <Flex direction="column" width="100%" height="146px">
      <Box height="55%" bg="blue.400">
        {communityStateValue.currentCommunity?.bannerURL && (
          <>
            <Image
              src={communityStateValue.currentCommunity?.bannerURL}
              width="100%"
              height="100%"
              objectFit="cover"
              onClick={() => setBannerIsOpen({ open: true })}
            />
            {/* xs, sm, md, lg, xl, or full. */}
            <Modal isOpen={bannerIsOpen.open} onClose={handleClose} size="6xl">
              <ModalOverlay />
              <ModalContent bg="white" p={5}>
                <Image
                  src={communityStateValue.currentCommunity?.bannerURL}
                  onClick={() => setBannerIsOpen({ open: true })}
                />
                <ModalCloseButton color="brand.100" />
              </ModalContent>
            </Modal>
          </>
        )}
      </Box>
      <Flex justify="center" bg="white" flexGrow={1}>
        <Flex width="95%" maxWidth="860px">
          {communityStateValue.currentCommunity?.imageURL ? (
            <Image
              src={communityStateValue.currentCommunity?.imageURL}
              borderRadius="full"
              boxSize="68px"
              alt="Community Logo"
              position="relative"
              top={-3}
              color="blue.500"
              border="4px solid white"
            />
          ) : (
            <Icon
              as={FaReddit}
              fontSize={64}
              position="relative"
              top={-3}
              color="blue.500"
              border="4px solid white"
              borderRadius="50%"
            />
          )}
          <Flex padding="10px 16px">
            <Flex direction="column" mr={6}>
              <Text fontWeight={800} fontSize="16pt">
                {communityData.id}
              </Text>
              <Text fontWeight={600} fontSize="10pt" color="gray.400">
                r/{communityData.id}
              </Text>
            </Flex>
            <Button
              variant={isJoined ? "outline" : "solid"}
              height="30px"
              pr={6}
              pl={6}
              onClick={() => onJoinOrLeaveCommunity(communityData, isJoined)}
              isLoading={loading}
            >
              {isJoined ? "Joined" : "Join"}
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
export default Header;
