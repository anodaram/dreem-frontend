//apps component
import React from "react";
import StyledCheckbox from "shared/ui-kit/Checkbox";
import CustomSwitch from "shared/ui-kit/CustomSwitch";
import Box from "shared/ui-kit/Box";

const appOptionsMailIcon = require("assets/icons/icon_email.png");
const appOptionsStoreIcon = require("assets/icons/icon_store.png");
const appOptionsTwitterIcon = require("assets/icons/icon_twitter.png");
const appOptionsFacebookIcon = require("assets/icons/icon_facebook.png");

const communityFieldByType = {
  Blog: "BlogsEnabled",
  "Member Directory": "MemberDirectoriesEnabled",
  Projects: "ProjectsEnabled",
  Apps: "AppsEnabled",
};

//community apps
const blogOptions = ["Blog option 1", "Blog option 2", "Blog option 3", "Blog option 4"];
const memberDirectoryOptions = [
  "Member dir. option 1",
  "Member dir. option 2",
  "Member dir. option 3",
  "Member dir. option 4",
];
const projectOptions = ["Project option 1", "Project option 2", "Project option 3", "Project option 4"];
const appOptions = [
  { icon: appOptionsMailIcon, name: "App 1" },
  { icon: appOptionsStoreIcon, name: "App 2" },
  { icon: appOptionsTwitterIcon, name: "App 3" },
  { icon: appOptionsFacebookIcon, name: "App 4" },
];

const CommunityApps = p => {
  const { type, community, canEdit, setCommunity } = p;

  return (
    <Box className="community-container">
      <Box className="header">
        <b
          className={
            type === "Blog"
              ? !community.BlogsEnabled
                ? "unselected"
                : undefined
              : type === "Member Directory"
                ? !community.MemberDirectoriesEnabled
                  ? "unselected"
                  : undefined
                : type === "Projects"
                  ? !community.ProjectsEnabled
                    ? "unselected"
                    : undefined
                  : type === "Apps"
                    ? !community.AppsEnabled
                      ? "unselected"
                      : undefined
                    : undefined
          }
        >
          {type}
        </b>
        <Box className="option-buttons" style={{ background: "transparent", height: "fit-content" }}>
          <CustomSwitch checked={!canEdit} onChange={() =>
            setCommunity({
              ...community,
              [communityFieldByType[type]]: true,
            })
          } />
        </Box>
      </Box>
      {p.type === "Blog"
        ? blogOptions.map((option, index) => {
          return (
            <Box className="row" key={option}>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 400 }}>{option}</p>
              <StyledCheckbox
                disabled={!canEdit}
                checked={community.Blogs[index]}
                onChange={() => {
                  if (community.BlogsEnabled) {
                    setCommunity({
                      ...community,
                      Blogs: community.Blogs.map((val, i) => (i === index ? !val : val)),
                    });
                  }
                }}
              />
            </Box>
          );
        })
        : p.type === "Member Directory"
          ? memberDirectoryOptions.map((option, index) => {
            return (
              <Box className="row" key={option}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 400 }}>{option}</p>
                <StyledCheckbox
                  disabled={!canEdit}
                  checked={community.MemberDirectories[index]}
                  onChange={() => {
                    if (community.MemberDirectoriesEnabled) {
                      setCommunity({
                        ...community,
                        MemberDirectories: community.MemberDirectories.map((val, i) =>
                          i === index ? !val : val
                        ),
                      });
                    }
                  }}
                />
              </Box>
            );
          })
          : p.type === "Projects"
            ? projectOptions.map((option, index) => {
              return (
                <Box className="row" key={option}>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 400 }}>{option}</p>
                  <StyledCheckbox
                    disabled={!canEdit}
                    checked={community.Projects[index]}
                    onChange={() => {
                      if (community.ProjectsEnabled) {
                        setCommunity({
                          ...community,
                          Projects: community.Projects.map((val, i) => (i === index ? !val : val)),
                        });
                      }
                    }}
                  />
                </Box>
              );
            })
            : p.type === "Apps"
              ? appOptions.map((option, index) => {
                return (
                  <Box className="row" key={option.name}>
                    <Box className="app">
                      <img src={option.icon} alt="otpion" />
                      <p style={{ margin: 0, fontSize: 14, fontWeight: 400 }}>{option.name}</p>
                    </Box>
                    <StyledCheckbox
                      disabled={!canEdit}
                      checked={community.Apps[index]}
                      onChange={() => {
                        if (community.AppsEnabled) {
                          setCommunity({
                            ...community,
                            Apps: community.Apps.map((val, i) => (i === index ? !val : val)),
                          });
                        }
                      }}
                    />
                  </Box>
                );
              })
              : null}
    </Box>
  );
};

export default CommunityApps;
