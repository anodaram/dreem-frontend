import React, { useState, useEffect, useCallback } from "react";
import Cropper from 'react-easy-crop'

import { Modal, PrimaryButton } from "shared/ui-kit";
import { useImageCropModalStyles } from "./index.styles";
import { Typography, Slider, Button } from "@material-ui/core";
import { getCroppedImgDataUrl, getRotatedImage } from "./canvasUtils";
import { getOrientation } from 'get-orientation/browser'

const ORIENTATION_TO_ANGLE = {
  '3': 180,
  '6': 90,
  '8': -90,
}

const ImageCropModal = ({ open, imageFile, onClose, setCroppedImage }) => {
  const classes = useImageCropModalStyles();

  useEffect(() => {
    initImageSrc(imageFile);
  }, [imageFile]);

  const [imageSrc, setImageSrc] = useState<any>();
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [rotation, setRotation] = useState<number>(0)
  const [zoom, setZoom] = useState<number>(1)

  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  function srcToFile(src, fileName, mimeType) {
    return (fetch(src)
      .then(function (res) { return res.arrayBuffer(); })
      .then(function (buf) { return new File([buf], fileName, { type: mimeType }); })
    );
  }

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImgDataUrl(
        imageSrc,
        croppedAreaPixels,
        rotation
      )
      console.log('donee', { croppedImage })

      srcToFile(
        croppedImage,
        'picture.png',
        'image/png'
      )
        .then(function (file) {
          setCroppedImage(file);
          onClose();
        })
    } catch (e) {
      console.error(e)
    }
  }, [imageSrc, croppedAreaPixels, rotation])

  const initImageSrc = async (file) => {
    if (file){
      let imageDataUrl = await readFile(file)

      // apply rotation if needed
      const orientation = await getOrientation(file)
      const rotation = ORIENTATION_TO_ANGLE[orientation]
      if (rotation) {
        imageDataUrl = await getRotatedImage(imageDataUrl, rotation)
      }

      setImageSrc(imageDataUrl)
    }
  }

  return (
    <Modal size="medium" isOpen={open} onClose={onClose} showCloseIcon className={classes.content}>
        {imageSrc && (
          <>
            <div className={classes.cropContainer}>
              <Cropper
                image={imageSrc}
                crop={crop}
                rotation={rotation}
                zoom={zoom}
                aspect={4 / 3}
                onCropChange={setCrop}
                onRotationChange={setRotation}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>
            <div className={classes.controls}>
              <div className={classes.sliderContainer}>
                <Typography
                  variant="overline"
                  classes={{ root: classes.sliderLabel }}
                >
                  Zoom
                </Typography>
                <Slider
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  aria-labelledby="Zoom"
                  classes={{ root: classes.slider }}
                  onChange={(e, _zoom) => setZoom(Number(_zoom))}
                />
              </div>
              <div className={classes.sliderContainer}>
                <Typography
                  variant="overline"
                  classes={{ root: classes.sliderLabel }}
                >
                  Rotation
                </Typography>
                <Slider
                  value={rotation}
                  min={0}
                  max={360}
                  step={1}
                  aria-labelledby="Rotation"
                  classes={{ root: classes.slider }}
                  onChange={(e, _rotation) => setRotation(Number(_rotation))}
                />
              </div>
              <Button
                onClick={showCroppedImage}
                variant="contained"
                color="primary"
                classes={{ root: classes.cropButton }}
              >
                Confirm
              </Button>
            </div>
          </>
        )}
    </Modal>
  );
};

export default ImageCropModal;

function readFile(file) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => resolve(reader.result), false)
    reader.readAsDataURL(file)
  })
}
