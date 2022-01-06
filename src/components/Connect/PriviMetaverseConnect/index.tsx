import React, { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import { TwitterShareButton } from "react-share";
import Web3 from "web3";
import io from "socket.io-client";
import axios from "axios";

import { useMediaQuery, useTheme } from "@material-ui/core";

import Footer from "./components/Footer";
import Header from "./components/Header";
import { socket, setSocket } from "components/Login/Auth";
import { setUser } from "store/actions/User";
import { setLoginBool } from "store/actions/LoginBool";

import { useAuth } from "shared/contexts/AuthContext";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import Box from "shared/ui-kit/Box";
import { NoMetamaskModal } from "shared/ui-kit/Modal/Modals/NoMetamaskModal";
import { injected } from "shared/connectors";
import * as API from "shared/services/API/WalletAuthAPI";
import {
  handleYoutubeLink,
  handleTwitterLink,
  handleInstagramLink,
  handleLinkedinLink,
  handleTiktokLink,
  handleMediumLink,
} from "shared/constants/constants";
import URL from "shared/functions/getURL";
import { useInterval } from "shared/hooks/useInterval";
import { LoadingWrapper } from "shared/ui-kit/Hocs";

import { ReactComponent as YoutubeIcon } from "assets/snsIcons/youtube.svg";
import { ReactComponent as TwitterIcon } from "assets/snsIcons/twitter.svg";
import { ReactComponent as InstagramIcon } from "assets/snsIcons/instagram.svg";
import { ReactComponent as LinkedInIcon } from "assets/snsIcons/linkedin.svg";
import { ReactComponent as TiktokIcon } from "assets/snsIcons/tiktok.svg";
import { ReactComponent as MediaIcon } from "assets/snsIcons/media.svg";

import { priviHomePageStyles } from "./index.styles";

const PriviSocialBox = () => {
  const classes = priviHomePageStyles();
  return (
    <Box className={classes.snsContainer}>
      <Box className={classes.snsBox} onClick={handleYoutubeLink}>
        <YoutubeIcon width="26px" />
      </Box>
      <Box className={classes.snsBox} onClick={handleTwitterLink}>
        <TwitterIcon />
      </Box>
      <Box className={classes.snsBox} onClick={handleInstagramLink}>
        <InstagramIcon />
      </Box>
      <Box className={classes.snsBox} onClick={handleLinkedinLink}>
        <LinkedInIcon />
      </Box>
      <Box className={classes.snsBox} onClick={handleTiktokLink}>
        <TiktokIcon />
      </Box>
      <Box className={classes.snsBox} onClick={handleMediumLink}>
        <MediaIcon />
      </Box>
    </Box>
  );
};

const PriviMetaverseConnect = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const classes = priviHomePageStyles();
  const { setSignedin } = useAuth();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  const isTablet = useMediaQuery(theme.breakpoints.down("sm"));

  const { showAlertMessage } = useAlertMessage();
  const { activate, account, library, active } = useWeb3React();
  const [status, setStatus] = useState<string>("nolist");
  const [waitlisted, setWaitlisted] = useState<boolean>(false);
  // const [tweetWait, setTweetWait] = useState<boolean>(false);
  const [tweetWaitlistLoading, setTweetWaitlistLoading] = useState<boolean>(false);
  const tweetWaitRef = useRef<boolean>(false);
  const [noMetamask, setNoMetamask] = useState<boolean>(false);
  const [isLogined, setIsLogined] = useState<boolean>(false);
  const [signatureFail, setSignatureFail] = useState<boolean>(false);
  const [downloadAppLinkMac, setDownloadAppLinkMac] = useState<string>("");
  const [downloadAppLinkWindows, setDownloadAppLinkWindows] = useState<string>("");
  const twitterButton = useRef<HTMLButtonElement>(null);

  //  blinding early access
  useEffect(() => {
    var bgColorIdx = 0;
    var colorIdx = 0;

    const intervalRef = setInterval(() => {
      var doc = document.getElementById("earlyAccessMetaverse");
      const color = ["#ffffff", "#181818"];
      const bgColor = ["#ffa234", "#ef43c9", "#7e85ff", "#7ed1ef", "#bf7eff"];
      if (doc) {
        doc.style.backgroundColor = bgColor[bgColorIdx];
      }
      if (bgColorIdx % bgColor.length === 0) {
        if (doc) {
          doc.style.color = color[colorIdx];
        }
        colorIdx = (colorIdx + 1) % color.length;
      }
      bgColorIdx = (bgColorIdx + 1) % bgColor.length;
    }, 500);

    return () => {
      clearInterval(intervalRef);
    };
  }, []);

  useEffect(() => {
    if (account && account.length > 0 && !signatureFail) {
      axios
        .post(`${URL()}/wallet/getEthAddressStatus`, {
          address: account,
          appName: "PriviMetaverse",
        })
        .then(async res => {
          if (res.data.success === true) {
            const data = res.data.data;
            if (data.status === "authorized") {
              setStatus("authorized");
              signIn();
            } else {
              if (data.status === "nolist" && twitterButton.current) {
                twitterButton.current.click();
                setTweetWaitlistLoading(true);
                tweetWaitRef.current = true;
              }
              setStatus(data.status);
            }
          }
        });
    }
  }, [account]);

  useInterval(() => {
    if (tweetWaitRef.current) {
      axios
        .post(`${URL()}/wallet/getEthAddressStatus`, {
          address: account,
          appName: "PriviMetaverse",
        })
        .then(res => {
          if (res.data.success === true) {
            const data = res.data.data;
            if (data.status === "waitlisted") {
              setWaitlisted(true);
              setTweetWaitlistLoading(false);
              tweetWaitRef.current = false;
            } else if (data.status === "authorized") {
              getDownloadAppLink();

              history.push("/");
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }, 10000);

  const getDownloadAppLink = () => {
    axios.get(`${URL()}/priviZoo/metaverse/getAppDownloadLink`).then(res => {
      setDownloadAppLinkMac(res.data.pathMac);
      setDownloadAppLinkWindows(res.data.pathWindows);
      setIsLogined(true);
    });
  };

  const handleConnectWallet = () => {
    if (active) {
      if (account && signatureFail) {
        setSignatureFail(false);
      }
    } else {
      activate(injected, undefined, true).catch(error => {
        if (error instanceof UnsupportedChainIdError) {
          activate(injected);
        } else {
          console.info("Connection Error - ", error);
          setNoMetamask(true);
        }
      });
    }
  };

  const signIn = () => {
    if (account) {
      const web3 = new Web3(library.provider);
      API.signInWithMetamaskWallet(account, web3, "Dreem").then(res => {
        if (res.isSignedIn) {
          setSignedin(true);
          const data = res.userData;

          // socket
          if (!socket) {
            const sock = io(URL(), { query: { token: res.accessToken } });
            sock.connect();
            setSocket(sock);
          }
          if (socket) {
            socket.emit("add user", data.id);
          }

          dispatch(setUser(data));
          localStorage.setItem("token", res.accessToken);
          localStorage.setItem("address", account);
          localStorage.setItem("userId", data.id);
          localStorage.setItem("userSlug", data.urlSlug ?? data.id);

          axios.defaults.headers.common["Authorization"] = "Bearer " + res.accessToken;
          dispatch(setLoginBool(true));
          getDownloadAppLink();

          history.push("/");
        } else {
          if (res.message) {
            setSignatureFail(true);
            if (res.message === "Wallet address doesn't exist") {
              signUp(res.signature);
            } else {
              showAlertMessage(res.message, { variant: "error" });
            }
          } else {
            showAlertMessage("Connect the metamask", { variant: "error" });
          }
        }
      });
    }
  };

  const signUp = async signature => {
    if (account) {
      const res = await API.signUpWithAddressAndName(account, account, signature, "Dreem");
      if (res.isSignedIn) {
        setSignedin(true);
        const data = res.userData;

        // socket
        if (!socket) {
          const sock = io(URL(), { query: { token: res.accessToken } });
          sock.connect();
          setSocket(sock);
        }
        if (socket) {
          socket.emit("add user", data.id);
        }

        dispatch(setUser(data));
        localStorage.setItem("token", res.accessToken);
        localStorage.setItem("address", account);
        localStorage.setItem("userId", data.id);
        localStorage.setItem("userSlug", data.urlSlug ?? data.id);

        axios.defaults.headers.common["Authorization"] = "Bearer " + res.accessToken;
        dispatch(setLoginBool(true));
        getDownloadAppLink();

        history.push("/");
      } else {
        showAlertMessage(res.message, { variant: "error" });
      }
    }
  };

  return (
    <Box className={classes.container}>
      <img
        src={require("assets/metaverseImages/connect_background.png")}
        alt="Metaverse"
        className={classes.gradient}
      />
      <Box className={classes.navigationContainer}>
        <Header cardHidden={!!account} />
        <Box className={classes.mainContainer} display="flex" flexDirection="column">
          <Box className={classes.titleContainer} display="flex" alignItems="center" justifyContent="center">
            <Box position="relative">
              <img src={require("assets/logos/Metaverse.svg")} alt="Metaverse" className={classes.pixLogo} />
              <span id="earlyAccessMetaverse" className={classes.earlyAccess}>
                early access
              </span>
            </Box>
          </Box>
          {account && !signatureFail ? (
            <>
              {isLogined ? (
                <>
                  <Box className={classes.titleDescription3}>
                    <Box>Congratulations, you’ve been selected as Beta tester of Dreem.</Box>
                    <Box mt={"12px"} pb={3} color="#4218B5" borderBottom="1px dashed #4218B5">
                      {isMobile || isTablet ? "" : "To enter it, please follow steps below:"}
                    </Box>
                    <Box className={classes.titleFollow1}>
                      {isMobile || isTablet ? (
                        <Box
                          fontSize={24}
                          fontWeight={400}
                          color="#4218B5"
                          fontFamily="Agrandir"
                          textAlign="center"
                        >
                          Download Dreem on your Desktop PC and enjoy the experience. App is not yet available
                          on mobile{" "}
                        </Box>
                      ) : (
                        <>
                          <Box display="flex" alignItems="center" justifyContent="center">
                            <FirstIcon />
                            <Box ml={"10px"}>Download the zip file</Box>
                          </Box>
                          <Box display="flex" alignItems="center" justifyContent="center">
                            <SecondIcon />
                            <Box ml={"10px"}>Unpack it where you want to have the experience placed</Box>
                          </Box>
                          <Box display="flex" alignItems="center" justifyContent="center">
                            <ThirdIcon />
                            <Box ml={"10px"}>Run Dreem.exe</Box>
                          </Box>
                          <Box display="flex" alignItems="center" justifyContent="center">
                            <FourthIcon />
                            <Box ml={"10px"}>Sign in with metamask</Box>
                          </Box>
                          <Box display="flex" alignItems="center" justifyContent="center">
                            <FifthIcon />
                            <Box ml={"10px"}>Enjoy and post your impressions in social media!</Box>
                          </Box>
                        </>
                      )}
                    </Box>
                    {isMobile || isTablet ? (
                      <></>
                    ) : (
                      <Box display="flex" justifyContent="center" mt="62px">
                        <a
                          href={downloadAppLinkMac}
                          target="_blank"
                          style={{ textDecoration: "none", color: "white", cursor: "pointer" }}
                        >
                          <Box
                            width={"300px"}
                            height={"57px"}
                            px={"25px"}
                            display="flex"
                            justifyContent="center"
                            bgcolor="#181818"
                            color="#fff"
                            borderRadius={"8px"}
                            py={"14px"}
                          >
                            <DownloadIcon />
                            <Box fontSize={20} ml={1.5}>
                              Download for MAC
                            </Box>
                          </Box>
                        </a>
                        <a
                          href={downloadAppLinkWindows}
                          target="_blank"
                          style={{ textDecoration: "none", color: "white", cursor: "pointer" }}
                        >
                          <Box
                            width={"300px"}
                            height={"57px"}
                            px={"25px"}
                            display="flex"
                            bgcolor="#181818"
                            color="#fff"
                            borderRadius={"8px"}
                            py={"14px"}
                            ml={2}
                          >
                            <DownloadIcon />
                            <Box fontSize={20} ml={1.5}>
                              Download for Windows
                            </Box>
                          </Box>
                        </a>
                      </Box>
                    )}
                  </Box>
                </>
              ) : waitlisted ? (
                <>
                  <Box className={classes.titleDescription2}>
                    <h4 style={{ fontWeight: 400 }}>🎉 Congrats! You’ve been successfully whitelisted.</h4>
                    <h3 className={classes.titleFollow}>Follow our social media for updates</h3>
                  </Box>
                  <PriviSocialBox />
                </>
              ) : status !== "nolist" ? (
                <>
                  {status === "authorized" ? (
                    <Box className={classes.titleDescription2}>
                      <h4 style={{ fontWeight: 400 }}>Connect your Wallet to Mainnet Network</h4>
                      <h3 className={classes.titleFollow}>Follow our social media for updates</h3>
                    </Box>
                  ) : (
                    <Box className={classes.titleDescription2}>
                      <h4 style={{ fontWeight: 400 }}>
                        Looks like you are already on our whitelist. Stay tuned!
                      </h4>
                      <h3 className={classes.titleFollow}>Follow our social media for updates</h3>
                    </Box>
                  )}
                  <PriviSocialBox />
                </>
              ) : (
                <>
                  <Box className={classes.titleDescription2}>
                    You're one step closer to getting on the app whitelist!
                    <br />
                    <span>Tweet this to enjoy early access</span>
                  </Box>
                  <Box className={classes.twitterShareContainer}>
                    <span>
                      I just joined the @priviprotocol waitlist for <b>Dreem</b> with {account}! Join me to be
                      one of the first people on <b>Dreem</b> and a chance to win up to 200 USDC!{" "}
                      <a href="https://bit.ly/3lfSu5n" target="_blank">
                        https://bit.ly/3lfSu5n
                      </a>
                    </span>
                    <LoadingWrapper loading={tweetWaitlistLoading}>
                      <TwitterShareButton
                        title={`I just joined the @priviprotocol waitlist for Dreem with ${account}! Join me to be one of the first people on Dreem and a chance to win up to 200 USDC!`}
                        url="https://bit.ly/3lfSu5n"
                      >
                        <button
                          className={classes.twitterShareButton}
                          ref={twitterButton}
                          onClick={() => {
                            setTweetWaitlistLoading(true);
                            tweetWaitRef.current = true;
                          }}
                        >
                          <TwitterIcon />
                          <span>Share on Twitter</span>
                        </button>
                      </TwitterShareButton>
                    </LoadingWrapper>
                  </Box>
                </>
              )}
            </>
          ) : (
            <>
              <Box className={classes.titleDescription}>
                Connect your wallet to get in to the whitelist, or{" "}
                <span>enter the platform if you already have access</span>
              </Box>
              <Box className={classes.btnConnectContainer}>
                <button className={classes.btnConnect} onClick={handleConnectWallet}>
                  Connect Wallet
                </button>
              </Box>
            </>
          )}
        </Box>
      </Box>
      <Box>
        <Footer />
      </Box>
      <NoMetamaskModal open={noMetamask} onClose={() => setNoMetamask(false)} />
    </Box>
  );
};

const FirstIcon = () => (
  <svg width="33" height="42" viewBox="0 0 33 42" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16.5" cy="16.5" r="16.1547" stroke="#54658F" stroke-opacity="0.3" stroke-width="0.690516" />
    <circle cx="16.6624" cy="16.6624" r="12.6624" fill="url(#paint0_linear)" />
    <path
      d="M13.2336 20.1453H20.9895V18.3554H19.0008V12.2347H16.2608C15.6532 13.1186 14.703 13.6489 13.3662 13.903L13.9186 15.9469C14.935 15.6597 15.6532 15.3061 16.1061 14.6543H16.1172L16.1282 18.3554H13.2336V20.1453Z"
      fill="white"
    />
    <line x1="16.7725" y1="35" x2="16.7725" y2="42" stroke="#4218B5" stroke-dasharray="2 2" />
    <defs>
      <linearGradient
        id="paint0_linear"
        x1="16.6624"
        y1="4"
        x2="25.2725"
        y2="35.5"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#4218B5" />
        <stop offset="1" stop-color="#7441FF" />
      </linearGradient>
    </defs>
  </svg>
);

const SecondIcon = () => (
  <svg width="33" height="42" viewBox="0 0 33 42" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16.5" cy="16.5" r="16.1547" stroke="#54658F" stroke-opacity="0.3" stroke-width="0.690516" />
    <circle cx="16.6624" cy="16.6624" r="12.6624" fill="url(#paint0_linear)" />
    <path
      d="M12.0924 20.1453H20.9421V18.3665H14.987C14.987 17.7257 15.4179 17.4274 16.5449 17.2617L17.948 17.0628C19.9698 16.8087 20.8205 16.1347 20.8205 14.7427C20.8205 12.9418 19.2296 12.0358 17.0089 12.0358C15.3295 12.0358 13.4182 12.5551 12.2802 13.4169L13.2304 15.1515C14.1916 14.4665 15.6057 13.9914 16.6332 13.9914C17.4729 13.9914 18.0253 14.2897 18.0253 14.7869C18.0253 15.2067 17.6718 15.4166 16.8432 15.5271L15.6168 15.7149C13.1088 16.0574 12.0924 16.9744 12.0924 19.0957V20.1453Z"
      fill="white"
    />
    <line x1="16.7725" y1="35" x2="16.7725" y2="42" stroke="#4218B5" stroke-dasharray="2 2" />
    <defs>
      <linearGradient
        id="paint0_linear"
        x1="16.6624"
        y1="4"
        x2="25.2725"
        y2="35.5"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#4218B5" />
        <stop offset="1" stop-color="#7441FF" />
      </linearGradient>
    </defs>
  </svg>
);

const ThirdIcon = () => (
  <svg width="33" height="42" viewBox="0 0 33 42" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16.5" cy="16.5" r="16.1547" stroke="#54658F" stroke-opacity="0.3" stroke-width="0.690516" />
    <circle cx="16.6624" cy="16.6624" r="12.6624" fill="url(#paint0_linear)" />
    <path
      d="M16.6798 20.3441C19.1656 20.3441 21.0107 19.3608 21.0217 17.8804C21.0217 17.0628 20.4362 16.3668 19.3976 16.0464V16.0243C20.1821 15.7039 20.635 15.0631 20.635 14.356C20.624 12.9639 18.9999 12.0579 16.6908 12.0579C14.3154 12.0579 12.4041 13.0302 12.1279 14.5107L14.8789 14.9636C14.9562 14.2565 15.6633 13.7704 16.5803 13.7704C17.3537 13.7704 17.8951 14.124 17.8951 14.6211C17.8951 15.1073 17.4531 15.4608 16.6687 15.4829L15.7075 15.505V16.5988L16.8234 16.6209C17.5636 16.6319 18.1271 16.9634 18.1381 17.5379C18.1381 18.1345 17.4863 18.5543 16.5914 18.5543C15.5197 18.5543 14.7132 17.9467 14.5916 17.0849L11.8296 17.6815C12.1721 19.2725 14.0061 20.3441 16.6798 20.3441Z"
      fill="white"
    />
    <line x1="16.7725" y1="35" x2="16.7725" y2="42" stroke="#4218B5" stroke-dasharray="2 2" />
    <defs>
      <linearGradient
        id="paint0_linear"
        x1="16.6624"
        y1="4"
        x2="25.2725"
        y2="35.5"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#4218B5" />
        <stop offset="1" stop-color="#7441FF" />
      </linearGradient>
    </defs>
  </svg>
);

const FourthIcon = () => (
  <svg width="33" height="42" viewBox="0 0 33 42" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16.5" cy="16.5" r="16.1547" stroke="#54658F" stroke-opacity="0.3" stroke-width="0.690516" />
    <circle cx="16.6624" cy="16.6624" r="12.6624" fill="url(#paint0_linear)" />
    <path
      d="M17.3367 20.1453H20.132V18.6427H21.0269V16.9302H20.132V12.2347H16.2319L11.7353 17.2396V18.6427H17.3367V20.1453ZM14.7294 16.9302L17.3257 14.0798H17.3367V16.9302H14.7294Z"
      fill="white"
    />
    <line x1="16.7725" y1="35" x2="16.7725" y2="42" stroke="#4218B5" stroke-dasharray="2 2" />
    <defs>
      <linearGradient
        id="paint0_linear"
        x1="16.6624"
        y1="4"
        x2="25.2725"
        y2="35.5"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#4218B5" />
        <stop offset="1" stop-color="#7441FF" />
      </linearGradient>
    </defs>
  </svg>
);

const FifthIcon = () => (
  <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16.5" cy="16.5" r="16.1547" stroke="#54658F" stroke-opacity="0.3" stroke-width="0.690516" />
    <circle cx="16.6624" cy="16.6624" r="12.6624" fill="url(#paint0_linear)" />
    <path
      d="M16.5402 20.3441C19.3133 20.3441 21.059 19.2393 21.059 17.4937C21.059 15.8364 19.6448 14.7869 17.402 14.7869C16.6839 14.7869 15.9215 14.9636 15.4133 15.2619L15.5017 13.9361H19.9652V12.2347H13.0821L12.8059 16.4551L15.1923 16.8197C15.4796 16.5104 16.0099 16.3336 16.5844 16.3336C17.5677 16.3336 18.1864 16.7645 18.1864 17.4716C18.1864 18.1345 17.5677 18.5433 16.5844 18.5433C15.579 18.5433 14.8609 18.035 14.7173 17.2396L11.8889 17.7809C12.143 19.3608 13.9439 20.3441 16.5402 20.3441Z"
      fill="white"
    />
    <defs>
      <linearGradient
        id="paint0_linear"
        x1="16.6624"
        y1="4"
        x2="25.2725"
        y2="35.5"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#4218B5" />
        <stop offset="1" stop-color="#7441FF" />
      </linearGradient>
    </defs>
  </svg>
);

const DownloadIcon = () => (
  <svg width="20" height="22" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M9.96017 16.0684L16.5885 9.44005H11.441V2.11087C11.441 1.29297 10.7779 0.629924 9.96001 0.629924C9.14211 0.629924 8.47907 1.29296 8.47907 2.11087V9.44005L3.33154 9.43881L9.96017 16.0684Z"
      fill="#86E8FF"
    />
    <path
      d="M4.35499 17.7761C4.94119 17.1898 5.87902 17.1942 6.57926 17.6381C7.62618 18.3016 8.84264 18.698 10.2035 18.698C11.5069 18.698 12.7741 18.3059 13.8289 17.6488C14.53 17.2121 15.4727 17.1967 16.0567 17.7807C16.641 18.365 16.6464 19.3229 15.981 19.8128C14.3595 21.0068 12.3491 21.7302 10.2036 21.7302C8.054 21.7302 6.04008 21.0493 4.41704 19.8329C3.74917 19.3324 3.76486 18.3663 4.35499 17.7761Z"
      fill="#86E8FF"
    />
  </svg>
);

export default PriviMetaverseConnect;
