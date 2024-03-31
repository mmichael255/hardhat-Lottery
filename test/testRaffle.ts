import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers"
import VRFMockModule from "../ignition/modules/VRFMock"
import RaffleModule from "../ignition/modules/Raffle"
import { networkConfig, developmentChains } from "../helper-hardhat.config"
import { assert, expect } from "chai"
import { ignition, ethers, network } from "hardhat"
import { Raffle, VRFCoordinatorV2Mock } from "../typechain-types"

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Raffle", async () => {
      async function deployOnlocalchain() {
        const { vrfMock } = await ignition.deploy(VRFMockModule)
        const { raffle } = await ignition.deploy(RaffleModule, {
          parameters: {
            Raffle: {
              vrfCoordinatorV2: await vrfMock.getAddress(),
            },
          },
        })
        return { vrfMock, raffle }
      }
      async function getContract() {
        const fixture = await loadFixture(deployOnlocalchain)
        const raffle = fixture.raffle
        const mock = fixture.vrfMock
        return { raffle, mock }
      }
      describe("deployMock", async () => {
        it("intitiallizes the raffle correctly", async () => {
          const { raffle, mock } = await getContract()
          assert.equal(
            networkConfig[network.config.chainId!]["keepersUpdateInterval"],
            (await raffle.getInterval()).toString()
          )
          assert.equal("0", (await raffle.getRaffleState()).toString())
          assert.equal(
            networkConfig[network.config.chainId!]["raffleEntranceFee"],
            (await raffle.getEntranceFee()).toString()
          )
          assert.equal(await mock.getAddress(), await raffle.getAddress())
        })
      })
      describe("enterRaffle", async () => {
        it("revert if you don't pay enough", async () => {
          const vrfMockFixture = await loadFixture(deployOnlocalchain)
          const raffle = vrfMockFixture.raffle
          await expect(raffle.enterRaffle()).to.be.revertedWithCustomError(
            raffle,
            "Raffle__SendMoreToEnterRaffle"
          )
        })
      })
    })
