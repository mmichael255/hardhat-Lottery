import { HardhatUserConfig } from "hardhat/config"
import "@nomicfoundation/hardhat-toolbox"
import "@nomicfoundation/hardhat-ignition-ethers"
import "dotenv/config"

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || ""
const PRIVATE_KEY = process.env.PRIVATE_KEY || ""
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || ""

const config: HardhatUserConfig = {
  solidity: "0.8.7",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
    },
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 11155111,
    },
  },
  etherscan: {
    apiKey: {
      sepolia: ETHERSCAN_API_KEY,
    },
  },
  gasReporter: {
    enabled: true,
    outputFile: "GasReport.txt",
    currency: "USD",
    noColors: true,
    // coinmarketcap: "abc123...",
  },
}

export default config
