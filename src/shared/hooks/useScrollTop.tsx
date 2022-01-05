import { useEffect } from "react";
import { withRouter } from "react-router-dom";

export const ScrollToTop = ({ history }) => {
  useEffect(() => {
    const unlisten = history.listen(() => {
      const scrollContainer = document.getElementById("scroll-container");

      if (scrollContainer) {
        scrollContainer.scrollTo(0, 0);
      }
    });
    return () => {
      unlisten();
    };
  }, []);

  return null;
};

export default withRouter(ScrollToTop);
