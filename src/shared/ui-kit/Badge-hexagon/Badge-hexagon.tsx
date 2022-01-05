import React from "react";
import { Tooltip } from "@material-ui/core";
import "./Badge-hexagon.css";

import placeholderBadge from "assets/icons/badge.png";

const BadgeHexagon = (props: any) => {
  const setLoadingFailed = event => {
    event.target.src = placeholderBadge;
  };

  if (props.badge && props.badge.badgeId) {
    return (
      <div style={{ cursor: "pointer" }}>
        <Tooltip title={props.badge.Name}>
          <div className="hex container" style={props.style}>
            <div
              className={`hex ${props.isNormal ? 'normal' : ''}`}
              onClick={() => {
                props.onClickBadge && props.onClickBadge();
              }}
            >
              <img
                className="hexagonPhoto"
                src={props.badge && props.badge.url ? props.badge.url : "none"}
                alt="hexagon_badge"
                onError={setLoadingFailed}
              />
            </div>
          </div>
        </Tooltip>
      </div>
    );
  } else {
    return null;
  }
};

export default BadgeHexagon;
