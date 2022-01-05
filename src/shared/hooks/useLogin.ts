import React, { useEffect, useState } from "react";

const useLogin = () => {
  const [isSignedIn, setIsSignedIn] = useState<boolean>(true);

  useEffect(() => {
    let token: string = localStorage.getItem("token") || "";
    let userId: string = localStorage.getItem("userId") || "";

    if (!token || token === "" || token === "undefined" || !userId || userId === "" || userId === "undefined") {
      setIsSignedIn(false);
    } else {
      setIsSignedIn(true);
    }
  });

  return isSignedIn;
};

export { useLogin };