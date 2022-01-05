import React from "react";
import QRCode from "qrcode.react";
import {
  TwitterShareButton,
  FacebookShareButton,
  RedditShareButton,
  WhatsappShareButton,
  TelegramShareButton,
  FacebookMessengerShareButton,
  InstapaperShareButton,
  LinkedinShareButton,
} from "react-share";
import { CopyToClipboard } from "react-copy-to-clipboard";

import { Grid } from "@material-ui/core";

import { shareMediaToSocialModalStyles } from "./ShareMediaModal.styles";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { Modal, PrimaryButton } from "shared/ui-kit";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import Box from "shared/ui-kit/Box";

const copyIcon = require("assets/icons/copy.png");
import { ReactComponent as YoutubeIcon } from "assets/snsIcons/youtube.svg";
import { ReactComponent as TwitterIcon } from "assets/snsIcons/twitter.svg";
import { ReactComponent as InstagramIcon } from "assets/snsIcons/instagram.svg";
import { ReactComponent as LinkedInIcon } from "assets/snsIcons/linkedin.svg";
import { ReactComponent as TiktokIcon } from "assets/snsIcons/tiktok.svg";
import { ReactComponent as MediaIcon } from "assets/snsIcons/media.svg";
import { ReactComponent as FacebookIcon } from "assets/snsIcons/facebook.svg";
import { ReactComponent as TelegramIcon } from "assets/snsIcons/telegram.svg";

type SocialMediaButtonProps = {
  color: string;
  name: string;
  icon: React.ReactElement;
  shareProps: any;
  shareMedia?: () => void;
};

const SocialMediaButton: React.FC<SocialMediaButtonProps> = ({
  color,
  name,
  icon,
  shareProps,
  shareMedia,
}) => {
  const classes = shareMediaToSocialModalStyles();
  let tagName: any = "div";
  switch (name) {
    case "Twitter":
      tagName = TwitterShareButton;
      break;
    case "Facebook":
      tagName = FacebookShareButton;
      break;
    case "Reddit":
      tagName = RedditShareButton;
      break;
    case "WhatsApp":
      tagName = WhatsappShareButton;
      break;
    case "Discord":
      break;
    case "WeChat":
      break;
    case "Telegram":
      tagName = TelegramShareButton;
      break;
    case "Messenger":
      tagName = FacebookMessengerShareButton;
      break;
    case "Instagram":
      break;
    case "Linkedin":
      tagName = LinkedinShareButton;
      break;
  }

  const element = React.createElement(
    tagName,
    {
      className: classes.bubble,
      style: { background: color },
      ...shareProps,
    },
    icon
  );

  return (
    <div className={classes.socialMedia} onClick={() => shareMedia && shareMedia()}>
      {element}
    </div>
  );
};

type ShareMediaToSocialModalProps = {
  open: boolean;
  shareLink: string;
  shareType: string;
  handleClose: () => void;
  shareMedia?: () => void;
};

export const ShareMediaModal: React.FC<ShareMediaToSocialModalProps> = ({
  open,
  shareLink,
  shareType,
  handleClose,
  shareMedia,
}) => {
  const classes = shareMediaToSocialModalStyles();
  const { showAlertMessage } = useAlertMessage();

  const [renderAs, setRenderAs] = React.useState<string>("svg");

  const downloadQRCode = isSVG => {
    if (isSVG) {
      setRenderAs("svg");
    } else {
      setRenderAs("canvas");
    }

    setTimeout(() => {
      processDownload(isSVG);
    }, 500);
  };

  const processDownload = isSVG => {
    let downloadLink = document.createElement("a");

    if (isSVG) {
      const svg = document.getElementById("qrCode");

      if (svg) {
        //get svg source.
        let serializer = new XMLSerializer();
        let source = serializer.serializeToString(svg!);
        //add name spaces.
        if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
          source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
        }
        if (!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
          source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
        }

        //add xml declaration
        source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
        //convert svg source to URI data scheme.
        let url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);
        //set url value to a element's href attribute.
        downloadLink.href = url;
        downloadLink.download = `share-qrcode.svg`;
      }
    } else {
      const qrCode = document.getElementById("qrCode") as HTMLCanvasElement;
      if (qrCode) {
        const pngUrl = qrCode!.toDataURL("image/png").replace("image/png", "image/octet-stream");
        downloadLink.href = pngUrl;
        downloadLink.download = `share-qrcode.png`;
      }
    }

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <Modal size="medium" isOpen={open} onClose={handleClose} className={classes.root} showCloseIcon>
      <div className={classes.modalContent}>
        <h3 className={classes.shareSocialMedia}>Share on</h3>
        <Box className={classes.socialBox}>
          <Box>
            <SocialMediaButton
              color={"#E9FF26"}
              name={"Linkedin"}
              icon={<LinkedInIcon />}
              shareProps={{
                title: `Check out this ${shareType} at`,
                url: shareLink,
              }}
              shareMedia={shareMedia}
            />
            <SocialMediaButton
              color={"#E9FF26"}
              name={"Facebook"}
              icon={<FacebookIcon />}
              shareProps={{
                quote: `Check out this ${shareType} at`,
                url: shareLink,
                hashTag: "PRIVI",
              }}
              shareMedia={shareMedia}
            />
            <SocialMediaButton
              color={"#E9FF26"}
              name={"Twitter"}
              icon={<TwitterIcon />}
              shareProps={{
                title: `Check out this ${shareType} at`,
                url: shareLink,
                hashtags: ["PRIVI"],
              }}
              shareMedia={shareMedia}
            />
            <SocialMediaButton
              color={"#E9FF26"}
              name={"Telegram"}
              icon={<TelegramIcon />}
              shareProps={{
                title: `Check out this ${shareType} at`,
                url: shareLink,
              }}
              shareMedia={shareMedia}
            />
          </Box>
          {/* <Box>
            <SocialMediaButton
              color={"#E9FF26"}
              name={"Tiktok"}
              icon={<TiktokIcon />}
              shareProps={{ redirectUri: shareLink, appId: "" }}
              shareMedia={shareMedia}
            />
            <SocialMediaButton
              color={"#E9FF26"}
              name={"Media"}
              icon={<MediaIcon />}
              shareProps={{ redirectUri: shareLink, appId: "" }}
              shareMedia={shareMedia}
            />
            <SocialMediaButton
              color={"#E9FF26"}
              name={"Instagram"}
              icon={<InstagramIcon />}
              shareProps={{
                title: `Check out this ${shareType} at`,
                url: shareLink,
              }}
              shareMedia={shareMedia}
            />
          </Box> */}
        </Box>
        <Box className={classes.qrBox}>
          <QRCode id="qrCode" value={shareLink} size={170} level={"H"} includeMargin renderAs={renderAs} />
          <Box display="flex" flexDirection="column">
            <Box fontSize={16} fontWeight={600} mb={2.5}>
              QR Code sharing
            </Box>
            <PrimaryButton size="medium" onClick={() => downloadQRCode(false)}>
              Download PNG
            </PrimaryButton>
            <PrimaryButton size="medium" onClick={() => downloadQRCode(true)}>
              Download SVG
            </PrimaryButton>
          </Box>
        </Box>
        <Box fontSize={16} fontWeight={600} mt={4} mb={1}>
          Sharing Link
        </Box>
        <Box className={classes.link}>
          <InputWithLabelAndTooltip overriedClasses={classes.pageLink} inputValue={shareLink} type="text" />
          <CopyToClipboard
            text={shareLink}
            onCopy={() => {
              showAlertMessage("Copied to clipboard", { variant: "success" });
            }}
          >
            <PrimaryButton size="medium">Copy link</PrimaryButton>
          </CopyToClipboard>
        </Box>
      </div>
    </Modal>
  );
};
