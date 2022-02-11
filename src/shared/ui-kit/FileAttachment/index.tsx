import React, { useMemo } from "react";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { useFileAttachmentStyles } from "./index.styles";

export enum FileType {
  IMAGE = "image",
  AUDIO = "audio",
  VIDEO = "video",
  OTHER = "other",
}

interface FileAttachmentProps {
  setStatus: (status) => void;
  onFileChange: (file: any, type: FileType) => void;
  disabled?: boolean;
}

const MAX_FILE_SIZE = 1024 * 1024 * 10;

const FileAttachment = ({ setStatus, onFileChange, disabled = false }: FileAttachmentProps) => {
  const classes = useFileAttachmentStyles();
  const { showAlertMessage } = useAlertMessage();

  const validateFile = file => {
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/x-icon"];
    if (validTypes.indexOf(file.type) === -1) {
      return false;
    }
    return true;
  };

  const validateFileVideo = file => {
    const validTypes = ["video/mp4", "video/webm", "video/ogg", "video/quicktime"];
    if (validTypes.indexOf(file.type) === -1) {
      return false;
    }
    return true;
  };

  const validateFileAudio = file => {
    const validTypes = ["audio/mp3", "audio/ogg", "audio/wav", "audio/x-m4a", "audio/mpeg"];
    if (validTypes.indexOf(file.type) === -1) {
      return false;
    }
    return true;
  };

  const handleFiles = (files: any) => {
    for (let i = 0; i < files.length; i++) {
      if (validateFile(files[i])) {
        onFileChange(files[i], FileType.IMAGE);
      } else {
        files[i]["invalid"] = true;
        console.log("No valid file");
        // Alert invalid image
      }
    }
  };

  const handleFilesOthers = (files: any) => {
    for (let i = 0; i < files.length; i++) {
      if (files[i].size / 1024 <= 51200) {
        onFileChange(files[i], FileType.OTHER);
      } else {
        setStatus({
          msg: "File too big (< 50Mb)",
          key: Math.random(),
          variant: "error",
        });
      }
    }
  };

  const handleFilesVideo = (files: any) => {
    for (let i = 0; i < files.length; i++) {
      if (files[i].size / 1024 <= 51200) {
        if (validateFileVideo(files[i])) {
          onFileChange(files[i], FileType.VIDEO);
          // TODO: have to upload image file here, check Discord.tsx Line 872
        } else {
          files[i]["invalid"] = true;
          console.log("No valid file");
          // Alert invalid image
          setStatus({
            msg: "Not valid format",
            key: Math.random(),
            variant: "error",
          });
        }
      } else {
        setStatus({
          msg: "File too big (< 50Mb)",
          key: Math.random(),
          variant: "error",
        });
      }
    }
  };

  const handleFilesAudio = (files: any) => {
    for (let i = 0; i < files.length; i++) {
      if (files[i].size / 1024 <= 4096) {
        if (validateFileAudio(files[i])) {
          onFileChange(files[i], FileType.AUDIO);
          // TODO: have to upload image file here, check Discord.tsx Line 897
        } else {
          files[i]["invalid"] = true;
          console.log("No valid file");
          // Alert invalid image
          setStatus({
            msg: "Not valid format",
            key: Math.random(),
            variant: "error",
          });
        }
      } else {
        setStatus({
          msg: "File too big (< 5Mb)",
          key: Math.random(),
          variant: "error",
        });
      }
    }
  };

  const handleFilesAttachment = files => {
    for (let i = 0; i < files.length; i++) {
      if (files[i].type.startsWith("image")) handleFiles({ 0: files[i], length: 1 });
      else if (files[i].type.startsWith("audio")) handleFilesAudio({ 0: files[i], length: 1 });
      else if (files[i].type.startsWith("video")) handleFilesVideo({ 0: files[i], length: 1 });
      else handleFilesOthers({ 0: files[i], length: 1 });
    }
  };

  const fileInputMessageAttachment = e => {
    e.preventDefault();

    const files: FileList = e.target.files;
    if (files.length) {
      const maxFileSize = Array.from(files).sort((f1, f2) => f2.size - f1.size)[0].size;
      if (maxFileSize > MAX_FILE_SIZE) {
        showAlertMessage("File size can not be bigger than 10MB.", { variant: "error" });
      } else {
        handleFilesAttachment(files);
      }
    }
  };

  const uploadAttachment = () => {
    if (disabled) return;

    const inputElement = document.createElement("input");
    inputElement.type = "file";
    inputElement.accept = ".png, .jpeg, .svg, .gif, .mp3, .mp4";
    inputElement.multiple = true;

    // set onchange event to call callback when user has selected file
    inputElement.addEventListener("change", fileInputMessageAttachment);

    // dispatch a click event to open the file dialog
    inputElement.dispatchEvent(new MouseEvent("click"));
  };

  return (
    <div className="file-attachment">
      <img
        className={classes.attachment}
        style={{
          opacity: disabled ? 0.6 : 1,
          cursor: disabled ? "not-allowed" : "pointer",
        }}
        src={require("assets/icons/file_attachment.svg")}
        alt="Attachment"
        onClick={uploadAttachment}
      />
    </div>
  );
};

export default FileAttachment;
