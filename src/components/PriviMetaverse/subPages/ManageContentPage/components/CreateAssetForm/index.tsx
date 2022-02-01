import React, { useEffect, useState, useRef } from "react";

import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { SecondaryButton } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { InfoTooltip } from "shared/ui-kit/InfoTooltip";
import { useModalStyles } from "./index.styles";

import { FormData, InputFileContents, InputFiles, InputRefs } from "./interface";

const CreateAssetForm = ({
  metadata,
  formData,
  setFormData,
  fileInputs,
  setFileInputs,
  fileContents,
  setFileContents,
}: {
  metadata: any;
  formData: FormData;
  setFormData: (data: FormData) => void;
  fileInputs: InputFiles;
  setFileInputs: (data: InputFiles) => void;
  fileContents: InputFileContents;
  setFileContents: (data: InputFileContents) => void;
}) => {
  const classes = useModalStyles();
  const { showAlertMessage } = useAlertMessage();

  const inputRef = useRef<InputRefs>({});
  const imageInputRef = useRef<HTMLInputElement>(null);

  const onFileInput = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const files = e.target.files;
    if (files && files.length) {
      if (files && files[0]) {
        setFileInputs({ ...fileInputs, [key]: files[0] });

        const reader = new FileReader();
        reader.addEventListener("load", () => {
          setFileContents({ ...fileContents, [key]: { ...fileContents[key], src: reader.result } });
          let image = new Image();
          if (
            reader.result !== null &&
            (typeof reader.result === "string" || reader.result instanceof String)
          ) {
            image.src = reader.result.toString();
            image.onload = function () {
              let width = image.width;
              let height = image.height;
              setFileContents({
                ...fileContents,
                [key]: {
                  ...fileContents[key],
                  dimension: {
                    width,
                    height,
                  },
                },
              });
            };
          }
        });

        reader.readAsDataURL(files[0]);
      }
    }

    if (imageInputRef !== null && imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const renderAsset = (asset: any, index: number) => {
    return (
      <Box className={classes.itemContainer} key={`asset-field-${index}`}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box className={classes.itemTitle} mb={1}>
            {asset.name?.value}
          </Box>
          {/* <InfoTooltip tooltip={"Please give your texture a name."} /> */}
        </Box>
        {asset.kind === "STRING" && (
          <input
            className={classes.input}
            placeholder={asset.input.placeholder.value}
            value={formData[asset.key]}
            onChange={e => setFormData({ ...formData, [asset.key]: e.target.value })}
          />
        )}
        {asset.kind === "TEXT" && (
          <textarea
            style={{ height: "130px" }}
            className={classes.input}
            placeholder={asset.input.placeholder.value}
            value={formData[asset.key]}
            onChange={e => setFormData({ ...formData, [asset.key]: e.target.value })}
          />
        )}
        {asset.kind === "FILE_TYPE_IMAGE" && (
          <>
            <Box
              className={classes.uploadBox}
              onClick={() => !fileInputs[asset.key] && inputRef.current[asset.key]?.click()}
              style={{
                cursor: fileInputs[asset.key] ? undefined : "pointer",
                height: fileInputs[asset.key] ? 110 : 80,
              }}
            >
              {fileInputs[asset.key] ? (
                <>
                  <Box
                    className={classes.image}
                    style={{
                      backgroundImage: `url(${fileContents[asset.key]})`,
                      backgroundSize: "cover",
                    }}
                  />
                  <Box
                    flex={1}
                    display="flex"
                    alignItems="center"
                    marginLeft="24px"
                    justifyContent="space-between"
                    mr={3}
                  >
                    Uploaded {fileInputs[asset.key].name}
                    <SecondaryButton
                      size="medium"
                      onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        setFileInputs({ ...fileInputs, [asset.key]: null });
                        setFileContents({ ...fileContents, [asset.key]: null });
                        imageInputRef.current?.click();
                      }}
                    >
                      <img src={require("assets/metaverseImages/refresh.png")} />
                      <span style={{ marginTop: 1, marginLeft: 8 }}>CHANGE FILE</span>
                    </SecondaryButton>
                  </Box>
                </>
              ) : (
                <>
                  <Box className={classes.image}>
                    <img width={26} src={require("assets/icons/image-icon.png")} alt="image" />
                  </Box>
                  <Box className={classes.controlBox} ml={5}>
                    Drag image here or <span>browse media on your device</span>
                    <br />
                    <span>Accepted files png, jpg, svg</span> minimum 600 x 600 px size for
                    <br />
                    best viewing experience
                  </Box>
                </>
              )}
            </Box>
            <input
              ref={ref => (inputRef.current[asset.key] = ref)}
              hidden
              type="file"
              style={{ display: "none" }}
              accept={asset.input.formats?.mimeType}
              onChange={onFileInput(asset.key)}
            />
          </>
        )}
      </Box>
    );
  };

  return <Box>{metadata.fields.map((asset: any, index: number) => renderAsset(asset, index))}</Box>;
};

export default CreateAssetForm;
