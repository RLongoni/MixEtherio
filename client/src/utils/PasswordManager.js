import { InputAdornment, withStyles } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import { RemoveRedEye } from '@material-ui/icons';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Web3 from "web3";
import MixEtherioContract from "../contracts/MixEtherio.json";
import Button from '@material-ui/core/Button';

const styles = theme => ({
  eye: {
    cursor: 'pointer',
  },
});
/*PROBLEMA!!!
Vengono
*/
class PasswordManager extends Component {
  state = {
      passwordIsMasked: true,
      psw1: null,
      psw2: null,
      isImported: false,
  };
    componentDidMount = async () => {
      try {
        const web3 = new Web3("http://127.0.0.1:7545" || Web3.givenProvider);
        const accounts = await web3.eth.getAccounts();
        const user = accounts[0];
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = MixEtherioContract.networks[networkId];
        const instance = new web3.eth.Contract(
          MixEtherioContract.abi,
          deployedNetwork && deployedNetwork.address,
        );
        this.setState({ web3, accounts, contract: instance}, this.startMixing);
      } catch (error) {
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`,
        );
        console.error(error);
      }
    };

  togglePasswordMask = () => {
    this.setState(prevState => ({
      passwordIsMasked: !prevState.passwordIsMasked,
    }));
  };

  importKey = () => {
    const { accounts, contract } = this.state;
    const keccak256 = require('keccak256');
    let password1 = this.state.psw1;
    let password2 = this.state.psw2;

    if(this.isMatching(password1,password2)){
        let hashedKey = keccak256(this.state.psw1).toString('hex');
        hashedKey = this.state.psw1;
        contract.methods.deployTheKey(hashedKey).send( { from: accounts[0] } );
        this.setState({ psw1:'', psw2:''}); // Elimino le password dalla Dapp
        this.setState({isImported: this.state.psw1 === this.state.psw2});
    }else{
        console.log("Le Password non coincidono");
    }
  }

  handleInputPassword = (event) => {
    let valore = event.target.value;
    (event.target.id === 'Password1')
    ? (this.setState({psw1:  event.target.value.toString()}))
    : (this.setState({psw2:  event.target.value.toString()}))

  }

  isMatching = (psw1, psw2) => {
    return psw1 === psw2;
  }

  render() {
    const { classes } = this.props;
    const { passwordIsMasked } = this.state;

    return (
      (this.state.isImported)
      ? (<div>Le Password Coincidono! Passa alla fase successiva</div>)
      :(<div>
        <div>
          <TextField
            id="Password1"
            type={passwordIsMasked ? 'password' : 'text'}
            onInput={this.handleInputPassword}
            {...this.props}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <RemoveRedEye
                    className={classes.eye}
                    onClick={this.togglePasswordMask}
                    />
                </InputAdornment>
              ),
            }}
            />
        </div>
          <div>
            <TextField
              id="Password2"
              type={passwordIsMasked ? 'password' : 'text'}
              onInput={this.handleInputPassword}
              {...this.props}
              />
          </div>
          {(this.props.showbutton && !this.state.isImported)
            ? (<Button variant="contained"
                  color="secondary"
                  onClick={this.importKey}
                  margin="normal"
                  style={{top: '15px',left: '11px'}}
                >
                  Registra Password
               </Button>)
            : (<div></div>)
          }
          </div>)
    );
  }
}

PasswordManager.propTypes = {
  classes: PropTypes.object.isRequired,
};

PasswordManager = withStyles(styles)(PasswordManager);
export default withStyles(styles)(PasswordManager);
