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
  const { id: realmId } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [showModal, setShowModal] = React.useState<boolean>(false);
  const [graphData, setGraphData] = React.useState<any>(null);
  const [hoverNode, setHoverNode] = React.useState<any>(null);
  const [hoverLink, setHoverLink] = React.useState<any>(null);
  const [realmData, setRealmData] = React.useState<any>({});
  const [extensionData, setExtensionData] = React.useState<any>({});
  const [openNotAppModal, setOpenNotAppModal] = React.useState<boolean>(false);
  const [showPlayModal, setShowPlayModal] = React.useState<boolean>(false);
  const [openContentPreview, setOpenContentPreview] = React.useState<boolean>(false);

  const graphRef = React.useRef<ForceGraphMethods>();

  React.useEffect(() => {
    if (realmId) {
      loadRealm(realmId);
    }
  }, [realmId]);

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

  const mockImgs = [
    "https://elb.ipfsprivi.com:8080/ipfs/QmUXfoKUo6kWmaqgRiaTXLWbgsBtsPh26qrrqjqePhNwKF",
    "https://elb.ipfsprivi.com:8080/ipfs/Qmax1HaER2xAqNw8pQZWwu9ugV27QyPDKDvk5QrZhRoDEL",
    "https://elb.ipfsprivi.com:8080/ipfs/QmZCrpmj9XoyG63fD5x389R7ymX3xGSSXEToGjoptr9PMy",
    "https://elb.ipfsprivi.com:8080/ipfs/Qme4oWwrJcTj72SZs89kM3LfEWKDawrsg9Cyhmk2yzoCUZ",
    "https://elb.ipfsprivi.com:8080/ipfs/Qmexie8YMYxsxPx8p2xBhH9zxakDHJS6bmALa8cMFoxsdG",
  ]

  const loadRealm = realmId => {
    setIsLoading(true);
    MetaverseAPI.getWorld(realmId)
      .then(res => {
        if (res && res.data && res.data.extensions && res.data.extensions.length > 0) {
          setRealmData(res.data);
          let extensions = res.data.extensions;
          //mock data for test * 200 data and change id ==> start//
          let mockData: any[] = [];
          let mockId = 1;
          extensions.forEach(ele => {
            for (let i = 0; i < 1000; i++) {
              let mock = JSON.parse(JSON.stringify(ele));
              mock.id = mockId;
              mock.worldBannerImage = mockImgs[Math.round(Math.random() * (mockImgs.length - 1))]
              mock.worldImages = mockImgs[Math.round(Math.random() * (mockImgs.length - 1))]
              mock.worldTitle = "test title test title test title test title test title test title test title test title test title - " + mockId
              mock.worldShortDescription = "test description test description test description test description test description test description test description test description test description test description  - " + mockId
              mockData.push(mock);
              mockId++;
            }
          });
          extensions = mockData;
          //mock data for test * 200 data and change id ==> end//

          setGraphData({
            nodes: extensions.map(extension => ({
              id: extension.id,
              data: extension,
            })),
            links: extensions.map(extension => ({
              source: extension.id,
              target: extensions[Math.round(Math.random() * (extensions.length - 1))].id
            }))
          });
        }
      })
      .finally(() => setIsLoading(false));
  };

  const drawCircle = (isHover = false) => {
    let canvas = document.createElement("canvas");
    canvas.id = "canvas";
    canvas.width = 32;
    canvas.height = 32;
    let ctx = canvas.getContext("2d");
    let PI2 = Math.PI * 2;
    if (ctx) {
      ctx.arc(16, 16, 16, 0, PI2, true);

      if (isHover) {
        ctx.fillStyle = "red";
      } else {
        ctx.fillStyle = "blue";
      }

      ctx.fill();
      ctx.stroke();
    }
    return canvas;
  }

  const onCloseModal = () => {
    setShowModal(false);
    setExtensionData(null);
  }

  const onClickHandler = (node) => {
    console.log("node_info", node);
    setExtensionData(node.data);
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
    if (extensionData?.worldIsExtension) {
      setOpenContentPreview(true);
    } else {
      history.push(`/realms/${extensionData.id}`);
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
            worldId: realmId,
            worldTitle: realmData.worldTitle,
            worldAssetUrl: realmData.worldAssetUrl,
            worldTag: realmData.worldTag,
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
            node.data && node.data.isFeature
              ? node.data.worldBannerImage
                ? `url("${node.data.worldBannerImage}")`
                : `url(${getDefaultImageUrl()})`
              : node.data.worldImages
                ? `url("${node.data.worldImages}")`
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
            linkWidth={link => link === hoverLink ? 2 : 1}
            nodeThreeObject={(node) => {
              let imageTexture;
              let hasBlur = false;
              if (extensionData != null && extensionData.id === node.id) {
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
                    extensionData && extensionData.isFeature
                      ? extensionData.worldBannerImage
                        ? `url("${extensionData.worldBannerImage}")`
                        : `url(${getDefaultImageUrl()})`
                      : extensionData.worldImages
                        ? `url("${extensionData.worldImages}")`
                        : `url(${getDefaultImageUrl()})`,
                }}>
              </Box>
              <Box className={classes.picLabel}>
                {extensionData.worldIsExtension ? (
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
              {extensionData && extensionData.worldTitle ? extensionData.worldTitle : ""}
            </Box>
            <Box className={classes.description}>
              {extensionData && extensionData.worldShortDescription ? extensionData.worldShortDescription : ""}
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
            nftId={extensionData?.id}
            isOwner={extensionData?.creatorId === userSelector.id}
            onClose={handleClose}
            handleRefresh={() => { }}
          />
        )}
      </div>
    </>
  );
}
