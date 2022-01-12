import { makeStyles } from "@material-ui/core/styles";

export const useImageCropModalStyles = makeStyles((theme) => ({
  content: {
    backgroundColor: "#ffffff !important",
    boxShadow: "0px 38px 96px 17px rgba(1, 1, 13, 0.25)",
    color: "#181818 !important",
    borderRadius: "0 !important",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection:"column",
    padding: "58px 32px 16px 32px !important",
  },
  modalContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  cropContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
    background: '#333',
    [theme.breakpoints.up('sm')]: {
      height: 400,
    },
  },
  controls: {
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  },
  sliderContainer: {
    display: 'flex',
    flex: '1',
    alignItems: 'center',
  },
  sliderLabel: {
    [theme.breakpoints.down('xs')]: {
      minWidth: 65,
    },
  },
  slider: {
    padding: '22px 0px',
    marginLeft: 16,
    minWidth: 150,
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
      alignItems: 'center',
      margin: '0 16px',
    },
  },
}))