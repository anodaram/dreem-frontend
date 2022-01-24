import React from "react";

import { Modal } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { BorderLinearProgress } from "components/PriviMetaverse/components/LinearProgress";
import { fileUploadingModalStyles } from "./index.styles";

const FileUploadingOfCreatingModal = (props: any) => {
  const classes = fileUploadingModalStyles();

  return (
    <Modal size="medium" isOpen={props.open} onClose={props.handleClose} className={classes.root}>
      <Box className={classes.modalContent}>
        <Box style={{ position: "relative" }}>
          <img
            src={require("assets/metaverseImages/new_file_upload.png")}
            alt="file uploading"
            className={classes.uploadImg}
          />
          <Box className={`${classes.point} ${classes.move1}`} />
          <Box className={`${classes.point} ${classes.move2}`} />
          <Box className={`${classes.point} ${classes.move3}`} />
          <Box className={`${classes.point} ${classes.move4}`} />
          <Box className={`${classes.point} ${classes.move5}`} />
          <Box className={`${classes.point} ${classes.move6}`} />
        </Box>
        {/* <BorderLinearProgress
          variant="determinate"
          value={Math.floor(props.progress)}
          style={{ width: "80%", border: "2px solid #EEFF21" }}
        /> */}
        {/* <Box className={classes.progressValue} pt={2}>
          {props.progress}%
        </Box> */}
        <Box className={classes.uploading}>{props.isUpload ? "Uploading..." : "Downloading"}</Box>
        <Box className={classes.description} py={2}>
          {props.isUpload
            ? "Your file is being uploaded to decentralised storage right now. Please wait."
            : "Your file is being uploaded right now. Please wait."}
        </Box>
      </Box>
    </Modal>
  );
};

export default FileUploadingOfCreatingModal;
