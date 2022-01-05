const URLTraxSongRecognizer = (): string => {
  if (process.env.NODE_ENV === "development") {
    if (process.env.REACT_APP_ENV === "dev_ssl") {
      // When executing [ REACT_APP_ENV='dev_ssl' npm start ]
      return "http://localhost:3010";
    } else if (process.env.REACT_APP_ENV === "dev") {
      // When executing [ REACT_APP_ENV='dev' npm start ]
      return "https://trax-song-recognizer-jlnkf.ondigitalocean.app";
    } else {
      // When executing [ npm start ]
      return "https://trax-song-recognizer-jlnkf.ondigitalocean.app";
    }
    // When executing [ npm build ]
  } else {
    return "https://trax-song-recognizer-jlnkf.ondigitalocean.app";
  }
};

export default URLTraxSongRecognizer;
