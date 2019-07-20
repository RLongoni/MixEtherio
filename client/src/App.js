import React, { Component, Fragment } from "react";
import MixEtherioContract from "./contracts/MixEtherio.json";
import Web3 from "web3";
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
// import MaterialStepper from './utils/MaterialStepper.js';
import "./App.css";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import Typography from '@material-ui/core/Typography';
import AmountManager from './utils/AmountManager.js';
import PasswordManager from './utils/PasswordManager.js';
import MixingManager from './utils/MixingManager.js';
import ethereumLogo from './ethereumLogo.svg';
/*TODO:
FASE 1:
  - Non si deve permettere che l'utente imposti come password ''
  - Ammettere solo password alfanumeriche

IDEA FINALE:
Dato che sarebbe un costo computazionale considerevole, faccio costruire al client l'isnieme dei nodi del Mixer e le loro transazioni.
perché: 1- Una volta chiuso il client il pattern degli archi non esiste più se non mischiato a tutte le transazioni sulla rete.
        2- Più semplice
        3- La verifica dei partecipanti avviene tramite un check fatto sullo smartContract che ha al suo interno i partecipanti
*/

/*TODO: RIPRENDERE A FARE IL COMPONENTE CHE PERMETTE IL MIXING*/
// let activeParts = [];
const styles = theme => ({
  root: {
    width: '100%',
  },
  button: {
    marginRight: theme.spacing.unit,
  },
  completed: {
    display: 'inline-block',
  },
  instructions: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  }
});

function getSteps() {
  return ['Immetti una Password', 'Inserisci un ammontare', 'Inizia Mixing'];
}

function getStepContent(step) {
  switch (step) {
    case 0:
      return 'Step 1: Immetti una password che ti verrà richiesta alla fine del mixing per ritirare i tuoi soldi';
    case 1:
      return 'Step 2: Inserimento della quantità di ether da mixare e dove mandarli a fine processo';
    case 2:
      return 'Step 3: Riepilogo della transazione e start Mixing!';
    default:
      return 'Unknown step';
  }
}

class App extends Component {
  state = { storageValue: 0,
            web3: null,
            accounts: null,
            contract: null,
            activeStep: 0,
            completed: {},
            isDoneStep1: false,
            psw1: '',
            psw2: '',
            isMatching: false,
            amount: 0,
            isReady1: false,
            isReady2: false,
            IdParts: [], // array di stringhe
            OriginalAmountParts: [], // array di interi
            MixableAmountParts: [], // array di interactin
            isWaterWellParts: [], // array di bools
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
            transactions: [],
          };
/*
  constructor(props) {
    super(props); p
  }
*/
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
      this.setState({ web3, accounts, contract: instance});//, this.startMixing);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

//  startMixing = () => {
//    /* Progetto:
//      - Definizione Grafo G=<V,E>
//        V è un sottoinsieme di accounts dim(V) <= n
//        E = è un sottoinsieme di VxV - {(a,a), (b,b), (c,c), ...} dim(E) = n^2
//
//        V lo si può definire anche come l'insieme dei partecipanti del MixEr
//        quindi si può personalizzare il tipo di Archi.
//
//        C'è una condizione da rispettare ... che ci sia almeno un nodo di V pozzo.
//    */
//    //PARTE1:  Inizializzazione degli account changers
//    const { accounts, contract } = this.state;
//    const nodes = accounts.slice(1); // questi saranno i partecipanti
//
//     for(let i=0;i<=nodes.length-1;i++){
//       // Attualmente questo è l'unico modo per inviare i dati allo smartContract
//       contract.methods.addParticipant(nodes[i],i);
//     }
//  };
//
//  pushActiveParts() {
//    const { accounts, contract } = this.state;
//    const nodes = accounts.slice(1);
//    contract.methods.setParticipants(nodes).send({ from:accounts[0] });
//  }
//
//  fetchActiveParts(nodes) {
//    /*TODO: In questo momento è un metodo statico.
//      si dovrà poi utilizzare il db mandato sulla blockchain.
//      FORSE DA CANCELLARE
//    */
//    let activeParts = [];
//    let i = 0;
//    for(; i <= nodes.length-1; i++){
//      activeParts.push({
//        id: nodes[i],
//        originalAmount: 100000000000000000000, // 10 * 10^18
//        mixableAmount: 0,
//        isWaterWell: false,
//      });
//    }
//    activeParts[activeParts.length-1] = {
//      id: nodes[activeParts.length-1],
//      originalAmount: 100000000000000000000, // 10 * 10^18
//      mixableAmount: 0,
//      isWaterWell: true,
//    }
//    // console.log(activeParts);
//    // this.setState( { parts: activeParts} );
//    // console.log(this.state.parts);
//    return activeParts;
//  };
//  generateTransactions(typeOfTransaction, activeParts) {
//    const { accounts, contract } = this.state;
//    let rdnNum1 = contract.methods.randomIt(0,6);
//    let rdnNum2 = contract.methods.randomIt(0,6);
//    let numberOfTransactions = 8; // può essere generato casualmente purché non superi |VxV|
//    let Transactions = [] // transaction = {from:'', to:''}
//    for(; numberOfTransactions > 0; numberOfTransactions--){
//        while (rdnNum1 === rdnNum2) {
//          rdnNum1 = contract.methods.randomIt(0, 6);
//          rdnNum2 = contract.methods.randomIt(0, 6);
//        }
//    }
//};
//
//  insertTransaction(rdnNum1, rdnNum2, index, typeOfTransaction) {
//    const firstPart = this.state.fromNode.isWaterWell;
//    const secondPart = this.state.toNode.isWaterWell;
//    let fromNode = null;
//    let toNode = null;
//    if(firstPart && !secondPart){
//        // (typeOfTransaction) ? (fromNode =
//    }else if(!firstPart && secondPart){
//
//    }else{
//
//    }
//
//  };
//    /* typeOfTransaction: è una variabile booleana
//       activeParts: è un array di oggetti
//    */
//    /* Questa è una funzione molto imporntate in quanto genera un sottoinsieme di VxV t.c. non ci siano cappi e compaiano altri nodi
//        pozzo per creare ancora più confusione.
//    */
//    //function insertTransaction(uint rdnNum1, uint rdnNum2, bool _transaction, uint i) public onlyOwner {
//    //    if (participants[rdnNum1].isWaterWell && !participants[rdnNum2].isWaterWell) {
//    //        (_transaction) ? mixingTransactions[i] = Transaction(participants[rdnNum2].id, participants[rdnNum1].id)
//    //                    : fakeTransactions[i] = Transaction(participants[rdnNum2].id, participants[rdnNum1].id);
//    //    }else if (participants[rdnNum2].isWaterWell && !participants[rdnNum1].isWaterWell) {
//    //        (_transaction) ? mixingTransactions[i] = Transaction(participants[rdnNum2].id, participants[rdnNum1].id)
//    //                        : fakeTransactions[i] = Transaction(participants[rdnNum1].id, participants[rdnNum2].id);
//    //    }else {
//    //        if (rdnNum1 > rdnNum2) {
//    //            (_transaction)
//    //            ? mixingTransactions[i] = Transaction(participants[rdnNum2].id, participants[rdnNum1].id)
//    //            : fakeTransactions[i] = Transaction(participants[rdnNum1].id, participants[rdnNum2].id);
//    //        }else {
//    //            (_transaction) ? mixingTransactions[i] = Transaction(participants[rdnNum2].id, participants[rdnNum1].id)
//    //                            : fakeTransactions[i] = Transaction(participants[rdnNum2].id, participants[rdnNum1].id);
//    //        }
//    //    }
//    //}
//    //function generateTransactions(bool _transaction) public onlyOwner {
//    //    uint rdnNum1 = randomIt(0, 10);
//    //    uint rdnNum2 = randomIt(0, 10);
//    //    for (uint i=randomNumber; i >= 0; i--) {
//    //        while (rdnNum1 == rdnNum2) {
//    //            rdnNum1 = randomIt(0, 10);
//    //            rdnNum2 = randomIt(0, 10);
//    //        }
//    //        insertTransaction(rdnNum1, rdnNum2, _transaction, i);
//    //    }
//    //}
//
//  beginTheMixing () {
//    /*Suppongo di aver risolto il problema nella funzione generateTransactions*/
//      const { accounts, contract } = this.state;
//  }
//*/
  handleClick = () => {
    let number = 1 + parseInt(this.state.storageValue);
    this.setState({storageValue: number});
    /* UTILE PER CAPIRE:
      this.state = stato del componente
      contract = oggetto che ha al suo interno methods che sono i medoti del mitico contratto
      .send dovrebbe dire esattamente chi deve essere a chiamare la funzione del contratto
    */
    this.state
        .contract
        .methods
        .set(this.state.storageValue)
        .send({ from: this.state.accounts[1]});
  };
  /*FUNZIONI DEL COMPONENTE */
  totalSteps = () => getSteps().length;

  handleNext = () => {
    let activeStep;

    if (this.isLastStep() && !this.allStepsCompleted()) {
      // It's the last step, but not all steps have been completed,
      // find the first step that has been completed
      const steps = getSteps();
      activeStep = steps.findIndex((step, i) => !(i in this.state.completed));
    }else{
      activeStep = this.state.activeStep + 1;
    }
    this.setState({
      activeStep,
    });
  };

  handleBack = () => {
    this.setState(state => ({
      activeStep: state.activeStep - 1,
    }));
  };

  handleStep = step => () => {
    this.setState({
      activeStep: step,
    });
  };

  handleComplete = () => {
    const { completed } = this.state;
    const { accounts, contract } = this.state;
    completed[this.state.activeStep] = true;
    this.setState({
      completed,
      isDoneStep1: true,
    });
    this.handleNext();
  };

  handleReset = () => {
    this.setState({
      activeStep: 0,
      completed: {},
    });
  };

  handleInputText = (event) => {
    let amount = 0;
    if(this.state.activeStep === 1){
       !isNaN(parseInt(event.target.value))
       ? (amount = parseInt(event.target.value))
       : (console.log("hai Sbagliato")) // TODO: Far partire un Dialog
       amount = parseInt(event.target.value);
    }
  }

  isMatching = (psw1, psw2) => {
    if(psw1 === psw2)
      return true;
    return false;
  }

  completedSteps() {
    return Object.keys(this.state.completed).length;
  }

  isLastStep() {
    return this.state.activeStep === this.totalSteps() - 1;
  }

  allStepsCompleted() {
    return this.completedSteps() === this.totalSteps();
  }

  render() {
    const { classes } = this.props;
    const steps = getSteps();
    const { activeStep } = this.state;
    if (!this.state.web3) {
      return <div> <LinearProgress/> </div>;
    }
    return (
      <div className="App">
        <h1>
            <img src={ethereumLogo} alt="reactLogo" />{' '}
            MixΞtherio
            <img src={ethereumLogo} alt="reactLogo" />{' '}
        </h1>
        <h3>Account in uso: {this.state.accounts[1]}</h3>
          <div >
            <Stepper nonLinear activeStep={activeStep}>
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepButton onClick={this.handleStep(index)}
                              completed={this.state.completed[index]}
                  >
                    {label}
                  </StepButton>
                </Step>
              ))}
            </Stepper>
            <div>
              {this.allStepsCompleted() ? (
                <div>
                  <Typography>
                    All steps completed - you&apos;re finished
                  </Typography>
                  <Button onClick={this.handleReset}>Reset</Button>
                </div>
              ) : (
                <div>
                  <Typography >
                    {getStepContent(activeStep)}
                  </Typography>
                  <div>
                  {this.state.activeStep === 0 ? (
                      <PasswordManager name="password"
                                       showbutton="true"
                      />
                    ) : (<div></div>)
                  }
                  {this.state.activeStep === 1 ? (
                      <AmountManager/>
                    ) : (<div></div>)
                  }
                  </div>
                  <div>
                  {this.state.activeStep === 2
                    ? (<MixingManager/>)
                    : (<div></div>)
                  }
                  </div>
                  <div style={{paddingTop: '55px'}}>
                    <Button
                      disabled={activeStep === 0}
                      onClick={this.handleBack}
                    >
                      Back
                    </Button>
                    {activeStep !== steps.length &&
                      (this.state.completed[this.state.activeStep] ? (
                        <Typography variant="caption">
                          Step {activeStep + 1} already completed
                        </Typography>
                      ) : (
                        <Button variant="contained"
                                color="primary"
                                onClick={this.handleComplete}
                        >
                          {this.completedSteps() === this.totalSteps() - 1
                                                      ? 'StartMixing!'
                                                      : 'Prosegui'}
                        </Button>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
      </div>
    );
  }
}
App.propTypes = {
  classes: PropTypes.object,
};
export default App;
