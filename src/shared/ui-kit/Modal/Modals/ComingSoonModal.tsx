import React from "react";
import { Modal } from "@material-ui/core";
import "./ComingSoonModal.css";

// const instagramHexagon = require('assets/snsIcons/instagram.png');
// const twitterHexagon = require('assets/snsIcons/twitter.png');
// const telegramIcon = require('assets/snsIcons/telegram.png');
// const linkedinIcon = require('assets/snsIcons/linkedin.png');
// const webpageIcon = require('assets/snsIcons/webpage.png');
const priviLogo = require("assets/logos/PRIVILOGO.png");

const ComingSoon = (props) => {
  return (
    <Modal
      className="modalCampaign coming-soon-modal"
      open={props.open}
      onClose={props.handleClose}
      style={{
        height: props.height ? props.height : "91%",
        marginLeft: props.marginLeft ? props.marginLeft : 80,
        marginTop: props.marginTop ? props.marginTop : 80,
        overflowY: "hidden",
        maxHeight: props.maxHeight ? props.maxHeight : "auto",
        width: props.width ? props.width : "auto",
      }}
    >
      <div className="smokescreen-content">
        <img src={priviLogo} width={400} height={400} alt={"privi"} />
        <p>COMING SOON</p>
        {/* <div style={{display: "inline-flex"}}>
            <a
              className="rrssProfileLink"
              href={'https://twitter.com/priviprotocol?lang=en'}
              target="_blank"
            >
              <img src={twitterHexagon} width={40} height={40} style={{margin: 15, cursor: "pointer"}} />
            </a>
            <a
              className="rrssProfileLink"
              href={'https://www.instagram.com/priviprotocol/'}
              target="_blank"
            >
             <img src={instagramHexagon} width={40} height={40} style={{margin: 15, cursor: "pointer"}} />
            </a>
            <a
              className="rrssProfileLink"
              href={'https://t.me/protocolprivi'}
              target="_blank"
            >
              <img src={telegramIcon} width={40} height={40} style={{margin: 15, cursor: "pointer"}} />
            </a>
            <a
              className="rrssProfileLink"
              href={'https://www.linkedin.com/company/privi-protocol/'}
              target="_blank"
            >
              <img src={linkedinIcon} width={40} height={40} style={{margin: 15, cursor: "pointer"}} />
            </a>
            <a
              className="rrssProfileLink"
              href={'https://www.privi.store/'}
              target="_blank"
            >
              <img src={webpageIcon} width={40} height={40} style={{margin: 15, cursor: "pointer"}} />
            </a>

            </div> */}
      </div>
    </Modal>
  );
};

export default ComingSoon;
