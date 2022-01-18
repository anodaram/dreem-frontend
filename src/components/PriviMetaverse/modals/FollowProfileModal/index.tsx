import React from "react";
import { useHistory } from "react-router-dom";

import { Modal } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { getDefaultAvatar } from "shared/services/user/getUserAvatar";
import { profileFollowsModalStyles } from "./index.styles";
import { StyledSkeleton } from "shared/ui-kit/Styled-components/StyledComponents";

const arePropsEqual = (prevProps, currProps) => {
  return (
    prevProps.open === currProps.open &&
    prevProps.header === currProps.header &&
    prevProps.list === currProps.list &&
    prevProps.isLoadingFollows === currProps.isLoadingFollows
  );
};

const ProfileFollowsModal = React.memo(
  ({
    list,
    onClose,
    open,
    header,
    isLoadingFollows,
    isOwner,
  }: {
    list: any[];
    onClose: () => void;
    open: boolean;
    header: "Followers" | "Followings";
    isLoadingFollows: boolean;
    isOwner: boolean;
  }) => {
    const classes = profileFollowsModalStyles();
    const history = useHistory();

    const goToProfile = (id: any) => {
      history.push(`/profile/${id}`);
      onClose();
    };

    return (
      <Modal className={classes.root} isOpen={open} onClose={onClose} showCloseIcon size="medium">
        <h3>Your {header}</h3>
        <LoadingWrapper theme="blue" loading={isLoadingFollows}>
          {!list || list.length === 0 ? (
            <div>No followers</div>
          ) : (
            <div className={classes.usersList}>
              {list.map((item, index) => {
                const avatar = (item.anon ? require(`assets/anonAvatars/${item.urlIpfsImage}`) : item.urlIpfsImage) || getDefaultAvatar();
                return (
                  <Box
                    className={classes.followRow}
                    padding="16px 24px 8px 16px"
                    marginTop="2px"
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    key={index}
                  >
                    <Box
                      alignItems="center"
                      display="flex"
                      width="100%"
                      justifyContent="space-between"
                      style={{ cursor: "pointer" }}
                      onClick={() => goToProfile(item.urlSlug ?? item.id)}
                    >
                      <Box display="flex" alignItems="center">
                        <div>
                          <div
                            className={classes.avatar}
                            style={{
                              backgroundImage: `url('${avatar}')`,
                              backgroundRepeat: "no-repeat",
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }}
                          />
                        </div>
                        <Box ml={"14px"}>
                          <Box color="#ffffff" fontSize={14}>
                            {item.name ?? item.firstName ?? <StyledSkeleton width={120} animation="wave" />}
                          </Box>
                        </Box>
                      </Box>
                      <LeftArrowIcon />
                    </Box>
                  </Box>
                );
              })}
            </div>
          )}
        </LoadingWrapper>
      </Modal>
    );
  },
  arePropsEqual
);

const LeftArrowIcon = () => (
  <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M1 9L5 5L1 1"
      stroke="url(#paint0_linear_3842_1039)"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <defs>
      <linearGradient
        id="paint0_linear_3842_1039"
        x1="1"
        y1="9.24121"
        x2="1.77763"
        y2="-0.381317"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#EEFF21" />
        <stop offset="1" stop-color="#B7FF5C" />
      </linearGradient>
    </defs>
  </svg>
);

export default ProfileFollowsModal;
