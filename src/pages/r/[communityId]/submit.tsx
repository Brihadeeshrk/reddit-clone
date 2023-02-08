import PageContent from "@/src/components/Layout/PageContent";
import NewPostForm from "@/src/components/Posts/NewPostForm";
import { Box, Text } from "@chakra-ui/react";
import React from "react";

type submitProps = {};

const SubmitPostPage: React.FC<submitProps> = () => {
  return (
    <>
      <PageContent>
        <>
          <Box p="14px 0px" borderBottom="1px solid" borderColor="white">
            <Text>Create a Post</Text>
          </Box>
          <NewPostForm />
          {/* postform */}
        </>
        <>{/* about forum */}</>
      </PageContent>
    </>
  );
};
export default SubmitPostPage;
