import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import ImageTitleDescription from "shared/ui-kit/Page-components/ImageTitleDescription";
import axios from "axios";
import URL from "shared/functions/getURL";
import { RootState } from "store/reducers/Reducer";
import { useSelector } from "react-redux";
import { createStyles, Divider, makeStyles, Theme } from "@material-ui/core";
import FileUpload from "shared/ui-kit/Page-components/FileUpload";

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
      display: "flex",
      justifyContent: "flex-end"
    },
    headerIcon: {
      fontSize: 50,
      marginBottom: 30,
    },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",

      "& h1": {
        marginTop: 0,
        fontSize: "30px"
      }
    },
    row: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      marginBottom: 30
    },
    description: {
      fontSize: 18,
      fontWeight: 400,
      textAlign: "center",
      color: "#707582",
    },
    boldText: {
      fontWeight: 700
    },
    label: {
      fontSize: 14,
      fontWeight: "bold",
      margin: 0
    },
    input: {
      borderRadius: 6,
      height: 40,
      padding: "12px 20px",
      color: "#707582",
      border: "1px solid #727F9A"
    },
    messageBox: {
      borderRadius: 10,
      padding: "20px",
      minHeight: 400
    },
    buttons: {
      display: "flex",
      alignItems: "center",
      flexDirection: "row",
      marginBottom: "30px",
    },
    btnMessage: {
      backgroundColor: "#FFF",
      color: "#181818",
      fontWeight: 700,
      fontSize: 16,
      paddingTop: 10,
      paddingBottom: 10,
      display: "flex",
      justifyContent: "center",
      border: "1px solid #181818",
    },
    btnShare: {
      backgroundColor: "#181818",
      color: "#FFF",
      fontWeight: 700,
      fontSize: 16,
      paddingTop: 10,
      paddingBottom: 10,
      display: "flex",
      justifyContent: "center",
      marginLeft: "auto"
    },
    details: {
      display: "flex",
      flexDirection: "column",
      margin: "20px 0",
    },
    contributor: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      paddingTop: 20,
      paddingBottom: 20,
      borderBottom: "1px dashed #181818"
    },
    amount: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      paddingTop: 20,
      paddingBottom: 20,
    },
    amountValue: {
      color: "#707582",
      fontSize: 30,
      margin: 0,
      fontWeight: "normal",
      marginLeft: "auto",
    },
    userWrapper: {
      display: "flex",
      alignItems: "center",
      marginLeft: "auto",
      cursor: "pointer",
    },
    userInfo: {
      display: "flex",
      flexDirection: "column",
    },
    userName: {
      fontSize: 14,
      fontWeight: 700
    },
    userSlug: {
      fontSize: 14,
      fontWeight: 400,
      color: "#FF79D1",
    },
    userImage: {
      width: 40,
      height: 40,
      borderRadius: "50%",
      marginRight: 10,
      boxShadow: "-2px 7px 20px -9px rgb(148 148 148 / 66%)",
      border: "solid #fff 4px"
    }
  })
);

type UserInfo = {
  name: string;
  imageURL: string;
  urlSlug: string;
}

const CommunityContributionModal = (props: any) => {
  const history = useHistory();
  const userSelector = useSelector((state: RootState) => state.user);
  const classes = useStyles();

  const [photo, setPhoto] = useState<any>(null);
  const [photoImg, setPhotoImg] = useState<any>(null);
  const [user, setUser] = useState<UserInfo>({ name: '', imageURL: '', urlSlug: '' });

  const uploadImage = async (id) => {
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
        .then((response) => {
          resolve(true);
        })
        .catch((error) => {
          console.log(error);

          resolve(true);
        });
    });
  };

  useEffect(() => {
    async function fetchData() {
      const userId = props.userId;
      await axios
      .get(`${URL()}/user/getBasicInfo/${userId}`)
      .then((response) => {
        if (response.data.success) {
          let data = response.data.data;
          const newUser = Object.assign({}, user);
          newUser.name = data.name;
          if (data.anon != undefined && data.anon === false) {
            if (data.hasPhoto && data.url) {
              newUser.imageURL = `${data.url}?${Date.now()}`;
            }
          } else if (data.anonAvatar && data.anonAvatar.length > 0) {
            newUser.imageURL = `${require(`assets/anonAvatars/${data.anonAvatar}`)}`;
          }
          newUser.urlSlug = data.urlSlug;
          setUser(newUser);
        }
      })
      .catch((error) => {
        console.log(error);
        //alert('Error getting basic Info');
      });
    }

    fetchData();
  }, [props.userId]);

  return (
    <div className={classes.ShareContributionModal}>
      <div className={classes.exit} onClick={props.handleClose}>
        <img
          src={require("assets/icons/x_darkblue.png")}
          alt={"x"}
        />
      </div>
      <div className={classes.header}>
        <h2 className={classes.headerIcon}>🤑</h2>
        <h1>Community Contribution</h1>
      </div>
      <div className={classes.row}>
        <div className={classes.row}>
          <span className={classes.description}>
            Hey! It looks like someone really likes your community <br />
            <b className={classes.boldText}>{props.communityName}.</b>
          </span>
        </div>
        <div className={classes.details}>
          <Divider />
          <div className={classes.contributor}>
            <h3 className={classes.label}>Contributor</h3>
            <div className={classes.userWrapper} onClick={() => {history.push(`/profile/${props.userId}`)}}>
              <div
                className={classes.userImage}
                style={{
                  backgroundImage: user.imageURL && user.imageURL.length > 0 ? `url(${user.imageURL})` : "none",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div className={classes.userInfo}>
                <span className={classes.userName}>{user.name}</span>
                <span className={classes.userSlug}>@{user.urlSlug}</span>
              </div>
            </div>
          </div>
          <div className={classes.amount}>
            <h3 className={classes.label}>Contribution amount</h3>
            <h4 className={classes.amountValue}>{props.token} {props.amount}</h4>
          </div>
          <Divider />
        </div>
        <div className={classes.buttons}>
          <button className={classes.btnMessage}>Message Contributor</button>
          <button className={classes.btnShare} onClick={props.shareOnCommunity}>Share On Community!</button>
        </div>
      </div>
    </div >
  );
};

export default CommunityContributionModal;
