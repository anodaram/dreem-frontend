import { WSAEADDRINUSE } from "constants";

/**
 * Determines the back-end URL depending on two factors:
 * - Environment variable NODE_ENV
 * - App parameter REACT_APP_ENV
 * 
 * Below are the 4 different options to start the front-end:
 * HTTPS=true SSL_CRT_FILE=server.crt SSL_KEY_FILE=server.key REACT_APP_ENV='dev_ssl' npm start => connect to backend running in localhost using https
 * REACT_APP_ENV='dev' npm start => connect to backend running in localhost using http
 * REACT_APP npm start => connect to backend running in the Server using https
 * REACT_APP npm build => only to deploy the App, to connect to backend running in the Server using https
 * 
 * Attention: Depending on the Operating System, the parameters when calling the App may have a different syntaxis
 * Linux, MacOS => REACT_APP_ENV='dev' npm start
 * Windows (cmd.exe) => set "REACT_APP_ENV=dev" && npm start
 * 
 * @returns URL to connect to the backend
 */
const WS = (): string => {

    if (process.env.NODE_ENV === 'development') {
        
        if (process.env.REACT_APP_ENV === 'dev_ssl') { // When executing [ REACT_APP_ENV='dev_ssl' npm start ]
            return 'ws://localhost:8000';
            
        } else if (process.env.REACT_APP_ENV === 'dev') { // When executing [ REACT_APP_ENV='dev' npm start ]
            return 'ws://localhost:8000';
            
        } else { // When executing [ npm start ]
            return 'ws://priviweb.tech:8000';
        }
        // When executing [ npm build ]
    } else {
        return 'wss://priviweb.tech:8000';
    };
};

export default WS;
