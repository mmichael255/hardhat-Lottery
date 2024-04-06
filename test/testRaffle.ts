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
              const signers = await ethers.getSigners()
              const enteranceFee =
                  networkConfig[network.config.chainId!]["raffleEntranceFee"]
              const interval =
                  networkConfig[network.config.chainId!][
                      "keepersUpdateInterval"
                  ]

              await mock.createSubscription()
              await mock.addConsumer(1, raffle.getAddress())
              return { raffle, mock, signers, enteranceFee, interval }
          }
          describe("deployMock", async () => {
              it("intitiallizes the raffle correctly", async () => {
                  const { raffle, mock } = await getContract()
                  assert.equal(
                      networkConfig[network.config.chainId!][
                          "keepersUpdateInterval"
                      ],
                      (await raffle.getInterval()).toString()
                  )
                  assert.equal("0", (await raffle.getRaffleState()).toString())
                  assert.equal(
                      networkConfig[network.config.chainId!][
                          "raffleEntranceFee"
                      ],
                      (await raffle.getEntranceFee()).toString()
                  )
                  assert.equal(
                      await mock.getAddress(),
                      await raffle.getVrfCoordinator()
                  )
              })
          })
          describe("enterRaffle", async () => {
              it("revert if you don't pay enough", async () => {
                  const { raffle } = await getContract()
                  await expect(
                      raffle.enterRaffle()
                  ).to.be.revertedWithCustomError(
                      raffle,
                      "Raffle__SendMoreToEnterRaffle"
                  )
              })
              it("records player when they enter", async () => {
                  const { raffle, signers } = await getContract()
                  const playerRaffle = raffle.connect(signers[1])

                  await playerRaffle.enterRaffle({
                      value: networkConfig[network.config.chainId!][
                          "raffleEntranceFee"
                      ],
                  })
                  const constractPlayer = await raffle.getPlayer(0)
                  assert.equal(signers[1].address, constractPlayer)
              })
              it("emits event on enter", async () => {
                  const { raffle, signers } = await getContract()
                  const playerRaffle = raffle.connect(signers[1])
                  await expect(
                      playerRaffle.enterRaffle({
                          value: networkConfig[network.config.chainId!][
                              "raffleEntranceFee"
                          ],
                      })
                  ).to.emit(raffle, "RaffleEnter")
              })
              it("doesn't allow enterance when raffle is caculating", async () => {
                  const { raffle, mock, signers, enteranceFee, interval } =
                      await getContract()
                  //to get a return value from TransactionResponse
                  //   const transactionResponse = await mock.createSubscription()
                  //   const transactionReceipt = await transactionResponse.wait(1)
                  //   console.log(transactionReceipt.toJSON())
                  //   console.log(transactionReceipt!.logs[0].args[0])
                  //const subId = await mock.createSubscription.staticCall()
                  console.log(subId)

                  const playerraffle = raffle.connect(signers[1])
                  await playerraffle.enterRaffle({
                      value: networkConfig[network.config.chainId!][
                          "raffleEntranceFee"
                      ],
                  })
                  await network.provider.send("evm_increaseTime", [
                      interval! + 1,
                  ])
                  await network.provider.request({
                      method: "evm_mine",
                      params: [],
                  })
                  await playerraffle.performUpkeep("0x")

                  await expect(
                      playerraffle.enterRaffle({ value: enteranceFee })
                  ).to.be.revertedWithCustomError(
                      raffle,
                      "Raffle__RaffleNotOpen"
                  )
              })
          })
          describe("checkUpkeep", async () => {})
      })
