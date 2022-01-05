import React, { useState } from "react";
import styled from "styled-components";
import TableHead from "@material-ui/core/TableHead";
import TableCell from "@material-ui/core/TableCell";
import { Color, FontSize, grid } from "shared/constants/const";
import axios from "axios";
import URL from "shared/functions/getURL";
import { useSelector } from "react-redux";
import { RootState } from "store/reducers/Reducer";
import { Modal } from "shared/ui-kit";
import { DAOButton } from "shared/ui-kit/Buttons/DAOButton";

const CounterOfferModal = ({
  open,
  onClose,
  selectedMedia,
  fromType,
  setMedia,
  theme,
}: {
  open: boolean;
  onClose: () => void;
  selectedMedia: any;
  fromType: any;
  setMedia: any;
  theme?: "dark" | "light";
}) => {
  const userSelector = useSelector((state: RootState) => state.user);

  const [counterOffer, setCounterOffer] = useState<any>(null);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [disableButton, setDisableButton] = useState<boolean>(false);

  const handleClickSuccess = () => {
    setOpenSuccess(true);
    setTimeout(() => {
      setOpenSuccess(false);
    }, 4000);
  };
  const handleClickError = () => {
    setOpenError(true);
    setTimeout(() => {
      setOpenError(false);
    }, 4000);
  };

  const handleCloseSuccess = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSuccess(false);
  };
  const handleCloseError = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenError(false);
  };

  const submitCounterOffer = () => {
    setDisableButton(true);
    axios
      .post(`${URL()}/mediaOnCommunity/newOffer/${selectedMedia.id}/${userSelector.id}`, {
        offer: counterOffer,
        from: fromType,
        status: "Pending",
      })
      .then(response => {
        if (response.data.success) {
          let data = response.data.data;
          setMedia(data);
          handleClickSuccess();

          onClose();
        } else {
          setErrorMsg(response.data.error);
          handleClickError();
        }
        setDisableButton(false);
      })
      .catch(error => {
        console.log(error);
        setDisableButton(false);
        setErrorMsg("Error making the request");
        handleClickError();
      });
  };

  return (
    <OfferModal size="small" isOpen={open} onClose={onClose} theme={theme}>
      <ModalContent theme={theme}>
        <ModalHeader>
          <ModalHeading>Make Counter Offer</ModalHeading>
        </ModalHeader>

        <CounterModalBody>
          <CounterRowBorder>
            <H5Heading>Current Offer</H5Heading>
            <GrayText theme={theme}>
              {selectedMedia.currentOffer && selectedMedia.currentOffer.offer
                ? selectedMedia.currentOffer.offer
                : selectedMedia.oldOffers[selectedMedia.oldOffers.length - 1] &&
                  selectedMedia.oldOffers[selectedMedia.oldOffers.length - 1].offer
                ? selectedMedia.oldOffers[selectedMedia.oldOffers.length - 1].offer
                : 0}
              %
            </GrayText>
          </CounterRowBorder>
          <CounterRow>
            <H5Heading>Counter Offer</H5Heading>
            <CountInput
              theme={theme}
              type="number"
              placeholder="10%"
              onChange={e => setCounterOffer(e.target.value)}
              value={counterOffer}
            />
          </CounterRow>
        </CounterModalBody>

        <ModalFooter>
          {theme && theme === "dark" ? (
            <DAOButton onClick={() => onClose()}>Cancel</DAOButton>
          ) : (
            <WhiteButton onClick={() => onClose()}>Cancel</WhiteButton>
          )}
          {theme && theme === "dark" ? (
            <DAOButton onClick={() => submitCounterOffer()} disabled={disableButton}>
              Submit Counter Offer
            </DAOButton>
          ) : (
            <BlackButton onClick={() => submitCounterOffer()} disabled={disableButton}>
              Submit Counter Offer
            </BlackButton>
          )}
        </ModalFooter>
      </ModalContent>
    </OfferModal>
  );
};

export default CounterOfferModal;

type CountInputProps = {
  theme?: "dark" | "light";
};
const CountInput = styled.input<CountInputProps>`
  text-align: left;
  height: 40px;
  width: 230px;
  color: ${p => (p.theme && p.theme === "dark" ? "white" : "#181818")};
  padding: ${p => (p.theme && p.theme === "dark" ? "16px" : "auto")};
  background: ${p => (p.theme && p.theme === "dark" ? "rgba(255, 255, 255, 0.16)" : "white")};
  border: ${p => (p.theme && p.theme === "dark" ? "1px solid #FFFFFF" : "1px solid rgba(224, 228, 243, 1)")};
  &:placeholder-shown {
    background: ${p => (!p.theme ? "#f7f9fe" : "transparent")};
  }
`;

const H5Heading = styled.h5`
  font-size: 18px;
  margin: 0px;
`;

const GrayText = styled.span<CountInputProps>`
  color: ${p => (p.theme && p.theme === "dark" ? "white" : "#707582")};
`;

const OfferModal = styled(Modal)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

type ModalContentProps = React.PropsWithChildren<{
  theme?: "dark" | "light";
}>;

const ModalContent = styled.div<ModalContentProps>`
  background: ${p => (!p.theme ? "white" : "transparent")};
  padding: ${p => (!p.theme ? "25px 24px" : "0px")};
  box-shadow: 0px 2px 14px rgb(0 0 0 / 8%);
  border-radius: ${p => (!p.theme ? "14px" : "0px")};
  color: ${p => (p.theme && p.theme === "dark" ? "white !important" : "auto")};
`;

const ModalHeading = styled.div`
  font-weight: 700;
  font-size: 22px;
`;

const ModalHeader = styled.div`
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const WhiteButton = styled.button`
  border: 1px solid rgba(112, 117, 130, 1);
  color: black;
  padding: 3px 20px;
  background: white;
  border-radius: 6px;
`;
const BlackButton = styled.button`
  border-radius: 6px;
`;

const ModalFooter = styled.div`
  margin-top: 47px;
  display: flex;
  justify-content: space-between;
`;

const CounterRowBorder = styled.div`
  border-bottom: 0px !important;
  padding: 34px 0px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 50px;
`;

const CounterRow = styled.div`
  padding: 34px 0px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 50px;
`;

const CounterModalBody = styled.div`
  border-top: 1px solid rgba(24, 24, 24, 1);
  border-bottom: 1px solid rgba(24, 24, 24, 1);
  padding: 0px;
`;
