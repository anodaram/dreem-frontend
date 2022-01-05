import React from "react";
import loading from "assets/gifs/loading.gif";
import { usePromiseTracker } from "react-promise-tracker";

const LoadingIndicator = (): React.ReactElement => {
    const { promiseInProgress } = usePromiseTracker();
  
    const isSignedIn = (): boolean => {
      return !!localStorage.getItem("token");
    };
  
    return (
      <div>
        {promiseInProgress ? (
          <div className="promise-loading"
            style={{
              left: isSignedIn() ? 80 : 0,
              width: isSignedIn() ? "calc(100vw - 80px)" : "100vw",
            }}
          >
            <img src={loading} alt={"loading"} width={250} />
          </div>
        ) : (
          ""
        )}
      </div>
    );
  };
  
  export default LoadingIndicator;