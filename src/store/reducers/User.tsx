import * as actionTypes from "../actions/ActionTypes";
import { RootState } from "./Reducer";

const fabBalance = [
  { id: 0, name: "ETH", symbol: "ETH", amount: 0, address: "" },
  { id: 1, name: "BAL", symbol: "BAL", amount: 0, address: "" },
  { id: 2, name: "BAT", symbol: "BAT", amount: 0, address: "" },
  { id: 3, name: "BC", symbol: "BC", amount: 0, address: "" },
  { id: 4, name: "DC", symbol: "DC", amount: 0, address: "" },
  { id: 5, name: "COMP", symbol: "COMP", amount: 0, address: "" },
  { id: 6, name: "DAI", symbol: "DAI", amount: 0, address: "" },
  { id: 7, name: "EOS", symbol: "EOS", amount: 0, address: "" },
  { id: 8, name: "LINK", symbol: "LINK", amount: 0, address: "" },
  { id: 9, name: "MKR", symbol: "MKR", amount: 0, address: "" },
  { id: 10, name: "PC", symbol: "PC", amount: 0, address: "" },
  { id: 11, name: "UNI", symbol: "UNI", amount: 0, address: "" },
  { id: 12, name: "USDT", symbol: "USDT", amount: 0, address: "" },
  { id: 13, name: "WBTC", symbol: "WBTC", amount: 0, address: "" },
  { id: 14, name: "XPR", symbol: "XPR", amount: 0, address: "" },
  { id: 15, name: "YFI", symbol: "YFI", amount: 0, address: "" },
  { id: 16, name: "PI", symbol: "PI", amount: 0, address: "" },
];

const ethBalance = [
  { id: 0, name: "Ethereum", symbol: "ETH", amount: 0, address: "" },
  { id: 1, name: "DAI StableCoin", symbol: "DAI", amount: 0, address: "" },
  { id: 2, name: "Privi Protocol", symbol: "PRIVI", amount: 0, address: "" },
];

const ethExternalWallet = [];

type rootState = RootState["user"];
interface State extends rootState {}
interface Action extends rootState {
  type: string;
  payload: any;
}

// Set initial state for User
const initialState: State = {
  address: "",
  age: -1,
  country: "",
  currency: "",
  dialCode: "",
  email: "",
  endorsementScore: -1,
  firstName: "",
  numFollowers: 0,
  followingFTPods: [],
  followingNFTPods: [],
  numFollowings: 0,
  myNFTPods: [],
  myFTPods: [],
  investedNFTPods: [],
  investedFTPods: [],
  connected: false,
  gender: "",
  id: "",
  lastName: "",
  lastUpdate: -1,
  location: "",
  phone: "",
  postalCode: "",
  role: "",
  trustScore: -1,
  isSignedIn: false,
  bio: "",
  hasPhoto: false,
  twitter: "",
  instagram: "",
  facebook: "",
  jwt: "",
  level: 0,
  isLevelUp: false,
  ethAccount: "",
  ethType: "none",
  ethExternalWallet: ethExternalWallet,
  ethBalance: ethBalance,
  fabBalance: fabBalance,
  web3: null,
  availableTokens: [],
  awards: [],
  creds: 0,
  verified: false,
  anon: false,
  anonAvatar: "ToyFaces_Colored_BG_111.jpg",
  backgroundURL: "",
  mnemonic: "",
  votationId: "",
  tutorialsSeen: {
    communities: false,
    pods: false,
    creditPools: false,
  },
  userAddress: "",
  dob: 0,
  urlSlug: "",
  badges: [],
  url: "",
  FollowingCommunities: [],
  followingProposals: [],
  uninterestedMedias: [],
  whitelisted: false,
  infoImage: {}
};

// Set a User into the global state
const setUser = (state: State, { type, ...payload }: Action) => {
  return {
    ...state,
    ...payload,
  };
};

const editUser = (state: State, action: Action) => {
  return {
    ...state,
    ...action.payload,
  };
};

// Set an ethereum account into User state
const setEthAccount = (state: State, action: Action) => {
  return {
    ...state,
    ...{
      ethAccount: action.ethAccount,
      ethType: action.ethType || state.ethType,
    },
  };
};

// Set the User's Ethereum balance into User state
const setEthBalance = (state: State, action: Action) => {
  return {
    ...state,
    ...{
      ethBalance: action.ethBalance,
    },
  };
};

// Set the User's Fabric balance into User state
const setEthExternalWallet = (state: State, action: Action) => {
  return {
    ...state,
    ...{
      ethExternalWallet: action.ethExternalWallet,
    },
  };
};

// Set the User's Fabric balance into User state
const setFabBalance = (state: State, action: Action) => {
  return {
    ...state,
    ...{
      fabBalance: action.fabBalance,
    },
  };
};

// Set web3 class to User state
const setWeb3 = (state: State, action: Action) => {
  return {
    ...state,
    ...{
      web3: action.web3,
    },
  };
};

// Set available tokens to User state
const setAvailableTokens = (state: State, action: Action) => {
  return {
    ...state,
    ...{
      availableTokens: action.availableTokens,
    },
  };
};

// Update anon avatar to User State
const updateAnonAvatar = (state: State, action: Action) => {
  return {
    ...state,
    anonAvatar: action.anonAvatar,
  };
};

// Update profile background to User State
const updateProfileBackground = (state: State, action: Action) => {
  return {
    ...state,
    ...{
      backgroundURL: action.backgroundURL,
    },
  };
};

const updateWalletAddress = (state: State, action: Action) => {
  return {
    ...state,
    ...{
      address: action.address,
    },
  };
};

// Update tutorials to User State
const updateTutorialsSeen = (state: State, action: Action) => {
  return {
    ...state,
    ...{
      tutorialsSeen: action.tutorialsSeen,
    },
  };
};

// Sign User out
const signOut = (state: State) => {
  console.log("user reducer signout");

  return {
    ...state,
    ...initialState,
  };
};

// Return the User state
const reducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      return setUser(state, action);
    case actionTypes.EDIT_USER:
      return editUser(state, action);
    case actionTypes.SET_ETH_ACCOUNT:
      return setEthAccount(state, action);
    case actionTypes.SET_ETH_BALANCE:
      return setEthBalance(state, action);
    case actionTypes.SET_FAB_BALANCE:
      return setFabBalance(state, action);
    case actionTypes.SET_ETH_EXTERNAL_WALLET:
      return setEthExternalWallet(state, action);
    case actionTypes.SET_WEB3:
      return setWeb3(state, action);
    case actionTypes.SET_AVAILABLE_TOKENS:
      return setAvailableTokens(state, action);
    case actionTypes.UPDATE_ANON_AVATAR:
      return updateAnonAvatar(state, action);
    case actionTypes.UPDATE_PROFILE_BACKGROUND:
        return updateProfileBackground(state, action);
    case actionTypes.UPDATE_TUTORIALS_SEEN:
      return updateTutorialsSeen(state, action);
    case actionTypes.UPDATE_WALLET_ADDRESS:
      return updateWalletAddress(state, action);
    case actionTypes.SIGN_OUT:
      return signOut(state);
    default:
      return state;
  }
};

export default reducer;
