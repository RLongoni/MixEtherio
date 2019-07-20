pragma solidity ^0.5.0;


contract ContrattoDiProva {

    uint private amount = 0;

    constructor() public payable {

    }

    function () external payable {

    }

    function versamento(uint _amount) public payable {
        amount = _amount;
    }

    function getamount() public  view returns(uint) {
        return amount;
    }

    function prelievo(uint _amount) public payable {
        amount -= _amount;
        msg.sender.transfer(address(this).balance);
    }

    function getContractBalance() public view returns(uint) {
        return address(this).balance;
    }
}
//function insertTransaction(uint rdnNum1, uint rdnNum2, bool _transaction, uint i) public onlyOwner {
//    if (participants[rdnNum1].isWaterWell && !participants[rdnNum2].isWaterWell) {
//        (_transaction) ? mixingTransactions[i] = Transaction(participants[rdnNum2].id, participants[rdnNum1].id)
//                    : fakeTransactions[i] = Transaction(participants[rdnNum2].id, participants[rdnNum1].id);
//    }else if (participants[rdnNum2].isWaterWell && !participants[rdnNum1].isWaterWell) {
//        (_transaction) ? mixingTransactions[i] = Transaction(participants[rdnNum2].id, participants[rdnNum1].id)
//                        : fakeTransactions[i] = Transaction(participants[rdnNum1].id, participants[rdnNum2].id);
//    }else {
//        if (rdnNum1 > rdnNum2) {
//            (_transaction)
//            ? mixingTransactions[i] = Transaction(participants[rdnNum2].id, participants[rdnNum1].id)
//            : fakeTransactions[i] = Transaction(participants[rdnNum1].id, participants[rdnNum2].id);
//        }else {
//            (_transaction) ? mixingTransactions[i] = Transaction(participants[rdnNum2].id, participants[rdnNum1].id)
//                            : fakeTransactions[i] = Transaction(participants[rdnNum2].id, participants[rdnNum1].id);
//        }
//    }
//}

//function generateTransactions(bool _transaction) public onlyOwner {
//    uint rdnNum1 = randomIt(0, 10);
//    uint rdnNum2 = randomIt(0, 10);
//    for (uint i=randomNumber; i >= 0; i--) {
//        while (rdnNum1 == rdnNum2) {
//            rdnNum1 = randomIt(0, 10);
//            rdnNum2 = randomIt(0, 10);
//        }
//        insertTransaction(rdnNum1, rdnNum2, _transaction, i);
//    }
//}

//function randomIt(uint min, uint max) public returns(uint) {
//    incremental++;
//    return uint(keccak256(abi.encode(incremental)))%(min+max)-min;
//}

//function deployTheKey(string memory privKey) public {
//    hashedSecretKey = privKey;
//    passToStep2 = true;
//}

//function getToStep2() public view returns(bool) {
//    return passToStep2;
//}

//function importAmount() public payable {
//    etherToMix = msg.value;
//    passToStep3 = true;
//}

//function getToStep3() public view returns(bool) {
//    return passToStep3;
//}

//function sendEtherTo(address payable to) public payable {
//    /**/
//    uint amount = msg.value;
//   // string memory toParticipant = toString(to);
//   //  string memory fromParticipant = toString(msg.sender);
//    uint indexTo = findParticipantIndex(toString(to));
//    uint indexFrom = findParticipantIndex(toString(msg.sender));
//    to.transfer(msg.value);
//    participants[indexTo].mixableAmount += amount;
//    participants[indexFrom].mixableAmount -= amount;
//}

//function fakeTransfer(address payable to) public payable {
//    /*ToDo: Cambiare nome alla funzione altrimenti questa rimane con questo nome sulla blockchain*/
//    uint amount = msg.value;
//   // string memory toParticipant = toString(to);
//   //  string memory fromParticipant = toString(msg.sender);
//    uint indexTo = findParticipantIndex(toString(to));
//    uint indexFrom = findParticipantIndex(toString(msg.sender));
//    to.transfer(msg.value);
//    participants[indexTo].originalAmount += amount;
//    participants[indexFrom].originalAmount -= amount;
//}

//function addParticipant(string memory part,
//                        uint originalAmount,
//                        uint amountToMix,
//                        bool isWaterWell)
//                        public
//                        onlyOwner
//{
//    /*TODO: Non si deve aggiungere una copia di un partecipante, creare un modifier per questo*/
//    participants.push(Participant(part, originalAmount, amountToMix, isWaterWell));
//}

//function changeParticipant( string memory oldpart,
//                            string memory newpart,
//                            uint newOriginalAmount,
//                            uint newMixableAmount)
//                            public
//                            onlyOwner
//{
//    uint index = findParticipantIndex(oldpart);
//    participants[index].id = newpart;
//    participants[index].originalAmount = newOriginalAmount;
//    participants[index].mixableAmount = newMixableAmount;
//}

//function getParticipant(uint index) public view onlyOwner returns(string memory, uint, uint) {
//    return (participants[index].id, participants[index].originalAmount, participants[index].mixableAmount);
//}

//// function getHashedPrivateKey() public view returns(string memory) {
////     return hashedSecretKey;
//// }
//function getContractBalance() public view returns(uint) {
//    return address(this).balance;
//}

//function getEtherToMix() public view returns(uint) {
//    return etherToMix;
//}
/*Pr//ivate functions*/

//// function generatePrivateKey(string memory privKey) public pure returns(bytes32) {
////     return keccak256(abi.encodePacked(privKey));
//// }
//function getTheUSerKey() public view onlyOwner returns(string memory) {
//  /* Funzione da togliere */
//    return hashedSecretKey;
//}

//function toString(address x) private pure returns(string memory) {
//    bytes memory b = new bytes(20);
//    for (uint i = 0; i < 20; i++) {
//        b[i] = byte(uint8(uint(x) / (2**(8*(19 - i)))));
//    }
//    return string(b);
//}

//function findParticipantIndex(string memory id) private view returns(uint) {
//    for (uint i=0; i < participants.length; i++) {
//        // IDEA: per comparare due stringhe in solidity
//        if (keccak256(abi.encodePacked((id))) == keccak256(abi.encodePacked((participants[i].id)))) {
//            return i;
//        }else
//            return 10000; // solo in questo caso dove si suppone un massimo di 15 partecipanti
//    }
//}

//
/*




        \          SORRY            /
         \                         /
          \    This page does     /
           ]   not exist yet.    [    ,'|
           ]                     [   /  |
           ]___               ___[ ,'   |
           ]  ]\             /[  [ |:   |
           ]  ] \           / [  [ |:   |
           ]  ]  ]         [  [  [ |:   |
           ]  ]  ]__     __[  [  [ |:   |
           ]  ]  ] ]\ _ /[ [  [  [ |:   |
           ]  ]  ] ] (#) [ [  [  [ :===='
           ]  ]  ]_].nHn.[_[  [  [
           ]  ]  ]  HHHHH. [  [  [
           ]  ] /   `HH("N  \ [  [
           ]__]/     HHH  "  \[__[
           ]         NNN         [
           ]         N/"         [
           ]         N H         [
          /          N            \
         /           q,            \
        /                           \


*/
