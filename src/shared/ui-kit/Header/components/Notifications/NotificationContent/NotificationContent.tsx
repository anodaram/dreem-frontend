import React from "react";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { Notification } from "shared/services/API/NotificationsAPI";
import { setSelectedUser } from "store/actions/SelectedUser";

type NotificationContentProps = {
  notification: Notification;
};

// TODO: Please refactor me to something shorter and configurable :""""(
export const NotificationContent: React.FunctionComponent<NotificationContentProps> = ({ notification }) => {
  const { type, itemId, follower, externalData } = notification;

  const history = useHistory();
  const location = useLocation();

  const dispatch = useDispatch();

  const handleProfileRouting = () => {
    if (location) {
      const pathContextList = location.pathname.split("/");
      if (pathContextList.length > 0) {
        history.push(`/${pathContextList[1]}/profile/${itemId}`);
      }
    }

    dispatch(setSelectedUser(itemId));
  };

  const goToNFTDetail = () => {
    history.push(`/gameNFT/${externalData.nft.collection}/${externalData.nft.id}`)
  }

  return (
    <>
      {type === 1 ? (
        <div>
          You are getting noticed! Do you want to accept <b onClick={handleProfileRouting}>{follower}</b>{" "}
          request to follow?
        </div>
      ) : type === 2 ? (
        <div>
          Your network is expanding! <b onClick={handleProfileRouting}>{follower}</b> accepts your request to
          follow.
        </div>
      ) : type === 236 ? (
        <div>
          <div>
            {externalData.user} placed a new offer on {externalData.nft.name} to Rent it for{" "}
            {externalData.price} USDT over {Number(externalData.duration).toFixed(2)} days
          </div>
          <b
            style={{ color: "rgba(233, 255, 38, 1)" }}
            onClick={() =>
              goToNFTDetail()
            }
          >
            Go to your NFT
          </b>
        </div>
      ) : type === 237 ? (
        <div>
          <div>
            {externalData.user} rented your {externalData.nft.name} at instant price of {externalData.price}{" "}
            USDT over {Number(externalData.duration).toFixed(2)} days
          </div>
          <b
            style={{ color: "rgba(233, 255, 38, 1)" }}
            onClick={() =>
              goToNFTDetail()
            }
          >
            Go to your NFT
          </b>
        </div>
      ) : type === 238 ? (
        <div>
          <div>
            You have accepted {externalData.user} rent offer for {externalData.price} USDT/sec for{" "}
            {Number(externalData.duration).toFixed(2)} Days on your NFT {externalData.nft.name}
          </div>
          <b
            style={{ color: "rgba(233, 255, 38, 1)" }}
            onClick={() =>
              goToNFTDetail()
            }
          >
            Go to your NFT
          </b>
        </div>
      ) : type === 239 ? (
        <div>
          <div>Your blocked NFT {externalData.nft.name} is was fully Paid and is now unblocked.</div>
          <b
            style={{ color: "rgba(233, 255, 38, 1)" }}
            onClick={() =>
              goToNFTDetail()
            }
          >
            Go to your NFT Reserve
          </b>
        </div>
      ) : type === 240 ? (
        <div>
          <div>The NFT {externalData.nft.name} is now fully paid and unblocked. You are now the owner.</div>
          <b
            style={{ color: "rgba(233, 255, 38, 1)" }}
            onClick={() =>
              goToNFTDetail()
            }
          >
            Go to your management
          </b>
        </div>
      ) : type === 241 ? (
        <div>
          <div>
            Your blocked NFT {externalData.nft.name} is has expired to to NFT and claim the collateral and NFT
            back
          </div>
          <b
            style={{ color: "rgba(233, 255, 38, 1)" }}
            onClick={() =>
              goToNFTDetail()
            }
          >
            Go to your NFT Reserve
          </b>
        </div>
      ) : type === 242 ? (
        <div>
          <div>
            The NFT {externalData.nft.name} wasn’t fully paid before expiration and is now returned to the
            owner along with your collateral.
          </div>
          <b
            style={{ color: "rgba(233, 255, 38, 1)" }}
            onClick={() =>
              goToNFTDetail()
            }
          >
            Go to your management
          </b>
        </div>
      ) : type === 243 ? (
        <div>
          <div>
            {externalData.user} has canceled the NFT Reserve on {externalData.nft.name}. Your offer was
            canceled with it and collateral returned.
          </div>
          <b
            style={{ color: "rgba(233, 255, 38, 1)" }}
            onClick={() =>
              goToNFTDetail()
            }
          >
            Go to Manage Futures
          </b>
        </div>
      ) : type === 244 ? (
        <div>
          <div>
            You have successfully accepted Blocking offer of {externalData.user} for your NFT{" "}
            {externalData.nft.name}.
          </div>
          <b
            style={{ color: "rgba(233, 255, 38, 1)" }}
            onClick={() =>
              goToNFTDetail()
            }
          >
            Go to your NFT Reserve
          </b>
        </div>
      ) : type === 245 ? (
        <div>
          <div>
            {externalData.user} just accepted your NFT {externalData.price} USDT Blocking offer for{" "}
            {externalData.nft.name}
          </div>
          <b
            style={{ color: "rgba(233, 255, 38, 1)" }}
            onClick={() =>
              goToNFTDetail()
            }
          >
            Go to your management
          </b>
        </div>
      ) : type === 246 || type === 254 ? (
        <div>
          <div>
            {externalData.user} has placed new offer on your {externalData.nft.name}. Click below to see more
            details.
          </div>
          <b
            style={{ color: "rgba(233, 255, 38, 1)" }}
            onClick={() =>
              goToNFTDetail()
            }
          >
            Go to your NFT Reserve
          </b>
        </div>
      ) : type === 247 ? (
        <div>
          <div>
            {externalData.user} just bought your NFT Reserve your {externalData.nft.name}. Click below to see
            more details.
          </div>
          <b
            style={{ color: "rgba(233, 255, 38, 1)" }}
            onClick={() =>
              goToNFTDetail()
            }
          >
            Go to your NFT Reserve
          </b>
        </div>
      ) : type === 248 ? (
        <div>
          <div>
            Your blocked NFT {externalData.nft.name} was fully paid by {externalData.user}
          </div>
          <b
            style={{ color: "rgba(233, 255, 38, 1)" }}
            onClick={() =>
              goToNFTDetail()
            }
          >
            Go to your management
          </b>
        </div>
      ) : type === 249 ? (
        <div>
          <div>Congrats! {externalData.nft.name} you blocked is now fully paid and available to claim.</div>
          <b
            style={{ color: "rgba(233, 255, 38, 1)" }}
            onClick={() =>
              goToNFTDetail()
            }
          >
            Go to NFT
          </b>
        </div>
      ) : type === 250 ? (
        <div>
          <div>Your blocked NFT {externalData.nft.name} is about to expire today.</div>
          <b
            style={{ color: "rgba(233, 255, 38, 1)" }}
            onClick={() =>
              goToNFTDetail()
            }
          >
            Go to your NFT Reserve
          </b>
        </div>
      ) : type === 251 ? (
        <div>
          <div>
            The NFT {externalData.nft.name} you blocked is about to expire today. Make sure to pay for it or
            it’ll be returned to the owner.
          </div>
          <b
            style={{ color: "rgba(233, 255, 38, 1)" }}
            onClick={() =>
              goToNFTDetail()
            }
          >
            Go to your management
          </b>
        </div>
      ) : type === 252 ? (
        <div>
          <div>
            Your blocked NFT {externalData.nft.name} succesfully claimed by {externalData.user} and
            transferred to the new owner.
          </div>
          <b
            style={{ color: "rgba(233, 255, 38, 1)" }}
            onClick={() =>
              goToNFTDetail()
            }
          >
            Go to your NFT Reserve
          </b>
        </div>
      ) : type === 253 ? (
        <div>
          <div>
            Your have succesfully claimed {externalData.nft.name} NFT and you are now the owner. Congrats!
          </div>
          <b
            style={{ color: "rgba(233, 255, 38, 1)" }}
            onClick={() =>
              goToNFTDetail()
            }
          >
            Go to your management
          </b>
        </div>
      ) : type === 255 ? (
        <div>
          <div>
            {externalData.user} has accepted your offer on {externalData.nft.name}. Go to your NFT to see your
            purchase
          </div>
          <b
            style={{ color: "rgba(233, 255, 38, 1)" }}
            onClick={() =>
              goToNFTDetail()
            }
          >
            Go to NFT management
          </b>
        </div>
      ) : null}
    </>
  );
};
