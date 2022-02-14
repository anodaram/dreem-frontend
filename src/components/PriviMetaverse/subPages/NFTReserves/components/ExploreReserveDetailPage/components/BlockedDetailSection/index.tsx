import React, { useEffect, useState } from "react";
import Box from "shared/ui-kit/Box";
import { Text, SecondaryButton } from "shared/ui-kit";

import { exploreOptionDetailPageStyles } from "../../index.styles";
import { useSelector } from "react-redux";
import { RootState } from "store/reducers/Reducer";
import moment from "moment";

export default ({ nft, refresh }) => {
  const classes = exploreOptionDetailPageStyles();
  const [blockingInfo, setBlockingInfo] = useState<any>(null);
  const [closeTime, setCloseTime] = useState<any>(null);
  const tokens = useSelector((state: RootState) => state.marketPlace.tokenList);

  useEffect(() => {
    if (nft) {
      setBlockingInfo(nft.blockingSalesHistories[nft.blockingSalesHistories.length - 1]);
    }
  }, [nft]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (blockingInfo) {
        let formatDate = getRemainingTime(blockingInfo);
        setCloseTime(formatDate);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [blockingInfo]);

  const getRemainingTime = _blockingInfo => {
    let value = Math.max(
      _blockingInfo?.ReservePeriod * 3600 * 24 * 1000 + _blockingInfo?.created - Date.now(),
      0
    );
    value = value / 1000;
    let day_unit = 3600 * 24;
    let hr_unit = 3600;
    let min_unit = 60;
    return {
      day: parseInt((value / day_unit).toString()),
      hour: parseInt(((value % day_unit) / hr_unit).toString()),
      min: parseInt(((value / min_unit) % min_unit).toString()),
      seconds: Math.floor(value % 60),
    };
  };

  const getTokenSymbol = addr => {
    if (tokens.length == 0 || !addr) return 0;
    let token = tokens.find(token => token.Address.toLowerCase() === addr.toLowerCase());
    return token?.Symbol || "";
  };

  return (
    <>
      <Box display="flex" justifyContent="space-between">
        <Text
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            fontFamily: "GRIFTER",
            color: "white",
          }}
        >
          Details
        </Text>
      </Box>
      <Box display="flex" mt={2} flex={1}>
        <Box
          display="flex"
          flexDirection="column"
          flex={1}
          style={{ borderRight: "1px solid #9EACF220", fontSize: 14 }}
        >
          <Box className={classes.gradientText} fontSize="14px" mb="4px">
            Blocking Period
          </Box>
          <Box fontFamily="GRIFTER" fontWeight="bold" fontSize="20px">{`${
            blockingInfo?.ReservePeriod
          } days (${moment(
            new Date(blockingInfo?.ReservePeriod * 3600 * 24 * 1000 + blockingInfo?.created)
          ).format("DD.MM.YYYY")})`}</Box>
        </Box>
        <Box display="flex" flexDirection="column" flex={1} pl={5} style={{ fontSize: 14 }}>
          <Box className={classes.gradientText} fontSize="14px" mb="4px">
            Collateral
          </Box>
          <Box fontFamily="GRIFTER" fontWeight="bold" fontSize="20px">
            {blockingInfo?.CollateralPercent} %
          </Box>
        </Box>
      </Box>
      <Box mt={4} className={classes.BlockedDetailSection}>
        <Box display="flex" justifyContent="space-between" padding="32px">
          <Box fontFamily="Rany" fontSize={16}>
            Blocked price
          </Box>
          <Box className={classes.gradientText} fontFamily={"Rany"} fontWeight={800} fontSize={24}>
            {blockingInfo?.Price} {getTokenSymbol(blockingInfo?.PaymentToken)}
          </Box>
        </Box>
        <Box className={classes.BlockedDetailBottomSection}>
          <Box
            display="flex"
            justifyContent="space-between"
            padding="32px 0"
            marginX="32px"
            color="white"
            style={{ borderBottom: "1px solid #ED7B7B21", position: "relative" }}
          >
            <Box fontSize={16} fontFamily="Rany">
              Already paid
            </Box>
            <Box className={classes.gradientText} fontFamily={"Rany"} fontWeight={800} fontSize={24}>
              {blockingInfo?.PaidAmount || 0} {getTokenSymbol(blockingInfo?.PaymentToken)}
            </Box>
            {blockingInfo && blockingInfo?.PaidAmount == blockingInfo?.Price && (
              <Box position="absolute" bottom={"calc(50% - 30px)"} right={0} fontSize={14} fontWeight={700}>
                100% PAID
              </Box>
            )}
          </Box>
          <Box padding="32px 0" display="flex" alignItems="center" justifyContent="center">
            {blockingInfo?.ReservePeriod * 3600 * 24 * 1000 + blockingInfo?.created - Date.now() > 0 ? (
              <Box
                ml={2}
                fontFamily="GRIFTER"
                display="flex"
                fontSize={20}
                style={{
                  textTransform: "uppercase",
                  letterSpacing: "0.09em",
                }}
              >
                <Box color="white" pr={1}>
                  Blocking expires in{" "}
                </Box>
                <Box className={classes.gradientText} fontFamily={"Rany"} fontWeight={800}>{`${
                  closeTime?.day || 0
                } day(s) ${closeTime?.hour || 0} hour(s) ${closeTime?.min || 0} min ${
                  closeTime?.seconds || 0
                } sec`}</Box>
              </Box>
            ) : blockingInfo?.PaidAmount == blockingInfo?.Price ? (
              <>
                <CheckIcon />
                <Box
                  ml={2}
                  fontFamily="Rany"
                  fontWeight={700}
                  className={classes.gradientText}
                  style={{
                    fontSize: "24px",
                    textTransform: "uppercase",
                  }}
                >
                  Blocking Paid
                </Box>
              </>
            ) : (
              <>
                <ClockIcon />
                <Box
                  ml={2}
                  fontFamily="Rany"
                  fontWeight={700}
                  className={classes.gradientText}
                  style={{
                    fontSize: "24px",
                    textTransform: "uppercase",
                  }}
                >
                  Blocking Expired
                </Box>
              </>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};

const ClockIcon = () => (
  <svg width="31" height="32" viewBox="0 0 31 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M13.7844 28.2425C14.6162 28.2417 15.4462 28.1656 16.2644 28.0153C16.9384 28.9209 17.7996 29.6706 18.7892 30.2137C19.7789 30.7567 20.8739 31.0802 21.9998 31.1623C23.1257 31.2443 24.256 31.083 25.3139 30.6892C26.3719 30.2954 27.3326 29.6785 28.1309 28.8802C28.9291 28.082 29.5461 27.1213 29.9399 26.0633C30.3336 25.0054 30.495 23.875 30.4129 22.7491C30.3309 21.6233 30.0073 20.5283 29.4643 19.5386C28.9213 18.5489 28.1715 17.6878 27.266 17.0137C27.775 14.2425 27.4178 11.3818 26.243 8.82087C25.0682 6.25992 23.1328 4.12317 20.7003 2.70142C18.2677 1.27968 15.4562 0.641991 12.6483 0.875157C9.84041 1.10832 7.17256 2.20102 5.00785 4.00452C2.84313 5.80802 1.28669 8.23473 0.550374 10.9544C-0.185946 13.674 -0.0663863 16.5545 0.892781 19.2038C1.85195 21.853 3.60413 24.1424 5.91086 25.7603C8.21759 27.3782 10.9668 28.2461 13.7844 28.2457V28.2425ZM22.5588 17.3625C23.7338 17.3625 24.8824 17.7109 25.8595 18.3636C26.8366 19.0162 27.5983 19.9439 28.0482 21.0294C28.4982 22.1149 28.6162 23.3094 28.3875 24.4619C28.1587 25.6144 27.5934 26.6733 26.7629 27.5046C25.9325 28.3359 24.8743 28.9024 23.722 29.1324C22.5697 29.3624 21.3751 29.2456 20.2891 28.7968C19.2032 28.348 18.2747 27.5874 17.621 26.611C16.9672 25.6346 16.6176 24.4864 16.6164 23.3113C16.6181 21.735 17.245 20.2237 18.3597 19.109C19.4743 17.9944 20.9856 17.3674 22.562 17.3657L22.5588 17.3625ZM7.72678 13.8073H12.9684V5.80733H14.8884V15.7273H7.72678V13.8073Z"
      fill="url(#paint0_linear_4453_31784)"
    />
    <defs>
      <linearGradient
        id="paint0_linear_4453_31784"
        x1="18.5782"
        y1="24.6532"
        x2="-5.64737"
        y2="9.75915"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#ED7B7B" />
        <stop offset="1" stop-color="#EDFF1C" />
      </linearGradient>
    </defs>
  </svg>
);

const CheckIcon = () => (
  <svg width="27" height="20" viewBox="0 0 27 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M3.25012 9.97619L9.93189 17L23.2501 3"
      stroke="url(#paint0_linear_4453_30896)"
      stroke-width="6"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <defs>
      <linearGradient
        id="paint0_linear_4453_30896"
        x1="15.4401"
        y1="13.9884"
        x2="3.02377"
        y2="3.08486"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#ED7B7B" />
        <stop offset="1" stop-color="#EDFF1C" />
      </linearGradient>
    </defs>
  </svg>
);
