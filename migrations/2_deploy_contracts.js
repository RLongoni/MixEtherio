var MixEtherio = artifacts.require("./MixEtherio.sol");
var Ownable = artifacts.require("./Ownable.sol");

module.exports = function(deployer) {
  deployer.deploy(MixEtherio);
};
