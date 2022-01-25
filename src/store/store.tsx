import userReducer from "./reducers/User";
import slugReducer from "./reducers/Slug";
import loanReducer from "./reducers/Loan";
import stakingReducer from "./reducers/Staking";
import podsReducer from "./reducers/PodsManager";
import userBalances from "./reducers/UserBalances";
import usersInfoReducer from "./reducers/UsersInfo";
import loginBoolReducer from "./reducers/LoginBool";
import marketPlaceReducer from "./reducers/MarketPlace";
import MessageBoxReducer from "./reducers/MessageBox";
import reserveReducer from "./reducers/StakingReserve";
import sideBarShowReducer from "./reducers/SideBarShow";
import transactionReducer from "./reducers/Transactions";
import selectedUserReducer from "./reducers/SelectedUser";
import priviLendingReducer from "./reducers/PriviLending";
import usersDiscordRoom from "./reducers/UsersDiscordRoom";
import insuranceReducers from "./reducers/InsuranceManager";
import navigationReducer from "./reducers/navigationReducer";
import updateBasicInfoReducer from "./reducers/UpdateBasicInfo";
import selectedDiscordRoom from "./reducers/SelectedDiscordRoom";
import selectedAuthPageReducer from "./reducers/SelectedAuthPage";
import updatePodCreationReducer from "./reducers/UpdatePodCreation";
import usersTypesDiscordRoom from "./reducers/UsersTypesDiscordRoom";
import selectedLendingPageReducer from "./reducers/SelectedLendingPage";
import selectedProfilePageReducer from "./reducers/SelectedProfilePage";
import selectedSwapTabPoolReducer from "./reducers/SelectedSwapTabPool";
import updateAllProfileInfoReducer from "./reducers/UpdateAllProfileInfo";
import selectedMenuPriviSwapReducer from "./reducers/SelectedMenuPriviSwap";
import selectedSwapTabsValueReducer from "./reducers/SelectedSwapTabsValue";
import updateDiscordRoomInfoReducer from "./reducers/UpdateDiscordRoomInfo";
import selectedTokenPriviSwapReducer from "./reducers/SelectedTokenPriviSwap";
import selectedOtherProfilePageReducer from "./reducers/SelectedOtherProfilePage";
import selectedProtectionOptionsSwapReducer from "./reducers/SelectedProtectionOptionsSwap";
import selectedLiquidityPoolPriviSwapReducer from "./reducers/SelectedLiquidityPoolPriviSwap";
import underMaintenanceReducer from "./reducers/UnderMaintenance";
import worldReducer from "./reducers/World";
import { createStore, combineReducers, compose, applyMiddleware } from "redux";

// Set global state variables through Redux
const rootReducer = combineReducers({
  user: userReducer,
  slug: slugReducer,
  loan: loanReducer,
  reserves: reserveReducer,
  stakings: stakingReducer,
  topNav: navigationReducer,
  userBalances: userBalances,
  loginBool: loginBoolReducer,
  marketPlace: marketPlaceReducer,
  messageBox: MessageBoxReducer,
  usersInfoList: usersInfoReducer,
  sideBarShow: sideBarShowReducer,
  transactions: transactionReducer,
  priviLending: priviLendingReducer,
  selectedUser: selectedUserReducer,
  usersDiscordRoom: usersDiscordRoom,
  updateBasicInfo: updateBasicInfoReducer,
  selectedDiscordRoom: selectedDiscordRoom,
  myPodsList: podsReducer.reducerMyPodsList,
  selectedAuthPage: selectedAuthPageReducer,
  updatePodCreation: updatePodCreationReducer,
  usersTypesDiscordRoom: usersTypesDiscordRoom,
  poolsList: insuranceReducers.reducerPoolsList,
  otherPodsList: podsReducer.reducerOtherPodsList,
  selectedSwapTabPool: selectedSwapTabPoolReducer,
  myPodsLoading: podsReducer.reducerMyPodsLoading,
  selectedLendingPage: selectedLendingPageReducer,
  selectedProfilePage: selectedProfilePageReducer,
  updateAllProfileInfo: updateAllProfileInfoReducer,
  poolsLoading: insuranceReducers.reducerPoolsLoading,
  selectedMenuPriviSwap: selectedMenuPriviSwapReducer,
  updateDiscordRoomInfo: updateDiscordRoomInfoReducer,
  selectedSwapTabsValue: selectedSwapTabsValueReducer,
  trendingPodsList: podsReducer.reducerTrendingPodsList,
  selectedTokenPriviSwap: selectedTokenPriviSwapReducer,
  otherPodsLoading: podsReducer.reducerOtherPodsLoading,
  podMenuSelection: podsReducer.reducerPodMenuSelection,
  selectedOtherProfilePage: selectedOtherProfilePageReducer,
  trendingPodsLoading: podsReducer.reducerTrendingPodsLoading,
  trendingPoolsList: insuranceReducers.reducerTrendingPoolsList,
  selectedProtectionOptionsSwap: selectedProtectionOptionsSwapReducer,
  trendingPoolsLoading: insuranceReducers.reducerTrendingPoolsLoading,
  selectedLiquidityPoolPriviSwap: selectedLiquidityPoolPriviSwapReducer,
  underMaintenanceInfo: underMaintenanceReducer,
  world: worldReducer,
});

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// Create Store
export const store = createStore(rootReducer, composeEnhancers(applyMiddleware()));
