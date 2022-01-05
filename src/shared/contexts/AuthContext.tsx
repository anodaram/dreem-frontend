import React, { createContext, useContext, useMemo, useState, useEffect } from "react";

type AuthContextType = {
  isOnSigning: boolean;
  setOnSigning: (val: boolean) => void;
  isSignedin: boolean;
  setSignedin: (val: boolean) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthContextProvider: React.FunctionComponent = ({ children }) => {
  const [isSignedin, setIsSignedin] = useState<boolean>(false);
  const [isOnSigning, setIsOnSigning] = useState<boolean>(false);

  const setSignedin = (val: boolean) => {
    setIsSignedin(val);
  };

  const setOnSigning = (val: boolean) => {
    setIsOnSigning(val);
  };

  useEffect(() => {
    setIsSignedin(!!localStorage.getItem("token"));
  }, []);

  const context = useMemo<AuthContextType>(
    () => ({
      isOnSigning,
      setOnSigning,
      isSignedin,
      setSignedin,
    }),
    [setSignedin]
  );

  return <AuthContext.Provider value={context}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth hook must be used inside AuthContextProvider");
  }
  return context;
};
