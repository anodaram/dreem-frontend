import React, { useState } from "react";

import { useMediaQuery, useTheme } from "@material-ui/core";

import { Modal, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import EditNFTDraftTab from "./components/EditNFTDraft";
import EditRoyaltiesDraftTab from "./components/EditRoyaltiesDraft";
import EditFilesDraftTab from "./components/EditFilesDraft";
import EditCollectionDraftTab from "./components/EditCollectionDraft";
import { useModalStyles } from "./index.styles";

const Tabs = ["NFT", "Royalties", "Files", "Collection"];

const EditDraftContentModal = ({ open, onClose }) => {
  const classes = useModalStyles();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean[]>([]);

  const handlePage = (index: number) => {
    const newComplete = [...completed];
    setSelectedTab(prev => {
      if (index > prev) {
        if (index > 0) {
          newComplete[0] = true;
          setCompleted(newComplete);
        }
        if (index > 1) {
          newComplete[1] = true;
          setCompleted(newComplete);
        }
        if (index > 2) {
          newComplete[2] = true;
          setCompleted(newComplete);
        }
      }
      return index;
    });
  };

  return (
    <Modal size="medium" isOpen={open} onClose={onClose} showCloseIcon className={classes.root}>
      <Box className={classes.modalContent}>
        <Box className={classes.header1} mt={3}>
          Edit NFT Draft
        </Box>
        <Box className={classes.tabSection}>
          <div className={classes.stepsBorder} />
          <div className={classes.steps}>
            {Tabs.map((tab, index) => (
              <div
                className={index <= selectedTab ? classes.selected : undefined}
                key={`tab-${index}`}
                style={{ position: "relative" }}
              >
                {index <= selectedTab &&
                  (completed[index] ? (
                    <div className={classes.tick}>
                      <SuccessIcon />
                    </div>
                  ) : (
                    <div className={classes.tick}>
                      <FailedIcon />
                    </div>
                  ))}

                <button
                  onClick={() => {
                    handlePage(index);
                  }}
                >
                  <div>{index + 1}</div>
                </button>
                <span>{tab}</span>
              </div>
            ))}
          </div>
        </Box>
        <div className={classes.divider} />
        <Box className={classes.mainSection}>
          {selectedTab === 0 && <EditNFTDraftTab />}
          {selectedTab === 1 && <EditRoyaltiesDraftTab />}
          {selectedTab === 2 && <EditFilesDraftTab />}
          {selectedTab === 3 && <EditCollectionDraftTab />}
          <Box className={classes.footerSection}>
            <SecondaryButton
              size="medium"
              style={{
                height: 48,
                background: "transparent",
                border: "2px solid #fff",
                borderRadius: "100px",
                color: "#fff",
                fontSize: 18,
                paddingTop: 4,
              }}
            >
              Cancel
            </SecondaryButton>
            <PrimaryButton
              size="medium"
              style={{
                height: 48,
                width: 270,
                background: "linear-gradient(92.31deg, #EEFF21 -2.9%, #B7FF5C 113.47%)",
                borderRadius: "100px",
                fontSize: 18,
                paddingTop: 4,
                color: "#212121",
              }}
            >
              Save Changes
            </PrimaryButton>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditDraftContentModal;

const SuccessIcon = () => (
  <svg width="12" height="9" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M11.0001 1L4.00004 8.00002L1 5"
      stroke="#E9FF26"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const FailedIcon = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M15 1L1 15M1.00001 1L15 15"
      stroke="#FF6868"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
