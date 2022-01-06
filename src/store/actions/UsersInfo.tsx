import * as actionTypes from "./ActionTypes";

export interface UserInfo {
  rate?: number;
  imageUrl?: string;
  assistances?: number;
  anonAvatar?: string;
  backgroundURL?: string;
  hasPhoto?: boolean;
  id: string;
  name: string;
  address: string;
  mnemonic: string;
  imageURL: string;
  level: number;
  numFollowers: number;
  numFollowings: number;
  creds: number;
  badges: any[];
  urlSlug: string;
  twitter: string;
  anon: boolean;
  verified: boolean;
  likes?: number;
  profileViews?: number;
  awards?: number;
  trust?: number;
  endorsement?: number;
  bio?: string;
  isExternalUser?: boolean;
  connected?: boolean;
  url?: string;
  myMediasCount?: number;
  wallets: any[];
  email?: string;
  whitelisted?: boolean;
  infoImage?: any;
  ipfsImage?: any;
}

export const createUserInfo = (
  id: string,
  name: string,
  address: string,
  mnemonic: string,
  imageURL: string,
  level: number,
  numFollowers: number,
  numFollowings: number,
  creds: number,
  badges: [],
  urlSlug: string,
  twitter: string,
  anon: boolean,
  verified: boolean,
  likes: number = 0,
  profileViews: number = 0,
  awards: number = 0,
  trust: number = 0,
  endorsement: number = 0,
  bio: string = "",
  isExternalUser: boolean = false,
  connected: boolean = false,
  rate: number = 0,
  imageUrl: string,
  assistances: number,
  anonAvatar: string,
  backgroundURL: string,
  hasPhoto: boolean,
  myMediasCount: number,
  url: string,
  wallets: [] = [],
  email: string,
  infoImage: any,
  whitelisted: boolean = false
): UserInfo => {
  return {
    id,
    name,
    address,
    mnemonic,
    imageURL,
    level,
    numFollowers,
    numFollowings,
    creds,
    badges,
    urlSlug,
    twitter,
    anon,
    verified,
    likes,
    profileViews,
    awards,
    trust,
    endorsement,
    bio,
    isExternalUser,
    connected,
    rate,
    imageUrl,
    assistances,
    anonAvatar,
    backgroundURL,
    hasPhoto,
    myMediasCount,
    url,
    wallets,
    email,
    infoImage,
    whitelisted
  };
};

// Set all Users into the global state
export const setUsersInfoList = (users: UserInfo[]) => ({
  type: actionTypes.SET_USERS_INFO_LIST,
  users: users,
});

export interface UserConnectStatus {
  userId: string;
  connected: boolean;
}

export const updateUsersInfoList = (data: UserConnectStatus) => ({
  type: actionTypes.UPDATE_USER_INFO,
  data,
});
