import React from "react";
import { useWeb3React } from "@web3-react/core";
import Web3 from "web3";
import { useHistory } from "react-router-dom";
import ReactPlayer from "react-player";
import axios from "axios";
import customProtocolCheck from "custom-protocol-check";

import { useMediaQuery, useTheme, CircularProgress } from "@material-ui/core";

import { METAVERSE_URL } from "shared/functions/getURL";
import * as MetaverseAPI from "shared/services/API/MetaverseAPI";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { getDefaultAvatar, getDefaultBGImage } from "shared/services/user/getUserAvatar";
import { CircularLoadingIndicator, Modal, PrimaryButton } from "shared/ui-kit";
import MintingNFTProgressModal from "components/PriviMetaverse/modals/MintingNFTProgressModal";
import EditDraftContentModal from "components/PriviMetaverse/modals/EditDraftContentModal";
import Box from "shared/ui-kit/Box";
import Avatar from "shared/ui-kit/Avatar";
import AddressView from "shared/ui-kit/AddressView";
import { ShareIcon } from "shared/ui-kit/Icons";
import { useShareMedia } from "shared/contexts/ShareMediaContext";
import { useAuth } from "shared/contexts/AuthContext";
import { detectMob } from "shared/helpers";
import NotAppModal from "components/PriviMetaverse/modals/NotAppModal";
import OpenDesktopModal from "components/PriviMetaverse/modals/OpenDesktopModal";
import EditRealmModal from "../EditRealmModal";
import EditExtensionModal from "../EditExtensionModal";
import { depositRequiredModalStyles } from "./index.styles";
import { onUploadNonEncrypt } from "shared/ipfs/upload";
import useIPFS from "shared/utils-IPFS/useIPFS";
import { BlockchainNets } from "shared/constants/constants";
import { switchNetwork } from "shared/functions/metamask";

const DepositRequiredModal = ({
  open,
  depositInfo,
  protocolFee,
  onClose,
  onApprove,
  onConfirm,
}: {
  open: boolean;
  depositInfo: any;
  protocolFee: any;
  onClose: (e) => void;
  onApprove: (e) => void;
  onConfirm: (e) => void;
}) => {
  const theme = useTheme();
  const history = useHistory();
  const { isSignedin } = useAuth();
  const { ipfs, setMultiAddr, uploadWithNonEncryption } = useIPFS();
  const { chainId, account, library } = useWeb3React();
  const { showAlertMessage } = useAlertMessage();
  const classes = depositRequiredModalStyles();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  const { shareMedia } = useShareMedia();
  const [nft, setNFT] = React.useState<any>();
  const [metaDataForModal, setMetaDataForModal] = React.useState<any>(null);
  const [openEditRealmModal, setOpenEditRealmModal] = React.useState<boolean>(false);
  const [isLoadingMetaDataForEdit, setIsLoadingMetaDataForEdit] = React.useState<boolean>(false);
  const [isPlaying, setIsPlaying] = React.useState<boolean>(true);
  const [showPlayModal, setShowPlayModal] = React.useState<boolean>(false);
  const [openNotAppModal, setOpenNotAppModal] = React.useState<boolean>(false);
  const [onProgressVideoItem, setOnProgressVideoItem] = React.useState<any>({
    played: 0,
    playedSeconds: 0,
    loaded: 0,
    loadedSeconds: 0,
  });
  const [onDurationVideoItem, setOnDurationVideoItem] = React.useState<number>(1);

  // Transaction Modal
  const [txModalOpen, setTxModalOpen] = React.useState<boolean>(false);
  const [txSuccess, setTxSuccess] = React.useState<boolean | null>(null);
  const [txHash, setTxHash] = React.useState<string>("");

  const [networkName, setNetworkName] = React.useState<string>("");
  const [currentCollection, setCurrentCollection] = React.useState<any>(null);
  const [metadata, setMetadata] = React.useState<any>(null);
  const [chain, setChain] = React.useState<string>(BlockchainNets[0].value);

  const playerVideoItem: any = React.useRef();

  return (
    <>
      <Modal size="small" isOpen={open} onClose={onClose} className={classes.root}>
        <Box className={classes.close} onClick={onClose}>
          <CloseIcon />
        </Box>
        <Box className={classes.title}>DEPOSIT REQUIRED</Box>
        <Box className={classes.desc}>
          Application requires small deposit of 10 Matic to cover the transaction cost and taxation fees. Remaining funds will be returned to your wallet after the voting period is finished.
        </Box>
        <Box className={classes.maticVal}>
          <MaticIcon />
          <Box className={classes.maticTitle}>{depositInfo.amount} MATIC</Box>
        </Box>
        <Box className={classes.infos}>
          <Box className={classes.infoRow}>
            <Box className={classes.infoTitle}>Protocol fee</Box>
            <Box className={classes.infoPercent}>2,5%</Box>
            <Box className={classes.infoPercent}>2,5 Matic </Box>
          </Box>
          <Box className={classes.infoRow}>
            <Box className={classes.infoTitle}>Realm Taxation</Box>
            <Box className={classes.infoPercent}>x%</Box>
            <Box className={classes.infoPercent}>x Matic </Box>
          </Box>
        </Box>
        <Box className={classes.infoSum}>
          <Box className={classes.infoTitle}>Protocol fee</Box>
          <Box className={classes.infoPercent}>x Matic </Box>
        </Box>
        <Box className={classes.btnGroup}>
          <PrimaryButton size="medium" className={classes.confirmBtn} isRounded onClick={(e) => onApprove(e)}>
            APPROVE
          </PrimaryButton>
          <PrimaryButton size="medium" className={classes.confirmBtn} isRounded onClick={(e) => onConfirm(e)}>
            CONFIRM
          </PrimaryButton>
        </Box>
      </Modal>
    </>
  );
};

const CloseIcon = () => (
  <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.5414 2.4585L2.45801 20.5418M2.45803 2.4585L20.5414 20.5418" stroke="white" stroke-width="3" stroke-linecap="square"/>
  </svg>
);

const MaticIcon = () => (
  <svg width="42" height="36" viewBox="0 0 42 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M31.4999 11.4824C31.1061 11.2623 30.6625 11.1467 30.2114 11.1467C29.7603 11.1467 29.3168 11.2623 28.923 11.4824L23.0109 14.9114L18.9939 17.1478L13.0821 20.5769C12.6883 20.7968 12.2447 20.9122 11.7936 20.9122C11.3426 20.9122 10.899 20.7968 10.5052 20.5769L5.80577 17.8933C5.42342 17.674 5.10405 17.3599 4.87851 16.9812C4.65296 16.6025 4.52886 16.1721 4.51817 15.7314V10.4387C4.51288 9.99475 4.63031 9.55794 4.85752 9.17647C5.08472 8.79501 5.41287 8.48371 5.80577 8.2769L10.4293 5.66781C10.8231 5.44792 11.2667 5.33248 11.7177 5.33248C12.1688 5.33248 12.6124 5.44792 13.0062 5.66781L17.6297 8.2769C18.0121 8.49616 18.3314 8.8103 18.557 9.18898C18.7825 9.56766 18.9066 9.99809 18.9173 10.4387V13.8678L22.9343 11.5569V8.12781C22.9396 7.68384 22.8221 7.24703 22.5949 6.86557C22.3677 6.4841 22.0396 6.1728 21.6467 5.96599L13.0821 1.04633C12.6883 0.826439 12.2447 0.710999 11.7936 0.710999C11.3426 0.710999 10.899 0.826439 10.5052 1.04633L1.78777 5.96633C1.39493 6.17311 1.06681 6.48436 0.839607 6.86576C0.612405 7.24716 0.494942 7.6839 0.500171 8.12781V18.0424C0.49488 18.4863 0.612313 18.9231 0.839518 19.3046C1.06672 19.6861 1.39487 19.9974 1.78777 20.2042L10.5042 25.1242C10.898 25.3441 11.3416 25.4595 11.7926 25.4595C12.2437 25.4595 12.6872 25.3441 13.0811 25.1242L18.9929 21.7696L23.0098 19.4587L28.922 16.1042C29.3158 15.8841 29.7593 15.7685 30.2104 15.7685C30.6615 15.7685 31.1051 15.8841 31.4989 16.1042L36.1224 18.7133C36.5047 18.9326 36.8241 19.2467 37.0496 19.6254C37.2752 20.004 37.3993 20.4345 37.41 20.8751V26.1678C37.4153 26.6118 37.2979 27.0486 37.0707 27.4301C36.8434 27.8115 36.5153 28.1228 36.1224 28.3296L31.4989 31.0133C31.1051 31.2332 30.6615 31.3486 30.2104 31.3486C29.7594 31.3486 29.3158 31.2332 28.922 31.0133L24.2985 28.4042C23.9161 28.1849 23.5968 27.8708 23.3712 27.4921C23.1457 27.1134 23.0216 26.683 23.0109 26.2424V22.8129L18.9939 25.1238V28.5529C18.9886 28.9969 19.106 29.4337 19.3332 29.8152C19.5604 30.1966 19.8886 30.5079 20.2815 30.7147L28.9979 35.6347C29.3917 35.8546 29.8353 35.9701 30.2863 35.9701C30.7374 35.9701 31.181 35.8546 31.5748 35.6347L40.2912 30.7147C40.6735 30.4955 40.9929 30.1813 41.2184 29.8026C41.4439 29.424 41.5681 28.9936 41.5788 28.5529V18.6387C41.5841 18.1947 41.4666 17.7579 41.2394 17.3765C41.0122 16.995 40.6841 16.6837 40.2912 16.4769L31.4999 11.4824Z" fill="#8247E5"/>
  </svg>

);

export default DepositRequiredModal;
