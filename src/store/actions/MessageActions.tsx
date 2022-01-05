export const openMessageBox = (data) => {
    return {
      type: "OPEN_MESSAGE_BOX",
      payload: data,
    };
  };
export const closeMessageBox = () => {
    return {
        type: "CLOSE_MESSAGE_BOX"
    };
}

export const setMessage = (data) => {
  return {
    type: "SET_MESSAGE",
    payload: data
  };
}

export const sentMessage = () => {
  return {
    type: "SENT_MESSAGE"
  }
}

export const setChat = (data) => {
  return {
    type: "SET_CHAT",
    payload: data
  };
}

export const startChat = (data) => {
  return {
    type: "START_CHAT",
    payload: data
  };
}

export const addChatInList = (data) => {
  return {
    type: "ADD_CHAT_IN_LIST",
    payload: data
  };
}

export const endChat = (data) => {
  return {
    type: "END_CHAT",
    payload: data
  };
}

export const updateChat = (data) => {
  return {
    type: "UPDATE_CHAT",
    payload: data
  };
}

export const setChatUsers = (data) => {
  return {
    type: "SET_CHAT_USERS",
    payload: data
  };
}


export const openChatModal = (data) => {
  return {
    type: "OPEN_CHAT_MODAL",
    payload: data
  }
}

export const closeChatModal = () => {
  return {
    type: "CLOSE_CHAT_MODAL"
  }
}

export const openNewChatModal = () => {
  return {
    type: "OPEN_NEW_CHAT_MODAL"
  }
}

export const closeNewChatModal = () => {
  return {
    type: "CLOSE_NEW_CHAT_MODAL"
  }
}
