import React from 'react'

import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, {
  Pagination
} from 'swiper/core';
// Import Swiper styles
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'
import "swiper/components/pagination/pagination.min.css"
import { GameSliderStyles } from './index.styles';
SwiperCore.use([Pagination]);

export const GameSlider = ({ games, paginationColor}: any) => {
  const classes = GameSliderStyles({ paginationColor, gameCount: (games || []).length });
  return (
    <div className={classes.container}>
      <Swiper
        loop
        resizeObserver
        initialSlide={1}
        pagination={{ clickable: true }}
      >
        {
          games.map((game) => (
            <SwiperSlide>{game()}</SwiperSlide>
          ))
        }
      </Swiper>
    </div>
  );
};
