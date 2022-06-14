import apothemAddresses from "./apothem.json";
import mainnetAddresses from "./mainnet.json";

const getAddresses = (network) => {
  switch (network) {
    case "apothem":
      return apothemAddresses;
    case "mainnet":
    default:
      return mainnetAddresses;
  }
};

export default getAddresses(process.env.REACT_APP_NETWORK);
