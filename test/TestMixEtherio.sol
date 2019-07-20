pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/MixEtherio.sol";


contract TestMixEtherio {
    function testConversioneInHash() public {
        MixEtherio mixEtherio = MixEtherio(DeployedAddresses.MixEtherio());

        bytes32 test1 = mixEtherio.generatePrivateKey("");

        bytes32 expected = 0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470;

        Assert.equal(test1, expected, "It should store the value 89.");
    }

    function testConversioneStringToHash() public {
        MixEtherio mixEtherio = MixEtherio(DeployedAddresses.MixEtherio());

        bytes32 test1 = mixEtherio
                            .stringToBytes32("0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470");

        bytes32 expected = 0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470;

        Assert.equal(test1, expected, "Dovrebbero matchare.");
    }

}
