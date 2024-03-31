import { buildModule } from "@nomicfoundation/hardhat-ignition/modules"
import { networkConfig, developmentChains } from "../../helper-hardhat.config"
import { network } from "hardhat"
const RaffleModule = buildModule("Raffle", (m) => {
  let chainId: number
  if (developmentChains.includes(network.name)) {
    chainId = 31337
  } else {
    chainId = 11155111
  }
  const vrfCoordinatorV2 = m.getParameter(
    "vrfCoordinatorV2",
    networkConfig[chainId].vrfCoordinatorV2
  )
  const subscriptionId = m.getParameter(
    "subscriptionId",
    networkConfig[chainId].subscriptionId
  )
  const gasLane = m.getParameter("gasLane", networkConfig[chainId].gasLane)
  const interval = m.getParameter(
    "interval",
    networkConfig[chainId].keepersUpdateInterval
  )
  const entranceFee = m.getParameter(
    "entranceFee",
    networkConfig[chainId].raffleEntranceFee
  )
  const callbackGasLimit = m.getParameter(
    "callbackGasLimit",
    networkConfig[chainId].callbackGasLimit
  )

  const raffle = m.contract("Raffle", [
    vrfCoordinatorV2,
    subscriptionId,
    gasLane,
    interval,
    entranceFee,
    callbackGasLimit,
  ])
  return { raffle }
})

export default RaffleModule
