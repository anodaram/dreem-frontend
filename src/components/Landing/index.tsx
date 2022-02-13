import React, { useEffect, useState } from "react";
import axios from "axios";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import Web3 from "web3";
import { useDispatch, useSelector } from "react-redux";
import customProtocolCheck from "custom-protocol-check";

import MetaMaskIcon from "assets/walletImages/metamask1.svg";
import PlayIcon from "assets/icons/play-black.png";

import Box from "shared/ui-kit/Box";
import { CircularLoadingIndicator, PrimaryButton } from "shared/ui-kit";
import { METAVERSE_URL } from "shared/functions/getURL";
import { injected } from "shared/connectors";
import * as API from "shared/services/API/WalletAuthAPI";
import { useAuth } from "shared/contexts/AuthContext";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { detectMob } from "shared/helpers";

import { setUser } from "store/actions/User";
import { setLoginBool } from "store/actions/LoginBool";
import { RootState } from "../../store/reducers/Reducer";
import NoMetamaskModal from "components/Connect/modals/NoMetamaskModal";
import NotAppModal from "components/PriviMetaverse/modals/NotAppModal";
import OpenDesktopModal from "components/PriviMetaverse/modals/OpenDesktopModal";

import { useLandingStyles } from "./index.styles";

const LandingPage = () => {
  const classes = useLandingStyles();
  const dispatch = useDispatch();
  const underMaintenanceSelector = useSelector((state: RootState) => state.underMaintenanceInfo?.info);
  const publicy = useSelector((state: RootState) => state.underMaintenanceInfo?.publicy);

  const { activate, account, library } = useWeb3React();
  const { isSignedin, setSignedin, isOnSigning, setOnSigning } = useAuth();
  const { showAlertMessage } = useAlertMessage();

  const [playing, setPlaying] = React.useState<boolean>(false);
  const [noMetamask, setNoMetamask] = React.useState<boolean>(false);
  const [isAuthorized, setIsAuthorized] = React.useState<boolean>(false);
  const [notInstalled, setNotInstalled] = React.useState<boolean>(false);
  const [hasUnderMaintenanceInfo, setHasUnderMaintenanceInfo] = useState(false);
  const [isDownload, setIsDownload] = useState<boolean>(false);
  const [openNotAppModal, setOpenNotAppModal] = useState<boolean>(false);
  const [showPlayModal, setShowPlayModal] = useState<boolean>(false);

  useEffect(() => {
    if (underMaintenanceSelector && Object.keys(underMaintenanceSelector).length > 0) {
      setHasUnderMaintenanceInfo(true);
    }
  }, [underMaintenanceSelector]);

  React.useEffect(() => {
    if (hasUnderMaintenanceInfo && !isSignedin && !underMaintenanceSelector.underMaintenance) {
      signInWithMetamask();
    }
  }, [account, isSignedin]);

  const signInWithMetamask = () => {
    if (!account) return;

    const web3 = new Web3(library.provider);
    setOnSigning(true);
    API.signInWithMetamaskWallet(account, web3, "Dreem")
      .then(res => {
        if (res.isSignedIn) {
          setSignedin(true);
          // setIsAuthorized(true);
          const data = res.data.user;
          dispatch(
            setUser({
              ...data,
              id: data.priviId,
              infoImage: {
                ...data.infoImage,
                avatarUrl: res.data.user.avatarUrl,
              },
              urlSlug: data.name,
              name: `${data.firstName} ${data.lastName}`,
            })
          );
          localStorage.setItem("token", res.accessToken);
          localStorage.setItem("address", account);
          localStorage.setItem("userId", data.priviId);
          localStorage.setItem("userSlug", data.urlSlug ?? data.priviId);

          axios.defaults.headers.common["Authorization"] = "Bearer " + res.accessToken;
          dispatch(setLoginBool(true));
          setOnSigning(false);
        } else {
          if (res.message) {
            if (res.message === "Wallet address doesn't exist" && publicy) {
              signUp(res.signature);
            } else {
              showAlertMessage(res.message, { variant: "error" });
              setOnSigning(false);
            }
          } else {
            showAlertMessage("Connect the metamask", { variant: "error" });
            setOnSigning(false);
          }
        }
      })
      .catch(e => {
        setOnSigning(false);
      });
  };

  const signUp = async signature => {
    if (account) {
      const res = await API.signUpWithAddressAndName(account, account, signature, "Dreem");
      if (res.isSignedIn) {
        setSignedin(true);
        // setIsAuthorized(true);
        const data = res.data.user;
        dispatch(setUser(data));
        localStorage.setItem("token", res.accessToken);
        localStorage.setItem("address", account);
        localStorage.setItem("userId", data.priviId);
        localStorage.setItem("userSlug", data.urlSlug ?? data.priviId);

        axios.defaults.headers.common["Authorization"] = "Bearer " + res.accessToken;
        dispatch(setLoginBool(true));
        setOnSigning(false);
      } else {
        showAlertMessage(res.message, { variant: "error" });
        setOnSigning(false);
      }
    }
  };

  const handleConnect = () => {
    activate(injected, undefined, true)
      .then(res => {
        console.log("connected");
        signInWithMetamask();
      })
      .catch(error => {
        if (error instanceof UnsupportedChainIdError) {
          activate(injected).then(res => {
            signInWithMetamask();
          });
        } else {
          console.info("Connection Error - ", error);
          setNoMetamask(true);
        }
      });
  };

  const handlePlay = () => {
    if (detectMob()) {
      setShowPlayModal(true);
    } else {
      const token = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      axios.post(`${METAVERSE_URL()}/getSessionHash/`, {}, config).then(res => {
        let data: any = res.data?.data?.stamp;
        if (data) {
          customProtocolCheck(
            "dreem://" + data,
            () => {
              setOpenNotAppModal(true);
            },
            () => {
              console.log("successfully opened!");
            },
            3000
          );
        }
      });
    }
  };

  return (
    <Box className={classes.container}>
      <video autoPlay muted loop>
        <source src={require("assets/metaverseImages/play.mp4")} type="video/mp4" />
      </video>
      <Box
        className={classes.main}
        display="flex"
        flexDirection="column"
        alignItems="center"
        position="absolute"
        top={0}
        left={0}
        bottom={0}
        right={0}
      >
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" flex={1}>
          <Box mb={5}>
            <img className={classes.logo} src={require("assets/metaverseImages/dreem.svg")} alt="Dreem" />
          </Box>
          {isSignedin ? (
            <PrimaryButton onClick={handlePlay} size="medium" className={classes.button}>
              <span style={{ paddingTop: 3 }}>PLAY NOW</span>
              {playing ? <CircularLoadingIndicator /> : <img src={PlayIcon} width={16} alt="play" />}
            </PrimaryButton>
          ) : (
            <PrimaryButton
              onClick={handleConnect}
              size="medium"
              className={classes.button}
              disabled={
                isOnSigning ||
                !hasUnderMaintenanceInfo ||
                (underMaintenanceSelector &&
                  Object.keys(underMaintenanceSelector).length > 0 &&
                  underMaintenanceSelector.underMaintenance)
              }
              style={{
                pointerEvents: isOnSigning ? "none" : undefined,
                opacity: isOnSigning ? 0.4 : undefined,
              }}
            >
              <span style={{ paddingTop: 3 }}>LOG IN</span>
              {isOnSigning ? (
                <CircularLoadingIndicator />
              ) : (
                <img src={MetaMaskIcon} alt="metamask" width={36} />
              )}
            </PrimaryButton>
          )}
          {notInstalled && (
            <Box className={classes.alert} mt={2} color="red">
              You do not seem to have the game installed. Please download it before running.
            </Box>
          )}
          {isAuthorized && (
            <Box className={classes.alert} mt={2} color="red">
              Our dreem is growing bigger and bigger, we hope you can dive in soon.
            </Box>
          )}
          {!isSignedin && isDownload && (
            <Box className={classes.alert} mt={2} color="red">
              Sign in required
            </Box>
          )}
        </Box>
        <Box className={classes.text} pb={6.5}>
          Version 1.2.0
        </Box>
      </Box>
      {noMetamask && <NoMetamaskModal open={noMetamask} onClose={() => setNoMetamask(false)} />}

      {openNotAppModal && (
        <NotAppModal
          open={openNotAppModal}
          onClose={() => {
            setOpenNotAppModal(false);
          }}
        />
      )}
      {showPlayModal && (
        <OpenDesktopModal isPlay open={showPlayModal} onClose={() => setShowPlayModal(false)} />
      )}
    </Box>
  );
};

export default LandingPage;

const WindowsIcon = () => (
  <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.73933 11.2832H0V20.0225H8.73933V11.2832Z" fill="white" />
    <path d="M8.73933 0H0V8.73933H8.73933V0Z" fill="white" />
    <path d="M20.0225 11.2832H11.2832V20.0225H20.0225V11.2832Z" fill="white" />
    <path d="M20.0225 0H11.2832V8.73933H20.0225V0Z" fill="white" />
  </svg>
);

const MacIcon = () => (
  <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M14.0026 10.4165C14.0026 8.62366 15.0346 7.07544 16.5348 6.32229C15.1956 5.068 13.4748 5 13.1691 5C12.3564 5 11.7764 5.22013 11.216 5.43293C10.6731 5.63922 10.1604 5.83372 9.41846 5.83372C8.67655 5.83372 8.16377 5.63922 7.62088 5.43293C7.06048 5.22013 6.48055 5 5.66783 5C5.15586 5 0.666992 5.16357 0.666992 10.8336C0.666992 15.4701 3.83118 19.9996 5.66783 19.9996C6.79229 19.9996 7.43896 19.7367 8.00994 19.5048C8.45598 19.3237 8.84178 19.1671 9.41846 19.1671C9.99513 19.1671 10.3809 19.3237 10.827 19.5052C11.398 19.7367 12.0446 19.9996 13.1687 19.9996C14.4554 19.9996 16.2877 17.7738 17.3332 14.8482C15.3596 14.337 14.0026 12.5495 14.0026 10.4165Z"
      fill="white"
    />
    <path
      d="M9.00172 4.99986C11.443 4.49987 13.1929 2.48753 13.1686 0C10.7273 0.499986 8.97736 2.51233 9.00172 4.99986Z"
      fill="white"
    />
    <path
      opacity="0.1"
      d="M5.66783 5.20833C6.48055 5.20833 7.06048 5.42845 7.62088 5.64126C8.16377 5.84755 8.67655 6.04204 9.41846 6.04204C10.1604 6.04204 10.6731 5.84755 11.216 5.64126C11.7764 5.42845 12.3564 5.20833 13.1691 5.20833C13.4638 5.20833 15.0705 5.28238 16.3858 6.41033C16.4364 6.38246 16.483 6.34828 16.5348 6.32229C15.1956 5.068 13.4748 5 13.1691 5C12.3564 5 11.7764 5.22013 11.216 5.43293C10.6731 5.63922 10.1604 5.83372 9.41846 5.83372C8.67655 5.83372 8.16377 5.63922 7.62088 5.43293C7.06048 5.22013 6.48055 5 5.66783 5C5.15586 5 0.666992 5.16357 0.666992 10.8336C0.666992 10.8718 0.671316 10.9098 0.671723 10.948C0.723815 5.37536 5.15886 5.20833 5.66783 5.20833Z"
      fill="white"
    />
    <path
      opacity="0.2"
      d="M13.1687 19.7914C12.0446 19.7914 11.398 19.5285 10.827 19.297C10.3809 19.1155 9.99513 18.9589 9.41846 18.9589C8.84178 18.9589 8.45598 19.1155 8.00994 19.2966C7.43896 19.5285 6.79229 19.7914 5.66783 19.7914C3.84634 19.7914 0.723205 15.3359 0.671723 10.7397C0.671418 10.7727 0.666992 10.8004 0.666992 10.8337C0.666992 15.4702 3.83118 19.9997 5.66783 19.9997C6.79229 19.9997 7.43896 19.7368 8.00994 19.5049C8.45598 19.3238 8.84178 19.1672 9.41846 19.1672C9.99513 19.1672 10.3809 19.3238 10.827 19.5053C11.398 19.7368 12.0446 19.9997 13.1687 19.9997C14.4554 19.9997 16.2877 17.7739 17.3332 14.8484C17.309 14.8421 17.2871 14.8305 17.263 14.8238C16.2035 17.6573 14.428 19.7914 13.1687 19.7914Z"
      fill="white"
    />
    <path
      opacity="0.2"
      d="M13.1493 0.368536C12.9773 2.64442 11.2903 4.31338 9.00423 4.78898C9.00194 4.8611 9.00098 4.92693 9.0017 4.99991C11.3701 4.51485 13.0879 2.60201 13.1662 0.217285C13.1589 0.256248 13.1617 0.321906 13.1493 0.368536Z"
      fill="white"
    />
    <path
      opacity="0.1"
      d="M9.00464 4.77839C9.01433 4.72405 9.02637 4.573 9.03832 4.48164C9.04699 4.36687 9.05946 4.25403 9.07563 4.14318C9.38017 2.05517 10.9951 0.66895 13.1666 0.217228C13.1689 0.145107 13.1697 0.0729858 13.169 0C10.7998 0.485165 9.08191 2.39254 9.00464 4.77839Z"
      fill="white"
    />
  </svg>
);

const LinuxIcon = () => (
  <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2.64903 14.35C2.80792 14.7949 2.59102 15.2945 2.15719 15.4345C1.90772 15.515 1.62944 15.5426 1.36581 15.535C0.882135 15.5211 0.72776 15.6945 0.886041 16.1478C0.940631 16.3043 1.01665 16.4534 1.08661 16.6041C1.22518 16.9027 1.23448 17.1994 1.08333 17.4967C1.03309 17.5954 0.984596 17.6953 0.938756 17.7962C0.748209 18.2159 0.823638 18.3913 1.27303 18.5052C1.6334 18.5965 2.00399 18.6476 2.36454 18.7382C3.15467 18.937 3.94167 19.1484 4.72936 19.3569C5.12249 19.4609 5.51403 19.5498 5.92223 19.4306C6.44977 19.2765 6.7396 18.8934 6.6296 18.3607C6.54446 17.9484 6.42284 17.5183 6.20706 17.1632C5.6811 16.2975 5.09424 15.4685 4.52397 14.6302C4.41331 14.4675 4.2736 14.3225 4.1352 14.1812C3.676 13.7124 3.49399 13.6676 2.88477 13.8675C2.73655 13.5682 2.78325 13.2544 2.83477 12.9481C2.8618 12.7873 2.91858 12.62 3.00504 12.4828C3.37247 11.9003 3.58643 11.2541 3.81503 10.613C4.07958 9.87078 4.41795 9.17799 4.93042 8.55961C5.35243 8.05036 5.68483 7.46622 6.04961 6.9104C6.18004 6.7117 6.18249 6.48979 6.17129 6.25049C6.11317 5.00788 6.04315 3.76414 6.0444 2.52086C6.04598 0.98684 7.32911 -0.206304 9.09993 0.0299262C11.0518 0.290297 12.2172 1.73975 12.1591 3.71637C12.1068 5.49745 12.6939 7.05 13.9116 8.39774C15.1251 9.74084 15.6927 11.3883 15.7951 13.1903C15.8077 13.4141 15.7621 13.6522 15.6903 13.8658C15.6461 13.9975 15.5018 14.0961 15.4011 14.2083C15.2647 14.3602 15.118 14.504 14.9918 14.6639C14.7559 14.9626 14.4953 15.2162 14.1046 15.3001C13.5155 15.4265 13.1246 15.2434 12.8583 14.705C12.8232 14.634 12.7927 14.5598 12.7498 14.4938C12.6516 14.3426 12.5532 14.1232 12.3507 14.1898C12.2193 14.2329 12.074 14.4216 12.0497 14.5647C11.9962 14.8788 11.9384 15.2265 12.0198 15.5227C12.2536 16.3743 12.1999 17.2158 12.0796 18.069C12.0109 18.5553 12.0715 19.0267 12.5313 19.3093C13.0097 19.6031 13.4768 19.4528 13.9145 19.173C13.9876 19.1263 14.0561 19.0705 14.1203 19.0119C14.7101 18.4731 15.396 18.1117 16.1551 17.8695C16.4464 17.7766 16.7335 17.6468 16.9944 17.4876C17.3762 17.2546 17.362 16.9824 16.9777 16.7447C16.8373 16.6579 16.6858 16.5787 16.5288 16.5312C16.0718 16.3931 15.8489 16.0631 15.7521 15.6254C15.6813 15.3051 15.6614 14.9851 15.8461 14.615C15.8791 14.8216 15.9002 14.9661 15.9254 15.1098C16.0278 15.6947 16.3318 16.1268 16.8692 16.3997C17.0424 16.4876 17.2044 16.614 17.3417 16.7523C17.5442 16.9564 17.5449 17.1926 17.3592 17.4147C17.2638 17.5287 17.1506 17.6356 17.0262 17.716C16.7939 17.8661 16.5582 18.0193 16.3051 18.1272C15.4172 18.5056 14.6608 19.0716 13.9469 19.7085C13.562 20.0519 13.0835 20.0182 12.6151 19.9702C12.1951 19.9271 11.8658 19.7325 11.6611 19.3493C11.5438 19.1296 11.3534 18.9967 11.1074 18.9926C10.2678 18.9785 9.42784 18.9773 8.58803 18.9748C8.41381 18.9743 8.23956 18.9936 8.0652 18.9963C7.5759 19.0039 7.12915 19.1415 6.72733 19.4222C6.6104 19.504 6.49163 19.5831 6.37667 19.6676C5.99797 19.9456 5.58311 20.0166 5.13797 19.8726C4.63354 19.7094 4.1404 19.5055 3.62848 19.3728C2.87083 19.1763 2.10003 19.0311 1.33653 18.8566C0.485806 18.6621 0.327974 18.3712 0.677681 17.5813C0.845748 17.2017 0.849791 16.8342 0.747017 16.4469C0.696373 16.256 0.6469 16.0621 0.626627 15.8664C0.591705 15.5294 0.708541 15.379 1.04344 15.3232C1.28499 15.283 1.53307 15.2816 1.77436 15.2401C2.24215 15.1596 2.55782 14.8402 2.64903 14.35ZM12.6377 8.88026C12.8141 9.18459 13.0063 9.48104 13.1638 9.79489C13.5593 10.5831 13.8367 11.4047 13.7546 12.3054C13.7376 12.4923 13.6965 12.683 13.6305 12.8584C13.5311 13.1226 13.2693 13.2443 12.968 13.2002C12.7002 13.161 12.6639 12.9513 12.6441 12.7419C12.6239 12.5293 12.616 12.3149 12.6143 12.1011C12.6082 11.3391 12.4598 10.6033 12.1757 9.89995C12.0739 9.6477 11.8984 9.42534 11.7583 9.18827C11.7038 9.09608 11.6309 9.0068 11.6058 8.90633C11.4336 8.21668 11.1947 7.56129 10.7533 6.98907C10.5355 6.70676 10.4674 6.37516 10.5611 6.02086C10.5934 5.89842 10.6276 5.7762 10.6528 5.65221C10.7139 5.35131 10.6246 5.21041 10.3409 5.10514C10.038 4.9928 9.74667 4.8459 9.43895 4.75088C9.18577 4.67274 9.13106 4.50432 9.14174 4.28315C9.1478 4.15752 9.15922 4.02819 9.19579 3.90895C9.25965 3.70051 9.38251 3.54293 9.62501 3.52346C9.87858 3.50307 10.0737 3.60584 10.1855 3.83864C10.296 4.06911 10.321 4.30457 10.2201 4.55073C10.1295 4.7717 10.217 4.8853 10.4451 4.82223C10.5421 4.79541 10.6731 4.67776 10.6837 4.58889C10.7357 4.15299 10.7187 3.71825 10.4909 3.32081C10.2725 2.93989 9.87665 2.77788 9.45625 2.89717C8.93006 3.04651 8.67739 3.45584 8.72938 4.07502C8.74018 4.20364 8.7512 4.33227 8.75944 4.42932C8.45743 4.40752 8.17917 4.38745 7.89721 4.36713C7.88296 4.19989 7.88274 4.04788 7.85426 3.90139C7.81827 3.71622 7.77733 3.52799 7.70573 3.35465C7.61405 3.13284 7.4576 2.96104 7.19053 2.96247C6.93069 2.96391 6.79831 3.14319 6.6985 3.35102C6.47614 3.81414 6.52034 4.27493 6.73247 4.72631C6.76547 4.79659 6.85159 4.89473 6.90473 4.88977C6.97729 4.88299 7.04176 4.78967 7.12012 4.72487C6.7818 4.53172 6.62848 4.12112 6.79059 3.8117C6.8495 3.69924 7.0027 3.60875 7.13188 3.5676C7.28962 3.51731 7.44206 3.60764 7.4935 3.7651C7.55627 3.95723 7.58452 4.16204 7.61168 4.36356C7.61827 4.41227 7.57436 4.48389 7.53239 4.52041C7.28376 4.73659 7.02796 4.9445 6.7768 5.15782C6.72301 5.2035 6.66874 5.25385 6.6312 5.31252C6.52469 5.47899 6.50458 5.62534 6.70743 5.75416C6.83147 5.83297 6.936 5.94971 7.03196 6.06393C7.18004 6.24006 7.36491 6.34213 7.58901 6.33682C8.49163 6.31553 9.36856 6.20247 10.0939 5.58272C10.132 5.55014 10.2431 5.54698 10.2748 5.57743C10.3118 5.61303 10.3253 5.71381 10.3008 5.76202C10.2732 5.81665 10.197 5.85588 10.1338 5.88192C9.68754 6.06553 9.23799 6.24096 8.79198 6.42504C8.3492 6.60776 7.89598 6.68284 7.42057 6.58969C7.36463 6.57871 7.30471 6.58821 7.21401 6.58821C7.41706 6.87346 7.64161 7.06907 7.97219 7.04858C8.22139 7.03315 8.48245 7.00475 8.71137 6.91422C9.05547 6.77815 9.3744 6.57938 9.70762 6.41446C9.81967 6.35905 9.9401 6.31424 10.0618 6.28801C10.1045 6.27875 10.1785 6.32914 10.2068 6.37266C10.2225 6.39682 10.1854 6.47635 10.1509 6.50748C10.0932 6.55957 10.0182 6.59223 9.95114 6.6342C9.53583 6.89446 9.12065 7.15487 8.70561 7.41549C8.54477 7.51647 8.3912 7.63172 8.22231 7.71643C7.89866 7.87885 7.67239 7.8469 7.43014 7.5794C7.23432 7.36315 7.07419 7.11471 6.89545 6.88274C6.83725 6.80715 6.77026 6.73834 6.70727 6.66645C6.67713 7.18313 6.4152 7.57782 6.19415 7.98803C5.95467 8.43247 5.78317 8.88577 6.02553 9.35426C5.94594 9.44707 5.87471 9.51305 5.82374 9.59215C5.25043 10.4813 4.79405 11.4113 4.80292 12.5059C4.80504 12.7745 4.79284 13.044 4.76872 13.3114C4.76204 13.3855 4.69633 13.5046 4.64422 13.5123C4.56868 13.5235 4.43667 13.4743 4.4059 13.4125C4.27038 13.1403 4.11399 12.8636 4.05805 12.5707C3.99885 12.2608 4.04475 11.9309 4.04475 11.5754C3.99479 11.6817 3.92938 11.7663 3.91704 11.858C3.88555 12.0918 3.84202 12.333 3.86842 12.5638C3.91419 12.9639 3.97737 13.382 4.28674 13.6756C4.71174 14.0787 5.16077 14.4572 5.6088 14.8352C6.00256 15.1675 6.4179 15.4744 6.80778 15.8109C7.24344 16.187 7.10131 16.8185 6.55376 16.9967C6.51188 17.0103 6.47075 17.0262 6.39522 17.0533C6.80377 17.6105 7.18678 18.157 7.14672 18.877C7.61325 18.3417 7.19139 17.9451 6.9467 17.5161C7.08288 17.3799 7.19092 17.3452 7.37368 17.4785C7.57819 17.6277 7.82508 17.7832 8.06626 17.8071C9.29589 17.9287 10.4717 17.8497 11.2608 16.6864C11.311 16.6124 11.4205 16.5786 11.5024 16.5261C11.5411 16.616 11.6182 16.7088 11.6117 16.7953C11.587 17.1241 11.5471 17.453 11.4893 17.7775C11.4507 17.9943 11.361 18.2016 11.315 18.4175C11.2789 18.5873 11.3367 18.7148 11.5613 18.7145C11.5883 18.5824 11.6121 18.4513 11.6424 18.3217C11.8495 17.4361 11.9736 16.5518 11.7731 15.6405C11.7067 15.3386 11.7311 15.008 11.7628 14.6956C11.8069 14.2625 12.0125 14.0669 12.42 13.9702C12.474 13.9574 12.5467 13.9017 12.5588 13.853C12.6491 13.4897 12.9147 13.3446 13.247 13.2882C13.6373 13.2221 14.0125 13.287 14.409 13.493C14.3678 13.4208 14.3597 13.3871 14.3384 13.3723C14.171 13.2557 14.001 13.1428 13.8441 13.0371C14.1665 11.4371 13.813 10.0406 12.6377 8.88026ZM7.34223 4.32141C7.37797 4.31 7.41366 4.29858 7.44938 4.28713C7.40309 4.1361 7.3612 3.98332 7.3051 3.83602C7.29778 3.81682 7.2171 3.82561 7.18788 3.82297C7.24635 4.01184 7.2943 4.16663 7.34223 4.32141ZM10.0375 4.15723C10.141 3.92057 10.0095 3.73551 9.76235 3.75114C9.85284 3.88469 9.9437 4.01885 10.0375 4.15723Z"
      fill="white"
    />
  </svg>
);
