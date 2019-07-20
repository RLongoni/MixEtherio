import React, { Component, Fragment } from "react";
import { makeStyles } from '@material-ui/core/styles';
import MixEtherioContract from "../contracts/MixEtherio.json";
import Web3 from "web3";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

class MixingManager extends Component {
  state = {   web3: null,
              accounts: null,
              contract: null,
              IdParts: [
                '0x51D2fbdA43ADb52EaE5ed38FEc5e77e1f4A340FD', // utente 
                '0x826dA49a4F9b35287Fd73f9169d6AcB77CbD997f',
                '0x86865ffb823e6A3b123Ad4dE4d3DE0A7b7260aBb',
                '0xa7a4B77c20a740dE60d88eFd2E67684c5C2531CC',
                '0xe6136DB69AA296B434DA3c143BF7dB71EB6A6d0a',
                '0x0C1A585E243e0738D9c1E41daAf4b5c7b17f5c42'
              ],
              isWaterWellParts: [true, false, false, false, false, false],
              fromNode: {
                id: '',
                originalAmount: 0, // 10 * 10^18
                mixableAmount: 0,
                isWaterWell: false,
              },
              toNode: {
                id: '',
                originalAmount: 0, // 10 * 10^18
                mixableAmount: 0,
                isWaterWell: false,
              },
              transactions: [], //array di array [[from, to, isFake]]
          }
  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      /// const web3 = await getWeb3();
      /// Per attaccarsi a ganache del desktop
      const web3 = new Web3("http://127.0.0.1:7545" || Web3.givenProvider);
      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      const user = accounts[0]; // si può anche impostare con
      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = MixEtherioContract.networks[networkId];
      const instance = new web3.eth.Contract(
        MixEtherioContract.abi,
        deployedNetwork && deployedNetwork.address,
      ); // Qui prende il contratto e tutti i suoi metodi/attributi publici

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance}, this.beginMixing);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };
  beginMixing = async () => {
      // this.startMixing();
  }

  startMixing = async () => {
    /* Progetto:
      - Definizione Grafo G=<V,E>
        V è un sottoinsieme di accounts dim(V) <= n
        E = è un sottoinsieme di VxV - {(a,a), (b,b), (c,c), ...} dim(E) = n^2

        V lo si può definire anche come l'insieme dei partecipanti del MixEr
        quindi si può personalizzare il tipo di Archi.

        C'è una condizione da rispettare ... che ci sia almeno un nodo di V pozzo.
    */
    //PARTE1:  Inizializzazione degli account changers
    const { accounts, contract } = this.state;
    this.setState({
                  IdParts: [ ...this.state.IdParts,
                             ...accounts.slice(1)
                           ],
                  isWaterWellParts: [ ... this.state.isWaterWellParts,
                                      [false, false, true]
                                    ]
    });
    console.log("Id delle parti");
    console.log(this.state.IdParts);
    console.log("Array di booleani che indica quali sono i nodi pozzo");
    console.log(this.state.isWaterWellParts);
    const nodes = accounts.slice(1); // questi saranno i partecipanti
    const isWaterWell = [false, false, true];
    const user = accounts[0];
    const mixerOwner = accounts[0];
    const lastElement = nodes.length-1;
    /*FASE1: Inserimento nello smartContract dei partecipanti*/
    for(let i=0;i<=nodes.length-2;i++){
      // Attualmente questo è l'unico modo per inviare i dati allo smartContract
      contract.methods
              .addParticipant(nodes[i], isWaterWell[i], i)
              .send({ from: mixerOwner });
    }
    // per convenzione ho messo che l'ultimo elemento è un nodo pozzo
    contract.methods
            .addParticipant(nodes[lastElement],
                            isWaterWell[lastElement],
                            lastElement)
            .send({ from: mixerOwner });
    /*Fase2: Costruzione lato dapp delle transazioni fake e true*/

  };

  buildTransactions = () => {
    const { accounts, contract } = this.state;
    let Transaction = {
      from: '',
      to: '',
      amount: 0,
    }
    let transactionsNum = 10; // può essere generato casualmente purchè non superi |VxV|
    let transactions = [];
    let rdnNum1 = 0;
    let rdnNum2 = 0;
    for(; transactionsNum>0;transactionsNum--){
      rdnNum1 = this.randomInt(6);
      rdnNum2 = this.randomInt(6);
        while (rdnNum1 === rdnNum2) {
          rdnNum1 = this.randomInt(6);
          rdnNum2 = this.randomInt(6);
        }
        let condition1 = this.state.isWaterWellParts[rdnNum1]
                         && !this.state.isWaterWellParts[rdnNum2];
        let condition2 = this.state.isWaterWellParts[rdnNum2]
                         && !this.state.isWaterWellParts[rdnNum1];
        if(condition1){
          transactions.push({
            from: this.state.IdParts[rdnNum2],
            to: this.state.IdParts[rdnNum1],
            amount: 1,
          });
        }else if(condition2){
          transactions.push({
            from: this.state.IdParts[rdnNum1],
            to: this.state.IdParts[rdnNum2],
            amount: 1,
          });
        }else {
            (rdnNum1 > rdnNum2)
            ? (transactions.push({ from: this.state.IdParts[rdnNum1],
                                   to: this.state.IdParts[rdnNum2],
                                   amount: 1,
                                }))
            : (transactions.push({ from: this.state.IdParts[rdnNum2],
                                   to: this.state.IdParts[rdnNum1],
                                   amount: 1,
                                }));
    }
  }
  console.log(transactions);
}

randomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
}


  howMuchToImport = (address, index) => {
    return (this.state.IdParts[index] === address)
    ? (this.state.MixableAmountParts[index])
    : console.log(' address che non coincidono ');
  }

  handleClick = () => {
      this.startMixing();
  }

  render () {
      const classes = {
        card: {
          minWidth: 275,
        },
        bullet: {
          display: 'inline-block',
          margin: '0 2px',
          transform: 'scale(0.8)',
        },
        title: {
          fontSize: 14,
        },
        pos: {
          marginBottom: 12,
        },
      };
      const bull = <span className={classes.bullet}>•</span>;
      return (
        <Card className={classes.card}>
          <div>
            <Button size="medium" color="secondary">Annulla Mixing</Button>
            <Button size="medium" color="primary" onClick={this.buildTransactions}>Inizia Mixing</Button>
          </div>

        </Card>
      );
  }
}

export default MixingManager;
