import React from "react";
import { useSelector } from "react-redux";

import makeStyles from "@material-ui/core/styles/makeStyles";
import Popper from "@material-ui/core/Popper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener/ClickAwayListener";
import { RootState } from "store/reducers/Reducer";

import Box from "shared/ui-kit/Box";
import { ChooseWalletModal } from "shared/ui-kit/Modal/Modals/ChooseWalletModal";
import { Color, SignatureRequestModal } from "shared/ui-kit";
import { buildJsxFromObject } from "shared/functions/commonFunctions";
import { getUsersInfoList } from "store/selectors";
import { MenuItem, MenuList } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  container: {
    background: (p: any) => (p.theme === "meta" ? "#A1E2FF" : "rgba(0, 0, 0, 0.16)"),
    padding: theme.spacing(1),
    display: "flex",
    alignItems: "center",
    borderRadius: "50%",
    cursor: "pointer",
  },
  contentContainer: {
    background: "rgba(0, 0, 0, 0.7)",
    borderRadius: theme.spacing(1),
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
  },
  contentBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    background: "#7F6FFFaa",
    borderTopLeftRadius: theme.spacing(2),
    borderTopRightRadius: theme.spacing(2),
    position: "absolute",
    left: 0,
    top: 0,
  },
  itemContainer: {
    color: "white",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    fontSize: "22px",
    fontWeight: 600,
    "& img": {
      width: "20px",
    },
  },
}));

export const FruitSelect = ({
  fruitObject,
  members = [] as any,
  onGiveFruit = undefined as any,
  parentNode = undefined as HTMLElement | undefined,
  style = {},
  fruitWidth = 16,
  fruitHeight = 16,
  theme = "",
}) => {
  const classes = useStyles({ theme });
  const userSelector = useSelector((state: RootState) => state.user);
  const usersInfoList = useSelector(getUsersInfoList);

  const [appAnchorEl, setAppAnchorEl] = React.useState<null | HTMLElement>(null);
  const appPopperOpen = Boolean(appAnchorEl);
  const [openChooseWalletModal, setOpenChooseWalletModal] = React.useState<boolean>(false);
  const [openSignRequestModal, setOpenSignRequestModal] = React.useState<boolean>(false);

  const [signRequestModalDetail, setSignRequestModalDetail] = React.useState<any>(null);
  const [amount, setAmount] = React.useState<any>(0);

  const [showChildInParent, setShowChildInParent] = React.useState<boolean>(false);

  const childRef = React.useRef<any>();

  React.useEffect(() => {
    if (parentNode) {
      if (showChildInParent) {
        parentNode.appendChild(childRef.current);
      } else {
        if (childRef.current) {
          parentNode.removeChild(childRef.current);
        }
      }
    }
  }, [showChildInParent]);

  const handleFruit = type => {
    setShowChildInParent(false);
    if (onGiveFruit) {
      onGiveFruit(type);
    }
    setAppAnchorEl(null);
    // setOpenChooseWalletModal(true);
  };

  const handleSubmit = () => {};

  const getChildInParent = () => {
    return (
      <div
        className={classes.contentBox}
        style={{
          width: parentNode?.clientWidth || "100%",
          height: parentNode?.clientHeight || "100%",
        }}
        ref={childRef}
      >
        <Box className={classes.itemContainer} mb={2} onClick={() => handleFruit(1)}>
          <img src={require("assets/emojiIcons/watermelon.png")} />
          <Box ml={1}>{fruitObject.fruits?.filter(fruit => fruit.fruitId === 1)?.length || 0}</Box>
        </Box>
        <Box className={classes.itemContainer} mb={2} onClick={() => handleFruit(2)}>
          <img src={require("assets/emojiIcons/avocado.png")} />
          <Box ml={1}>{fruitObject.fruits?.filter(fruit => fruit.fruitId === 2)?.length || 0}</Box>
        </Box>
        <Box className={classes.itemContainer} onClick={() => handleFruit(3)}>
          <img src={require("assets/emojiIcons/orange.png")} />
          <Box ml={1}>{fruitObject.fruits?.filter(fruit => fruit.fruitId === 3)?.length || 0}</Box>
        </Box>
      </div>
    );
  };

  return (
    <>
      <Box
        className={classes.container}
        onClick={e => {
          e.stopPropagation();
          if (parentNode) {
            setShowChildInParent(prev => !prev);
          } else {
            setAppAnchorEl(e.currentTarget);
          }
        }}
        style={style}
      >
        <img src={require("assets/emojiIcons/fruits.png")} width={fruitWidth} height={fruitHeight} />
      </Box>
      {parentNode && (
        <Box width="0px" height="0px" overflow="hidden" style={{ display: "none" }}>
          {getChildInParent()}
        </Box>
      )}
      {!parentNode && (
        <Popper
          open={appPopperOpen}
          anchorEl={appAnchorEl}
          transition
          placement="top-end"
          style={{ zIndex: 9999 }}
          // disablePortal
        >
          <ClickAwayListener
            onClickAway={() => {
              setAppAnchorEl(null);
            }}
          >
            <MenuList autoFocusItem={appPopperOpen} className={classes.contentContainer}>
              <MenuItem>
                <Box className={classes.itemContainer} mb={1} onClick={() => handleFruit(1)}>
                  <img src={require("assets/emojiIcons/watermelon.png")} />
                  <Box ml={1}>{fruitObject.fruits?.filter(fruit => fruit.fruitId === 1)?.length || 0}</Box>
                </Box>
              </MenuItem>
              <MenuItem>
                <Box className={classes.itemContainer} mb={1} onClick={() => handleFruit(2)}>
                  <img src={require("assets/emojiIcons/avocado.png")} />
                  <Box ml={1}>{fruitObject.fruits?.filter(fruit => fruit.fruitId === 2)?.length || 0}</Box>
                </Box>
              </MenuItem>
              <MenuItem>
                <Box className={classes.itemContainer} onClick={() => handleFruit(3)}>
                  <img src={require("assets/emojiIcons/orange.png")} />
                  <Box ml={1}>{fruitObject.fruits?.filter(fruit => fruit.fruitId === 3)?.length || 0}</Box>
                </Box>
              </MenuItem>
            </MenuList>
          </ClickAwayListener>
        </Popper>
      )}
      {openChooseWalletModal && (
        <ChooseWalletModal
          isOpen={openChooseWalletModal}
          onClose={() => {
            setOpenChooseWalletModal(false);
          }}
          onAccept={() => {
            setOpenChooseWalletModal(false);
            let payload: any = {
              Token: fruitObject.TokenSymbol || "USDT",
              From: userSelector.address,
              To: members
                .filter(user => user.id !== userSelector.id)
                .map(user => usersInfoList?.find(item => item.id === user.id)?.address || ""),
              Amount: amount,
              Type: "transfer",
            };
            setSignRequestModalDetail(buildJsxFromObject(payload));
            setOpenSignRequestModal(true);
          }}
        />
      )}
      {openSignRequestModal && (
        <SignatureRequestModal
          open={openSignRequestModal}
          address={userSelector.address}
          transactionFee="0.0000"
          detail={signRequestModalDetail}
          handleOk={handleSubmit}
          handleClose={() => setOpenSignRequestModal(false)}
        />
      )}
    </>
  );
};
