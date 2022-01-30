import React, { useEffect, useState, useRef } from "react";
import Box from "shared/ui-kit/Box";
import { Modal, PrimaryButton } from "shared/ui-kit";
import { useModalStyles } from "./index.styles";

const PublicOption = ({
  open,
  onClose,
  handleSelect,
  handleSubmit,
}: {
  open: boolean;
  onClose: () => void;
  handleSelect: (isPublic: boolean) => void;
  handleSubmit: () => void;
}) => {
  const classes = useModalStyles();
  const [type, setType] = useState<string>('');
  const [NFT, setNFT] = useState<string>("");

  return (
    <Box className={classes.backdrop}>
      <Modal showCloseIcon isOpen={open} onClose={onClose} className={classes.root} size="small" backTrans={false}>
        <div className={classes.modalContent}>
          <Box textAlign="center" mt={2.5}>
            <Box className={classes.title} mb={1}>
              Draft Privacy Settings
            </Box>
            <Box className={classes.description} mb={1}>
              Decide if your draft should be visible by all public or only to yourself.
            </Box>
          </Box>
          <div className={classes.inputGroup}>
            <div className={classes.inputBox}>
              <input
                name="radio-group"
                className={classes.input}
                id='public'
                type='radio'
                // value={title}
                onChange={e => handleSelect(e.target.value == 'on' ? true : false)}
              />
              <label htmlFor="public">Public</label>
              <div className="check"><div className="inside"></div></div>
            </div>
            <div className={classes.inputBox}>
              <input
                name="radio-group"
                className={classes.input}
                id='private'
                type='radio'
                onChange={e => {handleSelect(e.target.value == 'on' ? false : true)}}
              />
              <label htmlFor="private">Private</label>
              <div className="check"><div className="inside"></div></div>
            </div>
          </div>
          <Box display="flex" alignItems="center" justifyContent="center">
            <PrimaryButton size="medium" className={classes.confirmBtn} onClick={() => handleSubmit()}>
              confirm draft
            </PrimaryButton>
          </Box>
        </div>
      </Modal>
    </Box>
  );
};
export default PublicOption;
