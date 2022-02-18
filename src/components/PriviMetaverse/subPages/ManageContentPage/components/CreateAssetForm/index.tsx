import { FormControlLabel, MenuItem, Radio, RadioGroup, Select, Slider, Button } from "@material-ui/core";
import React, { useState, useRef } from "react";
import { ChromePicker } from "react-color";
import ReactPlayer from "react-player";

import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";

import { FormData, InputFileContents, InputFiles, InputRefs } from "./interface";
import { color2obj, obj2color, sanitizeIfIpfsUrl } from "shared/helpers";

import { InfoTooltip } from "shared/ui-kit/InfoTooltip";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { ReactComponent as DocumentIcon } from "assets/icons/document.svg";
import { ReactComponent as GLTFIcon } from "assets/icons/gltf.svg";
import { ReactComponent as RefreshIcon } from "assets/icons/refresh.svg";

import { useModalStyles, useFilterSelectStyles } from "./index.styles";

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
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  fileInputs: InputFiles;
  setFileInputs: React.Dispatch<React.SetStateAction<InputFiles>>;
  fileContents: InputFileContents;
  setFileContents: React.Dispatch<React.SetStateAction<InputFileContents>>;
}) => {
  const classes = useModalStyles();
  const filterClasses = useFilterSelectStyles();
  const { showAlertMessage } = useAlertMessage();

  const [videoThumbnailURL, setVideoThumbnailURL] = useState<any>({});

  const inputRef = useRef<InputRefs>({});


  const onFileInput = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    
    e.preventDefault();
    const files = e.target.files;
    let isValid = handleValidation('FILE', key, files);
    if (!isValid) {
      return
    }

    if (files && files.length) {
      if (files && files[0]) {
        setFileInputs({ ...fileInputs, [key]: files[0] });
        setVideoThumbnailURL({ ...videoThumbnailURL, [key]: URL.createObjectURL(files[0]) });

        const reader = new FileReader();
        reader.addEventListener("load", () => {
          setFileContents(prev => ({ ...prev, [key]: { ...prev[key], src: reader.result } }));
          let image = new Image();
          if (
            reader.result !== null &&
            (typeof reader.result === "string" || reader.result instanceof String)
          ) {
            image.src = reader.result.toString();
            image.onload = function () {
              let width = image.width;
              let height = image.height;
              setFileContents(prev => ({
                ...prev,
                [key]: {
                  ...prev[key],
                  dimension: {
                    width,
                    height,
                  },
                },
              }));
            };
          }
        });

        reader.readAsDataURL(files[0]);
      }
    }

    e.target.value = "";
  };

  const handleValidation = (kind, key, value: any) => {
    let flag = true
    if (kind === "FILE") {
      const file = value[0];
      let width;
      let height;
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        let image = new Image();
        if (
          reader.result !== null &&
          (typeof reader.result === "string" || reader.result instanceof String)
        ) {
          image.src = reader.result.toString();
          image.onload = function () {
            width = image.width;
            height = image.height;
          };
        }
      });
      metadata?.fields.map((field: any, index: number) => {
        if (field.key == key && field.key && value && field?.input?.formats) {
          //@ts-ignore
          var el = field?.input?.formats.some(i => i.name.includes(file.name.split(".").reverse()[0]));
          if (!el) {
            showAlertMessage(`${field.key} File is invalid.`, { variant: "error" });
            flag = false;
          }
        }
        if (field.key == key && field.key && width && height && field?.input?.min) {
          //@ts-ignore
          if (field?.input?.min.width > (width || 0) || field?.input?.min?.height > (height || 0)
          ) {
            showAlertMessage(
              `${field?.name?.value} is invalid. Minium image size is ${field?.input?.min?.width} x ${field?.input?.min?.height}`,
              { variant: "error" }
            );
            return false;
          }
        }
        if (field.key == key && field.key && width && height && field?.input?.max) {
          //@ts-ignore
          if (field?.input?.max?.width < (width || 0) || field?.input?.max?.height < (height || 0)
          ) {
            showAlertMessage(
              `${field?.name?.value} is invalid. Maximum image size is ${field?.input?.max?.width} x ${field?.input?.max?.height}`,
              { variant: "error" }
            );
            return false;
          }
        }
        if (field.key == key && field.key && value && field?.input?.sizeLimit) {
          if (field?.input?.sizeLimit < file.size)
          {
            showAlertMessage(
              `${field?.name?.value} is invalid. Maximum size is ${field?.input?.sizeLimit} bytes`,
              { variant: "error" }
            );
            return false;
          }
        }
      })
    }
    return flag
  }

  const renderAsset = (asset: any, index: number) => {
    return (
      <Box className={classes.itemContainer} key={`asset-field-${index}`}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box className={classes.itemTitle} mb={1}>
            {asset.name?.value}
          </Box>
          {asset.info?.value && <InfoTooltip tooltip={asset.info?.value} />}
        </Box>
        {asset.kind === "STRING" ? (
          asset.key === "ITEM_DESCRIPTION" ? (
            <textarea
              style={{ height: "130px" }}
              className={classes.input}
              placeholder={asset.input?.placeholder?.value}
              value={formData[asset.key]}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                asset.input && setFormData({ ...formData, [asset.key]: e.target.value })
              }}
            />
          ) : (
            <input
              className={classes.input}
              placeholder={asset.input?.placeholder?.value}
              value={formData[asset.key]}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                asset.input && setFormData({ ...formData, [asset.key]: e.target.value })
              }}
            />
          )
        ) : null}
        {asset.kind === "FILE" && (
          <>
            <Box
              className={classes.uploadBox}
              onClick={() => !fileInputs[asset.key] && inputRef.current[asset.key]?.click()}
              style={{
                cursor: fileInputs[asset.key] ? undefined : "pointer",
              }}
            >
              {fileInputs[asset.key] ? (
                <>
                  {asset.fileKind === "VIDEO" ? (
                    <div style={{ marginLeft: 20 }}>
                      <ReactPlayer playing={false} controls={false} url={videoThumbnailURL[asset.key]} width="85" height={85} />
                    </div>
                  ) : (
                    <Box
                      className={classes.image}
                      style={{
                        backgroundImage: `url(${sanitizeIfIpfsUrl(fileContents[asset.key]?.src)})`,
                        backgroundSize: "cover",
                      }}
                    />
                  )}

                  <Box
                    flex={1}
                    display="flex"
                    alignItems="center"
                    marginLeft="24px"
                    justifyContent="space-between"
                    mr={3}
                  >
                    Uploaded {fileInputs[asset.key].name}
                    <Button
                      startIcon={<RefreshIcon />}
                      onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        setFileInputs({ ...fileInputs, [asset.key]: null });
                        setFileContents({ ...fileContents, [asset.key]: null });
                        inputRef.current[asset.key]?.click();
                      }}
                    >
                      CHANGE FILE
                    </Button>
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
                    <span>Accepted files {asset.input?.formats?.map(f => f.name).join(', ')}</span>
                    {asset.input?.min &&
                      ` minimum ${asset.input?.min?.width} x ${asset.input?.min?.height} px `
                    }
                    {asset.input?.max &&
                      ` maximum ${asset.input?.max?.width} x ${asset.input?.max?.height} px size`
                    }
                    {/* for best viewing experience */}
                    {/* <div dangerouslySetInnerHTML={{__html: asset.input?.description?.value}} /> */}
                  </Box>
                </>
              )}
            </Box>
            <input
              ref={ref => (inputRef.current[asset.key] = ref)}
              hidden
              type="file"
              style={{ display: "none" }}
              accept={asset.input?.formats && asset.input.formats.length > 0 && asset.input.formats.map(f => f.mimeType).join(', ')}
              onChange={asset.input && onFileInput(asset.key)}
            />
          </>
        )}
        {asset.kind === "DROPDOWN" && (
          <Select
            defaultValue={asset.value}
            value={formData[asset.key]}
            onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
              asset.input && setFormData({ ...formData, [asset.key]: e.target.value });
            }}
            disableUnderline
            className={classes.select}
            MenuProps={{
              classes: filterClasses,
              anchorOrigin: {
                vertical: "bottom",
                horizontal: "left",
              },
              transformOrigin: {
                vertical: "top",
                horizontal: "left",
              },
              getContentAnchorEl: null,
            }}
          >
            {asset.options?.map((option, index) => (
              <MenuItem key={`${asset.key}-OPTION-${index}`} value={option.value}>
                {option.name.value}
              </MenuItem>
            ))}
          </Select>
        )}
        {asset.kind === "BOOL" && (
          <RadioGroup
            row
            value={formData[asset.key] || asset.value ? "yes" : "no"}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              asset.input && setFormData({ ...formData, [asset.key]: e.target.value === "yes" });
            }}
            className={classes.radio}
          >
            <FormControlLabel value={"yes"} control={<Radio />} label="Yes" />
            <FormControlLabel value={"no"} control={<Radio />} label="No" />
          </RadioGroup>
        )}
        {asset.kind === "FLOAT" && (
          <Box className={classes.slider}>
            <Slider
              value={formData[asset.key] || asset.value || 0}
              onChange={(event: any, newValue: number | number[]) => {
                asset.input && setFormData({ ...formData, [asset.key]: newValue });
              }}
              min={asset.range.min}
              max={asset.range.max}
              step={0.01}
            />
            <input
              type="number"
              className={classes.input}
              value={formData[asset.key] || asset.value || 0}
              min={asset.range.min}
              max={asset.range.max}
              step={0.01}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                asset.input && setFormData({ ...formData, [asset.key]: e.target.value })
              }}
            />
          </Box>
        )}
        {asset.kind === "COLOR32" && (
          <ChromePicker
            color={
              color2obj(formData[asset.key]) || {
                ...asset.value,
                a: Number((asset.value.a / 255).toFixed(2)),
              }
            }
            onChangeComplete={color => asset.input && setFormData({ ...formData, [asset.key]: obj2color(color.rgb) })}
          />
        )}
        {asset.kind === "ITEM" && (
          <>
            <PrimaryButton
              size="medium"
              className={classes.uploadBtn}
              onClick={() => {
                !fileInputs[asset.key] && inputRef.current[asset.key]?.click();
              }}
              style={fileInputs[asset.key] && { background: "#E9FF26!important" }}
            >
              {fileInputs[asset.key] ? (
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  width={1}
                  fontSize={12}
                >
                  <Box display="flex" alignItems="center" justifyContent="space-between" fontSize={12}>
                    <DocumentIcon /> {fileInputs[asset.key].name}
                  </Box>
                  <Button
                    startIcon={<RefreshIcon />}
                    onClick={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      setFileInputs({ ...fileInputs, [asset.key]: null });
                      setFileContents({ ...fileContents, [asset.key]: null });
                    }}
                  >
                    CHANGE FILE
                  </Button>
                </Box>
              ) : (
                <Box pt={0.5} display="flex" alignItems="center" justifyContent="space-between">
                  <GLTFIcon />{" "}
                  <Box display="flex" alignItems="center" marginLeft="5px">
                    Add {asset.name.value}
                  </Box>
                </Box>
              )}
            </PrimaryButton>
            <input
              ref={ref => (inputRef.current[asset.key] = ref)}
              hidden
              type="file"
              style={{ display: "none" }}
              onChange={asset.input && onFileInput(asset.key)}
            />
          </>
        )}
      </Box>
    );
  };

  return <Box>{metadata.fields?.map((asset: any, index: number) => renderAsset(asset, index))}</Box>;
};

export default CreateAssetForm;
