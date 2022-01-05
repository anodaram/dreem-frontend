import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import React from "react";
import { useSelector } from "react-redux";
import { Avatar, Gradient, Modal } from "shared/ui-kit";
import { getUsersInfoList } from "store/selectors";

import URL from "shared/functions/getURL";
import { DAOButton } from "shared/ui-kit/Buttons/DAOButton";
import { TitleGrandLight } from "shared/ui-kit/Icons/progressIcons/index.styles";

const useStyles = makeStyles(theme => ({
  content: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    textAlign: "center",
    color: "white",
    fontSize: "14px",
  },
  imgContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing(2),
  },
  description: {
    marginBottom: theme.spacing(2),
    textAlign: "justify",
    fontSize: "14px",
    lineHeight: "21px",
  },
  fullDetailButton: {
    marginBottom: theme.spacing(2),
    textAlign: "center",
    background: Gradient.BlueMagenta,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  buttonsBox: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
}));

const RequestedJoinDAOModal = ({ open, userId, CommunityAddress, onCloseDialog }) => {
  const classes = useStyles();
  const users = useSelector(getUsersInfoList);

  const [user, setUser] = React.useState<any>();

  React.useEffect(() => {
    if (users && users.length > 0) {
      setUser(users.find(item => item.id === userId));
    }
  }, [users]);

  const onAccept = () => {
    const body = {
      userAddress: userId,
      communityAddress: CommunityAddress,
      accepted: true,
    };

    axios.post(`${URL()}/community/join`, body).then(res => {
      const resp = res.data;
      if (resp.success) {
        onCloseDialog();
      } else {
      }
    });
  };

  return (
    <Modal size="small" isOpen={open} onClose={onCloseDialog} showCloseIcon theme="dark">
      <div className={classes.content}>
        <div className={classes.imgContainer}>
          <Avatar size="medium" url={`${user?.imageURL}`} />
        </div>
        <TitleGrandLight fontSize="18px" disableUppercase mb={"16px"}>
          {user?.name}
        </TitleGrandLight>

        <div className={classes.description}>{user?.bio}</div>

        <div className={classes.fullDetailButton}>View Full Profile</div>
        <div className={classes.buttonsBox}>
          <DAOButton onClick={onCloseDialog}>Decline</DAOButton>
          <DAOButton onClick={onAccept}>Accept</DAOButton>
        </div>
      </div>
    </Modal>
  );
};

export default RequestedJoinDAOModal;
