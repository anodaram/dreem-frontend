import React, { useState } from "react";
import SimpleCarousel from "react-simply-carousel";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  container: {
    width: '100%',
    overflow: 'hidden',
  },
}));

export const Carousel = props => {
  const classes = useStyles();
  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <div className={classes.container}>
      <SimpleCarousel
        containerProps={{
          style: {
            width: "100%",
            justifyContent: 'flex-start',
          }
        }}
        activeSlideIndex={activeSlide}
        onRequestChange={setActiveSlide}
        forwardBtnProps={props.forwardBtn || {
          style: {
            display: "none"
          }
        }}
        backwardBtnProps={props.backwardBtn || {
          style: {
            display: "none"
          }
        }}
        speed={400}
        infinite={false}
      >
        {props.children}
      </SimpleCarousel>
    </div>
  );
}
