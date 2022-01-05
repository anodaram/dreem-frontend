import * as actionTypes from "./ActionTypes";
import { RootState } from "store/reducers/Reducer";

interface Balance {
  id: number;
  name: string;
  symbol: string;
  amount: number;
  address: string;
}

interface EthExternalWalletToken {
  name: string;
  symbol: string;
  decimals: number;
  type: string;
  address: string;
  images: any;
  balance: string;
}

interface EthExternalWallet {
  address: string;
  tokens: EthExternalWalletToken[];
}

// Set a User into the global state
export const setUser = (payload: {
  address: string;
  age: number;
  country: string;
  currency: string;
  dialCode: string;
  email: string;
  endorsementScore: number;
  firstName: string;
  numFollowers: number;
  followingFTPods: any[];
  followingNFTPods: any[];
  numFollowings: number;
  myNFTPods: any[];
  myFTPods: any[];
  investedNFTPods: any[];
  investedFTPods: any[];
  gender: string;
  id: string;
  lastName: string;
  lastUpdate: number;
  location: string;
  phone: string;
  postalCode: string;
  role: string;
  trustScore: number;
  isSignedIn: boolean;
  bio: string;
  hasPhoto: boolean;
  twitter: string;
  instagram: string;
  facebook: string;
  jwt: string;
  level: number;
  isLevelUp: boolean;
  creds: number;
  awards: any[];
  verified: boolean;
  anon: boolean;
  anonAvatar: string;
  backgroundURL: string;
  mnemonic: string; // only for testnet
  votationId: string;
  tutorialsSeen: { communities: boolean; pods: boolean; creditPools: boolean };
  userAddress: string;
  dob: number;
  urlSlug: string;
  url: string;
  FollowingCommunities: any[];
  followingProposals: any[];
  infoImage?: any;
  uninterestedMedias?: string[];
  whitelisted?: boolean;
}) => ({
  type: actionTypes.SET_USER,
  ...payload,
});

export const editUser = (payload: Partial<RootState["user"]>) => ({
  type: actionTypes.EDIT_USER,
  payload,
});

export const setEthAccount = (ethAccount: string, ethType?: "injected" | "walletconnect" | "none") => ({
  type: actionTypes.SET_ETH_ACCOUNT,
  ethAccount: ethAccount,
  ethType,
});

export const setEthBalance = (ethBalance: Balance[]) => ({
  type: actionTypes.SET_ETH_BALANCE,
  ethBalance: ethBalance,
});

export const setEthExternalWallet = (ethExternalWallet: EthExternalWallet[]) => ({
  type: actionTypes.SET_ETH_EXTERNAL_WALLET,
  ethExternalWallet: ethExternalWallet,
});

export const setFabBalance = (fabBalance: Balance[]) => ({
  type: actionTypes.SET_FAB_BALANCE,
  fabBalance: fabBalance,
});

export const setWeb3 = (web3: any) => ({
  type: actionTypes.SET_WEB3,
  web3: web3,
});

export const setAvailableTokens = (availableTokens: string[]) => ({
  type: actionTypes.SET_AVAILABLE_TOKENS,
  availableTokens: availableTokens,
});

export const updateAnonAvatar = (anonAvatar: string) => ({
  type: actionTypes.UPDATE_ANON_AVATAR,
  anonAvatar: anonAvatar,
});

export const updateProfileBackground = (backgroundURL: string) => ({
  type: actionTypes.UPDATE_PROFILE_BACKGROUND,
  backgroundURL: backgroundURL,
});

export const updateWalletAddress = (address: string) => ({
  type: actionTypes.UPDATE_WALLET_ADDRESS,
  address: address,
});

export const updateTutorialsSeen = (tutorialsSeen: {
  communities: boolean;
  pods: boolean;
  creditPools: boolean;
}) => ({
  type: actionTypes.UPDATE_TUTORIALS_SEEN,
  tutorialsSeen: tutorialsSeen,
});

// Sign User out
export const signOut = () => ({
  type: actionTypes.SIGN_OUT,
});
