import React from "react";
import { useHistory, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { realmMapPageStyles } from "./index.styles";
import ForceGraph3D, { ForceGraphMethods } from "react-force-graph-3d";
import { Sprite, SpriteMaterial } from "three";
import * as THREE from "three";
import * as MetaverseAPI from "shared/services/API/MetaverseAPI";
import { Box } from "@material-ui/core";
import { CloseIcon } from "shared/ui-kit/Icons";
import { getDefaultImageUrl } from "shared/services/user/getUserAvatar";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { detectMob } from "shared/helpers";
import axios from "axios";
import { METAVERSE_URL } from "shared/functions/getURL";
import OpenDesktopModal from "components/PriviMetaverse/modals/OpenDesktopModal";
import customProtocolCheck from "custom-protocol-check";
import NotAppModal from "components/PriviMetaverse/modals/NotAppModal";
import ContentPreviewModal from "components/PriviMetaverse/modals/ContentPreviewModal";
import ReactDOMServer from 'react-dom/server';
import { getUser } from "store/selectors/user";

export default function RealmMapPage() {
  const classes = realmMapPageStyles();
  const history = useHistory();
  const userSelector = useSelector(getUser);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [showModal, setShowModal] = React.useState<boolean>(false);
  const [graphData, setGraphData] = React.useState<any>(null);
  const [hoverNode, setHoverNode] = React.useState<any>(null);
  const [hoverLink, setHoverLink] = React.useState<any>(null);
  const [mapData, setMapData] = React.useState<any>({});
  const [selMap, setSelMap] = React.useState<any>({});
  const [openNotAppModal, setOpenNotAppModal] = React.useState<boolean>(false);
  const [showPlayModal, setShowPlayModal] = React.useState<boolean>(false);
  const [openContentPreview, setOpenContentPreview] = React.useState<boolean>(false);

  const graphRef = React.useRef<ForceGraphMethods>();

  React.useEffect(() => {
    loadMap();
  }, []);

  React.useEffect(() => {
    if (mapData) {
      const nodes: any[] = [];
      const links: any[] = [];
      for (const key in mapData) {
        const map = mapData[key];
        nodes.push({
          id: key,
          data: map.item,
        });
        map.graphMetadata?.nodes?.map((target) => {
          links.push({
            source: key,
            target
          });
        });
      }
      setGraphData({
        nodes,
        links
      });
    }
  }, [mapData]);

  const EnterIcon = () => (
    <svg width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="15.418" cy="15.0957" r="15" fill="black" />
      <path
        d="M23.418 15.0957L11.418 22.0239L11.418 8.1675L23.418 15.0957Z"
        fill="url(#paint0_linear_enter_2783)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_enter_2783"
          x1="23.418"
          y1="6.61329"
          x2="22.6366"
          y2="25.9524"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#EEFF21" />
          <stop offset="1" stopColor="#B7FF5C" />
        </linearGradient>
      </defs>
    </svg>
  );

  const loadMap = () => {
    setIsLoading(true);
    MetaverseAPI.getMapData()
      .then(res => {
        if (res && res.data) {
          setMapData(res.data);
        }
      })
      .finally(() => setIsLoading(false));
  }

  const onCloseModal = () => {
    setShowModal(false);
    setSelMap(null);
  }

  const onClickHandler = (node) => {
    setSelMap(node.data);
    setShowModal(true);
    const distance = 100;
    const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

    (graphRef !== undefined) && graphRef.current && graphRef.current.cameraPosition(
      { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // new position
      node, // lookAt ({ x, y, z })
      3000  // ms transition duration
    );
  }

  const handleDetail = () => {
    if (selMap?.worldIsExtension) {
      setOpenContentPreview(true);
    } else {
      history.push(`/realms/${selMap.id}`);
    }
  }
  const handleClose = e => {
    e.preventDefault();
    e.stopPropagation();
    setOpenContentPreview(false);
  };
  
  const handlePlay = () => {
    if (detectMob()) {
      setShowPlayModal(true);
    } else {
      const token = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      axios
        .post(
          `${METAVERSE_URL()}/getSessionHash/`,
          {
            worldId: selMap.id,
            worldTitle: selMap.worldTitle,
            worldAssetUrl: selMap.worldAssetUrl,
            worldTag: selMap.worldTag,
          },
          config
        )
        .then(res => {
          let data: any = res.data?.data?.stamp;
          if (data) {
            customProtocolCheck(
              "dreem://" + data,
              () => {
                setOpenNotAppModal(true);
              },
              () => {
                console.log("successfully opened!");
              },
              3000
            );
          }
        });
    }
  };

  const getNodeLabel = (node) => {
    return ReactDOMServer.renderToStaticMarkup
      (<div style={{
        position: "absolute",
        top: -250,
        right: -100,
        width: 200,
        height: 200,
        borderRadius: 300,
        border: "solid 2px #e9ff26",
        padding: 10,
      }}>
        <div style={{
          width: "100%",
          height: "100%",
          borderRadius: 300,
          backgroundImage:
            node.data && node.data.worldImage
              ? `url("${node.data.worldImage}")`
              : `url(${getDefaultImageUrl()})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          overflow: "hidden",
        }}>
          <div
            style={{
              backgroundColor: "#e9ff26",
              opacity: 0.7,
              width: "100%",
              height: "100%",
            }}>
          </div>
        </div>
      </div>)
  };

  const handleNodeHover = node => {
    setHoverNode(node);
  };

  const handleLinkHover = link => {
    setHoverLink(link);
  };

  const imgNodeNormal = new THREE.TextureLoader().load(require("assets/metaverseImages/node_normal.png"));
  const imgNodeHover = new THREE.TextureLoader().load(require("assets/metaverseImages/node_sel.png"));
  const imgNodeSel = new THREE.TextureLoader().load(require("assets/metaverseImages/node_sel.png"));

  return (
    <>
      <div className={classes.mainContent}>
        {!isLoading && (graphData !== null) && (
          <ForceGraph3D
            ref={graphRef}
            nodeLabel={node => getNodeLabel(node)}
            linkOpacity={1}
            graphData={graphData}
            backgroundColor="#00000000"
            linkColor={link => link === hoverLink ? "#78a9e6" : "#076fd0"}
            linkWidth={link => link === hoverLink ? 1 : 0.5}
            nodeThreeObject={(node) => {
              let imageTexture;
              let hasBlur = false;
              if (selMap != null && selMap.versionHashId === node.id) {
                imageTexture = imgNodeSel;
                hasBlur = true;
              }
              else if (hoverNode !== null && node.id === hoverNode.id) {
                imageTexture = imgNodeHover;
                hasBlur = true;
              } else {
                imageTexture = imgNodeNormal;
              }

              imageTexture.needsUpdate = true;
              const material = new SpriteMaterial({
                map: imageTexture,
                transparent: true
              });
              const sprite = new Sprite(material);

              if (hasBlur) {
                sprite.scale.set(30, 30);
              } else {
                sprite.scale.set(12, 12);
              }
              return sprite;
            }}
            onNodeClick={node => onClickHandler(node)}
            onNodeHover={node => handleNodeHover(node)}
            onLinkHover={link => handleLinkHover(link)}
          />
        )}
        {showModal && (
          <Box className={classes.modalContainer}>
            <Box className={classes.closeButton} onClick={onCloseModal}>
              <CloseIcon />
            </Box>
            <Box className={classes.picContainer}>
              <Box className={classes.picBorder}>
                <Box className={classes.blueCircle} />
                <Box className={classes.blueCircleBlur} />
                <Box className={classes.yellowCircle} />
                <Box className={classes.yellowCircleBlur} />
              </Box>
              <Box className={classes.pic}
                style={{
                  backgroundImage:
                    (selMap && selMap.worldImage)
                      ? `url("${selMap.worldImage}")`
                      : `url(${getDefaultImageUrl()})`,
                }}>
              </Box>
              <Box className={classes.picLabel}>
                {selMap.worldIsExtension ? (
                  <Box padding="10px" display="flex">
                    <Box className={classes.extensionTag}>Extension</Box>
                  </Box>
                ) : (
                  <Box padding="10px" display="flex">
                    <Box className={classes.realmTag}>Realm</Box>
                  </Box>
                )}
              </Box>
            </Box>
            <Box className={classes.name}>
              {selMap && selMap.worldTitle ? selMap.worldTitle : ""}
            </Box>
            <Box className={classes.description}>
              {selMap && selMap.worldDescription ? selMap.worldDescription : ""}
            </Box>
            <SecondaryButton
              className={classes.btnDetail}
              size="medium"
              onClick={handleDetail}
            >
              SEE DETAILS
            </SecondaryButton>
            <PrimaryButton className={classes.btnEnter} size="medium" onClick={handlePlay}>
              <EnterIcon />
              <Box px={5} pt={0.5}>
                Enter realm
              </Box>
            </PrimaryButton>
          </Box>
        )}
        {openNotAppModal && (
          <NotAppModal
            open={openNotAppModal}
            onClose={() => {
              setOpenNotAppModal(false);
            }}
          />
        )}
        {showPlayModal && (
          <OpenDesktopModal isPlay open={showPlayModal} onClose={() => setShowPlayModal(false)} />
        )}
        {openContentPreview && (
          <ContentPreviewModal
            open={openContentPreview}
            nftId={selMap?.id}
            isOwner={selMap?.submitter?.user?.priviId === userSelector.id}
            onClose={handleClose}
            handleRefresh={() => { }}
          />
        )}
      </div>
    </>
  );
}
