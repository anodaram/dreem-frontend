import React from "react";
import { useSelector } from "react-redux";
import ScrollToTop from "../../functions/ScrollToTop";
import Routes from "shared/routes/Routes";
import { useLogin } from "shared/hooks/useLogin";
import ChatModal from "shared/ui-kit/Modal/Modals/ChatModal";
import NewChatModal from "shared/ui-kit/Modal/Modals/NewChatModal";
import { getMessageBox } from "store/selectors/user";
import "./NavBar.css";

const NavBar = () => {
  const isLogin = useLogin();
  const messageBoxInfo = useSelector(getMessageBox);
  const { activeChats } = messageBoxInfo;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        minHeight: "100vh",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <ScrollToTop />
        <div id="app-container" className="containerClassnames">
          <div className="fullPageView">
            <main className={isLogin ? "fullPageView-main" : ""}>
              <div className="container-fluid">
                <Routes />
                <div className="chat-modal-container">
                  {activeChats.map(chat =>
                    chat && chat.users && chat.receipientId ? (
                      <ChatModal chat={chat} key={chat.receipientId} />
                    ) : null
                  )}
                  {messageBoxInfo.openNewChatModal && <NewChatModal />}
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
