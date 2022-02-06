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
import { realmRestrictedModalStyles } from "./index.styles";
import { onUploadNonEncrypt } from "shared/ipfs/upload";
import useIPFS from "shared/utils-IPFS/useIPFS";
import { BlockchainNets } from "shared/constants/constants";
import { switchNetwork } from "shared/functions/metamask";

const RealmRestrictedModal = ({
  open,
  realmId,
  metaData,
  loadRealm,
  onClose,
}: {
  open: boolean;
  realmId: string;
  metaData: any;
  loadRealm: () => void;
  onClose: () => void;
}) => {
  const theme = useTheme();
  const history = useHistory();
  const { isSignedin } = useAuth();
  const { ipfs, setMultiAddr, uploadWithNonEncryption } = useIPFS();
  const { chainId, account, library } = useWeb3React();
  const { showAlertMessage } = useAlertMessage();
  const classes = realmRestrictedModalStyles();
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
        <Box className={classes.title}>access restricted to selected collection owners</Box>
        <Box className={classes.desc}>
          Application requires small deposit of 10 Matic to cover the transaction cost and taxation fees. Remaining funds will be returned to your wallet after the voting period is finished.
        </Box>
        <Box className={classes.infos}>
          <Box className={classes.infoRow}>
            <Box className={classes.infoTitle}>Collection address</Box>
              <Box className={classes.address}>
                <ListIcon />
                <Box className={classes.addressVal} >0x73d10536915d5837135d884490eab6070b065870</Box>
            </Box>
          </Box>
          <Box className={classes.infoRow2}>
            ID from 
            <div className={classes.yellowText}>01</div> 
            to 
            <div className={classes.yellowText}>120</div>
          </Box>
        </Box>
        <Box className={classes.infos}>
          <Box className={classes.infoRow}>
            <Box className={classes.infoTitle}>Collection address</Box>
              <Box className={classes.address}>
                <ListIcon />
                <Box className={classes.addressVal} >0x73d10536915d5837135d884490eab6070b065870</Box>
            </Box>
          </Box>
          <Box className={classes.infoRow2}>
            ID from 
            <div className={classes.yellowText}>01</div> 
            to 
            <div className={classes.yellowText}>120</div>
          </Box>
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

const ListIcon = () => (
  <svg width="17" height="15" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M13.3978 3.54314C13.3481 3.59705 13.2879 3.64037 13.221 3.67048C13.1541 3.70058 13.0818 3.71687 13.0084 3.71838H0.772947C0.721106 3.71765 0.670726 3.70198 0.627646 3.67325C0.584567 3.64453 0.550688 3.60396 0.530097 3.55646C0.509506 3.50894 0.503081 3.4565 0.511697 3.40543C0.520166 3.35436 0.543239 3.30685 0.57814 3.2686L3.17171 0.388853C3.22149 0.334938 3.28163 0.291626 3.34855 0.261514C3.41547 0.231402 3.48777 0.215119 3.56113 0.213615H15.8044C15.8562 0.214345 15.9067 0.230014 15.9497 0.258739C15.9928 0.287463 16.0267 0.328032 16.0472 0.375535C16.0678 0.423054 16.0742 0.475493 16.0657 0.526561C16.0571 0.577628 16.034 0.625148 15.9991 0.663393L13.3978 3.54314ZM0.566459 5.93028C0.531557 5.89203 0.508484 5.84451 0.500014 5.79345C0.491398 5.74238 0.497824 5.68994 0.518414 5.64242C0.539004 5.5949 0.572884 5.55435 0.615963 5.52562C0.659042 5.4969 0.709424 5.48123 0.761265 5.4805L13.0006 5.47076C13.074 5.47226 13.1463 5.48855 13.2132 5.51866C13.2801 5.54877 13.3403 5.59208 13.39 5.646L16.003 8.516C16.0379 8.55425 16.061 8.60177 16.0696 8.65284C16.0781 8.7039 16.0717 8.75634 16.0511 8.80386C16.0306 8.85138 15.9967 8.89193 15.9536 8.92066C15.9106 8.94938 15.8601 8.96505 15.8083 8.96578L3.56892 8.97552C3.49555 8.97402 3.42325 8.95774 3.35634 8.92762C3.28943 8.89751 3.22927 8.8542 3.17949 8.80028L0.566459 5.93028ZM13.3978 14.0574C13.3481 14.1113 13.2879 14.1546 13.221 14.1848C13.1541 14.2149 13.0818 14.2312 13.0084 14.2327L0.765061 14.2229C0.713366 14.2222 0.66284 14.2065 0.619761 14.1778C0.576681 14.1491 0.542802 14.1085 0.522357 14.061C0.501766 14.0135 0.495341 13.961 0.503811 13.91C0.512427 13.8589 0.5355 13.8114 0.570401 13.7732L3.17171 10.9031C3.22149 10.8492 3.28163 10.8059 3.34855 10.7758C3.41547 10.7457 3.48777 10.7294 3.56113 10.7279H15.8044C15.8562 10.7286 15.9067 10.7443 15.9497 10.773C15.9928 10.8018 16.0267 10.8423 16.0472 10.8898C16.0678 10.9373 16.0742 10.9898 16.0657 11.0408C16.0571 11.0919 16.034 11.1394 15.9991 11.1777L13.3978 14.0574Z" fill="#E9FF26"/>
  </svg>
);

export default RealmRestrictedModal;
