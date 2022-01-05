import React, { useState, useEffect } from "react";
import "./SeeAllPosts.css";
import WallItem from "./WallItem";
import URL from "../../functions/getURL";
import { useSelector } from "react-redux";
import { RootState } from "store/reducers/Reducer";

const SeeAllPosts = (props: any) => {
  const userSelector = useSelector((state: RootState) => state.user);
  const users = useSelector((state: RootState) => state.usersInfoList);

  const [pinnedPosts, setPinnedPosts] = useState<any[]>([]);
  const [otherPosts, setOtherPosts] = useState<any[]>([]);
  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(() => {
    let posts = [...props.posts];

    if (users && users.length > 0) {
      users.forEach(user => {
        posts.forEach((post, index) => {
          if (user.id === post.Creator) {
            posts[index].userImageURL = user.imageURL;
            posts[index].userName = user.name;
          }
        });
      });
    }

    let postsOther = posts.filter(post => !post.pinned || post.pinned === false);
    let postsPinned = posts.filter(post => post.pinned && post.pinned === true);
    setOtherPosts(postsOther);
    setPinnedPosts(postsPinned);

    if (props.type && props.type === "PodPost") {
      setImageUrl(`${URL()}/pod/wall/getPostPhoto/`);
    } else if (props.type && props.type === "MediaPodPost") {
      setImageUrl(`${URL()}/mediaPod/wall/getPostPhoto/`);
    } else if (props.type && props.type === "PodNFTPost") {
      setImageUrl(`${URL()}/pod/NFT/wall/getPostPhoto/`);
    } else if (props.type && props.type === "CreditPost") {
      setImageUrl(`${URL()}/priviCredit/wall/getPostPhoto/`);
    } else if (props.type && props.type === "InsurancePost") {
      setImageUrl(`${URL()}/insurance/wall/getPostPhoto/`);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users]);

  return (
    <div className="seeAllPosts">
      <div className="headerSeeAllPosts">{props.title}</div>

      {pinnedPosts && pinnedPosts.length > 0 ? (
        <div>
          <div className="subheaderSeeAllPosts">Pinned posts</div>
          <div className="arrowPostsSeeAllPosts">
            {pinnedPosts && pinnedPosts.length > 0
              ? pinnedPosts.map((item, index) => {
                  return (
                    <WallItem
                      item={item}
                      imageUrl={imageUrl + item.id}
                      key={`wall-item-${index}`}
                      type={props.type}
                      itemTypeId={props.itemTypeId}
                      admin={props.pod.Creator === userSelector.id}
                      handleRefresh={() => props.handleRefresh()}
                      index={index}
                    />
                  );
                })
              : null}
          </div>
        </div>
      ) : null}

      <div className="newPostsPartSeeAll">
        <div className="subheaderSeeAllPosts">New posts</div>
        <div className="arrowPostsSeeAllPosts">
          {otherPosts && otherPosts.length > 0 ? (
            otherPosts.map((item, index) => {
              return (
                <WallItem
                  item={item}
                  imageUrl={imageUrl + item.id}
                  Creator={props.creator}
                  key={`wall-item-${index}`}
                  type={props.type}
                  itemTypeId={props.itemTypeId}
                  admin={props.creator === userSelector.id}
                  handleRefresh={() => props.handleRefresh()}
                  index={index}
                />
              );
            })
          ) : (
            <div>No posts available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeeAllPosts;
