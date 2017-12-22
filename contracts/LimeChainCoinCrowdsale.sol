pragma solidity ^0.4.17;

import './token/MintableToken.sol';
import './math/SafeMath.sol';
import './LimeChainCoin.sol';

contract LimeChainCoinCrowdsale { 

    using SafeMath for uint256;
    MintableToken public token;

    uint256 public startTime;
    uint256 public endTime;
    uint256 public rate;
    address public wallet;
    uint256 public weiRaised;

    uint256 public nowTime;
    uint256 public eht10 = 10000000000000000000;
    uint public eth30 = 30000000000000000000;

    function LimeChainCoinCrowdsale(uint256 _startTime, uint256 _endTime, uint256 _rate, address _wallet) public {
        require(_startTime >= nowTime);
        require(_endTime >= _startTime);
        require(_rate > 0);
        require(_wallet != address(0));

        token = new LimeChainCoin();
        startTime = _startTime;
        endTime = _endTime;
        rate = _rate;
        wallet = _wallet;
    }

    //only test
    function setNowTime(uint256 _nowTime) public {
        nowTime = _nowTime;
    }

    function () external payable { 
        bayTokens(msg.sender);
    }

    function bayTokens(address beneficiary) public  payable {
        uint firstSevenDays = startTime + (86400 * 7);
        uint secondSevenDays = firstSevenDays + (86400 * 7);

        if (nowTime <= firstSevenDays) {
            if (weiRaised >= eht10)
                rate = 300;
            else
                rate = 500;
        }

        if (nowTime > firstSevenDays && nowTime <= secondSevenDays) {
            if (weiRaised >= eth30)
                rate = 150;
            else
                rate = 200;
        }

        require(beneficiary != address(0));
        require(validPurchase());

        uint256 weiAmount = msg.value;

        uint256 tokens = weiAmount.mul(rate);

        weiRaised = weiRaised.add(weiAmount);

        token.mint(beneficiary, tokens);
        forwardFunds();
    }

    function forwardFunds() internal {
        wallet.transfer(msg.value);
    }

    function validPurchase() internal view returns (bool) {
        bool withinPeriod = nowTime >= startTime && nowTime <= endTime;
        bool nonZeroPurchase = msg.value != 0;
        return withinPeriod && nonZeroPurchase;
    }

    function hasEnded() public view returns (bool) {
        return nowTime > endTime;
    }

    function transfer(address _to, uint256 _value) public {
        require(hasEnded());
        token.transfer(_to, _value);
    }

    function adminMint(address _to, uint256 _value) public {
        require(!hasEnded());
        require(_to != address(0));
        token.mint(_to, _value);
    }
}