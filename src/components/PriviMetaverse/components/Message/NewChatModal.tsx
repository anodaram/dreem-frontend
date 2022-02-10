import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { useDebounce } from "use-debounce/lib";

import { makeStyles, Avatar } from "@material-ui/core";

import { getUser } from "store/selectors/user";
import { closeNewChatModal, startChat, addChatInList } from "store/actions/MessageActions";

import { SearchInputBox } from "shared/ui-kit/SearchInputBox/SearchInputBox";
import { getDefaultAvatar } from "shared/services/user/getUserAvatar";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { sanitizeIfIpfsUrl } from "shared/helpers";

const useStyles = makeStyles({
  container: {
    backgroundColor: "white",
    boxShadow: "0px 2px 12px rgba(0, 0, 0, 0.1)",
    borderRadius: "14px 14px 0px 0px",
    width: 352,
    padding: "23.5px 23.5px 5px 23.5px",
    margin: "0px 8px",
    marginTop: "auto",
    height: "fitContent",
  },
  header: {
    marginBottom: 20,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
  },
  closeBtn: {
    "& img": {
      cursor: "pointer",
    },
  },
  title: {
    fontSize: 18,
    lineHeight: "104.5%",
    color: "#181818",
  },
  userList: {
    height: 330,
    display: "flex",
    flexDirection: "column",
    overflowY: "scroll",
  },
  userItem: {
    display: "flex",
    marginTop: 15,
    cursor: "pointer",
    "& img": {
      width: 32,
      height: 32,
      borderRadius: "50%",
      marginRight: 10,
    },
  },
  userInfo: {
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
    justifyContent: "center",
    marginLeft: "4px",
    flex: 1,
    overflow: "hidden",
  },
  userName: {
    fontSize: 14,
    lineHeight: "104.5%",
    color: "black",
    marginBottom: 6,
    overflow: "hidden",
    textOverflow: "ellipsis",
    width: "100%",
    display: "inline",
  },
  userSlug: {
    fontSize: 11,
    lineHeight: "104.5%",
    color: "#707582",
    overflow: "hidden",
    textOverflow: "ellipsis",
    width: "100%",
    display: "inline",
  },
  actionButtons: {
    display: "flex",
    alignItems: "center",
    "& img:first-child": {
      marginRight: 24,
      cursor: "pointer",
    },
  },
});

const NewChatModal = () => {
  const classes = useStyles();
  const location = useLocation();
  const dispatch = useDispatch();

  const scrollRef = useRef<any>();

  const userSelector = useSelector(getUser);
  const [keyword, setKeyword] = useState<string>("");
  const [minimize, setMinimize] = useState<boolean>(true);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [lastValue, setLastValue] = useState<string>("");
  const [hasMore, setHasMore] = useState<boolean>(true);

  const [debouncedKeyword] = useDebounce(keyword, 500);

  useEffect(() => {
    setLastValue("");
    setUsers([]);
    setHasMore(true);
    getUsers("");
  }, [debouncedKeyword]);

  const getUsers = value => {
    if (loading) return;
  };

  const handleScroll = React.useCallback(
    e => {
      const bottom =
        scrollRef?.current &&
        scrollRef?.current?.scrollHeight - scrollRef?.current?.scrollTop <=
        scrollRef?.current?.clientHeight + 100;
      if (bottom && hasMore) {
        getUsers(lastValue);
      }
    },
    [getUsers]
  );

  const handleClose = () => {
    dispatch(closeNewChatModal());
  };

  const handleClick = user => {
    if (!user) return;
    const newChat = {
      users: {
        userFrom: {
          userId: userSelector.id,
          userName: userSelector.firstName + " " + userSelector.lastName,
        },
        userTo: {
          userId: user.id,
          userName: user.name,
        },
      },
      receipientId: user.id,
    };
    if (location.pathname.includes("/messages")) {
      dispatch(
        addChatInList({
          chat: newChat,
        })
      );
    } else {
      dispatch(
        startChat({
          chat: newChat,
        })
      );
    }
  };

  const handleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMinimize(!minimize);
  };

  return (
    <div className={classes.container}>
      <div className={classes.header} onClick={handleMinimize}>
        <div className={classes.title}>New Message</div>
        <div className={classes.actionButtons}>
          {minimize === true ? (
            <img src={require("assets/icons/minimize.svg")} onClick={handleMinimize} />
          ) : null}
          <img src={require("assets/icons/cross_gray.png")} onClick={handleClose} />
        </div>
      </div>
      {minimize && (
        <>
          <SearchInputBox keyword={keyword} setKeyword={setKeyword} style={{ background: "#F2FBF6" }} />
          <br />
          <div className={classes.userList} ref={scrollRef} onScroll={handleScroll}>
            {users &&
              users
                .filter(user => {
                  if (user.id === userSelector.id) return false;
                  if (keyword.length > 0) return user.name.toLowerCase().includes(keyword.toLowerCase());
                  else return true;
                })
                .map((user, index) => {
                  return (
                    <div className={classes.userItem} key={index} onClick={() => handleClick(user)}>
                      <Avatar src={sanitizeIfIpfsUrl(user.imageUrl) ?? getDefaultAvatar()} alt={user.name} />
                      <div className={classes.userInfo}>
                        <div className={classes.userName}>{user.name}</div>
                        <div className={classes.userSlug} style={{ color: "#707582" }}>
                          @{user.urlSlug}
                        </div>
                      </div>
                    </div>
                  );
                })}
            <LoadingWrapper loading={loading} />
          </div>
        </>
      )}
    </div>
  );
};

export default NewChatModal;
