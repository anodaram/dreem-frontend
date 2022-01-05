import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

import { claimPodModalStyles } from "./ClaimPodModal.styles";
import { Modal, PrimaryButton } from "shared/ui-kit";
import URL from "shared/functions/getURL";
import SignInModal from "components/Login/SignInModal";
import { RootState } from "store/reducers/Reducer";
import StyledCheckbox from "shared/ui-kit/Checkbox";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import Box from 'shared/ui-kit/Box';

export default function ClaimPodModal(props) {
  const classes = claimPodModalStyles();
  const userSelector = useSelector((state: RootState) => state.user);

  const [artistSelection, setArtistSelection] = useState<any>("");
  const [artist, setArtist] = useState<any>("");
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [profile1, setProfile1] = useState<string>("");
  const [profile2, setProfile2] = useState<string>("");

  const [openSignInModal, setOpenSignInModal] = useState<boolean>(false);
  const handleOpenSignInModal = () => {
    setOpenSignInModal(true);
  };
  const handleCloseSignInModal = () => {
    setOpenSignInModal(false);
  };

  const isSignedIn = () => {
    return !!localStorage.getItem("token");
  };

  useEffect(() => {
    if (!isSignedIn()) {
      handleOpenSignInModal();
    }
  }, []);

  useEffect(() => {
    setSubmitted(false);
    setArtist("");
    setProfile1("");
    setProfile2("");
  }, [props.triggerClose]);

  const handleSelectArtist = () => {
    setArtist(artistSelection);
  };

  const handleSubmit = () => {
    if (artist) {
      if (profile1 && profile2) {
        axios
          .post(`${URL()}/claimableSongs/claimPod`, {
            claimableSongId: props.selectedSong.id,
            userId: userSelector.id,
            artist: artist,
            url1: profile1,
            url2: profile2,
          })
          .then(response => {
            if (response.data.success) {
              setSubmitted(true);
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
  };

  return (
    <Modal
      size="medium"
      isOpen={props.open}
      onClose={props.handleClose}
      className={classes.modal}
      showCloseIcon
    >
      <div className={classes.modalContent}>
        {isSignedIn() ? (
          submitted ? (
            <Box display="flex" flexDirection="column" alignItems="center">
              <img src={require("assets/icons/community.png")} alt="mailbox" />
              <h3>Request Submitted</h3>
              <h5>{`Our staff at Privi willl be reviewing your profile.

                    We’ll let you know once the validation process has ended.`}</h5>
            </Box>
          ) : (
            <Box display="flex" flexDirection="column" alignItems="center">
              <img src={require("assets/icons/salute.png")} alt="salute" />
              <h3>{!artist ? "Claim This Pod as... " : "Claim This Pod"}</h3>
              <h5>
                {!artist
                  ? "Who of the following artist are you?"
                  : `Cool! It seems like you’re behind this amazing track.

                    In order to validate your identity you need to provide us with two social media profiles of your ownership.`}
              </h5>
              {!artist ? (
                <>
                  <div className={classes.artistList}>
                    {props.artists &&
                      props.artists.length > 0 &&
                      props.artists.map((a, index) => (
                        <div className={classes.artistTile} key={`artist-${index}`}>
                          <Box display="flex" alignItems="center">
                            <div
                              className={classes.artistImage}
                              style={{
                                backgroundImage:
                                  a.imageURL && a.imageURL !== ""
                                    ? `url(${a.imageURL})`
                                    : a.randomAvatar
                                      ? `url(${a.randomAvatar})`
                                      : a.randomAvatar, // "none"
                              }}
                            />
                            <span>{a}</span>
                          </Box>
                          <StyledCheckbox
                            checked={a === artistSelection}
                            onClick={() => {
                              setArtistSelection(a);
                            }}
                          />
                        </div>
                      ))}
                  </div>
                  <PrimaryButton
                    disabled={artistSelection === "" || !artistSelection}
                    size="medium"
                    onClick={handleSelectArtist}
                  >
                    Continue
                  </PrimaryButton>
                </>
              ) : (
                <>
                  <label>Profile 1</label>
                  <InputWithLabelAndTooltip
                    overriedClasses={classes.input}
                    type="text"
                    inputValue={profile1}
                    onInputValueChange={e => setProfile1(e.target.value)}
                    required
                  />
                  <label>Profile 2</label>
                  <InputWithLabelAndTooltip
                    overriedClasses={classes.input}
                    type="text"
                    inputValue={profile2}
                    onInputValueChange={e => setProfile2(e.target.value)}
                    required
                  />
                  <PrimaryButton
                    size="medium"
                    disabled={profile1 === "" || !profile1 || profile2 === "" || !profile2}
                    onClick={handleSubmit}
                  >
                    Submit Claim Request
                  </PrimaryButton>
                </>
              )}
            </Box>
          )
        ) : (
          <SignInModal open={openSignInModal} handleClose={handleCloseSignInModal} />
        )}
      </div>
    </Modal>
  );
}
