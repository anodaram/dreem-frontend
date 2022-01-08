import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router";
import { useDispatch } from "react-redux";

import Box from "shared/ui-kit/Box";
import { BackButton } from "components/PriviMetaverse/components/BackButton";
import { getAllTokenInfos } from "shared/services/API/TokenAPI";
import { setTokenList } from "store/actions/MarketPlace";
import TabsView, { TabItem } from "shared/ui-kit/TabsView";
import OwnersPanel from "./components/OwnersPanel";
import RentedByMe from "./components/RentedByMe";
import BlockedByMe from "./components/BlockedByMe";
import { useManageNFTPageStyles, useTabsStyles } from "./index.styles";

const TAB_OWNERS = "owners";
const TAB_RENT = "rent";
const TAB_BLOCK = "block";

const Tabs: TabItem[] = [
  {
    key: TAB_OWNERS,
    title: "owners",
  },
  {
    key: TAB_RENT,
    title: "rented by me",
  },
  {
    key: TAB_BLOCK,
    title: "blocked by me",
  },
];

const ManageNFTPage = () => {
  const classes = useManageNFTPageStyles();
  const tabsClasses = useTabsStyles();
  const history = useHistory();

  const [selectedTab, setSelectedTab] = React.useState<string>(TAB_OWNERS);
  const params: { tab?: string } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    getTokenList();
  }, []);

  useEffect(() => {
    if (params?.tab) {
      setSelectedTab(params.tab);
    }
  }, [params]);

  const getTokenList = async () => {
    getAllTokenInfos().then(res => {
      if (res.success) {
        dispatch(setTokenList(res.tokens.filter(t => t.Symbol === "USDT")));
      }
    });
  };

  return (
    <Box
      width="100%"
      style={{
        overflow: "auto",
      }}
      mt={9}
    >
      <Box width="100%" className={classes.fitContent}>
        <Box className={classes.backButtonContainer}>
          <BackButton light overrideFunction={() => history.goBack()} />
          <Box className={classes.pageTitle}>MANAGE NFTS</Box>
          <Box width={50} />
        </Box>
        <Box width="100%">
          <TabsView
            tabs={Tabs}
            onSelectTab={tab => {
              setSelectedTab(tab.key);
            }}
            extendedClasses={tabsClasses}
          />
        </Box>
        {selectedTab === TAB_OWNERS && <OwnersPanel />}
        {selectedTab === TAB_RENT && <RentedByMe />}
        {selectedTab === TAB_BLOCK && <BlockedByMe />}
      </Box>
    </Box>
  );
};

export default ManageNFTPage;
