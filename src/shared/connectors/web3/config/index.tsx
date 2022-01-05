// Using `require` as `import` does not support dynamic loading (yet).
// const configEnv = require(`./${process.env.NODE_ENV}.json`);
const configEnv = require('./test.json');
const config = { ...configEnv };
export default config;
