import { Community, communityState } from "@/src/atoms/communitiesAtom";
import {
  Box,
  Button,
  Divider,
  Flex,
  Icon,
  Image,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import moment from "moment";
import Link from "next/link";
import React, { useRef, useState } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { RiCakeLine } from "react-icons/ri";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore, storage } from "@/src/firebase/clientApp";
import useSelectFile from "../../hooks/useSelectFile";
import { FaReddit } from "react-icons/fa";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { useSetRecoilState } from "recoil";
import useSelectBannerPic from "@/src/hooks/useSelectBannerPic";

type AboutProps = {
  communityData: Community;
};

const About: React.FC<AboutProps> = ({ communityData }) => {
  const [user] = useAuthState(auth);

  const selectedFileRef = useRef<HTMLInputElement>(null);
  const selectedBannerRef = useRef<HTMLInputElement>(null);

  const { onSelectFile, selectedFile, setSelectedFile } = useSelectFile();
  const { onSelectBannerPic, selectedBannerPic, setSelectedBannerPic } =
    useSelectBannerPic();

  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(false);

  const setCommunityStateValue = useSetRecoilState(communityState);

  const onUpdateImage = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setUploadingImage(true);
    try {
      const imageRef = ref(storage, `communities/${communityData.id}/image`);
      await uploadString(imageRef, selectedFile, "data_url");

      const downloadURL = await getDownloadURL(imageRef);
      await updateDoc(doc(firestore, "communities", communityData.id), {
        imageURL: downloadURL,
      });

      setCommunityStateValue((prev) => ({
        ...prev,
        currentCommunity: {
          ...prev.currentCommunity,
          imageURL: downloadURL,
        } as Community,
      }));
    } catch (error: any) {
      console.log("onUpdateImage Error", error.message);
    }
    setLoading(false);
    setUploadingImage(false);
  };

  const onUpdateBanner = async () => {
    if (!selectedBannerPic) return;
    setLoading(true);
    setUploadingImage(true);
    try {
      const imageRef = ref(storage, `communities/${communityData.id}/banner`);
      await uploadString(imageRef, selectedBannerPic, "data_url");

      const downloadURL = await getDownloadURL(imageRef);
      await updateDoc(doc(firestore, "communities", communityData.id), {
        bannerURL: downloadURL,
      });

      setCommunityStateValue((prev) => ({
        ...prev,
        currentCommunity: {
          ...prev.currentCommunity,
          bannerURL: downloadURL,
        } as Community,
      }));
    } catch (error: any) {
      console.log("onUpdateBanner Error", error.message);
    }
    setLoading(false);
    setUploadingImage(false);
  };

  return (
    <Box position="sticky" top="14px">
      <Flex
        justify="space-between"
        align="center"
        bg="blue.400"
        color="white"
        p={3}
        borderRadius="4px 4px 0px 0px"
      >
        <Text fontSize="10pt" fontWeight={700}>
          About Community
        </Text>
        <Icon as={HiOutlineDotsHorizontal} />
      </Flex>
      <Flex direction="column" p={3} bg="white" borderRadius="0px 0px 4px 4px">
        <Stack>
          <Flex width="100%" p={2} fontSize="10pt" fontWeight={700}>
            <Flex direction="column" flexGrow={1}>
              <Text>{communityData.numberOfMembers.toLocaleString()}</Text>
              <Text>Members</Text>
            </Flex>
            <Flex direction="column" flexGrow={1}>
              <Text>1</Text>
              <Text>Online</Text>
            </Flex>
          </Flex>
          <Divider />
          <Flex
            align="center"
            width="100%"
            p={1}
            fontSize="10pt"
            fontWeight={500}
          >
            <Icon as={RiCakeLine} fontSize={18} mr={2} />
            {communityData.createdAt && (
              <Text>
                Created{" "}
                {moment(
                  new Date(communityData.createdAt.seconds * 1000)
                ).format("MMM DD, YYYY")}
              </Text>
            )}
          </Flex>
          <Link href={`/r/${communityData.id}/submit`}>
            <Button mt={3} height="30px" width="100%">
              Create Post
            </Button>
          </Link>
          {user?.uid === communityData.creatorID && (
            <>
              <Divider />
              <Stack spacing={1} fontSize="10pt">
                <Text fontWeight={600}>Admin</Text>
                <Flex align="center" justify="space-between">
                  <Text
                    color="blue.500"
                    cursor="pointer"
                    _hover={{ textDecoration: "underline" }}
                    onClick={() => {
                      selectedFileRef.current?.click();
                    }}
                  >
                    Change Image
                  </Text>
                  <input
                    ref={selectedFileRef}
                    type="file"
                    hidden
                    onChange={onSelectFile}
                  />
                  {communityData.imageURL || selectedFile ? (
                    <Image
                      src={selectedFile || communityData.imageURL}
                      borderRadius="full"
                      boxSize="40px"
                      alt="Community Image"
                    />
                  ) : (
                    <Icon
                      as={FaReddit}
                      fontSize={40}
                      color="brand.100"
                      mr={2}
                    />
                  )}
                </Flex>
                {selectedFile &&
                  (loading || uploadingImage ? (
                    <Spinner />
                  ) : (
                    <Text cursor="pointer" onClick={onUpdateImage}>
                      Save Changes
                    </Text>
                  ))}
                <Divider />
                <Flex align="center" justify="space-between">
                  <Text
                    color="blue.500"
                    cursor="pointer"
                    _hover={{ textDecoration: "underline" }}
                    onClick={() => {
                      selectedBannerRef.current?.click();
                    }}
                  >
                    Change Banner
                  </Text>
                  <input
                    ref={selectedBannerRef}
                    type="file"
                    hidden
                    onChange={onSelectBannerPic}
                  />
                  {communityData.bannerURL || selectedBannerPic ? (
                    <Image
                      src={selectedBannerPic || communityData.bannerURL}
                      boxSize="40px"
                      alt="Banner Image"
                    />
                  ) : (
                    <Icon
                      as={FaReddit}
                      fontSize={40}
                      color="brand.100"
                      mr={2}
                    />
                  )}
                </Flex>
                {selectedBannerPic &&
                  (loading || uploadingImage ? (
                    <Spinner />
                  ) : (
                    <Text cursor="pointer" onClick={onUpdateBanner}>
                      Save Changes
                    </Text>
                  ))}
              </Stack>
            </>
          )}
        </Stack>
      </Flex>
    </Box>
  );
};
export default About;
