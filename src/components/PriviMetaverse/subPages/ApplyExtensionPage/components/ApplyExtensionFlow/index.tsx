import React, { useEffect, useState, useRef } from "react";

import { FormControlLabel, useMediaQuery, useTheme, Switch, SwitchProps, styled, Select, MenuItem, Button, TextField, InputAdornment, Hidden, Grid } from "@material-ui/core";

import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { InfoTooltip } from "shared/ui-kit/InfoTooltip";
import { ReactComponent as AssetIcon } from "assets/icons/mask_group.svg";
import { useModalStyles } from "./index.styles";

import { InfoIcon } from "shared/ui-kit/Icons";
import { ReactComponent as DeleteIcon } from "assets/icons/remove.svg";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { ReactComponent as TelegramIcon } from "assets/snsIcons/telegram.svg";
import { ReactComponent as WhatsappIcon } from "assets/snsIcons/whatsapp.svg";
import { ReactComponent as GitbookIcon } from "assets/snsIcons/gitbook.svg";
import { ReactComponent as MediumIcon } from "assets/snsIcons/medium.svg";
import { ReactComponent as JuiceLogoIcon } from "assets/logos/juice_logo.svg";
import { ReactComponent as TwitterIcon } from "assets/snsIcons/twitter.svg";
import { ReactComponent as InstagramIcon } from "assets/snsIcons/instagram.svg";
import { ReactComponent as TiktokIcon } from "assets/snsIcons/tiktok.svg";
import { ReactComponent as FacebookIcon } from "assets/snsIcons/facebook.svg";

interface CollectionInfo {
  address: string;
  from: string;
  to: string;
}

const CreateSteps = [
  {
    step: 1,
    label: 'Realm Details',
    completed: false
  },
  {
    step: 2,
    label: 'Financials',
    completed: false
  },
  {
    step: 3,
    label: 'Governance',
    completed: false
  },
  {
    step: 4,
    label: 'Status',
    completed: false
  },
]

const ApplyExtensionFlow = ({
  metaData,
  handleCancel,
}: {
  metaData: any;
  handleCancel: () => void;
}) => {
  const classes = useModalStyles();
  const { showAlertMessage } = useAlertMessage();

  const [hash, setHash] = useState<string>("0xf273a38fec99acf1e....eba");
  const [step, setStep] = useState<number>(1);
  const [steps, setSteps] = useState<any>(CreateSteps);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [symbol, setSymbol] = useState<string>("");
  const [taxation, setTaxation] = useState<string>("");
  const [votingConsensus, setVotingConsensus] = useState<string>("");
  const [votingPower, setVotingPower] = useState<string>("");
  const [privacy, setPrivacy] = useState<string>('public');
  const [collectionInfos, setCollectionInfos] = useState<Array<CollectionInfo>>([{
    address: '',
    from: '',
    to: ''
  }]);
  const [sizeSpec, setSizeSpec] = useState<any>(metaData);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  const [image, setImage] = useState<any>(null);
  const [imageFile, setImageFile] = useState<any>(null);
  const [video, setVideo] = useState<any>(null);
  const [videoFile, setVideoFile] = useState<any>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handlePrev = () => {
    if (step == 1) {
      handleCancel();
      return;
    }
    setStep(prev => prev - 1);
  };
  const handleNext = () => {
    if (step < 3) {
      setStep(prev => prev + 1);
    }
  };
  

  return (
    <>
      <div className={classes.otherContent}>
        <Box
          className={classes.content}
          style={{
            padding: isMobile ? "47px 22px 63px" : "47px 58px 63px",
          }}
        >
          <div className={classes.modalContent}>
            {step == 1 && (
              <>
                <div style={{ position: "relative" }}>
                  <img className={classes.loader} src={require("assets/metaverseImages/loading.png")} />
                  <div className={classes.ethImg}>
                    <img
                      src={require(`assets/metaverseImages/polygon.png`)}
                    />
                  </div>
                </div>
                <Box className={classes.title} mt={4}>
                  applying extension
                </Box>
                <Box className={classes.header1} mt={2} mb={2}>
                  Transaction is proceeding on Polygon Chain. This can take a moment, please be patient...
                </Box>
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
                <PrimaryButton
                  size="medium"
                  style={{
                    background: "transparent",
                    marginTop: "24px",
                    color: "#ffffff",
                    textTransform: "uppercase",
                    padding: "0 24px",
                    border: "2px solid #858a8d",
                  }}
                  isRounded
                  onClick={() => {}}
                >
                  Check Polygon Scan
                </PrimaryButton>
              </>
            )}
            {step == 2 &&
              <>
                <Box display="flex" justifyContent="center" >
                  <img
                    src={require("assets/icons/apply_extension.svg")}
                    className={classes.topIcon}
                  />
                </Box>
                <Box className={classes.title} mt={4}>
                  Awesome! you’ve applied for  extension.
                </Box>
                <Box className={classes.header1} mt={2} mb={2}>
                  Cool! Everything wen’t well and you canshare the news with your crowd! 
                </Box>
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
                <PrimaryButton
                  size="medium"
                  style={{
                    background: "transparent",
                    marginTop: "24px",
                    color: "#ffffff",
                    textTransform: "uppercase",
                    padding: "0 24px",
                    border: "2px solid #858a8d",
                  }}
                  isRounded
                  onClick={() => {}}
                >
                  Check Polygon Scan
                </PrimaryButton>

                <Box className={classes.shareSection}>
                  <Box className={classes.header3}>Share on</Box>
                  <Box className={classes.snsIconList}>
                    <Box className={classes.snsBox} onClick={() => {}}>
                      <TelegramIcon />
                    </Box>
                    <Box className={classes.snsBox} onClick={() => {}}>
                      <TwitterIcon />
                    </Box>
                    <Box className={classes.snsBox} onClick={() => {}}>
                      <TiktokIcon />
                    </Box>
                    <Box className={classes.snsBox} onClick={() => {}}>
                      <FacebookIcon />
                    </Box>
                    <Box className={classes.snsBox} onClick={() => {}}>
                      <WhatsappIcon />
                    </Box>
                    <Box className={classes.snsBox} onClick={() => {}}>
                      <InstagramIcon />
                    </Box>
                  </Box>
                </Box>

                <Box className={classes.shareSection}>
                  <PrimaryButton
                    size="medium"
                    style={{
                      background: "#EEFF21",
                      marginTop: "24px",
                      color: "#212121",
                      textTransform: "uppercase",
                      padding: "0 24px",
                    }}
                    isRounded
                    onClick={() => {}}
                  >
                    back to home
                  </PrimaryButton>
                </Box>
              </>
            }
            {step == 3 &&
              <>
                <div style={{ position: "relative" }}>
                  <CloseIcon />
                </div>
                <Box className={classes.title} mt={4}>
                  Transaction failed
                </Box>
                <Box className={classes.header1} mt={2} mb={2}>
                  Unfortunatelly transaction didn’t went through, please try again later. You can check your transaction link below and t
                </Box>
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
                <PrimaryButton
                  size="medium"
                  style={{
                    background: "#EEFF21",
                    marginTop: "24px",
                    color: "#212121",
                    textTransform: "uppercase",
                    padding: "0 24px",
                  }}
                  isRounded
                  onClick={() => {}}
                >
                  back to home
                </PrimaryButton>
              </>
            }
            
          </div>
        </Box>
        
      </div>

      <Box className={classes.footer}>
        <div className={classes.howToCreateBtn} onClick={handlePrev}>
          cancel
        </div>
        <PrimaryButton
          size="medium"
          className={classes.nextBtn}
          onClick={() => handleNext()}
        >
          next
        </PrimaryButton>
      </Box>
    </>
  );
};

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

const CloseIcon = () => (
  <svg width="136" height="152" viewBox="0 0 136 152" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path opacity="0.1" d="M81.579 150.251C72.9445 152.034 64.0432 152.099 55.3835 150.443C46.7238 148.786 38.4752 145.44 31.1087 140.595C23.7423 135.75 17.4021 129.502 12.4503 122.207C7.49853 114.912 4.03206 106.714 2.24884 98.079C0.465613 89.4445 0.400553 80.5432 2.05737 71.8835C3.71419 63.2238 7.06045 54.9752 11.9051 47.6087C16.7497 40.2422 22.9978 33.9021 30.2927 28.9503C37.5876 23.9985 45.7864 20.5321 54.421 18.7488C63.0555 16.9656 71.9568 16.9006 80.6165 18.5574C89.2762 20.2142 97.5248 23.5604 104.891 28.4051C112.258 33.2497 118.598 39.4978 123.55 46.7927C128.501 54.0876 131.968 62.2864 133.751 70.921C135.534 79.5555 135.599 88.4568 133.943 97.1165C132.286 105.776 128.94 114.025 124.095 121.391C119.25 128.758 113.002 135.098 105.707 140.05C98.4124 145.001 90.2136 148.468 81.579 150.251L81.579 150.251Z" stroke="#281136" stroke-width="0.722591"/>
    <path opacity="0.25" d="M81.579 134.251C72.9445 136.034 64.0432 136.099 55.3835 134.443C46.7238 132.786 38.4752 129.44 31.1087 124.595C23.7423 119.75 17.4021 113.502 12.4503 106.207C7.49853 98.9124 4.03206 90.7136 2.24884 82.079C0.465613 73.4445 0.400553 64.5432 2.05737 55.8835C3.71419 47.2238 7.06045 38.9752 11.9051 31.6087C16.7497 24.2422 22.9978 17.9021 30.2927 12.9503C37.5876 7.99853 45.7864 4.53206 54.421 2.74884C63.0555 0.965613 71.9568 0.900554 80.6165 2.55737C89.2762 4.2142 97.5248 7.56045 104.891 12.4051C112.258 17.2497 118.598 23.4978 123.55 30.7927C128.501 38.0876 131.968 46.2864 133.751 54.921C135.534 63.5555 135.599 72.4568 133.943 81.1165C132.286 89.7762 128.94 98.0248 124.095 105.391C119.25 112.758 113.002 119.098 105.707 124.05C98.4124 129.001 90.2136 132.468 81.579 134.251L81.579 134.251Z" stroke="white" stroke-width="0.722591"/>
    <g opacity="0.2">
    <circle cx="68" cy="67.5" r="51.5" fill="#17172D"/>
    <circle cx="68" cy="67.5" r="51.5" fill="#F44950"/>
    </g>
    <path d="M54.5 82L83.4985 53M54.5005 53.0007L83.5 81.9997" stroke="url(#paint0_linear_6785_463984)" stroke-width="6" stroke-linecap="square"/>
    <defs>
    <linearGradient id="paint0_linear_6785_463984" x1="24.3118" y1="5.60004" x2="62.5753" y2="-0.617484" gradientUnits="userSpaceOnUse">
    <stop stop-color="#C22684"/>
    <stop offset="1" stop-color="#F84B4B"/>
    </linearGradient>
    </defs>
  </svg>
);

const IOSSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  marginLeft: 12,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: "#2ECA45",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: "#E9E9EA",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

export default ApplyExtensionFlow;
