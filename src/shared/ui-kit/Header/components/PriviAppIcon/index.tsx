import React from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { Hidden } from "@material-ui/core";

type WrapperProps = React.PropsWithChildren<{
  isMusic: boolean;
  isArt: boolean;
  isZoo: boolean;
}>;

const Wrapper = styled.div<WrapperProps>`
  background: ${p => `${!p.isZoo && p.isArt ? "#9eacf2" : "inherit"}`};
  padding: ${p => `${!p.isZoo && p.isArt ? "20px 36px" : "0"}`};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-right: ${p =>
    `${p.isZoo ? "120px" : !p.isZoo && p.isMusic ? "35px" : !p.isZoo && p.isArt ? "0px" : "48px"}`};
  cursor: pointer;
  @media (max-width: 768px) {
    border-bottom: none;
  }
  @media only screen and (max-width: 414px) {
    margin-right: 0px;
    img:first-child {
      width: 128px;
    }
  }
  img:first-child:not(> div img) {
    width: 120px;
  }
  > div > img {
    margin-left: 15px;
    width: 10px !important;
  }
`;

export default function PriviAppIcon(props) {
  const history = useHistory();
  const pathName = window.location.href;

  const pathPrefix = React.useMemo(() => {
    const pathPrefixList = pathName.split("/");
    return pathPrefixList.length > 4 ? pathPrefixList[4] : "zoo";
  }, [pathName]);

  return (
    <Wrapper
      isMusic={pathPrefix !== "trax" && pathPrefix === "privi-music"}
      isArt={pathPrefix === "pix"}
      isZoo={pathPrefix === "zoo"}
    >
      <img className='app-logo' onClick={() => history.push("/")} src={require("assets/logos/dreem_logo.svg")} alt="privi" />
    </Wrapper>
  );
}
