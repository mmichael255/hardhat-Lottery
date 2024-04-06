import { buildModule } from "@nomicfoundation/hardhat-ignition/modules"

const DeployWithFactory = buildModule("ContractFactory", (m) => {
    const contractFactory = m.contract("ContractFactory")
    // const deployedContracts = m.call(contractFactory, "deploy")
    // const raffleAddr = m.readEventArgument(
    //     deployedContracts,
    //     "Deployed",
    //     "raffleAddr"
    // )
    // console.log(`raffleAddr:${raffleAddr.eventIndex}`)
    // const mockAddr = m.readEventArgument(
    //     deployedContracts,
    //     "Deployed",
    //     "mockAddr"
    // )
    // console.log(`mockAddr:${mockAddr.eventName}`)
    // const raffle = m.contractAt("Raffle", raffleAddr)
    // const vrfMock = m.contractAt("VRFCoordinatorV2Mock", mockAddr)
    return { contractFactory }
})

export default DeployWithFactory
