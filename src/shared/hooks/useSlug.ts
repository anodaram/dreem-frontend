import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store/reducers/Reducer";
import { useLocation } from "react-router-dom";
import URL from "shared/functions/getURL";
import axios from "axios";
import { setSlug } from "store/actions/Slug";

const useSlug = () => {
  const slugSelector = useSelector((state: RootState) => state.slug.slug);
  const [userId, setUserId] = useState<any>();

  const dispatch = useDispatch();
  let location = useLocation();

  useEffect(() => {
    if (
      location &&
      location.pathname.split("/").length > 2 &&
      ((location.pathname.includes("profile") && !location.pathname.includes("/0x")) ||
        (location.pathname.includes("social") && !location.pathname.includes("/0x")) ||
        location.pathname.includes("communities") ||
        location.pathname.toLowerCase().includes("daos") ||
        location.pathname.includes("FT") ||
        location.pathname.includes("/credit-pools"))
    ) {
      const idUrl =
        (location.pathname.split("/").length === 3 &&
          location.pathname.includes("profile") &&
          !location.pathname.includes("/0x")) ||
        (location.pathname.split("/").length === 3 &&
          location.pathname.includes("social") &&
          !location.pathname.includes("/0x")) ||
        location.pathname.includes("communities") ||
        location.pathname.toLowerCase().includes("daos")
          ? location.pathname.split("/")[2]
          : location.pathname.split("/").length === 4 &&
            (location.pathname.includes("FT") || location.pathname.includes("/credit-pools"))
          ? location.pathname.split("/")[3]
          : "";

      if (idUrl && idUrl !== "") {
        if ((slugSelector !== "" && !location.pathname.includes(slugSelector)) || slugSelector === "") {
          let path = "";
          if (
            (location.pathname.includes("profile") && !location.pathname.includes("/0x")) ||
            (location.pathname.includes("social") && !location.pathname.includes("/0x"))
          ) {
            path = `${URL()}/user/getSlugfromId/${idUrl}/user`;
          } else if (
            location.pathname.includes("communities") ||
            location.pathname.toLowerCase().includes("daos")
          ) {
            path = `${URL()}/community/getSlugfromId/${idUrl}/community`;
          } else if (location.pathname.includes("MediaNFT")) {
            path = `${URL()}/mediaPod/getSlugfromId/${idUrl}/mediapod`;
          } else if (location.pathname.includes("/NFT")) {
            path = `${URL()}/pod/getSlugfromId/${idUrl}/nftpod`;
          } else if (location.pathname.includes("/FT")) {
            path = `${URL()}/pod/getSlugfromId/${idUrl}/ftpod`;
          } else if (location.pathname.includes("credit-pools")) {
            path = `${URL()}/priviCredit/getSlugfromId/${idUrl}/credit`;
          }

          if (path !== "") {
            axios
              .get(path)
              .then(response => {
                if (response.data.success) {
                  setUserId(response.data.data.id);
                  if (slugSelector !== response.data.data.urlSlug) {
                    const dispatchSlug = async () => {
                      await dispatch(setSlug(response.data.data.urlSlug));
                    };

                    dispatchSlug();
                  }
                } else {
                  const dispatchUrlAsSlug = async () => {
                    await dispatch(setSlug(idUrl));
                  };

                  dispatchUrlAsSlug();
                }
              })
              .catch(error => {
                console.log(error);
              });
          }
        }
      }
    } else {
      const dispatchEmptySlug = async () => {
        await dispatch(setSlug(""));
      };

      dispatchEmptySlug();
    }
  }, [location]);

  return [slugSelector, userId];
};

export { useSlug };
