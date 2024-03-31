import { buildModule } from "@nomicfoundation/hardhat-ignition/modules"

const BASE_FEE = "250000000000000000" // 0.25 is this the premium in LINK?
const GAS_PRICE_LINK = 1e9 // link per gas, is this the gas lane? // 0.000000001 LINK per gas

const VRFMockModule = buildModule("VRFMock", (m) => {
  const baseFee = m.getParameter("_baseFee", BASE_FEE)
  const gasPriceLink = m.getParameter("_gasPriceLink", GAS_PRICE_LINK)
  const vrfMock = m.contract("VRFCoordinatorV2Mock", [baseFee, gasPriceLink])
  return { vrfMock }
})

export default VRFMockModule
