import React, { useEffect, useState } from "react";
import Axios from "axios";
import { makeStyles } from "@material-ui/core/styles";

import StyledCheckbox from "shared/ui-kit/Checkbox";
import { useTypedSelector } from "store/reducers/Reducer";
import { TokenSelect } from "shared/ui-kit/Select/TokenSelect";
import URL from "shared/functions/getURL";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { Modal, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";

const createPlaylistModalStyles = makeStyles(() => ({
  root: {
    width: "600px !important",
  },
  modalContent: {
    padding: "20px 30px",
  },
  mainContent: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    "& h2": {
      margin: 0,
      marginBottom: 30,
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: 30,
      lineHeight: "104.5%",
    },
    "& .label": {
      display: "flex",
      flexDirection: "column",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: 18,
      marginBottom: 25,
      width: "100%",
      "&:first-child": {
        marginBottom: 40,
      },
      "& .selector": {
        background: "#f7f8fa",
        border: "1px solid #99a1b3",
        borderRadius: 11.36,
        padding: "20px 22px",
        color: "#6b6b6b",
        fontWeight: 400,
        fontSize: 16,
        marginTop: 8,
        "&::placeholder": {
          color: "#99a1b3",
        },
      },
    },
  },
  radio: {
    alignItems: "center",
    color: "#6b6b6b",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: 16,
    marginBottom: 25,
    "& span": {
      padding: 0,
      marginRight: 9.5,
      color: "#99a1b3",
    },
  },
  price: {
    transition: "all 0.25",
    marginBottom: 35,
  },
  row: {
    display: "flex",
    "& input": {
      height: 46,
      marginRight: 12,
      outline: "none",
    },
  },
  buttons: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  inputContainer: {
    width: "100%",
    marginBottom: "16px",
  },
}));

const CreatePlaylistModal = (props: any) => {
  const classes = createPlaylistModalStyles();
  //STORE
  const user = useTypedSelector(state => state.user);

  //HOOKS
  const [playlist, setPlaylist] = useState({
    Name: "",
    Description: "",
    Private: false,
    Token: "",
    Price: 0,
  });

  const [tokenObjs, setTokenObjs] = useState<any[]>([
    { token: "ETH", name: "Ethereum" },
    { token: "PRIVI", name: "Privi Coin" },
    { token: "BC", name: "Base Coin" },
    { token: "DC", name: "Data Coin" },
  ]);

  const [status, setStatus] = useState<any>("");

  useEffect(() => {
    if (props.open === true) {
      Axios.get(`${URL()}/wallet/getCryptosRateAsList`).then(res => {
        const resp = res.data;
        if (resp.success) {
          const tokenObjList: any[] = [];
          const data = resp.data;
          data.forEach(rateObj => {
            tokenObjList.push({ token: rateObj.token, name: rateObj.name });
          });
          const playlistCopy = { ...playlist };
          playlistCopy.Token = tokenObjList[0].token;
          setPlaylist(playlistCopy);

          setTokenObjs(tokenObjList);
        }
      });
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.open]);

  /*----------------- CREATE PLAYLIST FUNCTION -------------------*/
  const handleCreatePlaylist = () => {
    const body: any = {
      Creator: user.id,
      Title: playlist.Name,
      Description: playlist.Description,
      Price: playlist.Price,
      Token: playlist.Token,
      Private: playlist.Private,
    };

    if (validate()) {
      Axios.post(`${URL()}/media/createPlaylist`, body).then(res => {
        const resp = res.data;
        if (resp.success) {
          setStatus({
            msg: "Request success",
            key: Math.random(),
            variant: "success",
          });
          setTimeout(() => {
            if (props.update) props.update();
            props.handleClose();
            setPlaylist({
              Name: "",
              Description: "",
              Private: false,
              Token: "",
              Price: 0,
            });
          }, 500);
        }
      });
    }
  };

  function validate() {
    if (playlist.Name === null || playlist.Name === "") {
      setStatus({
        msg: "Name required",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (playlist.Description === null || playlist.Description === "") {
      setStatus({
        msg: "Description required",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if ((playlist.Private && playlist.Token === null) || playlist.Token === "") {
      setStatus({
        msg: "Token required",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (playlist.Private && playlist.Price === null) {
      setStatus({
        msg: "Price required",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else if (playlist.Private && playlist.Price <= 0) {
      setStatus({
        msg: "Price can't be negative nor 0",
        key: Math.random(),
        variant: "error",
      });
      return false;
    } else return true;
  }

  /*---------------- CREATE PLAYLIST MODAL COMPONENT--------------*/
  return (
    <Modal
      size="small"
      isOpen={props.open}
      onClose={props.handleClose}
      showCloseIcon
      className={classes.root}
    >
      <div className={classes.modalContent}>
        <div className={classes.mainContent}>
          <h2>Create new Video Playlist</h2>
          <div className={classes.inputContainer}>
            <InputWithLabelAndTooltip
              labelName="Title"
              inputValue={playlist.Name}
              onInputValueChange={e => {
                const playlistCopy = { ...playlist };
                playlistCopy.Name = e.target.value;
                setPlaylist(playlistCopy);
              }}
              required
              placeHolder={`Enter your art name here`}
              type="text"
            />
          </div>
          <div className={classes.inputContainer}>
            <InputWithLabelAndTooltip
              labelName="Description"
              inputValue={playlist.Description}
              onInputValueChange={e => {
                const playlistCopy = { ...playlist };
                playlistCopy.Description = e.target.value;
                setPlaylist(playlistCopy);
              }}
              required
              placeHolder={`Enter your art decription here`}
            />
          </div>
          <div className="label">
            <div className={classes.radio}>
              <StyledCheckbox
                buttonType="circle"
                checked={playlist.Private}
                onChange={() => {
                  const playlistCopy = { ...playlist };
                  playlistCopy.Private = !playlist.Private;
                  setPlaylist(playlistCopy);
                }}
              />
              Make this playlist private
            </div>
          </div>

          {playlist.Private && (
            <div className="label">
              <div className={classes.price} style={{ marginBottom: playlist.Private ? 0 : "-20px" }}>
                Price
                <div className={classes.row}>
                  <InputWithLabelAndTooltip
                    inputValue={`${playlist.Price}`}
                    onInputValueChange={e => {
                      const playlistCopy = { ...playlist };
                      playlistCopy.Price = Number(e.target.value);
                      setPlaylist(playlistCopy);
                    }}
                    type={"number"}
                    minValue={"0.001"}
                  />

                  <div style={{ marginTop: "8px", marginLeft: '8px', width: "100%" }}>
                    <TokenSelect
                      tokens={tokenObjs}
                      value={playlist.Token || tokenObjs[0].token}
                      onChange={e => {
                        const value: any = e.target.value;
                        const playlistCopy = { ...playlist };
                        playlistCopy.Token = value;
                        setPlaylist(playlistCopy);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className={classes.buttons}>
            <SecondaryButton size="medium" onClick={props.handleClose}>
              Back
            </SecondaryButton>
            <PrimaryButton size="medium" onClick={handleCreatePlaylist}>
              Create
            </PrimaryButton>
          </div>
        </div>
        {status && (
          <AlertMessage
            key={status.key}
            message={status.msg}
            variant={status.variant}
            onClose={() => setStatus(undefined)}
          />
        )}
      </div>
    </Modal>
  );
};

export default CreatePlaylistModal;
