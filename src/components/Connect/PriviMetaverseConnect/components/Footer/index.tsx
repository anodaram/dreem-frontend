import React from "react";

import { ReactComponent as YoutubeIcon } from "assets/snsIcons/youtube.svg";
import { ReactComponent as TwitterIcon } from "assets/snsIcons/twitter.svg";
import { ReactComponent as InstagramIcon } from "assets/snsIcons/instagram.svg";
import { ReactComponent as LinkedInIcon } from "assets/snsIcons/linkedin.svg";
import { ReactComponent as TiktokIcon } from "assets/snsIcons/tiktok.svg";
import { ReactComponent as MediaIcon } from "assets/snsIcons/media.svg";
import Box from "shared/ui-kit/Box";
import { footerStyles } from "./index.styles";
import {
  handleYoutubeLink,
  handleTwitterLink,
  handleInstagramLink,
  handleLinkedinLink,
  handleTiktokLink,
  handleMediumLink,
  handleHomeLink,
  handleAppsLink,
  handleCreatorsLink,
  handleLightPaperLink,
  handleTokenLink,
  handleKnowledgeHubLink,
  handleTermsAndConditionsLink,
} from "shared/constants/constants";

const Footer = () => {
  const classes = footerStyles();

  return (
    <Box width={1} className={classes.contentBox}>
      <Box className={classes.footerBox}>
        <Box ml={2}>
          <Box className={`${classes.title2} ${classes.findUs}`} mb={1}>
            Find US ON
          </Box>
          <Box className={classes.flexBox}>
            <Box className={classes.snsBox} onClick={handleYoutubeLink}>
              <YoutubeIcon width="26px"/>
            </Box>
            <Box className={classes.snsBox} onClick={handleTwitterLink}>
              <TwitterIcon />
            </Box>
            <Box className={classes.snsBox} onClick={handleInstagramLink}>
              <InstagramIcon />
            </Box>
          </Box>
          <Box className={classes.flexBox} mt={1}>
            <Box className={classes.snsBox} onClick={handleLinkedinLink}>
              <LinkedInIcon />
            </Box>
            <Box className={classes.snsBox} onClick={handleTiktokLink}>
              <TiktokIcon />
            </Box>
            <Box className={classes.snsBox} onClick={handleMediumLink}>
              <MediaIcon />
            </Box>
          </Box>
        </Box>
        <Box className={classes.footerTextWrapper}>
          <Box className={classes.title3}>Explore</Box>
          <Box className={classes.header1} mt={1} onClick={handleHomeLink} style={{ cursor: "pointer" }}>
            Home
          </Box>
          <Box className={classes.header1} mt={1} onClick={handleAppsLink} style={{ cursor: "pointer" }}>
            Apps
          </Box>
          <Box className={classes.header1} mt={1} onClick={handleCreatorsLink} style={{ cursor: "pointer" }}>
            For Creators
          </Box>
        </Box>
        <Box className={classes.footerTextWrapper}>
          <Box className={classes.title3}>Learn</Box>
          <Box
            className={classes.header1}
            mt={2}
            onClick={handleLightPaperLink}
            style={{ cursor: "pointer" }}
          >
            Lightpaper
          </Box>
          <Box className={classes.header1} mt={1} onClick={handleTokenLink} style={{ cursor: "pointer" }}>
            Token Economy
          </Box>
          <Box
            className={classes.header1}
            mt={1}
            onClick={handleKnowledgeHubLink}
            style={{ cursor: "pointer" }}
          >
            Knowledge Hub
          </Box>
          <Box
            className={classes.header1}
            mt={1}
            onClick={handleTermsAndConditionsLink}
            style={{ cursor: "pointer" }}
          >
            Terms & Conditions
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
