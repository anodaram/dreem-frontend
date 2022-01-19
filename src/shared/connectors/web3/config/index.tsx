// Using `require` as `import` does not support dynamic loading (yet).
const env = process.env.REACT_APP_ENV ?? 'dev';
const configEnv = require(`./${env}.json`);
const config = { ...configEnv };
export default config;
