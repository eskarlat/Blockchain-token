const LimeChainCoin = artifacts.require("./LimeChainCoin.sol");
const LimeChainCoinCrowdsale = artifacts.require("./LimeChainCoinCrowdsale.sol");

const util = require('./util');
const expectThrow = util.expectThrow;

contract('LimeChainCoin', (accounts) => {

    let LimeChainCoinCrowdsaleInst;
    let tokenAddress;
    let LimeChainCoinInst;

    const startTime = web3.eth.getBlock(web3.eth.blockNumber).timestamp + 1;
    const endTime = startTime + (86400 * 30);
    const rate = new web3.BigNumber(100);
    const wallet = accounts[0];

    const account1 = accounts[1];
    const account2 = accounts[2];

    const firstSevenDays = startTime + (86400 * 7);
    const secondSevenDays = startTime + (86400 * 14);
    const randomDay = startTime + (86400 * 20);
    const closeDay = startTime + (86400 * 40);

    describe("Basic test", () => {

        beforeEach(async() => {
            LimeChainCoinCrowdsaleInst = await LimeChainCoinCrowdsale.deployed(startTime, endTime, rate, wallet);
            tokenAddress = await LimeChainCoinCrowdsaleInst.token();
            LimeChainCoinInst = await LimeChainCoin.at(tokenAddress);
            await LimeChainCoinCrowdsaleInst.setNowTime(startTime);
        });

        it("check the number of LET tokens account1 has. It should have 0", async() => {
            let balance = await LimeChainCoinInst.balanceOf(account1);
            assert.equal(balance, 0, "The balance is not 0");
        });

        it("Buying LET tokens", async() => {
            await LimeChainCoinCrowdsaleInst.sendTransaction({
                from: account1,
                value: web3.toWei(1, "ether")
            });

            let balance = await LimeChainCoinInst.balanceOf(account1);

            console.log("Balance: ", web3.fromWei(balance.toString(10), "ether"));
        });
    });

    describe("During 7 days", () => {
        beforeEach(async() => {
            LimeChainCoinCrowdsaleInst = await LimeChainCoinCrowdsale.deployed(startTime, endTime, rate, wallet);
            tokenAddress = await LimeChainCoinCrowdsaleInst.token();
            LimeChainCoinInst = await LimeChainCoin.at(tokenAddress);
            await LimeChainCoinCrowdsaleInst.setNowTime(firstSevenDays);

            await LimeChainCoinCrowdsaleInst.sendTransaction({
                from: account2,
                value: web3.toWei(10, "ether")
            });
        });

        it("Buying LET tokens with 10eth", async() => {
            await LimeChainCoinCrowdsaleInst.sendTransaction({
                from: account1,
                value: web3.toWei(1, "ether")
            });

            let balance = await LimeChainCoinInst.balanceOf(account1);

            console.log("Balance: ", web3.fromWei(balance.toString(10), "ether"));
        });
    });

    describe("Second 7 days 2", () => {
        beforeEach(async() => {
            LimeChainCoinCrowdsaleInst = await LimeChainCoinCrowdsale.deployed(startTime, endTime, rate, wallet);
            tokenAddress = await LimeChainCoinCrowdsaleInst.token();
            LimeChainCoinInst = await LimeChainCoin.at(tokenAddress);
            await LimeChainCoinCrowdsaleInst.setNowTime(secondSevenDays);

            await LimeChainCoinCrowdsaleInst.sendTransaction({
                from: account2,
                value: web3.toWei(30, "ether")
            });
        });

        it("Buying LET tokens with 30eth", async() => {
            await LimeChainCoinCrowdsaleInst.sendTransaction({
                from: account1,
                value: web3.toWei(1, "ether")
            });

            let balance = await LimeChainCoinInst.balanceOf(account1);

            console.log("Balance: ", web3.fromWei(balance.toString(10), "ether"));
        });
    });

    describe("Random day", () => {
        beforeEach(async() => {
            LimeChainCoinCrowdsaleInst = await LimeChainCoinCrowdsale.deployed(startTime, endTime, rate, wallet);
            tokenAddress = await LimeChainCoinCrowdsaleInst.token();
            LimeChainCoinInst = await LimeChainCoin.at(tokenAddress);
            await LimeChainCoinCrowdsaleInst.setNowTime(randomDay);

            await LimeChainCoinCrowdsaleInst.sendTransaction({
                from: account2,
                value: web3.toWei(30, "ether")
            });
        });

        it("Buying LET tokens", async() => {
            await LimeChainCoinCrowdsaleInst.sendTransaction({
                from: account1,
                value: web3.toWei(1, "ether")
            });

            let balance = await LimeChainCoinInst.balanceOf(account1);

            console.log("Balance: ", web3.fromWei(balance.toString(10), "ether"));
        });
    });

    describe("transfering (trading) of tokens should be disabled until the Crowdsale is over.", () => {
        beforeEach(async() => {
            LimeChainCoinCrowdsaleInst = await LimeChainCoinCrowdsale.deployed(startTime, endTime, rate, wallet);
            tokenAddress = await LimeChainCoinCrowdsaleInst.token();
            LimeChainCoinInst = await LimeChainCoin.at(tokenAddress);
            await LimeChainCoinCrowdsaleInst.setNowTime(startTime);

            await LimeChainCoinCrowdsaleInst.sendTransaction({
                from: account1,
                value: web3.toWei(30, "ether")
            });
        });

        it("transfering", async() => {
            await LimeChainCoinCrowdsaleInst.setNowTime(randomDay);
            await expectThrow(LimeChainCoinCrowdsaleInst.transfer(account2, 100));
        });

        it("transfering on close day", async() => {
            await LimeChainCoinCrowdsaleInst.setNowTime(closeDay);
            await LimeChainCoinCrowdsaleInst.transfer(account2, 100);

            let balance = await LimeChainCoinInst.balanceOf(account2);

            console.log("Balance: ", web3.fromWei(balance.toString(10), "ether"));
        });
    });

    describe("Admin to mint free tokens", () => {
        beforeEach(async() => {
            LimeChainCoinCrowdsaleInst = await LimeChainCoinCrowdsale.deployed(startTime, endTime, rate, wallet);
            tokenAddress = await LimeChainCoinCrowdsaleInst.token();
            LimeChainCoinInst = await LimeChainCoin.at(tokenAddress);
            await LimeChainCoinCrowdsaleInst.setNowTime(startTime);

            await LimeChainCoinCrowdsaleInst.sendTransaction({
                from: account1,
                value: web3.toWei(30, "ether")
            });
        });

        it("send", async() => {
            await LimeChainCoinCrowdsaleInst.adminMint(account2, 300);
        });
    });
});