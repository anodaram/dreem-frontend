import React from "react";
import { makeStyles, Popper, ClickAwayListener, Grow, Paper, MenuList, MenuItem } from "@material-ui/core";
import Box from "shared/ui-kit/Box";
import { Color } from "shared/constants/const";
import { useHistory, useLocation } from "react-router-dom";
import { useAuth } from "shared/contexts/AuthContext";

interface NavItemProps {
  name: string;
  value: string;
  subNavs?: NavItemProps[];
  link?: string;
  authorize?: boolean;
}

const LeftNavigations: NavItemProps[] = [
  { name: "PLAY", value: "play", link: "/play" },
  { name: "CREATE", value: "creations", link: "/create" },
  { name: "REALMS", value: "realms", link: "/realms" },
  { name: "AVATARS", value: "avatars", link: "/avatars" },
  { name: "ASSETS", value: "assets", link: "/assets" },
  { name: "GAME NFTS", value: "P2E", link: "/P2E" },
];

const RightNavigations: NavItemProps[] = [
  // { name: "Claim Dreem", value: "claim_dreem", link: "/claim_dreem", authorize: true },
];

const Navigations = LeftNavigations.concat(RightNavigations);

const useStyles = makeStyles({
  nav: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    cursor: "pointer",
    fontSize: 15,
    lineHeight: "190%",
    textTransform: "uppercase",
  },
  navText: {
    fontSize: "16px",
    fontWeight: 700,
    fontFamily: "GRIFTER",
    whiteSpace: "nowrap",
  },
  paper: {
    background: Color.White,
    boxShadow: "0px 8px 24px -5px rgba(71, 78, 104, 0.19), 0px 41px 65px -11px rgba(36, 46, 60, 0.1)",
    borderRadius: 12,
    "& .MuiList-root": {
      padding: "14px 16px",
      "& .MuiListItem-root.MuiMenuItem-root": {
        fontSize: 13,
        fontWeight: 600,
        fontFamily: "inherit",
        transition: "none",
        "&:hover": {
          color: Color.MusicDAOGreen,
          borderRadius: 12,
          background: "linear-gradient(0deg, #F2FBF6, #F2FBF6), #17172D",
        },
      },
    },
  },
});

const PriviMetaverseAppNavigation = () => {
  const classes = useStyles();

  const history = useHistory();
  const location = useLocation();
  const { isSignedin } = useAuth();

  const [selected, setSelected] = React.useState<NavItemProps | null>(null);

  const [openSubMenu, setOpenSubMenu] = React.useState<string | null>(null);

  const anchorNavMenuRef = React.useRef<(HTMLDivElement | null)[]>(Array(Navigations.length).fill(null));

  React.useEffect(() => {
    const selectedNav = Navigations.find(nav => {
      if (nav.subNavs) {
        const tmp = nav.subNavs.find(subNav => subNav.link === location.pathname);
        if (tmp) {
          return true;
        } else {
          return false;
        }
      } else {
        return location.pathname.includes(nav.link ?? "");
      }
    });

    if (selectedNav) {
      setSelected(selectedNav);
    } else {
      setSelected(null);
    }

    setOpenSubMenu(null);
  }, [location.pathname]);

  const handleOpenSubMenu = (nav: NavItemProps) => (event: React.MouseEvent<EventTarget>) => {
    event.stopPropagation();

    if (nav.subNavs) {
      setOpenSubMenu(nav.value);
    } else {
      // if (!isSignedin) {
      //   if (nav.value !== "play" && nav.value !=="creations") {
      //     return;
      //   }
      // }
      if (nav.link) {
        history.push(nav.link);
      }
    }
  };

  const handleCloseSubMenu = (index: number) => (event: React.MouseEvent<EventTarget>) => {
    const ref = anchorNavMenuRef.current[index];
    if (ref && ref.contains(event.target as HTMLElement)) {
      return;
    }
    setOpenSubMenu(null);
  };

  const handleListKeyDownSubMenu = (event: React.KeyboardEvent) => {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpenSubMenu(null);
    }
  };

  const handleClickSubMenu = (nav: NavItemProps) => (event: React.MouseEvent<EventTarget>) => {
    event.preventDefault();

    if (nav.link) history.push(nav.link);
  };

  const renderNavigationItem = (nav: NavItemProps, index) => {
    if (nav.authorize && !isSignedin) {
      return <></>;
    }

    return (
      <Box key={`privi-nav-${index}`} onClick={handleOpenSubMenu(nav)}>
        <div className={classes.nav} ref={ref => (anchorNavMenuRef.current[index] = ref)}>
          <Box
            color={nav.value === selected?.value ? Color.White : Color.GrayHeaderInvisible}
            mr={5.25}
            className={classes.navText}
          >
            {nav.name}
          </Box>
          {nav.subNavs && (
            <>
              <NavArrowDown
                color={nav.value === selected?.value ? Color.MusicDAOGreen : Color.GrayHeaderInvisible}
              />
              <Popper
                open={openSubMenu === nav.value}
                anchorEl={anchorNavMenuRef.current[index]}
                transition
                disablePortal={false}
                placement="bottom"
                style={{ zIndex: 100000 }}
              >
                {({ TransitionProps }) => (
                  <Grow {...TransitionProps}>
                    <Paper className={classes.paper}>
                      <ClickAwayListener onClickAway={handleCloseSubMenu(index)}>
                        <MenuList
                          autoFocusItem={openSubMenu === nav.value}
                          onKeyDown={handleListKeyDownSubMenu}
                        >
                          {nav.subNavs &&
                            nav.subNavs.map((subNav, subIndex) => (
                              <MenuItem
                                key={`sub-menu-item-${subNav.value}-${subIndex}`}
                                value={subNav.value}
                                onClick={handleClickSubMenu(subNav)}
                              >
                                {subNav.name}
                              </MenuItem>
                            ))}
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            </>
          )}
        </div>
      </Box>
    );
  };

  return (
    <Box display="flex" flexDirection="row" flexGrow="1" justifyContent="space-between">
      <Box display="flex" justifyItems="center">
        {LeftNavigations.map((nav, index) => renderNavigationItem(nav, index))}
      </Box>
      <Box display="flex" justifyItems="center">
        {RightNavigations.map((nav, index) => renderNavigationItem(nav, index))}
      </Box>
    </Box>
  );
};

export default PriviMetaverseAppNavigation;

const NavArrowDown = ({ color }) => (
  <svg width="8" height="5" viewBox="0 0 8 5" stroke={color} fill="none">
    <path d="M1 1L4 4L7 1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
