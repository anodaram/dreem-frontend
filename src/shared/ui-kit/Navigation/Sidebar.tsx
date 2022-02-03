import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store/reducers/Reducer";

import { Link, List, ListItem } from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";
import { Fade, Tooltip } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { setSelectedUser } from "store/actions/SelectedUser";
import { closeMessageBox } from "store/actions/MessageActions";

import "./Sidebar.css";

const HtmlTooltip = withStyles(theme => ({
  tooltip: {
    backgroundColor: "#99a2b3",
    fontFamily: "Grifter",
    fontSize: "10px",
  },
  arrow: {
    color: "#99a2b3",
  },
}))(Tooltip);

export default function Sidebar() {
  const dispatch = useDispatch();
  const userSelector = useSelector((state: RootState) => state.user);

  const data = [
    {
      id: "profile",
      label: "Profile",
      to: `/profile/${userSelector.id}`,
      toProfileSlug: `/profile/${userSelector.urlSlug}`,
    },
    {
      id: "communities",
      label: "Communities",
      to: "/communities",
    },

    {
      id: "media",
      label: "Media",
      to: "/media",
    },
    {
      id: "pods",
      label: "Pods",
      to: "/pods",
    },
    {
      id: "collab",
      label: "Collab",
      to: "/collab",
    },
    {
      id: "wallet",
      label: "Wallet",
      to: "/wallet",
    },
    {
      id: "swap",
      label: "Swap",
      to: "/privi-swap",
    },
    {
      id: "credit",
      label: "Credit",
      to: "/lendings",
    },
    {
      id: "insurance",
      label: "Insurance",
      to: "/insurance",
    },
    {
      id: "index",
      label: "Indexes",
      to: "/index",
    },
    {
      id: "boost",
      label: "Boost",
      to: "/boost",
    },
    {
      id: "governance",
      label: "Governance",
      to: "/governance",
    },
    {
      id: "data",
      label: "Data",
      to: "/data",
    },
    {
      id: "growth",
      label: "Growth",
      to: "/growth",
    },
  ];

  if (!window.location.href.includes("/profile/0x")) {
    return (
      <div className="sidebar">
        <img src={require(`assets/logos/PRIVILOGO.png`)} alt="privi logo" className="logo" />
        <div className="main-menu">
          <List className="list-unstyled">
            {data &&
              data.map((item, index) => {
                if (index < 5)
                  return (
                    <ListItem
                      key={item.id}
                      selected={
                        item.id === "profile"
                          ? window.location.href.includes(`${item.to}`) ||
                            window.location.href.includes(`${item.toProfileSlug}`)
                          : window.location.href.includes(`${item.to}`)
                      }
                    >
                      <Link
                        to={item.to}
                        component={RouterLink}
                        onClick={() => {
                          if (item.id === "profile") {
                            let userId: any = localStorage.getItem("userId");
                            dispatch(setSelectedUser(userId));
                            dispatch(closeMessageBox());
                          }
                        }}
                      >
                        <HtmlTooltip
                          TransitionComponent={Fade}
                          TransitionProps={{ timeout: 600 }}
                          placement="right"
                          arrow
                          className="tooltipSidebarInfo"
                          title={item.label}
                        >
                          <div>
                            <img src={require(`assets/navbarIcons/${item.id}.png`)} alt={item.label} />
                          </div>
                        </HtmlTooltip>
                      </Link>
                    </ListItem>
                  );
              })}
            <div className="separator" />
            {data &&
              data.map((item, index) => {
                if (index >= 5 && index < 10)
                  return (
                    <ListItem key={item.id} selected={window.location.href.includes(`${item.to}`)}>
                      <Link to={item.to} component={RouterLink}>
                        <HtmlTooltip
                          TransitionComponent={Fade}
                          TransitionProps={{ timeout: 600 }}
                          placement="right"
                          arrow
                          className="tooltipSidebarInfo"
                          title={item.label}
                        >
                          <div>
                            <img src={require(`assets/navbarIcons/${item.id}.png`)} alt={item.label} />
                          </div>
                        </HtmlTooltip>
                      </Link>
                    </ListItem>
                  );
              })}
            <div className="separator" />
            {data &&
              data.map((item, index) => {
                if (index >= 10)
                  return (
                    <ListItem key={item.id} selected={window.location.href.includes(`${item.to}`)}>
                      <Link to={item.to} component={RouterLink}>
                        <HtmlTooltip
                          TransitionComponent={Fade}
                          TransitionProps={{ timeout: 600 }}
                          placement="right"
                          arrow
                          className="tooltipSidebarInfo"
                          title={item.label}
                        >
                          <div>
                            <img src={require(`assets/navbarIcons/${item.id}.png`)} alt={item.label} />
                          </div>
                        </HtmlTooltip>
                      </Link>
                    </ListItem>
                  );
              })}
          </List>
        </div>
      </div>
    );
  } else return null;
}
