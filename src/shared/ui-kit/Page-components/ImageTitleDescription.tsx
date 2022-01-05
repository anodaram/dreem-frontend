import React, { Dispatch } from "react";
import Grid from "@material-ui/core/Grid";

import { imageTitleDescriptionStyles } from "./ImageTitleDescription.styles";

import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as CloseSolid } from "assets/icons/close-solid.svg";
import Box from "shared/ui-kit/Box";
import { Color } from "shared/constants/const";

const infoIcon = require("assets/icons/info_gray.png");
const infoIconWhite = require("assets/icons/info_white.png");
const imageIcon = require("assets/icons/image_icon.png");
const imageIconDark = require("assets/icons/image_icon_dark.png");
const imageIconWhite = require("assets/icons/image_icon_white.png");
const imageIconGreen = require("assets/icons/image_icon_green.png");

type ImageTitleDescriptionProps = React.PropsWithChildren<{
  setterPhoto: (e) => void | Dispatch<any> | any;
  setterPhotoImg: (e) => void | Dispatch<any> | any;
  photoImg: any;
  setterHasPhoto?: (e) => void | Dispatch<any> | any;
  mainElement?: any;
  mainSetter?: (e) => void | Dispatch<any> | any;
  theme?: "dark" | "light" | "green";
  canEdit?: boolean;
  title: string | any;
  titleTitle?: string;
  setterTitle: (e) => void | Dispatch<any> | any;
  titlePlaceholder?: string;
  descTitle?: string;
  desc: string | any;
  setterDesc: (e) => void | Dispatch<any> | any;
  descPlaceholder?: string;
  photoTitle?: string;
  closeIconRightPx?: number;
  imageSize?: number;
  infoSize?: number;
  variant?: string;
}>;

const ImageTitleDescription = ({
  setterPhoto,
  setterPhotoImg,
  photoImg,
  setterHasPhoto,
  mainElement,
  mainSetter,
  theme,
  canEdit,
  title,
  titleTitle,
  setterTitle,
  titlePlaceholder,
  desc,
  descTitle,
  setterDesc,
  descPlaceholder,
  photoTitle,
  closeIconRightPx,
  imageSize,
  infoSize,
  variant = "primary"
}: ImageTitleDescriptionProps) => {
  const classes = imageTitleDescriptionStyles();

  const dragOver = e => {
    e.preventDefault();
  };

  const dragEnter = e => {
    e.preventDefault();
  };

  const dragLeave = e => {
    e.preventDefault();
  };

  const fileDrop = e => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length) {
      handleFiles(files);
    }
  };

  const fileInput = e => {
    e.preventDefault();
    const files = e.target.files;
    if (files.length) {
      handleFiles(files);
    }
  };

  const handleFiles = (files: any) => {
    for (let i = 0; i < files.length; i++) {
      if (validateFile(files[i])) {
        onPhotoChange(files);
      } else {
        files[i]["invalid"] = true;
        // Alert invalid image
      }
    }
  };

  const validateFile = file => {
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/x-icon"];
    if (validTypes.indexOf(file.type) === -1) {
      return false;
    }
    return true;
  };

  const onPhotoChange = (files: any) => {
    setterPhoto(files[0]);
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      setterPhotoImg(reader.result);
      if (setterHasPhoto) {
        setterHasPhoto(true);
      }

      let image = new Image();

      if (
        mainElement &&
        mainSetter &&
        reader.result !== null &&
        (typeof reader.result === "string" || reader.result instanceof String)
      ) {
        image.src = reader.result.toString();

        //save dimensions
        image.onload = function () {
          let height = image.height;
          let width = image.width;

          const elementCopy = mainElement;
          elementCopy.dimensions = { height: height, width: width };
          mainSetter(elementCopy);

          return true;
        };
      }
    });
    reader.readAsDataURL(files[0]);
  };

  const removeImage = () => {
    setterPhoto(null);
    setterPhotoImg(null);
    if (setterHasPhoto !== undefined) {
      setterHasPhoto(false);
    }
  };

  return (
    <Grid
      container
      direction={imageSize === 12 ? "column" : "row"}
      justify="flex-start"
      alignItems="stretch"
      spacing={theme && theme === "dark" ? 3 : 0}
    >
      {variant === "primary" && (
        <Grid
          item={true}
          xs={12}
          md={imageSize === 12 ? 12 : 6}
          style={{ paddingRight: imageSize === 12 || (theme && theme === "dark") ? "auto" : 10 }}
        >
          <Box display="flex" alignItems="center">
            <Box
              position="relative"
              fontSize={"14px"}
              fontWeight={400}
              color={theme === "dark" ? "white" : theme === "green" ? Color.GrayDark : "#181818"}
            >
              {titleTitle}
              <img
                src={theme === "dark" ? infoIconWhite : infoIcon}
                alt={"info"}
                style={{
                  position: "absolute",
                  top: -5,
                  right: -15,
                  width: 12,
                  height: 12,
                }}
              />
            </Box>
          </Box>
          <input
            className={theme === "dark" ? classes.textFieldImgTitleDescDark : classes.textFieldImgTitleDesc}
            name={title}
            type="text"
            value={title}
            onChange={elem => {
              let title = elem.target.value;
              setterTitle(title);
            }}
            placeholder={titlePlaceholder}
            disabled={!canEdit}
          />
          <Box display="flex" alignItems="center">
            <Box
              position="relative"
              fontSize={"14px"}
              fontWeight={400}
              color={theme === "dark" ? "white" : theme === "green" ? Color.GrayDark : "#181818"}
            >
              {descTitle}
              <img
                src={theme === "dark" ? infoIconWhite : infoIcon}
                alt={"info"}
                style={{
                  position: "absolute",
                  top: -5,
                  right: -15,
                  width: 12,
                  height: 12,
                }}
              />
            </Box>
          </Box>
          <textarea
            className={theme === "dark" ? classes.textAreaImgTitleDescDark : classes.textAreaImgTitleDesc}
            value={desc}
            onChange={elem => {
              let desc = elem.target.value;
              setterDesc(desc);
            }}
            placeholder={descPlaceholder}
            disabled={!canEdit}
          />
        </Grid>
      )}
      <Grid
        item={true}
        xs={12}
        md={imageSize === 12 ? 12 : 6}
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: !theme || imageSize === 12 ? 16 : 0,
          marginBottom: variant === "secondary" ? "48px" : 0
        }}
      >
        {photoTitle ? (
          <Box display="flex" alignItems="center" mb={1}>
            <Box
              position="relative"
              fontSize={"14px"}
              fontWeight={400}
              color={theme === "dark" ? "white" : theme === "green" ? Color.GrayDark : "#181818"}
            >
              {photoTitle}
              <img
                src={theme === "dark" ? infoIconWhite : infoIcon}
                alt={"info"}
                style={{
                  position: "absolute",
                  top: -5,
                  right: -15,
                  width: 12,
                  height: 12,
                }}
              />
            </Box>
          </Box>
        ) : null}
        {photoImg ? (
          <div
            style={{
              position: "relative",
              height: "100%",
            }}
          >
            <div
              style={{
                backgroundImage: `url(${photoImg})`,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                width: "100%",
                height: theme === "dark" ? "152px" : "100%",
                borderRadius: theme === "dark" ? 0 : "8px",
              }}
            />
            <div
              color={theme === "dark" ? "white" : "rgb(100, 200, 158)"}
              className={classes.removeImageButtonSquareImgTitle}
              onClick={removeImage}
              style={
                closeIconRightPx && descTitle
                  ? {
                      right: closeIconRightPx + "px",
                      top: "10px",
                    }
                  : closeIconRightPx && !descTitle
                  ? {
                      right: closeIconRightPx + "px",
                    }
                  : {}
              }
            >
              <SvgIcon>
                <CloseSolid />
              </SvgIcon>
            </div>
          </div>
        ) : (
          <Box
            className={
              theme === "dark"
                ? classes.dragImageHereDark
                : theme === "green"
                ? classes.dragImageHereGreen
                : classes.dragImageHereImgTitleDesc
            }
            onClick={() => {
              let selectPhoto = document.getElementById("selectPhoto");
              if (selectPhoto && canEdit) {
                selectPhoto.click();
              }
            }}
            onDragOver={dragOver}
            onDragEnter={dragEnter}
            onDragLeave={dragLeave}
            onDrop={fileDrop}
            style={{
              flexDirection: imageSize === 12 ? "row" : "column",
              justifyContent: imageSize === 12 ? "flex-start" : "center",
              flex: 1,
            }}
          >
            <img
              src={
                theme === "dark"
                  ? imageIconWhite
                  : theme === "green"
                  ? imageIconGreen
                  : imageSize === 12
                  ? imageIconDark
                  : imageIcon
              }
              alt={"camera"}
              style={{
                width: imageSize === 12 ? 48.67 : 40,
                height: imageSize === 12 ? 48 : 32,
                marginBottom: imageSize === 12 ? 0 : 16,
                marginRight: imageSize === 12 ? 30 : 0,
              }}
            />
            <Box color={theme === "dark" ? "white" : "#99a1b3"} fontSize={14} fontWeight={400}>
              Drag Image Here
              {imageSize === 12 ? (
                <Box>
                  or{" "}
                  <Box component="span" color={theme === "dark" ? "#00BFFF" : "#29e8dc"}>
                    browse media on your device
                  </Box>
                </Box>
              ) : null}
            </Box>
          </Box>
        )}
        <input
          id="selectPhoto"
          hidden
          type="file"
          style={{ display: "none" }}
          accept="image/*"
          onChange={fileInput}
        />
      </Grid>
      {variant === "secondary" && (
        <Grid
          item={true}
          xs={12}
          md={imageSize === 12 ? 12 : 6}
          style={{ paddingRight: imageSize === 12 || (theme && theme === "dark") ? "auto" : 0 }}
        >
          <Box display="flex" alignItems="center">
            <Box
              position="relative"
              fontSize={"14px"}
              fontWeight={400}
              color={theme === "dark" ? "white" : theme === "green" ? Color.GrayDark : "#181818"}
            >
              {titleTitle}
              <img
                src={theme === "dark" ? infoIconWhite : infoIcon}
                alt={"info"}
                style={{
                  position: "absolute",
                  top: -5,
                  right: -15,
                  width: 12,
                  height: 12,
                }}
              />
            </Box>
          </Box>
          <input
            className={theme === "dark" ? classes.textFieldImgTitleDescDark : classes.textFieldImgTitleDesc}
            name={title}
            type="text"
            value={title}
            onChange={elem => {
              let title = elem.target.value;
              setterTitle(title);
            }}
            placeholder={titlePlaceholder}
            disabled={!canEdit}
          />
          <Box display="flex" alignItems="center">
            <Box
              position="relative"
              fontSize={"14px"}
              fontWeight={400}
              color={theme === "dark" ? "white" : theme === "green" ? Color.GrayDark : "#181818"}
            >
              {descTitle}
              <img
                src={theme === "dark" ? infoIconWhite : infoIcon}
                alt={"info"}
                style={{
                  position: "absolute",
                  top: -5,
                  right: -15,
                  width: 12,
                  height: 12,
                }}
              />
            </Box>
          </Box>
          <textarea
            className={theme === "dark" ? classes.textAreaImgTitleDescDark : classes.textAreaImgTitleDesc}
            value={desc}
            onChange={elem => {
              let desc = elem.target.value;
              setterDesc(desc);
            }}
            placeholder={descPlaceholder}
            disabled={!canEdit}
          />
        </Grid>
      )}
    </Grid>
  );
};

export default ImageTitleDescription;
