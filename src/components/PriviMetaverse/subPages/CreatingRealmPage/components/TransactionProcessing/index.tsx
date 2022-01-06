import React, { FC, useState, useEffect } from "react";

import Box from "shared/ui-kit/Box";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { ReactComponent as TransactionFailIcon } from "assets/metaverseImages/transaction_fail.svg";
import { ReactComponent as TransactionSuccessIcon } from "assets/metaverseImages/transaction_success.svg";
import GradientCircularProgress from "../../components/GradientCircularProgress";
import { useModalStyles } from "./index.styles";

const isDev = process.env.REACT_APP_ENV === "dev";

interface IProps {
  hash: string;
  status: "progress" | "success" | "fail";
  backToHome: any;
}

export const TransactionProgressing: FC<IProps> = props => {
  const classes = useModalStyles();
  const network = "polygon";

  const { hash, status, backToHome } = props;

  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    if (network.replace(" Chain", "").toLowerCase() === "polygon") {
      setUrl(`${isDev ? "https://mumbai.polygonscan.com/tx/" : "https://polygonscan.com/tx/"}${hash}`);
    } else if (network.replace(" Chain", "").toLowerCase() === "ethereum") {
      setUrl(`${isDev ? "https://rinkeby.etherscan.io/tx/" : "https://etherscan.io/tx/"}${hash}`);
    }
  }, [network, hash]);

  const handleCheck = () => {
    window.open(url, "_blank");
  };

  return (
    <Box className={classes.container}>
      <Box className={classes.wrapper}>
        {status === "progress" ? (
          <Box className={classes.progressBox}>
            <GradientCircularProgress />
            <Box style={{ position: "absolute" }}>
              <PolygonIcon />
            </Box>
          </Box>
        ) : status === "success" ? (
          <TransactionSuccessIcon />
        ) : (
          <TransactionFailIcon />
        )}

        <Box className={classes.typo1} mt={4}>
          {status === "progress" ? (
            <>Creating Your Realm</>
          ) : status === "success" ? (
            <>Transaction successful</>
          ) : (
            <>Transaction failed</>
          )}
        </Box>
        <Box className={classes.typo2} mt={3}>
          {status === "progress" ? (
            <>
              Transaction is proceeding on {network}.<br /> This can take a moment, please be patient...
            </>
          ) : status === "success" ? (
            <>
              Everything went well.
              <br /> You can chack your transaction link below.
            </>
          ) : (
            <>
              Unfortunatelly transaction didn’t went through, please try again later.
              <br /> You can check your transaction link below
            </>
          )}
        </Box>
        <Box display="flex" justifyContent="center" mt={2.5}>
          <Box className={classes.typo2}>Hash:</Box>
          <Box fontSize={16} fontWeight={400} fontFamily="Rany" color="#E9FF26" ml={1} mr={1}>
            {hash.substr(0, 18) + "..." + hash.substr(hash.length - 3, 3)}
          </Box>
          <div style={{ cursor: "pointer" }} onClick={handleCheck}>
            <RedirectIcon />
          </div>
        </Box>
        <Box width={1} display="flex" my={4} flexDirection="column" alignItems="center">
          {status === "progress" && (
            <SecondaryButton
              size="medium"
              style={{
                background: "transparent",
                color: "#fff",
                height: 48,
                minWidth: 249,
                borderRadius: "100px",
              }}
              onClick={handleCheck}
            >
              Check Polygon Scan
            </SecondaryButton>
          )}
          <PrimaryButton
            size="medium"
            style={{
              background: "linear-gradient(92.31deg, #EEFF21 -2.9%, #B7FF5C 113.47%)",
              color: "#212121",
              height: 48,
              minWidth: 249,
              borderRadius: "100px",
              marginTop: 32,
            }}
            onClick={backToHome}
          >
            Back To Home
          </PrimaryButton>
        </Box>
      </Box>
    </Box>
  );
};

export default TransactionProgressing;

export const RedirectIcon = () => (
  <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M13.0833 10.0833H14.3333C15.2538 10.0833 16 9.37445 16 8.5V2.95833C16 2.08388 15.2538 1.375 14.3333 1.375H8.5C7.57953 1.375 6.83333 2.08388 6.83333 2.95833V4.14583M2.66667 15.625H8.5C9.42047 15.625 10.1667 14.9161 10.1667 14.0417V8.5C10.1667 7.62555 9.42047 6.91667 8.5 6.91667H2.66667C1.74619 6.91667 1 7.62555 1 8.5V14.0417C1 14.9161 1.74619 15.625 2.66667 15.625Z"
      stroke="#E9FF26"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

const PolygonIcon = () => (
  <svg width="39" height="34" viewBox="0 0 39 34" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M29.0273 10.2004C28.3273 9.80039 27.4273 9.80039 26.6273 10.2004L21.0273 13.5004L17.2273 15.6004L11.7273 18.9004C11.0273 19.3004 10.1273 19.3004 9.32734 18.9004L5.02734 16.3004C4.32734 15.9004 3.82734 15.1004 3.82734 14.2004V9.20039C3.82734 8.40039 4.22734 7.60039 5.02734 7.10039L9.32734 4.60039C10.0273 4.20039 10.9273 4.20039 11.7273 4.60039L16.0273 7.20039C16.7273 7.60039 17.2273 8.40039 17.2273 9.30039V12.6004L21.0273 10.4004V7.00039C21.0273 6.20039 20.6273 5.40039 19.8273 4.90039L11.8273 0.200391C11.1273 -0.199609 10.2273 -0.199609 9.42734 0.200391L1.22734 5.00039C0.427344 5.40039 0.0273438 6.20039 0.0273438 7.00039V16.4004C0.0273438 17.2004 0.427344 18.0004 1.22734 18.5004L9.32734 23.2004C10.0273 23.6004 10.9273 23.6004 11.7273 23.2004L17.2273 20.0004L21.0273 17.8004L26.5273 14.6004C27.2273 14.2004 28.1273 14.2004 28.9273 14.6004L33.2273 17.1004C33.9273 17.5004 34.4273 18.3004 34.4273 19.2004V24.2004C34.4273 25.0004 34.0273 25.8004 33.2273 26.3004L29.0273 28.8004C28.3273 29.2004 27.4273 29.2004 26.6273 28.8004L22.3273 26.3004C21.6273 25.9004 21.1273 25.1004 21.1273 24.2004V21.0004L17.3273 23.2004V26.5004C17.3273 27.3004 17.7273 28.1004 18.5273 28.6004L26.6273 33.3004C27.3273 33.7004 28.2273 33.7004 29.0273 33.3004L37.1273 28.6004C37.8273 28.2004 38.3273 27.4004 38.3273 26.5004V17.0004C38.3273 16.2004 37.9273 15.4004 37.1273 14.9004L29.0273 10.2004Z"
      fill="white"
    />
  </svg>
);
