import { networkConfig } from "./helper-hardhat.config"
import { ignition } from "hardhat"
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers"
import LocalRaffleModule from "./ignition/modules/RaffleOnLocal"

async function main() {
    //   const bigintEther = BigInt(1e19).toString()
    //   //const bigintEther = 1e19
    //   //10000000000000000000
    //   //const bigintEther = BigInt(1e19)
    //   //10000000000000000000n
    //   //const bigintEther = BigInt(1e19).toString()
    //   //10000000000000000000
    //   console.log(bigintEther)
    // networkConfig[31337].vrfCoordinatorV2 = "22222"
    // console.log(networkConfig[31337])
    await getContract()
}

async function deployOnlocalchain() {
    const { raffle } = await ignition.deploy(LocalRaffleModule)
    return raffle
}

async function getContract() {
    const raffle = await loadFixture(deployOnlocalchain)
    console.log(raffle.getAddress())
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
