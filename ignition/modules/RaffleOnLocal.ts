import { buildModule } from "@nomicfoundation/hardhat-ignition/modules"
import { networkConfig, developmentChains } from "../../helper-hardhat.config"
const BASE_FEE = "250000000000000000" // 0.25 is this the premium in LINK?
const GAS_PRICE_LINK = 1e9 // link per gas, is this the gas lane? // 0.000000001 LINK per gas

const LocalVrfMockModule = buildModule("LocalVrfMock", (m) => {
    const baseFee = m.getParameter("_baseFee", BASE_FEE)
    const gasPriceLink = m.getParameter("_gasPriceLink", GAS_PRICE_LINK)
    const vrfMock = m.contract("VRFCoordinatorV2Mock", [baseFee, gasPriceLink])
    m.call(vrfMock, "createSubscription")
    return { vrfMock }
})

const LocalRaffleModule = buildModule("LocalRaffle", (m) => {
    const chainId = 31337
    const { vrfMock } = m.useModule(LocalVrfMockModule)

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
        vrfMock,
        subscriptionId,
        gasLane,
        interval,
        entranceFee,
        callbackGasLimit,
    ])
    m.call(vrfMock, "addConsumer", [1, raffle])

    return { raffle }
})

export default LocalRaffleModule
