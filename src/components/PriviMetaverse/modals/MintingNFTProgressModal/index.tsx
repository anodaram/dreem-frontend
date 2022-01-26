import React from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

import Box from "shared/ui-kit/Box";
import { Modal, PrimaryButton } from "shared/ui-kit";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { getDefaultBGImage } from "shared/services/user/getUserAvatar";
import {
  // handleDiscordLink,
  handleTelegramLink,
  // handleYoutubeLink,
  handleTwitterLink,
  // handleInstagramLink,
  // handleGitbookLink,
  handleWhatsappLink,
} from "shared/constants/constants";
import { useModalStyles } from "./index.styles";

import { ReactComponent as TelegramIcon } from "assets/snsIcons/telegram.svg";
import { ReactComponent as TwitterIcon } from "assets/snsIcons/twitter.svg";
import { ReactComponent as WhatsappIcon } from "assets/snsIcons/whatsapp.svg";
// import { ReactComponent as DiscordIcon } from "assets/snsIcons/discord.svg";
// import { ReactComponent as InstagramIcon } from "assets/snsIcons/instagram.svg";
// import { ReactComponent as YoutubeIcon } from "assets/snsIcons/youtube.svg";
// import { ReactComponent as GitbookIcon } from "assets/snsIcons/gitbook.svg";

require("dotenv").config();
const isProd = process.env.REACT_APP_ENV === "prod";

export default function MintingNFTProgressModal({
  open,
  onClose,
  txSuccess,
  hash,
  network,
  nftImage,
}: {
  open: boolean;
  onClose: () => void;
  txSuccess: boolean | null;
  hash: string;
  network?: string;
  nftImage: string;
}) {
  const classes = useModalStyles();
  const { showAlertMessage } = useAlertMessage();
  const isEth = (network || "").toLowerCase().includes("ethereum");
  const isBsc = (network || "").toLowerCase().includes("binance");
  const isPolygon = (network || "").toLowerCase().includes("polygon");

  const handleOpenTx = () => {
    if (network) {
      if (isPolygon) {
        window.open(`https://${!isProd ? "mumbai." : ""}polygonscan.com/tx/${hash}`, "_blank");
      } else if (isEth) {
        window.open(`https://${!isProd ? "rinkeby." : ""}etherscan.io/tx/${hash}`, "_blank");
      } else if (isBsc) {
        window.open(`https://${!isProd ? "testnet." : ""}bscscan.com/tx/${hash}`, "_blank");
      }
    } else {
      window.open(`https://${!isProd ? "mumbai." : ""}polygonscan.com/tx/${hash}`, "_blank");
    }
  };

  return (
    <Modal showCloseIcon isOpen={open} onClose={onClose} className={classes.root} size="small">
      {txSuccess === true ? (
        <img src={nftImage || getDefaultBGImage()} className={classes.nftImage} />
      ) : txSuccess === false ? (
        <img src={require("assets/metaverseImages/result_fail.png")} width="135px" height="135px" />
      ) : (
        <div style={{ position: "relative" }}>
          <img className={classes.loader} src={require("assets/metaverseImages/loading.png")} />
          <div className={classes.ethImg}>
            <img
              src={require(`assets/metaverseImages/${
                isPolygon ? "polygon" : isBsc ? "bsc" : "ethereum"
              }.png`)}
            />
          </div>
        </div>
      )}
      <Box className={classes.title} mt={4}>
        {txSuccess === true
          ? "Awesome! New NFT created."
          : txSuccess === false
          ? "Transaction failed"
          : "Minting your NFT"}
      </Box>
      <Box className={classes.header1} mt={2} mb={2}>
        {txSuccess === true ? (
          <>
            Cool! Everything wen’t well and you can enjoy your creation, <br />
            share it and let it out in the world!
          </>
        ) : txSuccess === false ? (
          <>
            Unfortunately the transaction failed to go through on the blockchain, please try again later.
            <br />
            You can check your transaction link for more details.
          </>
        ) : (
          <>
            Transaction is proceeding on {network && isEth ? "Ethereum" : isBsc ? "BSC" : "Polygon"} Chain.{" "}
            <br />
            This can take a moment, please be patient...
          </>
        )}
      </Box>
      {hash && (
        <>
          <CopyToClipboard
            text={hash}
            onCopy={() => {
              showAlertMessage("Copied to clipboard", { variant: "success" });
            }}
          >
            <Box display="flex" alignItems="center" justifyContent="center" style={{ cursor: "pointer" }}>
              <Box className={classes.header1} mr={2}>
                Hash:
              </Box>
              <Box className={classes.header2} ml={1} mr={1}>
                {hash.substr(0, 18) + "..." + hash.substr(hash.length - 3, 3)}
              </Box>
              <CopyIcon />
            </Box>
          </CopyToClipboard>
          {!(txSuccess === true || txSuccess === false) && (
            <PrimaryButton
              size="medium"
              style={{
                background: "transparent",
                marginTop: "24px",
                color: "#ffffff",
                textTransform: "uppercase",
                padding: "4px 24px",
                height: 48,
                border: "2px solid #858a8d",
              }}
              isRounded
              onClick={handleOpenTx}
            >
              Check on {network && isEth ? "Ethereum" : isBsc ? "BSC" : "Polygon"} Scan
            </PrimaryButton>
          )}
        </>
      )}
      {txSuccess === false && (
        <PrimaryButton
          size="medium"
          style={{
            background: "linear-gradient(92.31deg, #EEFF21 -2.9%, #B7FF5C 113.47%)",
            color: "#212121",
            height: 48,
            minWidth: 249,
            borderRadius: "100px",
            marginTop: 16,
            textTransform: "uppercase",
            fontSize: 18,
            paddingTop: 5,
          }}
          onClick={() => {}}
        >
          Back To Home
        </PrimaryButton>
      )}
      {txSuccess === true && (
        <Box className={classes.shareSection}>
          <Box className={classes.header3}>Share on</Box>
          <Box className={classes.snsIconList}>
            <Box className={classes.snsBox} onClick={handleTelegramLink}>
              <TelegramIcon />
            </Box>
            <Box className={classes.snsBox} onClick={handleTwitterLink}>
              <TwitterIcon />
            </Box>
            <Box className={classes.snsBox} onClick={handleWhatsappLink}>
              <WhatsappIcon />
            </Box>
            {/* <Box className={classes.snsBox} onClick={handleYoutubeLink}>
              <YoutubeIcon width="26px" />
            </Box>
            <Box className={classes.snsBox} onClick={handleDiscordLink}>
              <DiscordIcon />
            </Box>
            <Box className={classes.snsBox} onClick={handleInstagramLink}>
              <InstagramIcon />
            </Box>
            <Box className={classes.snsBox} onClick={handleGitbookLink}>
              <GitbookIcon />
            </Box> */}
          </Box>
        </Box>
      )}
    </Modal>
  );
}

const CopyIcon = () => (
  <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M13.5833 10.0833H14.8333C15.7538 10.0833 16.5 9.37445 16.5 8.5V2.95833C16.5 2.08388 15.7538 1.375 14.8333 1.375H9C8.07953 1.375 7.33333 2.08388 7.33333 2.95833V4.14583M3.16667 15.625H9C9.92047 15.625 10.6667 14.9161 10.6667 14.0417V8.5C10.6667 7.62555 9.92047 6.91667 9 6.91667H3.16667C2.24619 6.91667 1.5 7.62555 1.5 8.5V14.0417C1.5 14.9161 2.24619 15.625 3.16667 15.625Z"
      stroke="#E9FF26"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);
