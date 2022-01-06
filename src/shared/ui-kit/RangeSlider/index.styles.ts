import { makeStyles } from '@material-ui/core/styles';

export const useRangeSliderStyles = makeStyles({
  root: ({ variant }: any) => {
    return {
      width: "100%",
      background: "rgba(255, 255, 255, 0.57)",
      border: "1px solid rgba(165, 165, 165, 0.5)",
      boxSizing: "border-box",
      backdropFilter: "blur(8px)",
      /* Note: backdrop-filter has minimal browser support */
      padding: "0 12px",
      borderRadius: "35px",

      "& .MuiSlider-rail": {
        height: "7px",
        borderRadius: "4px",
        opacity: 1,
        background:
          variant === 'primary' 
            ? "linear-gradient(90deg, #B5F400 0%, #B5F400 15.64%, #FFE600 32.88%, #FFE600 42.11%, #FF6B00 65.18%, #FF0F00 75.74%, #C70000 100%)"
            : "linear-gradient(90deg, #C70000 0%, #FF0F00 15.64%, #FF6B00 32.88%, #FFE600 42.11%, #FFE600 65.18%, #B5F400 75.74%, #B5F400 100%)"
      },

      "& .MuiSlider-track": {
        backgroundColor: "transparent"
      },

      "& .MuiSlider-thumb": {
        height: "38px",
        width: "13px",
        borderRadius: "7px",
        border: "4px solid white",
        boxShadow: "0px 3px 9px rgb(0 0 0 / 21%)",
        marginTop: "-15px"
      }
    }
  },
});
