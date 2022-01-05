const URLTraxMicroservice = (): string => {
  if (process.env.NODE_ENV === "development") {
    if (process.env.REACT_APP_ENV === "dev_ssl") {
      // When executing [ REACT_APP_ENV='dev_ssl' npm start ]
      return "https://localhost:3010";
    } else if (process.env.REACT_APP_ENV === "dev") {
      // When executing [ REACT_APP_ENV='dev' npm start ]
      return "http://localhost:3010";
    } else {
      // When executing [ npm start ]
      return "https://privi-trax-microservice-2k7nw.ondigitalocean.app";
    }
    // When executing [ npm build ]
  } else {
    return "https://privi-trax-microservice-2k7nw.ondigitalocean.app";
  }
};

export default URLTraxMicroservice;
