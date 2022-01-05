const INIT_STATE = {
  isOpenMessageBox: false,
  userInfo: {},
  message: "",
  isSendMessage: false,
  openChatModal: true,
  openNewChatModal: false,
  chat: {},
  chatUsers: {},
  activeChats: [],
  newChatInList: {},
};

const MessageBoxReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case "OPEN_MESSAGE_BOX":
      return {
        ...state,
        isOpenMessageBox: true,
        userInfo: action.payload,
      };
    case "CLOSE_MESSAGE_BOX":
      return {
        ...state,
        isOpenMessageBox: false,
      };
    case "SET_MESSAGE":
      return {
        ...state,
        message: action.payload,
        isSendMessage: true,
      };
    case "SENT_MESSAGE":
      return {
        ...state,
        message: "",
        isSendMessage: false,
      };
    case "OPEN_CHAT_MODAL":
      return {
        ...state,
        openChatModal: true,
        userInfo: action.payload,
      };
    case "CLOSE_CHAT_MODAL":
      return {
        ...state,
        openChatModal: false,
      };
    case "OPEN_NEW_CHAT_MODAL":
      return {
        ...state,
        openNewChatModal: true,
      };
    case "CLOSE_NEW_CHAT_MODAL":
      return {
        ...state,
        openNewChatModal: false,
      };
    case "SET_CHAT":
      return {
        ...state,
        chat: action.payload,
      };
    case "ADD_CHAT_IN_LIST":
      return {
        ...state,
        newChatInList: action.payload.chat,
      };
    case "START_CHAT":
      return {
        ...state,
        activeChats:
          state.activeChats.filter((item: any) => item.receipientId === action.payload.chat.receipientId)
            .length > 0
            ? state.activeChats.map((item: any) =>
                item.receipientId !== action.payload.chat.receipientId
                  ? item
                  : {
                      ...item,
                      hidden: false,
                    }
              )
            : [action.payload.chat, ...state.activeChats],
      };
    case "UPDATE_CHAT":
      return {
        ...state,
        activeChats: [
          action.payload.chat,
          ...state.activeChats.filter((item: any) => item.receipientId !== action.payload.chat.receipientId),
        ],
      };
    case "END_CHAT":
      return {
        ...state,
        activeChats: state.activeChats.map((item: any) =>
          item.receipientId !== action.payload.receipientId
            ? item
            : {
                ...item,
                hidden: true,
              }
        ),
      };
    case "SET_CHAT_USERS":
      return {
        ...state,
        chatUsers: action.payload,
      };

    default:
      return { ...state };
  }
};

export default MessageBoxReducer;
