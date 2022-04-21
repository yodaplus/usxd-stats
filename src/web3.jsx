const ethers = require("ethers");
window.ethers = ethers;
const eth = new ethers.providers.JsonRpcProvider(
  process.env.REACT_APP_JSON_RPC_URL
);
export default eth;
