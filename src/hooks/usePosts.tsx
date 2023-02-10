import React, { useEffect } from "react";
import { useRecoilState, useSetRecoilState, useRecoilValue } from "recoil";
import { Post, PostVote, postState } from "../atoms/postAtom";
import { useState } from "react";
import { deleteObject, ref } from "firebase/storage";
import { auth, firestore, storage } from "../firebase/clientApp";
import {
  deleteDoc,
  doc,
  writeBatch,
  collection,
  query,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { authModalState } from "../atoms/authModalAtom";
import { where, getDocs } from "firebase/firestore";
import { communityState } from "../atoms/communitiesAtom";

const usePosts = () => {
  const [postStateValue, setPostStateValue] = useRecoilState(postState);
  const currentCommunity = useRecoilValue(communityState).currentCommunity;
  const [error, setError] = useState("");
  const [user] = useAuthState(auth);

  const setAuthModalSatte = useSetRecoilState(authModalState);

  const onVote = async (post: Post, vote: number, communityId: string) => {
    try {
      if (!user) setAuthModalSatte({ open: true, view: "login" });
      const { voteStatus } = post;
      const existingVote = postStateValue.postVotes.find(
        (vote) => vote.postId === post.id
      );

      const batch = writeBatch(firestore);
      const updatedPost = { ...post };
      let updatedPosts = [...postStateValue.posts];
      let updatedPostVotes = [...postStateValue.postVotes];
      let voteChange = vote;

      if (!existingVote) {
        //new vote
        const postVoteRef = doc(
          collection(firestore, "users", `${user?.uid}/postVotes`)
        );
        const newVote: PostVote = {
          id: postVoteRef.id,
          postId: post.id!,
          communityId,
          voteValue: vote,
        };

        batch.set(postVoteRef, newVote);

        updatedPost.voteStatus = voteStatus + vote;
        updatedPostVotes = [...updatedPostVotes, newVote];
      } else {
        //existing vote
        const postVoteRef = doc(
          firestore,
          "users",
          `${user?.uid}/postVotes/${existingVote.id}`
        );

        if (existingVote.voteValue === vote) {
          // removing existing vote
          updatedPost.voteStatus = voteStatus - vote;
          updatedPostVotes = updatedPostVotes.filter(
            (vote) => vote.id !== existingVote.id
          );
          batch.delete(postVoteRef);
          voteChange *= -1;
        } else {
          //flipping their vote
          updatedPost.voteStatus = voteStatus + 2 * vote;

          const voteIndex = postStateValue.postVotes.findIndex(
            (vote) => vote.id === existingVote.id
          );
          updatedPostVotes[voteIndex] = {
            ...existingVote,
            voteValue: vote,
          };

          batch.update(postVoteRef, {
            voteValue: vote,
          });
        }
      }

      const postRef = doc(firestore, "posts", post.id!);
      batch.update(postRef, {
        voteStatus: voteStatus + voteChange,
      });

      await batch.commit();

      const postIdx = postStateValue.posts.findIndex(
        (item) => item.id === post.id
      );
      updatedPosts[postIdx] = updatedPost;
      setPostStateValue((prev) => ({
        ...prev,
        posts: updatedPosts,
        postVotes: updatedPostVotes,
      }));
      /*
      if newVote? 
        add / subtract to/from post.voteStatus
        create a new postVote document and store it in the user's record
      else
        if removing vote?
          then it becomes neutral up=> neutral | down => neutral
        else
          theyre flipping their vote from up => down | down => up
          add / sub by 2
          update the existing document to reflect the changes
      */
    } catch (error: any) {
      console.log("onVote error", error.message);
      setError(error.message);
    }
  };

  const onSelectPost = () => {};

  const onDeletePost = async (post: Post): Promise<boolean> => {
    try {
      //if an image exixts, delete the image from firebase storage
      if (post.imageURL) {
        const imageRef = ref(storage, `posts/${post.id}/image`);
        await deleteObject(imageRef);
      }

      //delete the document from firestore
      const postDocRef = doc(firestore, "posts", post.id!);
      await deleteDoc(postDocRef);

      //update recoil state
      setPostStateValue((prev) => ({
        ...prev,
        posts: prev.posts.filter((item) => item.id !== post.id),
      }));
      return true;
    } catch (error: any) {
      setError(error.message);
      console.log("onDeletePost error", error.message);
      return false;
    }
  };

  const getCommunityPostVotes = async (communityId: string) => {
    const postVotesQuery = query(
      collection(firestore, "users", `${user?.uid}/postVotes`),
      where("communityId", "==", communityId)
    );

    const postVoteDocs = await getDocs(postVotesQuery);
    const postVotes = postVoteDocs.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setPostStateValue((prev) => ({
      ...prev,
      postVotes: postVotes as PostVote[],
    }));
  };

  useEffect(() => {
    if (!user || !currentCommunity.id) return;
    getCommunityPostVotes(currentCommunity.id);
  }, [user, currentCommunity]);

  return {
    postStateValue,
    setPostStateValue,
    onVote,
    onSelectPost,
    onDeletePost,
  };
};

export default usePosts;
