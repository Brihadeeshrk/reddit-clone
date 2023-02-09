import { Button, Flex, Image, Stack, Text } from "@chakra-ui/react";
import React, { useRef } from "react";

type ImageUploadProps = {
  selectedFile?: string;
  onSelectImage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setSelectedTab: (value: string) => void;
  setSelectedFile: (value: string) => void;
  isLoading: boolean;
  error: string;
};

const ImageUpload: React.FC<ImageUploadProps> = ({
  selectedFile,
  onSelectImage,
  setSelectedTab,
  setSelectedFile,
  isLoading,
  error,
}) => {
  const selectedFileRef = useRef<HTMLInputElement>(null);
  return (
    <Flex justify="center" align="center" width="100%" direction="column">
      {selectedFile ? (
        <>
          <Image src={selectedFile} maxHeight="400px" maxWidth="400px" />
          <Stack direction="row" mt={4}>
            <Button height="28px" onClick={() => setSelectedTab("Post")}>
              Back To Post
            </Button>
            <Button
              variant="outline"
              height="28px"
              onClick={() => setSelectedFile("")}
            >
              Remove
            </Button>
          </Stack>
        </>
      ) : (
        <Flex
          justify="center"
          align="center"
          p={20}
          border="1px dashed"
          borderColor="gray.200"
          width="100%"
          borderRadius={4}
        >
          <Button
            variant="outline"
            height="28px"
            onClick={() => {
              selectedFileRef.current?.click();
            }}
            isLoading={isLoading}
          >
            Upload
          </Button>
          <input
            ref={selectedFileRef}
            type="file"
            hidden
            onChange={onSelectImage}
          />
        </Flex>
      )}
      {error && (
        <Text
          color="red.500"
          fontWeight="600"
          fontSize="9pt"
          textAlign="center"
          mt={3}
        >
          {error}
        </Text>
      )}
    </Flex>
  );
};

export default ImageUpload;
