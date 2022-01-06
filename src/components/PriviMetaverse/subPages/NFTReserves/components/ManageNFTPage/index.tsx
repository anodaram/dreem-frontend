import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router";
import { useDispatch } from "react-redux";
import OwnersPanel from "./components/OwnersPanel";
import RentedByMe from "./components/RentedByMe";
import BlockedByMe from "./components/BlockedByMe";
import { BackButton } from "components/PriviMetaverse/components/BackButton";

import { useManageNFTPageStyles } from "./index.styles";
import Box from "shared/ui-kit/Box";
import cls from "classnames";
import { getAllTokenInfos } from "shared/services/API/TokenAPI";
import { setTokenList } from "store/actions/MarketPlace";

type TabId = "owners" | "rent" | "block";
interface Tab {
  label: string;
  id: TabId;
}

const ManageNFTPage = () => {
  const classes = useManageNFTPageStyles();
  const [selectedTab, setSelectedTab] = useState<TabId>("owners");
  const history = useHistory();
  const params: { tab?: string } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    getTokenList();
  }, []);

  useEffect(() => {
    if (params?.tab) {
      setSelectedTab(params.tab as TabId);
    }
  }, [params]);

  const getTokenList = async () => {
    getAllTokenInfos().then(res => {
      if (res.success) {
        dispatch(setTokenList(res.tokens));
      }
    });
  };

  const TABS: Tab[] = [
    {
      label: "OWNERS PANEL",
      id: "owners",
    },
    {
      label: "RENTED BY ME",
      id: "rent",
    },
    {
      label: "BLOCKED BY ME",
      id: "block",
    },
  ];

  return (
    <Box
      width="100%"
      style={{
        overflow: "auto",
      }}
    >
      <Box className={`${classes.backButtonContainer} ${classes.fitContent}`}>
        <Box className={classes.backBtn} onClick={() => history.goBack()}>
          <BackButton purple />
        </Box>
        <Box className={classes.title}>Manage NFTs</Box>
      </Box>
      <Box width="100%" borderBottom="2px solid rgba(196,196,196,0.4)">
        <div className={`${classes.subTitleSection} ${classes.fitContent}`}>
          {TABS.map(tab => (
            <div
              className={cls({ [classes.selectedTabSection]: selectedTab === tab.id }, classes.tabSection)}
              onClick={() => setSelectedTab(tab.id as TabId)}
              key={tab.id}
            >
              <span>{tab.label}</span>
            </div>
          ))}
        </div>
      </Box>
      <Box width="100%" className={classes.fitContent}>
        {selectedTab === "owners" ? (
          <OwnersPanel />
        ) : selectedTab === "rent" ? (
          <RentedByMe />
        ) : selectedTab === "block" ? (
          <BlockedByMe />
        ) : null}
      </Box>
    </Box>
  );
};

export default ManageNFTPage;
