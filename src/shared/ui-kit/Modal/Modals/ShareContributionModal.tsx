import React, { useEffect, useRef, useState } from "react";
import ImageTitleDescription from "shared/ui-kit/Page-components/ImageTitleDescription";
import axios from "axios";
import URL from "shared/functions/getURL";
import { RootState } from "store/reducers/Reducer";
import { useSelector } from "react-redux";
import { createStyles, Dialog, makeStyles, Theme } from "@material-ui/core";
import FileUpload from "shared/ui-kit/Page-components/FileUpload";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    ShareContributionModal: {
      width: "100%",
      backgroundColor: "white",
      minHeight: "70vh",
      padding: "25px",
    },
    exit: {
      marginLeft: "auto",
    },
    header: {
      display: "flex",
      alignItems: "center",
      flexDirection: "row",

      "& h1": {
        fontSize: "22px",
      },
    },
    row: {
      display: "flex",
      flexDirection: "column",
      marginBottom: 30,
    },
    label: {
      fontSize: 18,
      fontWeight: 400,
    },
    input: {
      borderRadius: 6,
      height: 40,
      padding: "12px 20px",
      color: "#707582",
      border: "1px solid #727F9A",
    },
    messageBox: {
      borderRadius: 10,
      padding: "20px",
      minHeight: 250,
    },
    postButton: {
      width: "100%",
      backgroundColor: "#181818",
      color: "#FFF",
      fontWeight: 700,
      fontSize: 16,
      paddingTop: 10,
      paddingBottom: 10,
      display: "flex",
      justifyContent: "center",
    },
  })
);

const ShareContributionModal = (props: any) => {
  const userSelector = useSelector((state: RootState) => state.user);
  const classes = useStyles();

  const [photo, setPhoto] = useState<any>(null);
  const [photoImg, setPhotoImg] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const uploadImage = async id => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("image", photo, id);
      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };
      axios
        .post(`${URL()}/voting/changeVotingPhoto`, formData, config)
        .then(response => {
          resolve(true);
        })
        .catch(error => {
          console.log(error);

          resolve(true);
          // alert("Error uploading photo");
        });
    });
  };

  return (
    <>
      <div className={classes.ShareContributionModal}>
        <div className={classes.header}>
          <h1>Share Contribution On Community</h1>
          <div className={classes.exit} onClick={props.handleClose}>
            <img src={require("assets/icons/x_darkblue.png")} alt={"x"} />
          </div>
        </div>
        <div className={classes.row}>
          <div className={classes.row}>
            <InputWithLabelAndTooltip
              overriedClasses={classes.input}
              labelName="Title"
              type="text"
              inputValue={title}
              placeHolder="New contribution!"
            />
          </div>
          <div className={classes.row}>
            <label className={classes.label}>Featured Image</label>
            <FileUpload
              photo={photo}
              photoImg={photoImg}
              setterPhoto={setPhoto}
              setterPhotoImg={setPhotoImg}
              mainSetter={undefined}
              mainElement={undefined}
              type="image"
              canEdit={true}
            />
          </div>
          <div className={classes.row}>
            <label className={classes.label}>Message</label>
            <textarea
              className={classes.messageBox}
              value={message}
              placeholder="Thanks a lot Sabrina Spellman for this contribution of ETH 1.0025"
            />
          </div>
          <div className={classes.row}>
            <button className={classes.postButton} onClick={props.handlePostMessage}>
              Post Message
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShareContributionModal;
