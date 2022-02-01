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

export const GameSlider = ({ games, paginationColor}) => {
  const classes = GameSliderStyles({ paginationColor });
  return (
    <div className={classes.container}>
      <Swiper pagination={true}>
        {
          games.map((game) => (
            <SwiperSlide>{game()}</SwiperSlide>
          ))
        }
      </Swiper>
    </div>
  );
};
