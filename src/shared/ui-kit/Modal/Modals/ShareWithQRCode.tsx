import React from "react";
import QRCode from "qrcode.react";

import { shareQRCodeModalStyles } from "./ShareWithQRCode.styles";
import { Modal } from "shared/ui-kit";

const qrCodeIcon = require("assets/icons/qrcode.png");

export const ShareWithQRCode = ({ mediaId = null, shareLink, onClose, isOpen }: {
  mediaId?: any,
  shareLink: any,
  onClose: any,
  isOpen: any
}) => {
  const classes = shareQRCodeModalStyles();

  const [renderAs, setRenderAs] = React.useState<string>("svg");

  const downloadQRCode = isSVG => {
    if (isSVG) {
      setRenderAs("svg");
    } else {
      setRenderAs("canvas");
    }

    setTimeout(() => {
      processDownload(isSVG);
    }, 500);
  };

  const processDownload = isSVG => {
    let downloadLink = document.createElement("a");

    if (isSVG) {
      const svg = document.getElementById("qrCode");

      if (svg) {
        //get svg source.
        let serializer = new XMLSerializer();
        let source = serializer.serializeToString(svg!);
        //add name spaces.
        if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
          source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
        }
        if (!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
          source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
        }

        //add xml declaration
        source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
        //convert svg source to URI data scheme.
        let url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);
        //set url value to a element's href attribute.
        downloadLink.href = url;
        downloadLink.download = mediaId ? `${mediaId}.svg` : `share-qrcode.svg`;
      }
    } else {
      const qrCode = document.getElementById("qrCode") as HTMLCanvasElement;
      if (qrCode) {
        const pngUrl = qrCode!.toDataURL("image/png").replace("image/png", "image/octet-stream");
        downloadLink.href = pngUrl;
        downloadLink.download = mediaId ? `${mediaId}.png` : `share-qrcode.png`;
      }
    }

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <Modal size="medium" isOpen={isOpen} onClose={onClose} className={classes.root} showCloseIcon>
      <div className={classes.modalContent}>
        <div className={classes.mainContent}>
          <img src={qrCodeIcon} alt={"spaceship"} />
          <h3>Share With QR Code</h3>
          <h6>Download your QR code and use it a simple way to give others access to this media.</h6>
        </div>
        <div>
          <QRCode id="qrCode" value={shareLink} size={200} level={"H"} includeMargin renderAs={renderAs} />
          <div className={classes.downloadBox}>
            Download
            <div className={classes.download} onClick={() => downloadQRCode(true)}>
              SVG
            </div>
            <div className={classes.download} onClick={() => downloadQRCode(false)}>
              PNG
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
