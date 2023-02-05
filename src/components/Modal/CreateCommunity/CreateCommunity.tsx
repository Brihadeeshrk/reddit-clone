import { firestore, auth } from "@/src/firebase/clientApp";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Box,
  Text,
  Input,
  Stack,
  Checkbox,
  Flex,
  Icon,
} from "@chakra-ui/react";
import {
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import React, { useState } from "react";
import { BsFillEyeFill, BsFillPersonFill } from "react-icons/bs";
import { HiLockClosed } from "react-icons/hi";
import { useAuthState } from "react-firebase-hooks/auth";

type CreateCommunityProps = {
  open: boolean;
  handleClose: () => void;
};

const CreateCommunity: React.FC<CreateCommunityProps> = ({
  open,
  handleClose,
}) => {
  const [user] = useAuthState(auth);
  const [commName, setCommName] = useState("");
  const [charsRemaining, setCharsRemaining] = useState(21);
  const [commType, setCommType] = useState("public");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > 21) return;
    setCommName(event.target.value);
    setCharsRemaining(21 - event.target.value.length);
  };

  const onCommTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCommType(event.target.name);
  };

  const handleCreateComm = async () => {
    if (error) setError("");
    // validate the comm name
    const format = /[ `!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (format.test(commName) || commName.length < 3) {
      setError(
        "Community names must be between 3 and 21 characters and can only contain letters, numbers or underscores"
      );
      return;
    }

    setLoading(true);

    try {
      const commDocRef = doc(firestore, "communities", commName);

      await runTransaction(firestore, async (transaction) => {
        const commDoc = await transaction.get(commDocRef);
        if (commDoc.exists()) {
          throw new Error(`Sorry, r/${commName} is taken. Try another.`);
        }

        transaction.set(commDocRef, {
          creatorID: user?.uid,
          createdAt: serverTimestamp(),
          numberOfMembers: 1,
          privacyType: commType,
        });

        transaction.set(
          doc(firestore, `users/${user?.uid}/communitySnippets`, commName),
          {
            communityId: commName,
            isModerator: true,
          }
        );
      });
    } catch (error: any) {
      console.log("handleCreateComm Error", error);
      setError(error.message);
    }

    setLoading(false);
  };

  return (
    <>
      <Modal isOpen={open} onClose={handleClose} isCentered size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display="flex"
            flexDirection="column"
            fontSize={15}
            padding={3}
          >
            Create a Community
          </ModalHeader>

          <Box pl={3} pr={3}>
            <ModalCloseButton />
            <ModalBody display="flex" flexDirection="column" padding="10px 0px">
              <Text fontSize={15} fontWeight={600}>
                Name
              </Text>
              <Text fontSize={11} color="gray.500">
                Community Names including capitalization cannot be changed
              </Text>
              <Text
                position="relative"
                top="28px"
                left="10px"
                width="20px"
                color="gray.400"
              >
                r/
              </Text>
              <Input
                position="relative"
                value={commName}
                size="sm"
                pl="22px"
                onChange={handleChange}
              />
              <Text
                fontSize="9pt"
                color={charsRemaining === 0 ? "red" : "gray.500"}
              >
                {charsRemaining} Characters Remaining
              </Text>
              {error && (
                <Text fontSize="9pt" color="red" pt={1}>
                  {error}
                </Text>
              )}
              <Box mt={4} mb={4}>
                <Text fontSize={15} fontWeight={600}>
                  Community Type
                </Text>
                <Stack spacing={2}>
                  <Checkbox
                    name="public"
                    isChecked={commType === "public"}
                    onChange={onCommTypeChange}
                  >
                    <Flex align="center">
                      <Icon as={BsFillPersonFill} color="gray.500" mr={2} />
                      <Text fontSize="10pt" mr={1}>
                        Public
                      </Text>
                      <Text fontSize="8pt" color="gray.500" pt={1}>
                        Anyone can view, post, and comment to this community
                      </Text>
                    </Flex>
                  </Checkbox>
                  <Checkbox
                    name="restricted"
                    isChecked={commType === "restricted"}
                    onChange={onCommTypeChange}
                  >
                    <Flex align="center">
                      <Icon as={BsFillEyeFill} color="gray.500" mr={2} />
                      <Text fontSize="10pt" mr={1}>
                        Restricted
                      </Text>
                      <Text fontSize="8pt" color="gray.500" pt={1}>
                        Anyone can view this community, but only approved users
                        can post
                      </Text>
                    </Flex>
                  </Checkbox>
                  <Checkbox
                    name="private"
                    isChecked={commType === "private"}
                    onChange={onCommTypeChange}
                  >
                    <Flex align="center">
                      <Icon as={HiLockClosed} color="gray.500" mr={2} />
                      <Text fontSize="10pt" mr={1}>
                        Private
                      </Text>
                      <Text fontSize="8pt" color="gray.500" pt={1}>
                        Only approved users can view and submit to this
                        community
                      </Text>
                    </Flex>
                  </Checkbox>
                </Stack>
              </Box>
            </ModalBody>
          </Box>

          <ModalFooter bg="gray.100" borderRadius="0px 0px 10px 10px">
            <Button
              variant="outline"
              height="30px"
              mr={3}
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              height="30px"
              onClick={handleCreateComm}
              isLoading={loading}
            >
              Create Community
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default CreateCommunity;
