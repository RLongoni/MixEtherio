const MixEtherio = artifacts.require("./MixEtherio.sol");

contract("MixEtherio", accounts => {

  it("...Controlli per la funzione hash.", async () => {
    /* Set di valori per testare la funzione keccak256 */
    const mixEtherioInstance = await MixEtherio.deployed();
    const value1 = await mixEtherioInstance.generatePrivateKey('');
    const value2 = await mixEtherioInstance.generatePrivateKey("a");
    const value3 = await mixEtherioInstance.generatePrivateKey("prova");
    const value4 = await mixEtherioInstance.generatePrivateKey("f4tt1 non f0ste a ViVer coM3 Bruti!");
    const value5 = await mixEtherioInstance.generatePrivateKey("1");
    /**/
    assert.equal(value1,'0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',"Fallito codice con \"\" ");
    assert.equal(value2,'0x3ac225168df54212a25c1c01fd35bebfea408fdac2e31ddd6f80a4bbf9a5f1cb',"Problema nella funzione");
    assert.equal(value3,'0x82ada144fa83def03d19f5c0a740aeb8f21cef160c55ae385c002db0ae39d98d',"Problma nella funzione");
    assert.equal(value4,'0xf7593896d5349b26e712450574ea24f5a0985334f1d0f97d7e83d278b379cb96',"Problma nella funzione");
  });

  it("...Controlli per la funzione stringEquals", async () => {


  });

  it
});
