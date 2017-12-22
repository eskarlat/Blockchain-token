pragma solidity ^0.4.17;

import "./token/MintableToken.sol";

contract LimeChainCoin is MintableToken {

    string public constant name = "LimeChain Exam Token";
    string public constant symbol = "LET";
    uint8 public constant decimals = 18;

}