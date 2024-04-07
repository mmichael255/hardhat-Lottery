import {
    frontEndContractsFile,
    frontEndAbiFile,
} from "../helper-hardhat.config"
import fs from "fs"
import { ignition, network, ethers } from "hardhat"
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers"
import LocalRaffleModule from "../ignition/modules/RaffleOnLocal"
import type { BaseContract } from "ethers"

async function main() {
    if (process.env.UPDATE_FRONT_END) {
        console.log("Writing to front end...")
        const raffle = await getContract()
        const raffleAddr = await raffle.getAddress()
        // const signers = await ethers.getSigners()
        // const raffle = await ethers.getContractAt("Raffle", signers[0])
        // const raffleAddr = await raffle.getAddress()
        console.log(`Raffle address is ${raffleAddr}`)

        await updateContractAddresses(raffleAddr)
        await updateAbi(raffle)
        console.log("Front end written!")
    }
}

async function deployOnlocalchain() {
    const { raffle } = await ignition.deploy(LocalRaffleModule)
    return raffle
}

async function getContract() {
    const raffleContract = await loadFixture(deployOnlocalchain)
    return raffleContract
}

async function updateAbi(raffle: BaseContract) {
    fs.writeFileSync(frontEndAbiFile, raffle.interface.formatJson())
}

async function updateContractAddresses(raffleAddr: string) {
    const chainid = network.config.chainId!.toString()
    const contractAddresses = JSON.parse(
        fs.readFileSync(frontEndContractsFile, "utf8")
    )
    if (chainid in contractAddresses) {
        if (!contractAddresses[chainid].includes(raffleAddr)) {
            contractAddresses[chainid] = [raffleAddr]
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
