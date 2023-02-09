import { authModalState } from "@/src/atoms/authModalAtom";
import { communityState } from "@/src/atoms/communitiesAtom";
import About from "@/src/components/Community/About";
import PageContent from "@/src/components/Layout/PageContent";
import NewPostForm from "@/src/components/Posts/NewPostForm";
import { auth } from "@/src/firebase/clientApp";

import { Box, Button, Flex, Text } from "@chakra-ui/react";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useSetRecoilState, useRecoilValue } from "recoil";

type submitProps = {};

const SubmitPostPage: React.FC<submitProps> = () => {
  const [user] = useAuthState(auth);
  const setAuthModalState = useSetRecoilState(authModalState);
  const communityStateValue = useRecoilValue(communityState);
  return (
    <>
      <PageContent>
        <>
          <Box p="14px 0px" borderBottom="1px solid" borderColor="white">
            <Text>Create a Post</Text>
          </Box>
          {user ? (
            <NewPostForm user={user} />
          ) : (
            <Flex
              direction="column"
              align="center"
              justify="center"
              p={10}
              bg="rgba(255,255,255,0.4)"
              borderRadius={4}
              mt={2}
            >
              Login to Submit a Post
              <Button
                height="28px"
                mt={2}
                onClick={() =>
                  setAuthModalState({ open: "true", view: "login" })
                }
              >
                Login
              </Button>
            </Flex>
          )}
        </>
        <>{/* <About /> */}</>
      </PageContent>
    </>
  );
};
export default SubmitPostPage;
