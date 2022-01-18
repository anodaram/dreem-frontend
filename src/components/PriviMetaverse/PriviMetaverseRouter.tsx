import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import HomePage from "./subPages/HomePage";
import CreatorPage from "./subPages/CreatorPage";
import ManageContentPage from "./subPages/ManageContentPage";
import GettingStartedPage from "./subPages/GettingStartedPage";
import CreatingRealmPage from "./subPages/CreatingRealmPage";
import CreatingExtensionPage from "./subPages/CreatingExtensionPage";
import LandingPage from "components/Landing";
import CollectionDetailPage from "./subPages/CollectionDetailPage";
import RealmDetailPage from "./subPages/RealmDetailPage";
import MainPage from "./subPages/MainPage";
import ExplorePage from "./subPages/ExplorePage";
import UseScrollTop from "shared/hooks/useScrollTop";
import Error404Page from "./subPages/Error404Page";
import GameDetailPage from "./subPages/GameDetailPage";
import NotificationPage from "./subPages/NotificationPage";
import NFTReserves from "./subPages/NFTReserves";
import ManageNFTPage from "./subPages/NFTReserves/components/ManageNFTPage";
import ExploreReserveDetailPage from "./subPages/NFTReserves/components/ExploreReserveDetailPage";
import ExploreAvatarPage from "./subPages/ExploreAvatarPage";
import RealmMapPage from "./subPages/RealmMapPage";
import WorldDetailPage from "./subPages/WorldDetailPage";

// import ClaimDreemPage from "./subPages/ClaimDreemPage";
// import MetaversePage from "./subPages/MetaversePage";

export default function PriviMetaverseRouter(props) {
  return (
    <>
      <UseScrollTop />
      <Switch>
        <Route exact path="/play" component={LandingPage} />
        <Route exact path="/create" component={ManageContentPage} />
        <Route exact path="/collection/:id" component={CollectionDetailPage} />
        <Route exact path="/realms/map/:id" component={RealmMapPage} />
        <Route exact path="/realms/:id" component={RealmDetailPage} />
        <Route exact path="/realms/:id/:character_id" component={RealmDetailPage} />
        <Route exact path="/realms" component={ExplorePage} />
        <Route exact path="/world/:id" component={WorldDetailPage} />
        <Route exact path="/avatars" component={ExploreAvatarPage} />
        <Route exact path="/nft/:nftId" component={HomePage} />,
        <Route exact path="/profile/:creatorAddress" component={CreatorPage} />
        <Route exact path="/profile/:creatorAddress/:draftId" component={CreatorPage} />
        <Route exact path="/become_creator" component={GettingStartedPage} />
        <Route exact path="/creating_realm" component={CreatingRealmPage} />
        <Route exact path="/creating_extension" component={CreatingExtensionPage} />
        <Route exact path="/gameNFTS" component={NFTReserves} />
        <Route exact path="/gameNFTS/manage_nft/:tab?" component={ManageNFTPage} />
        <Route exact path="/gameNFTS/:collection_id" component={GameDetailPage} />
        <Route exact path="/gameNFTS/:collection_id/:token_id" component={ExploreReserveDetailPage} />
        <Route exact path="/notifications" component={NotificationPage} />
        {/* <Route exact path="/metaverse" component={MetaversePage} />
        <Route exact path="/claim_dreem" component={ClaimDreemPage} /> */}
        <Route exact path="/" component={MainPage} />
        <Route path="/404" component={Error404Page} />
        <Redirect to="/404" />
      </Switch>
    </>
  );
}
