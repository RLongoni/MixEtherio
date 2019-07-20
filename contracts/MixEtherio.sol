// pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import "./Ownable.sol";
import "./SafeMath.sol";
/*MixΞtherio*/

contract MixEtherio is Ownable {
    using SafeMath for uint256;
    uint private contractAmount = 0;
    uint private etherToMix = 0; // totale da mixare
    uint private incremental = 0;
    string private hashedSecretKey;
    uint private mapIndex = 3; // per convenzione ho scelto 3 partecipanti

    struct Participant {
        string id;
        uint originalAmount;
        uint mixableAmount;
        bool isWaterWell;
    }

    mapping(uint => string) public idParts; // è il primo dato che viene instanziato
    mapping(uint => uint) public originalAmountParts; // è il secondo dato instanziato
    mapping(uint => uint) public mixableAmountParts; // è il terzo dato instanziato
    mapping(uint => bool) public isWaterWellParts; // è il quarto dato instanziato
    mapping(uint => Participant) public participants; // SOLO quando tutti i 4 dati precendeti sono instanziati

    constructor() public {

    }

    modifier isParts(string memory toVerify) {
    /*
      Modificatore usato per tutte le funzioni che necessitano una verifica di chi le invoca
      In questo caso serve per verificare che l'utente che invia il pagamento fa parte dei partecipanti
    */
        require(isAParticipant(toVerify));
        _;
    }

    modifier isSender() {
        require(msg.sender == msg.sender);
        _;
    }

    function () external payable {

    }

    function startMixing() public {
      // I Fase: Inizializzazione dei partecipanti
        setParticipants();
        fetchUsersData();
    }

    function addParticipant(string memory ids,
                            bool isWaterWell,
                            uint index)
                            public
                            onlyOwner
    {
        idParts[index] = ids;
        originalAmountParts[index] = 100000000000000000000;//  default
        mixableAmountParts[index] = 0;
        isWaterWellParts[index] = isWaterWell;
    }

    function deleteParticipant(string memory id) public  onlyOwner {
      /*Conoscendo l'id del partecipante*/
        uint index = findMapIndex(id);
        deleteParticipant(index);
    }

    function deleteParticipant(uint index) public onlyOwner {
      /*Conoscendo l'indice della mappa che contiene il partecipante*/
        delete (participants[index]);
    }

    function deployTheKey(string memory privKey) public {
      /*
        Funzione utilizzata dal client per memorizzare l'hash della chiave dell'utente
        Lo scopo è quello di avere un ulteriore strumento per la verifica dell'invio all'utente di partenza
        Ps: dato che potrebbe specificare un altro address su cui inviare i soldi mixati
      */
        hashedSecretKey = privKey;
        // passToStep2 = true; da sviluppare per il client
    }

    function importAmount() public payable {
      /*Funzione utilizzata dal client per inviare ether allo smartContract*/
        etherToMix = msg.value;
        // passToStep3 = true; da sviluppare per il client
    }

    function transaction(string memory to, string memory from, bool foo)
                        public
                        payable
                        isParts(to)
                        isParts(from)
    {
        uint indexTo = findMapIndex(to);
        uint indexFrom = findMapIndex(from);
        uint amountTo = 0;
        uint amountFrom = 0;
        address(this).transfer(msg.value);
        contractAmount = contractAmount.add(msg.value);
        if (foo) {
            amountTo = participants[indexTo].mixableAmount;
            amountFrom = participants[indexFrom].mixableAmount;
            participants[indexFrom].mixableAmount = amountFrom.sub(msg.value);
            participants[indexTo].mixableAmount = amountTo.add(msg.value);
        }else {
            amountTo = participants[indexTo].originalAmount;
            amountFrom = participants[indexFrom].originalAmount;
            participants[indexTo].originalAmount = amountTo.add(msg.value);
            participants[indexFrom].originalAmount = amountFrom.sub(msg.value);
        }
    }

/*
    function transaction(string memory to, string memory from, bool foo) public payable isParts(to) isParts(from) {
        /*Questa è una delle funzioni più importanti perché permette di effettuare due tipi di transazioni:
          - Quelle che sono effettivamente con il soldi da inviare all'utente di partenza
          - Quelle che servono per generare confunsione
          si ha un msg.sender

        uint indexTo = findMapIndex(to);
        uint indexFrom = findMapIndex(from);
        if (foo) {
            address(this).transfer(msg.value);
            contractAmount.add(msg.value);
            participants[indexFrom].mixableAmount.sub(msg.value);
            participants[indexTo].mixableAmount.add(msg.value);

          //  contractAmount += msg.value;
          //  participants[indexFrom].mixableAmount -= msg.value;
          //  participants[indexFrom].mixableAmount -= msg.value;
            // siccome non posso prendere in nessun modo l'address del destinatario
            // devo passare per il contratto, un'operazione in più che rende più fitto il grafo
            participants[indexTo].mixableAmount += msg.value;
        }else {
            address(this).transfer(msg.value);
            contractAmount.add(msg.value);
            participants[indexTo].originalAmount.add(msg.value);
            participants[indexFrom].originalAmount.sub(msg.value);

            contractAmount += msg.value;
            participants[indexTo].originalAmount += msg.value;
            participants[indexFrom].originalAmount -= msg.value;
        }
    }
*/
    function withdraw(string memory sender) public payable isParts(sender) {
      /*
         Con la funzione transaction() si depositano da dei soldi nel contratto
         Bisogna tenere conto che nel client avrò una coppia di valori (idFrom, idTo)
         Dovrò quindi effettuare la seguente chiamata: contract.methods.withdraw().send( {from: idTo} )
      */
        contractAmount -= address(this).balance;
        msg.sender.transfer(address(this).balance);
    }

    function withdrawEther(string memory to, uint partition) public payable isParts(to) {
        /*Funzione che prende un intero che servirà per partizionare l'ammontare da dividere */
        // etherToMix - partition, naturalmente si deve controllare che partition <= etherToMix
        msg.sender.transfer(partition);
        etherToMix = etherToMix - partition;
    }

    function updateClientPart(string memory id) public view isParts(id) returns(uint, uint, bool) {
      /* Funzione che viene utilizzata dal client per aggiornare la copia dei partecipanti che possiede
        NB: isWaterWell in questo momento non viene mai cambiato a runtime, ma potrebbe cambiare tra una FASE
        di mix e un'altra
        NB1: quello che viene ritornato a livello di js è un oggetto simile a questo: {'0':'1','1':'123'}
      */
        uint index = findMapIndex(id);
        return ( participants[index].originalAmount,
                participants[index].mixableAmount,
                participants[index].isWaterWell);
    }

    function randomIt(uint min, uint max) public returns(uint) {
    /*Funzione molto utile per generare random un insieme di numeri fra min e max*/
        incremental++;
        return uint(keccak256(abi.encode(incremental)))%(min+max)-min;
    }


    function getUserId(uint index) public view onlyOwner returns(string memory) {
      /*TODO: impostare onlyOwner*/
        return idParts[index];
    }

    function getOriginalAmount(uint index) public view returns(uint) {
      /*TODO: impostare onlyOwner*/
        return originalAmountParts[index];
    }

    function getMixableAmount(uint index) public view returns(uint) {
      /*TODO: impostare onlyOwner*/
        return mixableAmountParts[index];
    }

    function getIsWaterWell(uint index) public view returns(bool) {
      /*TODO: impostare onlyOwner*/
        return isWaterWellParts[index];
    }

    function isAParticipant(string memory toVerify) internal view returns(bool) {
      /*Per verificare se un indirzzo fa parte del gruppo dei partecipanti*/
        bool result;
        for (uint i=0; i < mapIndex; i++) {
            if (stringEquals(participants[i].id, toVerify)) {
                result = true;
            }
        }
        return result;
    }

    function stringEquals(string memory stringA, string memory stringB) internal pure returns(bool) {
        return keccak256(abi.encodePacked((stringA))) == keccak256(abi.encodePacked((stringB)));
    }

    function findMapIndex(string memory id) internal view returns(uint) {
        uint result = 0;
        while (stringEquals(id, participants[result].id)) {
            result++;
        }
        return result;
    }

    function toString(address x) internal pure returns(string memory) {
        bytes memory b = new bytes(20);
        for (uint i = 0; i < 20; i++) {
            b[i] = byte(uint8(uint(x) / (2**(8*(19 - i)))));
        }
        return string(b);
    }

    function setParticipants() internal {
        for (uint i=0; i < mapIndex-1; i++) {
            participants[i] = Participant(idParts[i], 100000000000000000000, 0, false);
        }
        participants[mapIndex-1] = Participant(idParts[mapIndex-1], 100000000000000000000, 0, true);
    }

    function fetchUsersData() private {
      /*TODO: impostare onlyOwner
      Imposta tutto quello che serve per costruire i partecipanti
      */
        for (uint i=0; i < mapIndex; i++) {
            // idParts[mapIndex] = participants[mapIndex].id;
            originalAmountParts[mapIndex] = participants[mapIndex].originalAmount;
            mixableAmountParts[mapIndex] = participants[mapIndex].mixableAmount;
            isWaterWellParts[mapIndex] = participants[mapIndex].isWaterWell;
        }
    }
}//
