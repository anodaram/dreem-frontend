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
const URL = (): string => {
  return process.env.REACT_APP_PRIVI_BACKEND_URL ?? "http://localhost:3000";
};

export const LISTENER_URL = (): string => {
  return process.env.REACT_APP_PRIVI_LISTENER_URL ?? "http://localhost:3006";
};

export const METAVERSE_URL = (): string => {
  return process.env.REACT_APP_PRIVI_METAVERSE_URL ?? "http://localhost:3000";
};

export const METAVERSE_MAINTENCE_URL = (): string => {
  return (
    process.env.REACT_APP_PRIVI_METAVERSE_MAINTENCE_URL ??
    "https://privi-maintenance-wfptc.ondigitalocean.app/maintenance?name=metaverse"
  );
};

export const hideMint = process.env.HIDE_MINT == 'true' ? true : false;

export default URL;
