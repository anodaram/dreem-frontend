import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import HomePage from "./subPages/HomePage";
import CreatorPage from "./subPages/CreatorPage";
import ManageContentPage from "./subPages/ManageContentPage";
import GettingStartedPage from "./subPages/GettingStartedPage";
import LandingPage from "components/Landing";
import RealmDetailPage from "./subPages/RealmDetailPage";
import MainPage from "./subPages/MainPage";
import ExplorePage from "./subPages/ExplorePage";
// import ClaimDreemPage from "./subPages/ClaimDreemPage";
import UseScrollTop from "shared/hooks/useScrollTop";
import Error404Page from "./subPages/Error404Page";
import MetaversePage from "./subPages/MetaversePage";
import GameDetailPage from "./subPages/GameDetailPage";

// marketplace
import NFTReserves from "./subPages/NFTReserves";
import ExploreReserveDetailPage from "./subPages/NFTReserves/components/ExploreReserveDetailPage";
import ExploreAvatarPage from "./subPages/ExploreAvatarPage";
import NotificationPage from "./subPages/NotificationPage";

export default function PriviMetaverseRouter(props) {
  return (
    <>
      <UseScrollTop />
      <Switch>
        <Route exact path="/reserve/:id" component={NFTReserves} />
        <Route exact path="/reserve/explore/:collection_id/:token_id" component={ExploreReserveDetailPage} />
        <Route exact path="/play" component={LandingPage} />
        <Route exact path="/create" component={ManageContentPage} />
        <Route exact path="/realms/:id" component={RealmDetailPage} />
        <Route exact path="/realms/:id/:character_id" component={RealmDetailPage} />
        <Route exact path="/realms" component={ExplorePage} />
        <Route exact path="/metaverse" component={MetaversePage} />
        <Route exact path="/metaverse/:id" component={GameDetailPage} />
        <Route exact path="/metaverse/:id/:media_id" component={GameDetailPage} />
        <Route exact path="/avatars" component={ExploreAvatarPage} />
        <Route exact path="/nft/:nftId" component={HomePage} />,
        <Route exact path="/profile/:creatorAddress" component={CreatorPage} />
        <Route exact path="/profile/:creatorAddress/:draftId" component={CreatorPage} />
        <Route exact path="/become_creator" component={GettingStartedPage} />
        <Route exact path="/notifications" component={NotificationPage} />

        {/* <Route exact path="/claim_dreem" component={ClaimDreemPage} />, */}
        <Route exact path="/" component={MainPage} />
        <Route path="/404" component={Error404Page} />
        <Redirect to="/404" />
      </Switch>
    </>
  );
}
