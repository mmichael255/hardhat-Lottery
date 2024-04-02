##to get a return value from TransactionResponse
const transactionResponse = await mock.createSubscription()
const transactionReceipt = await transactionResponse.wait(1)
console.log(transactionReceipt.toJSON())
console.log(transactionReceipt!.logs[0].args[0])
OR
const subId = await mock.createSubscription.staticCall()
