import React, { Component, Fragment } from "react";
import ReactDOM from 'react-dom';
import Web3 from "web3";
import MixEtherioContract from "../contracts/MixEtherio.json";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
/*
  TODO:
  - Bisogna inserire un punsalte che permette il ritiro di ether nel caso in cui
    l'utente non volesse più mixare o avesse sbagliato importo.
  -
*/
const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
});

const currencies = [
  {
    value: 0,
    label: 'wei',
  },
  {
    value: 1,
    label: 'Gwei',
  },
  {
    value: 2,
    label: 'Finney',
  },
  {
    value: 3,
    label: 'Ether',
  },
];


class AmountManager extends React.Component {
  state = {
    web3: null,
    accounts: null,
    contract: null,
    name: 'hai',
    amountToSend: 0,
    currency: '',
    totalAmount: 0,
  };

    componentDidMount = async () => {
    try {
      /// Per attaccarsi a ganache del desktop
      const web3 = new Web3("http://127.0.0.1:7545" || Web3.givenProvider);
      const accounts = await web3.eth.getAccounts();
      const user = accounts[0];
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = MixEtherioContract.networks[networkId];
      const instance = new web3.eth.Contract(
        MixEtherioContract.abi,
        deployedNetwork && deployedNetwork.address,
      ); // Qui prende il contratto e tutti i suoi metodi/attributi publici

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance}, this.startMixing);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
    // this.setState({
    //   labelWidth: ReactDOM.findDOMNode(this.InputLabelRef).offsetWidth,
    // });
  }

  convertValue = () => {
    let result = 0;
    switch (this.state.currency) {
      case 0:
        return result = this.state.amountToSend;
      case 1:
        return result = 1000000000 * this.state.amountToSend;
      case 2:
        return result = 1000000000000000 * this.state.amountToSend;
      case 3:
        return result = 1000000000000000000 * this.state.amountToSend;
      default:
        return 0;
    }

  }

  handleChange = name => event => {
    this.setState({ currency: event.target.value });
  };

  importEtherToMix = async () => {
    const { accounts, contract } = this.state;
     await contract.methods
             .importAmount()
             .send( { from: accounts[0], value:1 } );
  }

  handleInputText = (event) => {
    if( !isNaN(parseInt(event.target.value)) ) {
        this.setState({amountToSend: parseInt(event.target.value)});
        this.setState({totalAmount: this.state.totalAmount + this.state.amountToSend,});
    }else {
      console.log("Inserimento di dati errato");
    }
  }

  sendAmount = () => {
    const { accounts, contract } = this.state;
    if(this.state.currency === '' || isNaN(parseInt(this.state.amountToSend))) {
      console.log("Non hai selezionato una Valuta o non hai inserito un valore");
    }else{
      let adjustedAmount = this.convertValue();
      this.setState({totalAmount: this.state.totalAmount + adjustedAmount});
      // console.log(this.state.totalAmount);
      contract.methods
              .importAmount()
              .send( { from: accounts[0], value:adjustedAmount } );
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <div autoComplete="off" style={{
    paddingLeft: '125px',
    height: '91px',
    paddingTop: '15px'

      }}
      >
        <div>
          <TextField type="classes.textField"
                placeholder="Valore in Ether da Mixare"
                style={{paddingBottom: '2px',
                        paddingTop : '1px',
                      }}
                onInput={this.handleInputText}
                margin="normal"
          />
          <TextField id="standard-select-currency"
                     select
                     className={classes.textField}
                     value={this.state.currency}
                     onChange={this.handleChange('currency')}
                     SelectProps={{
                       MenuProps: {
                         className: classes.menu,
                       },
                     }}
                     helperText="Valuta"
                     margin="normal"
                     style={{top: '1px',
                             left: '1px'
                            }}
          >
            {currencies.map(option => (
              <MenuItem key={option.value}
                        value={option.value}
                        margin=""
              >
                {option.label}
                </MenuItem>
              ))}
        </TextField>
          <Button variant="contained"
                  color="secondary"
                  onClick={this.sendAmount}
                  margin="normal"
                  style={{
                          top: '15px',
                          left: '11px'
                        }}
          >
            Invia Ether
          </Button>
          <div>
          </div>
          </div>
      </div>
    );
  }
}

AmountManager.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AmountManager);
