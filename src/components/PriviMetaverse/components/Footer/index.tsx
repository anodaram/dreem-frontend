import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "shared/contexts/AuthContext";

// import { ReactComponent as YoutubeIcon } from "assets/snsIcons/youtube.svg";
import { ReactComponent as TwitterIcon } from "assets/snsIcons/twitter.svg";
// import { ReactComponent as InstagramIcon } from "assets/snsIcons/instagram.svg";
// import { ReactComponent as LinkedInIcon } from "assets/snsIcons/linkedin.svg";
// import { ReactComponent as TiktokIcon } from "assets/snsIcons/tiktok.svg";
// import { ReactComponent as MediaIcon } from "assets/snsIcons/media.svg";
// import { ReactComponent as DiscordIcon } from "assets/snsIcons/discord.svg";
import { ReactComponent as TelegramIcon } from "assets/snsIcons/telegram.svg";
import { ReactComponent as WhatsappIcon } from "assets/snsIcons/whatsapp.svg";
// import { ReactComponent as GitbookIcon } from "assets/snsIcons/gitbook.svg";
// import { ReactComponent as MediumIcon } from "assets/snsIcons/medium.svg";
// import { ReactComponent as JuiceLogoIcon } from "assets/logos/juice_logo.svg";
import Box from "shared/ui-kit/Box";
import { footerStyles } from "./index.styles";

import {
  // handleDiscordLink,
  handleTelegramLink,
  // handleYoutubeLink,
  handleTwitterLink,
  handleWhatsappLink,
  // handleInstagramLink,
  // handleLinkedinLink,
  // handleTiktokLink,
  // handleMediumLink,
  // handleAboutLink,
  // handleGitbookLink,
  // handleNewsletterLink,
  // handleWyrtNFTLink,
  // handleClaimIDOTokenLink,
  // handleTermsAndConditionsLink,
} from "shared/constants/constants";

const Footer = () => {
  const classes = footerStyles();

  const { isSignedin } = useAuth();

  return (
    <Box className={classes.bottomBox}>
      <Box className={`${classes.contentBox} ${classes.fitContent}`}>
        <img
          className={classes.image}
          src={require("assets/metaverseImages/dreem_seed_image.png")}
          alt="seed"
          width={380}
        />
        <Box className={classes.left}>
          <Box display="flex" flexDirection="column">
            <Box className={classes.title1}>DREEM</Box>
            <Box className={classes.title2} my={3}>
              Find US ON
            </Box>
            <Box className={classes.flexBox}>
              <Box className={classes.snsBox} onClick={handleTelegramLink}>
                <TelegramIcon />
              </Box>
              <Box className={classes.snsBox} onClick={handleTwitterLink}>
                <TwitterIcon />
              </Box>
              <Box className={classes.snsBox} onClick={handleWhatsappLink}>
                <WhatsappIcon />
              </Box>
              {/* <Box className={classes.snsBox} onClick={handleYoutubeLink}>
                <YoutubeIcon width="26px" />
              </Box>
              <Box className={classes.snsBox} onClick={handleMediumLink}>
                <MediumIcon />
              </Box> */}
            </Box>
            <Box className={classes.flexBox} mt={2}>
              {/* <Box className={classes.snsBox} onClick={handleDiscordLink}>
                <DiscordIcon />
              </Box>
              <Box className={classes.snsBox} onClick={handleInstagramLink}>
                <InstagramIcon />
              </Box>
              <Box className={classes.snsBox} onClick={handleGitbookLink}>
                <GitbookIcon />
              </Box> */}
            </Box>
          </Box>
          <div className={classes.descriptionBox}>
            {Navigator.map((nav, index) =>
              nav.authorize && !isSignedin ? (
                <></>
              ) : (
                <Link to={nav.link} key={`nav-bottom-${index}`} className={classes.header1}>
                  {nav.name}
                </Link>
              )
            )}
          </div>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;

type NavItem = {
  name: string;
  value: string;
  link: string;
  authorize?: boolean;
};

const Navigator: NavItem[] = [
  { name: "PLAY", value: "play", link: "/play" },
  { name: "CREATE", value: "creations", link: "/create" },
  { name: "REALMS", value: "realms", link: "/realms" },
  { name: "AVATARS", value: "avatars", link: "/avatars" },
  { name: "GAME NFTS", value: "gameNFTS", link: "/gameNFTS" },
  // { name: "METAVERSE", value: "metaverse", link: "/metaverse" },
  // { name: "Claim Dreem", value: "claim_dreem", link: "/claim_dreem", authorize: true },
];
