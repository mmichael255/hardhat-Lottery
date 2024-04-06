import {
    frontEndContractsFile,
    frontEndAbiFile,
} from "../helper-hardhat.config"
import fs from "fs"
import { network, ethers } from "hardhat"

async function main() {
    if (process.env.UPDATE_FRONT_END) {
        console.log("Writing to front end...")
        await updateContractAddresses()
        await updateAbi()
        console.log("Front end written!")
    }
}

async function updateAbi() {
    const signers = await ethers.getSigners()
    const raffle = await ethers.getContractAt("Raffle", signers[0])
    fs.writeFileSync(frontEndAbiFile, raffle.interface.formatJson())
}

async function updateContractAddresses() {
    const signers = await ethers.getSigners()
    const raffle = await ethers.getContractAt("Raffle", signers[0])
    const raffleAddr = await raffle.getAddress()
    const chainid = network.config.chainId!.toString()
    const contractAddresses = JSON.parse(
        fs.readFileSync(frontEndContractsFile, "utf8")
    )
    if (chainid in contractAddresses) {
        if (!contractAddresses[chainid].includes(raffleAddr)) {
            contractAddresses[chainid] = raffleAddr
        }
    } else {
        contractAddresses[chainid] = [raffleAddr]
    }

    fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddresses))
}
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
