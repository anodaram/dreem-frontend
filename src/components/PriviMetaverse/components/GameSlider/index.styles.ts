import { makeStyles } from "@material-ui/core/styles";

export const GameSliderStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    height: "100%",
    position: 'relative',

    '& .react-stacked-center-carousel-slide-1': {
      left: '0px !important'
    },
    '& .react-stacked-center-carousel-slide--1': {
      right: '0px !important',
      left: 'auto !important'
    },
    '& .swiper-container': {
      width: '100%',
      height: '100%'
    },
    
    '& .swiper-slide': {
      textAlign: 'center',
      fontSize: '18px',
      color: 'red',
    
      /* Center slide text vertically */
      'display': 'flex',
      'justify-content': 'center',
      'align-items': 'center'
    },
    
    '& .swiper-slide img': {
      'display': 'block',
      'width': '100%',
      'height': '100%',
      'objectFit': 'cover'
    },
    
    '& .swiper-pagination-bullet': {
      'width': '150px',
      'height': '3px',
      'opacity': 1,
      borderRadius: 0,
      'background': 'rgba(255,255,255,0.5)'
    },

    '& .swiper-pagination-bullet-active': {
      'color': '#fff',
      'background': (props: any) => props.paginationColor
    },
    
    '& .swiper-pagination': {
      bottom: '50px !important',
      textAlign: 'left !important',
      marginLeft: '105px !important'
    }
  }
}));
