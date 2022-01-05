import React, {useEffect, useRef} from "react";
import ReactPlayer from "react-player";

import "./FileUpload.css";
import Box from "shared/ui-kit/Box";
import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as CloseSolid } from "assets/icons/close-solid.svg";
import { ReactComponent as UploadIcon } from "assets/icons/upload.svg";
import { Color, Gradient } from "shared/constants/const";
import { v4 as uuidv4 } from "uuid";

const audioIcon = require("assets/icons/audio_icon.png");
const audioGreenIcon = require("assets/icons/audio_green.png");
const videoIcon = require("assets/icons/camera_icon.png");
const imageIconDark = require("assets/icons/image_icon_dark.png");

const MimeTypes = Object.freeze({
  image: ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/x-icon"],
  audio: /*["audio/mpeg", "audio/mp4", "audio/vnd.wav", "audio/ogg", "audio/mid", "audio/m4a"]*/ ["audio/*"],
  video: [
    "video/mp4",
    "video/ogg",
    "video/webm",
    "video/3gpp",
    "video/quicktime",
    "video/x-msvideo",
    "video/x-ms-wmv",
    "video/ms-asf",
  ],
});

const FileUpload = ({
  type,
  photo,
  photoImg,
  setterPhoto,
  setterPhotoImg,
  mainSetter,
  mainElement,
  canEdit,
  styleWrapper = {},
  smallSize = false,
  isNewVersion = false,
  isEditable = false,
  theme = "",
  extra = false,
  isReverse = false,
  isBitrate = false,
}) => {
  const randomId = uuidv4();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    const files = e.dataTransfer.files;
    if (files.length) {
      handleFiles(files);
    }
    e.preventDefault();
  };

  const fileInput = e => {
    const files = e.target.files;
    if (files.length) {
      handleFiles(files);
    }
    e.preventDefault();

    if (fileInputRef !== null && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFiles = (files: any) => {
    if(files && files[0] && files[0].type) {
      setterPhoto(files[0]);

      if (type === "image") {
        const reader = new FileReader();
        reader.addEventListener("load", () => {

          setterPhotoImg(reader.result);

          let image = new Image();
          if (
            mainElement !== undefined &&
            mainSetter !== undefined &&
            reader.result !== null &&
            (typeof reader.result === "string" || reader.result instanceof String)
          ) {
            image.src = reader.result.toString();

            //save dimensions
            /*image.onload = function () {
              let height = image.height;
              let width = image.width;

              const elementCopy = mainElement;
              elementCopy.dimensions = { height: height, width: width };
              mainSetter(elementCopy);

              return true;
            };*/
          }
        });

        reader.readAsDataURL(files[0]);
      }
    }
  };

  const removeImage = () => {
    setterPhoto(null);
    setterPhotoImg(null);
  };

  return (
    <div>
      {photo ? (
        <div
          className="imageSquareImgTitleDescDiv"
          style={
            theme === "green"
              ? {
                  height: "117px",
                }
              : theme === "music dao"
              ? { border: "1px solid #b6b6b6", borderRadius: "16px", padding: "16px" }
              : {}
          }
        >
          {type === "image" ? (
            <div
              className="imageSquareImgTitleDesc"
              style={{
                backgroundImage: `url(${photoImg})`,
                backgroundPosition: "center",
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
              }}
            />
          ) : (
            <Box
              style={
                isBitrate ? { display: "flex", alignItems: "center", justifyContent: "space-between" } : {}
              }
            >
              <Box style={isBitrate ? { display: "flex", alignItems: "center" } : {}}>
                {isBitrate && (
                  <Box>
                    <img
                      className="dragImageHereIconImgTitleDesc"
                      src={audioGreenIcon}
                      alt={"camera"}
                      style={
                        theme === "green"
                          ? { marginRight: "18px" }
                          : theme === "music dao"
                          ? { marginRight: "27px", width: "26px", height: "25px" }
                          : {
                              marginBottom: smallSize ? "15px" : 0,
                              marginRight: smallSize ? 0 : "20px",
                            }
                      }
                    />
                  </Box>
                )}
                {type === "audio" && (
                  <Box mb={1} textAlign="start">
                    <Box>{photo.name}</Box>
                    {isBitrate && (
                      <Box style={{ fontSize: 14, fontWeight: 400 }} mt={1}>
                        Bitrate: 240 Kbps
                      </Box>
                    )}
                  </Box>
                )}
              </Box>

              {isBitrate && (
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  style={{
                    background: "#EEF2F650",
                    borderRadius: "50%",
                    width: 52,
                    height: 52,
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
                  }}
                  onClick={removeImage}
                >
                  <RemoveOutlineIcon />
                </Box>
              )}
              {!isBitrate && (
                <ReactPlayer
                  controls
                  url={URL.createObjectURL(photo)}
                  width="100%"
                  height={type === "audio" ? 50 : 200}
                />
              )}
            </Box>
          )}
          {!isEditable && !isBitrate && (
            <div className="removeImageButtonSquareImgTitle" onClick={removeImage}>
              <SvgIcon>
                <CloseSolid />
              </SvgIcon>
            </div>
          )}
          {isEditable && (
            <Box className="editableBox">
              <Box
                className="editableButtonBox"
                color="#F43E5F"
                style={{ background: "#EFDDDD" }}
                onClick={removeImage}
              >
                <RemoveRedIcon />
                <Box ml={1}>REMOVE</Box>
              </Box>
              <Box
                className="editableButtonBox"
                color="#54658F"
                style={{ background: "#DDE6EF" }}
                ml={2}
                onClick={() => {
                  let selectPhoto = document.getElementById(`selectPhoto-${type}-${randomId}`);
                  if (selectPhoto && canEdit) {
                    selectPhoto.click();
                  }
                }}
              >
                <EditIcon />
                <Box ml={1}>EDIT</Box>
              </Box>
            </Box>
          )}
        </div>
      ) : (
        <div
          className="dragImageHereImgTitleDesc"
          onDragOver={dragOver}
          onDragEnter={dragEnter}
          onDragLeave={dragLeave}
          onDrop={fileDrop}
          style={
            theme === "green"
              ? {
                  ...styleWrapper,
                  backgroundColor: "#F7F9FE",
                  border: "1px dashed #707582",
                  height: "117px",
                  alignItems: "center",
                  justifyContent: "center",
                }
              : theme === "music dao"
              ? {
                  ...styleWrapper,
                  backgroundColor: "rgba(238, 242, 247, 0.5)",
                  border: "1px dashed #788BA2",
                  height: "97px",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  borderRadius: "17px",
                  padding: extra ? "28px 34px" : "35px 34px",
                }
              : theme === "privi-pix"
              ? {
                  ...styleWrapper,
                  backgroundColor: "transparent",
                  border: "1px solid #A4A4A4",
                  height: "97px",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }
              : {
                  ...styleWrapper,
                  justifyContent: isNewVersion ? "center" : "flex-start",
                  alignItems: smallSize ? "flex-start" : "center",
                  flexDirection: smallSize || isNewVersion ? "column" : "row",
                  background: theme
                    ? "rgba(117, 115, 171, 0.16)"
                    : isNewVersion
                    ? "rgba(238, 242, 247, 0.5)"
                    : "inherit",
                }
          }
        >
          {!isNewVersion && (
            <img
              className="dragImageHereIconImgTitleDesc"
              src={type === "image" ? imageIconDark : type === "audio" ? audioIcon : videoIcon}
              alt={"camera"}
              style={
                theme === "green"
                  ? { marginRight: "18px" }
                  : theme === "music dao"
                  ? { marginRight: "27px", width: "26px", height: "25px" }
                  : {
                      marginBottom: smallSize ? "15px" : 0,
                      marginRight: smallSize ? 0 : "20px",
                    }
              }
            />
          )}
          {isReverse && (
            <div
              style={{
                textAlign: "center",
                marginTop: "8px",
                color: theme ? Color.White : Color.MusicDAODark,
                fontWeight: 600,
                marginBottom: "8px",
              }}
            >
              Drag and drop your {type === "image" ? "photo" : type === "audio" ? "audio" : "video"} or browse{" "}
              <br />
              to choose a file
            </div>
          )}
          {isNewVersion && (
            <UploadIcon
              style={{ stroke: theme === "privi-pix-blue" ? "#431AB7" : theme ? "white" : "inherit" }}
            />
          )}
          <Box
            className="dragImageHereLabelImgTitleDesc"
            style={{
              fontSize: smallSize ? "14px" : "18px",
            }}
          >
            <Box
              className={"dragImageHereLabelImgTitleSubDesc"}
              onClick={() => {
                let selectPhoto = document.getElementById(`selectPhoto-${type}-${randomId}`);
                if (selectPhoto && canEdit) {
                  selectPhoto.click();
                }
              }}
            >
              {theme === "green" ? (
                <>
                  <Box fontSize="18px" color="#99A1B3" lineHeight="104.5%">
                    Drag and drop your photo
                  </Box>
                  <Box fontSize="14px" color="#707582" display="flex">
                    or
                    <Box
                      style={{
                        background: Gradient.Green,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                      ml="6px"
                    >
                      browse on your device
                    </Box>
                  </Box>
                </>
              ) : theme === "music dao" ? (
                <>
                  <Box
                    fontSize="14px"
                    color={Color.MusicDAODark}
                    fontFamily="Montserrat"
                    fontWeight={600}
                    display="flex"
                  >
                    Drag and drop your {type === "image" ? "Photo" : type === "audio" ? "Audio" : "Video"} or
                    <Box color="#34C759" ml="8px">
                      browse on your device
                    </Box>
                  </Box>
                  {extra && (
                    <Box mt="4px" color="#54658F" fontSize="14px" fontFamily="Montserrat" fontWeight={500}>
                      We suggest 600 x 200 px size for best viewing experience
                    </Box>
                  )}
                </>
              ) : theme === "privi-pix" ? (
                <>
                  <Box
                    fontSize="12px"
                    color={Color.MusicDAODark}
                    fontFamily="Montserrat"
                    fontWeight="600"
                    display="flex"
                  >
                    Drag and drop your {type === "image" ? "Photo" : type === "audio" ? "Audio" : "Video"} or
                    <Box color="#431AB7" ml="8px">
                      browse on your device
                    </Box>
                  </Box>
                  {extra && (
                    <Box mt="4px" color="#54658F" fontSize="18px" fontFamily="Montserrat" fontWeight="600">
                      We suggest 600 x 200 px size for best viewing experience
                    </Box>
                  )}
                </>
              ) : isNewVersion ? (
                <>
                  {!isReverse && (
                    <div
                      style={{
                        textAlign: "center",
                        marginTop: "8px",
                        color:
                          theme === "privi-pix-blue" ? "#431AB7" : theme ? Color.White : Color.MusicDAODark,
                        fontWeight: 600,
                      }}
                    >
                      Drag and drop your {type === "image" ? "photo" : type === "audio" ? "audio" : "video"}{" "}
                      or browse <br />
                      to choose a file
                    </div>
                  )}
                  <div style={{ textAlign: "center", marginTop: "8px" }}>
                    <div
                      style={{
                        color: theme === "privi-pix-blue" ? "#9EACF2" : theme ? "#E0DFF0" : "#54658F",
                        opacity: isReverse ? 1 : 0.8,
                        marginTop: isReverse ? "8px" : 0,
                      }}
                    >
                      {type === "image"
                        ? "PNG, JPG and GIF files are allowed"
                        : "MPEG or Movie file are allowed"}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  Drag {type === "image" ? "Photo" : type === "audio" ? "Audio" : "Video"} here or{" "}
                  <span>browse media on your device</span>
                </>
              )}
            </Box>
          </Box>
        </div>
      )}
      <input
        ref={fileInputRef}
        id={`selectPhoto-${type}-${randomId}`}
        hidden
        type="file"
        style={{ display: "none" }}
        accept={MimeTypes[type].join(",")}
        onChange={fileInput}
      />
    </div>
  );
};

const RemoveRedIcon = () => (
  <svg width="10" height="9" viewBox="0 0 10 9" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M0.632812 1.01819H1.66227L2.30568 8.22439C2.31925 8.42746 2.48815 8.5853 2.69173 8.5848H7.94157C8.14515 8.5853 8.31404 8.42746 8.32762 8.22439L8.97103 1.01819H10.0005V0.246094H0.632812V1.01819Z"
      fill="#F43E5F"
    />
  </svg>
);

const EditIcon = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M8.12681 0C7.64712 0 7.16783 0.18281 6.80221 0.54805C4.70731 2.64295 2.61241 4.73785 0.517413 6.83285L3.16821 9.48365C5.26311 7.38875 7.35801 5.29385 9.45301 3.19885C10.1839 2.46799 10.1819 1.27855 9.45145 0.54805C9.08622 0.18282 8.60653 0 8.12685 0H8.12681ZM0.192413 7.3918L0.000612788 9.6629C-0.0154032 9.85587 0.145533 10.0168 0.338113 10.0004L2.60801 9.80782L0.192413 7.3918Z"
      fill="#54658F"
    />
  </svg>
);

const RemoveOutlineIcon = () => (
  <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M15.1411 4.22754V16.2275C15.1411 17.3321 14.2457 18.2275 13.1411 18.2275H5.14111C4.03654 18.2275 3.14111 17.3321 3.14111 16.2275V4.22754M12.1411 4.22754V3.22754C12.1411 2.12297 11.2457 1.22754 10.1411 1.22754H8.14111C7.03654 1.22754 6.14111 2.12297 6.14111 3.22754V4.22754M1.14111 4.22754H17.1411"
      stroke="#F43E5F"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

export default FileUpload;
