import { Timestamp } from "@google-cloud/firestore";
import { atom } from "recoil";

export interface Community {
    id: string,
    creatorID: string,
    numberOfMembers: number,
    privacyType: 'public' | 'restricted' | 'private',
    createdAt?: Timestamp,
    imageURL?: string,
    bannerURL? : string
}

export interface CommunitySnippet {
    communityId: string,
    isModerator?: boolean,
    imageURL?: string,
    bannerURL?: string
}

interface CommunityState {
    mySnippets: CommunitySnippet[],
    currentCommunity?: Community
}

const defaultCommunityState: CommunityState = {
    mySnippets: []
}

export const communityState = atom<CommunityState>({
    key: 'communitiesState',
    default: defaultCommunityState
})

