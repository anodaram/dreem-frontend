import React from "react";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { Notification } from "shared/services/API/NotificationsAPI";
import { setSelectedUser } from "store/actions/SelectedUser";
import { makeStyles } from "@material-ui/core/styles";

type NotificationContentProps = {
  notification: Notification;
};

// TODO: Please refactor me to something shorter and configurable :""""(
export const NotificationContent: React.FunctionComponent<NotificationContentProps> = ({ notification }) => {
  const { type, itemId, follower, externalData } = notification;

  const history = useHistory();
  const location = useLocation();

  const dispatch = useDispatch();

  const useClasses = makeStyles(theme => ({
    username: {
      color: "#EDFF1C"
    },
    nftName: {
      background: "linear-gradient(#EDFF1C, #ED7B7B)",
      "-webkit-text-fill-color": "transparent",
      "-webkit-background-clip": "text",
    }
  }));

  const classes = useClasses();

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
    history.push(`/gameNFTS/${externalData.nft.collection}/${externalData.nft.id}`)
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
            <span className={classes.username}>{externalData.user}</span> placed a new offer on <span className={classes.nftName}>{externalData.nft.name}</span> to Rent it for{" "}
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
            <span className={classes.username}>{externalData.user}</span> rented your <span className={classes.nftName}>{externalData.nft.name}</span> at instant price of {externalData.price}{" "}
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
            You have accepted <span className={classes.username}>{externalData.user}</span> rent offer for {externalData.price} USDT/sec for{" "}
            {Number(externalData.duration).toFixed(2)} Days on your NFT <span className={classes.nftName}>{externalData.nft.name}</span>
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
          Congratulations! You are doing some sweet blocking business. You have successfully claimed payment.
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
          <div>
            <span className={classes.username}>{externalData.user}</span> has claimed your payment of <span className={classes.nftName}>{externalData.nft.name}</span> for {externalData.price}
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
      ) : type === 241 ? (
        <div>
          <div>
            Time is up on the <span className={classes.nftName}>{externalData.nft.name}</span> block. Head to Game NFTs to find more stuff to block!
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
            The NFT <span className={classes.nftName}>{externalData.nft.name}</span> wasn’t fully paid before expiration and is now returned to the
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
            Look at you taking care of your NFTs: <span className={classes.nftName}>{externalData.nft.name}</span> is back in your possession
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
            You have successfully blocked <span className={classes.nftName}>{externalData.nft.name}</span>
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
            <span className={classes.username}>{externalData.user}</span> just accepted your blocking offer of <span className={classes.nftName}>{externalData.nft.name}</span> for {externalData.price} USDT
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
            <span className={classes.username}>{externalData.user}</span> has placed new offer on your <span className={classes.nftName}>{externalData.nft.name}</span>. Click below to see more
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
            <span className={classes.username}>{externalData.user}</span> just bought your NFT Reserve your <span className={classes.nftName}>{externalData.nft.name}</span>. Click below to see
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
            Your blocked NFT <span className={classes.nftName}>{externalData.nft.name}</span> was fully paid by <span className={classes.username}>{externalData.user}</span>
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
          You have successfully paid for the blocked <span className={classes.nftName}>{externalData.nft.name}</span>
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
          <div>Your blocked NFT <span className={classes.nftName}>{externalData.nft.name}</span> is about to expire today.</div>
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
            The NFT <span className={classes.nftName}>{externalData.nft.name}</span> you blocked is about to expire today. Make sure to pay for it or
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
            Your <span className={classes.nftName}>{externalData.nft.name}</span> was claimed and paid for by <span className={classes.username}>{externalData.user}</span>, head to Game NFTs to explore more
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
            Congratulations! You are now the owner of <span className={classes.nftName}>{externalData.nft.name}</span>, it is unblocked and fully paid
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
            You have succesfully blocked <span className={classes.nftName}>{externalData.nft.name}</span>, head to Manage Your NFTs to peep it.
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
      ) : type === 261 ? (
        <div>
          <div>
            You have successfully accepted the blocking offer of <span className={classes.nftName}>{externalData.nft.name}</span> from <span className={classes.username}>{externalData.user}</span> 
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
      ) : type === 263 ? (
        <div>
          <div>
            <span className={classes.username}>{externalData.user}</span> has taken back control of the <span className={classes.nftName}>{externalData.nft.name}</span> bc you have not paid the blocking price 
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
      ) : type === 264 ? (
        <div>
          <div>
            The collateral on your <span className={classes.nftName}>{externalData.nft.name}</span> block was transferred to you, the buyer got liquidated 
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
      ) : type === 265 ? (
        <div>
          <div>
            … you just got liquidated because you were under collateralized.
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
      ) : type === 266 ? (
        <div>
          <div>
            <span className={classes.username}>{externalData.user}</span> has cancelled the block of <span className={classes.nftName}>{externalData.nft.name}</span>, head to Manage Your NFTs to find yourself a new blocker
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
      ) : type === 267 ? (
        <div>
          <div>
            <span className={classes.username}>{externalData.user}</span> has canceled the block on <span className={classes.nftName}>{externalData.nft.name}</span>, your offer was cancelled and your collateral returned
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
      ) : null}
    </>
  );
};
