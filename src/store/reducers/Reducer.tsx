import { useSelector, TypedUseSelectorHook } from "react-redux";
import { PriviData } from "../actions/PriviLending";
import { LoanData } from "../actions/Loan";
import { StakeReserveData } from "../actions/StakingReserveActions";
import { StakingData } from "../actions/StakingActions";
import { TransactionData } from "../actions/Transactions";
import { UserInfo } from "../actions/UsersInfo";
import { BalanceModel } from "../actions/UserBalancesActions";

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
  catalog?: any;
}

// Interface to define all types for Redux (Typescript requirement)
export interface RootState {
  user: {
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
    connected: false;
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
    ethAccount: string;
    ethType: "injected" | "walletconnect" | "none" | undefined;
    ethBalance: Balance[];
    fabBalance: Balance[];
    ethExternalWallet: EthExternalWallet[];
    web3: any;
    availableTokens: string[];
    creds: number;
    awards: any[];
    verified: boolean;
    twitterVerified?: boolean;
    anon: boolean;
    anonAvatar: string;
    backgroundURL: string;
    mnemonic: string;
    votationId: string;
    tutorialsSeen: {
      communities: boolean;
      pods: boolean;
      creditPools: boolean;
    };
    userAddress: string;
    dob: number;
    urlSlug: string;
    badges: any[];
    url: string;
    FollowingCommunities: any[];
    followingProposals: any[];
    uninterestedMedias?: string[];
    whitelisted?: boolean;
    name?: string;
    infoImage?: any;
    ipfsImage?: string;
  };
  underMaintenanceInfo: {
    info: any;
    publicy: boolean;
  };
  userBalances: {
    [key: string]: BalanceModel;
  };
  selectedProfilePage: {
    id: number;
  };
  selectedOtherProfilePage: {
    id: number;
  };
  selectedLendingPage: {
    id: number;
  };
  selectedAuthPage: {
    id: number;
  };
  selectedUser: {
    id: string;
    address: string;
  };
  selectedMenuPriviSwap: {
    id: number;
  };
  selectedSwapTabsValue: {
    id: number;
  };
  selectedSwapTabPool: {
    id: number;
  };
  selectedProtectionOptionsSwap: {
    id: number;
  };
  selectedLiquidityPoolPriviSwap: {
    value: string;
  };
  selectedTokenPriviSwap: {
    value: string;
  };
  priviLending: Map<string, PriviData>;
  loan: Map<string, LoanData>;
  reserves: Map<string, StakeReserveData>;
  stakings: Map<string, StakingData>;
  topNav: {
    containerClassnames: string;
    subHiddenBreakpoint: number;
    menuHiddenBreakpoint: number;
    menuClickCount: number;
    selectedMenuHasSubItems: boolean;
  };
  updateBasicInfo: {
    value: boolean;
  };
  updateAllProfileInfo: {
    value: boolean;
  };
  updateDiscordRoomInfo: {
    value: boolean;
  };
  updatePodCreation: {
    value: boolean;
  };
  myPodsList: {
    list: any[];
  };
  trendingPodsList: {
    list: any[];
  };
  otherPodsList: {
    list: any[];
  };
  myPodsLoading: {
    bool: boolean;
  };
  trendingPodsLoading: {
    bool: boolean;
  };
  otherPodsLoading: {
    bool: boolean;
  };
  sideBarShow: {
    bool: boolean;
  };
  transactions: TransactionData[];
  trendingPoolsList: {
    list: any[];
  };
  poolsList: {
    list: any[];
  };
  trendingPoolsLoading: {
    bool: boolean;
  };
  poolsLoading: {
    bool: boolean;
  };
  loginBool: {
    bool: boolean;
  };
  selectedDiscordRoom: {
    value: any;
  };
  usersDiscordRoom: {
    value: any;
  };
  usersTypesDiscordRoom: {
    value: any[];
  };
  usersInfoList: UserInfo[];
  podMenuSelection: {
    value: number;
  };
  slug: { slug: string };
  messageBox: {
    isOpenMessageBox: boolean;
    userInfo: UserInfo;
    message: string;
    isSendMessage: boolean;
    chat: any;
    chatUsers: any;
    openChatModal: boolean;
    openNewChatModal: boolean;
    activeChats: any[];
    newChatInList: any;
  };
  marketPlace: {
    tokenList: any[];
    fee: number;
    selectedTabMarketMain: string;
    selectedTabMarketManageNFTMain: number | string;
    selectedTabMarketManageNFTSub: number;
  };
}

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
